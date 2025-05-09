import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './EmailVerification.module.css';

export default function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { verifyEmail, resendVerificationCode, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await verifyEmail(verificationCode);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setError('');
    
    try {
      await resendVerificationCode();
      setCountdown(60); // 60 seconds cooldown
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Verify Your Email</h1>
        <p className={styles.message}>
          We've sent a verification code to your email address. Please enter it below to verify your account.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.verifyButton}>
            Verify Email
          </button>

          <div className={styles.resendContainer}>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className={styles.resendButton}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
            {countdown > 0 && (
              <span className={styles.countdown}>
                Wait {countdown}s before requesting a new code
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 