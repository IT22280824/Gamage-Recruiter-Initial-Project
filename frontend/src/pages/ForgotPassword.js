import React, { useState } from 'react';
import axios from 'axios';
import {
  Form, Button, Container, Row, Col, Card, Alert, Spinner
} from 'react-bootstrap';
import { Envelope, ShieldLock, Lock } from 'react-bootstrap-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [variant, setVariant] = useState('info');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/otp/send-otp`, { email });
      setVariant('success');
      setMsg('OTP sent to your email.');
      setOtpSent(true);
    } catch (err) {
      setVariant('danger');
      setMsg(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setVariant('success');
      setMsg('Password reset successfully. You can now log in.');
    } catch (err) {
      setVariant('danger');
      setMsg(err.response?.data?.message || 'Password reset failed.');
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
              <h2 className="mb-4 text-center">Forgot Password</h2>
              {msg && <Alert variant={variant}>{msg}</Alert>}

              <Form onSubmit={otpSent ? handleResetPassword : (e) => { e.preventDefault(); sendOtp(); }}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Envelope className="text-muted" />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-start-0 ps-0"
                      disabled={otpSent}
                    />
                  </div>
                </Form.Group>

                {otpSent && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>OTP</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <ShieldLock className="text-muted" />
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          className="border-start-0 ps-0"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>New Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Lock className="text-muted" />
                        </span>
                        <Form.Control
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="border-start-0 ps-0"
                        />
                      </div>
                    </Form.Group>
                  </>
                )}

                <Button type="submit" disabled={loading} className="w-100 py-2 fw-bold rounded-1">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {otpSent ? 'Resetting...' : 'Sending OTP...'}
                    </>
                  ) : (
                    otpSent ? 'Reset Password' : 'Send OTP'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <a href="/login">Back to Login</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
