import React, { useState, useEffect } from "react";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../actions/userActions.js";

const Login = () => {
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
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  useEffect(() => {
    if (state.success) {
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [state.success, navigate]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ ...state, isPending: true, error: null });

    try {
      const formData = new FormData(event.target);
      const newState = await login(state, formData);

      if (newState.error) {
        dispatch({ ...state, error: newState.error, isPending: false });
      } else {
        dispatch({
          ...state,
          success: newState.success,
          error: null,
          isPending: false,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({
        ...state,
        error: "An unexpected error occurred.",
        isPending: false,
      });
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <div>
      <div className="container">
        <h1 className="heading">Login</h1>
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
          <div className="password-input-container">
            <input
              type={type}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="input password-input"
            />
            <span className="icon" onClick={handleToggle}>
              <Icon className="eye-icon" icon={icon} size={24} />
            </span>
          </div>
          <p className="error-message">{state.error}</p>
          <button type="submit" className="button">
            {state.isPending ? "Logging In..." : "Login"}
          </button>
        </form>
        <div className="flex-container">
          <div className="login-link">
            Don't have an account?
            <Link to="/register" className="link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
