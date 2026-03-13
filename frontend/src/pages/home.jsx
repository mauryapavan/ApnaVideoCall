import React, { useContext, useState } from "react";
import WithAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/handleAuth";

const Home = () => {
     const { addToUserHistory} =useContext(AuthContext)
    let navigate = useNavigate();
    const [meetingCode, setmeetingCode] = useState("");
    let handleJoinVideoCall = async() => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }
   const logout=()=>{
    localStorage.removeItem('token')
    navigate("/")
   }
     
    return (
        <>
           <div className="h-[100vh]">
            <div className="text-[black] p-2 flex ">
                {/* navbar */}
                <div className="w-1/2">
                    <p className="text-md sm:text-3xl font-medium">Apna video Call</p>
                </div>
                <div className="w-1/2 flex justify-end p-2 cursor-pointer">
                    <div className="mx-2 text-md sm:text-3xl font-medium hover:text-[blue]" onClick={()=>{navigate("/history")}}><span><FontAwesomeIcon icon={faClockRotateLeft} /></span> History</div>
                    <div className="mx-2 text-md sm:text-3xl font-medium">
                        <button className="hover:text-[blue]" onClick={logout}>Log_out</button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-[black] h-[80vh]">
                <div className="flex  flex-wrap w-[80%]">
                    <div className="w-1/2 items-center  flex h-[60vh] min-w-[15rem]">
                     
                        <div class="w-[100%]">
                            <p className=" text-xl font-medium">Providing Qaulity Videocall just like Qaulity Education</p>
                             <input type="text" value={meetingCode} className="bg-white w-2/4 h-9 p-2 mt-2" onChange={(e)=>setmeetingCode(e.target.value)} placeholder="meeting code" />
                             <button className="btn btn-primary w-1/4" onClick={handleJoinVideoCall}>join</button>
                        </div>
                    </div>
                    <div className="w-1/2 h-[60vh] p-5 bg-[white] min-w-[15rem]">
                    <img src="../public/undraw_investor-update_ou4c.svg" alt="" />
                    </div>
                </div>

            </div>
            </div>
        </>
    )
}

export default WithAuth(Home)