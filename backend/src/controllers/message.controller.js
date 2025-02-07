import User from "../models/user.model.js"
import Message from '../models/message.model.js'
import cloudinary from "../lib/cloudinary.js"
import { request, response } from "express"

//controller for get users
export const getUsers = async (request , response) => {

    const {_id : loginUserId} = request.user
    
    try
    {
        const filteredUser = await User.find({_id : {$ne : loginUserId}}).select("-password")
        response.status(200).json(filteredUser)  
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("message controller error " , error.message)
    }

}

//controller for get messages
export const getMessages = async (request , response) => {

    const {id : userToChatId} = request.params
    const {_id : senderId} = request.user

    try
    {
        const messages = await Message.find(
            {
                $or : [
                    {senderId : senderId , receiverId : userToChatId},
                    {senderId : userToChatId , receiverId : senderId}
                ]
            }
        )

        response.status(200).json(messages)

    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("getMessages controller error" , error.message)
    }

}

//controller for send messages
export const sendMessages = async (request , response) => {

    const {id : userToChatId} = request.params
    const {_id : senderId} = request.user
    const {text} = request.body

    try
    {
            const newMessages = await Message.create(
                {
                    senderId : senderId,
                    receiverId : userToChatId,
                    text : text,
                }
            )
            newMessages.save()

            response.status(201).json({message : "Message send success" , message : newMessages})
    }
    catch(error)
    {
        response.status(500).json({error : "Server errorr"})
        console.log("sendMessage controller error " , error.message)
    }
}

//controller for get one use
export const getOneUser = async (request , response) => {

    const {id} = request.params

    try
    {
        const user = await User.findOne({_id : id}).select("-password")
        response.status(200).json(user)
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("getOneUser controller error : " , error.message)
    }

}

export const getPerson = async (request , response) => {

    const {name} = request.params

    try
    {
        const person = await User.find({fullName : name}).select("-password")
        response.status(200).json(person)
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
    }

}