import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Envelope, Lock } from 'react-bootstrap-icons';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [variant, setVariant] = useState('info');
  const [loading, setLoading] = useState(false);

  // Make sure to define REACT_APP_BACKEND_URL in your .env file as:
  // REACT_APP_BACKEND_URL=http://localhost:8080
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/auth/login`, form);
      setMsg(res.data.message || 'Login successful!');
      setVariant('success');
      // Save token, redirect, etc.
      localStorage.setItem('token', res.data.token);
      // Redirect to dashboard or wherever
      window.location.href = '/dashboard';
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg rounded-3 overflow-hidden">
            <Card.Body className="p-4">
              <h2 className="mb-4 text-center">Login</h2>
              {msg && <Alert variant={variant}>{msg}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Envelope className="text-muted" />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="border-start-0 ps-0"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock className="text-muted" />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="border-start-0 ps-0"
                    />
                  </div>
                </Form.Group>

                <Button type="submit" disabled={loading} className="w-100 py-2 fw-bold rounded-1">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <a href="/register">Don't have an account? Register here</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
