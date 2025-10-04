import React from 'react';

const GoogleLoginButton = ({ onLoginClick, loading = false, text = "Continue with Google" }) => {
  return (
    <button
      type="button"
      onClick={onLoginClick}
      disabled={loading}
      className="google-login-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        padding: '12px 20px',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#3c4043',
        fontSize: '14px',
        fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: loading ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = '#f8f9fa';
          e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = '#fff';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      {!loading && (
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: '18px', height: '18px' }}
        />
      )}
      {loading ? 'Signing in...' : text}
    </button>
  );
};

export default GoogleLoginButton;