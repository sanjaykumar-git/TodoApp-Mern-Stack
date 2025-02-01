import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../actions/userActions.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [state, dispatch] = useState({
    success: null,
    error: null,
    isPending: false,
  });

  useEffect(() => {
    if (state.success) {
      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timeoutId); // Clear timeout on unmount
    }
  }, [state.success, navigate]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ ...state, isPending: true, error: null }); // Clear previous errors, set isPending

    try {
      const formData = new FormData(event.target);
      const newState = await register(state, formData);

      if (newState.error) {
        // Check for errors from the API call
        dispatch({ ...state, error: newState.error, isPending: false });
      } else {
        dispatch({
          ...state,
          success: newState.success,
          error: null,
          isPending: false,
        }); // Clear errors on success
      }
    } catch (error) {
      console.error("Registration error:", error); // Log the actual error for debugging
      dispatch({
        ...state,
        error: "An unexpected error occurred.",
        isPending: false,
      }); // User-friendly error
    }
  };

  return (
    <div>
      <div className="container">
        <h1 className="heading">Register</h1>
        <p className="paragraph">Please fill out the form below to register.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit" className="button" disabled={state.isPending}>
            {state.isPending ? "Registering..." : "Register"}
          </button>

          {state.error && <p className="error-message">{state.error}</p>}
          {state.success && (
            <p className="success-message">Registration successful!</p>
          )}
        </form>
        <div className="flex-container">
          <div className="login-link">
            Already have an account?
            <Link to="/login" className="link">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
