import React, { useRef, useState } from "react";
import { addPost } from "../../../services/posts.service";

const CreatePost = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const title = "new post";
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const imgInput =useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleAddPost = async () => {
    const newData = {
      title: title,
      image: image,
      content: content,
    };
    if (content !== "" && image) {
      setError("");
      setIsLoading(true);
      try {
        await addPost(newData);
        setError("");
        setContent("");
        setImage(null);
        imgInput.current.value=null;
        onClose();
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    } else {
      setError("image or title not found");
    }
  };
  return (
    <>
      {isOpen && <div className="modal-backdrop show z-3 w-100 h-100"></div>}
      <div
        key="createPostModal"
        className={`modal fade${isOpen ? " show d-block" : ""}`}
        tabIndex="-1"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create a Post
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {error && <p className="text-center text-danger">{error}</p>}
              <div className="mb-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="img-inp">
                    add new photo here
                  </label>
                  <input
                    id="img-inp"
                    className="form-control"
                    type="file"
                    ref={imgInput}
                    onChange={handleImageChange}
                  />
                </div>

                <div className="form-floating mt-2">
                  <input
                    type="text"
                    className="form-control "
                    name="textMessage"
                    placeholder="What would you like to say?"
                    id="textMessage"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                  />
                  <label className="form-label" htmlFor="textMessage">
                    add description
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn text-light"
                style={{ backgroundColor: "#6936F5" }}
                onClick={handleAddPost}
              >
                {isLoading ? <>Creating new post...</> : <>Create</>}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
