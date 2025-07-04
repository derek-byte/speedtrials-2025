from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import os
import numpy as np
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Cache for polished data
map_data_cache = None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask backend is running"})

@app.route('/api/water-systems', methods=['GET'])
def get_water_systems():
    try:
        limit = int(request.args.get('limit', 50))
        
        # Load from polished data
        all_systems = load_polished_data()
        limited_systems = all_systems[:limit]
        
        return jsonify({
            "total": len(all_systems),
            "count": len(limited_systems),
            "systems": limited_systems,
            "data_source": "polished_sdwis"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/stats/water-systems', methods=['GET'])
def get_water_system_stats():
    try:
        systems = load_polished_data()
        
        # Calculate statistics from polished data (active systems only)
        total_pop = sum(s['population'] for s in systems)
        systems_by_type = {}
        systems_by_risk = {}
        
        # Use current_violations (unaddressed) for compliance calculations
        current_violations_total = sum(s.get('current_violations', s.get('unaddressed_violations', 0)) for s in systems)
        systems_with_current_violations = len([s for s in systems if s.get('current_violations', s.get('unaddressed_violations', 0)) > 0])
        
        for system in systems:
            # Count by type
            sys_type = system['type']
            systems_by_type[sys_type] = systems_by_type.get(sys_type, 0) + 1
            
            # Count by risk level (recalculated based on current violations)
            risk = system['risk_level']
            systems_by_risk[risk] = systems_by_risk.get(risk, 0) + 1
        
        stats = {
            "total_systems": len(systems),
            "systems_by_type": systems_by_type,
            "systems_by_risk": systems_by_risk,
            "population_served": total_pop,
            "avg_population_per_system": round(total_pop / len(systems)) if systems else 0,
            "total_violations": current_violations_total,  # Using current violations only
            "systems_with_violations": systems_with_current_violations,  # Using current violations only
            "compliance_note": "Statistics based on active systems and current (unaddressed) violations only",
            "data_source": "polished_sdwis_active_only"
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search/water-systems', methods=['GET'])
def search_water_systems():
    try:
        query = request.args.get('q', '').strip().lower()
        risk_level = request.args.get('risk', '').strip()
        limit = int(request.args.get('limit', 50))
        
        systems = load_polished_data()
        
        # Filter data
        filtered_systems = systems
        
        if query:
            # Search in system name and address
            filtered_systems = [
                s for s in filtered_systems 
                if query in s['name'].lower() or query in s['address'].lower()
            ]
        
        if risk_level:
            filtered_systems = [
                s for s in filtered_systems 
                if s['risk_level'].lower() == risk_level.lower()
            ]
        
        # Get results with limit
        results = filtered_systems[:limit]
        
        return jsonify({
            "total": len(filtered_systems),
            "count": len(results),
            "query": query,
            "risk_level": risk_level,
            "systems": results,
            "data_source": "polished_sdwis"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/map-data', methods=['GET'])
def get_map_data():
    """Get processed map data from polished_data.csv"""
    global map_data_cache
    
    try:
        # Parameters
        force_refresh = request.args.get('refresh', 'false').lower() == 'true'
        
        # Use cache unless forced refresh
        if map_data_cache is not None and not force_refresh:
            return jsonify({
                "total": len(map_data_cache),
                "systems": map_data_cache,
                "cached": True,
                "data_source": "polished_sdwis"
            })
        
        # Load processed data with coordinates only
        processed_data = load_systems_with_coordinates()
        
        # Cache the results
        map_data_cache = processed_data
        
        return jsonify({
            "total": len(processed_data),
            "systems": processed_data,
            "cached": False,
            "data_source": "polished_sdwis"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/unknown-locations', methods=['GET'])
def get_unknown_locations():
    """Get systems with unknown coordinates"""
    try:
        unknown_systems = load_unknown_location_systems()
        
        return jsonify({
            "total": len(unknown_systems),
            "systems": unknown_systems,
            "data_source": "polished_sdwis"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/comprehensive', methods=['GET'])
def get_comprehensive_stats():
    """Get comprehensive statistics including inactive systems and archived data"""
    try:
        # Load all data (including inactive systems)
        polished_path = os.path.join(DATA_DIR, 'polished_data.csv')
        if not os.path.exists(polished_path):
            raise Exception("polished_data.csv not found.")
        
        df = pd.read_csv(polished_path)
        df = df.replace({np.nan: None})
        
        # Separate active and inactive systems
        active_systems = df[df['is_active'] == True]
        inactive_systems = df[df['is_active'] == False]
        
        # Calculate comprehensive statistics
        stats = {
            "active_systems": {
                "count": len(active_systems),
                "with_current_violations": len(active_systems[active_systems['unaddressed_violations'] > 0]),
                "with_archived_violations": len(active_systems[active_systems['archived_violations'] > 0]),
                "population_served": int(active_systems['population'].sum())
            },
            "inactive_systems": {
                "count": len(inactive_systems),
                "total_violations": int(inactive_systems['total_violations'].sum()),
                "archived_violations": int(inactive_systems['archived_violations'].sum())
            },
            "compliance_summary": {
                "total_active_systems": len(active_systems),
                "compliant_systems": len(active_systems[active_systems['unaddressed_violations'] == 0]),
                "compliance_rate": round((len(active_systems[active_systems['unaddressed_violations'] == 0]) / len(active_systems)) * 100, 1) if len(active_systems) > 0 else 0,
                "systems_with_resolved_issues": len(active_systems[active_systems['archived_violations'] > 0])
            },
            "data_source": "comprehensive_polished_data"
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/export/polished-data', methods=['GET'])
def export_polished_data():
    """Download the polished_data.csv file"""
    try:
        polished_path = os.path.join(DATA_DIR, 'polished_data.csv')
        
        if not os.path.exists(polished_path):
            return jsonify({"error": "polished_data.csv not found. Please run preprocess_data.py first."}), 404
        
        return send_file(
            polished_path,
            as_attachment=True,
            download_name='georgia_water_systems_data.csv',
            mimetype='text/csv'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def load_polished_data():
    """Load preprocessed data from polished_data.csv, filtering for active systems only"""
    try:
        polished_path = os.path.join(DATA_DIR, 'polished_data.csv')
        
        if not os.path.exists(polished_path):
            raise Exception("polished_data.csv not found. Please run preprocess_data.py first.")
        
        df = pd.read_csv(polished_path)
        
        # Filter for active systems only
        df = df[df['is_active'] == True].copy()
        
        # Calculate adjusted violations (exclude archived/resolved violations from current counts)
        # For compliance purposes, only count unaddressed violations as "active" violations
        df['current_violations'] = df['unaddressed_violations']
        df['resolved_violations'] = df['archived_violations']
        
        # Recalculate risk level based on current (unaddressed) violations only
        def recalculate_risk(row):
            health_violations = row['health_violations']
            current_violations = row['current_violations']
            
            # Only count health violations that are still unaddressed
            active_health_violations = min(health_violations, current_violations)
            
            if active_health_violations > 0:
                return 'High', 'red'
            elif current_violations > 0:
                return 'Medium', 'orange'
            elif row['total_violations'] > row['current_violations']:
                # Has resolved violations but no current violations
                return 'Good', 'green'
            else:
                return 'Good', 'green'
        
        # Apply the recalculated risk levels
        risk_data = df.apply(lambda row: pd.Series(recalculate_risk(row)), axis=1)
        df['risk_level'] = risk_data[0]
        df['marker_color'] = risk_data[1]
        
        # Replace NaN values with None for JSON serialization
        df = df.replace({np.nan: None})
        
        # Convert to list of dictionaries for JSON serialization
        systems = df.to_dict('records')
        
        print(f"Loaded {len(systems)} active systems from polished_data.csv")
        return systems
        
    except Exception as e:
        print(f"Error loading polished data: {e}")
        raise e

def load_systems_with_coordinates():
    """Load only systems with known coordinates"""
    all_systems = load_polished_data()
    return [s for s in all_systems if s.get('has_coordinates') == True]

def load_unknown_location_systems():
    """Load only systems with unknown coordinates"""
    all_systems = load_polished_data()
    return [s for s in all_systems if s.get('has_coordinates') == False]






if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)