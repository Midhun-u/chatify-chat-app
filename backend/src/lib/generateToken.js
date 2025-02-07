import jwt from 'jsonwebtoken'

//function for generate token
export const generateToken = (userId , response) => {

    const token = jwt.sign({id : userId} , process.env.SECRET_KEY , {expiresIn : "1d"})

    response.cookie("token" , token)
}
