import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import {useParams} from "react-router-dom";
import OptionsModal from "../Modals/OptionsModal";
import ProfileItem from "../ProfileItem";
import {Modal} from "react-materialize";

function UserProfile(){

    const {state, dispatch}=useContext(UserContext);
    const [userProfile, setUserProfile]=useState(null);

    const [followers,setFollowers]=useState(undefined);
    const [followingUsers, setFollowingUsers]=useState(undefined);

    const userOptions=[
        {
            name:"Report",
            strict:false,
            className:"modal-button redButton pointer fw650",
            action:()=>{}

        },
        {
            name:"Block",
            strict:false,
            className:"modal-button redButton pointer fw650",
            action:()=>{}

        },
        {
            name:"Cancel",
            strict:false,
            className:"modal-button modal-close pointer",
            action:()=>{}
        }
    ];
    const unfollowOptions=[
        {
            name:"Unfollow",
            strict:false,
            className:"modal-button redButton pointer fw650",
            action:()=>{}

        },
        {
            name:"Cancel",
            strict:false,
            className:"modal-button modal-close pointer",
            action:()=>{}
        }
    ]

    const {userId}=useParams();
    

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

    function getFollowers(){

        return(
            fetch(`/getFollowers?userId=${userProfile.user._id}`,{
                method:"get",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res=>res.json())
            .then(data=>{
                setFollowers(data);
            })
            .catch(err=>{
                console.log({error:err})
            })
        )  
    }

    function getFollowing(){
        return(
            fetch(`/getFollowing?userId=${userProfile.user._id}`,{
                method:"get",
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("jwt"),
                }
            })
            .then(res=>res.json())
            .then(data=>{
                setFollowingUsers(data);
            })
            .catch(err=>{
                console.log(err);
            })
        )
    }

    return (
        <>
        {userProfile? 
        <div className="profilePage">
            <div className="profileHeader">
                <div className="profileHeader-left" >
                    <img className="profileImage" src={userProfile.user.profilePhoto} alt="" />
                </div>
                
                <div className="profileHeader-right">
                    <div className="profileName">
                        <h2>
                            {userProfile.user.username?userProfile.user.username:<div class="progress">
                                <div class="indeterminate" style={{width: "70%"}}></div>
                            </div>}
                        </h2>

                        
                        {(userProfile.user.followers.includes(state._id))?
                            <OptionsModal 
                                needHeader="true"
                                header={(<div><img className="unfollowImage" 
                                src= {userProfile.user.profilePhoto} alt="" /><p>{"Unfollow "+userProfile.user.username+"?"}</p></div>)}
                                userId={userProfile.user._id}
                                trigger={<button className="btn whiteButton">Unfollow</button>} 
                                unfollow={()=>{unfollow()}}
                                options={unfollowOptions}
                            />
                            :
                            <button className="btn blueButton mb-inherit followButton" onClick={()=>{follow()}}>Follow</button>
                        }

                        <OptionsModal 
                                userId={userProfile.user._id}
                                trigger={<i className="material-icons postOptions pointer" >more_horiz</i>} 
                                options={userOptions}
                             />

                    </div>
                    
                    <div className="profileData">
                        <h6 className="fw400"><span>{userProfile.posts.length}</span> posts</h6>
                        
                        <h6 className="fw400" onClick={()=>{getFollowers()}}> 
                            <Modal className="true followModal"
                    
                                header={<div><h3 className="heading-text-small">Followers</h3><hr></hr></div>}
                                trigger={<div className="pointer" ><span>{userProfile.user.followers.length}</span> followers</div>}>
                                {   
                                    followers &&
                                        (
                                            followers.length===0 ?
                                            <p>No followers</p>
                                            :
                                            followers.map((follower,index)=>{
                                                    return <ProfileItem key={index} user={follower}/> 
                                            })
                                        )
                                }
                            </Modal>
                        </h6>

                        <h6 className="fw400" onClick={()=>{getFollowing()}}>
                                
                            <Modal className="true followModal"
            
                                header={<div><h3 className="heading-text-small">Following</h3><hr></hr></div>}
                                trigger={<div className="pointer"><span>{userProfile.user.following.length}</span> following</div>}>
                                {   
                                    
                                    followingUsers &&
                                        (   
                                            followingUsers.length===0 ?
                                            <p>No following</p>
                                            :
                                            followingUsers.map((user,index)=>{
                                                    return <ProfileItem key={index} user={user}/> 
                                            })
                                        )
                                }
                            </Modal>
                                
                        </h6>

                    </div>
                    <div className="profile-info">
                            <h3 className="heading-text-small">{userProfile.user.fullname}</h3>
                            <p>
                                {
                                    userProfile.user.bio
                                }
                            </p>
                            <p className="blueLink dark"><a href={`https://${userProfile.user.website}`} target="_blank" rel="noopener noreferrer">{userProfile.user.website}</a></p>
                    </div>
                </div>
                
            </div>
            <div className="profile-info-mobile">
                            <h3 className="heading-text-small">{userProfile.user.fullname}</h3>
                            <p>
                                {
                                    userProfile.user.bio
                                }
                            </p>
                            <p className="blueLink dark"><a href={`https://${userProfile.user.website}`} target="_blank" rel="noopener noreferrer">{userProfile.user.website}</a></p>
            </div>
            


            <div className="profileData-mobile">
                <hr className="fullscreen-line"></hr>
            
                {/* <hr></hr> */}
                <div >
                        <h6 >
                            <span className="fw400">
                                <span >{userProfile.posts.length}</span> posts</span>
                        </h6>
                        
                        <h6 onClick={()=>{getFollowers()}}> 
                            <Modal className="true followModal"
                    
                                header={<div><h3 className="heading-text-small">Followers</h3><hr></hr></div>}
                                trigger={<div className="pointer" ><span className="fw400"><span>{userProfile.user.followers.length}</span> followers</span></div>}>
                                {   
                                    followers &&
                                        (
                                            followers.length===0 ?
                                            <p>No followers</p>
                                            :
                                            followers.map((follower,index)=>{
                                                    return <ProfileItem key={index} user={follower}/> 
                                            })
                                        )
                                }
                            </Modal>
                        </h6>

                        <h6 onClick={()=>{getFollowing()}}>
                                
                            <Modal className="true followModal"
            
                                header={<div><h3 className="heading-text-small">Following</h3><hr></hr></div>}
                                trigger={<div className="pointer"><span className="fw400"><span>{userProfile.user.following.length}</span> following</span></div>}>
                                {   
                                    
                                    followingUsers &&
                                        (   
                                            followingUsers.length===0 ?
                                            <p>No following</p>
                                            :
                                            followingUsers.map((user,index)=>{
                                                    return <ProfileItem key={index} user={user}/> 
                                            })
                                        )
                                }
                            </Modal>
                                
                        </h6>

                    </div>
                    <hr className="fullscreen-line"></hr>
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
            
        </div> :<div className="progress">
        <div className="indeterminate" style={{width: "70%"}}></div>
    </div>}
        </>
        
    );
}

export default UserProfile;