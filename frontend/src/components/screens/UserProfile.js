import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import {useParams} from "react-router-dom";
import Modal from "../Modal";

function UserProfile(){

    const {state, dispatch}=useContext(UserContext);
    const userOptions=[
        {
            name:"Report",
            strict:false,
            className:"modal-button redButton",
            action:()=>{}

        },
        {
            name:"Block",
            strict:false,
            className:"modal-button redButton",
            action:()=>{}

        },
        {
            name:"Cancel",
            strict:false,
            className:"modal-button modal-close",
            action:()=>{}
        }
    ];
    const unfollowOptions=[
        {
            name:"Unfollow",
            strict:false,
            className:"modal-button redButton",
            action:()=>{}

        },
        {
            name:"Cancel",
            strict:false,
            className:"modal-button modal-close",
            action:()=>{}
        }
    ]

    const {userId}=useParams();
    const [userProfile, setUserProfile]=useState(null);

    useEffect(()=>{
        fetch("/user/"+userId,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            setUserProfile(data);            
        })
        .catch(err=>{
            console.log(err);
        })
    },[])

    function follow(){
        return(
            fetch("/follow",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")  
                },
                body:JSON.stringify({
                    followId:userId
                })
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                dispatch({type:"UPDATE_FOLLOW",payload:{followers:result.followers,following:result.following}})
                localStorage.setItem("user",JSON.stringify(result));

                setUserProfile((prevProfile)=>{
                    return {
                        ...prevProfile,
                        user:{
                            ...prevProfile.user,
                            followers:[
                                ...prevProfile.user.followers,
                                result._id
                            ]
                        }
                    }
                });
            })
        )
    }

    function unfollow(){
        return(
            fetch("/unfollow",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")  
                },
                body:JSON.stringify({
                    unfollowId:userId
                })
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                dispatch({type:"UPDATE_FOLLOW",payload:{followers:result.followers,following:result.following}})
                localStorage.setItem("user",JSON.stringify(result));

                setUserProfile(prevProfile=>{
                    const newFollowers=prevProfile.user.followers.filter((follower)=>{
                        return follower!==state._id;
                    })
                    return {
                        ...prevProfile,
                        user:{
                            ...prevProfile.user,
                            followers:newFollowers
                        }
                    }
                })
            })
        )
    }

    return (
        <>
        {userProfile? <div className="profilePage">
            <div className="profileHeader">
                <div >
                    <img className="profileImage" src={userProfile.user.profilePhoto} alt="" />
                </div>
                
                <div>
                    <div className="profileName">
                        <h4>
                            {userProfile.user.name?userProfile.user.name:"loading..."}
                        </h4>

                        
                        {/* .outerHTML converts HTML element to a string */}
                        {(userProfile.user.followers.includes(state._id))?
                            <Modal 
                                needHeader="true"
                                header={(<div><img className="unfollowImage" 
                                src= {userProfile.user.profilePhoto} alt="" /><p>{"Unfollow "+userProfile.user.name+"?"}</p></div>).outerHTML}
                                userId={userProfile.user._id}
                                text={<button className="btn unfollowButton">Unfollow</button>} 
                                unfollow={()=>{unfollow()}}
                                options={unfollowOptions}
                            />
                            :
                            <button className="btn blueButton followButton" onClick={()=>{follow()}}>Follow</button>
                        }

                        <Modal 
                                userId={userProfile.user._id}
                                text={<i className="material-icons postOptions" >more_horiz</i>} 
                                options={userOptions}
                             />

                    </div>
                    
                    <div className="profileData">
                        <h6 className="fw400"><span>{userProfile.posts.length}</span> posts</h6>
                        <h6 className="fw400"><span>{userProfile.user.followers.length}</span> followers</h6>
                        <h6 className="fw400"><span>{userProfile.user.following.length}</span> following</h6>
                    </div>
                </div>
            </div>

            <div className="profileGallery">
                {
                    userProfile.posts.map((post,index)=>{
                        return(
                            <img key={index} className="item" src={post.photo} alt="" />
                        )
                        
                    })
                }
            </div>
            
        </div> :"loading!"}
        </>
        
    );
}

export default UserProfile;