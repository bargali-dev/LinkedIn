import mongoose  from "mongoose";

let connectionSchema = new mongoose.Schema({
    sender:{
      type:mongoose.Schema.ObjectId,
      ref:"User"
    },
    receiver:{
      type:mongoose.Schema.ObjectId,
      ref:"User"
    },
    status:{
      type:String,
      enum:["pending","accepted","reject"],
      default:"pending"
    }
},{timestamps:true})

const Connection = mongoose.model("Connection",connectionSchema)
export default Connection