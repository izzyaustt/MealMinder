//Contains functions for sign-in, sign-up (email/Google), and sign-out.

/*
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile // To set the user's name after signup
} from 'firebase/auth';
import { auth } from './config';


 //* Signs in an existing user with email and password.
 //* @param {string} email - User's email address.
 //* @param {string} password - User's password.
 
export async function signInWithEmail(email, password) {
    if (!auth) {
        throw new Error("Authentication service not initialized.");
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Returns the user object if successful
        return userCredential.user;
    } catch (error) {
        // Translate Firebase error codes into friendly messages
        let message = "An unknown error occurred during sign-in.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "Invalid email or password.";
        }
        throw new Error(message);
    }
}


 //* Creates a new user account with email and password, and sets their display name.
 //* @param {string} email - New user's email address.
 //* @param {string} password - New user's password.
 //* @param {string} displayName - The user's name.
 
export async function signUpWithEmail(email, password, displayName) {
    if (!auth) {
        throw new Error("Authentication service not initialized.");
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // After creation, immediately update the user's profile with their name
        await updateProfile(userCredential.user, {
            displayName: displayName
        });

        // Returns the newly created user object
        return userCredential.user;
    } catch (error) {
        let message = "An unknown error occurred during sign-up.";
        if (error.code === 'auth/email-already-in-use') {
            message = "This email is already linked to an account. Try logging in!";
        } else if (error.code === 'auth/weak-password') {
             message = "Password must be at least 6 characters long.";
        }
        throw new Error(message);
    }
}


 //Signs in a user using the Google authentication pop-up.
 
export async function signInWithGoogle() {
    if (!auth) {
        throw new Error("Authentication service not initialized.");
    }
    const provider = new GoogleAuthProvider();
    try {
        // Open the Google login pop-up window
        const userCredential = await signInWithPopup(auth, provider);
        // The user is automatically signed in when the pop-up closes
        return userCredential.user;
    } catch (error) {
        // Handle cases where the user closes the pop-up
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error("Google sign-in cancelled.");
        }
        throw new Error("Failed to sign in with Google: " + error.message);
    }
}


 //Signs out the current user.
 
export async function signOutUser() {
    if (!auth) {
        throw new Error("Authentication service not initialized.");
    }
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error("Logout failed: " + error.message);
    }
}*/

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut 
} from "firebase/auth";
import { auth, initialAuthToken } from "./config"; // Assumes config.js is correctly set up and exporting 'auth'

const googleProvider = new GoogleAuthProvider();

// --- Sign In Functions ---

/**
 * Signs a user in using their email and password.
 * @param {string} email
 * @param {string} password
 */
export const signInWithEmail = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Success: Auth state will be handled by useAuthStatus hook
    } catch (error) {
        console.error("Firebase Sign In Error:", error);
        throw error; // Propagate error for AuthContainer to handle the message
    }
};

/**
 * Signs a user up using their email and password.
 * This is the function the AuthContainer calls for registration.
 * @param {string} email
 * @param {string} password
 */
export const signUpWithEmail = async (email, password) => {
    try {
        // Core Firebase function to create a new user and automatically log them in
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User successfully created and logged in:", userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error("Firebase Sign Up Error:", error);
        throw error; // Propagate error for AuthContainer to display
    }
};

/**
 * Signs a user in using Google OAuth popup.
 */
export const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        // Success: Auth state will be handled by useAuthStatus hook
    } catch (error) {
        console.error("Firebase Google Sign In Error:", error);
        throw error; // Propagate error for AuthContainer to handle
    }
};

/**
 * Signs the current user out.
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out.");
    } catch (error) {
        console.error("Firebase Sign Out Error:", error);
        throw error;
    }
};

