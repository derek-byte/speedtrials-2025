import React, { useState, useEffect } from 'react';

const ViolationsReport = ({ system, onBack }) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'health', 'unaddressed', 'total'

  useEffect(() => {
    // Mock detailed violations data based on system
    const generateViolations = () => {
      const baseViolations = [
        {
          type: 'Total Coliform Rule',
          category: 'Microbiological',
          severity: 'High',
          description: 'Positive coliform samples detected in the distribution system',
          dateDetected: '2024-08-15',
          status: 'Active',
          healthRisk: 'Indicates potential contamination with disease-causing bacteria'
        },
        {
          type: 'Maximum Contaminant Level',
          category: 'Chemical',
          severity: 'High',
          description: 'Arsenic levels exceeded EPA maximum allowable limit of 0.010 mg/L',
          dateDetected: '2024-07-22',
          status: 'Under Treatment',
          healthRisk: 'Long-term exposure may increase risk of cancer and cardiovascular disease'
        },
        {
          type: 'Treatment Technique',
          category: 'Operational',
          severity: 'Medium',
          description: 'Failure to maintain adequate chlorine residual in distribution system',
          dateDetected: '2024-09-03',
          status: 'Corrected',
          healthRisk: 'Insufficient disinfection may allow bacterial growth'
        },
        {
          type: 'Public Notification',
          category: 'Reporting',
          severity: 'Low',
          description: 'Late submission of monitoring reports to regulatory authority',
          dateDetected: '2024-06-10',
          status: 'Resolved',
          healthRisk: 'No direct health impact, regulatory compliance issue'
        },
        {
          type: 'Lead and Copper Rule',
          category: 'Chemical',
          severity: 'High',
          description: 'Lead levels at customer taps exceeded action level of 0.015 mg/L',
          dateDetected: '2024-05-18',
          status: 'Active',
          healthRisk: 'Lead exposure can cause serious health problems, especially in children'
        },
        {
          type: 'Nitrate/Nitrite',
          category: 'Chemical',
          severity: 'Medium',
          description: 'Nitrate levels exceeded maximum contaminant level of 10 mg/L',
          dateDetected: '2024-04-12',
          status: 'Under Treatment',
          healthRisk: 'High nitrate levels can cause methemoglobinemia in infants'
        },
        {
          type: 'Surface Water Treatment Rule',
          category: 'Operational',
          severity: 'High',
          description: 'Inadequate filtration turbidity levels detected',
          dateDetected: '2024-03-28',
          status: 'Active',
          healthRisk: 'Poor filtration may allow pathogens to pass through treatment'
        }
      ];

      // Generate violations based on system's violation counts
      const totalViolations = system?.total_violations || 0;
      const healthViolations = system?.health_violations || 0;
      const generatedViolations = [];
      
      for (let i = 0; i < Math.min(totalViolations, 15); i++) {
        const baseViolation = baseViolations[i % baseViolations.length];
        const violation = { ...baseViolation };
        violation.id = i + 1;
        violation.systemName = system?.name || 'Unknown System';
        violation.pwsid = system?.pwsid || 'Unknown';
        
        // Categorize violations
        if (i < healthViolations) {
          violation.severity = 'High';
          violation.category = Math.random() > 0.5 ? 'Microbiological' : 'Chemical';
          violation.isHealthBased = true;
        } else {
          violation.isHealthBased = false;
        }
        
        // Mark some as unaddressed
        const unaddressedViolations = system?.unaddressed_violations || 0;
        if (i < unaddressedViolations) {
          violation.isUnaddressed = true;
          violation.status = 'Active';
        } else {
          violation.isUnaddressed = false;
        }
        
        generatedViolations.push(violation);
      }
      
      return generatedViolations;
    };

    setTimeout(() => {
      const generatedViolations = generateViolations();
      console.log('Generated violations:', generatedViolations);
      console.log('System data:', system);
      setViolations(generatedViolations);
      setLoading(false);
    }, 500);
  }, [system]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Low': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Under Treatment': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Corrected': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Resolved': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getFilteredViolations = () => {
    switch (activeFilter) {
      case 'health':
        return violations.filter(v => v.isHealthBased);
      case 'unaddressed':
        return violations.filter(v => v.isUnaddressed);
      case 'total':
        return violations;
      default:
        return violations;
    }
  };

  const getViolationsByCategory = () => {
    return {
      health: violations.filter(v => v.isHealthBased),
      unaddressed: violations.filter(v => v.isUnaddressed),
      total: violations
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading violation details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white" 
              style={{ background: "transparent", outline: "none", border: "none", cursor: "pointer" }}
              onClick={onBack}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Violations Report</h1>
                <p className="text-gray-400 text-sm mt-1">{system?.name} - {system?.pwsid}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div 
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="text-2xl font-bold text-white">{system?.total_violations || 0}</div>
            <div className="text-gray-400 text-sm">Total Violations</div>
          </div>
          <div 
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="text-2xl font-bold text-red-400">{system?.health_violations || 0}</div>
            <div className="text-gray-400 text-sm">Health-Based</div>
          </div>
          <div 
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="text-2xl font-bold text-orange-400">{system?.unaddressed_violations || 0}</div>
            <div className="text-gray-400 text-sm">Unaddressed</div>
          </div>
          <div 
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className={`text-2xl font-bold ${
              system?.risk_level === 'High' ? 'text-red-400' :
              system?.risk_level === 'Medium' ? 'text-orange-400' :
              system?.risk_level === 'Low' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {system?.risk_level || 'Unknown'}
            </div>
            <div className="text-gray-400 text-sm">Risk Level</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-4">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
            {[
              { key: 'all', label: 'All Violations', count: violations.length },
              { key: 'health', label: 'Health-Based', count: getViolationsByCategory().health.length },
              { key: 'unaddressed', label: 'Unaddressed', count: getViolationsByCategory().unaddressed.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  backgroundColor: activeFilter === tab.key ? '#3b82f6' : 'transparent',
                  color: activeFilter === tab.key ? 'white' : '#9ca3af'
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== tab.key) {
                    e.target.style.backgroundColor = '#374151';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== tab.key) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#9ca3af';
                  }
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Violations Content */}
        <div className="space-y-6">
          {activeFilter === 'all' ? (
            <>
              {/* Health-Based Violations Section */}
              {getViolationsByCategory().health.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-6">Health-Based Violations ({getViolationsByCategory().health.length})</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {getViolationsByCategory().health.map((violation) => (
                      <ViolationCard key={violation.id} violation={violation} getSeverityColor={getSeverityColor} getStatusColor={getStatusColor} />
                    ))}
                  </div>
                </div>
              )}

              {/* Unaddressed Violations Section */}
              {getViolationsByCategory().unaddressed.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-6">Unaddressed Violations ({getViolationsByCategory().unaddressed.length})</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {getViolationsByCategory().unaddressed.map((violation) => (
                      <ViolationCard key={violation.id} violation={violation} getSeverityColor={getSeverityColor} getStatusColor={getStatusColor} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Violations Section */}
              {getViolationsByCategory().total.filter(v => !v.isHealthBased && !v.isUnaddressed).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-6">Other Violations ({getViolationsByCategory().total.filter(v => !v.isHealthBased && !v.isUnaddressed).length})</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {getViolationsByCategory().total.filter(v => !v.isHealthBased && !v.isUnaddressed).map((violation) => (
                      <ViolationCard key={violation.id} violation={violation} getSeverityColor={getSeverityColor} getStatusColor={getStatusColor} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {getFilteredViolations().length === 0 ? (
                <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                  <div className="text-gray-400">No violations found in this category.</div>
                </div>
              ) : (
                getFilteredViolations().map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} getSeverityColor={getSeverityColor} getStatusColor={getStatusColor} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div 
          className="flex space-x-4"
          style={{ marginTop: '80px' }}
        >
          <button 
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 200ms ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Export Report
          </button>
          <button 
            style={{
              padding: '12px 24px',
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
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ViolationCard Component
const ViolationCard = ({ violation }) => {
  // Severity styling
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'High':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          color: 'rgb(252, 165, 165)',
          borderColor: 'rgba(239, 68, 68, 0.3)'
        };
      case 'Medium':
        return {
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          color: 'rgb(253, 186, 116)',
          borderColor: 'rgba(249, 115, 22, 0.3)'
        };
      case 'Low':
        return {
          backgroundColor: 'rgba(234, 179, 8, 0.2)',
          color: 'rgb(253, 224, 71)',
          borderColor: 'rgba(234, 179, 8, 0.3)'
        };
      default:
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          color: 'rgb(134, 239, 172)',
          borderColor: 'rgba(34, 197, 94, 0.3)'
        };
    }
  };
  
  // Status styling
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Active':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          color: 'rgb(252, 165, 165)',
          boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.3)'
        };
      case 'Under Treatment':
        return {
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          color: 'rgb(253, 186, 116)',
          boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.3)'
        };
      case 'Corrected':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          color: 'rgb(134, 239, 172)',
          boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.3)'
        };
      default:
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: 'rgb(147, 197, 253)',
          boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)'
        };
    }
  };
  
  // Dot color based on severity
  const getDotColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'rgb(248, 113, 113)';
      case 'Medium':
        return 'rgb(251, 146, 60)';
      case 'Low':
        return 'rgb(250, 204, 21)';
      default:
        return 'rgb(74, 222, 128)';
    }
  };

  // Card styles
  const cardStyles = {
    backgroundColor: '#111827', // bg-gray-900
    border: '1px solid #1f2937', // border-gray-800
    borderRadius: '0.75rem', // rounded-xl
    padding: '1.25rem', // p-5
    position: 'relative',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(31, 41, 55, 0.5)', // shadow-lg + ring
    transition: 'all 0.2s ease-in-out',
  };
  
  // Hover effects added with onMouseEnter/onMouseLeave
  const [isHovering, setIsHovering] = React.useState(false);
  
  const cardHoverStyles = isHovering ? {
    backgroundColor: 'rgba(31, 41, 55, 0.3)', // hover:bg-gray-800/30
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(55, 65, 81, 0.5)', // hover:shadow-xl + hover:ring-gray-700/50
  } : {};

  // Priority tag styles
  const priorityTagStyles = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.25rem 0.625rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: '1px solid',
    ...getSeverityStyles(violation.severity)
  };

  // Container styles
  const containerStyles = {
    paddingRight: '5rem', // pr-20
  };

  // Content container styles
  const contentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem', // space-y-4
  };

  // Title section styles
  const titleSectionStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // space-y-2
  };

  // Title row styles
  const titleRowStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem', // space-x-3
  };

  // Severity dot styles
  const dotStyles = {
    width: '0.625rem', // w-2.5
    height: '0.625rem', // h-2.5
    borderRadius: '9999px', // rounded-full
    backgroundColor: getDotColor(violation.severity),
    boxShadow: `0 0 0 2px ${getDotColor(violation.severity)}33`, // ring-2 ring-opacity-30
  };

  // Title styles
  const titleStyles = {
    color: 'white', // text-white
    fontWeight: '600', // font-semibold
    fontSize: '1.125rem', // text-lg
  };

  // Meta info styles
  const metaInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem', // gap-2
    fontSize: '0.75rem', // text-xs
  };

  // Category/date styles
  const metaTextStyles = {
    color: '#9ca3af', // text-gray-400
  };

  // Separator styles
  const separatorStyles = {
    color: '#6b7280', // text-gray-500
    display: window.innerWidth < 640 ? 'none' : 'inline', // hidden sm:inline
  };

  // Status badge styles
  const statusBadgeStyles = {
    padding: '0.25rem 0.625rem',
    borderRadius: '9999px', // rounded-full
    fontSize: '0.75rem', // text-xs
    fontWeight: '500', // font-medium
    ...getStatusStyles(violation.status)
  };

  // Details section styles
  const detailsSectionStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem', // space-y-3
  };

  // Detail block styles
  const detailBlockStyles = {
    fontSize: '0.875rem', // text-sm
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  };

  // Detail label styles
  const detailLabelStyles = {
    color: '#9ca3af', // text-gray-400
    fontSize: '0.75rem', // text-xs
    textTransform: 'uppercase', // uppercase
    letterSpacing: '0.025em', // tracking-wide
    fontWeight: '500', // font-medium
    marginRight: '0.5rem',
  };

  // Detail text styles
  const detailTextStyles = {
    color: '#d1d5db', // text-gray-300
    flex: '1 1 auto',
  };

  // Tags container styles
  const tagsContainerStyles = {
    marginTop: '0.75rem', // mt-3
  };

  // Unaddressed tag styles
  const unaddressedTagStyles = {
    fontSize: '0.75rem', // text-xs
    backgroundColor: 'rgba(249, 115, 22, 0.2)', // bg-orange-500/20
    color: 'rgb(253, 186, 116)', // text-orange-300
    padding: '0.25rem 0.625rem', // px-2.5 py-1
    borderRadius: '9999px', // rounded-full
    display: 'inline-block',
    boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.3)', // ring-1 ring-orange-500/30
  };

  return (
    <div 
      style={{...cardStyles, ...cardHoverStyles}} 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Priority tag in top-right corner */}
      <div style={priorityTagStyles}>
        {violation.severity}
      </div>

      <div style={containerStyles}>
        <div style={contentContainerStyles}>
          {/* Title and Category Section */}
          <div style={titleSectionStyles}>
            <div style={titleRowStyles}>
              <div style={dotStyles}></div>
              <h3 style={titleStyles}>{violation.type}</h3>
            </div>
            
            <div style={metaInfoStyles}>
              <span style={metaTextStyles}>Category: {violation.category}</span>
              <span style={separatorStyles}>•</span>
              <span style={metaTextStyles}>Detected: {violation.dateDetected}</span>
              <span style={separatorStyles}>•</span>
              <div style={statusBadgeStyles}>
                {violation.status}
              </div>
            </div>
          </div>
          
          {/* Description and Health Risk Section */}
          <div style={detailsSectionStyles}>
            <div style={detailBlockStyles}>
              <span style={detailLabelStyles}>Description:</span>
              <span style={detailTextStyles}>{violation.description}</span>
            </div>
            
            <div style={detailBlockStyles}>
              <span style={detailLabelStyles}>Health Risk:</span>
              <span style={detailTextStyles}>{violation.healthRisk}</span>
            </div>
          </div>

          {/* Additional labels */}
          {violation.isUnaddressed && !violation.isHealthBased && (
            <div style={tagsContainerStyles}>
              <span style={unaddressedTagStyles}>
                Unaddressed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViolationsReport;