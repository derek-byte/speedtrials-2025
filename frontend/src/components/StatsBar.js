import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsBar = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats/water-systems');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num?.toLocaleString() || '0';
  };

  const getCompliancePercentage = () => {
    if (!stats) return 0;
    const compliantSystems = stats.total_systems - stats.systems_with_violations;
    return ((compliantSystems / stats.total_systems) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-4 bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
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
        <div className="text-2xl font-bold text-white">{stats?.total_systems?.toLocaleString()}</div>
        <div className="text-gray-400 text-sm">Water Systems</div>
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
        <div className="text-2xl font-bold text-green-400">{getCompliancePercentage()}%</div>
        <div className="text-gray-400 text-sm">Compliant</div>
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
        <div className="text-2xl font-bold text-orange-400">{stats?.systems_with_violations?.toLocaleString()}</div>
        <div className="text-gray-400 text-sm">Systems with Violations</div>
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
        <div className="text-2xl font-bold text-white">{formatNumber(stats?.population_served)}</div>
        <div className="text-gray-400 text-sm">Population Served</div>
      </div>
    </div>
  );
};

export default StatsBar;