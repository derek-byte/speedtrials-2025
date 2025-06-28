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

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' ? 'bg-green-400' : 
        status === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
      }`}></div>
      <span className={`text-xs ${
        status === 'connected' ? 'text-green-400' : 
        status === 'disconnected' ? 'text-red-400' : 'text-yellow-400'
      }`}>
        {status === 'connected' ? 'Connected' : 
         status === 'disconnected' ? 'Disconnected' : 'Checking...'}
      </span>
    </div>
  );
};

export default HealthCheck;