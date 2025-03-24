import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ACTIONS = ["CALL", "BET", "ALL_IN", "FOLD"];

export default function TrainingStarted() {
  const [username, setUsername] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [preflopTable, setPreflopTable] = useState(null);
  const [villainAction, setVillainAction] = useState('NONE');
  const [heroHand, setHeroHand] = useState(null);
  const [expectedAction, setExpectedAction] = useState(null);
  const [score, setScore] = useState(0);
  const [fish, setFish] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedLevel = localStorage.getItem('selectedLevel');
    
    if (storedUsername) setUsername(storedUsername);
    if (storedLevel) setSelectedLevel(storedLevel);

    // Fetch preflop table
    fetch(`http://localhost:8080/deck/generate-scenario?level=${storedLevel}`, {
      method: "POST",
      headers: {  'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY }
    })
      .then(response => response.json())
      .then(data => {
        setPreflopTable(data.preflopTable);
        setHeroHand(data.hand);
        setVillainAction(data.expectedActions.villain);
        setExpectedAction(data.expectedActions.hero)
        console.log(data.hand)
      });
  }, []);

  const handleAction = (chosenAction) => {
    if (chosenAction === expectedAction) {
      setScore(score + 1);
    } else {
      setFish(fish + 1);
      alert(`Incorrect! The correct action was ${expectedAction}`);
    }
    resetRound();
  };

  const resetRound = () => {
    fetch(`http://localhost:8080/deck/generate-scenario?level=${selectedLevel}`, {
      method: "POST",
    headers: {'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_KEY }
  })
    .then(response => response.json())
    .then(data => {
      setPreflopTable(data.preflopTable);
      setHeroHand(data.hand);
      setVillainAction(data.expectedActions.villain);
      setExpectedAction(data.expectedActions.hero)
      console.log(data.hand)
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-poker">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg w-[30rem] text-white backdrop-blur-md text-center">
        <h1 className="text-3xl font-bold mb-4">Training Session</h1>
        <h2 className="text-lg font-semibold">User: {username}</h2>
        <h2 className="text-lg font-semibold">Level: {selectedLevel}</h2>
        <h2 className="text-lg font-semibold">Score: {score} | Fish: {fish}</h2>
        {heroHand && (
          <div className="flex justify-center gap-4 my-4">
            {heroHand.map((card, index) => (
               <div key={index} className="w-16 h-24 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url('/images/cards/${card.rank.toLowerCase()}${card.suit.charAt(0).toLowerCase()}.png')` }}>
              </div>
            ))}
          </div>
        )}
        {preflopTable && (
          <>
            <h2 className="text-lg font-semibold">Hero Position: {preflopTable.heroPosition}</h2>
            <h2 className="text-lg font-semibold">Villain Position: {preflopTable.villainPosition}</h2>
            <h2 className="text-lg font-semibold">Stack: {preflopTable.stack}</h2>
            {villainAction !== "NONE" && (
              <h2 className="text-lg font-semibold">Villain Action: {villainAction}</h2>
            )}
          </>
        )}
        <h2 className="text-lg font-semibold mt-4">Choose Your Action:</h2>
        <div className="flex gap-2 mt-2 justify-center">
          {villainAction !== 'NONE'
            ? ACTIONS.map(action => (
                <button key={action} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all" onClick={() => handleAction(action)}>
                  {action}
                </button>
              ))
            : ACTIONS.filter(action => action !== "CALL").map(action => (
                <button key={action} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all" onClick={() => handleAction(action)}>
                  {action}
                </button>
              ))}
        </div>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  );
}
