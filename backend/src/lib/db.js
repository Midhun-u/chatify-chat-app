import mongoose from 'mongoose'

//function for connecting database
const databaseConnection = async () => {

    try
    {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected")
    }
    catch(error)
    {
        console.log(error.message)
    }

}

export default databaseConnection