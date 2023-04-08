import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    name:{type:String,required:true},
    number:{type:String,required:true},
    gmail:{type:String,required:true},
    password:{type:String,required:true},
    token:{type:String,default:''}
})
export const AdminModel= mongoose.model("admin",adminSchema);