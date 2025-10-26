import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../styles/upload.css";
import girl from "../images/girl1.png";

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const [message, setMessage] = useState(""); // To show success/error feedback

    const onSubmit = (data) => {
        // Retrieve all users from localStorage (or empty object if none exist)
        const users = JSON.parse(localStorage.getItem("users")) || {};

        // Check if email already exists
        if (users[data.email]) {
            setMessage("❌ This email is already registered!");
        } else {
            // Add new user
            users[data.email] = {
                name: data.name,
                email: data.email,
                password: data.password,
            };

            // Save updated users object back to localStorage
            localStorage.setItem("users", JSON.stringify(users));

            setMessage(`✅ ${data.name} has been successfully registered!`);
            reset(); // clear form fields
        }
    };

    return (
        <div className="register-container">
            <h2 className="header">Create Account</h2>
            <img src={girl} alt="girl mascot" className="register-image" />

            <form className="App" onSubmit={handleSubmit(onSubmit)}>
                <input
                    className="input-box"
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Name"
                />
                {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}

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
                    {...register("password", { required: true, minLength: 6 })}
                    placeholder="Password"
                />
                {errors.password && (
                    <span style={{ color: "red" }}>
                        *Password* is mandatory (min 6 chars)
                    </span>
                )}

                <input
                    type="submit"
                    style={{ backgroundColor: "#AACEA8", cursor: "pointer" }}
                    value="Register"
                />
            </form>

            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
}

export default Register;


// import React from "react";
// import { useForm } from "react-hook-form";
// import '../styles/upload.css';
// import girl from '../images/girl1.png'

// function Register() {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();

//     const onSubmit = (data) => {
//         const existingUser = JSON.parse(localStorage.getItem(data.email));
//         if (existingUser) {
//             console.log("Email is already registered!");
//         } else {
//             const userData = {
//                 name: data.name,
//                 email: data.email,
//                 password: data.password,
//             };
//             localStorage.setItem(data.email, JSON.stringify(userData));
//             console.log(data.name + " has been successfully registered");
//         }
//     };

//     return (
//         <>
//             <h2 className="header">Create Account</h2>
//             <img src={girl} alt="duck mascot" />

//             <form className="App" onSubmit={handleSubmit(onSubmit)}>
//                 <input
//                     className="input-box"
//                     type="text"
//                     {...register("name", { required: true })}
//                     placeholder="Name"
//                 />
//                 {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}

//                 <input
//                     className="input-box"
//                     type="email"
//                     {...register("email", { required: true })}
//                     placeholder="Email"
//                 />
//                 {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

//                 <input
//                     className="input-box"   
//                     type="password"
//                     {...register("password", { required: true })}
//                     placeholder="Password"
//                 />
//                 {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

//                 <input type="submit" style={{ backgroundColor: "#AACEA8" }} />
//             </form>
//         </>
//     );
// }

// export default Register;