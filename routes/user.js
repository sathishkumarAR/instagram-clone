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
                .populate("postedBy","_id username")
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
    User.find({username:{$regex:pattern}})
        .select("_id username profilePhoto")
        .then(result=>{
            let users={}
            result.forEach(data => {
                users[data.username]=data.profilePhoto
            });
            // console.log(users)
            return res.json(users);
        })
        .catch(err=>{
            console.log(err);
        })
})

router.post("/getID",requireLogin,(req,res)=>{
    User.findOne({username:req.body.username})
        .select("_id")
        .then(userID=>{
            res.json(userID);
        })
        .catch(err=>{
            console.log(err);
        })
})

router.put("/removeProfilePhoto",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{profilePhoto:"https://res.cloudinary.com/wings05/image/upload/v1625411692/44884218_345707102882519_2446069589734326272_n_u82kmh.jpg" }
    },{new:true})
    .select("_id username profilePhoto")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.get("/getFollowers",requireLogin,(req,res)=>{
    const userId= req.query.userId;
    User.find({following:{$in:userId}})
        .select("username profilePhoto")
        .then(data=>{
            return res.json(data);
        })
        .catch(err=>{
            console.log(err);
        })
})

router.get("/getFollowing", requireLogin, (req,res)=>{
    const userId= req.query.userId;
    User.find({followers:{$in:userId}})
        .select("username profilePhoto")
        .then(data=>{
            res.json(data);
        })
        .catch(err=>{
            console.log(err);
        })
})

router.get("/checkUsername",(req,res)=>{
    User.findOne({username:req.query.username})
        .then(data=>{
            if(data){
                return res.json({availability:false});
            }
            res.json({availability:true})
        })
})


module.exports=router;