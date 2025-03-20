import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

// Export wrapped components
export const AuthenticatedHeader = withAuth(Header);
export const AuthenticatedSidebar = withAuth(Sidebar);