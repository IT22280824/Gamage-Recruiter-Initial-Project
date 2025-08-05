import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const EditMediaModal = ({ show, onHide, media, onSave, token }) => {
  const [title, setTitle] = useState(media?.title || '');
  const [description, setDescription] = useState(media?.description || '');
  const [tags, setTags] = useState(
    Array.isArray(media?.tags) ? media.tags.join(', ') : media?.tags || ''
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (media) {
      setTitle(media.title);
      setDescription(media.description);
      setTags(Array.isArray(media.tags) ? media.tags.join(', ') : media.tags || '');
    }
  }, [media]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/media/${media._id}`,
        {
          title,
          description,
          tags,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSave(res.data.media);
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update media');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Media</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMediaModal;
