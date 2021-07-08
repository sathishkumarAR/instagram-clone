import React,{useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom";
import {UserContext} from "../../App";



function CreatePost(){
    const [caption,setCaption]=useState();
    const [photo,setPhoto]=useState();
    const [photoURL,setPhotoURL]=useState();
    const [userName, setUserName]=useState();
    const history= useHistory();
    const {state,dispatch}= useContext(UserContext);

    useEffect(()=>{
        console.log("inside CreatePost UseEffect")
        if(photoURL){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    caption:caption,
                    photo:photoURL
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"#ef5350 red lighten-1"})
                }
                else{
                    
                    M.toast({html:"Posted Successfully",classes:"#4caf50 green"});
                    // console.log(data);
                    history.push("/");
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },[photoURL]);

    function postData(){
        const imageData= new FormData();
        imageData.append("file",photo);
        imageData.append("upload_preset","insta-clone");
        imageData.append("cloud_name","wings05");

        fetch("https://api.cloudinary.com/v1_1/wings05/image/upload",{
            method:"post",
            body:imageData
        })
        .then(res=>res.json())
        .then(data=>{
            setPhotoURL(data.secure_url);
        })
        .catch(err=>{
            console.log(err);
        })

        
    }

    


    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h5 style={{textAlign:"left"}}><Link to="/profile" >{state?state.name:"loading..."}</Link></h5>
                <textarea rows="3" cols="50" onChange={(event)=>{
                    setCaption(event.target.value)
                }} placeholder="Write something ..." value={caption}></textarea>

                <div class="file-field input-field">
                    <div class="btn blueButton blue">
                        <span>Upload</span>
                        <input type="file" onChange={(event)=>{
                            setPhoto(event.target.files[0]);
                        }} />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text"/>
                    </div>
                </div>

                <button onClick={postData} className="btn waves-effect waves-light blueButton blue" >
                    Post
                </button>
            </div>

        </div>
        
    );
}

export default CreatePost;