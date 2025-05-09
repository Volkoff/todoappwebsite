import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      // Store signup data in localStorage
      localStorage.setItem(`signup_${email}`, JSON.stringify({
        email,
        password,
        displayName,
        createdAt: new Date().toISOString()
      }));

      // Send verification email
      await sendVerificationEmail(email);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const verificationCode = generateVerificationCode();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      // Store the code in localStorage
      localStorage.setItem(`verification_${email}`, JSON.stringify({
        code: verificationCode,
        expiresAt: expirationTime.toISOString()
      }));

      // Send verification email using EmailJS
      const templateParams = {
        to_email: email,
        verification_code: verificationCode,
        expiry_time: '5 minutes'
      };

      await emailjs.send(
        'service_0ib7n3n',
        'template_5x3oqpj',
        templateParams,
        'YH9NmHLj-Vm3qDQ7Q'
      );
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    try {
      const storedData = localStorage.getItem(`verification_${email}`);
      if (!storedData) {
        throw new Error('No verification code found');
      }

      const { code: storedCode, expiresAt } = JSON.parse(storedData);
      const now = new Date();

      if (new Date(expiresAt) < now) {
        throw new Error('Verification code has expired');
      }

      if (storedCode !== code) {
        throw new Error('Invalid verification code');
      }

      // Get the stored signup data
      const signupData = localStorage.getItem(`signup_${email}`);
      if (!signupData) {
        throw new Error('Signup data not found');
      }

      const { password, displayName } = JSON.parse(signupData);

      // Create the Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      // Clean up the stored data
      localStorage.removeItem(`verification_${email}`);
      localStorage.removeItem(`signup_${email}`);

      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      await sendVerificationEmail(email);
    } catch (error) {
      console.error('Error resending verification code:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    sendVerificationEmail,
    verifyCode,
    resendVerificationCode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 