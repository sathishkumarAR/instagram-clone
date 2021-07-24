import React, { useContext, useEffect, useCallback, useState,useRef } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../../App";
import OptionsModal from "../Modals/OptionsModal"
import {Modal} from "react-materialize";
import ProfileItem from "../ProfileItem";
import M from "materialize-css";



function Profile(){

    const {state, dispatch}=useContext(UserContext);
    const [myposts, setMyPosts]=useState([]);
    const [photo,setPhoto]=useState();
    const [photoURL,setPhotoURL]=useState();
    const history= useHistory();

    const [followers,setFollowers]=useState(undefined);
    const [followingUsers, setFollowingUsers]=useState(undefined);
    
    


    const profilePhotoOptions=[
        {
            name:"Upload Photo",
            strict:false,
            className:"modal-button modal-close pointer blueLink light fw650",
            action:()=>{}

        },
        {
            name:"Remove Current Photo",
            strict:false,
            className:"modal-button modal-close redButton pointer fw650",
            action:()=>{}

        },
        {
            name:"Cancel",
            strict:false,
            className:"modal-button modal-close pointer",
            action:()=>{}
        }
    ];

    useEffect(()=>{
        if(photoURL){
            fetch("/profilePhoto",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    photo:photoURL
                })
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data);
                dispatch({type:"UPDATE_PROFILE_PHOTO",payload:{profilePhoto:photoURL}})
                localStorage.setItem("user",JSON.stringify({...state,profilePhoto:photoURL}));
                history.push("/profile");
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },[photoURL]);

    useEffect(()=>{
        if(photo){
            postData()
        }
    },[photo])

    function postData(){
        // console.log("inside postData")
        const imageData= new FormData();
        imageData.append("file",photo);
        imageData.append("upload_preset","insta-clone");
        imageData.append("cloud_name","wings05");
        return(
            fetch("https://api.cloudinary.com/v1_1/wings05/image/upload",{
                method:"post",
                body:imageData
            })
            .then(res=>res.json())
            .then(data=>{
                // console.log(data.secure_url)
                setPhotoURL(data.secure_url);
            })
            .catch(err=>{
                console.log(err);
            })
        )
  
    }


    useEffect(()=>{
        fetch("/myposts",{
            method:"get",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(data=>{
            setMyPosts(data.posts);
        })
        .catch(err=>{
            console.log(err);
        })
    },[])
    // var instance = M.Modal.getInstance(FollowModal.current);
    // if(instance.isOpen){
    //     console.log("working")
    // }
   
    

    function getFollowers(){

        return(
            fetch(`/getFollowers?userId=${state._id}`,{
                method:"get",
                headers:{
                    "Content-Type":"application/json",
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
            fetch(`/getFollowing?userId=${state._id}`,{
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

    

    function uploadProfilePhoto(){
        return(
            document.getElementById("upload").click()
            )                    
    }

    function removeProfilePhoto(){
        fetch("/removeProfilePhoto",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }            
        })
        .then(res=>res.json())
        .then(res=>{
            dispatch({type:"UPDATE_PROFILE_PHOTO",payload:{profilePhoto:res.profilePhoto}})
            localStorage.setItem("user",JSON.stringify({...state,profilePhoto:res.profilePhoto}));
        })
        .catch(err=>{
            console.log(err);
        })
    }


    return (
            <>
            {
                state?
                <div className="profilePage">
                    <div className="profileHeader">
                    <OptionsModal 
                        needHeader="true"
                        header={<h6 className="changeProfilePhoto-header">Change Profile Photo</h6>}
                        userId={state._id}
                        trigger={<div title="Change Profile Picture">
                            <div >
                                <img className="profileImage pointer" src={state.profilePhoto} alt="" />
                            </div>
                        </div>}
                        upload={()=>{uploadProfilePhoto()}}
                        remove={()=>{removeProfilePhoto()}}
                        options={profilePhotoOptions}
                    />
                    <div className="file-field hide">
                    
                        <input id="upload" type="file" onChange={(event)=>{
                            setPhoto(event.target.files[0]);
                        }} />
                        
                        <div className="file-path-wrapper hide-file-path">
                                <input className="file-path validate" type="text"/>
                        </div>
                     </div>

                        <div>
                            <h4>{state?state.name:"loading..."}</h4>
                            <div className="profileData">
                                <h6 className="fw400"><span>{myposts.length}</span> posts</h6>
                                <h6 className="fw400" onClick={()=>{getFollowers()}}>
                        
                                <Modal className="true followModal"
                
                                    header={<div><h3 className="heading-text-small">Followers</h3><hr></hr></div>}
                                    trigger={<div className="pointer" ><span>{state?state.followers.length:"0"}</span> followers</div>}>
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
                                    trigger={<div className="pointer"><span>{state?state.following.length:"0"}</span> following</div>}>
                                    {   
                                        followingUsers &&
                                        (    followingUsers.length===0 ?
                                            <p>No following</p>
                                            :
                                            followingUsers.map((user,index)=>{
                                                    return <ProfileItem key={index} user={user}/> 
                                            }))
                                    }
                                </Modal>
                                
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="profileGallery">

                        {
                            myposts.map((post,index)=>{
                                return(
                                    <img key={index} className="item" src={post.photo} alt="" />
                                )
                                
                            })
                        }
                    </div>
                </div>
                 :<div class="progress">
                    <div class="indeterminate" style={{width: "70%"}}></div>
                </div>
            }

            </>
                
        
    );
}

export default Profile;