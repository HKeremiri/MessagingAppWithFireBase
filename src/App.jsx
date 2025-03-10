import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import MainPage from '../pages/MainPage'
import ProtectedRoute from '../components/ProtectedRoute'
import './App.css'
import React, { useState, useEffect } from 'react';
import Logout from '../components/Logout';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';
function App() {
  const [isAuth, setIsAuth] = useState(false);
const[loading,setLoading]=useState(true)

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         
        setIsAuth(!!user);  // Eğer user varsa `true`, yoksa `false`
        setLoading(false); 
      });

      return () => unsubscribe(); // Bellek sızıntısını önlemek için
  }, []);
  if (loading) {
    return <div>Loading...</div>;  // Firebase yanıtı bekleniyor
  }
  return (
    <>
       <Router>    
       
     
       <Routes>
         {/* Anasayfa, korunan route */}
         <Route
           path="/"
           element={
             <ProtectedRoute isAuth={isAuth}>
               <MainPage setIsAuth={setIsAuth} />
             </ProtectedRoute>
           }
         />
         
         {/* Login ve Register sayfaları */}
         <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
         <Route path="/register" element={<Register />} />
       
         {/* Hatalı rotalar */}
         <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} />} />
       </Routes>
     </Router>
    </>
  )
}

export default App
