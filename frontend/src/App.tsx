import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 
import { CREATE_GAME } from './graphql/mutations';
import Navbar from './components/Navbar';
import './styles/App.css';

const App: React.FC = () => {
  const [gameId, setGameId] = useState<string>('');
  const [createGame, { loading: creating }] = useMutation(CREATE_GAME); 
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const response = await createGame();
      const newGameId = response.data.createGame;
      navigate(`/game/${newGameId}`); 
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleJoinGame = () => {
    if (gameId) {
      navigate(`/game/${gameId}`); 
    } else {
      alert('Please enter a valid Game ID');
    }
  };

  return (
    <>
      <Navbar/>
      <div className="app-container">
        <div className="content-box">
          <h1>Welcome to Crossword Battle!</h1>
          <button className="btn" onClick={handleCreateGame} disabled={creating}>
            {creating ? 'Creating...' : 'Create New Game'}
          </button>

          <div className="join-section">
            <h2>Join Game</h2>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter Game ID"
              className="input-field"
            />
            <button className="btn" onClick={handleJoinGame}>Join Game</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
