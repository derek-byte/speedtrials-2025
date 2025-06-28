from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
from dotenv import load_dotenv
from sdwis_pipeline import SDWISDataPipeline

load_dotenv()

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
GOOGLE_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

# Initialize SDWIS pipeline
pipeline = SDWISDataPipeline(DATA_DIR, GOOGLE_API_KEY)

# Cache for loaded dataframes
data_cache = {}
map_data_cache = None

def load_data(filename):
    """Load and cache CSV data using pandas"""
    if filename not in data_cache:
        csv_path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(csv_path):
            return None, f"File {filename} not found"
        
        try:
            df = pd.read_csv(csv_path, low_memory=False)
            data_cache[filename] = df
        except Exception as e:
            return None, str(e)
    
    return data_cache[filename], None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask backend is running"})

@app.route('/api/water-systems', methods=['GET'])
def get_water_systems():
    try:
        limit = int(request.args.get('limit', 50))
        df, error = load_data('SDWA_PUB_WATER_SYSTEMS.csv')
        
        if error:
            return jsonify({"error": error}), 404
        
        # Filter and process data
        filtered_df = df.head(limit)
        
        # Clean up data and handle NaN values
        systems = filtered_df.fillna('').to_dict('records')
        
        return jsonify({
            "total": len(df),
            "count": len(systems),
            "systems": systems
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/violations', methods=['GET'])
def get_violations():
    try:
        limit = int(request.args.get('limit', 50))
        df, error = load_data('SDWA_VIOLATIONS_ENFORCEMENT.csv')
        
        if error:
            return jsonify({"error": error}), 404
        
        filtered_df = df.head(limit)
        violations = filtered_df.fillna('').to_dict('records')
        
        return jsonify({
            "total": len(df),
            "count": len(violations),
            "violations": violations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/facilities', methods=['GET'])
def get_facilities():
    try:
        limit = int(request.args.get('limit', 50))
        df, error = load_data('SDWA_FACILITIES.csv')
        
        if error:
            return jsonify({"error": error}), 404
        
        filtered_df = df.head(limit)
        facilities = filtered_df.fillna('').to_dict('records')
        
        return jsonify({
            "total": len(df),
            "count": len(facilities),
            "facilities": facilities
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/violations', methods=['GET'])
def get_violation_stats():
    try:
        df, error = load_data('SDWA_VIOLATIONS_ENFORCEMENT.csv')
        
        if error:
            return jsonify({"error": error}), 404
        
        # Calculate statistics using pandas
        stats = {
            "total_violations": len(df),
            "violations_by_state": df.groupby('STATE_CODE').size().to_dict() if 'STATE_CODE' in df.columns else {},
            "violations_by_type": df.groupby('VIOLATION_TYPE_CODE').size().to_dict() if 'VIOLATION_TYPE_CODE' in df.columns else {},
            "recent_violations": len(df[df['COMPL_PER_BEGIN_DATE'].str.contains('2023|2024', na=False)]) if 'COMPL_PER_BEGIN_DATE' in df.columns else 0
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/water-systems', methods=['GET'])
def get_water_system_stats():
    try:
        df, error = load_data('SDWA_PUB_WATER_SYSTEMS.csv')
        
        if error:
            return jsonify({"error": error}), 404
        
        # Calculate statistics using pandas
        stats = {
            "total_systems": len(df),
            "systems_by_state": df.groupby('STATE_CODE').size().to_dict() if 'STATE_CODE' in df.columns else {},
            "systems_by_type": df.groupby('PWS_TYPE_CODE').size().to_dict() if 'PWS_TYPE_CODE' in df.columns else {},
            "population_served": df['POPULATION_SERVED_COUNT'].sum() if 'POPULATION_SERVED_COUNT' in df.columns else 0,
            "avg_population_per_system": df['POPULATION_SERVED_COUNT'].mean() if 'POPULATION_SERVED_COUNT' in df.columns else 0
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search/water-systems', methods=['GET'])
def search_water_systems():
    try:
        query = request.args.get('q', '').strip()
        state = request.args.get('state', '').strip()
        limit = int(request.args.get('limit', 50))
        
        df, error = load_data('SDWA_PUB_WATER_SYSTEMS.csv')
        
        if error:
            return jsonify({"error": error}), 404
        
        # Filter data using pandas
        filtered_df = df.copy()
        
        if query:
            # Search in system name and city
            mask = (
                df['PWS_NAME'].str.contains(query, case=False, na=False) |
                df['CITY_NAME'].str.contains(query, case=False, na=False)
            )
            filtered_df = filtered_df[mask]
        
        if state:
            filtered_df = filtered_df[filtered_df['STATE_CODE'] == state.upper()]
        
        # Get results
        results = filtered_df.head(limit).fillna('').to_dict('records')
        
        return jsonify({
            "total": len(filtered_df),
            "count": len(results),
            "query": query,
            "state": state,
            "systems": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/map-data', methods=['GET'])
def get_map_data():
    """Get processed map data using SDWIS pipeline"""
    global map_data_cache
    
    try:
        # Parameters
        quarter = request.args.get('quarter', '2023Q4')
        use_geocoding = request.args.get('geocoding', 'false').lower() == 'true'
        force_refresh = request.args.get('refresh', 'false').lower() == 'true'
        
        # Use cache unless forced refresh
        if map_data_cache is not None and not force_refresh:
            return jsonify({
                "total": len(map_data_cache),
                "systems": map_data_cache.to_dict('records'),
                "cached": True
            })
        
        # Process data using pipeline
        map_data = pipeline.process_full_pipeline(quarter, use_geocoding)
        
        if map_data.empty:
            # Fallback to mock data for demo if no real data processed
            mock_data = create_mock_georgia_data()
            map_data_cache = mock_data
            return jsonify({
                "total": len(mock_data),
                "systems": mock_data,
                "cached": False,
                "note": "Using mock data - no geocoding API key or data processing issues"
            })
        
        # Cache the results
        map_data_cache = map_data
        
        return jsonify({
            "total": len(map_data),
            "systems": map_data.to_dict('records'),
            "cached": False
        })
        
    except Exception as e:
        # Fallback to mock data on error
        mock_data = create_mock_georgia_data()
        return jsonify({
            "total": len(mock_data),
            "systems": mock_data,
            "error": str(e),
            "note": "Using mock data due to processing error"
        })

def create_mock_georgia_data():
    """Create mock data with real Georgia coordinates for demo"""
    georgia_cities = [
        {"name": "Atlanta Water System", "lat": 33.7490, "lng": -84.3880, "city": "Atlanta"},
        {"name": "Augusta Utilities", "lat": 33.4735, "lng": -82.0105, "city": "Augusta"},
        {"name": "Columbus Water Works", "lat": 32.4609, "lng": -84.9877, "city": "Columbus"},
        {"name": "Savannah Water & Sewer", "lat": 32.0835, "lng": -81.0998, "city": "Savannah"},
        {"name": "Athens-Clarke County", "lat": 33.9519, "lng": -83.3576, "city": "Athens"},
        {"name": "Sandy Springs Water", "lat": 33.9304, "lng": -84.3733, "city": "Sandy Springs"},
        {"name": "Roswell Water System", "lat": 34.0232, "lng": -84.3616, "city": "Roswell"},
        {"name": "Johns Creek Utilities", "lat": 34.0289, "lng": -84.1986, "city": "Johns Creek"},
        {"name": "Albany Water Board", "lat": 31.5785, "lng": -84.1557, "city": "Albany"},
        {"name": "Warner Robins Water", "lat": 32.6130, "lng": -83.6241, "city": "Warner Robins"}
    ]
    
    mock_systems = []
    for i, city_data in enumerate(georgia_cities):
        # Vary violation levels for demo
        if i % 4 == 0:
            risk_level, marker_color = "High", "red"
            health_violations, total_violations = 3, 5
        elif i % 3 == 0:
            risk_level, marker_color = "Medium", "orange"  
            health_violations, total_violations = 0, 2
        elif i % 2 == 0:
            risk_level, marker_color = "Low", "yellow"
            health_violations, total_violations = 0, 1
        else:
            risk_level, marker_color = "Good", "green"
            health_violations, total_violations = 0, 0
            
        mock_systems.append({
            "pwsid": f"GA{1000000 + i}",
            "name": city_data["name"],
            "type": "CWS",
            "population": 50000 + (i * 10000),
            "lat": city_data["lat"],
            "lng": city_data["lng"],
            "address": f"{city_data['city']}, GA",
            "marker_color": marker_color,
            "risk_level": risk_level,
            "total_violations": total_violations,
            "health_violations": health_violations,
            "unaddressed_violations": total_violations // 2
        })
    
    return mock_systems

@app.route('/api/process-data', methods=['POST'])
def process_data():
    """Force reprocess data with optional geocoding"""
    global map_data_cache
    
    try:
        data = request.get_json() or {}
        quarter = data.get('quarter', '2023Q4')
        use_geocoding = data.get('geocoding', False)
        
        # Clear cache
        map_data_cache = None
        
        # Process data
        map_data = pipeline.process_full_pipeline(quarter, use_geocoding)
        
        return jsonify({
            "status": "success",
            "processed": len(map_data),
            "geocoding_used": use_geocoding,
            "quarter": quarter
        })
        
    except Exception as e:
        return jsonify({
            "status": "error", 
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)