import React, {useState} from "react";
// import { useForm } from "react-hook-form";
import '../styles/upload.css';
import girl from '../images/girl1.png'

const Register = ({onEmailRegister}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (data) => {
        const existingUser = JSON.parse(localStorage.getItem(email));
        if (existingUser) {
            console.log("Email is already registered!");
        } else {
            onEmailRegister({name, email, password});
            const userData = {
                name: name,
                email: email,
                password: password,
            };
            console.log("Before n" + window.location.pathname);
            window.location.pathname = "/href";
            console.log("After " + window.location.pathname);
            localStorage.setItem(email, JSON.stringify(userData));
            console.log(name + " has been successfully registered");
        }
    };

    return (
        <>
            <h2 className="header">Create Account</h2>
            <img src={girl} alt="duck mascot" />

            <form className="App" onSubmit={handleSubmit}>
                <input
                    className="input-box"
                    type="text"
                    value={name}
                    onChange={(e) => setName (e.target.value)}
                    
                    placeholder="Name"
                />
                {/* {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>} */}

                <input
                    className="input-box"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail (e.target.value)}
                    
                    placeholder="Email"
                />
                {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

                <input
                    className="input-box"   
                    type="password"
                    value={password}
                    onChange={(e) => setPassword (e.target.value)}
                   
                    placeholder="Password"
                />
                {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

                <input type="submit" style={{ backgroundColor: "#AACEA8" }} />
            </form>
        </>
    );
};

export default Register;