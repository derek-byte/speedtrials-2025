import './App.css';
import HealthCheck from './components/HealthCheck';
import WaterSystemsList from './components/WaterSystemsList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">Georgia Water Quality Dashboard</h1>
        <p className="mt-2 text-blue-100">Making water quality data accessible to everyone</p>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <HealthCheck />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Water Quality Portal</h2>
          <p className="text-gray-600 mb-4">
            This platform provides access to Georgia's drinking water quality data in an easy-to-understand format.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-700">
              <strong>Live Data:</strong> Connected to real Georgia water quality datasets.
            </p>
          </div>
        </div>

        <WaterSystemsList />
      </main>
    </div>
  );
}

export default App;
