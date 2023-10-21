import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./register.css";
import { register } from "../../../services/auth.service";

const Register = () => {
  const formErrors = localStorage.getItem("RegisterErrorMessage");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn")==='true';
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed");
    }
  }, [isLoggedIn]);
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    // Perform registration logic here
    setIsLoading(true);
    console.log(values);
    try {
      await register(values);
      setShowError(false);
      navigate("/login");
    } catch (error) {
      setShowError(true);
      setIsLoading(false);
      const timeout = setTimeout(() => {
        setShowError(false);
        localStorage.setItem("RegisterErrorMessage", "");
      }, 3000);

      return () => clearTimeout(timeout);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isLoggedIn && (
        <div className="form-margin w-100 d-flex flex-column justify-content-center align-items-center">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid }) => (
              <Form className="w-30 text-center bg-white registerForm">
                <div className="container">
                  <h1 className="mt-5 logo">Crashline</h1>
                  <span className="text-danger fw-bold text-center">
                    {showError && <>{formErrors}</>}
                  </span>
                  <div className="dv1">
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      className="p-1 mt-5 w-75"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="p"
                      className="error-message"
                    />
                  </div>
                  <div className="dv1 mt-2">
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      className="p-1 mt-2 w-75"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="error-message"
                    />
                  </div>
                  <div className="dv1 mt-2">
                    <Field
                      type="text"
                      id="registerEmail"
                      name="email"
                      placeholder="Email"
                      className="p-1 mt-2 w-75"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="error-message"
                    />
                  </div>
                  <div className="dv1 mt-2">
                    <Field
                      type="password"
                      id="registerPassword"
                      name="password"
                      placeholder="Password"
                      className="p-1 mt-2 w-75"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark mt-3 bg-color w-75 mb-5"
                    style={{ backgroundColor: "#6936F5" }}
                    disabled={!isValid}
                  >
                    {isLoading ? <>Signing up...</> : <>Sign up</>}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="signUp w-30 mt-4 pt-3 text-center bg-white">
            <p>
              Already have an account?
              <NavLink to="/login" className="logo">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
export default Register;
