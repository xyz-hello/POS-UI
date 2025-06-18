import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setIsLoggedIn(true);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input 
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input 
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
