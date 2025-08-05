import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner, Tab, Tabs, Card, Button } from 'react-bootstrap';
import Sidebar from '../components/Navbar.js';
import MediaCard from '../components/MediaCard.js';
import StatsCard from '../components/StatsCard.js';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recentMedia, setRecentMedia] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [profileRes, mediaRes, statsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/media/recent`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUser(profileRes.data.user);
        setRecentMedia(mediaRes.data.media);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) return <p>Error loading profile. Please try again.</p>;

  return (
    <div className="d-flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      
      <main className="flex-grow-1 p-4" style={{ marginLeft: '280px' }}>
        <Container fluid>
          {activeTab === 'dashboard' && (
            <>
              <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
              
              <Row className="g-4 mb-4">
                <Col md={6} lg={3}>
                  <StatsCard 
                    title="Total Views" 
                    value={stats?.totalViews || 0} 
                    change={stats?.viewsChange || 0} 
                  />
                </Col>
                <Col md={6} lg={3}>
                  <StatsCard 
                    title="Engagement Rate" 
                    value={`${stats?.engagementRate || 0}%`} 
                    change={stats?.engagementChange || 0} 
                  />
                </Col>
                <Col md={6} lg={3}>
                  <StatsCard 
                    title="New Followers" 
                    value={stats?.newFollowers || 0} 
                    change={stats?.followersChange || 0} 
                  />
                </Col>
                <Col md={6} lg={3}>
                  <StatsCard 
                    title="Media Uploaded" 
                    value={stats?.mediaCount || 0} 
                    change={stats?.mediaChange || 0} 
                  />
                </Col>
              </Row>
              
              <Row>
                <Col lg={8}>
                  <h5 className="mb-3 fw-bold">Recent Uploads</h5>
                  {recentMedia.length > 0 ? (
                    recentMedia.map(media => (
                      <MediaCard key={media._id} media={media} />
                    ))
                  ) : (
                    <Card className="border-0 shadow-sm">
                      <Card.Body className="text-center py-5">
                        <p className="text-muted">No recent uploads</p>
                        <Button variant="primary" size="sm">Upload New Media</Button>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
                <Col lg={4}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                      <h5 className="mb-3 fw-bold">Profile Completion</h5>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-grow-1 me-3">
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-primary" 
                              role="progressbar" 
                              style={{ width: `${user.profileCompletion || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <small className="text-muted">{user.profileCompletion || 0}%</small>
                      </div>
                      <Button variant="outline-primary" size="sm" className="w-100">
                        Complete Your Profile
                      </Button>
                    </Card.Body>
                  </Card>
                  
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <h5 className="mb-3 fw-bold">Quick Actions</h5>
                      <Button variant="outline-secondary" size="sm" className="w-100 mb-2">
                        Upload New Media
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="w-100 mb-2">
                        Schedule Post
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="w-100">
                        View Analytics
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
          
          {activeTab === 'media' && (
            <div>
              <h2 className="mb-4 fw-bold">My Media</h2>
              {/* Media tab content */}
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div>
              <h2 className="mb-4 fw-bold">Analytics</h2>
              {/* Analytics tab content */}
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div>
              <h2 className="mb-4 fw-bold">Profile Settings</h2>
              {/* Profile tab content */}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;