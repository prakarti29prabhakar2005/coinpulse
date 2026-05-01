import React, { useState, useEffect } from "react";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import TopButton from "../components/Common/TopButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./EditProfile.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/user";

function EditProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) {
            const parsedUser = JSON.parse(u);
            setUser(parsedUser);
            setName(parsedUser.name || "");
            setEmail(parsedUser.email || "");
        } else {
            navigate("/register");
        }
    }, [navigate]);

    const handleUpdate = async () => {
        if (!name || !email) {
            toast.error("Name and Email are required");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(`${API_BASE}/profile`, {
                currentEmail: user.email,
                name,
                email,
                password,
            });

            if (res.status === 200) {
                toast.success("Profile updated successfully");
                const updatedUser = { ...user, name, email };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("userChanged"));
                // Clear password field after update
                setPassword("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="edit-profile-wrapper">
                <div className="edit-profile-container">
                    <div className="header-of-form">
                        <div className="heading-of-form">Edit Profile</div>
                        <div className="underline"></div>
                    </div>

                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input password-input">
                            <img src={password_icon} alt="" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password (leave blank to keep current)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <div className="submit-container">
                        <div className="submit" onClick={handleUpdate}>
                            {loading ? "Updating..." : "Update Profile"}
                        </div>
                    </div>
                </div>
            </div>
            <TopButton />
            <Footer />
        </>
    );
}

export default EditProfile;
