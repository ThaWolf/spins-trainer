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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
      <h2 className="text-lg font-semibold mb-2">Choose your level</h2>
      {levels.length > 0 ? (
        <select 
          value={selectedLevel} 
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4"
        >
          {levels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      ) : (
        <p>Loading levels...</p>
      )}
      <button 
        onClick={handleStartTraining} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={levels.length === 0}
      >
        Start Training
      </button>
    </div>
  );
}
