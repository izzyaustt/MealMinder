import React, { useState } from 'react';
import girl from '../images/girl2.png'
import '../styles/Login.css';
import { useForm } from "react-hook-form";
// 1. Import useNavigate hook
import { useNavigate } from "react-router-dom";


function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 2. Initialize the navigate function
  const navigate = useNavigate();

  // State to hold and display login feedback to the user
  const [message, setMessage] = useState("");

  const onSubmit = (data) => {
    const allUsers = JSON.parse(localStorage.getItem("users"));

    if (!allUsers) {
        setMessage("❌ No registered users found. Please register first.");
        return;
    }

    const userToLogin = allUsers[data.email];

    if (userToLogin) {
        if (userToLogin.password === data.password) {
            // Success! Set the message
            setMessage(`✅ Welcome back, ${userToLogin.name}! Redirecting...`);
            
            // **3. Perform the Redirection on Successful Login**
            // Assuming your router is configured to use the path '/fridge' for Fridge.js
            setTimeout(() => {
                navigate('/myfridge');
            }, 500); // Small delay to allow user to see the success message
            
        } else {
            // Password mismatch
            setMessage("❌ Invalid email or password.");
        }
    } else {
        // Email not found
        setMessage("❌ Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="header">Login</h1>
      <img src={girl} alt="girl mascot" className="login-image" />

      <form className="App" onSubmit={handleSubmit(onSubmit)}>
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
                    style={{ backgroundColor: "#AACEA8", cursor: "pointer" }}
                    value="Login"
                />
      </form>
      
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

    </div>
  );
}

export default Login;