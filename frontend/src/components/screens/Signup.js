import React from "react";
import {Link} from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom"



function Signup(){
    const [username,setUsername]= React.useState();
    const [email,setEmail]= React.useState();
    const [password,setPassword]= React.useState();
    const [confirmPass,setConfirmPass]= React.useState();

    const history= useHistory();

    function PostData(){
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid email", classes:"#ef5350 red lighten-1"})
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                name:username,
                email:email,
                password:password,
                confirmPass:confirmPass
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
        <div className="mycard">
            <div className="card auth-card input-field">
                <h1>Instagram</h1>
                <input 
                    onChange={(event)=>{
                        setUsername(event.target.value)
                    }} 
                    className="input-outlined" 
                    value={username} 
                    type="text" 
                    placeholder="   Username">
                </input>

                <input onChange={(event)=>{setEmail(event.target.value)}} className="input-outlined" value={email} type="text" placeholder="   Email"></input>
                
                <input onChange={(event)=>{
                    setPassword(event.target.value)
                }} className="input-outlined" type="password" value={password} placeholder="    Password"></input>
                
                <input onChange={(event)=>{
                    setConfirmPass(event.target.value)
                }} className="input-outlined" type="password" value={confirmPass} placeholder="    Confirm Password"></input>
                
                <button onClick={PostData} className="btn waves-effect waves-light blueButton blue" >
                    Sign up
                </button>
            </div>
            <div className="card auth-card">
                  <p>Already have an account?</p>
                  <Link to="/login">Log in</Link>
            </div>

        </div>
    );
}

export default Signup;