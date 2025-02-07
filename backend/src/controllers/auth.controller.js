import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import { generateToken } from "../lib/generateToken.js"
import cloudinary from "../lib/cloudinary.js"

//controller for sign
export const signUp = async (request , response) => {

    const {fullName , email , password} = request.body

    try
    {
        if(fullName && email && password)
        {
            if(password.length < 6)
            {
                response.status(400).json({message : "Password must be atleast 6 letters"})
            }
            else
            {
                //check email already exist
                const checkEmail = await User.findOne({email : email})
    
                if(checkEmail)
                {
                    response.status(400).json({message : "Email is already registered"})
                }
                else
                {
                    //hashing password
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(password , salt)
    
                    const newUser = await User(
                        {
                            fullName : fullName,
                            email : email,
                            password : hashedPassword
                        }
                    )
    
                    if(newUser)
                    {
                        generateToken(newUser._id , response)
                        newUser.save()

                        response.status(200).json({message : "Sign Up success" , sign : true , userId : newUser._id})
                    }
                    else
                    {
                        response.status(400).json({message : "Invalid credentials"})
                    }
                }

            }
        }
        else
        {
            response.status(400).json({message : "Required all fields"})
        }
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("sign controller error : " , error.message)
    }

}

//controller for login
export const login = async (request , response) => {

    const {email , password} = request.body

    try
    {
        if(email && password)
        {
            //check email is registered
            const user = await User.findOne({email : email})

            if(user)
            {
                //check password is correct
                const checkPassword = await bcrypt.compare(password , user.password)

                if(checkPassword)
                {
                    generateToken(user._id , response)

                    response.status(200).json({message : "Login success" , login :true , userId : user._id})
                }
                else
                {
                    response.status(400).json({message : "Password is incorrect"})
                }
            }
            else
            {
                response.status(400).json({message : "Email is not registered"})
            }
        }
        else
        {
            response.status(400).json({message : "Require all fields"})
        }
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("login controller error : ",error.message)
    }

}

//controller for logout
export const logout = async (request , response) => {

    try
    {
        response.clearCookie("token")
        response.status(200).json({logout : true})
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("logout controller error" , error.message)
    }

}

//controller for update profile pic
export const updateProfile = async (request , response) => {

    const {image : profilePic} = request.body
    const {_id : userId} = request.user

    try
    {
        if(profilePic)
        {
            //upload profile picture to cloudinary
            const upload = await cloudinary.uploader.upload(profilePic)
            
            const update = await User.findByIdAndUpdate(userId , {profilePic : upload.secure_url})

            if(update)
            {
                response.status(200).json({message : "Profile picture updated" , update : true})
            }
            else
            {
                response.status(500).json({messge : "Profile picture is not updated"})
            }
        }
        else
        {
            response.status(400).json({message : "Profile picture required"})
        }
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("updateProfile controller error : " , error)
    }

}

//controller for check user authenticated
export const checkAuth = (request , response) => {

    try
    {
        response.json({login : true})
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("checkAuth controller error ",error.message)
    }

}

//controller for get loginned user
export const getUser = async (request , response) => {

    const {_id : userId} = request.user

    try
    {
        const userData = await User.findById(userId).select("-password")
        response.status(200).json(userData)
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("getUser controller error" , error.message)
    }

}