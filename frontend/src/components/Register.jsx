import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/users/register`, {username, email, password });
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10 bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-400"
            placeholder="Username"
            required
          />
        </div>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-400"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-400"
            placeholder="Password"
            required
          />
        </div>
        <button className="w-full bg-blue-400 text-white py-2 rounded-md text-lg cursor-pointer">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-lg">
        Already have an account?{" "}
        <Link className="text-blue-600 hover:underline" to={"/login"}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
