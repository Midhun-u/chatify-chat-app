import express from 'express'
import protectRoute from '../middlewares/protect.middleware.js'
import {getUsers , getMessages , sendMessages , getOneUser, getPerson} from '../controllers/message.controller.js'
const router = express.Router()

//route for get users
router.get("/get-users" , protectRoute , getUsers)

//route for get messages
router.get("/get-messages/:id" , protectRoute , getMessages)

//route for sending messages
router.post("/send-message/:id" , protectRoute , sendMessages)

//route for get one user
router.get("/getOneUser/:id" , protectRoute , getOneUser)

//route for get user by name
router.get("/get-person/:name" , protectRoute , getPerson)

export default router