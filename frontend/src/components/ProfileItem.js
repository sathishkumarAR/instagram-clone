import React,{useContext} from "react";
import { UserContext } from "../App";
import OptionsModal from "./Modals/OptionsModal";
import {Link, useHistory} from "react-router-dom";




function ProfileItem(props){
    const history=useHistory();
    function follow(userId){
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
                dispatch({type:"UPDATE_FOLLOW",payload:{followers:result.followers,following:result.following}})
                localStorage.setItem("user",JSON.stringify(result));
            })
        )
    }

    function unfollow(userId){
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
                dispatch({type:"UPDATE_FOLLOW",payload:{followers:result.followers,following:result.following}})
                localStorage.setItem("user",JSON.stringify(result));
            })
        )
    }


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
    const {state, dispatch}= useContext(UserContext);

    return(
        <div className="profileItem">
            <div className="profileItem-left">
                <div>
                    <img className="post-postedBy-img" src={props.user.profilePhoto} alt="profilePic"/>
                </div>
                <div className="names-container">
                    <Link to={props.user._id!==state._id?"/profile/"+props.user._id:"/profile"}
                        onClick={()=>{
                            if(props.user._id===state._id){
                                history.push("/profile")
                            }
                            else{
                                window.location="/profile/"+props.user._id;
                            }
                        }}
                    >
                        <h6 className="profileItem-username">{props.user.username}</h6>
                    </Link>
                    <div className="profileItem-fullname">{props.user.fullname}</div>
                </div>
            </div>
            <div>
                {
                    
                    state && 
                        ((state._id===props.user._id)?
                            null
                            :
                            (state.following.includes(props.user._id)?
                            <OptionsModal 
                                needHeader="true"
                                header={(<div><img className="unfollowImage" 
                                src= {props.user.profilePhoto} alt="" /><p>{"Unfollow "+props.user.username+"?"}</p></div>)}
                                userId={props.user._id}
                                trigger={<button className="btn whiteButton">Unfollow</button>} 
                                unfollow={()=>{unfollow(props.user._id)}}
                                options={unfollowOptions}
                            />
                            :
                            <button className="btn blueButton mb-inherit followButton" 
                            onClick={
                                ()=>{follow(props.user._id)}
                                }
                                >Follow</button>
                            )
                        )
                }
            </div>
        </div>
    )
}

export default ProfileItem;
