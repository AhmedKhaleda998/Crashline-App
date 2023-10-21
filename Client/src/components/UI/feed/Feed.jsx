import React from "react";
import "./feed.css";
import Posts from "../posts list/Posts";
import TopBar from "./top-nav/TopBar";

const Feed = () => {
  
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <TopBar />
        </div>
      </div>
      <div className="row centred">
        <div className="col-sm-8 col-xl-5 offset-md-1 ">
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default Feed;
