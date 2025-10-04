import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import GoogleLoginButton from "./GoogleLoginButton";
import { toast } from 'react-toastify';

function SignUp() {
  const navigate = useNavigate();
  const { login, handleGoogleLogin, authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      
      if (response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        navigate('/');
      } else {
        toast.success("User registered successfully!");
        navigate('/login');
      }
      
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error("Error registering user:", err);
      toast.error(err.response?.data?.message || "Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper"  >
      <div className="auth-container" >
        <div className="auth-card signup-card">
          <div className="auth-header">
            <h2 className="auth-title">Sign Up</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ position: 'relative' }}
            >
              {loading ? <LoadingSpinner size={20} color="#fff" text="" /> : 'Register'}
            </button>
          </form>

          {/* Temporarily disabled - Google OAuth setup needed */}
          {/* <div className="auth-divider">
            <span>or</span>
          </div>

          <GoogleLoginButton 
            onLoginClick={handleGoogleLogin}
            loading={authLoading}
            text="Sign up with Google"
          /> */}
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;