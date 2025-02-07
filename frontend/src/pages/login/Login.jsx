import React from 'react'
import './Login.css'
import NavBar from '../../components/navbar/NavBar'
import Logo from '../../assets/Logo.png'
import Show from "../../assets/Show.png"
import Hide from "../../assets/Hide.png"
import Loader from '../../components/Loader/Loader'
import {useNavigate} from "react-router"
import {useState} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import {authRequest , authSuccess , authFail, stopeRequest} from '../../state/authState'
import {toast} from 'react-hot-toast'
import axiosInstance from '../../axios/axiosInstance'

const Login = () => {

  const [userDetails , setUserDetails] = useState(
    {
      email : null,
      password : null
    }
  )
  const [showPassword ,setShowPassword] = useState(false)
  const navigate = useNavigate()
  const loading = useSelector((state) => state.loading)
  const dispatch = useDispatch()

  dispatch(stopeRequest())

  //function for login
  const handleLogin = async () => {

    dispatch(authRequest())

    if(!userDetails.email || !userDetails.password)
    {
      toast.error("All fields are required")
      dispatch(authFail())
    }
    else
    {
      try
      {
        const response = await axiosInstance.post("/auth/login" , {email : userDetails.email , password : userDetails.password})
        const result = await response.data
        
        if(result.login === true)
        {
          dispatch(authSuccess({userId : result.userId}))
          toast.success(result.message)
          navigate("/")
        }
        else
        {
          toast.error(result.message)
          dispatch(authFail())
        }
      }
      catch(error)
      {
        const errorMessage = error.response.data.message
        
        if(errorMessage)
        {
          toast.error(errorMessage)
        }
        else
        {
          toast.error("Something went wrong")
        }

        dispatch(authFail())
      }
    }

  }


  return (

    <>
      <NavBar />
      <div className='login-container'>
        <div className='login-form-container'>
          <div className='login-title'>
              <img src={Logo} alt="logo" />
              <h1>Chatify</h1>
          </div>
          <div className='login-section'>
            <h2>Login In</h2>
           <input type="email" placeholder='Email' 
           onChange={(event) => setUserDetails({...userDetails , email : event.target.value})}/>
           {
            showPassword
            ?
            <img src={Hide} alt="icon" onClick={() => setShowPassword(false)}/>
            :
            <img src={Show} alt="icon" onClick={() => setShowPassword(true)}/>
           }
           <input type={showPassword ? "text" : "password"} placeholder='Password'
           onChange={(event) => setUserDetails({...userDetails , password : event.target.value})}/>
           <button className='login-button' onClick={handleLogin}>
            {
              loading
              ?
              <Loader size={25}/>
              :
              "Login"
            }
           </button>
           <p>Don't have an account ? <a href="#" onClick={() => navigate("/sign")}>Sign Up</a></p>
          </div>
        </div>
      </div>
    </>

  )
}

export default Login