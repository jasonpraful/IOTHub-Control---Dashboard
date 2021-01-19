import express from 'express'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import cors from 'cors'
import { spawn } from 'child_process'

const PORT = process.env.PORT || 5000;

//mongodb configuration
const mongodbURI =
    "mongodb://127.0.0.1:27017/assignment?retryWrites=true&w=majority";

mongoose
    .connect(mongodbURI,
        {
            auth: {
                user: 'admin',
                password: ''
            },
            authSource: "admin",
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify:false,
        }
    ).then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


const app = express()
app.use(bodyparser.json())
app.use(cors())



//python files
app.get('/',(req,res) =>{
    res.send('Please email jason.praful@gmail.com for usage')
})


//routes
import trigger from './Routes/trigger'
import socket from './Routes/socket'

app.use('/api',trigger)
app.use('/api',socket)



app.listen(PORT, () => console.log("Server is running. Port: " + PORT))