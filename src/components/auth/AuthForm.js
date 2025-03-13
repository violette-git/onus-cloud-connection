import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Eye, EyeOff } from 'lucide-react';
export const AuthForm = () => {
    const { login, signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (isSignUp && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            let response;
            if (isSignUp) {
                response = await signUp(email, password);
            }
            else {
                response = await login(email, password);
            }
            const { data, error } = response;
            if (error) {
                console.error('Authentication error:', error);
                if (error.status === 429) {
                    setError('Too many requests. Please try again later.');
                }
                else {
                    setError(error.message);
                }
            }
            else if (data) {
                console.log('Authentication successful:', data);
                navigate('/profile'); // Redirect to profile page
            }
        }
        catch (error) {
            console.error('Unexpected authentication error:', error);
            setError('An unexpected error occurred.');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-white", children: "Welcome to Onus" }), _jsx(DialogDescription, { className: "text-gray-300", children: isSignUp ? 'Create new account' : 'Sign in to your account' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-white", htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "text-white bg-gray-800 border-gray-700", placeholder: "test@onus.com", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-white", htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), className: "text-white bg-gray-800 border-gray-700 pr-10", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-3 text-gray-400 hover:text-gray-200", children: showPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] })] }), isSignUp && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-white", htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx(Input, { id: "confirmPassword", type: showPassword ? 'text' : 'password', value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "text-white bg-gray-800 border-gray-700 pr-10", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] })), error && _jsx("div", { className: "text-red-500", children: error }), _jsx(Button, { type: "submit", className: "w-full", children: isSignUp ? 'Sign Up' : 'Sign In' }), _jsx("div", { className: "text-center", children: _jsx("button", { type: "button", onClick: () => setIsSignUp(!isSignUp), className: "text-sm text-gray-300 hover:text-white", children: isSignUp
                                ? 'Already have an account? Sign In'
                                : 'Don\'t have an account? Sign Up' }) })] })] }));
};
