import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import TemporaryDrawer from "./drawer.jsx";
import Button from "../Button/index.jsx";
import { Link, useNavigate } from "react-router-dom";
// import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") == "dark" ? true : false,
  );

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  useEffect(() => {
    if (localStorage.getItem("theme") == "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") != "dark") {
      setDark();
    } else {
      setLight();
    }
    setDarkMode(!darkMode);
    toast.success("Theme Changed!");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    toast.success("Logged out");
    navigate("/");
  };

  const handleEditProfile = () => {
    setMenuOpen(false);
    navigate("/dashboard");
  };

  const handleAuthNavigate = () => {
    setMenuOpen(false);
    navigate("/register");
  };

  return (
    <div className="header">
      <h1 className="logo">
        Coinpulse<span style={{ color: "var(--blue)" }}>.</span>
      </h1>
      <div className="links">
        <Link to="/">
          <p className="link">Home</p>
        </Link>
        <Link to="/compare">
          <p className="link">Compare</p>
        </Link>
        <Link to="/watchlist">
          <p className="link">Watchlist</p>
        </Link>
        <Link to="/dashboard">
          <Button text={"Dashboard"} />
        </Link>
      </div>

      {/* <Switch checked={darkMode} onChange={changeMode} /> */}

      <div className="profile-area" ref={menuRef}>
        <div
          className="profile-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          title={user ? user.name : "Account"}
        >
          <AccountCircleIcon style={{ fontSize: 32, color: "var(--blue)" }} />
        </div>

        {menuOpen && (
          <div className="profile-menu">
            {user ? (
              <>
                <div className="profile-menu-item" onClick={handleEditProfile}>
                  Edit Profile
                </div>
                <div className="profile-menu-item" onClick={handleLogout}>
                  Logout
                </div>
              </>
            ) : (
              <div className="profile-menu-item" onClick={handleAuthNavigate}>
                Login / Sign Up
              </div>
            )}

            <div
              className="profile-menu-item"
              onClick={() => {
                changeMode();
                setMenuOpen(false);
              }}
            >
              Toggle Theme
            </div>
          </div>
        )}
      </div>

      <div className="drawer-component">
        <TemporaryDrawer darkMode={darkMode} changeMode={changeMode} />
      </div>
    </div>
  );
};

export default Header;
