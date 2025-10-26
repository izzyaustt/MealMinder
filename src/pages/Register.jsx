import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase.jsx';
// import { useForm } from "react-hook-form";
import '../styles/upload.css';
import girl from '../images/girl1.png'

const Register = ({onEmailRegister}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     // Call the shared firebase registration helper
        //     await registerWithFirebase({ name, email, password });

        //     // If a parent callback was provided also notify it
        //     if (typeof onEmailRegister === 'function') {
        //         onEmailRegister({ name, email, password });
        //     }

        //     console.log(name + ' has been successfully registered in Firebase');
        //     navigate('/myfridge');
        // } catch (err) {
        //     console.error('Registration failed:', err);
        //     // Show minimal UI feedback for now — replace with nicer UI if you prefer
        //     alert(err.message || 'Registration failed.');
        // }
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        if(user) {
            console.log("User registered successfully:", user.email);
            navigate('/myfridge');
        } else {
            console.log("Registration failed: Invalid email or password");
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