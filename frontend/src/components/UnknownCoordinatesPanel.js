import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UnknownCoordinatesPanel = ({ onSystemSelect }) => {
  const [unknownSystems, setUnknownSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchUnknownSystems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/unknown-locations');
        setUnknownSystems(response.data.systems);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch unknown location systems');
        setLoading(false);
      }
    };

    fetchUnknownSystems();
  }, []);

  const handleSystemClick = (system) => {
    if (onSystemSelect) {
      onSystemSelect(system);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-yellow-400';
      case 'good': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-gray-400">Loading unknown locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-white font-medium">Unknown Location Systems</h3>
          <p className="text-gray-400 text-sm">{unknownSystems.length} systems without coordinates</p>
        </div>
        <div className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-700">
          <div className="max-h-96 overflow-y-auto">
            {unknownSystems.map((system) => (
              <div
                key={system.pwsid}
                className="p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleSystemClick(system)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">{system.name}</h4>
                    <p className="text-gray-400 text-xs mt-1">{system.address}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="text-gray-400">Pop: {system.population?.toLocaleString() || 'N/A'}</span>
                      <span className="text-gray-400">Type: {system.type}</span>
                      <span className={getRiskColor(system.risk_level)}>
                        Risk: {system.risk_level || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xs text-gray-400">Violations</div>
                    <div className="text-sm text-white">{system.total_violations || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnknownCoordinatesPanel;