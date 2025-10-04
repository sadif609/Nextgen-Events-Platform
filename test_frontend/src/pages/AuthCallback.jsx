import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, setAuthLoading } = useAuth();

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          login(user, token);
          navigate('/', { replace: true });
        } else {
          toast.error('Authentication failed');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      } finally {
        setAuthLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, login, navigate, setAuthLoading]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <LoadingSpinner size={50} text="Completing authentication..." />
    </div>
  );
}

export default AuthCallback;