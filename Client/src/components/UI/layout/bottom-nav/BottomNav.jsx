import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import reelsIcon from "../../../../assets/assets/reels-icon.png";
import CreatePost from "../../create-post/CreatePost";

const BottomNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const openModal = () => {
    setIsOpen(true);
    console.log("modal opened");
    // navigate("/createPost");
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log("modal closed");
    // navigate("/feed");
    window.location.reload();
  };
  return (
    <div className="wrapper">
      <nav id="bottom-nav" className="mobile-only">
        <ul className="bottom-nav-list">
          <li className="active">
            <NavLink to={"/feed"}>
              <i className="bi bi-house me-1" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/feed"}>
              <i className="bi bi-search me-1" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/feed"}>
              <img className="bott-icon" src={reelsIcon} alt="reelsIcon" />
            </NavLink>
          </li>

          <li onClick={openModal}>
            <NavLink>
              <i className="bi bi-plus-square me-1" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/profile"}>
              <i className="bi bi-person fs me-1" />
            </NavLink>
          </li>
        </ul>
      </nav>
      <CreatePost isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default BottomNav;
