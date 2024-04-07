import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Header.css'; // Make sure your CSS styles are correctly imported

const Header = ({ user, signOut }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const buttonLabel = isHome ? 'Question' : 'Home';
  const linkTo = isHome ? '/template-display' : '/';

  return (
    <header className="header">
      <div className="header-container">
        <h1>Hello {user.username}</h1>
        <div className="navigation">
          {/* Toggle button between 'Question' and 'Home' */}
          <Link to={linkTo} className="nav-button">
            {buttonLabel}
          </Link>
          <button onClick={signOut} className="signout-button">Sign out</button>
        </div>
      </div>
    </header>
  );
}

export default Header;