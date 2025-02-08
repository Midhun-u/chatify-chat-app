import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {config} from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import databaseConnection from './lib/db.js'
import http from 'http'
import {Server} from 'socket.io'
import path from 'path'
config()
const app = express()
const PORT = process.env.PORT
const __dirname = path.resolve()
const server = http.createServer(app)

//middlewares
app.use(express.json({limit : "10mb"}))
app.use(express.urlencoded({extended : true}))
app.use(cors({origin : ["http://localhost:5173"] , credentials : true}))
app.use(cookieParser())

//route middleware for authentication
app.use("/auth" , authRoutes)

//route middleware for messages
app.use("/message" , messageRoutes)

if(process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname , "../frontend/dist")))

    app.get("*" , (request , response) => {
        response.sendFile(path.join(__dirname , "../frontend" , "dist" , "index.html"))
    })
}

const io = new Server(server , {
        
    cors : {
        origin : "http://localhost:5173",
        methods : ["GET" , "POST"]
    } 

})

//socket io implementation
io.on("connection" , (socket) => {

    console.log("User Connectd : " + socket.id)

    socket.on("send" , (chat) => {

        io.emit("receive" , chat)
    })

    socket.on("disconnect" , () => {
        console.log("User disconnected : " + socket.id)
    })

})


server.listen(PORT , "0.0.0.0" ,() => {
    console.log(`Server Running on ${PORT}`)
    
    databaseConnection()
})

export default server
