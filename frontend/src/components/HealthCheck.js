import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        setStatus('connected');
        setMessage(response.data.message);
      } catch (err) {
        setStatus('disconnected');
        setMessage('Backend not available');
      }
    };

    checkBackend();
  }, []);

  const statusColor = status === 'connected' ? 'text-green-600' : 
                     status === 'disconnected' ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-3 ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
        <span className={`font-medium ${statusColor}`}>
          Backend Status: {message}
        </span>
      </div>
    </div>
  );
};

export default HealthCheck;