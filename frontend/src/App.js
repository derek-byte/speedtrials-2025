import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import HealthCheck from './components/HealthCheck';
import WaterSystemsMap from './components/WaterSystemsMap';
import DetailsSidebar from './components/DetailsSidebar';
import UnknownCoordinatesPanel from './components/UnknownCoordinatesPanel';
import StatsBar from './components/StatsBar';
import ViolationsReport from './components/ViolationsReport';

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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  <circle cx="12" cy="9" r="1.5" fill="white"/>
                  <path d="M12 15.5c-2.5 0-4.5 1-4.5 2.25V19h9v-1.25c0-1.25-2-2.25-4.5-2.25z" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">AquaWatch Georgia</h1>
                <p className="text-gray-400 text-sm mt-1">Water Quality Monitoring Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <HealthCheck />
              <span 
                onClick={handleExportData}
                className="text-xs text-white cursor-pointer hover:text-gray-300 transition-colors"
                style={{ cursor: 'pointer' }}
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
      </Routes>
    </Router>
  );
}

export default App;
