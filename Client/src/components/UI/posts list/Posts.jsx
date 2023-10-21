import React, { useCallback, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getPosts } from "../../../services/posts.service";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const getData = useCallback( async () => {
    try {
      setIsLoading(true);
      const data = await getPosts();
      setPosts(data.posts.reverse());
      setError("");
      setIsLoading(false);
    } catch (error) {
      if(error.response.status===401){
        navigate('/login');
        return;
      }
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  },[]);
  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <>
      {posts.length === 0 && !isLoading && !error ? (
        <p className="centred logo mt-5">No posts yet!!</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} p={post} />)
      )}

      {error && !isLoading && (
        <p className="text-center text-danger fw-bold mt-5">
          Something went wrong..!!!
        </p>
      )}

      {isLoading && (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border logo" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="row mt-5">
        <div className="row mt-3">
          <div className="col"></div>
        </div>
      </div>
    </>
  );
};
export default Posts;
