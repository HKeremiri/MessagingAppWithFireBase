import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

export default function LoginForm({ setIsAuth }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        submit: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    // Validation rules
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    // Validate form
    const validateForm = () => {
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        setErrors({
            email: emailError,
            password: passwordError,
            submit: ''
        });

        return !emailError && !passwordError;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));

        // Validate on change if field was touched
        if (touched[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: id === 'email' ? validateEmail(value) : validatePassword(value)
            }));
        }
    };

    // Handle input blur
    const handleBlur = (e) => {
        const { id } = e.target;
        setTouched(prev => ({
            ...prev,
            [id]: true
        }));

        setErrors(prev => ({
            ...prev,
            [id]: id === 'email' ? validateEmail(formData.email) : validatePassword(formData.password)
        }));
    };

    // Navigation handler
    const handleGoRegister = () => navigate('/register');

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Set all fields as touched
        setTouched({
            email: true,
            password: true
        });

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            localStorage.setItem('isAuth', 'true');
            setIsAuth(true);
            navigate('/');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message
            }));
        }
    };

    return (
        <Box component="form" onSubmit={handleLogin} noValidate>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>

            {errors.submit && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.submit}
                </Alert>
            )}

            <TextField
                fullWidth
                label="E-Mail"
                id="email"
                margin="normal"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                type="email"
                required
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
            />

            <TextField
                fullWidth
                label="Password"
                id="password"
                type="password"
                margin="normal"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
            />

            <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 2 
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                >
                    Login
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleGoRegister}
                >
                    Go to Register
                </Button>
            </Box>
        </Box>
    );
}
