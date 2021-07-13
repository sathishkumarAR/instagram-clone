const jwt= require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const mongoose=require("mongoose");
const User=mongoose.model("User");


module.exports=(req,res,next)=>{
    // console.log(req.method);
    const authorization=req.header("authorization");

    //if the user is not logged in, authorization field in headers will be empty

    if(!authorization){
        return res.status(402).json({error:"You must log in"});
    }

    const token= authorization.replace("Bearer ","");
    jwt.verify(token,JWT_SECRET, (err,payload)=>{

        if(err){
            return res.status(402).json({error:"You must be logged in to access this page"});
        }

        User.findById(payload._id)
            .then(userData=>{
                req.user=userData; //In this middleware, we are storing the current userData in req.user, so that we can access it while processing a request 
                next();
            })
             
    });


}