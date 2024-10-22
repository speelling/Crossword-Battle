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

  const wins = profile.games.filter((game: any) => game.winner?.username === profile.username).length;
  const losses = profile.games.filter((game: any) => game.winner?.username !== profile.username && game.winner !== null).length;

  const formatDate = (dateTime: Date) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
    });
    return formattedDate;
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>{profile.username}'s Profile</h1>
          <div className="win-loss">
            <div>
              <p><strong>Wins:</strong> {wins}</p>
            </div>
            <div>
              <p><strong>Losses:</strong> {losses}</p>
            </div>
          </div>
        </div>

        <div className="games-section">
          <h2 className="games-title">Previous Games</h2>
          <table className="games-table">
            <thead>
              <tr>
                <th>Players</th>
                <th>Status</th>
                <th>Winner</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {profile.games.map((game: any) => (
                <tr key={game.id}>
                  <td>{game.users.map((user: any) => user.username).join(' vs ')}</td>
                  <td>{game.status}</td>
                  <td>{game.winner ? game.winner.username : 'No winner yet'}</td>
                  <td>{formatDate(game.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Profile;
