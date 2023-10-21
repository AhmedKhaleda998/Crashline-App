import axios from "axios";

// const cookies = document.cookie.split("; ");
// let token = "";
// for (let i = 0; i < cookies.length; i++) {
//   const cookie = cookies[i].split("=");
//   if (cookie[0] === "token") {
//     token = cookie[1];
//     break;
//   }
// }
export const getPosts = async () => {
  try {
    const token = localStorage.getItem("token");
   
    const response = await axios.get(
      "https://crashline.onrender.com/posts",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data.error);
    throw error;
  }
};
export const getPostById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `https://crashline.onrender.com/posts/${id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("PostById fetched successfully");
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data.error);
    throw error;
  }
};

export const addPost = async (newPostData) => {
  try {
    const token = localStorage.getItem("token");

    console.log(newPostData.image);
    const formData = new FormData();
    formData.append("title", newPostData.title);
    formData.append("content", newPostData.content);
    formData.append("image", newPostData.image);
    const response = await axios.post(
      `https://crashline.onrender.com/posts`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data.error);
    throw error;
  }
};
export const updatePost = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `https://crashline.onrender.com/posts/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data.error);
    throw error;
  }
};
export const deletePost = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `https://crashline.onrender.com/posts/${id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data.error);
    throw error;
  }
};
export const addLike = async (id) => {
  try {
    console.log(id);

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `https://crashline.onrender.com/posts/${id}/like`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data.error);
    throw error;
  }
};
export const addComment = async (id, content) => {
  console.log(id);
  console.log(content);

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `https://crashline.onrender.com/posts/${id}/comment`,
      {
        content: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data);
    throw error;
  }
};

export const follow = async (id) => {
  console.log(id);

  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      `https://crashline.onrender.com/profile/${id}/follow`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error);
    console.error(error.response.data);
    throw error;
  }
};
