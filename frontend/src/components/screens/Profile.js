import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../../App";


function Profile(){

    const {state, dispatch}=useContext(UserContext);

    const [myposts, setMyPosts]=useState([]);
    const [photo,setPhoto]=useState();
    const [photoURL,setPhotoURL]=useState();
    const history= useHistory();

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
        console.log("inside postData")
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
                console.log(data.secure_url)
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


    return (
            <>
            {
                state?
                <div className="profilePage">
                    <div className="profileHeader">


                   
                <div className="file-field">
                    <div title="Change Profile Picture">
                    <div >
                            <img className="profileImage" src={state.profilePhoto} alt="" />
                        </div>
                            <input type="file" onChange={(event)=>{
                                console.log(event.target.files);
                                setPhoto(event.target.files[0]);
                            }} />
                    </div>
                    <div className="file-path-wrapper hide-file-path">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                        <div>
                            <h4>{state?state.name:"loading..."}</h4>
                            <div className="profileData">
                                <h6 className="fw400"><span>{myposts.length}</span> posts</h6>
                                <h6 className="fw400"><span>{state?state.followers.length:"0"}</span> followers</h6>
                                <h6 className="fw400"><span>{state?state.following.length:"0"}</span> following</h6>
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
                 :"loading..."
            }

            </>
                
        
    );
}

export default Profile;