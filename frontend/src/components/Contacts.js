import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  ListGroup,
  Modal,
} from 'react-bootstrap';

function Contact({ token }) {
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

  // Form states for new message
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [alert, setAlert] = useState(null);

  // User messages list
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch user's messages on mount
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendURL}/api/contact/my-messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Failed to load messages.' });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  // Handle form input change for new message
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendURL}/api/contact`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ type: 'success', message: 'Message sent successfully.' });
      setFormData({ name: '', email: '', message: '' });
      // Refresh messages list
      const res = await axios.get(`${backendURL}/api/contact/my-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Error sending message.',
      });
    }
  };

  // Open edit modal
  const openEditModal = (message) => {
    setEditMessage(message);
    setEditText(message.message);
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditMessage(null);
    setEditText('');
  };

  // Save edited message
  const saveEdit = async () => {
    try {
      await axios.put(
        `${backendURL}/api/contact/${editMessage._id}`,
        { message: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(
        messages.map((m) =>
          m._id === editMessage._id ? { ...m, message: editText } : m
        )
      );
      closeEditModal();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to update message.' });
    }
  };

  // Delete a message
  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${backendURL}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((m) => m._id !== id));
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to delete message.' });
    }
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <h3>Contact Messages</h3>

      {/* New Message Form */}
      <Form onSubmit={handleSubmit} className="mb-4">
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Message</Form.Label>
          <Form.Control
            name="message"
            as="textarea"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="mt-2">
          Send Message
        </Button>
      </Form>

      {/* Messages List */}
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ListGroup>
          {messages.map((msg) => (
            <ListGroup.Item key={msg._id} className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{msg.name}</strong> ({msg.email})<br />
                <small>{new Date(msg.createdAt).toLocaleString()}</small>
                <p>{msg.message}</p>
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => openEditModal(msg)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteMessage(msg._id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Edit Message Modal */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Contact;
