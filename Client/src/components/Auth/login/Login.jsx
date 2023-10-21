import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login.css";
import { login } from "../../../services/auth.service";

const Login = () => {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn")==='true';
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed");
    }
  }, []);
  const initialValues = {
    email: "admin@test.com",
    password: "Admin123",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    // Perform login logic here
    setIsLoading(true);
    try {
      await login(values);
      setIsLoading(false);
      navigate("/feed");
    } catch (error) {
      setIsLoading(false);
      setShowError(true);
      console.error(error);
      const timeout = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isLoggedIn && (
        <div className="form-margin  w-100 d-flex flex-column justify-content-center align-items-center ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid }) => (
              <Form className="w-30 text-center bg-white">
                <div className="container">
                  <h1 className="mt-5 mb-5 logo">Crashline</h1>
                  <span className="text-danger fw-bold text-center">
                    {showError && <>Email or Password is not valid</>}
                  </span>
                  <div className="dv1 p-2">
                    <Field
                      type="text"
                      id="loginEmail"
                      name="email"
                      placeholder="Email"
                      className="p-1 mt-5 w-75"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="error"
                    />
                  </div>
                  <div className="p-2 mt-2 mb-4">
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="p-1 w-75"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="error"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-75 mb-5 "
                    disabled={!isValid}
                    style={{ backgroundColor: "#6936F5" }}
                  >
                    {isLoading ? <>Signing In...</> : <>Sign In</>}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="signUp  w-30 mt-4 pt-3 text-center bg-white">
            <p>
              Don't have an account?
              <NavLink className="logo" to="/register">
                Sign Up
              </NavLink>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
