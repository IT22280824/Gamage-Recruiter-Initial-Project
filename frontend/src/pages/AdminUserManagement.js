import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Container,
  Alert,
  Spinner,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Dropdown,
  Pagination
} from 'react-bootstrap';
import {
  Search,
  Filter,
  PersonCheck,
  PersonX,
  ShieldCheck,
  ThreeDotsVertical,
  Trash
} from 'react-bootstrap-icons';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === 'verified') {
      results = results.filter(user => user.isVerified);
    } else if (filter === 'admins') {
      results = results.filter(user => user.role === 'admin');
    }

    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users, filter]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/admin/users/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating role');
    }
  };

  const handleVerificationToggle = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8080/api/admin/users/${userId}/toggle-verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, isVerified: !currentStatus } : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating verification');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8080/api/admin/users/${userId}/toggle-active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating active status');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <ShieldCheck className="me-2" />
              User Management
            </h4>
            <div className="d-flex">
              <InputGroup className="me-3" style={{ width: '250px' }}>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Dropdown onSelect={(val) => setFilter(val)}>
                <Dropdown.Toggle variant="outline-secondary">
                  <Filter className="me-1" />
                  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="all">All Users</Dropdown.Item>
                  <Dropdown.Item eventKey="verified">Verified Only</Dropdown.Item>
                  <Dropdown.Item eventKey="admins">Admins Only</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-light rounded-circle d-flex justify-content-center align-items-center me-2"
                            style={{ width: '36px', height: '36px' }}
                          >
                            <PersonCheck size={18} className="text-muted" />
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <small className="text-muted">Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant={user.role === 'admin' ? 'primary' : 'outline-secondary'}
                            size="sm"
                          >
                            {user.role}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleRoleChange(user._id, 'user')}>
                              Set as User
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRoleChange(user._id, 'admin')}>
                              Set as Admin
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                      <td>
                        <Badge bg={user.isVerified ? 'success' : 'warning'} className="text-capitalize">
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="text-dark p-0">
                            <ThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleVerificationToggle(user._id, user.isVerified)}>
                              {user.isVerified ? (
                                <>
                                  <PersonX className="me-2" />
                                  Revoke Verification
                                </>
                              ) : (
                                <>
                                  <PersonCheck className="me-2" />
                                  Verify User
                                </>
                              )}
                            </Dropdown.Item>
                            <Dropdown.Item className="text-danger" onClick={() => handleToggleActive(user._id, user.isActive)}>
                              <Trash className="me-2" />
                              {user.isActive ? 'Deactivate User' : 'Activate User'}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {filteredUsers.length > usersPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminUserManagement;
