import Login from './pages/login/Login'
import Sign from './pages/sign/Sign'
import Profile from './pages/Profile/Profile'
import Home from './pages/home/Home'
import {BrowserRouter , Route , Routes} from 'react-router'
import {Toaster} from 'react-hot-toast'

const App = () => {

  return (

        <>
          <BrowserRouter>
            <Routes>
              <Route path='/' element = {<Home />}/>
              <Route path='/login' element = {<Login />}/>
              <Route path='/sign' element = {<Sign />}/>
              <Route path='/profile' element = {<Profile />} />
             </Routes>
          </BrowserRouter>
          <Toaster position='top-center' />
        </>
  )
}

export default App
