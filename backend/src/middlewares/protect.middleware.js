import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

//middleware for checking user authenticated
const protectRoute = async (request , response , next) => {

    try
    {
        const {token} = request.cookies

        if(token)
        {
            //decoding token
            const decode = jwt.verify(token , process.env.SECRET_KEY)

            if(decode)
            {
                const user = await User.findOne({_id : decode.id}).select("-password")
                request.user = user

                next()
            }
            else
            {
                response.status(400).json({message : "Invalid user"})
            }
        }
        else
        {
            response.json({login : false})
        }
    }
    catch(error)
    {
        response.status(500).json({error : "Server error"})
        console.log("protect route error : " , error.message)
    }

}

export default protectRoute