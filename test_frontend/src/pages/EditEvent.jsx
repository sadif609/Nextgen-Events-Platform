import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Spinner } from "react-bootstrap";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    banner: "",
    bannerUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageInputType, setImageInputType] = useState("url");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        const data = response.data;
        setEventData({
          ...data,
          bannerUrl: data.banner || data.bannerUrl || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEventData((prev) => ({
      ...prev,
      banner: e.target.files[0],
    }));
  };

  const handleImageTypeChange = (type) => {
    setImageInputType(type);
    setEventData((prev) => ({
      ...prev,
      banner: null,
      bannerUrl: type === "url" ? (prev.bannerUrl || "") : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("venue", eventData.venue);
      formData.append("description", eventData.description);
      
      if (imageInputType === "file" && eventData.banner) {
        formData.append("banner", eventData.banner);
      } else if (imageInputType === "url" && eventData.bannerUrl) {
        formData.append("bannerUrl", eventData.bannerUrl);
      }

      await axios.put(`http://localhost:5000/api/events/${id}`, formData);
      alert("Event updated successfully!");
      navigate("/my-events");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4">Edit Event</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Venue</Form.Label>
          <Form.Control
            type="text"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Image Upload Section */}
        <Form.Group className="mb-3">
          <Form.Label>Event Banner</Form.Label>
          
          {/* Image Input Type Selector */}
          <div className="mb-3">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <Button
                variant={imageInputType === "file" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleImageTypeChange("file")}
              >
                📁 Upload File
              </Button>
              <Button
                variant={imageInputType === "url" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleImageTypeChange("url")}
              >
                🔗 Image URL
              </Button>
            </div>
          </div>

          {/* File Upload Input */}
          {imageInputType === "file" && (
            <Form.Control
              type="file"
              name="banner"
              onChange={handleImageChange}
              accept="image/*"
            />
          )}

          {/* URL Input */}
          {imageInputType === "url" && (
            <div>
              <Form.Control
                type="url"
                name="bannerUrl"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={eventData.bannerUrl}
                onChange={handleChange}
              />
              {eventData.bannerUrl && (
                <div style={{ marginTop: '10px' }}>
                  <small className="text-muted">Preview:</small>
                  <br />
                  <img
                    src={eventData.bannerUrl}
                    alt="Banner preview"
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '120px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      marginTop: '5px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <small style={{ 
                    display: 'none', 
                    color: '#dc3545',
                    marginTop: '5px'
                  }}>
                    ❌ Invalid image URL
                  </small>
                </div>
              )}
            </div>
          )}
        </Form.Group>

        <Button type="submit" variant="primary">
          Update Event
        </Button>
      </Form>
    </Container>
  );
}

export default EditEvent;
