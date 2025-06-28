# Georgia Water Quality Dashboard - Setup Guide

## Architecture
- **Frontend**: React with Tailwind CSS (port 3000)
- **Backend**: Flask API (port 5000)
- **Data**: Georgia water quality CSV files

## Quick Start

### Option 1: Manual Start
1. **Start Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm start
   ```

### Option 2: Use Scripts
```bash
# Terminal 1
./start-backend.sh

# Terminal 2  
./start-frontend.sh
```

## API Endpoints
- `GET /api/health` - Backend health check
- `GET /api/water-systems` - Water systems data
- `GET /api/violations` - Violations data
- `GET /api/facilities` - Facilities data

## Features
- Real-time backend connection status
- Water systems data display
- Responsive design with Tailwind CSS
- CORS enabled for cross-origin requests

## Data Sources
The backend loads data from CSV files in the `data/` directory:
- `SDWA_PUB_WATER_SYSTEMS.csv`
- `SDWA_VIOLATIONS_ENFORCEMENT.csv`
- `SDWA_FACILITIES.csv`