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
              className="waves-effect waves-light btn" 
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
          <li key="3" style={{ margin: '0 10px' }}>
            <Link to="/blogs">My Blogs</Link>
          </li>,
          <li key="2">
            <a 
              href="#"
              onClick={handleLogout}
            >
              Logout 
            </a> - {auth.displayName}
          </li>
        ];
    }
  };

  return (
    <nav className="indigo">
      <div className="nav-wrapper">
        <Link
          to={auth ? '/blogs' : '/'}
          className="left brand-logo"
          style={{ marginLeft: '10px' }}
        >
          Blogster
        </Link>
        <ul className="right">{renderContent()}</ul>
      </div>
    </nav>
  );
};

export default Header;
