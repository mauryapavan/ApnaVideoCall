import { createContext, useContext, useState } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";

export const AuthContext=createContext({

})

const client=axios.create({
    baseURL:"https://apnavideocall-p4n3.onrender.com/api/users"
})
export const AuthProvider=({children})=>{
    const authContext=useContext(AuthContext)

    const [userData,setuserData]=useState(authContext)
     const navigate=useNavigate();

    //  register
    const handleRegister=async (name,username,password) => {
        try{ 
            let request= await client.post('/register',{name,username,password});
           if(request.data.status){
                 toast.success(request.data.message)
           }
           else{
              toast.error(request.data.message)
           }
        }
        catch(e){
           toast.error(e)
        }
    }
    const handleLogin=async (username,password) => {
        try{ 
            let request= await client.post('/login',{username,password});
           if(request.data.status){
                 toast.success(request.data.message)
                 localStorage.setItem("token",request.data.token);
                 navigate("/home")
           }
           else{
              toast.error(request.data.message)
           }
        }
        catch(e){
           toast.error(e)
        }
        
    }

     const getHistoryOfUser = async () => {
        try {
            
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
           
            return request.data.meetings
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }

   
    const data={
        userData,setuserData,handleRegister,handleLogin,getHistoryOfUser,addToUserHistory
    }
    return (
        <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
    )
}
