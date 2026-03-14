import React from "react";
import "./styles.css";

import user_icon from "../../assets/person.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api/auth";

const LoginSignup = () => {
  const [action, setAction] = React.useState("Sign Up");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const resetMessage = () => {
    toast.dismiss();
  };

  const handleSubmit = async (overrideAction) => {
    resetMessage();
    const currentAction = overrideAction || action;

    if (!email || !password || (currentAction === "Sign Up" && !name)) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      const url =
        currentAction === "Sign Up"
          ? `${API_BASE}/register`
          : `${API_BASE}/login`;
      const body =
        currentAction === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error || "An error occurred");
        return;
      }

      // success
      if (currentAction === "Sign Up") {
        toast.success(data.message || "Registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/"), 700);
      } else {
        // Login: store basic user info
        const user = data.user || null;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          window.dispatchEvent(new Event("userChanged"));
        }
        toast.success(data.message || "Login successful");
        setTimeout(() => navigate("/"), 700);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="header-of-form">
          <div className="heading-of-form">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* toasts are displayed via react-toastify */}
        <div className="direction">
          {action === "Login" ? (
            <>
              Don't have an account? Click
              <span
                className="toggle-link signup"
                onClick={() => {
                  setAction("Sign Up");
                  resetMessage();
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account? Click
              <span
                className="toggle-link login"
                onClick={() => {
                  setAction("Login");
                  resetMessage();
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
              >
                Login
              </span>
            </>
          )}
        </div>

        <div className="submit-container">
          <div className="submit" onClick={() => handleSubmit()}>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
