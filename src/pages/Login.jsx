import React, { useState } from 'react';
import girl from '../images/girl2.png'
import '../styles/Login.css';
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
  const [validationMessage, setValidationMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  

  const navigate = useNavigate();

  const onSubmit = async(data) => {
    //   const userData = JSON.parse(localStorage.getItem(data.email));
    //   if (userData) {
    //       if (userData.password === data.password) {
    //           console.log(userData.name + " You Are Successfully Logged In");
    //       } else {
    //           console.log("Email or Password is not matching with our record");
    //       }
    //   } else {
    //       console.log("Email or Password is not matching with our record");
    //   }
    const { user } = await signInWithEmailAndPassword(auth, data.email, data.password)
    if(user) {
        console.log("User logged in successfully:", user.email);
        setValidationMessage("User logged in successfully: " + user.email);
        navigate("/myfridge");
    } else {
        console.log("Login failed: Invalid email or password");
        setValidationMessage("Login failed: Invalid email or password");
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
                <p>{validationMessage}</p>
                <input type="submit" style={{ backgroundColor: "#AACEA8" }} />
            </form>
      
    </div>
  );
}

export default Login;
