import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faDisplay, faMicrophone, faMicrophoneSlash, faPhone, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const server_url = 'http://localhost:3030'
let connections = {}
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export const VideoMeet = () => {
    const chatEndRef = useRef(null);
    let navigate = useNavigate();
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();
    let [videoAvailable, setVideoAvailable] = useState(true)
    let [audioAvailable, setAudioAvailable] = useState(true)
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModel, setShowModel] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMeassages] = useState(0);
    let [askFOrUsername, setAskForUsername] = useState(true)
    let [username, setUsername] = useState("")

    const videoRef = useRef([])
    let [videos, setVideos] = useState([])

    //  if(isChrome()==false){

    //  }
    async function getPermission() {


        try {
            const videoPermision = await navigator.mediaDevices.getUserMedia({ video: true })

            if (videoPermision) {
                setVideoAvailable(true)
            }
            else {
                setVideoAvailable(false)
            }
            const audioPermision = await navigator.mediaDevices.getUserMedia({ audio: true })
            if (audioPermision) {
                setAudioAvailable(true)
            }
            else {
                setAudioAvailable(false)
            }
            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true)
            }
            else {
                setScreenAvailable(false)
            }
            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })
           
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                
                        localVideoRef.current.srcObject = userMediaStream
                    }
                }
            }

        }
        catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        getPermission()
    }, [])

    let getUserMediaSucces = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        }
        catch (e) { console.log(e) }
        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id == socketIdRef.current) continue;
            connections[id].addStream(window.localStream)
            connections[id].createOffer()
                .then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setAudio(false)
            setVideo(false)
            try {
                let tracks = localVideoRef.current.srcObject.getTreacks()
                tracks.forEach(track => track.stop())
            }
            catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {

                connections[id].addStream(window.localStream)
                connections[id].createOffer()
                    .then((description) => {
                        connections[id].setLocalDescription(description)
                            .then(() => {
                                socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                            })
                            .catch(e => console.log(e))
                    })
            }

        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSucces)
                .then((stream) => { })
                .catch((e) => { console.log(e) })
        }
        else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(trak => trak.stop())
            }
            catch (e) { console.log(e) }
        }
    }
    useEffect(() => {
        if (video != undefined && audio != undefined) {
            getUserMedia();
        }
    }, [audio, video])

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)
        if (fromId != socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type == "offer") {
                            connections[fromId].createAnswer()
                                .then((description) => {
                                    connections[fromId].setLocalDescription(description)
                                        .then(() => {
                                            socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                                        })
                                        .catch(e => console.log(e))
                                })
                                .catch(e => console.log(e))
                        }
                    })
                    .catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }

    }
    // todo addmessage
    let addMessage = (data, sender, socketIdSender) => {
        setMessages((prev) => [...prev, { sender: sender, data: data }])

        if (socketIdSender != socketIdRef.current) {
            setNewMeassages((prev) => prev + 1)
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })
        socketRef.current.on('signal', gotMessageFromServer)
        socketRef.current.on('connect', () => {
           
            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on("chat-message", addMessage)
            socketRef.current.on("user-left", (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })
            socketRef.current.on('user-joined', (id, clients) => {

                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                          
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }
                    connections[socketListId].onaddstream = (event) => {
                        //   console.log("BEFORE:", videoRef.current);
                        //   console.log("FINDING ID: ", socketListId);

                        let videoExist = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExist) {
                             console.log("FOUND EXISTING");

                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId == socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos
                                return updatedVideos
                            })

                        }
                        else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            }
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];

                                videoRef.current = updatedVideos
                                return updatedVideos
                            })

                        }
                    };
                    if (window.localStream != undefined && window.localStream != null) {
                        connections[socketListId].addStream(window.localStream);
                    }
                    else {
                        //todo
                        //let blackSilence
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                })
                if (id == socketIdRef.current) {
                    for (let id2 in connections) {

                        if (id2 == socketIdRef.current) continue
                        try {
                            connections[id2].addStream(window.localStream)
                        }
                        catch (e) { console.log(e) }
                        connections[id2].createOffer()
                            .then((description) => {
                                connections[id2].setLocalDescription(description)
                                    .then(() => {
                                        socketRef.current.emit('signal', id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                                    })
                                    .catch((e) => { console.log(e) })
                            })
                    }
                }
            })
        })
    }

    let getMedia = () => {
             
        setVideo(videoAvailable)
        setAudio(audioAvailable)
        connectToSocketServer()
    }

    let connect = () => {
        if(username!=""){
          setAskForUsername(false);
           getMedia();
        }
        
    }

    let getDisplayMediaSucces = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })


    }

    let getDisplayMedia = () => {
     
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSucces)
                    .then((stream) => { })
                    .catch((e) => { console.log(e) })
            }
        }
    }

    useEffect(() => {
      
        if (screen != undefined) {
            getDisplayMedia();
        }
    }, [screen])

    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username)
        setMessage("")
    }
    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop())
        }
        catch (e) { console.log(e) }
        navigate("/")
    }

    let getAi=async () => {
        socketRef.current.emit("chat-message", message, "AI")
        setMessage("")
        
    }

    // this is for scrolling effect
    useEffect(() => {
 
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="min-h-screen ">
            {askFOrUsername == true ?
                <div className="p-5">
                    <h2 className="text-3xl text-[black]">Enter into Lobby</h2>
                    <legend className="fieldset-legend">name</legend>
                    <input onChange={e => { setUsername(e.target.value) }} type="text" className="input" placeholder="enter username" name='username' value={username} />
                    <button onClick={connect} className="btn btn-primary px-5 rounded-xl ">Connect</button>
                    <div>
                        <video ref={localVideoRef} autoPlay ></video>
                    </div>
                </div> :
                <div className=" relative h-screen" style={{ backgroundColor: '#09083b' }}>
                    {showModel == true ?
                        <div className="p-3 absolute h-[90vh] w-[30vw] bg-[white] right-0 bottom-[10vh] rounded-[10px] text-[black]">
                            <div className="h-[100%] relative">
                                <div className="bg-[#a4f5d3] p-2 rounded-xl">
                                      <h1 className="text-5xl">Chat</h1> 
                                </div>
                                
                                <div className="mt-5" style={{overflowY:"auto",height:"70vh"}}>
                                    {messages.length > 0 ? messages.map((el, ind) => {
                                        return (
                                            <div className="mb-2 p-2 rounded-xl bg-[#6eb3f0] " key={ind}>
                                                <p className="text-2xl font-medium">{el.sender}</p>
                                                <p className="text-xl font-normal"> {el.data}</p>
                                            </div>
                                        )
                                    }) : <div>Not message yet</div>
                                    }
                                    <div ref={chatEndRef}></div>

                                </div>
                                <div className="absolute bottom-0 flex w-[100%]">
                                    <input onChange={(e) => { setMessage(e.target.value) }} value={message} type="text" placeholder="send message" className="input input-neutral w-3/4" />
                                    <button className="btn btn-primary w-1/4" onClick={sendMessage}>Send</button>
                                    <button className="btn rounded-2xl bg-[#16940a] w-1/8" onClick={getAi}>AI+</button>

                                </div>


                            </div>
                        </div> : <></>}

                    <div className="absolute w-[100vw] bottom-0 text-center mb-2">

                        <button className="btn btn-lg btn-circle p-1 m-1 text-[2rem]" onClick={() => { setVideo(!video) }}>
                            {video == true ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faVideoSlash} />}
                        </button>
                        <button onClick={handleEndCall} className="btn btn-lg btn-circle p-1 m-1 text-[red] text-[2rem]">
                            <FontAwesomeIcon icon={faPhone} />
                        </button>
                        <button className="btn btn-lg btn-circle p-1 m-1 text-[2rem]" onClick={() => { setAudio(!audio) }}>
                            {audio === true ? <FontAwesomeIcon icon={faMicrophone} /> : <FontAwesomeIcon icon={faMicrophoneSlash} />}
                        </button>
                        {screenAvailable === true ?
                            <button onClick={() => { setScreen(!screen) }} className="btn btn-lg p-1 btn-circle text-[2rem] m-1">
                                {screen == true ? <FontAwesomeIcon className="text-[blue] " icon={faDisplay} /> : <FontAwesomeIcon className="opacity-25" icon={faDisplay} />}
                            </button>
                            : <></>


                        }

                        <button className="btn btn-lg btn-sqaure text-black" onClick={() => { setShowModel(!showModel); setNewMeassages(0) }}>
                            <FontAwesomeIcon className="text-[2rem]" icon={faCommentDots} />
                            {newMessages}

                        </button>

                    </div>
                    <video className="absolute h-[20vh] w-auto bottom-[10vh] left-0 rounded-[20px]" ref={localVideoRef} autoPlay ></video>
                    <div className="flex p-3 gap-[10px]">
                        {videos.map((vid) => (
                            <div key={vid.socketId}>

                                <video className="w-[40vw] h-[20vh] min-w-[30px] rounded-[20px]" data-socket={vid.socketId}
                                    ref={ref => {
                                        if (ref && vid.stream) {
                                            ref.srcObject = vid.stream
                                        }
                                    }}

                                    autoPlay
                                ></video>
                            </div>
                        ))}

                    </div>

                </div>}
        </div>
    )
}