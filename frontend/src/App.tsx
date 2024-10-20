import React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 
import { CREATE_GAME } from './graphql/mutations';
import Navbar from './components/Navbar';
import './styles/App.css';

const App: React.FC = () => {
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

  

  return (
    <>
      <Navbar/>
      <div className="app-container">
        <div className="content-box">
          <h1>Welcome to Crossword Battle!</h1>
          <button className="btn" onClick={handleCreateGame} disabled={creating}>
            {creating ? 'Creating...' : 'Create New Game'}
          </button>

          
        </div>
      </div>
    </>
  );
};

export default App;
