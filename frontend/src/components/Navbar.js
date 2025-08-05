import React from 'react';
import { Nav, Button, Image } from 'react-bootstrap';
import { House, Person, Collection, BarChart, Gear, BoxArrowRight } from 'react-bootstrap-icons';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm" 
         style={{ width: '280px', height: '100vh', position: 'fixed' }}>
      <div className="d-flex align-items-center mb-4">
        <Image 
          src={user.profilePicture || 'https://via.placeholder.com/40'} 
          roundedCircle 
          width="40" 
          height="40" 
          className="me-2"
        />
        <div>
          <h6 className="mb-0 fw-bold">{user.name}</h6>
          <small className="text-muted">{user.email}</small>
        </div>
      </div>

      <Nav variant="pills" className="flex-column mb-auto">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            className="d-flex align-items-center"
          >
            <House className="me-2" size={18} />
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'media'} 
            onClick={() => setActiveTab('media')}
            className="d-flex align-items-center"
          >
            <Collection className="me-2" size={18} />
            My Media
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
            className="d-flex align-items-center"
          >
            <BarChart className="me-2" size={18} />
            Analytics
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
            className="d-flex align-items-center"
          >
            <Person className="me-2" size={18} />
            Profile
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="border-top pt-3">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link 
              className="d-flex align-items-center text-muted"
            >
              <Gear className="me-2" size={18} />
              Settings
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              className="d-flex align-items-center text-danger"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              <BoxArrowRight className="me-2" size={18} />
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;