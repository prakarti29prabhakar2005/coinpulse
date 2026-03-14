import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import "./styles.css";

export default function TemporaryDrawer({ darkMode, changeMode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
  }, []);

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon className="link" />
      </IconButton>
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(false)}>
        <div className="drawer-div">
          {user && (
            <>
              <Link to="/">
                <p className="link">Home</p>
              </Link>
              <Link to="/compare">
                <p className="link">Compare</p>
              </Link>
              <Link to="/watchlist">
                <p className="link">Watchlist</p>
              </Link>
              {/*
              <Link to="/dashboard">
                <p className="link">Dashboard</p>
              </Link>
              */}
            </>
          )}
          <Switch checked={darkMode} onChange={changeMode} />
        </div>
      </Drawer>
    </div>
  );
}
