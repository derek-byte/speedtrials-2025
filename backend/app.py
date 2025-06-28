from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

# Cache for loaded dataframes
data_cache = {}

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)