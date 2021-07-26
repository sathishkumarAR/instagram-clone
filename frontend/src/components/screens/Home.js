import React, { useEffect, useState,useContext } from "react";
import M from "materialize-css";
import {UserContext} from "../../App";
import { useHistory } from "react-router";
import Modal from "../Modals/OptionsModal";  
import {Link} from "react-router-dom";




function Home(){
    const [posts, setPost]=useState([]);
    const {state, dispatch}= useContext(UserContext);
    const [comment, setComment]=useState("");
    const history=useHistory();
    const postOptions=[
        {
            name:"Report",
            strict:false,
            className:"modal-button redButton fw650 pointer",
            action:()=>{}

        },
        {
            name:"Delete",
            strict:true,
            className:"modal-button modal-close redButton fw650 pointer",
            action:()=>{}
        },
        {
            name:"Cancel",
            strict:false,
            className:"modal-button modal-close pointer",
            action:()=>{}
        }
    ]

    useEffect(()=>{
        fetch("/allposts",{
            method:"get",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(fetchedPosts=>{
            console.log(fetchedPosts.posts)
            setPost(fetchedPosts.posts);
        })
    },[]);

    function likePost(postId){
        return(
            fetch("/like",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId:postId
                })
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                const newData=posts.map(post=>{
                    if(post._id===result._id){
                        return result;
                    }
                    else{
                        return post;
                    }
                });
                setPost(newData);
            })
        ) 
    }
    function unlikePost(postId){
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            const updatedPosts=posts.map(post=>{
                if(post._id===result._id){
                    return result;
                }
                else{
                    return post;
                }
            });
            setPost(updatedPosts);
            
        })

    }

    function addComment(text,postId){
        return (
            fetch("/comment", {
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    text:text,
                    postId:postId
                })
            })
            .then(res=>res.json())
            .then(result=>{
                const updatedPosts=posts.map(post=>{
                    if (post._id===result._id){
                        return result;
                    }
                    else{
                        return post;
                    }
                });
                console.log(updatedPosts);
                setPost(updatedPosts);
            })
        )
    }
    function deletePost(postId){
        return(
            fetch("/deletePost/"+postId,{
                method:"delete",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res=>res.json())
            .then(result=>{
                M.toast({html:"Deleted Successfully !",classes:"#4caf50 green"});
                const updatedPosts=posts.filter(post=>{
                    if(post._id!==result.deletedPost._id){
                        return post;
                    }
                    else{
                        return null;
                    }
                })
                console.log(updatedPosts);
                setPost(updatedPosts);
            })
            
        )
    }

    function deleteComment(postId,commentId){
        return (
            fetch("/deleteComment/"+postId+"/"+commentId,{
                method:"delete",
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res=>res.json())
            .then(result=>{
                const updatedPosts=posts.map(post=>{
                    if (post._id===result._id){
                        return result;
                    }
                    else{
                        return post;
                    }
                });
                console.log(updatedPosts);
                setPost(updatedPosts);
            })
        )
    }

    return (
        <>
        {
            posts?

            (
                <div className="home">
            {   
                posts.map((post,index)=>{
                    return(
                        <div key={index} className="card home-card">

                        
                            <div className="post-header">
                                <div className="post-postedBy">
                                    <img className="post-postedBy-img" src={post.postedBy.profilePhoto} alt="" />
                                    <h6 className="post-postedBy-name">
                                        <Link to={post.postedBy._id!==state._id?"/profile/"+post.postedBy._id:"/profile"}>{post.postedBy.username}</Link>
                                    </h6>
                                </div>
                                <Modal 
                                    header=''
                                    userId={post.postedBy._id}
                                    trigger={<i className="material-icons postOptions pointer" >more_horiz</i>} 
                                    delete={()=>{deletePost(post._id)}}
                                    options={postOptions}
                                />
                             </div>


                            <div className="card-image">
                                <img className="post-image" src={post.photo} alt="" />
                            </div>


                            <div className="card-content">
                                {
                                    post.likes.includes(state._id)? (<i className="material-icons" style={{color:"red", cursor:"pointer"}} onClick={()=>{
                                            unlikePost(post._id)
                                        }}>favorite</i>) : 
                                        (<i className="material-icons" style={{cursor:"pointer"}} onClick={()=>{
                                            likePost(post._id)
                                        }}>favorite_border</i>)
                                }
                                <p>{post.likes.length + " likes"}</p>
                                <p>{post.caption}</p>

                                
                                {post.comments.map(comment=>{
                                       return(
                                           <p className="comment"  key={comment._id}>
                                           <Link to={comment.postedBy._id!==state._id?"/profile/"+comment.postedBy._id:"/profile"}><span className="userCommented">{comment.postedBy.username}</span></Link>
                                             
                                             {" "+comment.text}
                                             <Modal 
                                                header=''
                                                userId={comment.postedBy._id}
                                                trigger={<i className="material-icons comment-options pointer" >more_horiz</i>} 
                                                delete={()=>{deleteComment(post._id,comment._id)}}
                                                options={postOptions}
                                            />
                                            </p>
                                        )
                                    })}
                                
                                <form className="comment-form" onSubmit={(e)=>{
                                    e.preventDefault();
                                    addComment(e.target[0].value,post._id);
                                }}>
                                    <input type="text" onChange={(e)=>{
                                        setComment(e.target.value)
                                    }} placeholder="Add a comment"></input>
                                    
                                    <i className="material-icons pointer" onClick={(e)=>{
                                        e.preventDefault();
                                        addComment(comment,post._id);
                                }}>send</i>
                                </form>
                                
                                
                            </div>
                        </div>
                    )   
                })
                
            }
        </div>
            )
            :
            <div class="progress">
                <div class="indeterminate" style={{width: "70%"}}></div>
            </div>
        }
        </>
        
        
    );
}

export default Home;