import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  // Support link handlers
  const handleHelpCenter = () => {
    alert("📧 For help and support, please contact us at: contact.ashiqulislam@gmail.com\n\nWe typically respond within 24 hours!");
  };

  const handlePrivacyPolicy = () => {
    alert("🔒 Privacy Policy\n\nWe respect your privacy and are committed to protecting your personal data. Your information is securely stored and never shared with third parties without your consent.\n\nFor detailed privacy policy, contact: contact.ashiqulislam@gmail.com");
  };

  const handleTermsOfService = () => {
    alert("📋 Terms of Service\n\nBy using NextGen Events, you agree to:\n\n• Use the platform responsibly\n• Provide accurate event information\n• Respect other users\n• Follow community guidelines\n\nFor full terms and conditions, contact: contact.ashiqulislam@gmail.com");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            
            {/* Brand Section */}
            <div className="footer-section">
              <div className="footer-brand">
                <h3 className="footer-logo">NextGen Events</h3>
                <p className="footer-tagline">
                  Creating memorable experiences through seamless event management.
                </p>
              </div>
              
              <div className="footer-stats">
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Events Created</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5000+</span>
                  <span className="stat-label">Happy Users</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">All Events</Link></li>
                <li><Link to="/add-event">Create Event</Link></li>
                <li><Link to="/my-events">My Events</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li>
                  <button 
                    onClick={handleHelpCenter}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--c-text-muted)', // Theme color use করুন
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      padding: '0.25rem 0',
                      textAlign: 'left',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      width: '100%'
                    }}
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handlePrivacyPolicy}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--c-text-muted)', // Theme color use করুন
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      padding: '0.25rem 0',
                      textAlign: 'left',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      width: '100%'
                    }}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleTermsOfService}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--c-text-muted)', // Theme color use করুন
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      padding: '0.25rem 0',
                      textAlign: 'left',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      width: '100%'
                    }}
                  >
                    Terms of Service
                  </button>
                </li>
                <li><Link to="/contact">Contact Support</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-heading">Get in Touch</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <a href="mailto:contact.ashiqulislam@gmail.com">
                    contact.ashiqulislam@gmail.com
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🏢</span>
                  <span>Khilgaon, Dhaka - 1219</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+880 164 520 7334</span>
                </div>
              </div>
              
              <div className="social-links">
                <a href="https://facebook.com/sadif609" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <span>f</span>
                </a>
               
                <a href="https://www.linkedin.com/in/ashiqul-islam-sadif/" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <span>in</span>
                </a>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} NextGen Events. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <span>Made with ❤️ in Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background */}
      <div className="footer-bg-animation">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </footer>
  );
}

export default Footer;