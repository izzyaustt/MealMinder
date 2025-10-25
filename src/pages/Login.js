import React from 'react';
import girl from '../images/girl2.png'
import '../styles/Login.css';
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
    <div>
      <h1 className="header">Login</h1>
      <img src={girl} alt="duck mascot" />
      <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    className="input-box"
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <input
                    className="input-box"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                <input 
                    type="submit" 
                    style={{ 
                        backgroundColor: "#AACEA8", 
                        borderRadius: "15px",
                        display: "block",
                        margin: "0 auto"
                    }} 
                />
            </form>
      
    </div>
  );
}

export default Login;
