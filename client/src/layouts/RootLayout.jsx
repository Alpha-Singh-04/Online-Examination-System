import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PropTypes from 'prop-types';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

RootLayout.propTypes = {
  children: PropTypes.node,
};

export default RootLayout;