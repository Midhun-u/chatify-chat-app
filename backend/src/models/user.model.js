import mongoose from 'mongoose'
const {Schema , model} = mongoose

const userSchema = new Schema(
    {
        fullName : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
            minlength : 6
        },
        profilePic : {
            type : String,
            default : null
        }
    }
 , {timestamps : true})

const User = model("User" , userSchema)


export default User