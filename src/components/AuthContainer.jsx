import React, { useState, useEffect } from 'react';
// CORRECTED PATH: useAuthStatus is now imported from the Hooks subdirectory
import { useAuthStatus } from '../Frontend/Hooks/useAuthStatus.js'; 
// This path remains the same, assuming authApi.js is directly in the Frontend directory
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../Frontend/authApi.js'; 

// --- Component Imports ---
// REVERTED TO .jsx extension for local components
import LoginFirebase from './LoginFirebase.jsx';
import RegisterFirebase from './RegisterFirebase.jsx';
// Fridge is in src/pages
import Fridge from '../pages/Fridge.js'; 

/**
 * AuthContainer: The controller component that manages user session, state, 
 * and handles the routing between Login, Register, and the Main App screen.
 */
function AuthContainer() {
    // 1. Authentication Status from Hook
    // This watches Firebase auth state in real-time
    const { isAuthenticated, isLoading, currentUser } = useAuthStatus();

    // 2. Local UI State
    const [view, setView] = useState('login'); // 'login' | 'register'
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Restored full state management

    // 3. Initial Sign-in with Custom Token
    useEffect(() => {
        // Since the initial auth state is handled by useAuthStatus, 
        // we mainly focus on handling email/password and social logins here.
    }, []);


    // 4. Handlers for Firebase API Calls

    /**
     * Handles both Login and Register submission from the form components.
     * @param {Object} data - Contains email, password, and optionally name.
     * @param {Function} apiCall - The specific API function to call (signInWithEmail or signUpWithEmail).
     */
    const handleAuth = async (data, apiCall) => {
        setError(null);
        setIsSubmitting(true); // Re-enabled
        try {
            // Note: We ignore the 'name' field for Firebase Auth, 
            // but keep it in the data object for consistency if needed later.
            await apiCall(data.email, data.password);
            
            // If successful, the useAuthStatus hook will update isAuthenticated 
            // and the component will automatically switch to Fridge.
            console.log(`Auth flow successful. View should now switch to Fridge.`);

        } catch (err) {
            // Firebase error messages are often long; simplify or map them here.
            let friendlyError = 'An unexpected error occurred.';
            
            if (err.code) {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        friendlyError = 'This email is already registered. Try logging in.';
                        break;
                    case 'auth/invalid-credential':
                    case 'auth/user-not-found':
                        friendlyError = 'Invalid email or password.';
                        break;
                    case 'auth/weak-password':
                        friendlyError = 'Password should be at least 6 characters.';
                        break;
                    default:
                        // Use a generic catch-all for other errors
                        friendlyError = `Authentication failed. Please check your credentials and try again.`;
                }
            } else if (err.message) {
                 // For network errors or non-Firebase errors
                friendlyError = err.message;
            }

            setError(friendlyError);
            console.error("AuthContainer Error:", err);
        } finally {
            setIsSubmitting(false); // Re-enabled
        }
    };

    const handleEmailLogin = (data) => handleAuth(data, signInWithEmail);
    const handleEmailRegister = (data) => handleAuth(data, signUpWithEmail);

    const handleGoogleLogin = async () => {
        setIsSubmitting(true); // Re-enabled
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            // Check for pop-up blocked errors which are common
            let friendlyError = 'Google sign-in failed. Check if a popup was blocked and try again.';
            if (err.code && err.code === 'auth/popup-closed-by-user') {
                 friendlyError = 'Sign-in window closed. Please try again.';
            }
            setError(friendlyError);
            console.error("Google Login Error:", err);
        } finally {
            setIsSubmitting(false); // Re-enabled
        }
    };

    // 5. Render Logic based on Auth Status and Local View

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Loading Session...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        // If the user is logged in, show the Fridge component
        return <Fridge currentUser={currentUser} />;
    }

    // If not authenticated, show the current login/register view
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
                
                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                {view === 'login' && (
                    <LoginFirebase
                        onEmailLogin={handleEmailLogin}
                        onGoogleLogin={handleGoogleLogin}
                        onSwitchToRegister={() => { setView('register'); setError(null); }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {view === 'register' && (
                    <RegisterFirebase
                        onEmailRegister={handleEmailRegister}
                        onSwitchToLogin={() => { setView('login'); setError(null); }}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

export default AuthContainer;