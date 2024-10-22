import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Crossword from '../components/Crossword';
import Navbar from '../components/Navbar';
import { ClientToServerEvents, Move, ServerToClientEvents } from '../utils/types';
import "../styles/Game.css";

const SOCKET_SERVER_URL = 'http://localhost:4000';

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [crosswordData, setCrosswordData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'ongoing' | 'ended'>('waiting');
  const [timer, setTimer] = useState(0);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      query: { gameId },
      withCredentials: true,
    });

    socketRef.current = socket;
    

    socket.on('gameState', (gameState: any) => {
      setCrosswordData(gameState);
      setGameStatus(gameState.status);
      setLoading(false);
    });

    socket.on('gameStarted', () => {
      setGameStatus('ongoing');
      console.log('The game has started');
    });

    socket.on('gameEnded', (data: { gameId: string; winner: string }) => {
      setGameStatus('ended');
      alert(`Game ended! Winner: ${data.winner}`);
    });

    socket.on('gameExpired', (data: { gameId: string; message: string }) => {
      alert(data.message);
      navigate('/');
    });

    socket.on('timerUpdate', ({ time }) => {
      setTimer(time);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('Error:', data.message);
    });


    socket.emit('joinGame', { gameId });

    return () => {
      socket.disconnect();
    };
  }, [gameId, navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleMove = (x: number, y: number, value: string) => {
    if (socketRef.current && gameId) {
      const move: Move = { position: { x, y }, value };
      socketRef.current.emit('makeMove', { gameId, move });
    }
  };

  const copyLinkToClipboard = () => {
    const gameLink = window.location.href;
    navigator.clipboard.writeText(gameLink);
  };

  return (
    <>
      <Navbar />
      <div className="game-container">
        <div className="scoreboard">
          <div className="scoreboard-item">
          <p>Status: <span className="game-status">{gameStatus === 'waiting' ? 'Waiting for another player...' : gameStatus === 'ongoing' ? 'Ongoing' : 'Game Ended'}</span></p>
          </div>
          <div className="scoreboard-item">
            <p>Timer: <span className="timer-display">{formatTime(timer)}</span></p>
          </div>
        </div>
        {loading ? (
          <div>Loading game...</div>
        ) : (
          <div className={gameStatus === 'waiting' ? 'blurred' : ''}>
            <Crossword
              puzzle={crosswordData.puzzle}
              clues={crosswordData.clues}
              dim={crosswordData.dim}
              onMove={handleMove}
            />
          </div>
        )}
        {gameStatus === 'waiting' && (
          <div className="waiting-text">
            <p>Waiting...</p>
            <div className="copy-link-box">
              <p>Share this link with another player:</p>
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="game-link-input"
              />
              <button onClick={copyLinkToClipboard} className="copy-button">
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
