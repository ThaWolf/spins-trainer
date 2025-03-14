import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ACTIONS = ["CALL", "BET", "ALL_IN", "FOLD"];
const VILLAIN_ACTIONS_FIRST = ["BET", "ALL_IN"];
const VILLAIN_ACTIONS_SECOND = ["NONE", "BET", "ALL_IN"];

export default function TrainingStarted() {
  const [username, setUsername] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [preflopTable, setPreflopTable] = useState(null);
  const [villainAction, setVillainAction] = useState('');
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
    fetch(`http://localhost:8080/preflop-table/random?level=${storedLevel}`, {
      headers: { 'x-api-key': process.env.REACT_APP_API_KEY }
    })
      .then(response => response.json())
      .then(data => {
        setPreflopTable(data);
        const villainGoesFirst = data.villainGoesFirst;
        const chosenVillainAction = villainGoesFirst ? 
          VILLAIN_ACTIONS_FIRST[Math.floor(Math.random() * VILLAIN_ACTIONS_FIRST.length)] : 
          VILLAIN_ACTIONS_SECOND[Math.floor(Math.random() * VILLAIN_ACTIONS_SECOND.length)];
        setVillainAction(chosenVillainAction);

        // Fetch hero hand
        fetch('http://localhost:8080/deck/deal-hand', {
          headers: { 'x-api-key': process.env.REACT_APP_API_KEY }
        })
          .then(response => response.json())
          .then(hand => {
            setHeroHand(hand);
            // Fetch expected action
            fetch('http://localhost:8080/expected-action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_KEY },
              body: JSON.stringify({ hand, rangeData: data.rangeData, villainAction: chosenVillainAction })
            })
              .then(response => response.json())
              .then(expected => setExpectedAction(expected.expectedAction));
          });
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
    fetch(`http://localhost:8080/preflop-tables/random?level=${selectedLevel}`, {
      headers: { 'x-api-key': process.env.REACT_APP_API_KEY }
    })
      .then(response => response.json())
      .then(data => {
        setPreflopTable(data);
        const chosenVillainAction = data.villainGoesFirst ? 
          VILLAIN_ACTIONS_FIRST[Math.floor(Math.random() * VILLAIN_ACTIONS_FIRST.length)] : 
          VILLAIN_ACTIONS_SECOND[Math.floor(Math.random() * VILLAIN_ACTIONS_SECOND.length)];
        setVillainAction(chosenVillainAction);

        fetch('http://localhost:8080/deck/deal-hand', {
          headers: { 'x-api-key': process.env.REACT_APP_API_KEY }
        })
          .then(response => response.json())
          .then(hand => {
            setHeroHand(hand);
            fetch('http://localhost:8080/expected-action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_KEY },
              body: JSON.stringify({ hand, rangeData: data.rangeData, villainAction: chosenVillainAction })
            })
              .then(response => response.json())
              .then(expected => setExpectedAction(expected.expectedAction));
          });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Training Started!</h1>
      <h2 className="text-lg font-semibold">User: {username}</h2>
      <h2 className="text-lg font-semibold">Level: {selectedLevel}</h2>
      <h2 className="text-lg font-semibold">Score: {score} | Fish: {fish}</h2>
      {heroHand && (
        <h2 className="text-lg font-semibold">Hero Hand: {heroHand.hand[0].rank}{heroHand.hand[0].suit}, {heroHand.hand[1].rank}{heroHand.hand[1].suit}</h2>
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
      <div className="flex gap-2 mt-2">
        {preflopTable?.villainGoesFirst
          ? ACTIONS.map(action => (
              <button key={action} className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAction(action)}>
                {action}
              </button>
            ))
          : ACTIONS.filter(action => action !== "CALL").map(action => (
              <button key={action} className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAction(action)}>
                {action}
              </button>
            ))}
      </div>
      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
}
