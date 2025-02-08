import React  from 'react'
import {useEffect , useState} from 'react'
import {useDispatch} from 'react-redux'
import {sucess,stopeRequest} from '../../state/authState'
import { useNavigate } from 'react-router'
import axiosInstance from '../../axios/axiosInstance'
import NavBar from '../../components/navbar/NavBar'
import Logo from '../../assets/Logo.png'
import Back from '../../assets/back.png'
import {toast} from 'react-hot-toast'
import {io} from 'socket.io-client'
import './Home.css'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"
const socket = io(BASE_URL)

const Home = () => {

  const dispatch = useDispatch()
  const [oneUserName , setOneUserName] = useState()
  const [oneUserImage , setOneUserImage] = useState()
  const [chat , setChat] = useState()
  const [users , setUsers] = useState([])
  const [messages , setMessages] = useState([])
  const [select , setSelect] = useState(false)
  const [receiver , setReceiver] = useState()
  const [selectUserName , setSelectUserName] = useState()
  const [selectUser , setSelectUser] = useState([])
  const [search , setSearch] = useState(false)
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  useEffect(() => {

    //function for check user authenticated
    const checkAuth = async () => {

      try
      {
        const response = await axiosInstance.get("/auth/check")
        const result = await response.data

        if(result.login === true)
        {
          dispatch(sucess({auth : result.login}))
        }
        else
        {
          navigate("/login")
        }
      }
      catch(error)
      {
        console.log(error)
      }

    }

    //function for fetch users
    const fetchUsers = async () => {

      try
      {
        const response = await axiosInstance.get("/message/get-users")
        const result = await response.data
        
        if(result.length > 0)
        {
          setUsers(result)
        }
        else
        {
          setUsers([null])
        }
      }
      catch(error)
      {
        console.log(error.message)
      }

    }

    if(select)
    {
      //function for fetch one user
        const fetchOneUser = async () => {

          try
          {
            const response = await axiosInstance.get(`/message/getOneUser/${receiver}`)
            const result = await response.data
  
            setOneUserName(result.fullName)
            setOneUserImage(result.profilePic)
            
          }
          catch(error)
          {
            console.log(error)
          }

        }

        //function for fetch messages
        const fetchMessages = async () => {

          try
          {
            const response = await axiosInstance.get(`/message/get-messages/${receiver}`)
            const result = await response.data

            setMessages(result)

            socket.on("receive" , (chats) => {

              setMessages((prev) => {
                return [...prev , chats]
              })

            })

          }
          catch(error)
          {
            console.log(error.message)
          }

        }

        fetchOneUser()
        fetchMessages()
    }

    checkAuth()
    fetchUsers()
    dispatch(stopeRequest())

    return () => socket.off("receive")

  } , [select , receiver,messages])

   //function for send message
   const sendMessage = async () => {

    try
    {
      if(!chat)
      {
        toast.error("Fill the field")
      }
      else
      {
        const response = await axiosInstance.post(`/message/send-message/${receiver}` , {text : chat})
        const result = await response.data
        
        socket.emit("send" , result.message)
        setChat("")
      }
    }
    catch(error)
    {
      console.log(error)
    }
  }

  //function for get one user
  const getPerson = async () => {

    try
    {
      if(selectUserName)
      {
        const reponse = await axiosInstance.get("/message/get-person/" + selectUserName)
        const result = await reponse.data
        setSelectUser(result)
      }
      else
      {
        toast.error("Fill the field")
      }
    }
    catch(error)
    {
      console.log(error)
    }

  }
  
  return (

    <>
      <NavBar />
      <div className='chat-container'>
        <div className='chat-users'>
          <div className='search-section'>
            <input type="text" placeholder='Search people' onChange={(event) => {
              setSelectUserName(event.target.value)
            }}/>
            <button className='search-button' onClick={() => {
              getPerson()
              setSearch(true)
            }}>Search</button>
            <div className='users-window'>
              {
                search
                ?
                selectUser?.map((user , index) => {

                  return (

                    <>
                      <div className='user-info' key={index} onClick={() => {
                        setSelect(true)
                        setReceiver(user._id)
                      }}>
                        <img src={user.profilePic} alt="user-icon" />
                        <h3>{user.fullName}</h3>
                      </div>
                    </>

                  )

                })
                :
                users?.map((user , index) => {

                  return (

                    <>
                      <div className='user-info' key={index} onClick={() => {
                        setSelect(true)
                        setReceiver(user._id)
                      }}>
                        <img src={user.profilePic} alt="user-icon" />
                        <h3>{user.fullName}</h3>
                      </div>
                    </>

                  )

                })
              }
            </div>
          </div>
        </div>
        <div className='chat-screen' style={select ? {display : "flex"} : {display : "none"}}>
          <header className='header'>
            <div className='profile-pic'>
              <img src={oneUserImage} alt="profile" />
            </div>
            <div className='name'>
              <h3>{oneUserName}</h3>
            </div>
          </header>
          <section className='window-chat'>
            
            {
              messages?.map((message , index) => {

                return (

                  <>
                    <div className={message.senderId === userId ? "messages-sender" : "messages-receiver"}>
                      <div className='messages'>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  </>

                )

              })
            }

          </section>
          <footer className='footer-input'>
            <input type="text" placeholder='Type message'
             onChange={(event) => setChat(event.target.value)} defaultValue={chat}/>
            <button onClick={sendMessage}>Send</button>
          </footer>
        </div>
        <div className='intro' style={select ? {display : "none"} : {display : "flex"}}>
              <img src={Logo} alt="logo" style={{backgroundColor : "whitesmoke"}}/>
              <h1>Chat With People</h1>
        </div>
      </div>
      {
        select
        ?
        <div className='s-chat-screen'>
          <header className='s-chat-header'>
            <div className = "header-pic">
              <img src={Back} alt="icon" className='back-icon' onClick={() => setSelect(false)}/>
              <img src={oneUserImage} alt="profile" />
            </div>  
            <div className='header-name'>
              <h3>{oneUserName}</h3>
            </div>
          </header>
          <section className='s-chat-window'>
            {
              messages?.map((message , index) => {

                return (

                  <>
                  <div className={message.senderId === userId ? "s-message-container-sender" : "s-message-container-receive"} key={index}>
                    <div className='messages'>
                      <p>{message.text}</p>
                    </div>
                  </div>
                  </>

                )

              })
            }
          </section>
          <footer className='s-footer'>
            <input type="text" placeholder='Type message' 
            onChange={(event) => setChat(event.target.value)} defaultValue={chat}/>
            <button className='send-button' onClick={sendMessage}>Send</button>
          </footer>
        </div>
        :
        <div className='s-chat'>
          <div className='s-users'>
              <header className='s-header'>
                <input type="text" placeholder='Search people' onChange={(event) => setSelectUserName(event.target.value)}/>
                <button className='search-button' onClick={() => {
                  getPerson()
                  setSearch(true)
                }}>Search</button>
              </header>
              <section className='s-user-info' >
                {
                  search
                  ?
                  selectUser?.map((user , index) => {

                    return (

                      <div className='s-user-section' key={index} onClick={() => {
                        setSelect(true)
                        setReceiver(user._id)
                      }}>
                        <div className='s-profile'>
                          <img src={user.profilePic} alt="profile" />
                        </div>
                        <div className='s-name'>
                          <h3>{user.fullName}</h3>
                        </div>
                      </div>

                    )

                  })
                  :
                  users?.map((user , index) => {

                    return (

                      <div className='s-user-section' key={index} onClick={() => {
                        setSelect(true)
                        setReceiver(user._id)
                      }}>
                        <div className='s-profile'>
                          <img src={user.profilePic} alt="profile" />
                        </div>
                        <div className='s-name'>
                          <h3>{user.fullName}</h3>
                        </div>
                      </div>

                    )

                  })
                }
              </section>
          </div>
        </div>
      }
    </>

  )
}

export default Home