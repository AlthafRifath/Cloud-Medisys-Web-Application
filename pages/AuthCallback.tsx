
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';

const AuthCallback: React.FC = () => {
  const { handleAuthentication, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    
    if (accessToken && idToken) {
      handleAuthentication(accessToken, idToken);
    } else {
      setError("Authentication failed: Missing access_token or id_token in URL hash.");
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    } else if (error) {
      console.error(error);
      navigate('/login', { replace: true });
    }
  }, [user, error, navigate]);

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <Spinner />
      <p className="mt-4 text-gray-400">Finalizing authentication...</p>
    </div>
  );
};

export default AuthCallback;