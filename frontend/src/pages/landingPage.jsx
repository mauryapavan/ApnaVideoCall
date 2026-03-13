import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
export default function LandingPage() {


    const router = useNavigate();

    const start=()=>{
        if(localStorage.getItem('token')){
            router("/home")
        }
        else{
            router("/auth")
        }
    }


    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2 className='sm:text-4xl text-2xl font-[500]'>Apna Video Call</h2>
                </div>
                {
                    !localStorage.getItem('token') &&  <div className='navList text-sm sm:text-[1.1rem] font-[500] sm:gap-[1.6rem] gap-[1rem] '>
                    <p onClick={()=>{router("/q2q333")}}  >Join as Guest</p>
                    <p onClick={()=>{router("/auth")}} >Register</p>
                    <div  role='button' className='text-md sm:px-[2.5rem] sm:py-[0.3rem] px-[1.5rem] py-[0.1rem]' onClick={()=>{router("/auth")}}>
                        <p>Login</p>
                    </div>
                </div>
                }
               
            </nav>


            <div className="landingMainContainer">
                <div>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>

                    <p>Cover a distance by Apna Video Call</p>
                    <div role='button'>
                        <p onClick={start}>Get Started</p>
                    </div>
                </div>
                <div className=''>

                    <img src="https://plus.unsplash.com/premium_vector-1732197718490-0f6daa32769f?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />

                </div>
            </div>



        </div>
    )
}