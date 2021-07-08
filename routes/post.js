const express=require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { route } = require("./auth");
const router=express.Router();
require("../models/postModel");
const Post=mongoose.model("Post");

router.get("/allposts",requireLogin,(req,res)=>{
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy","_id name")
        .then(posts=>{
            res.json({posts:posts});
        })
        .catch(err=>{
            console.log(err);
        })
})

router.get("/myposts",requireLogin,(req,res)=>{
    // console.log(__dirname);
    Post.find({"postedBy":req.user._id})
        .populate("postedBy","_id name")
        .then(posts=>{
            res.json({posts:posts});
        })
        .catch(err=>{
            console.log(err);
        })
});


router.get("/posts",requireLogin,(req,res)=>{
    // console.log(req.headers)
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy","_id name")
        .then(posts=>{
            res.json({posts:posts});
        })
        .catch(err=>{
            console.log(err);
        })
})

router.post("/createpost",requireLogin,(req,res)=>{
    const {title,caption,photo}=req.body;

    if(!photo){
        return res.status(422).json({error:"Please fill all mandatory fields"});
    }
    req.user.password=undefined;
    console.log(req.user);
    const post= new Post({
        title:title,
        caption:caption,
        photo:photo,
        postedBy:req.user

    });
    post.save()
        .then((savedPost)=>{
            // res.json({message:"Post saved successfully!!!"});
            res.json({savedPost});
        })
        .catch(err=>{
            console.log(err);
        })

});

router.put("/like", requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
});
router.put("/unlike", requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
});

router.put("/comment", requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user
    }
    if(comment.text){
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{comments:comment}
        },{
            new:true
        })
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    }
    
});

router.delete("/deleteComment/:postId/:commentId",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.params.postId,{
        $pull:{comments:{_id:req.params.commentId}}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        else{
            res.json(result);
        }
    })
        
})

router.delete("/deletePost/:postId",requireLogin,(req,res)=>{
    Post.findOne({"_id":req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error:err});
            }
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
                    .then(result=>{
                        res.json({deletedPost:result});
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            }
        })
})



module.exports=router;