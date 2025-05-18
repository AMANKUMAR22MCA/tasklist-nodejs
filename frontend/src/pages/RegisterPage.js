import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call signup API
      await api.post("/users/signup", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(
        "Error during registration: " + (err.response?.data?.msg || err.message)
      );
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create an Account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          className="register-input"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="country"
          placeholder="Country"
          onChange={handleChange}
          required
        />
        <button className="register-button" type="submit">
          Register
        </button>
        {/* Link for existing users */}
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
