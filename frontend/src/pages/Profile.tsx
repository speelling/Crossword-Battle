import React from 'react';
import { useQuery } from '@apollo/client';
import { PROFILE_QUERY } from '../graphql/queries';
import '../styles/Profile.css';
import Navbar from '../components/Navbar';
const Profile: React.FC = () => {  
  const { loading, error, data } = useQuery(PROFILE_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { profile } = data;

  return (
    <>
    <Navbar />
    <div className="profile-container">
      <h1>Profile</h1>
      <h2>Username: {profile.username}</h2>

      <h3>Games</h3>
      <div className="games-list">
        {profile.games.map((game: any) => (
          <div key={game.id} className="game-card">
            <p><strong>Game ID:</strong> {game.id}</p>
            <p><strong>Status:</strong> {game.status}</p>
            {game.winner ? (
              <p><strong>Winner:</strong> {game.winner.username}</p>
            ) : (
              <p>No winner yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Profile;
