import React, { useEffect, useState } from "react";
import {
  addComment,
  addLike,
  getPostById,
} from "../../../services/posts.service";
import { useNavigate, useParams } from "react-router-dom";
const Comments = () => {
  const path = "https://crashline.onrender.com/";
  const [post, setPost] = useState({
    commentsCount: null,
    content: "",
    createdAt: "",
    creator: "",
    image: null,
    isLiked: false,
    likesCount: null,
    title: "",
    _id: "",
  });
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);
  const [isLoadingComment, setIsLoadingComment] = useState(false);

  const navigate = useNavigate()
  const getData = async () => {
    try {
    //   setIsLoading(true);
      const data = await getPostById(id);
      setPost(data.post);
     
    } catch (error) {
    //   setError(error.message);
    //   setIsLoading(false);
      throw error;
    }
    // setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLikesCount(likesCount + 1);
    } else {
      setLikesCount(likesCount - 1);
    }

    try {
      await addLike(post._id);
    } catch (error) {}
  };

  const openCommentSection = () => {
    setOpenComment(!openComment);
  };

  const handleComment = async () => {
    try {
      setIsLoadingComment(true);
      console.log(comment);
      await addComment(post._id, comment);
      openCommentSection(false);
    } catch (error) {}
    setIsLoadingComment(false);
    setOpenComment(false);
  };

  const currentDate = new Date();
  const createdAtDate = new Date(post.createdAt);
  const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const daysAgo = Math.round(
    (currentDate - createdAtDate) / oneDayMilliseconds
  );
  return (
    <div className="card col-12 m-2 z-index-n2">
      <div className="row">
        <div className="col-8 d-flex">
          <img
            className=" m-3 me-0 rounded-circle"
            src={user ? path + user.picture : path + post.creator.picture}
            alt="profileIcon"
            width={40}
            height={40}
          />
          <p className="fw-bold logo m-3 mt-4">
            {post.creator.firstName} {user && user.firstName}
            {post.creator.lastName}
            {user && user.lastName}
          </p>
        </div>
        
      </div>

      <img
        src={path + post.image}
        width={1000}
        height={400}
        className="card-img-top"
        alt="Post"
      />
      <div className="card-body">
        <i
          className={`bi bi-heart${isLiked ? `-fill` : ``} me-2 `}
          onClick={handleLike}
        />
        <i className="bi bi-chat-left-dots " onClick={openCommentSection} />
        <i className="bi bi-send ms-2" />
        <div className="card-text logo ps-1">
          <p className="">{likesCount} likes</p>
          <p className="text-dark">
            <span className="logo fw-medium">
              {post.creator.firstName} {user && user.firstName}{" "}
              {post.creator.lastName}
              {user && user.lastName}{" "}
            </span>

            {post.content}
          </p>
          <p
            className="fw-light link-underline"
            onClick={() => navigate(`details/${post._id}`)}
          >
            view all comments
          </p>
          <div className={`container ${openComment ? "d-block" : "d-none"}`}>
            <div className="row ">
              <div className={`form-floating col-10 p-0 ms-0`}>
                <input
                  type="text"
                  name="comment"
                  id="commentInput"
                  className={`form-control `}
                  onChange={(e) => setComment(e.target.value)}
                />
                <label htmlFor="commentInput">add a comment</label>
              </div>
              <button
                onClick={handleComment}
                className="btn btn-dark col-2 p-0 m-0 "
                style={{ backgroundColor: "#6936F5" }}
              >
                {isLoadingComment ? <>Commenting</> : <>comment</>}
              </button>
            </div>
          </div>

          <p>{daysAgo === 0 ? <>today</> : <>{daysAgo} days ago</>} </p>
        </div>
      </div>
    </div>
  );
};

export default Comments;
