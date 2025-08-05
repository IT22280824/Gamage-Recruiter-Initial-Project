import React, { useState } from 'react';
import axios from 'axios';
import {
  Form, Button, Container, Row, Col, Card, Alert, Spinner
} from 'react-bootstrap';
import { Envelope, Person, Lock, Google, ShieldLock } from 'react-bootstrap-icons';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [msg, setMsg] = useState('');
  const [variant, setVariant] = useState('info');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    setLoading(true);
    setMsg('');
    try {
      await axios.post(`${backendURL}/api/otp/send-otp`, {
        email: form.email,
      });
      setVariant('success');
      setMsg('OTP sent to your email. Please check your inbox.');
      setOtpSent(true);
    } catch (err) {
      setVariant('danger');
      setMsg(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      // First step: send OTP
      await sendOtp();
    } else {
      // Second step: verify OTP and register
      setLoading(true);
      setMsg('');
      try {
        const res = await axios.post(`${backendURL}/api/auth/verify-registration`, {
          name: form.name,
          email: form.email,
          password: form.password,
          otp: form.otp,
        });

        setVariant('success');
        setMsg('Registration successful! You can now log in.');
        console.log('Verified:', res.data);
      } catch (err) {
        console.error('Verification error:', err.response?.data || err.message);
        setVariant('danger');
        setMsg(err.response?.data?.message || 'Verification failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${backendURL}/api/auth/google`;
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg rounded-3 overflow-hidden">
            <Card.Body className="p-0">
              <div className="bg-primary text-white p-4 text-center">
                <h2 className="mb-0 fw-bold">Join Us</h2>
                <p className="mb-0">Create your professional account</p>
              </div>

              <div className="p-4">
                {msg && <Alert variant={variant} className="rounded-1">{msg}</Alert>}

                {/* Google OAuth Button */}
                <Button
                  variant="outline-danger"
                  className="w-100 py-2 fw-bold rounded-1 mb-3 d-flex align-items-center justify-content-center"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <Google className="me-2" size={18} />
                  )}
                  Continue with Google
                </Button>

                <div className="d-flex align-items-center mb-3">
                  <div className="border-top flex-grow-1"></div>
                  <div className="px-3 text-muted small">OR</div>
                  <div className="border-top flex-grow-1"></div>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Name */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="text-muted small mb-1">Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Person className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border-start-0 ps-0"
                        disabled={otpSent}
                      />
                    </div>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="text-muted small mb-1">Email Address</Form.Label>
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
                        disabled={otpSent}
                      />
                    </div>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-4 position-relative">
                    <Form.Label className="text-muted small mb-1">Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock className="text-muted" />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Create a strong password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="border-start-0 ps-0"
                        disabled={otpSent}
                      />
                    </div>
                    <div className="form-text">
                      Use 8 or more characters with a mix of letters, numbers & symbols
                    </div>
                  </Form.Group>

                  {/* OTP Input */}
                  {otpSent && (
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label className="text-muted small mb-1">OTP Code</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <ShieldLock className="text-muted" />
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Enter the OTP sent to your email"
                          name="otp"
                          value={form.otp}
                          onChange={handleChange}
                          required
                          className="border-start-0 ps-0"
                        />
                      </div>
                    </Form.Group>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-2 fw-bold rounded-1"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {otpSent ? 'Verifying...' : 'Sending OTP...'}
                      </>
                    ) : (
                      otpSent ? 'Verify & Register' : 'Send OTP'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <a href="/login" className="text-decoration-none">Sign in</a>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-3">
            <p className="text-muted small">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
