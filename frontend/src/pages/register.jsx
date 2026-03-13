import React, { useContext, useState }  from "react";
import { AuthContext } from "../context/handleAuth";

export function Register(){
  const {handleLogin}=useContext(AuthContext);
    const [user,setuser]=useState({username:"",password:""});
      const handleChange=(e)=>{
     setuser({...user,[e.target.name]:e.target.value})

  }

  const login=(e)=>{
    e.preventDefault();
    handleLogin(user.username,user.password)
    setuser({username:"",password:""})
  }
    return(
        <div className="text-center">
          <form action="" onSubmit={login}>
            
           <legend className="fieldset-legend">userName</legend>
           <input onChange={handleChange} type="text" className="input" placeholder="Enter username" name="username" value={user.username} />
           <legend className="fieldset-legend">Enter Password</legend>
           <input onChange={handleChange} type="text" className="input" placeholder="Enter password" name="password" value={user.password} />
          <button type="submit" className=" mt-2 pl-5 pr-5 btn btn-success">Sign_in</button>
          </form>
          <div>
            <p>
              if you have not Acount then Sign_up
            </p>
          </div>
          
        </div>
    )
}