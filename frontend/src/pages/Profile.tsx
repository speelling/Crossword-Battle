import React from 'react';
import { useQuery } from '@apollo/client';
import { PROFILE_QUERY } from '../graphql/queries';



const Profile: React.FC = () => {  
  
  const { loading, error, data } = useQuery(PROFILE_QUERY);

  console.log(data)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { profile } = data;

  

  return (
    <div>
      <h1>Profile</h1>
      <h2>Username: {profile.username}</h2>

      <h3>Games</h3>
      <ul>
        {profile.games.map((game: any) => (
          <li key={game.id}>
            <p>Game ID: {game.id}</p>
            <p>Status: {game.status}</p>
            {game.winner ? (
              <p>Winner: {game.winner.username}</p>
            ) : (
              <p>No winner yet</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
