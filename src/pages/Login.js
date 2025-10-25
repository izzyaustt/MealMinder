import React from "react";
import { motion } from "framer-motion";
import girl from "../images/girl2.png";
import "../styles/Login.css";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userData = JSON.parse(localStorage.getItem(data.email));
    if (userData) {
      if (userData.password === data.password) {
        console.log(userData.name + " You Are Successfully Logged In");
      } else {
        console.log("Email or Password is not matching with our record");
      }
    } else {
      console.log("Email or Password is not matching with our record");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-header">Sign in</h2>
        <img src={girl} className="login-image" alt="duck mascot" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper">
            <input
              className="input-box"
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
            />
            {errors.email && (
              <span className="error-text">*Email* is mandatory</span>
            )}
          </div>

          <div className="input-wrapper">
            <input
              className="input-box"
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
            />
            {errors.password && (
              <span className="error-text">*Password* is mandatory</span>
            )}
          </div>

          <input type="submit" className="submit-btn" value="Login" />
        </form>
      </div>
    </div>
  );
}

export default Login;
