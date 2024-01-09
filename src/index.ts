
import express from "express"; 
import http from 'http'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import compression from 'compression';
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router/index';

const app = express(); 

app.use(cors({
    credentials: true 
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app);

server.listen(8080 , () => {
    console.log("server listening on port 8080")
})

mongoose.Promise = Promise
mongoose.connect('')
mongoose.connection.on('error', (error : Error) => console.log(error))

app.use('/' , router())