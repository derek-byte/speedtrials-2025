import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, CheckCircle, Info, ExternalLink, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const PublicLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchSystems = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/search/water-systems?q=${encodeURIComponent(query)}&limit=10`);
      setSearchResults(response.data.systems || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSystems(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getViolationExplanation = (violationType) => {
    const explanations = {
      'Total Coliform Rule': {
        description: 'Bacteria were found in your water system',
        healthImpact: 'May indicate harmful bacteria or viruses are present',
        action: 'Boil water before drinking until further notice'
      },
      'Maximum Contaminant Level': {
        description: 'Chemical levels exceeded safe drinking limits',
        healthImpact: 'Long-term exposure may cause health problems',
        action: 'Use bottled water or approved filtration'
      },
      'Lead and Copper Rule': {
        description: 'Lead or copper levels are too high',
        healthImpact: 'Can cause serious health problems, especially in children',
        action: 'Run water for 30 seconds before use, consider filtration'
      }
    };
    return explanations[violationType] || {
      description: 'Water quality standards were not met',
      healthImpact: 'Potential health risks may exist',
      action: 'Contact your water system for more information'
    };
  };

  const getRiskLevelInfo = (riskLevel) => {
    const riskInfo = {
      'High': {
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: AlertTriangle,
        message: 'Immediate attention needed - active health-based violations',
        recommendation: 'Consider alternative water sources and contact your water system immediately'
      },
      'Medium': {
        color: '#f97316',
        bgColor: 'rgba(249, 115, 22, 0.1)',
        icon: AlertTriangle,
        message: 'Some violations need attention',
        recommendation: 'Monitor updates from your water system'
      },
      'Low': {
        color: '#eab308',
        bgColor: 'rgba(234, 179, 8, 0.1)',
        icon: Info,
        message: 'Minor issues being addressed',
        recommendation: 'Water is generally safe, stay informed'
      },
      'Good': {
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        icon: CheckCircle,
        message: 'No current violations - water meets safety standards',
        recommendation: 'Your water system is operating properly'
      }
    };
    return riskInfo[riskLevel] || riskInfo['Good'];
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white',
    padding: '24px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: '#9ca3af',
    marginBottom: '32px'
  };

  const searchContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    position: 'relative',
    marginBottom: '32px'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '16px 20px 16px 50px',
    fontSize: '16px',
    backgroundColor: '#1f2937',
    border: '2px solid #374151',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    transition: 'all 200ms ease'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#9ca3af',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#374151';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#9ca3af';
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Check Your Water Quality</h1>
        <p style={subtitleStyle}>
          Enter your address, city, or water system name to learn about your drinking water safety
        </p>
      </div>

      <div style={searchContainerStyle}>
        <Search size={20} style={searchIconStyle} />
        <input
          type="text"
          placeholder="Enter your address, city, or water system name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#374151';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', width: '32px', height: '32px', border: '3px solid #374151', borderTop: '3px solid #3b82f6', borderRadius: '50%' }}></div>
          <p style={{ marginTop: '16px', color: '#9ca3af' }}>Searching water systems...</p>
        </div>
      )}

      {showResults && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1f2937', borderRadius: '12px' }}>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                No water systems found for "{searchTerm}". Try searching with your city name or a nearby location.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Found {searchResults.length} water system{searchResults.length !== 1 ? 's' : ''}
              </h2>
              
              {searchResults.map((system) => {
                const riskInfo = getRiskLevelInfo(system.risk_level);
                const IconComponent = riskInfo.icon;
                
                return (
                  <div
                    key={system.pwsid}
                    style={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      padding: '24px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    onClick={() => setSelectedSystem(selectedSystem === system ? null : system)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#374151';
                      e.currentTarget.style.borderColor = '#4b5563';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                      e.currentTarget.style.borderColor = '#374151';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapPin size={20} color="#60a5fa" />
                        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{system.name}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: riskInfo.bgColor, borderRadius: '20px', border: `1px solid ${riskInfo.color}40` }}>
                        <IconComponent size={16} color={riskInfo.color} />
                        <span style={{ color: riskInfo.color, fontSize: '14px', fontWeight: '500' }}>{system.risk_level}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px 0' }}>SYSTEM ID</p>
                        <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{system.pwsid}</p>
                      </div>
                      <div>
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px 0' }}>SERVES</p>
                        <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{system.population?.toLocaleString()} people</p>
                      </div>
                      <div>
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px 0' }}>VIOLATIONS</p>
                        <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                          {system.unaddressed_violations || 0} current
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: riskInfo.bgColor, borderRadius: '8px', border: `1px solid ${riskInfo.color}40` }}>
                      <p style={{ color: riskInfo.color, fontWeight: '600', margin: '0 0 8px 0' }}>{riskInfo.message}</p>
                      <p style={{ color: '#d1d5db', fontSize: '14px', margin: 0 }}>{riskInfo.recommendation}</p>
                    </div>

                    {selectedSystem === system && (
                      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #374151' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>What You Should Know</h4>
                        
                        {system.unaddressed_violations > 0 ? (
                          <div style={{ backgroundColor: '#7f1d1d', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                            <h5 style={{ color: '#fca5a5', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>CURRENT VIOLATIONS</h5>
                            <p style={{ color: '#fecaca', fontSize: '14px', marginBottom: '12px' }}>
                              This water system has {system.unaddressed_violations} active violation{system.unaddressed_violations !== 1 ? 's' : ''} that need attention.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ExternalLink size={14} color="#fca5a5" />
                              <span style={{ color: '#fca5a5', fontSize: '12px' }}>Contact your water system for current notices and updates</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ backgroundColor: '#064e3b', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                            <h5 style={{ color: '#6ee7b7', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>WATER QUALITY STATUS</h5>
                            <p style={{ color: '#a7f3d0', fontSize: '14px' }}>
                              Your water system is currently meeting all safety standards with no active violations.
                            </p>
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div style={{ backgroundColor: '#1e3a8a', padding: '16px', borderRadius: '8px' }}>
                            <h5 style={{ color: '#93c5fd', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>STAY INFORMED</h5>
                            <p style={{ color: '#bfdbfe', fontSize: '12px' }}>
                              Sign up for alerts from your water system to receive notices about water quality issues.
                            </p>
                          </div>
                          
                          <div style={{ backgroundColor: '#581c87', padding: '16px', borderRadius: '8px' }}>
                            <h5 style={{ color: '#c4b5fd', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>TAKE ACTION</h5>
                            <p style={{ color: '#ddd6fe', fontSize: '12px' }}>
                              Contact: {system.name}<br/>
                              Location: {system.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!showResults && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '48px' }}>
            <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
              <CheckCircle size={32} color="#22c55e" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Safe Water</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Learn what it means when your water system has no violations and meets all safety standards.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
              <AlertTriangle size={32} color="#f97316" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Understand Violations</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Get clear explanations of what water quality violations mean for your health and safety.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
              <Info size={32} color="#3b82f6" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Stay Updated</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Learn how to stay informed about your local water system and receive important notices.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLookup;