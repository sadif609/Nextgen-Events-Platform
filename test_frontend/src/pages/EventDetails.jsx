import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EventComments from "../components/EventComments";
import { toast } from 'react-toastify';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegisterForEvent = async () => {
    if (!user) {
      toast.error("Please log in to register for events");
      navigate('/login');
      return;
    }

    setRegistrationLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/events/${id}/register`, {
        userId: user._id,
        userEmail: user.email
      });

      setEvent(response.data.event);
      toast.success("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error(error.response?.data?.message || "Failed to register for event");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleUnregisterFromEvent = async () => {
    if (!user) return;

    setRegistrationLoading(true);

    try {
      const response = await axios.delete(`http://localhost:5000/api/events/${id}/unregister`, {
        data: { userId: user._id }
      });

      setEvent(response.data.event);
      toast.success("Successfully unregistered from the event");
    } catch (error) {
      console.error("Error unregistering from event:", error);
      toast.error(error.response?.data?.message || "Failed to unregister from event");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const isUserRegistered = () => {
    if (!user || !event?.registeredUsers) return false;
    return event.registeredUsers.some(registration => 
      registration.userId === user._id
    );
  };

  const isEventFull = () => {
    return event?.maxAttendees && event.currentAttendees >= event.maxAttendees;
  };

  const canUserEdit = () => {
    return user && event && user.email === event.userEmail;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner size={50} text="Loading event details..." fullScreen />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page">
        <div className="container">
          <div className="no-events-found">
            <h3>Event not found</h3>
            <Link to="/events" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="event-details-container">
          {/* Event Header */}
          <div className="event-details-card">
            <div className="event-details-image-wrapper">
              <img
                src={getImageUrl(event)}
                alt={event.title}
                className="event-details-image"
                onError={(e) => {
                  e.target.src = '/default-event-image.jpg';
                }}
              />
              
              {/* Category Badge */}
              <div className="event-badge event-badge-category event-badge-details-category">
                {event.category}
              </div>

              {/* Price Badge */}
              <div className={`event-badge event-badge-details-price ${event.price > 0 ? 'event-badge-price' : 'event-badge-free'}`}>
                {event.price > 0 ? `৳${event.price}` : 'FREE'}
              </div>
            </div>

            <div className="event-details-content">
              <div className="event-details-header">
                <div className="event-details-title-section">
                  <h1 className="event-details-title">
                    {event.title}
                  </h1>
                  
                  <div className="event-details-meta-grid">
                    <div className="event-details-meta-item">
                      <span className="event-details-meta-icon">📅</span>
                      <div className="event-details-meta-content">
                        <div className="event-details-meta-label">Date</div>
                        <div className="event-details-meta-value">{event.date}</div>
                      </div>
                    </div>
                    
                    <div className="event-details-meta-item">
                      <span className="event-details-meta-icon">📍</span>
                      <div className="event-details-meta-content">
                        <div className="event-details-meta-label">Venue</div>
                        <div className="event-details-meta-value">{event.venue}</div>
                      </div>
                    </div>
                    
                    <div className="event-details-meta-item">
                      <span className="event-details-meta-icon">👥</span>
                      <div className="event-details-meta-content">
                        <div className="event-details-meta-label">Attendees</div>
                        <div className="event-details-meta-value">
                          {event.currentAttendees || 0}
                          {event.maxAttendees && ` / ${event.maxAttendees}`}
                          {isEventFull() && <span className="event-full-indicator"> (Full)</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="event-details-description-section">
                <h3 className="event-details-section-title">About This Event</h3>
                <p className="event-details-description">
                  {event.description}
                </p>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="event-details-tags-section">
                  <h4 className="event-details-section-title">Tags</h4>
                  <div className="event-tags">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="event-tag event-details-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="event-details-actions">
                <Link to="/events" className="btn btn-outline-primary">
                  ← Back to Events
                </Link>

                {canUserEdit() && (
                  <Link 
                    className="btn btn-outline-primary"
                    to={`/edit-event/${event._id}`}
                  >
                    ✏️ Edit Event
                  </Link>
                )}

                {user && !canUserEdit() && (
                  <>
                    {isUserRegistered() ? (
                      <button
                        className="btn btn-danger"
                        onClick={handleUnregisterFromEvent}
                        disabled={registrationLoading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {registrationLoading ? (
                          <LoadingSpinner size={16} color="#fff" text="" />
                        ) : (
                          '✓ Registered'
                        )}
                        <span style={{ marginLeft: registrationLoading ? '8px' : '0' }}>
                          {registrationLoading ? 'Unregistering...' : '- Unregister'}
                        </span>
                      </button>
                    ) : (
                      <button
                        className={`btn ${isEventFull() ? "btn-secondary" : "btn-success"}`}
                        onClick={handleRegisterForEvent}
                        disabled={registrationLoading || isEventFull()}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {registrationLoading ? (
                          <LoadingSpinner size={16} color="#fff" text="" />
                        ) : isEventFull() ? (
                          'Event Full'
                        ) : (
                          '+ Register Now'
                        )}
                        {registrationLoading && (
                          <span style={{ marginLeft: '8px' }}>Registering...</span>
                        )}
                      </button>
                    )}
                  </>
                )}

                {!user && (
                  <Link to="/login" className="btn btn-primary">
                    Login to Register
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <EventComments eventId={event._id} />
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
