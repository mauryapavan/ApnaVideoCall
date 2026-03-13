import React, { useContext, useState } from "react";
import { AuthContext } from "../context/handleAuth";


export function Login(){

  const {handleRegister}=useContext(AuthContext);

     const [user,setuser]=useState({name:"",username:"",password:""});
      const handleChange=(e)=>{
     setuser({...user,[e.target.name]:e.target.value}) }
      const register=(e)=>{
         e.preventDefault();
          handleRegister(user.name,user.username,user.password);
          setuser({name:"",username:"",password:""})
     }
    return(
        <div className="text-center">
          <form action="" onSubmit={register}>
            <legend className="fieldset-legend">name</legend>
            <input onChange={handleChange} type="text" className="input" placeholder="enter your" name='name' value={user.name} />
           <legend className="fieldset-legend">userName</legend>
           <input onChange={handleChange} type="text" className="input" placeholder="set username" name="username" value={user.username} />
           <legend className="fieldset-legend">Set Password</legend>
           <input onChange={handleChange} type="text" className="input" placeholder="set password" name="password" value={user.password} />
          <button type="submit" className=" mt-2 pl-5 pr-5 btn btn-success">Sign_in</button>
          </form>
          <div>
            <p>
              if you have already acount then Log_in
            </p>
          </div>
        </div>
    )
}