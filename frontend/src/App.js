import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import HealthCheck from './components/HealthCheck';
import WaterSystemsMap from './components/WaterSystemsMap';
import DetailsSidebar from './components/DetailsSidebar';
import UnknownCoordinatesPanel from './components/UnknownCoordinatesPanel';
import StatsBar from './components/StatsBar';
import ViolationsReport from './components/ViolationsReport';
import PublicLookup from './components/PublicLookup';
import OperatorDashboard from './components/OperatorDashboard';
import RegulatorFieldKit from './components/RegulatorFieldKit';

// Dashboard Component
const Dashboard = () => {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedSystem(null);
  };

  const handleViewFullReport = (system) => {
    // Navigate to violations report with system data
    navigate('/violations-report', { state: { system } });
    setSidebarOpen(false);
  };

  const handleExportData = () => {
    const downloadUrl = 'http://localhost:5000/api/export/polished-data';
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'georgia_water_systems_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/logo.jpeg" 
                alt="AquaWatch Georgia Logo" 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  objectFit: 'cover',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '600', letterSpacing: '-0.025em', color: 'white', margin: 0 }}>AquaWatch Georgia</h1>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>Water Quality Monitoring Dashboard</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button
                  onClick={() => navigate('/public')}
                  style={{ 
                    cursor: 'pointer', 
                    background: 'none', 
                    border: 'none',
                    fontSize: '12px',
                    color: '#9ca3af',
                    padding: '12px',
                    transition: 'color 200ms ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  Public Portal
                </button>
                <button
                  onClick={() => navigate('/operator')}
                  style={{ 
                    cursor: 'pointer', 
                    background: 'none', 
                    border: 'none',
                    fontSize: '12px',
                    color: '#9ca3af',
                    padding: '12px',
                    transition: 'color 200ms ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  Operator Dashboard
                </button>
                <button
                  onClick={() => navigate('/regulator')}
                  style={{ 
                    cursor: 'pointer', 
                    background: 'none', 
                    border: 'none',
                    fontSize: '12px',
                    color: '#9ca3af',
                    padding: '12px',
                    transition: 'color 200ms ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  Field Kit
                </button>
              </nav>
              <div style={{ height: '16px', width: '1px', backgroundColor: '#4b5563', margin: '0 8px' }}></div>
              <div style={{ padding: '0 12px' }}>
                <HealthCheck />
              </div>
              <span 
                onClick={handleExportData}
                style={{ 
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: 'white',
                  padding: '12px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Export Data
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative">
        {/* Map Container */}
        <div className="p-6">
          {/* Stats Bar */}
          <StatsBar />

          {/* Map with Filters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <WaterSystemsMap onSystemSelect={handleSystemSelect} />
          </div>

          {/* Unknown Locations Panel */}
          <div className="mt-6">
            <UnknownCoordinatesPanel onSystemSelect={handleSystemSelect} />
          </div>
        </div>

        {/* Sidebar - Fixed positioning to overlay */}
        <DetailsSidebar 
          isOpen={sidebarOpen}
          system={selectedSystem}
          onClose={handleCloseSidebar}
          onViewFullReport={handleViewFullReport}
        />
      </div>
    </div>
  );
};

// Violations Report Page Component
const ViolationsReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const system = location.state?.system;

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  if (!system) {
    // If no system data, redirect to dashboard
    navigate('/');
    return null;
  }

  return (
    <ViolationsReport 
      system={system}
      onBack={handleBackToDashboard}
    />
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/violations-report" element={<ViolationsReportPage />} />
        <Route path="/public" element={<PublicLookup />} />
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/regulator" element={<RegulatorFieldKit />} />
      </Routes>
    </Router>
  );
}

export default App;
