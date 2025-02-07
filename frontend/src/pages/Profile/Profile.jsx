import React from 'react'
import { useState , useEffect , useRef } from 'react'
import ProfileIcon from '../../assets/ProfilePic.png'
import {useSelector , useDispatch} from 'react-redux'
import Loader from '../../components/Loader/Loader'
import NavBar from '../../components/navbar/NavBar'
import {authRequest , sucess , stopeRequest} from '../../state/authState'
import axiosInstance from '../../axios/axiosInstance'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

const Profile = () => {

    const [image , setImage] = useState()
    const [userDetails , setUserDetails] = useState({
      name : null,
      email : null,
      profilePic : null
    })
    const ref = useRef()
    const loading = useSelector((state) => state.loading)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

      const fetchUser = async () => {

        try
        {
          const userId = localStorage.getItem("userId")

          const response = await axiosInstance.get("/message/getOneUser/"+userId)
          const result = await response.data
          
          setUserDetails(
            {
              name : result.fullName,
              email : result.email,
              profilePic : result.profilePic
            }
          )

        }
        catch(error)
        {
          console.log(error)
        }

      }

      fetchUser()

    } , [])

    //function for update profile
    const updateProfile = async () => {

      dispatch(authRequest())

      try
      {
        const responsse = await axiosInstance.put("/auth/update-profile" , {image : image})
        const result = await responsse.data

        dispatch(sucess({auth : true}))

        if(result.update)
        {
          toast.success(result.message)
          navigate("/")
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
          toast.error("Something went error")
        }

        dispatch(stopeRequest())
      }

    }

  return (

    <>
    <NavBar />
      <div className='profile-container'>
          <div className='profile-section'>
            <img src={(image ? image : (userDetails.profilePic ? userDetails.profilePic : ProfileIcon))} alt="profile" onClick={() => {
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
            <input type="text" value={userDetails.name} disabled style={{fontSize : "1rem"}}/>
            <input type="email" value={userDetails.email} disabled style={{fontSize : "1rem"}}/>
            <button className='update' onClick={updateProfile}>{loading ? <Loader size={30}/> : "Update"}</button>
          </div>
        </div>
    </>

  )
}

export default Profile
