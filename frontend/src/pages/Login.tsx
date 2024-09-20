import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ field: string, message: string }[] | null>(null);
  const [login] = useMutation(LOGIN_MUTATION);

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
      console.log('User logged in:', response.data.Login.user);}
  };

  return (
    <div>
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
        <div>
          {errors.map((error, index) => (
            <p key={index}>{error.field}: {error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Login;
