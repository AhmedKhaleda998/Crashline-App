import axios from "axios";
export const login = async (loginData) => {
  try {
    const response = await axios.post(
      "https://crashline.onrender.com/login",
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Login successful");
    localStorage.setItem("userData", JSON.stringify(loginData));
    localStorage.setItem("userId", response.data.user._id);
    localStorage.setItem("token", response.data.token);
    setTimeout(function () {
      localStorage.setItem("token", "");
    }, 24 * 60 * 60 * 1000);
    localStorage.setItem("isLoggedIn", true);
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error);
    console.log(error.response.data.error);
    throw error;
  }
};
export const register = async (registerData) => {
  let response;
  try {
    response = await axios.post(
      "https://crashline.onrender.com/register",
      registerData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("RegisterErrorMessage", "");
    console.log("Registration successful");

    return response.data;
  } catch (error) {
    console.error(error);
    localStorage.setItem("RegisterErrorMessage", error.response.data.error);
    throw error;
  }
};
