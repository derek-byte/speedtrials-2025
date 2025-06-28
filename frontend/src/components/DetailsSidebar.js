import React from 'react';

const DetailsSidebar = ({ isOpen, system, onClose }) => {
  if (!system) {
    return null;
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Low': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-green-400 bg-green-400/10 border-green-400/20';
    }
  };

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return {
        color: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        borderColor: 'rgba(248, 113, 113, 0.2)'
      };
      case 'Medium': return {
        color: '#fb923c',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        borderColor: 'rgba(251, 146, 60, 0.2)'
      };
      case 'Low': return {
        color: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderColor: 'rgba(251, 191, 36, 0.2)'
      };
      default: return {
        color: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        borderColor: 'rgba(52, 211, 153, 0.2)'
      };
    }
  };

  const getViolationIcon = (type) => {
    const iconStyle = {
      width: '20px',
      height: '20px'
    };

    switch (type) {
      case 'health':
        return (
          <svg style={{...iconStyle, color: '#f87171'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'unaddressed':
        return (
          <svg style={{...iconStyle, color: '#fb923c'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg style={{...iconStyle, color: '#fbbf24'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }}
      />

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-800 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          zIndex: 9999,
          transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">System Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 space-y-6 overflow-y-auto h-full pb-20"
          style={{
            padding: '24px',
            overflowY: 'auto',
            height: 'calc(100vh - 80px)',
            color: 'white'
          }}
        >
          {/* System Name & Status */}
          <div style={{ marginBottom: '24px' }}>
            <h3 
              className="text-xl font-semibold text-white mb-2"
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '12px'
              }}
            >
              {system.name}
            </h3>
            <div 
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(system.risk_level)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid',
                ...getRiskStyles(system.risk_level)
              }}
            >
              {system.risk_level} Risk
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label 
                className="text-gray-400 text-sm"
                style={{ 
                  color: '#9ca3af', 
                  fontSize: '12px', 
                  display: 'block',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                PWS ID
              </label>
              <div 
                className="text-white font-mono"
                style={{ 
                  color: 'white', 
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              >
                {system.pwsid}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label 
                className="text-gray-400 text-sm"
                style={{ 
                  color: '#9ca3af', 
                  fontSize: '12px', 
                  display: 'block',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Location
              </label>
              <div 
                className="text-white"
                style={{ color: 'white', fontSize: '14px' }}
              >
                {system.address}
              </div>
            </div>
            
            <div 
              className="grid grid-cols-2 gap-4"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px' 
              }}
            >
              <div>
                <label 
                  className="text-gray-400 text-sm"
                  style={{ 
                    color: '#9ca3af', 
                    fontSize: '12px', 
                    display: 'block',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Type
                </label>
                <div 
                  className="text-white"
                  style={{ color: 'white', fontSize: '14px' }}
                >
                  {system.type || 'N/A'}
                </div>
              </div>
              <div>
                <label 
                  className="text-gray-400 text-sm"
                  style={{ 
                    color: '#9ca3af', 
                    fontSize: '12px', 
                    display: 'block',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Population
                </label>
                <div 
                  className="text-white"
                  style={{ color: 'white', fontSize: '14px' }}
                >
                  {system.population?.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Violations Summary */}
          <div 
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #374151',
              marginBottom: '24px'
            }}
          >
            <h4 
              className="text-white font-medium mb-4"
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '16px'
              }}
            >
              Violations Summary
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                className="flex items-center justify-between"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div 
                  className="flex items-center space-x-2"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getViolationIcon('health')}
                  <span 
                    className="text-gray-300 text-sm"
                    style={{ color: '#d1d5db', fontSize: '14px' }}
                  >
                    Health-Based
                  </span>
                </div>
                <span 
                  className="text-white font-medium"
                  style={{ color: 'white', fontWeight: '500' }}
                >
                  {system.health_violations || 0}
                </span>
              </div>
              
              <div 
                className="flex items-center justify-between"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div 
                  className="flex items-center space-x-2"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getViolationIcon('unaddressed')}
                  <span 
                    className="text-gray-300 text-sm"
                    style={{ color: '#d1d5db', fontSize: '14px' }}
                  >
                    Unaddressed
                  </span>
                </div>
                <span 
                  className="text-white font-medium"
                  style={{ color: 'white', fontWeight: '500' }}
                >
                  {system.unaddressed_violations || 0}
                </span>
              </div>
              
              <div 
                className="flex items-center justify-between"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div 
                  className="flex items-center space-x-2"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getViolationIcon('total')}
                  <span 
                    className="text-gray-300 text-sm"
                    style={{ color: '#d1d5db', fontSize: '14px' }}
                  >
                    Total Violations
                  </span>
                </div>
                <span 
                  className="text-white font-medium"
                  style={{ color: 'white', fontWeight: '500' }}
                >
                  {system.total_violations || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-4">Compliance Score</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Overall Rating</span>
                <div className="flex items-center space-x-2">
                  {system.risk_level === 'Good' && (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 font-medium">Excellent</span>
                    </>
                  )}
                  {system.risk_level === 'Low' && (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-400 font-medium">Good</span>
                    </>
                  )}
                  {system.risk_level === 'Medium' && (
                    <>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-400 font-medium">Fair</span>
                    </>
                  )}
                  {system.risk_level === 'High' && (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-400 font-medium">Poor</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    system.risk_level === 'Good' ? 'bg-green-400' :
                    system.risk_level === 'Low' ? 'bg-yellow-400' :
                    system.risk_level === 'Medium' ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ 
                    width: system.risk_level === 'Good' ? '95%' :
                           system.risk_level === 'Low' ? '75%' :
                           system.risk_level === 'Medium' ? '50%' : '25%'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: '32px' }}>
            <button 
              className="w-full px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'background-color 200ms ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              View Full Report
            </button>
            <button 
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#1f2937',
                color: 'white',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 200ms ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#111827'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsSidebar;