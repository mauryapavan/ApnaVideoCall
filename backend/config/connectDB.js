import mongoose from "mongoose"



const connectDB=async()=>{
       await mongoose.connect(process.env.mongo_url)
      .then(()=>{
        console.log("succesfully database connected")
      })
      .catch((e)=>{
        console.log(e)
      })
}

export default connectDB 