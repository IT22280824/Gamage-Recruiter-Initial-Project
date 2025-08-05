import React from 'react';
import { Card, ProgressBar, Badge } from 'react-bootstrap';
import { Eye, Heart, Chat, Share } from 'react-bootstrap-icons';

const MediaCard = ({ media }) => {
  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Img variant="top" src={media.thumbnail || 'https://via.placeholder.com/300x200'} />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0 fs-6">{media.title}</Card.Title>
          <Badge bg={media.status === 'published' ? 'success' : 'warning'}>
            {media.status}
          </Badge>
        </div>
        <Card.Text className="text-muted small mb-3">
          Uploaded on {new Date(media.createdAt).toLocaleDateString()}
        </Card.Text>
        
        <div className="d-flex justify-content-between mb-3">
          <div className="text-center">
            <Eye size={16} className="me-1 text-primary" />
            <small>{media.views || 0} views</small>
          </div>
          <div className="text-center">
            <Heart size={16} className="me-1 text-danger" />
            <small>{media.likes || 0} likes</small>
          </div>
          <div className="text-center">
            <Chat size={16} className="me-1 text-info" />
            <small>{media.comments || 0} comments</small>
          </div>
          <div className="text-center">
            <Share size={16} className="me-1 text-success" />
            <small>{media.shares || 0} shares</small>
          </div>
        </div>
        
        <ProgressBar now={media.completion || 0} label={`${media.completion || 0}%`} />
      </Card.Body>
    </Card>
  );
};

export default MediaCard;