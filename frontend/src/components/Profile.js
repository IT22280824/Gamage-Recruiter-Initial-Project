import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Alert, 
  Form, 
  Modal, 
  Image,
  Spinner,
  Container
} from 'react-bootstrap';
import { 
  Heart, 
  Chat, 
  Bookmark, 
  Send, 
  ThreeDots, 
  PencilSquare,
  Trash,
  Person,
  Gear
} from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';

const Profile = ({ user, token }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  // Upload states
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Edit states
  const [editMedia, setEditMedia] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/media`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMediaList(res.data.media);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [token]);

  const onDrop = acceptedFiles => {
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image to upload');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', caption);
      formData.append('description', caption);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/media/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      setMediaList([res.data.media, ...mediaList]);
      setFile(null);
      setPreview(null);
      setCaption('');
      setShowUploadModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMediaList(mediaList.filter(m => m._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const openEditModal = (media) => {
    setEditMedia(media);
    setCaption(media.title);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editMedia) return;
    if (!caption.trim()) {
      setError('Caption is required');
      return;
    }
    try {
      const body = {
        title: caption,
        description: caption,
      };
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/media/${editMedia._id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMediaList(mediaList.map(m => (m._id === editMedia._id ? { ...m, ...body } : m)));
      setShowEditModal(false);
      setEditMedia(null);
      setCaption('');
    } catch (err) {
      setError('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="profile-container">
      {/* Profile Header */}
      <Row className="mb-5">
        <Col md={4} className="text-center mb-4 mb-md-0">
          <Image 
            src={user.profilePicture || 'https://via.placeholder.com/150'} 
            roundedCircle 
            width={150}
            height={150}
            className="border border-4 border-light shadow"
          />
        </Col>
        <Col md={8}>
          <div className="d-flex align-items-center mb-4">
            <h2 className="mb-0 me-3">{user.username || user.name}</h2>
            <Button variant="outline-secondary" size="sm" className="me-2">
              Edit Profile
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Gear size={18} />
            </Button>
          </div>
          
          <div className="d-flex mb-4">
            <div className="me-4">
              <strong>{mediaList.length}</strong> posts
            </div>
            <div className="me-4">
              <strong>0</strong> followers
            </div>
            <div>
              <strong>0</strong> following
            </div>
          </div>
          
          <div>
            <h5>{user.name}</h5>
            <p className="text-muted">{user.bio || 'No bio yet'}</p>
          </div>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="border-top border-bottom mb-4">
        <div className="d-flex justify-content-center">
          <Button 
            variant="link" 
            className={`text-decoration-none ${activeTab === 'posts' ? 'text-dark fw-bold' : 'text-muted'}`}
            onClick={() => setActiveTab('posts')}
          >
            <div className="d-flex flex-column align-items-center py-3 px-4">
              <div className="border-top border-dark" style={{ width: '100%', opacity: activeTab === 'posts' ? 1 : 0 }}></div>
              POSTS
            </div>
          </Button>
          <Button 
            variant="link" 
            className={`text-decoration-none ${activeTab === 'saved' ? 'text-dark fw-bold' : 'text-muted'}`}
            onClick={() => setActiveTab('saved')}
          >
            <div className="d-flex flex-column align-items-center py-3 px-4">
              <div className="border-top border-dark" style={{ width: '100%', opacity: activeTab === 'saved' ? 1 : 0 }}></div>
              SAVED
            </div>
          </Button>
          <Button 
            variant="link" 
            className={`text-decoration-none ${activeTab === 'tagged' ? 'text-dark fw-bold' : 'text-muted'}`}
            onClick={() => setActiveTab('tagged')}
          >
            <div className="d-flex flex-column align-items-center py-3 px-4">
              <div className="border-top border-dark" style={{ width: '100%', opacity: activeTab === 'tagged' ? 1 : 0 }}></div>
              TAGGED
            </div>
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      {mediaList.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <Person size={48} className="text-muted" />
          </div>
          <h4>No Posts Yet</h4>
          <p className="text-muted">When you share photos and videos, they'll appear on your profile.</p>
          <Button 
            variant="primary" 
            onClick={() => setShowUploadModal(true)}
          >
            Share your first photo
          </Button>
        </div>
      ) : (
        <Row className="g-1">
          {mediaList.map(m => (
            <Col xs={6} md={4} lg={3} key={m._id} className="position-relative">
              <div className="post-thumbnail">
                <img 
                  src={m.url} 
                  alt={m.title} 
                  className="w-100" 
                  style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                />
                <div className="post-overlay d-flex justify-content-center align-items-center">
                  <div className="d-flex text-white">
                    <div className="mx-3">
                      <Heart size={24} className="me-1" />
                      <span>0</span>
                    </div>
                    <div className="mx-3">
                      <Chat size={24} className="me-1" />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column flex-md-row" style={{ minHeight: '400px' }}>
            {!preview ? (
              <div 
                {...getRootProps()}
                className="d-flex flex-column justify-content-center align-items-center p-5 bg-light"
                style={{ flex: 1, cursor: 'pointer' }}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <svg 
                    aria-label="Icon to represent media such as images or videos" 
                    className="x1lliihq x1n2onr6" 
                    color="rgb(38, 38, 38)" 
                    fill="rgb(38, 38, 38)" 
                    height="77" 
                    role="img" 
                    viewBox="0 0 97.6 77.3" 
                    width="96"
                  >
                    <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
                    <path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
                    <path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
                  </svg>
                  <h5 className="mt-3">Drag photos and videos here</h5>
                  <Button variant="primary" className="mt-3">
                    Select from computer
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-100 h-100" 
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className="p-3" style={{ flex: 1 }}>
              <div className="d-flex align-items-center mb-3">
                <Image 
                  src={user.profilePicture || 'https://via.placeholder.com/40'} 
                  roundedCircle 
                  width={40}
                  height={40}
                  className="me-2"
                />
                <span className="fw-bold">{user.username || user.name}</span>
              </div>
              <Form.Group className="mb-3">
                <Form.Control 
                  as="textarea" 
                  rows={5} 
                  placeholder="Write a caption..." 
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  style={{ border: 'none', resize: 'none' }}
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button 
                variant="primary" 
                className="w-100" 
                onClick={handleUpload}
                disabled={uploading || !preview}
              >
                {uploading ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control 
                as="textarea" 
                rows={5} 
                placeholder="Write a caption..." 
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={handleEditSave}>
              Done
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Floating Action Button */}
      <Button 
        variant="primary" 
        className="rounded-circle position-fixed" 
        style={{ 
          bottom: '30px', 
          right: '30px', 
          width: '60px', 
          height: '60px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        onClick={() => setShowUploadModal(true)}
      >
        <svg 
          aria-label="New post" 
          className="x1lliihq x1n2onr6" 
          color="rgb(255, 255, 255)" 
          fill="rgb(255, 255, 255)" 
          height="24" 
          role="img" 
          viewBox="0 0 24 24" 
          width="24"
        >
          <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
          <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
        </svg>
      </Button>
    </Container>
  );
};

export default Profile;