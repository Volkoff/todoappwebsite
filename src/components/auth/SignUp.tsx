import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { signup, verifyCode, resendVerificationCode } = useAuth();
  const navigate = useNavigate();

  const startResendCountdown = () => {
    setResendDisabled(true);
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!displayName.trim()) {
      setError('Please enter a display name');
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, displayName.trim());
      setIsVerificationSent(true);
      startResendCountdown();
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const isValid = await verifyCode(email, verificationCode);
      if (isValid) {
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setError('');
      setLoading(true);
      await resendVerificationCode(email);
      startResendCountdown();
    } catch (error: any) {
      console.error('Resend error:', error);
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h2>Verify Your Email</h2>
          <p className={styles.verificationMessage}>
            We've sent a verification code to {email}. Please check your inbox and enter the code below.
            <br />
            <small>The code will expire in 5 minutes.</small>
          </p>
          <form onSubmit={handleVerification} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              className={styles.resendButton}
              disabled={resendDisabled || loading}
            >
              {resendDisabled 
                ? `Resend code in ${resendCountdown}s` 
                : 'Resend verification code'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="signupDisplayName">Display Name</label>
            <input
              type="text"
              id="signupDisplayName"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="signupEmail">Email</label>
            <input
              type="email"
              id="signupEmail"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="signupPassword">Password</label>
            <input
              type="password"
              id="signupPassword"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="signupConfirmPassword">Confirm Password</label>
            <input
              type="password"
              id="signupConfirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className={styles.authLink}>
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
} 