import React, { useRef, useState } from "react";
import { updateName, updateUserPicture } from "../../../services/user.service";

const EditProfile = ({ isOpen, onClose, getUserInfo }) => {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const imgInput =useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const isValid = lastName !== "" && firstName !== "" && image;

  const userId = localStorage.getItem("userId");
  const handleUpdateUserInfo = async () => {
    const newData = {
      firstName: firstName,
      lastName: lastName,
      image: image,
    };
    if (isValid) {
      setIsLoading(true);
      try {
        await updateUserPicture(userId, newData.image);
        setFirstName('')
        setLastName('')
        setImage(null)
        imgInput.current.value=null;
        setImageError("");
        onClose();
        setIsLoading(false);
      } catch (error) {
        setImageError(error);
        setIsLoading(false);
      }
      try {
        await updateName(userId, newData.firstName, newData.lastName);
        setNameError("");
        setIsLoading(false);
        getUserInfo();
      } catch (error) {
        setNameError(error);
        setIsLoading(false);
      }

      setIsLoading(false);
    } else {
      setImage("image or title not found");
      setNameError("");
    }
  };
  return (
    <>
      {isOpen && <div className="modal-backdrop show w-100 h-100 z-3"></div>}
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
                Edit your profile info
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
              {imageError && (
                <p className="text-center text-danger">
                  image {imageError.response.data.error}
                </p>
              )}
              {nameError && (
                <p className="text-center text-danger">
                  Firstname or Lastname{nameError.response.data.error}
                </p>
              )}
              <div className="mb-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="img-inp">
                    Add new profile photo
                  </label>
                  <input
                    id="img-edit"
                    className="form-control"
                    type="file"
                    ref={imgInput}
                    onChange={handleImageChange}
                  />
                </div>

                <div className="form-floating">
                  <input
                    className="form-control mt-1"
                    type="text"
                    name="setFirstName"
                    placeholder="What would you like to say?"
                    id="setFirstName"
                    value ={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label className="form-label" htmlFor="textMessage">
                    firstName
                  </label>
                </div>
                <div className="form-floating">
                  <input
                    className="form-control mt-1"
                    name="setLastName"
                    type="text"
                    placeholder="What would you like to say?"
                    id="setLastName"
                    value ={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label className="form-label" htmlFor="textMessage">
                    lastName
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn text-light"
                style={{ backgroundColor: "#6936F5" }}
                onClick={handleUpdateUserInfo}
                disabled={!isValid}
              >
                {isLoading ? <>Updating new data...</> : <>Update</>}
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

export default EditProfile;
