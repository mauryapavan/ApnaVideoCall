import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Login } from "./loginpage";
import { Register } from "./register";



export default function Authenticate() {
  const [isLogin,setisLogin]=useState(true);

  

  return (
    <div className="min-h-screen flex justify-center items-center p-2">
      <div className="border-2 rounded-xl items-center flex flex-col p-5 min-w-1/2 " style={{backgroundColor:"wheat"}}>
        <div className="">
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="text-3xl"><FontAwesomeIcon icon={faLock} /></span>
            </div>
          </div>
        </div>
        <div className="mt-2 w-1/2">
          <button onClick={()=>{setisLogin(true)}} className={isLogin ==true ?"btn btn-primary px-5 rounded-xl w-1/2":"btn px-5 rounded-xl w-1/2"}>Signup</button>
          <button onClick={()=>{setisLogin(false)}} className={!isLogin ==true ?"btn btn-primary px-5 rounded-xl w-1/2":"btn px-5 rounded-xl w-1/2"}>Login</button>
        </div>
        {isLogin==true? <Login></Login> : <Register></Register>}
        
      </div>

    </div>
  )
}