import pandas as pd
import requests
import time
import os
from typing import Tuple, Optional, Dict, Any

class SDWISDataPipeline:
    def __init__(self, data_dir: str, google_api_key: Optional[str] = None):
        self.data_dir = data_dir
        self.google_api_key = google_api_key
        self.geocode_cache = {}
        
    def load_water_systems(self, quarter: str = "2023Q4") -> pd.DataFrame:
        """Load and filter core system data for active systems"""
        try:
            systems_path = os.path.join(self.data_dir, "SDWA_PUB_WATER_SYSTEMS.csv")
            systems = pd.read_csv(systems_path, low_memory=False)
            
            # Filter for latest available quarter and active systems
            available_quarters = systems['SUBMISSIONYEARQUARTER'].unique()
            if quarter not in available_quarters:
                # Use the most recent quarter available
                quarter = sorted(available_quarters)[-1] if len(available_quarters) > 0 else quarter
            
            filtered_systems = systems[
                (systems['SUBMISSIONYEARQUARTER'] == quarter)
            ]
            
            # Focus on Georgia systems if STATE_CODE exists
            if 'STATE_CODE' in filtered_systems.columns:
                filtered_systems = filtered_systems[filtered_systems['STATE_CODE'] == 'GA']
            
            return filtered_systems[['PWSID', 'PWS_NAME', 'PWS_TYPE_CODE', 
                                   'POPULATION_SERVED_COUNT', 'OWNER_TYPE_CODE', 
                                   'PRIMARY_SOURCE_CODE', 'STATE_CODE']].copy()
        except Exception as e:
            print(f"Error loading water systems: {e}")
            return pd.DataFrame()
    
    def add_geographic_data(self, systems: pd.DataFrame, quarter: str = "2023Q4") -> pd.DataFrame:
        """Add geographic information from SDWA_GEOGRAPHIC_AREAS.csv"""
        try:
            geo_path = os.path.join(self.data_dir, "SDWA_GEOGRAPHIC_AREAS.csv")
            geo_areas = pd.read_csv(geo_path, low_memory=False)
            
            # Filter for the same quarter
            geo_areas = geo_areas[geo_areas['SUBMISSIONYEARQUARTER'] == quarter]
            
            # Separate by area type - prioritize ZIP codes, then cities, then counties
            zip_areas = geo_areas[geo_areas['AREA_TYPE_CODE'] == 'ZC']
            city_areas = geo_areas[geo_areas['AREA_TYPE_CODE'] == 'CT']  
            county_areas = geo_areas[geo_areas['AREA_TYPE_CODE'] == 'CN']
            
            # Start with systems dataframe
            result = systems.copy()
            
            # Add ZIP code data first (most specific)
            if not zip_areas.empty:
                zip_data = zip_areas.groupby('PWSID').first()[['ZIP_CODE_SERVED', 'STATE_SERVED']].reset_index()
                result = result.merge(zip_data, on='PWSID', how='left')
            
            # Add city data for systems without ZIP codes
            if not city_areas.empty:
                city_data = city_areas.groupby('PWSID').first()[['CITY_SERVED', 'STATE_SERVED']].reset_index()
                city_data = city_data.rename(columns={'STATE_SERVED': 'STATE_SERVED_CITY'})
                result = result.merge(city_data, on='PWSID', how='left')
            
            # Add county data as fallback
            if not county_areas.empty:
                county_data = county_areas.groupby('PWSID').first()[['COUNTY_SERVED', 'STATE_SERVED']].reset_index()
                county_data = county_data.rename(columns={'STATE_SERVED': 'STATE_SERVED_COUNTY'})
                result = result.merge(county_data, on='PWSID', how='left')
            
            return result
            
        except Exception as e:
            print(f"Error adding geographic data: {e}")
            return systems
    
    def add_violation_summary(self, systems: pd.DataFrame, quarter: str = "2023Q4") -> pd.DataFrame:
        """Add violation summary data"""
        try:
            violations_path = os.path.join(self.data_dir, "SDWA_VIOLATIONS_ENFORCEMENT.csv")
            violations = pd.read_csv(violations_path, low_memory=False)
            
            # Filter for the same quarter  
            violations = violations[violations['SUBMISSIONYEARQUARTER'] == quarter]
            
            # Summarize violations per system
            viol_summary = violations.groupby('PWSID').agg({
                'VIOLATION_ID': 'count',
                'IS_HEALTH_BASED_IND': lambda x: (x == 'Y').sum(),
                'VIOLATION_STATUS': lambda x: (x == 'Unaddressed').sum()
            }).rename(columns={
                'VIOLATION_ID': 'total_violations',
                'IS_HEALTH_BASED_IND': 'health_violations', 
                'VIOLATION_STATUS': 'unaddressed_violations'
            }).reset_index()
            
            result = systems.merge(viol_summary, on='PWSID', how='left')
            result[['total_violations', 'health_violations', 'unaddressed_violations']] = result[['total_violations', 'health_violations', 'unaddressed_violations']].fillna(0)
            
            return result
            
        except Exception as e:
            print(f"Error adding violation data: {e}")
            # Add empty columns if violation data fails
            systems['total_violations'] = 0
            systems['health_violations'] = 0  
            systems['unaddressed_violations'] = 0
            return systems
    
    def geocode_location(self, address: str) -> Tuple[Optional[float], Optional[float]]:
        """Convert address to lat/lng using Google Geocoding API"""
        if not self.google_api_key:
            return None, None
            
        # Check cache first
        if address in self.geocode_cache:
            return self.geocode_cache[address]
        
        base_url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            'address': address,
            'key': self.google_api_key
        }
        
        try:
            response = requests.get(base_url, params=params)
            data = response.json()
            
            if data['status'] == 'OK' and len(data['results']) > 0:
                location = data['results'][0]['geometry']['location']
                lat, lng = location['lat'], location['lng']
                self.geocode_cache[address] = (lat, lng)
                return lat, lng
            else:
                self.geocode_cache[address] = (None, None)
                return None, None
        except Exception as e:
            print(f"Geocoding error for {address}: {e}")
            return None, None
    
    def create_map_ready_data(self, systems: pd.DataFrame, use_geocoding: bool = True) -> pd.DataFrame:
        """Create map-ready data with coordinates and risk levels"""
        map_data = []
        
        for idx, system in systems.iterrows():
            # Build address for geocoding
            address_parts = []
            
            # Priority order: ZIP > City > County
            if pd.notna(system.get('ZIP_CODE_SERVED')):
                address_parts.append(str(system['ZIP_CODE_SERVED']))
            elif pd.notna(system.get('CITY_SERVED')):
                address_parts.append(str(system['CITY_SERVED']))
            elif pd.notna(system.get('COUNTY_SERVED')):
                address_parts.append(f"{system['COUNTY_SERVED']} County")
            
            # Add state
            if pd.notna(system.get('STATE_SERVED')):
                address_parts.append(str(system['STATE_SERVED']))
            elif pd.notna(system.get('STATE_CODE')):
                address_parts.append(str(system['STATE_CODE']))
            
            if not address_parts:
                continue
                
            address = ", ".join(address_parts)
            
            # Get coordinates
            if use_geocoding and self.google_api_key:
                lat, lng = self.geocode_location(address)
                # Rate limiting for API calls
                time.sleep(0.1)
            else:
                lat, lng = None, None
            
            # If geocoding failed or disabled, skip this system for now
            if lat is None or lng is None:
                continue
            
            # Determine risk level and marker color based on violations
            health_violations = system.get('health_violations', 0)
            unaddressed = system.get('unaddressed_violations', 0)
            total_violations = system.get('total_violations', 0)
            
            if health_violations > 0:
                marker_color = 'red'
                risk_level = 'High'
            elif unaddressed > 0:
                marker_color = 'orange'
                risk_level = 'Medium'
            elif total_violations > 0:
                marker_color = 'yellow'
                risk_level = 'Low'
            else:
                marker_color = 'green'
                risk_level = 'Good'
            
            map_data.append({
                'pwsid': system['PWSID'],
                'name': system['PWS_NAME'],
                'type': system.get('PWS_TYPE_CODE', ''),
                'population': system.get('POPULATION_SERVED_COUNT', 0),
                'lat': lat,
                'lng': lng,
                'address': address,
                'marker_color': marker_color,
                'risk_level': risk_level,
                'total_violations': int(total_violations),
                'health_violations': int(health_violations),
                'unaddressed_violations': int(unaddressed)
            })
        
        return pd.DataFrame(map_data)
    
    def process_full_pipeline(self, quarter: str = "2023Q4", use_geocoding: bool = False) -> pd.DataFrame:
        """Run the full SDWIS pipeline"""
        print(f"Starting SDWIS pipeline for quarter {quarter}...")
        
        # Step 1: Load water systems
        systems = self.load_water_systems(quarter)
        print(f"Loaded {len(systems)} water systems")
        
        if systems.empty:
            return pd.DataFrame()
        
        # Step 2: Add geographic data
        systems = self.add_geographic_data(systems, quarter)
        print(f"Added geographic data")
        
        # Step 3: Add violation data
        systems = self.add_violation_summary(systems, quarter)
        print(f"Added violation data")
        
        # Step 4: Create map-ready data
        map_data = self.create_map_ready_data(systems, use_geocoding)
        print(f"Created {len(map_data)} map-ready records")
        
        return map_data