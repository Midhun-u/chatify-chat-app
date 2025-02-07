import React, { useReducer } from 'react'
import NavBar from '../../components/navbar/NavBar'
import Logo from '../../assets/Logo.png'
import Show from '../../assets/Show.png'
import Hide from '../../assets/Hide.png'
import ProfileIcon from '../../assets/ProfilePic.png'
import {useState , useRef} from 'react'
import {useNavigate} from 'react-router'
import {useDispatch , useSelector} from 'react-redux'
import Loader from '../../components/Loader/Loader'
import {authSuccess , authRequest, authFail , sucess} from '../../state/authState'
import axiosInstance from '../../axios/axiosInstance'
import {toast} from 'react-hot-toast'
import './Sign.css'

const Sign = () => {

  const navigate = useNavigate()
  const ref = useRef()
  const [profile , setProfile] = useState(false)
  const [image , setImage] = useState(null)
  const loading = useSelector((state) => state.loading)
  const dispatch = useDispatch()
  const [userDetails , setUserDetails] = useState({
    fullName : null,
    email : null,
    password : null
  })
  const [showPassword , setShowPassword] = useState(false)

  //function for sign
  const handleSign = async () => {

    dispatch(authRequest())

    if(!userDetails.fullName || !userDetails.email || !userDetails.password)
    {
      toast.error("All fields are required")
      dispatch(authFail())
    }
    else if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(userDetails.email))
    {
      toast.error("Invalid Email format")
      dispatch(authFail())
    }
    else if(userDetails.password.length < 6)
    {
      toast.error("Password must be atleast 6 letters")
      dispatch(authFail())
    }
    else
    {
      try
      {
        const response = await axiosInstance.post("/auth/sign" , {fullName : userDetails.fullName , email : userDetails.email , password : userDetails.password})
        const result = await response.data
        
        if(result.sign === true)
        {
          dispatch(authSuccess({userId : result.userId}))
          toast.success(result.message)
          setProfile(true)
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
        if( errorMessage === "Email is already registered")
        {
          toast.error(errorMessage)
          dispatch(authFail())
        }
        else
        {
          toast.error("Something went wrong")
          dispatch(authFail())
        }
      }   
    }

  }

   //function for update profile pic
   const handleUpdate = async () => {

    dispatch(authRequest())

    try
    {
      const response = await axiosInstance.put("/auth/update-profile" , {image : image})
      const result = await response.data

      if(result.update === true)
      {
        dispatch(sucess({auth : true}))
        toast.success(result.message)
        navigate("/")
      }
      else
      {
        dispatch(authFail())
        toast.error(result.message)
      }
    }
    catch(error)
    {
      console.log(error)
      const errorMessage = error.response.data.message || "Something went wrong"

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

  return (

    <>
      <NavBar />
      {
        profile
        ?
        <div className='profile-container'>
          <div className='profile-section'>
            <img src={(image ? image : ProfileIcon)} alt="profile" onClick={() => {
              ref.current.click()
            }}/>
            <input type="file" hidden ref={ref} onChange={(event) => {

              try
              {
                const reader = new FileReader()
                reader.readAsDataURL(event.target.files[0])
                reader.onload = () => {
                  setImage(reader.result)
                }
              }
              catch(error)
              {
                setImage(null)
              }

            }}/>
            <input type="text" value={userDetails.fullName} disabled/>
            <input type="email" value={userDetails.email} disabled/>
            <button className='update' onClick={handleUpdate}>{loading ? <Loader size={30}/> : "Update"}</button>
          </div>
        </div>
        :
        <div className='sign-container'>
          <div className='sign-form'>
            <div className='sign-title'>
              <img src={Logo} alt="" />
              <h1>Chatify</h1>
            </div>
            <div className='sign-section'>
              <h2>Sign up</h2>
              <input type="text" placeholder='Enter your full name' 
              onChange={(event) => setUserDetails({...userDetails , fullName : event.target.value})}/>
              <input type="email" placeholder='Enter you email'
              onChange={(event) => setUserDetails({...userDetails , email : event.target.value})}/>
              {
                showPassword
                ?
                <img src={Hide} alt="icon" onClick={() => setShowPassword(false)}/>
                :
                <img src={Show} alt="icon" onClick={() => setShowPassword(true)}/>

              }
              <input type={showPassword ? "text" : "password"} placeholder='Enter your password' 
              onChange={(event) => setUserDetails({...userDetails , password : event.target.value})}/>
              <button className='signup-button' onClick={handleSign}>
                {loading ? <Loader size={30}/> : "Sign Up"}
              </button>
              <p>Already have an account ? <a href="" onClick={() => navigate("/login")}>Login</a></p>
            </div>
          </div>
        </div>
      }
    </>

  )
}

export default Sign