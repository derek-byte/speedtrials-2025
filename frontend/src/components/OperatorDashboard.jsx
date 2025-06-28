import React, { useState, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, AlertTriangle, FileText, Users, Droplets, TrendingUp, Clock, Target, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const OperatorDashboard = () => {
  const [systemData, setSystemData] = useState(null);
  const [notices, setNotices] = useState([]);
  const [complianceTasks, setComplianceTasks] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState('');
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load available systems for operator selection
    const loadSystems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/water-systems?limit=100');
        setSystems(response.data.systems || []);
      } catch (error) {
        console.error('Failed to load systems:', error);
      }
    };
    loadSystems();
  }, []);

  const loadSystemData = async (systemId) => {
    if (!systemId) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/water-systems');
      const system = response.data.systems.find(s => s.pwsid === systemId);
      setSystemData(system);
      
      // Generate mock notices and tasks based on system data
      generateMockNotices(system);
      generateComplianceTasks(system);
    } catch (error) {
      console.error('Failed to load system data:', error);
    }
    setLoading(false);
  };

  const generateMockNotices = (system) => {
    const mockNotices = [];
    
    if (system?.unaddressed_violations > 0) {
      mockNotices.push({
        id: 1,
        type: 'violation',
        priority: 'high',
        title: 'Violation Notice Required',
        message: `Public notification required for ${system.unaddressed_violations} active violation(s)`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending'
      });
    }

    mockNotices.push(
      {
        id: 2,
        type: 'sampling',
        priority: 'medium',
        title: 'Monthly Sampling Due',
        message: 'Collect required water samples for bacteriological testing',
        date: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 3,
        type: 'report',
        priority: 'low',
        title: 'Annual Report Preparation',
        message: 'Begin preparation for Consumer Confidence Report',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'in_progress'
      }
    );

    setNotices(mockNotices);
  };

  const generateComplianceTasks = (system) => {
    const tasks = [
      {
        id: 1,
        title: 'Submit Monitoring Report',
        description: 'Monthly bacteriological monitoring results',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'pending',
        category: 'reporting'
      },
      {
        id: 2,
        title: 'Calibrate Equipment',
        description: 'Quarterly calibration of chlorine residual monitoring equipment',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'pending',
        category: 'maintenance'
      },
      {
        id: 3,
        title: 'Update Emergency Plan',
        description: 'Annual review and update of emergency response procedures',
        priority: 'low',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'pending',
        category: 'planning'
      }
    ];

    if (system?.unaddressed_violations > 0) {
      tasks.unshift({
        id: 0,
        title: 'Address Water Quality Violations',
        description: `Take corrective action for ${system.unaddressed_violations} active violation(s)`,
        priority: 'critical',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        category: 'compliance'
      });
    }

    setComplianceTasks(tasks);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#ca8a04',
      low: '#16a34a'
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      overdue: '#dc2626',
      pending: '#ea580c',
      in_progress: '#ca8a04',
      completed: '#16a34a'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white',
    padding: '24px'
  };

  const headerStyle = {
    borderBottom: '1px solid #374151',
    paddingBottom: '24px',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const selectStyle = {
    width: '300px',
    padding: '12px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#9ca3af',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#374151';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#9ca3af';
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Water System Operator Dashboard</h1>
        <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
          Manage compliance, track violations, and stay updated on regulatory requirements
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '500' }}>
            Select Your Water System:
          </label>
          <select
            value={selectedSystemId}
            onChange={(e) => {
              setSelectedSystemId(e.target.value);
              loadSystemData(e.target.value);
            }}
            style={selectStyle}
          >
            <option value="">Choose a water system...</option>
            {systems.map(system => (
              <option key={system.pwsid} value={system.pwsid}>
                {system.name} ({system.pwsid})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '32px', 
            height: '32px', 
            border: '3px solid #374151', 
            borderTop: '3px solid #3b82f6', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', color: '#9ca3af' }}>Loading system data...</p>
        </div>
      )}

      {systemData && !loading && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* System Overview */}
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '24px', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={20} color="#3b82f6" />
              System Overview
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', border: '1px solid #374151' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Users size={16} color="#60a5fa" />
                  <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase' }}>Population Served</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{systemData.population?.toLocaleString()}</div>
              </div>
              
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', border: '1px solid #374151' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={16} color="#f97316" />
                  <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase' }}>Active Violations</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: systemData.unaddressed_violations > 0 ? '#ef4444' : '#22c55e' }}>
                  {systemData.unaddressed_violations || 0}
                </div>
              </div>
              
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', border: '1px solid #374151' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Target size={16} color="#8b5cf6" />
                  <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase' }}>Compliance Status</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: systemData.risk_level === 'Good' ? '#22c55e' : '#ef4444' }}>
                  {systemData.risk_level === 'Good' ? 'Compliant' : 'Non-Compliant'}
                </div>
              </div>
              
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', border: '1px solid #374151' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileText size={16} color="#10b981" />
                  <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase' }}>System Type</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{systemData.type}</div>
              </div>
            </div>
          </div>

          {/* Regulatory Notices */}
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '24px', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={20} color="#f59e0b" />
              Regulatory Notices & Alerts
            </h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {notices.map(notice => (
                <div key={notice.id} style={{
                  backgroundColor: '#111827',
                  border: `1px solid ${getPriorityColor(notice.priority)}40`,
                  borderLeft: `4px solid ${getPriorityColor(notice.priority)}`,
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{notice.title}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        backgroundColor: `${getPriorityColor(notice.priority)}20`,
                        color: getPriorityColor(notice.priority),
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {notice.priority}
                      </span>
                      <span style={{
                        backgroundColor: `${getStatusColor(notice.status)}20`,
                        color: getStatusColor(notice.status),
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {notice.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '12px' }}>{notice.message}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9ca3af', fontSize: '12px' }}>
                    <span>Received: {formatDate(notice.date)}</span>
                    <span>Due: {formatDate(notice.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Tasks */}
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '24px', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="#10b981" />
              Compliance Tasks
            </h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {complianceTasks.map(task => (
                <div key={task.id} style={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{task.title}</h3>
                      <span style={{
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority),
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px' }}>{task.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9ca3af', fontSize: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        Due: {formatDate(task.dueDate)}
                      </span>
                      <span style={{ textTransform: 'capitalize' }}>Category: {task.category}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginLeft: '16px' }}>
                    <button style={{
                      backgroundColor: task.status === 'completed' ? '#166534' : '#1d4ed8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}>
                      {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '24px', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Quick Actions</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <button style={{
                backgroundColor: '#1e40af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                <FileText size={20} style={{ marginBottom: '8px' }} />
                <div>Submit Monitoring Report</div>
              </button>
              
              <button style={{
                backgroundColor: '#7c2d12',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                <Bell size={20} style={{ marginBottom: '8px' }} />
                <div>View All Notices</div>
              </button>
              
              <button style={{
                backgroundColor: '#166534',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                <TrendingUp size={20} style={{ marginBottom: '8px' }} />
                <div>View Compliance History</div>
              </button>
              
              <button style={{
                backgroundColor: '#581c87',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left'
              }}>
                <Clock size={20} style={{ marginBottom: '8px' }} />
                <div>Schedule Sampling</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedSystemId && !loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Droplets size={48} color="#3b82f6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Welcome to the Operator Dashboard</h3>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Select your water system above to view compliance information, regulatory notices, and manage tasks.
          </p>
        </div>
      )}
    </div>
  );
};

export default OperatorDashboard;