from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

def read_csv_data(filename, limit=50):
    """Read CSV data without pandas"""
    csv_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(csv_path):
        return None, f"File {filename} not found"
    
    try:
        data = []
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for i, row in enumerate(reader):
                if i >= limit:
                    break
                data.append(row)
        return data, None
    except Exception as e:
        return None, str(e)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask backend is running"})

@app.route('/api/water-systems', methods=['GET'])
def get_water_systems():
    try:
        limit = int(request.args.get('limit', 50))
        data, error = read_csv_data('SDWA_PUB_WATER_SYSTEMS.csv', limit)
        
        if error:
            return jsonify({"error": error}), 404
        
        return jsonify({
            "total": len(data),
            "systems": data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/violations', methods=['GET'])
def get_violations():
    try:
        limit = int(request.args.get('limit', 50))
        data, error = read_csv_data('SDWA_VIOLATIONS_ENFORCEMENT.csv', limit)
        
        if error:
            return jsonify({"error": error}), 404
        
        return jsonify({
            "total": len(data),
            "violations": data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/facilities', methods=['GET'])
def get_facilities():
    try:
        limit = int(request.args.get('limit', 50))
        data, error = read_csv_data('SDWA_FACILITIES.csv', limit)
        
        if error:
            return jsonify({"error": error}), 404
        
        return jsonify({
            "total": len(data),
            "facilities": data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)