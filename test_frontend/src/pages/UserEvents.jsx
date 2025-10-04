import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

function UserEvents() {
  const [events, setEvents] = useState([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user?.email) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/events?userEmail=${user.email}`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchUserEvents();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        setEvents((prev) => prev.filter((event) => event._id !== id));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete event");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-event/${id}`);
  };

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="text-center py-5">
            <p>Please sign in to view your events.</p>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="text-center py-5">
            <p>No events added yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h2 className="text-center mb-4">Your Added Events</h2>
        
        <div className="grid grid-4">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-image-wrapper" style={{ position: 'relative' }}>
                <img
                  src={getImageUrl(event)}
                  alt="Event Banner"
                  className="event-card-image-full"
                  onError={(e) => {
                    e.target.src = '/default-event-image.jpg';
                  }}
                />
                {/* Category Badge */}
                <div className="event-badge event-badge-category">
                  {event.category || 'Event'}
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
                  <p className="event-card-meta-text"><strong>📍 Venue:</strong> {event.venue}</p>
                  
                  {/* Attendees Info */}
                  <div className="event-attendees-info">
                    👥 {event.currentAttendees || 0} registered
                    {event.maxAttendees && ` / ${event.maxAttendees} max`}
                  </div>
                </div>
                
                <div className="event-card-footer">
                  <div className="event-card-actions">
                    <button 
                      className="btn btn-warning" 
                      onClick={() => handleEdit(event._id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserEvents;