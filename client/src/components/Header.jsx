import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const auth = useSelector(state => state.auth);
  console.log(auth);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        window.location.href = 'http://localhost:3000';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderContent = () => {
    switch (auth) {
      case null:
        return null; // Show loading state or spinner
      case false:
        return (
          <li>
            <a 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              href={process.env.NODE_ENV === 'production' 
                ? '/auth/google'
                : 'http://localhost:5000/auth/google'
              }
            >
              Login With Google
            </a>
          </li>
        );
      default:
        return [
          <li key="3" className="mr-4">
            <Link to="/blogs" className="text-white hover:text-gray-200">
              My Blogs
            </Link>
          </li>,
          <li key="2" className="flex items-center">
            <a 
              href="#"
              onClick={handleLogout}
              className="text-white hover:text-gray-200 mr-2"
            >
              Logout
            </a>
            <span className="text-white">- {auth.displayName}</span>
          </li>
        ];
    }
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={auth ? '/blogs' : '/'}
          className="text-white font-bold text-xl"
        >
          Blogster
        </Link>
        <ul className="flex items-center space-x-4">
          {renderContent()}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
