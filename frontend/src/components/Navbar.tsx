import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import "../styles/Navbar.css";
import { ME_QUERY } from '../graphql/queries';
import { LOGOUT_MUTATION } from '../graphql/mutations'; 

const Navbar: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(ME_QUERY); 
  const [logout] = useMutation(LOGOUT_MUTATION);
  const client = useApolloClient(); 
  const navigate = useNavigate();     

  const handleLogout = async () => {
    try {
      await logout();
      await client.clearStore();
      refetch(); 
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };


  const handleProfileclick = () => { 
    navigate('/profile');
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  const user = data?.me;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-buttons">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button className='profile-btn' onClick={handleProfileclick}>Welcome, {user.username}!</button>
              <button className="navbar-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="navbar-btn">Login</button>
              </Link>
              <Link to="/register">
                <button className="navbar-btn">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
