import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrainingPage() {
  const [username, setUsername] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Fetch levels from backend with API Key
    fetch('http://localhost:8080/enums/levels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.levels && data.levels.length > 0) {
          setLevels(data.levels);
          setSelectedLevel(data.levels[0]);
        }
      })
      .catch(error => console.error('Error fetching levels:', error));
  }, []);

  const handleStartTraining = () => {
    localStorage.setItem('selectedLevel', selectedLevel);
    navigate('/training-started');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-poker">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg w-96 text-white backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome, {username}!</h1>
        <h2 className="text-lg font-semibold mb-2 text-center">Choose your level</h2>
        {levels.length > 0 ? (
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400"
          >
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        ) : (
          <p className="text-center">Loading levels...</p>
        )}
        <button 
          onClick={handleStartTraining} 
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-300 shadow-lg"
          disabled={levels.length === 0}
        >
          Start Training
        </button>
      </div>
    </div>
  );
}
