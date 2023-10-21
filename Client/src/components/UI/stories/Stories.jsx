import React from "react";
import profileIcon from "../../../assets/assets/icons8-account-24.png";


const Stories = () => {
  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-start mt-1 mb-3">
        <div className="col-1 me-4">
          <img className="story-icon " src={profileIcon} alt="profileIcon" />
        </div>
        <div className="col-1 me-4">
          <img className="story-icon " src={profileIcon} alt="profileIcon" />
        </div>
        <div className="col-1 me-4">
          <img className="story-icon " src={profileIcon} alt="profileIcon" />
        </div>
        <div className="col-1 me-4">
          <img className="story-icon " src={profileIcon} alt="profileIcon" />
        </div>
        <div className="col-1 me-4">
          <img className="story-icon " src={profileIcon} alt="profileIcon" />
        </div>
        <div className="col-1 me-4">
          <img className="story-icon " src={profileIcon} alt="profileIcon" />
        </div>
      </div>
    </div>
  );
};

export default Stories;
