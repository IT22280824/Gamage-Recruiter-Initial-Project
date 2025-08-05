import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel, Card, Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { Image, Person, Tags } from 'react-bootstrap-icons';

const RecentMedia = () => {
  const [recentMedia, setRecentMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const fetchRecentMedia = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/media/recent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentMedia(res.data.media);
      } catch (err) {
        console.error('Failed to fetch recent media', err);
        setError('Failed to load media. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMedia();
  }, []);

  // Group media into chunks of 3 for carousel slides
  const groupedMedia = [];
  for (let i = 0; i < recentMedia.length; i += 3) {
    groupedMedia.push(recentMedia.slice(i, i + 3));
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ fontWeight: '600' }}>
        Recent Uploads
      </h2>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading media...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : recentMedia.length === 0 ? (
        <Alert variant="info" className="text-center">
          No media found. Upload something to get started!
        </Alert>
      ) : (
        <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} className="shadow-sm">
          {groupedMedia.map((mediaGroup, groupIndex) => (
            <Carousel.Item key={groupIndex}>
              <Container>
                <Row className="g-4">
                  {mediaGroup.map((media) => (
                    <Col key={media._id} md={4}>
                      <Card className="h-100 border-0 shadow-sm">
                        <div className="ratio ratio-16x9">
                          <Card.Img 
                            variant="top" 
                            src={media.url} 
                            alt={media.title}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <Card.Body>
                          <Card.Title className="text-truncate">{media.title}</Card.Title>
                          <div className="d-flex align-items-center mb-2">
                            <Person className="me-2 text-muted" />
                            <small className="text-muted">
                              {media.uploader?.name || 'Unknown'}
                            </small>
                          </div>
                          {media.tags?.length > 0 && (
                            <div className="d-flex align-items-center flex-wrap">
                              <Tags className="me-2 text-muted" />
                              {media.tags.map((tag, i) => (
                                <Badge key={i} bg="light" text="dark" className="me-1 mb-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
};

export default RecentMedia;