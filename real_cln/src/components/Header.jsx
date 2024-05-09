import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaWindowClose } from "react-icons/fa";
import { useSelector } from "react-redux";
import snow from "../assets/snowman.png";
import "../styles/header.css";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const [nav, setNav] = useState(true);
  const handleToggle = () => {
    setNav((prev) => !prev);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header>
      <div className="header-div">
        <div className="header-div-childOne">
          <Link to="/" className="header-link">
            <span className="header-logo-img">❄️URBAN-NEST</span>
          </Link>
          <form className="header-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              className="header-input-o"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        <nav className={nav ? "nav" : "nav nav-active"}>
          <ul>
            <li onClick={handleToggle}>
              <Link to="/" className="header-link">
                Home
              </Link>
            </li>
            <li onClick={handleToggle}>
              <Link to="/about" className="header-link">
                About
              </Link>
            </li>
            <li onClick={handleToggle}>
              <Link to="/home" className="header-link">
                Inventory
              </Link>
            </li>
            <li onClick={handleToggle}>
              {currentUser ? (
                <Link to="/profile">
                  <img
                    className="nav-user-img"
                    src={currentUser?.rest?.avatar || snow}
                    alt="profile"
                  />
                </Link>
              ) : (
                <Link to="/sign-in" className="header-link">
                  Sign-in
                </Link>
              )}
            </li>
          </ul>
          <button className="close" onClick={handleToggle}>
            <FaWindowClose />
          </button>
        </nav>
        <button className="bars" onClick={handleToggle}>
          <FaBarsStaggered />
        </button>
      </div>
    </header>
  );
};

export default Header;
