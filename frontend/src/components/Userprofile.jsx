import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userprofile.css";

function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // State for storing user profile data
  const navigate = useNavigate();

  // Handle the dropdown menu toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle the logout action
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("stayLoggedIn", "false"); // Update stayLoggedIn to false
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("Token fetched:", token); // Ensure token is not null

      try {
        const response = await fetch("http://localhost:5000/api/user-profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("User data:", data);

        setUser(data); // Store user data in state
      } catch (error) {
        console.error(
          "Error fetching user profile:",
          error.response || error.message
        );
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="user-profile">
      {/* User Profile Icon and Name */}
      <div className="profile-icon" onClick={toggleDropdown}>
        {user ? (
          <div className="userPanel">
            <img
              src={user.profileImageUrl || "user.png"}
              alt="User Profile"
              className="profile-img"
            />
            <span className="user-name">{user.username}</span>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Dropdown Menu for Logout and Watch List */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <span className="hello">Hello! {user.username}</span>
          <Link to="/watchlist" className="dropdown-item">
            Watch List
          </Link>
          <button onClick={handleLogout} className="dropdown-item logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
