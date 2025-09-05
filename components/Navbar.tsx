
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles.includes('Admin');
  const isStaff = user?.roles.includes('MedisysStaff');
  const isClinicUser = user && !isAdmin && !isStaff;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-secondary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-bold text-xl flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Medisys Secure
            </Link>
            {user && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/" className={navLinkClass}>Dashboard</NavLink>
                  
                  {/* Clinic User Links */}
                  {isClinicUser && (
                    <>
                      <NavLink to="/upload" className={navLinkClass}>Upload Report</NavLink>
                      <NavLink to="/my-reports" className={navLinkClass}>My Reports</NavLink>
                    </>
                  )}

                  {/* Admin and Staff Links */}
                  {(isAdmin || isStaff) && <NavLink to="/all-reports" className={navLinkClass}>All Reports</NavLink>}

                  {/* Common Link */}
                  <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>

                  {/* Admin Only Link */}
                  {isAdmin && <NavLink to="/manage-users" className={navLinkClass}>Manage Users</NavLink>}
                </div>
              </div>
            )}
          </div>
          {user && (
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-4 hidden sm:block">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
