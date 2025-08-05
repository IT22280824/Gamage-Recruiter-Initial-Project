import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Button,
  Form,
  Badge,
  Modal,
  Dropdown,
  Alert,
} from 'react-bootstrap';
import Sidebar from '../components/Navbar.js';
import { useDropzone } from 'react-dropzone';
import Profile from '../components/Profile.js'
import RecentMedia  from '../components/RecentMedia.js'

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload form states
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Edit states
  const [editMedia, setEditMedia] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selected for ZIP download
  const [selectedIds, setSelectedIds] = useState([]);
  const [zipDownloading, setZipDownloading] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch user profile and media list
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [profileRes, mediaRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/media`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(profileRes.data.user);
        setMediaList(mediaRes.data.media);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Dropzone setup for drag & drop file
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    if (f.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
  });

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Please provide an image file and title.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/media/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      setMediaList([res.data.media, ...mediaList]);
      // Reset form
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setTags('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Delete media
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMediaList(mediaList.filter((m) => m._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Open edit modal and fill form
  const openEditModal = (media) => {
    setEditMedia(media);
    setTitle(media.title);
    setDescription(media.description || '');
    // setTags(media.tags ? media.tags.join(', ') : '');
    setTags(Array.isArray(media.tags) ? media.tags.join(', ') : '');
    setShowEditModal(true);
    setFile(null);
    setPreview(null);
    setError('');
  };

  // Handle edit save
  const handleEditSave = async () => {
    if (!editMedia) return;
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      const body = {
        title,
        description,
        tags,
      };
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/media/${editMedia._id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMediaList(mediaList.map((m) => (m._id === editMedia._id ? { ...m, ...body } : m)));
      setShowEditModal(false);
      setEditMedia(null);
      setTitle('');
      setDescription('');
      setTags('');
    } catch (err) {
      setError('Update failed');
    }
  };

  // Toggle select for ZIP download
  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Download selected images as ZIP
  const downloadZip = async () => {
    if (selectedIds.length === 0) {
      alert('Select images to download');
      return;
    }
    setZipDownloading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/media/download-zip`,
        { ids: selectedIds },
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'media.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('ZIP download failed');
    } finally {
      setZipDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) return <p>Error loading user profile.</p>;

  return (
    <div className="d-flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <main className="flex-grow-1 p-4" style={{ marginLeft: '280px' }}>
        <Container fluid>
          {activeTab === 'dashboard' && (
            <>
              <h2>Dashboard Overview</h2>
              <p>
                Welcome back, <b>{user.name}</b>! You have {mediaList.length} media files uploaded.
              </p>
              <RecentMedia />
            </>
          )}

          {activeTab === 'media' && (
            <>
              <h2 className="mb-4">My Media</h2>

              {/* Upload form */}
              <Card className="mb-4 p-3 shadow-sm">
                <Form onSubmit={handleUpload}>
                  <Form.Group className="mb-3">
                    <div
                      {...getRootProps()}
                      className={`border p-3 text-center ${isDragActive ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <img src={preview} alt="Preview" style={{ maxHeight: '150px' }} />
                      ) : (
                        <p>{isDragActive ? 'Drop your image here...' : 'Drag & drop an image here, or click to select'}</p>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tags (comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                  </Form.Group>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Media'}
                  </Button>
                </Form>
              </Card>

              {/* Media list with selection */}
              <Row xs={1} md={3} lg={4} className="g-3">
                {mediaList.length === 0 && <p>No media uploaded yet.</p>}
                {mediaList.map((m) => (
                  <Col key={m._id}>
                    <Card className="shadow-sm">
                      <Card.Img variant="top" src={m.url} style={{ height: '180px', objectFit: 'cover' }} />
                      <Card.Body>
                        <Card.Title>{m.title}</Card.Title>
                        <Card.Text style={{ fontSize: '0.85rem' }}>{m.description?.substring(0, 50)}...</Card.Text>
                        <div>
                          {m.tags?.map((tag) => (
                            <Badge key={tag} bg="info" className="me-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="d-flex justify-content-between mt-2 align-items-center">
                          <Form.Check
                            type="checkbox"
                            checked={selectedIds.includes(m._id)}
                            onChange={() => toggleSelect(m._id)}
                            label="Select"
                          />

                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-basic">
                              Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => openEditModal(m)}>Edit</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDelete(m._id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {mediaList.length > 0 && (
                <div className="mt-4">
                  <Button variant="primary" onClick={downloadZip} disabled={zipDownloading || selectedIds.length === 0}>
                    {zipDownloading ? 'Preparing ZIP...' : `Download ${selectedIds.length} Selected`}
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2>Analytics</h2>
              {/* Add your analytics content */}
              <p>Coming soon...</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              {activeTab === 'profile' && <Profile user={user} token={token} />}
            </div>
          )}

          {/* Edit Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Media</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button variant="primary" onClick={handleEditSave}>
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
