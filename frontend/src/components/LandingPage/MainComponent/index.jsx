import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../Common/Button";
import iphone from "../../../assets/iphone.png";
import gradient from "../../../assets/gradient.png";
import "./styles.css";

function MainComponent() {
  const user = localStorage.getItem("user");
  const isLogged = !!user;

  return (
    <div className="main-flex">
      <div className="info-landing">
        <motion.h1
          className="heading1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Track Crypto
        </motion.h1>
        <motion.h1
          className="heading1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          And Stocks
        </motion.h1>
        <motion.h1
          className="heading2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.7 }}
        >
          Real Time
        </motion.h1>
        <motion.p
          className="info-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Track crypto and stocks through a public api in real time. Visit dashboard to do
          so.
        </motion.p>
        <motion.div
          className="btn-flex"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {isLogged ? (
            <Link to="/dashboard">
              <Button text={"Dashboard"} />
            </Link>
          ) : (
            <Link to="/register">
              <Button text={"Get Started"} />
            </Link>
          )}
        </motion.div>
      </div>
      <div className="gradient-div">
        <img src={gradient} className="gradient" />
        <motion.img
          src={iphone}
          className="iphone"
          initial={{ y: -10 }}
          animate={{ y: 10 }}
          transition={{
            type: "smooth",
            repeatType: "mirror",
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}

export default MainComponent;
