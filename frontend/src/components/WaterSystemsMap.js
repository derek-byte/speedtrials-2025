import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const center = {
  lat: 33.7490,
  lng: -84.3880
}; // Atlanta, GA

const mapStyles = [
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [{"color": "#1f2937"}]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#9ca3af"}]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#111827"}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#374151"}]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{"color": "#111827"}]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{"color": "#1f2937"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{"color": "#374151"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{"color": "#4b5563"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#1e40af"}]
  }
];

const WaterSystemsMap = ({ onSystemSelect }) => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (onSystemSelect) {
      onSystemSelect(system);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">Loading map...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
        <div className="text-white text-sm font-medium mb-2">Water Systems</div>
        <div className="text-gray-400 text-xs">{systems.length} locations</div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
        <div className="text-white text-sm font-medium mb-2">Risk Levels</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-gray-300">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-gray-300">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-300">Low Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">Good</span>
          </div>
        </div>
      </div>
      
      <LoadScript 
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}
        libraries={['geometry']}
        preventGoogleFontsLoading={true}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            gestureHandling: 'greedy'
          }}
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
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default WaterSystemsMap;