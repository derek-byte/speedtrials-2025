#!/usr/bin/env python3
"""
SDWIS Data Preprocessing Script (Improved Version)
Processes raw SDWIS CSV files into a single polished_data.csv for the dashboard
"""

import pandas as pd
import os
import sys
from datetime import datetime

# Import the Georgia locations module
try:
    from georgia_locations import get_coordinates
except ImportError:
    print("❌ Georgia locations module not found. Make sure georgia_locations.py is in the same directory.")
    sys.exit(1)

def load_csv_safe(filepath):
    """Safely load CSV file with error handling"""
    try:
        if not os.path.exists(filepath):
            print(f"❌ File not found: {filepath}")
            return None
        
        df = pd.read_csv(filepath, low_memory=False)
        print(f"✅ Loaded {len(df)} records from {os.path.basename(filepath)}")
        return df
    except Exception as e:
        print(f"❌ Error loading {filepath}: {e}")
        return None

def process_water_systems(df, quarter='2025Q1'):
    """Process core water systems data"""
    print(f"\n📊 Processing water systems for {quarter}...")
    
    # Filter for Georgia and specified quarter
    filtered = df[
        (df['SUBMISSIONYEARQUARTER'] == quarter) & 
        (df['STATE_CODE'] == 'GA') &
        (df['PWS_ACTIVITY_CODE'] == 'A')  # Active systems only
    ].copy()
    
    print(f"   Found {len(filtered)} active Georgia water systems")
    
    # Select and rename relevant columns
    systems = filtered[[
        'PWSID', 'PWS_NAME', 'PWS_TYPE_CODE', 'POPULATION_SERVED_COUNT',
        'OWNER_TYPE_CODE', 'PRIMARY_SOURCE_CODE', 'CITY_NAME', 'STATE_CODE'
    ]].copy()
    
    # Clean data
    systems['POPULATION_SERVED_COUNT'] = pd.to_numeric(systems['POPULATION_SERVED_COUNT'], errors='coerce').fillna(0)
    systems = systems.fillna('')
    
    return systems

def add_geographic_data(systems_df, geo_df, quarter='2025Q1'):
    """Add geographic information from SDWA_GEOGRAPHIC_AREAS"""
    print("\n🗺️  Adding geographic data...")
    
    if geo_df is None:
        print("   ⚠️  No geographic data available, using system city names")
        systems_df['city_served'] = systems_df['CITY_NAME']
        systems_df['county_served'] = ''
        systems_df['state_served'] = systems_df['STATE_CODE']
        return systems_df
    
    # Filter for the quarter
    geo_filtered = geo_df[geo_df['SUBMISSIONYEARQUARTER'] == quarter]
    
    # Get city data (CT = City Type)
    cities = geo_filtered[geo_filtered['AREA_TYPE_CODE'] == 'CT'][
        ['PWSID', 'CITY_SERVED', 'STATE_SERVED']
    ].drop_duplicates().groupby('PWSID').first().reset_index()
    
    # Get county data (CN = County)
    counties = geo_filtered[geo_filtered['AREA_TYPE_CODE'] == 'CN'][
        ['PWSID', 'COUNTY_SERVED']
    ].drop_duplicates().groupby('PWSID').first().reset_index()
    
    # Merge geographic data
    systems_df = systems_df.merge(cities, on='PWSID', how='left')
    systems_df = systems_df.merge(counties, on='PWSID', how='left')
    
    # Fill missing geographic data with system data
    systems_df['city_served'] = systems_df['CITY_SERVED'].fillna(systems_df['CITY_NAME'])
    systems_df['state_served'] = systems_df['STATE_SERVED'].fillna(systems_df['STATE_CODE'])
    systems_df['county_served'] = systems_df['COUNTY_SERVED'].fillna('')
    
    print(f"   ✅ Added geographic data for {len(systems_df)} systems")
    return systems_df

def add_violations_data(systems_df, violations_df, quarter='2025Q1'):
    """Add violations summary from SDWA_VIOLATIONS_ENFORCEMENT"""
    print("\n⚠️  Processing violations data...")
    
    if violations_df is None:
        print("   ⚠️  No violations data available, setting all violations to 0")
        systems_df['total_violations'] = 0
        systems_df['health_violations'] = 0
        systems_df['unaddressed_violations'] = 0
        return systems_df
    
    # Filter violations for the quarter
    viol_filtered = violations_df[violations_df['SUBMISSIONYEARQUARTER'] == quarter]
    
    # Calculate violation statistics per system
    viol_stats = viol_filtered.groupby('PWSID').agg({
        'VIOLATION_ID': 'count',
        'IS_HEALTH_BASED_IND': lambda x: (x == 'Y').sum(),
        'VIOLATION_STATUS': lambda x: (x.isin(['Open', 'Unaddressed'])).sum()
    }).rename(columns={
        'VIOLATION_ID': 'total_violations',
        'IS_HEALTH_BASED_IND': 'health_violations',
        'VIOLATION_STATUS': 'unaddressed_violations'
    }).reset_index()
    
    # Merge violations data
    systems_df = systems_df.merge(viol_stats, on='PWSID', how='left')
    
    # Fill NaN values with 0
    systems_df[['total_violations', 'health_violations', 'unaddressed_violations']] = \
        systems_df[['total_violations', 'health_violations', 'unaddressed_violations']].fillna(0).astype(int)
    
    violation_count = len(systems_df[systems_df['total_violations'] > 0])
    print(f"   ✅ Found violations for {violation_count} systems")
    
    return systems_df

def assign_coordinates(systems_df):
    """Assign coordinates using the external Georgia locations database"""
    print("\n📍 Assigning coordinates using comprehensive Georgia location database...")
    
    assigned_coords = 0
    unassigned_coords = 0
    
    def get_system_coordinates(row):
        nonlocal assigned_coords, unassigned_coords
        
        # Try to get coordinates using the imported function
        lat, lng, found = get_coordinates(
            city=row['city_served'],
            county=row['county_served'],
            fallback_city=row['CITY_NAME']
        )
        
        if found:
            assigned_coords += 1
            return pd.Series([lat, lng, True])
        else:
            unassigned_coords += 1
            return pd.Series([None, None, False])
    
    systems_df[['latitude', 'longitude', 'has_coordinates']] = systems_df.apply(get_system_coordinates, axis=1)
    
    print(f"   ✅ Assigned known coordinates to {assigned_coords} systems")
    print(f"   ❓ Found {unassigned_coords} systems with unknown coordinates")
    
    assignment_rate = (assigned_coords / (assigned_coords + unassigned_coords)) * 100
    print(f"   📊 Coordinate assignment rate: {assignment_rate:.1f}%")
    
    return systems_df

def calculate_risk_levels(systems_df):
    """Calculate risk levels based on violations"""
    print("\n🚨 Calculating risk levels...")
    
    def get_risk_level(row):
        health_violations = row['health_violations']
        unaddressed = row['unaddressed_violations']
        total_violations = row['total_violations']
        
        if health_violations > 0:
            return 'High', 'red'
        elif unaddressed > 0:
            return 'Medium', 'orange'
        elif total_violations > 0:
            return 'Low', 'yellow'
        else:
            return 'Good', 'green'
    
    systems_df[['risk_level', 'marker_color']] = systems_df.apply(
        lambda row: pd.Series(get_risk_level(row)), axis=1
    )
    
    risk_counts = systems_df['risk_level'].value_counts()
    print(f"   Risk distribution: {dict(risk_counts)}")
    
    return systems_df

def create_polished_data(systems_df):
    """Create final polished dataset with clean column names"""
    print("\n✨ Creating polished dataset...")
    
    # Build address
    def build_address(row):
        parts = []
        if row['city_served']:
            parts.append(row['city_served'])
        if row['county_served']:
            parts.append(f"{row['county_served']} County")
        if row['state_served']:
            parts.append(row['state_served'])
        return ", ".join(parts) if parts else "Georgia"
    
    systems_df['address'] = systems_df.apply(build_address, axis=1)
    
    # Select final columns for polished dataset
    polished = systems_df[[
        'PWSID', 'PWS_NAME', 'PWS_TYPE_CODE', 'POPULATION_SERVED_COUNT',
        'OWNER_TYPE_CODE', 'PRIMARY_SOURCE_CODE', 'address', 'latitude', 'longitude',
        'total_violations', 'health_violations', 'unaddressed_violations',
        'risk_level', 'marker_color', 'has_coordinates'
    ]].copy()
    
    # Rename columns to clean names
    polished.columns = [
        'pwsid', 'name', 'type', 'population', 'owner_type', 'primary_source',
        'address', 'lat', 'lng', 'total_violations', 'health_violations',
        'unaddressed_violations', 'risk_level', 'marker_color', 'has_coordinates'
    ]
    
    # Ensure data types
    polished['population'] = polished['population'].astype(int)
    polished['total_violations'] = polished['total_violations'].astype(int)
    polished['health_violations'] = polished['health_violations'].astype(int)
    polished['unaddressed_violations'] = polished['unaddressed_violations'].astype(int)
    polished['has_coordinates'] = polished['has_coordinates'].astype(bool)
    
    # Handle lat/lng - only convert to float if not null
    polished['lat'] = pd.to_numeric(polished['lat'], errors='coerce')
    polished['lng'] = pd.to_numeric(polished['lng'], errors='coerce')
    
    systems_with_coords = len(polished[polished['has_coordinates'] == True])
    systems_without_coords = len(polished[polished['has_coordinates'] == False])
    
    print(f"   ✅ Created polished dataset with {len(polished)} systems")
    print(f"   📍 {systems_with_coords} systems have coordinates (will show on map)")
    print(f"   ❓ {systems_without_coords} systems have unknown coordinates")
    
    return polished

def main():
    """Main processing function"""
    print("🚰 SDWIS Data Preprocessing Script (Improved Version)")
    print("=" * 60)
    
    # Configuration
    quarter = '2025Q1'
    data_dir = 'data'
    output_file = os.path.join(data_dir, 'polished_data.csv')
    
    print(f"📅 Processing quarter: {quarter}")
    print(f"📁 Data directory: {data_dir}")
    print(f"📄 Output file: {output_file}")
    
    # Check data directory
    if not os.path.exists(data_dir):
        print(f"❌ Data directory not found: {data_dir}")
        sys.exit(1)
    
    # Load raw data
    print(f"\n📥 Loading raw CSV files...")
    systems_df = load_csv_safe(os.path.join(data_dir, 'SDWA_PUB_WATER_SYSTEMS.csv'))
    geo_df = load_csv_safe(os.path.join(data_dir, 'SDWA_GEOGRAPHIC_AREAS.csv'))
    violations_df = load_csv_safe(os.path.join(data_dir, 'SDWA_VIOLATIONS_ENFORCEMENT.csv'))
    
    if systems_df is None:
        print("❌ Cannot proceed without water systems data")
        sys.exit(1)
    
    # Process data step by step
    systems_df = process_water_systems(systems_df, quarter)
    systems_df = add_geographic_data(systems_df, geo_df, quarter)
    systems_df = add_violations_data(systems_df, violations_df, quarter)
    systems_df = assign_coordinates(systems_df)
    systems_df = calculate_risk_levels(systems_df)
    polished_df = create_polished_data(systems_df)
    
    # Save polished data
    print(f"\n💾 Saving polished data to {output_file}...")
    polished_df.to_csv(output_file, index=False)
    
    # Summary
    print(f"\n📊 Processing Summary:")
    print(f"   • Total systems processed: {len(polished_df)}")
    print(f"   • Systems with violations: {len(polished_df[polished_df['total_violations'] > 0])}")
    print(f"   • High risk systems: {len(polished_df[polished_df['risk_level'] == 'High'])}")
    print(f"   • Systems with coordinates: {len(polished_df[polished_df['has_coordinates'] == True])} " + 
          f"({len(polished_df[polished_df['has_coordinates'] == True]) / len(polished_df) * 100:.1f}%)")
    print(f"   • Average population served: {polished_df['population'].mean():.0f}")
    print(f"   • Output file size: {os.path.getsize(output_file) / 1024:.1f} KB")
    
    print(f"\n✅ Data preprocessing complete!")
    print(f"🎯 Use 'polished_data.csv' in your backend for fast loading")

if __name__ == "__main__":
    main()