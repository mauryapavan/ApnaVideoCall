import { User } from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Meeting } from "../Models/meetingModel.js";



const register=async (req,res) => {
    const {name , username , password}=req.body || {};
    if(!name || !username || !password){
       return  res.json({status:false,message:"all fields are required"});
    }
    try{
      const userExist=await User.findOne({username});
      if(userExist){
        return res.json({status:false,message:"User Already Exist"})
      }
      const newpassword=await bcrypt.hash(password,10);
      const newUser= new User({
        name:name,
        username:username,
        password:newpassword
      })
      newUser.save();
      return res.json({status:true,message:"User succesfully registered"});
    }
    catch(e){
       return  res.json({status:false,message:`something went wrong ${e}`})
    }
}


const login=async (req,res) => {
    
    const {username,password}=req.body || {};
    if(!username || !password){
       return  res.json({status:false,message:"all fields are required"});
    }
    try{
     const userExist=await User.findOne({username});
     if(!userExist){
        return res.json({status:false,message:"User is not Exist please register"})
     }
     if(await bcrypt.compare(password,userExist.password)){

       const token = jwt.sign({ username: username }, process.env.secret_token, { expiresIn: '168h' });
       userExist.token=token;
       await userExist.save();
       return res.json({status:true,message:"you are loged in succesfully",token})
     }
       return  res.json({status:false,message:`password or username is wrong`})
    }
    catch(e){
       return  res.json({status:false,message:`something went wrong ${e}`})
    }

    
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
      
        const user = await User.findOne({ token: token });
      
        const meetings = await Meeting.find({ user_id: user.username });
          

        // console.log(meetings)
        res.json({status:true,meetings})
    } catch (e) {
        console.log(e)
        res.json({status:false, message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.json({status:true ,message: "Added code to history" })
    } catch (e) {
        res.json({status:false, message: `Something went wrong ${e}` })
    }
}

export {login,register,addToHistory,getUserHistory}