import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WaterSystemsList = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaterSystems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/water-systems');
        setSystems(response.data.systems);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch water systems data');
        setLoading(false);
      }
    };

    fetchWaterSystems();
  }, []);

  if (loading) return <div className="p-4">Loading water systems...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Water Systems</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">System Name</th>
              <th className="px-4 py-2 text-left">PWS ID</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">County</th>
            </tr>
          </thead>
          <tbody>
            {systems.slice(0, 10).map((system, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{system.PWS_NAME || 'N/A'}</td>
                <td className="px-4 py-2">{system.PWSID || 'N/A'}</td>
                <td className="px-4 py-2">{system.CITY_NAME || 'N/A'}</td>
                <td className="px-4 py-2">{system.COUNTY_SERVED || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaterSystemsList;