import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { ME_QUERY } from '../graphql/queries'; 
import { useNavigate, Link } from 'react-router-dom'; 
import "../styles/Login.css"

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ field: string, message: string }[] | null>(null);
  const [login] = useMutation(LOGIN_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }], 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await login({
      variables: {
        args: { email, password }
      }
    });

    if (response.data.Login.errors) {
      setErrors(response.data.Login.errors);
    } else if (response.data.Login.user) {
      console.log('User logged in:', response.data.Login.user);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {errors && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index}>{error.field}: {error.message}</p>
          ))}
        </div>
      )}
      <div className="link-container">
        <p>Don't have an account? <Link to="/register">Register</Link></p> {/* Link to Register */}
      </div>
    </div>
  );
};

export default Login;
