import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER_MUTATION } from "../graphql/mutations";
import { ME_QUERY } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ field: string; message: string }[] | null>(null);
  const [register] = useMutation(REGISTER_MUTATION);

  const { data: me } = useQuery(ME_QUERY);

  console.log(me);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await register({
      variables: {
        args: { username, email, password },
      },
    });

    if (response.data.Register.errors) {
      setErrors(response.data.Register.errors);
    } else if (response.data.Register.user) {
      console.log("User registered:", response.data.Register.user);
      navigate("/");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>
      {errors && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index}>
              {error.field}: {error.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Register;
