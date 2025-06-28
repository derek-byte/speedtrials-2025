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
    const fetchWaterSystems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/water-systems?limit=100');
        // Filter systems with coordinate data and add mock coordinates for demo
        const systemsWithCoords = response.data.systems.map((system, index) => ({
          ...system,
          // Mock coordinates around Georgia for demo - in real app you'd geocode addresses
          lat: 33.7490 + (Math.random() - 0.5) * 3,
          lng: -84.3880 + (Math.random() - 0.5) * 4,
          id: system.PWSID || index
        })).filter(system => system.PWS_NAME); // Only show systems with names
        
        setSystems(systemsWithCoords);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch water systems data');
        setLoading(false);
      }
    };

    fetchWaterSystems();
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
          {systems.slice(0, 50).map((system) => (
            <Marker
              key={system.id}
              position={{ lat: system.lat, lng: system.lng }}
              onClick={() => handleMarkerClick(system)}
              title={system.PWS_NAME}
            />
          ))}
          
          {selectedSystem && (
            <InfoWindow
              position={{ lat: selectedSystem.lat, lng: selectedSystem.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2">
                <h4 className="font-semibold text-lg mb-2">{selectedSystem.PWS_NAME}</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>PWS ID:</strong> {selectedSystem.PWSID}</p>
                  <p><strong>City:</strong> {selectedSystem.CITY_NAME || 'N/A'}</p>
                  <p><strong>County:</strong> {selectedSystem.COUNTY_SERVED || 'N/A'}</p>
                  <p><strong>Population:</strong> {selectedSystem.POPULATION_SERVED_COUNT || 'N/A'}</p>
                  <p><strong>System Type:</strong> {selectedSystem.PWS_TYPE_CODE || 'N/A'}</p>
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