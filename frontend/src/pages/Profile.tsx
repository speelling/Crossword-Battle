import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the profile query
const PROFILE_QUERY = gql`
  query Profile {
  profile {
    games {
      createdAt
      gameState
      id
      status
      updatedAt
      winner {
        username
        id
      }
    }
    username
  }
}
`;

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
