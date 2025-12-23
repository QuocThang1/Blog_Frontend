import { useState } from 'react';
import { Card, Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordResetApi, verifyOtpApi, resetPasswordApi } from '../utils/Api/accountApi';
import '../styles/login.css';
import '../styles/forgotPassword.css';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [devInfo, setDevInfo] = useState(null);
  const navigate = useNavigate();

  const onRequest = async (values) => {
    setLoading(true);
    try {
      const res = await requestPasswordResetApi(values.email);
      toast.success(res.EM || 'If that email exists, an OTP was sent');
      // capture dev-only info (OTP + Ethereal previewUrl) to help local testing
      if (res?.dev) setDevInfo(res.dev);
      setEmail(values.email);
      setStep(2);
    } catch (err) {
      console.error('Request password reset error:', err);
      toast.error(err?.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (values) => {
    setLoading(true);
    try {
      const res = await verifyOtpApi(email || values.email, values.otp);
      toast.success(res.EM || 'OTP verified');
      setResetToken(res.data?.resetToken || null);
      setStep(3);
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(err?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (values) => {
    setLoading(true);
    try {
      const res = await resetPasswordApi(resetToken || values.resetToken, values.newPassword);
      toast.success(res.EM || 'Password reset successful');

      // Capture dev preview if provided
      if (res?.data?.preview) setDevInfo({ ...devInfo, previewUrl: res.data.preview });

      // Auto-redirect to login page after success
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Forgot Password" className="login-card">
        {step === 1 && (
            <Form onFinish={onRequest} layout="vertical">
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
                <Input placeholder="Enter your account email" size="large" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" block size="large" loading={loading} htmlType="submit">
                Send OTP
                </Button>
            </Form.Item>

            {/* Thêm dòng gợi ý quay lại login */}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
                Remember the password?{' '}
                <a href="/login" style={{ fontWeight: 500 }}>
                Return to login
                </a>
            </div>
            </Form>
        )}

        {step === 2 && (
          <Form onFinish={onVerify} layout="vertical">
            <Form.Item name="otp" label="Enter OTP" rules={[{ required: true }]}> 
              <Input placeholder="6-digit code" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block size="large" loading={loading} htmlType="submit">
                Verify OTP
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button type="link" onClick={() => setStep(1)}>Change email</Button>
            </div>
            {/* Dev-only panel: show preview link and OTP when available */}
            {import.meta.env.MODE !== 'production' && devInfo && (
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <div style={{ color: '#fff', opacity: 0.9 }}>
                  <div><strong>Dev OTP:</strong> {devInfo.otp}</div>
                  {devInfo.previewUrl ? (
                    <div style={{ marginTop: 6 }}>
                      <a href={devInfo.previewUrl} target="_blank" rel="noreferrer" style={{ color: '#64b5f6' }}>Open email preview</a>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </Form>
        )}

        {step === 3 && (
          <Form onFinish={onReset} layout="vertical">
            <Form.Item name="newPassword" label="New password" rules={[{ required: true, min: 6 }]}>
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm new password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match'));
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block size="large" loading={loading} htmlType="submit">
                Reset password
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
