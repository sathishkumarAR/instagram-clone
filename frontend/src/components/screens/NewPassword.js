import React, {useState,useEffect} from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import {useHistory,useParams} from "react-router-dom";
import LinkExpired from "./LinkExpired"





function NewPassword(){
    const [password,setPassword]= useState();
    const [confirmPassword,setConfirmPassword]= useState();
    const [linkexpired,setLinkexpired]=useState(undefined);
    const history= useHistory();
    const {token}= useParams();
    // console.log(token)

    useEffect(()=>{
        fetch("/checklink",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                token
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result.error)
            if(result.error){
                console.log(result.error);
                return setLinkexpired(true);
            }
            setLinkexpired(false);
                
        })
    },[])




    function PostData(){
        if(password!==confirmPassword){
            return M.toast({html: "Passwords must match", classes:"#ef5350 red lighten-1"})
        }
        fetch("/changePassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                password,
                token
            })
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#ef5350 red lighten-1"})
            }
            else{
                
                M.toast({html:data.message, classes:"#4caf50 green"})
                history.push("/login");
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }


    return (
        <>
        {(linkexpired===undefined)?"loading...":
        linkexpired?<LinkExpired />:
        <div className="mycard">
            <div className="card auth-card input-field">
                <h1>Instagram</h1>
                <h6 style={{"fontWeight":"600"}}>
                    Create New Password
                </h6>
                <br></br>
            
                <input onChange={(event)=>{setPassword(event.target.value)}} className="input-outlined" type="password" value={password} placeholder="    New password"></input>
                <input onChange={(event)=>{setConfirmPassword(event.target.value)}} className="input-outlined" type="password" value={confirmPassword} placeholder="    Confirm new password"></input>

                <button onClick={()=>{
                    PostData()
                }} className="btn waves-effect waves-light blueButton blue" >
                    Change password
                </button>
            </div>
        </div>
        }

        </>
        
    );
}

export default NewPassword;