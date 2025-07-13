// frontend/src/components/Nav.jsx

import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openPartners, setOpenPartners] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          {/* Logo - made more responsive */}
          <div className="flex items-center">
            <Link to="/">
              <motion.div 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-lg sm:text-xl font-bold text-white">M</span>
              </motion.div>
            </Link>
            <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-emerald-900">MealMesh</span>
          </div>

          {/* Desktop Navigation - remains hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-4 md:space-x-8 relative">
            <Link to="/" className="text-emerald-800 hover:text-emerald-600">
              Home
            </Link>
            <Link to="/about" className="text-emerald-800 hover:text-emerald-600">
              About
            </Link>
            
            {/* Partners dropdown with hover functionality */}
            <div 
              className="relative" 
              onMouseEnter={() => setOpenPartners(true)}
              onMouseLeave={() => setOpenPartners(false)}
            >
              <div className="text-emerald-800 hover:text-emerald-600 cursor-pointer">
                Partners
              </div>

              {openPartners && (
                <div className="flex flex-col items-center space-y-4 absolute top-6 left-0 bg-white/90 backdrop-blur-sm border border-emerald-100 p-5 rounded-lg shadow-md">
                  <Link to="/donors" className="text-emerald-800 hover:text-emerald-600 whitespace-nowrap">
                    Donors
                  </Link>
                  <Link to="/organizations" className="text-emerald-800 hover:text-emerald-600 whitespace-nowrap">
                    Organizations
                  </Link>
                </div>
              )}
            </div>

            <Link to="/food-safety" className="text-emerald-800 hover:text-emerald-600">
              Food Safety
            </Link>

            <Link to="/contact" className="text-emerald-800 hover:text-emerald-600">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/${user?.type}/dashboard`}
                  className="text-emerald-800 hover:text-emerald-600"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile"
                  className="text-emerald-800 hover:text-emerald-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-emerald-800 hover:text-emerald-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login?type=donor" className="text-emerald-800 hover:text-emerald-600">
                  Login
                </Link>
                <Link to="/auth/register?type=donor" className="text-emerald-800 hover:text-emerald-600">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - better tap target */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex items-center justify-center w-10 h-10 text-emerald-800 hover:text-emerald-600"
            aria-label="Toggle menu"
          >
            {isOpen ? 
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg> : 
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu - improved spacing and touch targets */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden bg-white/90 backdrop-blur-sm border-t border-emerald-100"
        >
          <div className="px-4 py-2 space-y-0">
            {/* Mobile nav links with improved tap targets */}
            <Link
              to="/"
              className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/donors"
              className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Donors
            </Link>
            <Link
              to="/organizations"
              className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Organizations
            </Link>
            <Link
              to="/food-safety"
              className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Food Safety
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {user ? (
              <>
                <Link
                  to={`/${user.type}/dashboard`}
                  className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login?type=donor"
                  className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register?type=donor"
                  className="block py-3 text-emerald-800 hover:text-emerald-600 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Nav;
