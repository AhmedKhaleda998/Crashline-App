import React, { useEffect, useState } from "react";
import profilePhoto from "../../../assets/profilePic.png";
import "./profile.css";
import EditProfile from "../edit-profile/EditProfile";
import {
  getUserInfoById,
  getUserPostsById,
} from "../../../services/user.service";
import PostCard from "../posts list/PostCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState(null);
  const [internet, setInternet] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getUserPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getUserPostsById(userId);
      setPosts(data.posts.reverse());
      setError(null);
    } catch (error) {
      if(error.response.status===401){
        navigate('/login');
      }
      setError(error.response.data.error);
      throw error;
    }
    setIsLoading(false);
  };
  const getUserInfo = async () => {
    try {
      setIsLoading(true);
        const data = await getUserInfoById(userId);
        setUser(data.user);
        setError(null);
        setInternet(true);
        setIsLoading(false);
      
    } catch (error) {
      if(error.response.status===401){
        navigate('/login');
      }
        setIsLoading(true);
        setError(error.response.data.message);
      throw error;
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getUserPosts();
    getUserInfo();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
    console.log("modal opened");
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log("modal closed");
  };
  const path = "https://crashline.onrender.com/";
  
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10 offset-md-3 offset-lg-2 col-12">
            <div className=" container-fluid">
              <div className="row">
                <div className="col-3 centred">
                  <div className="">
                    <img
                      className="rounded-circle mt-1 ms-5"
                      src={user.picture ? path + user.picture : profilePhoto}
                      alt="profilePhoto"
                      width={140}
                      height={140}
                    />
                  </div>
                </div>
                <div className="col-7  offset-2">
                  <div className="row ">
                    <div className="col-sm-3 offset-1 col-12 m-0">
                      <span className="t-color fw-bold">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    <div className="col-sm-4 col-xs-4 col-12 ">
                      <button
                        className="btn one btn-dark bg-trash btn-sm w-100 p-0 "
                        style={{ backgroundColor: "#6936F5" }}
                        onClick={openModal}
                      >
                        Edit profile
                      </button>
                    </div>
                    <EditProfile
                      isOpen={isOpen}
                      onClose={closeModal}
                      getUserInfo={getUserInfo}
                    />
                    <div className=" col-sm-4 col-xs-4 col-12 ">
                      <button
                        className="btn one btn-dark btn-sm w-100 p-0 bg-trash"
                        style={{ backgroundColor: "#6936F5" }}
                      >
                        Share profile
                      </button>
                    </div>
                  </div>
                  <div className="pff row  mt-1">
                    <div className="col-3  t-color text-center">
                      <span>Posts {posts.length}</span>
                    </div>
                    <div className="col-4 t-color text-center">
                      <span>Followers {user.followers?user.followers.length:<>0</>}</span>
                    </div>
                    <div className="col-4 t-color text-center ms-1">
                      <span>Following {user.followings?user.followings.length:<>0</>}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 mb-4">
                <div className="col-2 ms-2  "></div>
              </div>
              <div className="row centred">
                <div className="col-12 p-0">
                  <div className="row centred mb-2 pe-1 ps-1">
                    {isLoading && (
                      <div className="d-flex justify-content-center align-items-center mt-5">
                        <div className="spinner-border logo" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                    {posts.map((post) => (
                      <div key={post._id} className="col-xl-4 col-md-5 p-1 ">
                        <PostCard
                          p={post}
                          user={user}
                          getUserPosts={getUserPosts}
                        />
                      </div>
                    ))}
                    <div className="container mt-5">
                      <div className="row">
                        <div className="col"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
