import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('https://nextgen-events-backend-b34m.onrender.com/api/contact', formData);
      
      if (response.data.success) {
        setSubmitMessage('✅ Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      setSubmitMessage('❌ Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="contact-container">
          
          {/* Header */}
          <div className="contact-header">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="contact-content">
            
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="form-textarea"
                      placeholder="Tell us more about how we can help you..."
                    />
                  </div>

                  {submitMessage && (
                    <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
                      {submitMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              
              {/* Quick Contact */}
              <div className="contact-info-card">
                <h3 className="info-card-title">Quick Contact</h3>
                <div className="contact-methods">
                  <div className="contact-method">
                    <span className="method-icon">📧</span>
                    <div className="method-info">
                      <span className="method-label">Email</span>
                      <a href="mailto:contact.ashiqulislam@gmail.com" className="method-value">
                        contact.ashiqulislam@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <span className="method-icon">📍</span>
                    <div className="method-info">
                      <span className="method-label">Location</span>
                      <span className="method-value">Khilgaon, Dhaka - 1219</span>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <span className="method-icon">📞</span>
                    <div className="method-info">
                      <span className="method-label">Phone</span>
                      <span className="method-value">+880 1XXX-XXXXXX</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="contact-info-card">
                <h3 className="info-card-title">Follow Us</h3>
                <div className="social-links-contact">
                  <a href="https://facebook.com/sadif609" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                    <span>f</span>
                    Facebook
                  </a>
                  <a href="https://www.linkedin.com/in/ashiqul-islam-sadif/" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                    <span>in</span>
                    LinkedIn
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;