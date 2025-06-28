import React, { useState } from 'react';
import './App.css';
import HealthCheck from './components/HealthCheck';
import WaterSystemsMap from './components/WaterSystemsMap';
import DetailsSidebar from './components/DetailsSidebar';

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
              <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                Export Data
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
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-gray-400 text-sm">Water Systems</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">94.2%</div>
              <div className="text-gray-400 text-sm">Compliant</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-400">72</div>
              <div className="text-gray-400 text-sm">Active Violations</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">8.9M</div>
              <div className="text-gray-400 text-sm">Population Served</div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <WaterSystemsMap onSystemSelect={handleSystemSelect} />
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
