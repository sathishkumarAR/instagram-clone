import React, {useContext, useEffect, useState} from "react";
import M from "materialize-css";
import { UserContext } from "../../App";
import { useHistory } from "react-router";
import OptionsModal from "../Modals/OptionsModal";

function EditProfile(){
    const {state,dispatch}= useContext(UserContext);
    const history = useHistory();
    const [fullname, setFullname]= useState(state?.fullname);
    const [username, setUsername]= useState(state?state.username:"");
    const [email, setEmail]=useState(state?state.email:"");
    const [website, setWebsite] = useState(state?state.website:"");
    const [bio, setBio]= useState(state?state.bio:"");
    const [gender, setGender]=useState(state?state.gender:"");
    const [photo,setPhoto]=useState();
    const [photoURL,setPhotoURL]=useState();

    const [usernameAvailability, setUsernameAvailability]=useState();
    const [validation, setValidation]=useState();

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
        setFullname(state?.fullname);
        setUsername(state?.username);
        setEmail(state?.email);
        setWebsite(state?.website);
        setBio(state?.bio);
        setGender(state?.gender);

    },[state]);

    function PostData(){
        checkUsername();

        if(!username || !email || !fullname){
            return setValidation("Please enter all the required fields");
        }

        else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return setValidation("Enter a valid email address")
        }
        else{
            setValidation(undefined)
        }
        fetch("/edit-profile",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                username:username,
                email:email,
                fullname:fullname,
                website:website,
                bio:bio,
                gender:gender
            })
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            
            if(data.error){
                setValidation(data.error)
            }
            else{
                localStorage.setItem("user",JSON.stringify(data));
                dispatch({type:"USER",payload:data});
                // console.log(data);
                M.toast({html:"Updated Successfully", classes:"#4caf50 green"});
                history.push("/profile");
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }


    const checkUsername=()=>{
        if(username==="" || username===state.username){
            setUsernameAvailability(undefined);
            hideCheckIcon("hidden")
            
        }
        else if(username){
            if(!/^[a-z0-9_.]+$/i.test(username)){
                setUsernameAvailability("invalid")
            }
            else{
                fetch(`/checkUsername?username=${username}`)
                .then(res=>res.json())
                .then(res=>{
                    res.availability?
                    setUsernameAvailability("yes")
                    :
                    setUsernameAvailability("no")
                })
            }
        }
        
        
    }

    function hideCheckIcon(prop){
        document.getElementById("check-icon").style.visibility=prop;
    }

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
                dispatch({type:"UPDATE_PROFILE_PHOTO",payload:{profilePhoto:photoURL}})
                localStorage.setItem("user",JSON.stringify({...state,profilePhoto:photoURL}));
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },[photoURL]);

    useEffect(()=>{
        if(photo){
            postPhoto()
        }
    },[photo])

    function postPhoto(){
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


    function handleChange(id, value){
        
        if(id==="fullname"){
            setFullname(value);
        }
        else if(id==="website"){
            setWebsite(value);
        }
        else if(id==="bio"){
            setBio(value);
        }
        else if(id==="username"){
            setUsername(value);
        }
        else if (id==="email"){
            setEmail(value);
        }
        else if(id==="gender"){
            setGender(value);
        }
    }

    return (
        <>
        {
            state &&
            (
                <div className="editProfile-container">
                    <div>
                        <div className="editProfile-topField">
                            <img className="post-postedBy-img" src={state.profilePhoto} alt="profile_img"></img>
                            <div className="editProfile-field">
                                <h1>{state.username}</h1>

                                <OptionsModal 
                                    needHeader="true"
                                    header={<h6 className="changeProfilePhoto-header">Change Profile Photo</h6>}
                                    userId={state._id}
                                    trigger={
                                        <p className="blueLink light pointer">Change Profile Photo</p>
                                    }
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
                            </div>
                        </div>
                        <div className="editProfile-field">
                            <label for="fullname">Name</label>
                            <input 
                                className="input-outlined" 
                                type="text" 
                                placeholder="Name" 
                                value={fullname} 
                                onChange={(e)=>{
                                    handleChange(e.target.id, e.target.value);
                                }} 
                                id="fullname"></input>
                            <p className="editProfile-info">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                        </div>
                        <div className="editProfile-field">
                            <label for="username">Username</label>
                            <div className="input-container">
                                <input 
                                    className="input-outlined textTransform-lowercase input-contain-icon" 
                                    type="text" placeholder="Username" 
                                    value={username} 
                                    id="username"
                                    onChange={(e)=>{
                                        handleChange(e.target.id, e.target.value.toLowerCase());
                                    }}
                                    onBlur={()=>{
                                        checkUsername()
                                    }} 
                                    >
                                </input>
                                <i  title="Username is available" 
                                    id="check-icon"
                                    className="material-icons icon-inside-input">
                                    check_circle
                                </i>
                            </div>
                            
                            {(usernameAvailability!==undefined)? 
                                ( 
                                    (usernameAvailability==="invalid")?
                                        <div>
                                            <div className="input-validation-red">Username can only contain alphanumeric, underscore and period</div>
                                            {hideCheckIcon("hidden")}
                                        </div>
                                    :
                                    (usernameAvailability==="no") ?
                                        (
                                            <div>
                                            <div className="input-validation-red">That username is taken. Try another</div>
                                            {hideCheckIcon("hidden")}
                                            </div>
                                            
                                        )
                                    :
                                    (usernameAvailability==="yes") ?
                                        hideCheckIcon("visible")
                                    :
                                    null
                                )
                                :
                                null
                            }

                            <p className="editProfile-info">Help people easily search for your account by choosing a unique username</p>
                        </div>
                        <div className="editProfile-field">
                            <label for="website">Website</label>
                            <input 
                                className="input-outlined" 
                                type="text" placeholder="Website" 
                                value={website}
                                onChange={(e)=>{
                                    handleChange(e.target.id, e.target.value);
                                }}
                                id="website">
                            </input>
                        </div>
                        <div className="editProfile-field">
                            <label for="bio">Bio</label>
                            <textarea 
                                className="input-outlined" 
                                type="text" 
                                value={bio}
                                onChange={(e)=>{
                                    handleChange(e.target.id, e.target.value);
                                }} 
                                id="bio">
                            </textarea>
                        </div>
                        <div className="editProfile-field">
                            <p className="editProfile-info fs14px fw600 mt20px">Personal Information</p>
                            <p className="editProfile-info">Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile</p>
                        </div>

                        <div className="editProfile-field">
                            <label for="email">Email</label>
                            <input 
                                className="input-outlined" 
                                type="text" 
                                value={email} 
                                onChange={(e)=>{
                                    handleChange(e.target.id, e.target.value);
                                }}
                                id="email">
                            </input>
                            {
                                validation && 
                                    (
                                        <div className="input-validation-red">
                                            {validation}
                                        </div>
                                    )
                            }
                        </div>

                        <div className="editProfile-field">
                            <label for="gender">Gender</label>
                            <select className="input-outlined" value={gender} onChange={(e)=>{
                                    handleChange(e.target.id, e.target.value);
                                }} id="gender">
                                <option value="" disabled hidden>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>

                            </select>
                        </div>
                        <button className="btn blueButton editProfile-submit" onClick={PostData}>Submit</button>
                    </div>
                </div>
            )

        }
        </>
        
        
    );
}

export default EditProfile;