import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from 'react-toastify';

const EVENT_CATEGORIES = [
  'All', 'Music', 'Tech', 'Sports', 'Business', 'Art', 'Food', 'Education', 'Health', 'Other'
];

function EventList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    if (!user) {
      toast.error("Please log in to register for events");
      return;
    }

    setRegistrationLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      const response = await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {
        userId: user._id,
        userEmail: user.email
      });

      // Update the event in the local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId ? response.data.event : event
        )
      );

      toast.success("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error(error.response?.data?.message || "Failed to register for event");
    } finally {
      setRegistrationLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleUnregisterFromEvent = async (eventId) => {
    if (!user) return;

    setRegistrationLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      const response = await axios.delete(`http://localhost:5000/api/events/${eventId}/unregister`, {
        data: { userId: user._id }
      });

      // Update the event in the local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId ? response.data.event : event
        )
      );

      toast.success("Successfully unregistered from the event");
    } catch (error) {
      console.error("Error unregistering from event:", error);
      toast.error(error.response?.data?.message || "Failed to unregister from event");
    } finally {
      setRegistrationLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const isUserRegistered = (event) => {
    if (!user || !event.registeredUsers) return false;
    return event.registeredUsers.some(registration => 
      registration.userId === user._id
    );
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner size={50} text="Loading events..." fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h2 className="text-center mb-4">Discover Events</h2>

        {/* Search and Filter Controls */}
        <div className="filter-container mb-4">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events, venues, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <div className="custom-dropdown">
              <div 
                className="dropdown-header"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                <svg className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} width="20" height="20" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 8 4 4 4-4"/>
                </svg>
              </div>
              {dropdownOpen && (
                <div className="dropdown-options">
                  {EVENT_CATEGORIES.map(category => (
                    <div
                      key={category}
                      className={`dropdown-option ${selectedCategory === category ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setDropdownOpen(false);
                      }}
                    >
                      {category === 'All' ? 'All Categories' : category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="events-count">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events-found">
            <h3>No events found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filteredEvents.map((event) => {
              const isRegistered = isUserRegistered(event);
              const isEventFull = event.maxAttendees && event.currentAttendees >= event.maxAttendees;
              
              return (
                <div key={event._id} className="event-card">
                  <div className="event-card-image-wrapper" style={{ position: 'relative' }}>
                    <img
                      src={getImageUrl(event)}
                      alt={event.title}
                      className="event-card-image-full"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        // Try multiple fallbacks
                        if (!e.target.dataset.fallbackAttempted) {
                          e.target.dataset.fallbackAttempted = '1';
                          e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80';
                        } else if (e.target.dataset.fallbackAttempted === '1') {
                          e.target.dataset.fallbackAttempted = '2';
                          e.target.src = 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Event+Image';
                        } else {
                          // Hide image and show fallback
                          e.target.style.display = 'none';
                        }
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', e.target.src);
                        e.target.style.display = 'block';
                      }}
                      style={{ display: 'block' }}
                    />
                    {/* Category Badge */}
                    <div className="event-badge event-badge-category">
                      {event.category}
                    </div>
                    {/* Price Badge */}
                    {event.price > 0 && (
                      <div className="event-badge event-badge-price">
                        ৳{event.price}
                      </div>
                    )}
                    {event.price === 0 && (
                      <div className="event-badge event-badge-free">
                        FREE
                      </div>
                    )}
                  </div>
                  
                  <div className="event-card-content">
                    <div className="event-card-header">
                      <h3 className="event-card-title">{event.title}</h3>
                    </div>
                    
                    <div className="event-card-body">
                      <p className="event-card-description" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                      <p className="event-card-meta-text"><strong>📅 Date:</strong> {event.date}</p>
                      
                      {/* Attendees Info */}
                      <div className="event-attendees-info">
                        👥 {event.currentAttendees || 0} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        {isEventFull && <span className="event-full-indicator"> (Full)</span>}
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="event-tags">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="event-tag">
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="event-tags-more">
                              +{event.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="event-card-footer">
                      <div className="event-card-actions">
                      <button 
                        className="btn btn-outline-primary event-btn-details" 
                        onClick={() => handleViewDetails(event._id)}
                      >
                        View Details
                      </button>
                      
                      {user && (
                        <>
                          {isRegistered ? (
                            <button
                              className="btn event-btn-registered"
                              onClick={() => handleUnregisterFromEvent(event._id)}
                              disabled={registrationLoading[event._id]}
                            >
                              {registrationLoading[event._id] ? (
                                <LoadingSpinner size={12} color="#fff" text="" />
                              ) : (
                                '✓ Registered'
                              )}
                            </button>
                          ) : (
                            <button
                              className={`btn ${isEventFull ? 'event-btn-full' : 'event-btn-register'}`}
                              onClick={() => handleRegisterForEvent(event._id)}
                              disabled={registrationLoading[event._id] || isEventFull}
                            >
                              {registrationLoading[event._id] ? (
                                <LoadingSpinner size={12} color="#fff" text="" />
                              ) : isEventFull ? (
                                'Full'
                              ) : (
                                'Register'
                              )}
                            </button>
                          )}
                        </>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventList;