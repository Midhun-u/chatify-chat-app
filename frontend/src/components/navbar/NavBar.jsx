import React from 'react'
import { useState } from 'react'
import Logo from '../../assets/Logo.png'
import Profile from '../../assets/Profile.png'
import Close from '../../assets/Close.png'
import axiosInstance from '../../axios/axiosInstance'
import {useNavigate} from 'react-router'
import './NavBar.css'

const NavBar = () => {

  const [show ,setShow] = useState(false)
  const navigate = useNavigate()

  //function for logout
  const handleLogout = async () => {

    try
    {
      const response = await axiosInstance.post("/auth/logout")
      const logout = await response.data.logout

      if(logout)
      {
        localStorage.clear()
        navigate("/login")
      }
    }
    catch(error)
    {
      console.log(error)
    }

  }

  return (

    <>
      <header className='nav-bar'>
        <nav>
            <ul>
                <li>
                    <img src={Logo} alt="logo" />
                </li>
            </ul>
            <ul>
                <li className='profile-icon'>
                  {
                    show
                    ?
                    <img src={Close} alt="icon" onClick={() => setShow(false)}/>
                    :
                    <img src={Profile} alt="icon" onClick={() => setShow(true)}/>
                  }

                </li>
            </ul>
        </nav>
        <nav className='side-bar' style={show ? {display : "flex"} : {display : "none"}}>
            <ul>
              <li>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button style={{backgroundColor : "purple" , color : "whitesmoke" , "fontSize" : "1rem"}}
                onClick={() => navigate("/")}>Home</button>
              </li>
            </ul>
        </nav>
      </header>
    </>

  )
}

export default NavBar