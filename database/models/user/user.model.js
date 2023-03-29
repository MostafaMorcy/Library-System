// import { boolean, string } from "joi";
// import { boolean } from "joi";
import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, "name too short"],
      maxLength: [15, "name too long "],
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [2, "name too short"],
    },
    role:{
      type:String,
      enum:['user','admin'],
      default:'user',
      required:true
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
    type: Number,
      min:15,
      max:70
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    
      isLoggedIn:{
        type:Boolean,
        default:false
      },
      isOnline:{
        type:Boolean,
        default:false
      },
      isDeleted:{
        type:Boolean,
        default:false
      },
      lastSeen:Date
      ,
      code:{
        type:String,
        default:''
      },
      cover:Array,
      profilePic:String
    
  },
  {
    timestamps: true,
  }
);
export const userModel = mongoose.model("user", userSchema);
