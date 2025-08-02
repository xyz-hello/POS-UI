import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/CommonComponents/Sidebar';
import Header from '../components/CommonComponents/Header';


export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />

        <main className="p-8 overflow-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Welcome, Admin!</h2>
          <p className="text-gray-600 mb-6">Here’s your dashboard overview.</p>

          {/* Add admin-specific widgets or info here */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Settings</h3>
            <p className="text-gray-700">Update your profile or preferences here.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
