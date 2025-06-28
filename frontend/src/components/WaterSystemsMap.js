import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 33.7490,
  lng: -84.3880
}; // Atlanta, GA

const WaterSystemsMap = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // Use the new SDWIS pipeline endpoint
        const response = await axios.get('http://localhost:5000/api/map-data');
        
        const systemsData = response.data.systems.map(system => ({
          ...system,
          id: system.pwsid || system.id
        }));
        
        setSystems(systemsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch map data');
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (system) => {
    setSelectedSystem(system);
  };

  const handleInfoWindowClose = () => {
    setSelectedSystem(null);
  };

  if (loading) return <div className="p-4">Loading map...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Georgia Water Systems Map</h3>
      <div className="mb-4 text-sm text-gray-600">
        Showing {systems.length} water systems across Georgia
      </div>
      
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {systems.map((system) => (
            <Marker
              key={system.id}
              position={{ lat: system.lat, lng: system.lng }}
              onClick={() => handleMarkerClick(system)}
              title={system.name}
              icon={`http://maps.google.com/mapfiles/ms/icons/${system.marker_color}-dot.png`}
            />
          ))}
          
          {selectedSystem && (
            <InfoWindow
              position={{ lat: selectedSystem.lat, lng: selectedSystem.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-3">
                <h4 className="font-semibold text-lg mb-2">{selectedSystem.name}</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>PWS ID:</strong> {selectedSystem.pwsid}</p>
                  <p><strong>Location:</strong> {selectedSystem.address}</p>
                  <p><strong>Type:</strong> {selectedSystem.type}</p>
                  <p><strong>Population Served:</strong> {selectedSystem.population?.toLocaleString() || 'N/A'}</p>
                  <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                    selectedSystem.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                    selectedSystem.risk_level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                    selectedSystem.risk_level === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Risk Level: {selectedSystem.risk_level}
                  </div>
                  {selectedSystem.total_violations > 0 && (
                    <div className="mt-2 text-xs">
                      <p><strong>Total Violations:</strong> {selectedSystem.total_violations}</p>
                      <p><strong>Health-Based:</strong> {selectedSystem.health_violations}</p>
                      <p><strong>Unaddressed:</strong> {selectedSystem.unaddressed_violations}</p>
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default WaterSystemsMap;