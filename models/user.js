const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types;

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:"https://res.cloudinary.com/wings05/image/upload/v1625411692/44884218_345707102882519_2446069589734326272_n_u82kmh.jpg"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    website:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        default:""
    },
    resetToken:String,
    expireToken:Date
});

mongoose.model("User",userSchema);
