import React from "react";
import { useForm } from "react-hook-form";
import '../styles/upload.css';
import girl from '../images/girl1.png'

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const existingUser = JSON.parse(localStorage.getItem(data.email));
        if (existingUser) {
            console.log("Email is already registered!");
        } else {
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
            };
            localStorage.setItem(data.email, JSON.stringify(userData));
            console.log(data.name + " has been successfully registered");
        }
    };

    return (
        <>
            <h2 className="header">Create Account</h2>
            <img src={girl} alt="duck mascot" />

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
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                <input type="submit" style={{ backgroundColor: "#AACEA8", 
                        borderRadius: "15px",
                        display: "block",
                        margin: "0 auto" }} />
            </form>
        </>
    );
}

export default Register;