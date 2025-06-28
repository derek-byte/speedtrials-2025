import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const MapFilters = ({ onFiltersChange, systems = [] }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    pwsid: '',
    systemType: '',
    primarySource: '',
    ownerType: '',
    riskLevel: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for dropdown options
  const getUniqueValues = (field) => {
    const values = systems.map(system => system[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const systemTypes = getUniqueValues('type');
  const primarySources = getUniqueValues('primary_source');
  const ownerTypes = getUniqueValues('owner_type');
  const riskLevels = ['High', 'Medium', 'Low', 'Good'];

  // Apply filters whenever they change
  useEffect(() => {
    const filteredSystems = systems.filter(system => {
      // Search term filter (name, address, pwsid)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          system.name?.toLowerCase().includes(searchLower) ||
          system.address?.toLowerCase().includes(searchLower) ||
          system.pwsid?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // PWSID filter
      if (filters.pwsid && !system.pwsid?.toLowerCase().includes(filters.pwsid.toLowerCase())) {
        return false;
      }

      // System type filter
      if (filters.systemType && system.type !== filters.systemType) {
        return false;
      }

      // Primary source filter
      if (filters.primarySource && system.primary_source !== filters.primarySource) {
        return false;
      }

      // Owner type filter
      if (filters.ownerType && system.owner_type !== filters.ownerType) {
        return false;
      }

      // Risk level filter
      if (filters.riskLevel && system.risk_level !== filters.riskLevel) {
        return false;
      }

      return true;
    });

    onFiltersChange(filteredSystems);
  }, [filters, systems]); // Removed onFiltersChange from dependencies

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      pwsid: '',
      systemType: '',
      primarySource: '',
      ownerType: '',
      riskLevel: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Styles
  const containerStyle = {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  };

  const titleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const titleStyle = {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0
  };

  const activeCountStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontWeight: '500'
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const clearButtonStyle = {
    color: '#9ca3af',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'all 200ms ease'
  };

  const expandButtonStyle = {
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'all 200ms ease',
    fontSize: '14px'
  };

  const searchContainerStyle = {
    position: 'relative',
    marginBottom: '20px'
  };

  const searchInputStyle = {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 200ms ease'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  };

  const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    color: '#9ca3af',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 200ms ease'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const summaryContainerStyle = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #374151'
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  };

  const tagStyle = {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    color: '#93c5fd',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(59, 130, 246, 0.3)'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <Filter size={20} color="#60a5fa" />
          <h3 style={titleStyle}>Filter Water Systems</h3>
          {hasActiveFilters && (
            <span style={activeCountStyle}>
              {Object.values(filters).filter(v => v !== '').length} active
            </span>
          )}
        </div>
        <div style={buttonContainerStyle}>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={clearButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.color = 'white';
                e.target.style.backgroundColor = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#9ca3af';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <X size={16} />
              <span>Clear All</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={expandButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.backgroundColor = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#9ca3af';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            <ChevronDown 
              size={16} 
              style={{ 
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease'
              }} 
            />
          </button>
        </div>
      </div>

      {/* Quick Search - Always Visible */}
      <div style={searchContainerStyle}>
        <Search size={16} style={searchIconStyle} />
        <input
          type="text"
          placeholder="Quick search by name, PWSID, or address..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#374151';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Detailed Filters - Expandable */}
      {isExpanded && (
        <div style={filtersGridStyle}>
          {/* PWSID Filter */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Water System #</label>
            <input
              type="text"
              placeholder="Enter PWSID..."
              value={filters.pwsid}
              onChange={(e) => handleFilterChange('pwsid', e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* System Type Filter */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>System Type</label>
            <select
              value={filters.systemType}
              onChange={(e) => handleFilterChange('systemType', e.target.value)}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Types</option>
              {systemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Primary Source Filter */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Primary Source</label>
            <select
              value={filters.primarySource}
              onChange={(e) => handleFilterChange('primarySource', e.target.value)}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Sources</option>
              {primarySources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Owner Type Filter */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Owner Type</label>
            <select
              value={filters.ownerType}
              onChange={(e) => handleFilterChange('ownerType', e.target.value)}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Owners</option>
              {ownerTypes.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Risk Level</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Risk Levels</option>
              {riskLevels.map(risk => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filter Results Summary */}
      {hasActiveFilters && (
        <div style={summaryContainerStyle}>
          <div style={tagsContainerStyle}>
            {filters.searchTerm && (
              <span style={tagStyle}>
                Search: "{filters.searchTerm}"
              </span>
            )}
            {filters.pwsid && (
              <span style={tagStyle}>
                PWSID: {filters.pwsid}
              </span>
            )}
            {filters.systemType && (
              <span style={tagStyle}>
                Type: {filters.systemType}
              </span>
            )}
            {filters.primarySource && (
              <span style={tagStyle}>
                Source: {filters.primarySource}
              </span>
            )}
            {filters.ownerType && (
              <span style={tagStyle}>
                Owner: {filters.ownerType}
              </span>
            )}
            {filters.riskLevel && (
              <span style={tagStyle}>
                Risk: {filters.riskLevel}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapFilters;