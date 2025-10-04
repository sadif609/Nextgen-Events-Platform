import React, { useState } from 'react';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

function Registration() {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          {isSignUp ? <SignUp /> : <SignIn />}

          <div className="auth-toggle">
            <button 
              className="btn btn-outline"
              onClick={toggleForm}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;