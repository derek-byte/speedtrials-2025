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
  const [filteredSystems, setFilteredSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

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
        setFilteredSystems(systemsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch map data');
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  useEffect(() => {
    if (!activeFilter) {
      setFilteredSystems(systems);
    } else {
      const filtered = systems.filter(system => 
        system.risk_level?.toLowerCase() === activeFilter.toLowerCase()
      );
      setFilteredSystems(filtered);
    }
  }, [activeFilter, systems]);

  const handleRiskFilterClick = (riskLevel) => {
    if (activeFilter === riskLevel) {
      setActiveFilter(null); // Clear filter if clicking the same one
    } else {
      setActiveFilter(riskLevel);
    }
  };

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
        <div className="text-gray-400 text-xs">
          {filteredSystems.length} of {systems.length} locations
          {activeFilter && (
            <div className="text-blue-400 text-xs mt-1">
              Filtered: {activeFilter} Risk
            </div>
          )}
        </div>
      </div>

      {/* Interactive Risk Level Filter */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800 backdrop-blur-md rounded-xl border-2 border-gray-600 shadow-xl">
        <div className="p-4">
          <div 
            className="text-white text-sm font-medium mb-2 cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => setActiveFilter(null)}
            title={activeFilter ? "Click to reset filter" : "Risk Levels"}
            style={{ cursor: 'pointer' }}
          >
            Risk Levels
          </div>
          <div className="space-y-1 text-xs">
            <div 
              className={`flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-700/50 transition-all duration-200 select-none ${
                activeFilter === 'High' ? 'bg-red-500/20 border border-red-500/30' : ''
              }`}
              onClick={() => handleRiskFilterClick('High')}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-3 h-3 bg-red-400 rounded-full hover:scale-110 transition-transform duration-200"></div>
              <span className={`text-gray-300 hover:text-white transition-colors cursor-pointer ${
                activeFilter === 'High' ? 'text-white font-medium' : ''
              }`}>High Risk</span>
            </div>
            <div 
              className={`flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-700/50 transition-all duration-200 select-none ${
                activeFilter === 'Medium' ? 'bg-orange-500/20 border border-orange-500/30' : ''
              }`}
              onClick={() => handleRiskFilterClick('Medium')}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-3 h-3 bg-orange-400 rounded-full hover:scale-110 transition-transform duration-200"></div>
              <span className={`text-gray-300 hover:text-white transition-colors cursor-pointer ${
                activeFilter === 'Medium' ? 'text-white font-medium' : ''
              }`}>Medium Risk</span>
            </div>
            <div 
              className={`flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-700/50 transition-all duration-200 select-none ${
                activeFilter === 'Low' ? 'bg-yellow-500/20 border border-yellow-500/30' : ''
              }`}
              onClick={() => handleRiskFilterClick('Low')}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-3 h-3 bg-yellow-400 rounded-full hover:scale-110 transition-transform duration-200"></div>
              <span className={`text-gray-300 hover:text-white transition-colors cursor-pointer ${
                activeFilter === 'Low' ? 'text-white font-medium' : ''
              }`}>Low Risk</span>
            </div>
            <div 
              className={`flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-700/50 transition-all duration-200 select-none ${
                activeFilter === 'Good' ? 'bg-green-500/20 border border-green-500/30' : ''
              }`}
              onClick={() => handleRiskFilterClick('Good')}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full hover:scale-110 transition-transform duration-200"></div>
              <span className={`text-gray-300 hover:text-white transition-colors cursor-pointer ${
                activeFilter === 'Good' ? 'text-white font-medium' : ''
              }`}>Good</span>
            </div>
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
            gestureHandling: 'greedy',
            keyboardShortcuts: false,
            mapDataControl: false,
            clickableIcons: false,
            restriction: {
              strictBounds: false
            }
          }}
        >
          {filteredSystems.map((system) => (
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