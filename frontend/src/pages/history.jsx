import React, { useContext, useEffect, useState } from "react";
import WithAuth from "../utils/withAuth";
import { AuthContext } from "../context/handleAuth";

const History = () => {
    let { getHistoryOfUser } = useContext(AuthContext)

    let [data, setData] = useState([])

    useEffect(() => {
        async function fethchHistory() {
            
            let history = await getHistoryOfUser()
            if(history){
                setData(history)
            }
            
        }
        fethchHistory();
    }, [])

    function formDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`
    }

    return (
        <div className="p-5 h-[100vh]">
            { data.length>0 ? data.map((el, ind) => {
               return ( 
               <div className="card card-border bg-base-100 w-50 sm:w-96 mt-2" key={ind}>
                    <div className="card-body">
                        <h2 className="card-title">{el.meetingCode}</h2>
                        <p>{formDate(el.date)}</p>
                        
                    </div>
                </div>
               )
            })
            :
            <div className="p-5 bg-base-100 h-1/2 w-1/2">
               <p className="text-2xl text-[black]">Empty History</p>
            </div>
        }
            


       
        </div>)
}

export default WithAuth(History)