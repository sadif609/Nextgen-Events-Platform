import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <NavLink to="/" className="header-logo">
            <div className="logo-container">
              <img 
                src="/LogoH.png" 
                alt="NextGen Events Logo" 
                className="animated-logo"
              />
              <span className="logo-text">NextGen Events</span>
            </div>
          </NavLink>
          
          <nav className="header-nav">
            <NavLink 
              to="/events" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Events
            </NavLink>
            <NavLink 
              to="/add-event" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Add Event
            </NavLink>
            {user && (
              <NavLink 
                to="/my-events" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                My Events
              </NavLink>
            )}
          </nav>
          
          <div className="header-actions">
            {user ? (
              <>
                <NavLink to="/profile" className="user-link">
                  <strong>{user.name || user.email}</strong>
                </NavLink>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <div className="auth-buttons">
                <NavLink to="/login" className="btn btn-outline">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="btn btn-primary">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
          
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              <nav className="mobile-nav">
                <NavLink 
                  to="/events" 
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events
                </NavLink>
                <NavLink 
                  to="/add-event" 
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Event
                </NavLink>
                {user && (
                  <NavLink 
                    to="/my-events" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Events
                  </NavLink>
                )}
              </nav>
              
              <div className="mobile-actions">
                {user ? (
                  <>
                    <NavLink 
                      to="/profile" 
                      className="mobile-user-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {(user.name || user.email).split(' ')[0]}
                    </NavLink>
                    <button 
                      className="mobile-logout-btn" 
                      onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/login" 
                      className="mobile-auth-btn mobile-signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </NavLink>
                    <NavLink 
                      to="/register" 
                      className="mobile-auth-btn mobile-signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;