import mongoose from "mongoose"
const {Schema , model} = mongoose

const messageSchema = new Schema(
    {
        senderId : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        receiverId : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        text : {
            type : String
        },
    }
 , {timestamps : true})

const Message = model("Message" , messageSchema)

export default Message