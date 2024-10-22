import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../graphql/mutations";
import { ME_QUERY } from "../graphql/queries";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import "../styles/Register.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ field: string; message: string }[] | null>(null);
  const [register] = useMutation(REGISTER_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }], 
  });

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
      <div className="link-container">
        <p>Already have an account? <Link to="/login">Login</Link></p> 
      </div>
    </div>
  );
};

export default Register;
