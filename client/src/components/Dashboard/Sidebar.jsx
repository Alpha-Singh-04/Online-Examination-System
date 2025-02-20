import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';


const navigationItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Tests', path: '/dashboard/tests' },
  { name: 'Results', path: '/dashboard/results' },
  { name: 'Profile', path: '/dashboard/profile' },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <nav className="mt-5 px-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ),
};

export default Sidebar;