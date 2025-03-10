import { getFirestore } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {db} from '../firebase.js'

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log('User created successfully:', userCredential.user);
     AddFirebaseDb(userCredential.user)
      navigate('/login');
    } catch (error) {
      let errorMessage = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
      console.error('Registration error:', error);
    }
  };

  function AddFirebaseDb(user) {  
    const userRef = doc(db, 'users', user.uid);
    const userDoc = {
      email: user.email,
      uid: user.uid
    };
    setDoc(userRef, userDoc);
  }
  return (
    <Box component="form" onSubmit={handleRegister} noValidate>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField 
        fullWidth 
        label="E-Mail" 
        id="email" 
        margin="normal" 
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={!!error}
      />

      <TextField 
        fullWidth 
        label="Password" 
        id="password" 
        type="password"
        margin="normal" 
        value={formData.password}
        onChange={handleInputChange}
        error={!!error}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          type="submit"
        >
          Register
        </Button>
        <Button 
          variant="outlined"
          fullWidth 
          onClick={handleGoLogin}
        >
          Go to Login
        </Button>
      </Box>
    </Box>
  );
}
