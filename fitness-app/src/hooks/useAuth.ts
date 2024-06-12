import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt_token'); // Update key to "jwt_token"
    if (jwtToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate('/');
    }
  }, [navigate]);

  return isAuthenticated;
};

export default useAuth;
