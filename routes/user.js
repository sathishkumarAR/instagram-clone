const express=require("express");
const mongoose= require("mongoose")
const requireLogin=require("../middleware/requireLogin");
require("../models/user");
require("../models/postModel");
const router= express.Router();

const Post= mongoose.model("Post");
const User= mongoose.model("User");



router.get("/user/:user",requireLogin,(req,res)=>{
    User.findById(req.params.user)
        .select("-password")
        .then(user=>{
            Post.find({"postedBy":user._id})
                .populate("postedBy","_id name")
                .exec((err,posts)=>{
                    if(err){
                        return res.status(422).json({error:err})
                    }
                    res.json({user,posts})
                })
        })
        .catch(err=>{
            return res.status(404).json({error:"Invalid User"})
        })
})

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    })
    .select("-password")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        })
        .select("-password")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json(result);
        })
    })
    
})
router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    })
    .select("-password")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            return res.json(result);
        })
    })
    
})

router.put("/profilePhoto",requireLogin,(req,res)=>{
    const {photo}=req.body;

    if(!photo){
        return res.status(422).json({error:"Please fill all mandatory fields"});
    }
    console.log(req.user);

    User.findByIdAndUpdate(req.user._id,{
        $set:{profilePhoto:photo}
    },{
        new:true
    })
    .select("-password")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
});

router.post("/search-users",requireLogin,(req,res)=>{
    const pattern=new RegExp("^"+req.body.query);
    User.find({name:{$regex:pattern}})
        .select("_id name profilePhoto")
        .then(result=>{
            let users={}
            result.forEach(data => {
                users[data.name]=data.profilePhoto
            });
            // console.log(users)
            return res.json(users);
        })
        .catch(err=>{
            console.log(err);
        })
})

router.post("/getID",requireLogin,(req,res)=>{
    User.findOne({name:req.body.name})
        .select("_id")
        .then(userID=>{
            res.json(userID);
        })
        .catch(err=>{
            console.log(err);
        })
})

module.exports=router;