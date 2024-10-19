import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Crossword from '../components/Crossword';
import Navbar from '../components/Navbar';
import { ClientToServerEvents, Move, ServerToClientEvents } from '../utils/types';





const SOCKET_SERVER_URL = 'http://localhost:4000';

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [crosswordData, setCrosswordData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      query: { gameId },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('gameState', (gameState: any) => {
      setCrosswordData(gameState);
      setLoading(false);
    });

    socket.on('gameStarted', () => {
      console.log('The game has started');
    });

    socket.on('gameEnded', (data: { gameId: string; winner: string }) => {
      alert(`Game ended! Winner: ${data.winner}`);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('Error:', data.message);
    });

    socket.emit('joinGame', { gameId });

    return () => {
      socket.disconnect(); 
    };
  }, [gameId]);

  const handleMove = (x: number, y: number, value: string) => {
    if (socketRef.current && gameId) {
      const move: Move = { position: { x, y }, value };
      socketRef.current.emit('makeMove', { gameId, move });
    }
  };

  return (
    <>
      <Navbar />
      <div>
        {loading ? (
          <div>Loading game...</div>
        ) : (
          <Crossword
            puzzle={crosswordData.puzzle}
            clues={crosswordData.clues}
            dim={crosswordData.dim}
            onMove={handleMove}
          />
        )}
      </div>
    </>
  );
};

export default Game;
