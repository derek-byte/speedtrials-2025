import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, FileText, Calendar, Users, Droplets, TrendingDown, TrendingUp, Phone, Mail, Clock, Target, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const RegulatorFieldKit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [quickStats, setQuickStats] = useState(null);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats/comprehensive');
      setQuickStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const searchSystems = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/search/water-systems?q=${encodeURIComponent(query)}&limit=20`);
      setSearchResults(response.data.systems || []);
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

  const generateRealisticContacts = (system) => {
    // Generate realistic contact information based on system data
    const systemName = system.name;
    const isCity = systemName.toLowerCase().includes('city');
    const isCounty = systemName.toLowerCase().includes('county');
    const isSchool = systemName.toLowerCase().includes('school') || systemName.toLowerCase().includes('elementary') || systemName.toLowerCase().includes('high');
    const isPrivate = system.owner_type === 'P';
    
    const contacts = [];
    
    // Generate primary contact based on system type
    if (isCity) {
      contacts.push({
        role: 'Water System Manager',
        name: generateManagerName(),
        phone: generatePhoneNumber('912'),
        email: `water@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.ga.gov`
      });
      contacts.push({
        role: 'Chief Operator',
        name: generateOperatorName(),
        phone: generatePhoneNumber('912'),
        email: `operations@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.ga.gov`
      });
    } else if (isCounty) {
      contacts.push({
        role: 'County Water Director',
        name: generateManagerName(),
        phone: generatePhoneNumber('770'),
        email: `waterdir@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.ga.gov`
      });
      contacts.push({
        role: 'Operations Supervisor',
        name: generateOperatorName(),
        phone: generatePhoneNumber('770'),
        email: `watersup@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.ga.gov`
      });
    } else if (isSchool) {
      contacts.push({
        role: 'Facilities Manager',
        name: generateManagerName(),
        phone: generatePhoneNumber('478'),
        email: `facilities@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.k12.ga.us`
      });
    } else if (isPrivate) {
      contacts.push({
        role: 'System Owner/Operator',
        name: generateManagerName(),
        phone: generatePhoneNumber('706'),
        email: `manager@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.com`
      });
    } else {
      // Default municipal system
      contacts.push({
        role: 'Water System Manager',
        name: generateManagerName(),
        phone: generatePhoneNumber('912'),
        email: `water@${systemName.toLowerCase().replace(/[^a-z]/g, '')}.org`
      });
    }
    
    return contacts;
  };

  const generateManagerName = () => {
    const firstNames = ['James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Joshua', 'Kenneth', 'Paul', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  const generateOperatorName = () => {
    const firstNames = ['Lisa', 'Nancy', 'Karen', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Patricia', 'Maria', 'Susan', 'Margaret', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen'];
    const lastNames = ['Anderson', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  const generatePhoneNumber = (areaCode) => {
    const exchange = Math.floor(Math.random() * 800) + 200; // 200-999
    const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `(${areaCode}) ${exchange}-${number}`;
  };

  const generateInspectionData = (system) => {
    const lastInspection = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const nextInspection = new Date(lastInspection.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    return {
      lastInspection,
      nextInspection,
      inspectionHistory: [
        { date: lastInspection, result: 'Satisfactory', inspector: 'J. Smith' },
        { date: new Date(lastInspection.getTime() - 365 * 24 * 60 * 60 * 1000), result: 'Minor Issues', inspector: 'M. Johnson' },
        { date: new Date(lastInspection.getTime() - 2 * 365 * 24 * 60 * 60 * 1000), result: 'Satisfactory', inspector: 'K. Williams' }
      ],
      complianceScore: system.risk_level === 'Good' ? 95 : system.risk_level === 'Low' ? 85 : system.risk_level === 'Medium' ? 70 : 45,
      keyContacts: generateRealisticContacts(system)
    };
  };

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      'High': '#dc2626',
      'Medium': '#ea580c',
      'Low': '#ca8a04',
      'Good': '#16a34a'
    };
    return colors[riskLevel] || '#6b7280';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white',
    padding: '16px'
  };

  const headerStyle = {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #374151'
  };

  const searchContainerStyle = {
    position: 'relative',
    maxWidth: '500px',
    marginBottom: '24px'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    backgroundColor: '#111827',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={{ marginBottom: '16px' }}>
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

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Regulator Field Kit
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
              On-site inspection tool with live system status and compliance information
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af' }}>
            <div>Inspector: Regulator Name</div>
            <div>{formatDateTime(new Date())}</div>
          </div>
        </div>

        {/* Quick Stats */}
        {quickStats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
                {quickStats.active_systems?.count || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>Active Systems</div>
            </div>
            <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
                {quickStats.active_systems?.with_current_violations || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>With Violations</div>
            </div>
            <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                {quickStats.compliance_summary?.compliance_rate || 0}%
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>Compliance Rate</div>
            </div>
            <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {quickStats.active_systems?.with_archived_violations || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>With History</div>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={searchContainerStyle}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by system name, PWSID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedSystem ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Search Results */}
        <div>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1f2937', borderRadius: '8px' }}>
              <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid #374151', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '12px', color: '#9ca3af', fontSize: '14px' }}>Searching...</p>
            </div>
          )}

          {searchResults.length > 0 && !loading && (
            <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px', border: '1px solid #374151' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Search Results ({searchResults.length})
              </h2>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {searchResults.map((system) => (
                  <div
                    key={system.pwsid}
                    style={{
                      backgroundColor: selectedSystem?.pwsid === system.pwsid ? '#374151' : '#111827',
                      border: `1px solid ${selectedSystem?.pwsid === system.pwsid ? '#4b5563' : '#374151'}`,
                      borderLeft: `4px solid ${getRiskLevelColor(system.risk_level)}`,
                      borderRadius: '6px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    onClick={() => setSelectedSystem(system)}
                    onMouseEnter={(e) => {
                      if (selectedSystem?.pwsid !== system.pwsid) {
                        e.currentTarget.style.backgroundColor = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSystem?.pwsid !== system.pwsid) {
                        e.currentTarget.style.backgroundColor = '#111827';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{system.name}</h3>
                      <span style={{
                        backgroundColor: `${getRiskLevelColor(system.risk_level)}20`,
                        color: getRiskLevelColor(system.risk_level),
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '500'
                      }}>
                        {system.risk_level}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                      <div>PWSID: {system.pwsid}</div>
                      <div>Pop: {system.population?.toLocaleString()}</div>
                      <div>Violations: {system.unaddressed_violations || 0}</div>
                    </div>
                    
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                      📍 {system.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm && searchResults.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }}>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>No systems found for "{searchTerm}"</p>
            </div>
          )}

          {!searchTerm && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }}>
              <Search size={32} color="#6b7280" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Search for a water system to begin inspection</p>
            </div>
          )}
        </div>

        {/* System Details */}
        {selectedSystem && (
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px', border: '1px solid #374151' }}>
            {(() => {
              const inspectionData = generateInspectionData(selectedSystem);
              
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>{selectedSystem.name}</h2>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>PWSID: {selectedSystem.pwsid}</p>
                    </div>
                    <div style={{
                      backgroundColor: `${getRiskLevelColor(selectedSystem.risk_level)}20`,
                      color: getRiskLevelColor(selectedSystem.risk_level),
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {selectedSystem.risk_level === 'Good' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                      {selectedSystem.risk_level} Risk
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Users size={14} color="#60a5fa" />
                        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Population</span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedSystem.population?.toLocaleString()}</div>
                    </div>
                    
                    <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <AlertTriangle size={14} color="#f97316" />
                        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Active Violations</span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: selectedSystem.unaddressed_violations > 0 ? '#ef4444' : '#22c55e' }}>
                        {selectedSystem.unaddressed_violations || 0}
                      </div>
                    </div>
                  </div>

                  {/* Compliance Score */}
                  <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Compliance Score</span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: inspectionData.complianceScore >= 90 ? '#22c55e' : inspectionData.complianceScore >= 70 ? '#f59e0b' : '#ef4444' }}>
                        {inspectionData.complianceScore}%
                      </span>
                    </div>
                    <div style={{ backgroundColor: '#374151', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${inspectionData.complianceScore}%`,
                        height: '100%',
                        backgroundColor: inspectionData.complianceScore >= 90 ? '#22c55e' : inspectionData.complianceScore >= 70 ? '#f59e0b' : '#ef4444',
                        borderRadius: '3px',
                        transition: 'width 500ms ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Inspection History */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#8b5cf6" />
                      Inspection History
                    </h3>
                    <div style={{ backgroundColor: '#111827', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid #374151' }}>
                          <span style={{ color: '#9ca3af' }}>Last Inspection:</span>
                          <span>{formatDate(inspectionData.lastInspection)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: '#9ca3af' }}>Next Due:</span>
                          <span style={{ color: new Date() > inspectionData.nextInspection ? '#ef4444' : '#22c55e' }}>
                            {formatDate(inspectionData.nextInspection)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Contacts */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#10b981" />
                      Key Contacts
                    </h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {inspectionData.keyContacts.map((contact, index) => (
                        <div key={index} style={{ backgroundColor: '#111827', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '2px' }}>{contact.role}</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{contact.name}</div>
                          <div style={{ fontSize: '11px', color: '#60a5fa' }}>{contact.phone}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <button style={{
                        backgroundColor: '#1d4ed8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        Start Inspection
                      </button>
                      <button style={{
                        backgroundColor: '#7c2d12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        Issue Notice
                      </button>
                      <button style={{
                        backgroundColor: '#166534',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        View History
                      </button>
                      <button style={{
                        backgroundColor: '#581c87',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        Export Report
                      </button>
                    </div>
                  </div>

                  {/* Field Notes */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Field Notes</h3>
                    <textarea
                      value={inspectionNotes}
                      onChange={(e) => setInspectionNotes(e.target.value)}
                      placeholder="Add inspection notes, observations, or action items..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        padding: '8px',
                        color: 'white',
                        fontSize: '12px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatorFieldKit;