import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import user_icon from "../../assets/person.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import "./styles.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/auth";

const LoginSignup = () => {
  const [action, setAction] = React.useState("Sign Up");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

  const resetMessage = () => {
    toast.dismiss();
  };

  const handleSubmit = async () => {
    resetMessage();

    if (!email || !password || (action === "Sign Up" && !name)) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const url = action === "Sign Up" ? `${API_BASE}/register` : `${API_BASE}/login`;
      const body = action === "Sign Up" ? { name, email, password } : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error || "Error occurred");
        return;
      }

      if (action === "Sign Up") {
        toast.success("Registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/"), 700);
      } else {
        const user = data.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          if (user.watchlist) {
            localStorage.setItem("watchlist", JSON.stringify(user.watchlist));
          }
          window.dispatchEvent(new Event("userChanged"));
        }

        toast.success("Login successful");
        setTimeout(() => navigate("/"), 700);
      }
    } catch {
      toast.error("Server Error");
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
          {action !== "Login" && (
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="input password-input">
            <img src={password_icon} alt="" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="direction">
          {action === "Login" ? (
            <>
              Don't have an account?
              <span
                className="toggle-link"
                onClick={() => {
                  setAction("Sign Up");
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
              Already have an account?
              <span
                className="toggle-link"
                onClick={() => {
                  setAction("Login");
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
          <div className="submit" onClick={handleSubmit}>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
