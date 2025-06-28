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
              <button 
                onClick={handleExportData}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md text-white transform hover:scale-105 border border-indigo-800/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Data</span>
              </button>
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
