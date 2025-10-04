import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function UserProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    profileImage: null
  });

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h3 className="empty-state-title">No User Information Found</h3>
            <p className="empty-state-description">
              Please sign in to view your profile.
            </p>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({
      name: user.name || '',
      profileImage: null
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name || '',
      profileImage: null
    });
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('email', user.email);
      
      if (editData.profileImage) {
        formData.append('profileImage', editData.profileImage);
      }

      const response = await axios.put(`https://nextgen-events-backend-b34m.onrender.com/api/users/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      updateUser(response.data.user);
      
      setIsEditing(false);
      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({
        ...editData,
        profileImage: file
      });
    }
  };

  const handleNameChange = (e) => {
    setEditData({
      ...editData,
      name: e.target.value
    });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div 
                className="profile-avatar" 
                style={{ 
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  margin: '0 auto 1rem auto',
                  background: 'linear-gradient(135deg, #0ea5a4, #22c55e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {user.profileImageUrl ? (
                  <img 
                    src={`https://nextgen-events-backend-b34m.onrender.com${user.profileImageUrl}`} 
                    alt="Profile" 
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block',
                      position: 'absolute',
                      top: '0',
                      left: '0'
                    }}
                  />
                ) : (
                  <div 
                    className="avatar-icon"
                    style={{
                      color: 'white',
                      fontSize: '2.5rem',
                      fontWeight: '700'
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Picture Change Button */}
              {isEditing && (
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="profileImage" 
                    style={{
                      background: '#0ea5a4',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      display: 'inline-block',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                  >
                    📷 Change Profile Picture
                  </label>
                </div>
              )}
              
              <h1 className="profile-title">User Profile</h1>
              <p className="profile-subtitle">Manage your account information</p>
            </div>
            
            <div className="profile-content">
              <div className="profile-info-grid">
                <div className="info-item">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={handleNameChange}
                        className="form-input edit-input"
                        placeholder="Enter your name"
                      />
                    ) : (
                      user.name || 'Not provided'
                    )}
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">Email Address</div>
                  <div className="info-value">{user.email}</div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">Account Status</div>
                  <div className="info-value">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">Member Since</div>
                  <div className="info-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              </div>
              
              <div className="profile-actions">
                {isEditing ? (
                  <div className="edit-actions">
                    <button 
                      onClick={handleSave} 
                      disabled={isUploading}
                      className="btn btn-primary"
                    >
                      {isUploading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="btn btn-outline"
                      disabled={isUploading}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                ) : (
                  <div className="view-actions">
                    <button onClick={handleEdit} className="btn btn-primary">
                      <span className="btn-icon">✏️</span>
                      Edit Profile
                    </button>
                    <Link to="/added-events" className="btn btn-outline">
                      <span className="btn-icon">📅</span>
                      View My Events
                    </Link>
                    <Link to="/add-event" className="btn btn-outline">
                      <span className="btn-icon">➕</span>
                      Create Event
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;