import React, { useEffect } from "react";
import logo from "../../../assets/Logo.png";
import "./splashScreen.css";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  localStorage.removeItem("tempToken");

  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn) {
        navigate("/feed");
      } else {
        navigate("/login");
      }
    }, 2000);
  }, []);

  return (
    <div className="container">
      <div className="centred">
        <img className="splashScreen " src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default SplashScreen;
