const express= require("express");
const router= express.Router();
const mongoose= require("mongoose");
require("../models/user");
const User=mongoose.model("User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {JWT_SECRET,SITE_LINK,SENDGRID_API}=require("../config/keys");
const requireLogin=require("../middleware/requireLogin");
const path= require('path');
const crypto = require("crypto")
const nodemailer= require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");


const transporter= nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))


router.post("/signup",(req,res)=>{
    const {username,email,password,fullname}=req.body;
    if(!username || !email || !password || !fullname){
        return res.status(422).json({error:"Please enter all the fields"});
    }
    User.findOne({ $or: [{ email: email }, { username: username }]})
        .then((foundUser)=>{
            if(foundUser){
                if(foundUser.email===email){
                    return res.status(422).json({error:"User already exists with that email"});
                }
            }
            else{
                bcrypt.hash(password,12)
                .then(hashedPassword=>{
                    const user= new User({
                        "email":email,
                        "password":hashedPassword,
                        "username":username,
                        "fullname":fullname
                    });
                    user.save()
                        .then((user)=>{
                            transporter.sendMail({
                                to:user.email,
                                from:"noreply.instaclone.app@gmail.com",
                                subject:"Signup success - Instaclone",
                                html:"<h2>Welcome to InstaClone!</h2> <p>We are excited to welcome you to the new InstaClone app.</p></p>"
                            })
                            res.json({message:"Signed up successfully"});
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                })
                .catch(err=>{
                    console.log("Hashing password failed",err);
                })
            } 
        })
        .catch(err=>{
            console.log(err);
        })
    
});

router.post("/login",(req,res)=>{
    const {unameOrEmail,password}=req.body;
    
    if(!unameOrEmail || !password){
        return res.status(422).json({error:"Enter all fields"});
    }

    User.findOne({$or:[{"username":unameOrEmail},{"email":unameOrEmail}]})
        .then(foundUser=>{
            if(!foundUser){
                return res.status(422).json({error:"Invalid username or password"});
            }
            bcrypt.compare(password,foundUser.password)
                .then(isMatching=>{
                    if(!isMatching){
                        return res.status(422).json({error:"Invalid username or password"});
                    }
                    const token=jwt.sign({_id:foundUser._id},JWT_SECRET);
                    const {_id,username,email,following,followers,profilePhoto}=foundUser;
                    res.json({token:token,user:{_id,username,email,following,followers,profilePhoto}});

                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=>{
            console.log(err);
        })



})

router.post("/reset-password",(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
        const token= buffer.toString("hex");
        User.findOne({email:req.body.email})
            .then((user)=>{
                if(!user){
                    return res.status(422).json({error:"No users found with that email"})
                }
                console.log(token);
                user.resetToken= token;
                user.expireToken= Date.now() + 3600000;
                user.save()
                    .then(result=>{
                       
                        transporter.sendMail({
                            to:user.email,
                            from: "noreply.instaclone.app@gmail.com",
                            subject:"Reset Password - Instaclone",
                            html:`
                            <p>Dear ${user.username},</p><p>You have requested a password reset for your account in Instaclone.</p>
                            <p>Click this <a href="${SITE_LINK}/reset/${token}">link</a> to reset password</p>
                            <p>The link will expire in 60 minutes</p><p>If you did not request a password reset you can safely ignore this email.</p>
                            `
                        })
                    })
                    res.json({message:"Check your email to reset password"})
                    
            })
    })
})

router.post("/checklink",(req,res)=>{
    User.findOne({resetToken:req.body.token,expireToken:{$gt:Date.now()}})
        .then(user=>{
            console.log(user);
            if(!user){
                return res.json({error:"Link expired. Please try again"})
            }
            return res.json({message:"Link is available"});
        })
        .catch(err=>{
            console.log(err);
        })
})

router.post("/changePassword",(req,res)=>{
    User.findOne({resetToken:req.body.token,expireToken:{$gt:Date.now()}})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"Link expired. Please Try again"});
            }
            bcrypt.hash(req.body.password,12)
                .then(hashedPassword=>{
                    user.resetToken=undefined;
                    user.expireToken=undefined;
                    user.password=hashedPassword;
                    user.save()
                        .then(user=>{
                            res.json({message:"Password changed successfully"})
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                })
                .catch(err=>{
                    console.log(err);
                })

        })
})

module.exports=router;


