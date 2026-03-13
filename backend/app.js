import express from "express"

import {createServer} from "node:http"
import dotenv from 'dotenv'
dotenv.config();

import {Server} from 'socket.io'
import cors from 'cors'
import connectDB from "./config/connectDB.js";
import userRoutes from "./Routes/userRoutes.js";
import { connectTOSocket } from "./Controller/socketManage.js";


const app=express();
const server=createServer(app);
const io=connectTOSocket(server)
app.use(cors())
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}))

connectDB()
 app.use("/api/users",userRoutes)

 server.listen(3030, () => {
  console.log("Server running on port 3030");
});