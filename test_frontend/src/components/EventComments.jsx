import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

function EventComments({ eventId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({
    rating: 5,
    comment: '',
    isAnonymous: false
  });
  
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/events/${eventId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to leave a comment');
      return;
    }

    if (!newComment.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/events/${eventId}/comments`, {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        rating: newComment.rating,
        comment: newComment.comment.trim(),
        isAnonymous: newComment.isAnonymous
      });

      setComments(prev => [response.data.comment, ...prev]);
      setNewComment({ rating: 5, comment: '', isAnonymous: false });
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onChange && onChange(star)}
            style={{
              fontSize: '20px',
              color: star <= rating ? '#ffc107' : '#e4e5e9',
              cursor: interactive ? 'pointer' : 'default',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const averageRating = comments.length > 0 
    ? (comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length).toFixed(1)
    : 0;

  return (
    <div className="comments-section" style={{ marginTop: '40px' }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e3e6f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ color: '#5a5c69', margin: 0 }}>Reviews & Comments</h4>
          {comments.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {renderStars(Math.round(averageRating))}
              <span style={{ fontSize: '14px', color: '#858796' }}>
                {averageRating} ({comments.length} review{comments.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleSubmitComment} style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5a5c69' }}>
                Your Rating
              </label>
              {renderStars(newComment.rating, true, (rating) => 
                setNewComment(prev => ({ ...prev, rating }))
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#5a5c69' }}>
                Your Review
              </label>
              <textarea
                value={newComment.comment}
                onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your thoughts about this event..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d3e2',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                maxLength={500}
              />
              <div style={{ fontSize: '12px', color: '#858796', textAlign: 'right', marginTop: '5px' }}>
                {newComment.comment.length}/500 characters
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#5a5c69' }}>
                <input
                  type="checkbox"
                  checked={newComment.isAnonymous}
                  onChange={(e) => setNewComment(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                />
                Post anonymously
              </label>
              
              <button
                type="submit"
                disabled={submitting || !newComment.comment.trim()}
                style={{
                  backgroundColor: submitting || !newComment.comment.trim() ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: submitting || !newComment.comment.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size={16} color="#fff" text="" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        )}

        {!user && (
          <div style={{
            backgroundColor: '#f8f9fc',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '30px',
            border: '1px solid #e3e6f0'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#5a5c69' }}>
              Want to leave a review?
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#858796' }}>
              Please log in to share your thoughts about this event.
            </p>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LoadingSpinner size={40} text="Loading comments..." />
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#858796', fontSize: '16px' }}>
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fc',
                  borderRadius: '8px',
                  border: '1px solid #e3e6f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      {comment.userName ? comment.userName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#5a5c69', marginBottom: '2px' }}>
                        {comment.userName || 'Anonymous User'}
                      </div>
                      {renderStars(comment.rating)}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#858796' }}>
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
                
                <p style={{ 
                  margin: '0',
                  lineHeight: '1.5',
                  color: '#5a5c69',
                  fontSize: '14px'
                }}>
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventComments;