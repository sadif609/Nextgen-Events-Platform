import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from 'react-toastify';

const EVENT_CATEGORIES = [
  'Music', 'Tech', 'Sports', 'Business', 'Art', 'Food', 'Education', 'Health', 'Other'
];

function AddEvent() {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    banner: null,
    bannerUrl: "",
    category: "Other",
    maxAttendees: "",
    price: "0",
    tags: []
  });

  const [imageInputType, setImageInputType] = useState("file");
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setEventData({
      ...eventData,
      banner: e.target.files[0],
    });
  };

  const handleImageTypeChange = (type) => {
    setImageInputType(type);
    setEventData({
      ...eventData,
      banner: null,
      bannerUrl: "",
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !eventData.tags.includes(tagInput.trim())) {
      setEventData({
        ...eventData,
        tags: [...eventData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEventData({
      ...eventData,
      tags: eventData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCategorySelect = (category) => {
    setEventData({
      ...eventData,
      category: category
    });
    setCategoryDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      toast.error("Please log in first.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("date", eventData.date);
    formData.append("venue", eventData.venue);
    formData.append("description", eventData.description);
    formData.append("userEmail", user.email);
    formData.append("category", eventData.category);
    formData.append("maxAttendees", eventData.maxAttendees);
    formData.append("price", eventData.price);
    formData.append("tags", JSON.stringify(eventData.tags));
    
    if (imageInputType === "file" && eventData.banner) {
      formData.append("banner", eventData.banner);
    } else if (imageInputType === "url" && eventData.bannerUrl) {
      formData.append("bannerUrl", eventData.bannerUrl);
    }
  
    try {
      const res = await axios.post("https://nextgen-events-backend-b34m.onrender.com/api/events", formData);
      toast.success("Event created successfully! 🎉");
      
      // Reset form
      setEventData({
        title: "",
        date: "",
        venue: "",
        description: "",
        banner: null,
        bannerUrl: "",
        category: "Other",
        maxAttendees: "",
        price: "0",
        tags: []
      });
      setTagInput("");
      
      const fileInput = document.getElementById("banner-input");
      if (fileInput) fileInput.value = "";
      
      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate("/my-events");
      }, 1500);
      
    } catch (err) {
      console.error("Error submitting event:", err);
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">Create New Event</h2>
              <p className="form-subtitle">Fill in the details to create your event</p>
            </div>
            
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter event title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="Enter venue"
                    value={eventData.venue}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div className="custom-dropdown" ref={dropdownRef}>
                    <div 
                      className="form-input dropdown-trigger"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    >
                      {eventData.category}
                      <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
                        {categoryDropdownOpen ? '▲' : '▼'}
                      </span>
                    </div>
                    {categoryDropdownOpen && (
                      <div className="dropdown-overlay">
                        <div className="dropdown-options">
                          {EVENT_CATEGORIES.map(category => (
                            <div
                              key={category}
                              className="dropdown-option"
                              onClick={() => handleCategorySelect(category)}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: category === eventData.category ? '#0EA5A4' : '#0F1724'
                              }}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Attendees (Optional)</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    placeholder="Leave empty for unlimited"
                    value={eventData.maxAttendees}
                    onChange={handleChange}
                    min="1"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ticket Price (BDT)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0 for free events (in BDT)"
                  value={eventData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  name="description"
                  placeholder="Enter event description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (Optional)</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                {eventData.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {eventData.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '14px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Event Banner</label>
                
                {/* Image Input Type Selector */}
                <div className="image-input-selector" style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleImageTypeChange("file");
                        // Trigger file input click after a small delay
                        setTimeout(() => {
                          const fileInput = document.getElementById("banner-input");
                          if (fileInput) fileInput.click();
                        }, 100);
                      }}
                      className={`btn ${imageInputType === "file" ? "btn-primary" : "btn-secondary"}`}
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '14px',
                        backgroundColor: imageInputType === "file" ? '#007bff' : '#6c757d',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageTypeChange("url")}
                      className={`btn ${imageInputType === "url" ? "btn-primary" : "btn-secondary"}`}
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '14px',
                        backgroundColor: imageInputType === "url" ? '#007bff' : '#6c757d',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      🔗 Image URL
                    </button>
                  </div>
                </div>

                {/* File Upload Input */}
                {imageInputType === "file" && (
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      name="banner"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="file-input"
                      id="banner-input"
                    />
                    <label htmlFor="banner-input" className="file-input-label">
                      {eventData.banner ? eventData.banner.name : "Choose Image"}
                      <span className="file-input-icon">📁</span>
                    </label>
                  </div>
                )}

                {/* URL Input */}
                {imageInputType === "url" && (
                  <div>
                    <input
                      type="url"
                      name="bannerUrl"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      value={eventData.bannerUrl}
                      onChange={handleChange}
                      className="form-input"
                      style={{ marginBottom: '10px' }}
                    />
                    {eventData.bannerUrl && (
                      <div style={{ marginTop: '10px' }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Preview:</p>
                        <img
                          src={eventData.bannerUrl}
                          alt="Banner preview"
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '120px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <p style={{ 
                          display: 'none', 
                          fontSize: '12px', 
                          color: '#dc3545',
                          marginTop: '5px'
                        }}>
                          ❌ Invalid image URL
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ position: 'relative', minHeight: '48px' }}
              >
                {loading ? (
                  <LoadingSpinner size={20} color="#fff" text="Creating Event..." />
                ) : (
                  'Create Event'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEvent;