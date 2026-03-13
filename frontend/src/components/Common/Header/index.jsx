import React, { useEffect, useState } from "react";
import './styles.css'
import TemporaryDrawer from './drawer.jsx'
import Button from '../Button/index.jsx'
import { Link } from 'react-router-dom'
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") == "dark" ? true : false
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


  return (
    <div className='header'>
      <h1 className='logo'>Coinpulse<span style={{ color: "var(--blue)" }}>.</span></h1>
      <div className='links'>
        <Link to="/">
          <p className='link'>Home</p>
        </Link>
        <Link to="/compare">
          <p className='link'>Compare</p>
        </Link>
        <Link to="/watchlist">
          <p className='link'>Watchlist</p>
        </Link>
        <Link to="/dashboard">
          <Button
            text={"Dashboard"}
          />
        </Link>

      </div>

      <Switch checked={darkMode} onChange={changeMode} />

      <div className='drawer-component'>
        <TemporaryDrawer darkMode={darkMode} changeMode={changeMode} />
      </div>

    </div>
  )
}

export default Header
