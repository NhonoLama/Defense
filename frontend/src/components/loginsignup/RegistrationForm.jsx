import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import "../../styles/styles.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });
  const [message, setMessage] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false); // New state for showing login button
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before new submission

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Registration successful! You can now log in.");
        setFormData({ username: "", email: "", password: "", terms: false }); // Reset form fields
        setShowLoginButton(true); // Show the "Back to Login" button after registration
      } else {
        setMessage(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(
        "An error occurred during registration. Please try again later."
      );
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to login page when button is clicked
  };

  return (
    <div className="form-container">
      <h2 className="title">Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            required
          />
          I agree to the terms & conditions
        </label>
        <button type="submit">Register</button>
      </form>
      {message && <p className="message">{message}</p>}

      {/* Show "Back to Login" button after successful registration */}
      {showLoginButton && (
        <button onClick={handleLoginRedirect} className="back-to-login-button">
          Back to Login
        </button>
      )}
    </div>
  );
};

export default RegistrationForm;
