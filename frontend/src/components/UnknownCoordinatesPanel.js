import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UnknownCoordinatesPanel = ({ onSystemSelect }) => {
  const [unknownSystems, setUnknownSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSystems, setFilteredSystems] = useState([]);

  useEffect(() => {
    const fetchUnknownSystems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/unknown-locations');
        setUnknownSystems(response.data.systems);
        setFilteredSystems(response.data.systems);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch unknown location systems');
        setLoading(false);
      }
    };

    fetchUnknownSystems();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSystems(unknownSystems);
    } else {
      const filtered = unknownSystems.filter(system => 
        system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.risk_level?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSystems(filtered);
    }
  }, [searchTerm, unknownSystems]);

  const handleSystemClick = (system) => {
    if (onSystemSelect) {
      onSystemSelect(system);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'low': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'good': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'good': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
          <span className="text-gray-300 font-medium">Loading unknown locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-gray-900 rounded-xl border border-red-500/30 p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-red-300 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-700/30 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-md shadow-amber-400/50"></div>
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
              <span>Unknown Location Systems</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">
                {unknownSystems.length}
              </span>
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Systems without geographic coordinates
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-gray-400 text-sm font-medium">
            {isExpanded ? 'Collapse' : 'Expand'}
          </div>
          <div className={`text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : 'rotate-0'
          }`}>
            ▶
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-700/50">
          {/* Search Bar */}
          <div className="p-4 bg-gray-800/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search systems by name, address, or risk level..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-400">
                Showing {filteredSystems.length} of {unknownSystems.length} systems
              </div>
            )}
          </div>
          
          {/* Systems List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredSystems.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.657M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="font-medium">No systems found</p>
                <p className="text-sm mt-1">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredSystems.map((system, index) => (
                <div
                  key={system.pwsid}
                  className="group relative p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-800/30 cursor-pointer transition-all duration-200"
                  onClick={() => handleSystemClick(system)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 group-hover:shadow-md group-hover:shadow-blue-400/50 transition-all"></div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                            {system.name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{system.address}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs ml-5">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{system.population?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="text-gray-500">•</span> {system.type}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(system.risk_level)}`}>
                          {system.risk_level || 'Unknown'} Risk
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6 space-y-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Violations</div>
                      <div className={`text-lg font-bold ${
                        (system.total_violations || 0) > 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {system.total_violations || 0}
                      </div>
                      {(system.health_violations || 0) > 0 && (
                        <div className="text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded-full border border-red-500/30">
                          {system.health_violations} Health
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnknownCoordinatesPanel;