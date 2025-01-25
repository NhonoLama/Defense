import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile"; // Import the UserProfile component

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img className="logoimg" src="/logoooo.png" alt="" />
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <i className="fa fa-search"></i>
          </li>
          <li>
            {/* Add the UserProfile component here */}
            <UserProfile />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
