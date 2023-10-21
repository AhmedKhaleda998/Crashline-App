import React, { useState } from "react";
import {
  addComment,
  addLike,
  deletePost,
  follow,
  getPostById,
} from "../../../services/posts.service";

const PostCard = ({ p, user, getUserPosts }) => {
  const path = "https://crashline.onrender.com/";
  const post = p;
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState("");
  let commentsCount = post.commentsCount;
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postComments, setPostComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    post.creator && post.creator.isFollowed
  );

  const userId = localStorage.getItem("userId");
  const handleLike = async () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLikesCount(likesCount + 1);
    } else {
      setLikesCount(likesCount - 1);
    }

    await addLike(post._id);
  };
  const getComments = async () => {
    setShowComments(!showComments);
    if (commentsCount > 0 && !showComments) {
      const data = await getPostById(post._id);
      setPostComments(data.post.comments.reverse());
    }
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    await deletePost(post._id);
    getUserPosts();
    setIsDeleting(false);
  };
  const openCommentSection = () => {
    setOpenComment(!openComment);
    setToggleComment(!toggleComment);
  };

  const handleComment = async () => {
    try {
      setIsLoadingComment(true);
      console.log(comment);
      await addComment(post._id, comment);
      commentsCount++;
      getComments();
      openCommentSection(false);
    } catch (error) {}
    setIsLoadingComment(false);
    setOpenComment(false);
    setToggleComment(!toggleComment);
  };
  const handleFollow = async () => {
    setIsFollowed(!isFollowed);
    await follow(post.creator._id);
  };

  const currentDate = new Date();
  const createdAtDate = new Date(post.createdAt);
  const oneDayMilliseconds = 24 * 60 * 60 * 1000;
  const daysAgo = Math.round(
    (currentDate - createdAtDate) / oneDayMilliseconds
  );
  return (
    <div className="card col-12 ms-0 mb-1 z-index-n2 ">
      <div className="container-fluid w-100">
        <div className="row">
          <div className="col-2 p-3">
            <img
              className="rounded-circle"
              src={user ? path + user.picture : path + post.creator.picture}
              alt="profileIcon"
              width={40}
              height={40}
            />
          </div>
          <div className="col-6 ps-1 pe-0">
            <p className="fw-bold logo mt-4">
              {post.creator && post.creator.firstName}{" "}
              {post.creator && post.creator.lastName}
              {user && user.firstName} {user && user.lastName}
            </p>
          </div>

          {user && (
            <div className="col-1 offset-2 mt-4">
              {!isDeleting ? (
                <i onClick={handleDelete} className="bi bi-trash3  del-btn" />
              ) : (
                <div
                  class="spinner-border spinner-border-sm logo"
                  role="status"
                >
                  <span class="sr-only"></span>
                </div>
              )}
            </div>
          )}
          {!user && post.creator._id !== userId && (
            <div className="col-2 offset-2 ms-2 ps-2 pt-3">
              <button
                className={`btn btn-${isFollowed ? `dark` : ``}`}
                style={{
                  backgroundColor: isFollowed ? "#6936F5" : "#ffffff",
                }}
                onClick={handleFollow}
              >
                {isFollowed ? <>Followed</> : <>Follow</>}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="card-img-container">
        <img
          src={path + post.image}
          className="card-img-top post-img"
          alt="Post"
        />
      </div>
      <div className="card-body">
        <i
          className={`bi bi-heart${isLiked ? `-fill` : ``} me-2 post-icons`}
          onClick={handleLike}
        />
        <i
          className={`bi bi-chat-left-dots${
            toggleComment ? `-fill` : ``
          } post-icons`}
          onClick={openCommentSection}
        />
        <i className="bi bi-send ms-2 post-icons" />
        <div className="card-text logo ps-1">
          <p className="">{likesCount} likes</p>
          <p className="text-dark">
            <span className="logo fw-medium">
              {post.creator && post.creator.firstName}{" "}
              {post.creator && post.creator.lastName}
              {user && user.firstName} {user && user.lastName}
            </span>

            {post.content}
          </p>
          <p>{daysAgo === 0 ? <>today</> : <>{daysAgo} days ago</>} </p>

          <div
            className={`container-fluid ${openComment ? "d-block" : "d-none"}`}
          >
            <div className="row ">
              <div className={`form-floating col-8 p-0 ms-0`}>
                <input
                  type="text"
                  name="comment"
                  id={post._id}
                  className={`form-control `}
                  onChange={(e) => setComment(e.target.value)}
                />
                <label htmlFor={post._id}>add a comment</label>
              </div>
              <button
                onClick={handleComment}
                className="btn btn-dark col-3 p-0 m-0 "
                style={{ backgroundColor: "#6936F5" }}
              >
                {isLoadingComment ? <>commenting</> : <>comment</>}
              </button>
            </div>
          </div>
          {commentsCount > 0 ? (
            <p className="fw-light link-underline" onClick={getComments}>
              view all {commentsCount} comments
            </p>
          ) : (
            <p className="fw-light link-underline">No comments yet</p>
          )}
          {showComments &&
            postComments.map((comment) => (
              <p key={comment._id}>
                {comment.creator.firstName} {comment.creator.lastName} :{" "}
                {comment.content}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
