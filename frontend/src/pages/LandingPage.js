import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/index.css';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', username);
      navigate('/training');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-poker">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg w-96 text-white backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Poker Trainer Login</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400"
        />
        <button 
          onClick={handleLogin} 
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-300 shadow-lg">
          Login
        </button>
      </div>
    </div>
  );
}
