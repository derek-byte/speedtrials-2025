import React, { useState } from 'react';
import './App.css';
import HealthCheck from './components/HealthCheck';
import WaterSystemsMap from './components/WaterSystemsMap';
import DetailsSidebar from './components/DetailsSidebar';
import UnknownCoordinatesPanel from './components/UnknownCoordinatesPanel';
import StatsBar from './components/StatsBar';

function App() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedSystem(null);
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
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Georgia Water Quality</h1>
              <p className="text-gray-400 text-sm mt-1">Real-time monitoring and analysis</p>
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

          {/* Map */}
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
        />
      </div>
    </div>
  );
}

export default App;
