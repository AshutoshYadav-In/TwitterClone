import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element: Component }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    } else {
      try {
        const decodedToken = jwtDecode(token);

        if (!decodedToken.userId) {
          toast.warn("Sign In to continue");
          navigate('/signin');
        }
      } catch (error) {
        toast.warn("Sign In to continue");
        navigate('/signin');
      }
    }
  }, [navigate, token]);

  if (!token) {
    return <Navigate to="/signin" />;
  }

  return <Component />;
};

export default ProtectedRoute;
