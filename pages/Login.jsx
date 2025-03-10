import React from 'react' 
import CenteredContainer from '../components/CenteredContainer'
import LoginForm from '../components/LoginForm'
export default function Login({setIsAuth}) {

  return (
   <>
 <CenteredContainer>
  <LoginForm setIsAuth={setIsAuth} ></LoginForm>
 </CenteredContainer>

    
  </>
  )
}

