import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


const WithAuth=(WrappedComponent)=>{
    const authComponent=(props)=>{
        let navigate=useNavigate();

        const isAuthenticate=()=>{
            if(localStorage.getItem('token')){
                return true
            }
            return false
        }

        useEffect(()=>{
            if(!isAuthenticate()){
                navigate("/auth")
            }
        },[])

        return <WrappedComponent {...props}></WrappedComponent>
    }
    return authComponent
}

export default WithAuth