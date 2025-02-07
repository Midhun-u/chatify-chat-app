import express, { request } from 'express'
import {signUp , login , logout , updateProfile , checkAuth , getUser} from '../controllers/auth.controller.js'
import protectRoute from '../middlewares/protect.middleware.js'
const router = express.Router()

//route for signup
router.post("/sign" , signUp)

//route for login
router.post("/login" , login)

//route for logout
router.post("/logout" , logout)

//route for update profile
router.put("/update-profile" , protectRoute , updateProfile)

//route for check user authenticated
router.get("/check" , protectRoute , checkAuth)

//route for get user
router.get("/get-user" , protectRoute , getUser)

export default router