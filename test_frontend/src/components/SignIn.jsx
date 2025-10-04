import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import GoogleLoginButton from "./GoogleLoginButton";
import { toast } from 'react-toastify';

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login, handleGoogleLogin, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { email, password } = formData;
    console.log('Login attempt with:', { email, hasPassword: !!password });
    
    try {
      console.log('=== FRONTEND LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Request URL:', 'http://localhost:5000/api/signin');
      
      const requestData = { email, password };
      console.log('Request data:', requestData);
      
      const response = await axios.post('http://localhost:5000/api/signin', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('Login successful:', response.data);
      
      if (response.data.useGoogleAuth) {
        toast.info("Please use Google Sign In for this account");
        return;
      }
      
      const userData = response.data.user;
      const token = response.data.token;
      
      login(userData, token);
      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Invalid credentials or request format');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again.');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt('Enter your email address:');
    if (!email) return;

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Password reset link sent! Check your email.\n\nFor demo: ${data.resetUrl}`);
      } else {
        alert(data.message || 'Error sending reset email');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Forgot password error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Sign In</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ position: 'relative' }}
            >
              {loading ? <LoadingSpinner size={20} color="#fff" text="" /> : 'Login'}
            </button>
            
            <div className="forgot-password">
              <button 
                type="button" 
                className="forgot-password-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </form>

        {/* Temporarily disabled - Google OAuth setup needed */}
        {/* <div className="auth-divider">
          <span>or</span>
        </div>

        <GoogleLoginButton 
          onLoginClick={handleGoogleLogin}
          loading={authLoading}
          text="Sign in with Google"
        /> */}
        
        <div className="auth-footer">
          <p>New here? <Link to='/signup'>Sign Up</Link> now.</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;