import React, {useState,useContext} from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom";
import {UserContext} from "../../App";


function Login(){
    const [email,setEmail]= useState();
    const [password,setPassword]= useState();

    const history= useHistory();

    const {state,dispatch} = useContext(UserContext);

    function PostData(){
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid email", classes:"#ef5350 red lighten-1"})
        }
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                email:email,
                password:password
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
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));//localStorage will contain only String values
                
                dispatch({type:"USER",payload:data.user});

                M.toast({html:"Signed in successfully", classes:"#4caf50 green"})
                history.push("/");
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
                <input onChange={(event)=>{setEmail(event.target.value)}} className="input-outlined" type="text" value={email} placeholder="    Email or username"></input>
                <input onChange={(event)=>{setPassword(event.target.value)}} className="input-outlined" type="password" value={password} placeholder="  Password"></input>

                <button className="btn waves-effect waves-light blueButton blue" onClick={()=>{
                    PostData()
                }}>
                    Log in
                </button>
                <p className="blueLink dark"><Link to="/reset">Forgot password?</Link></p>
            </div>
            <div className="card auth-card">
                  <p>Don't have an account?</p>
                  <p className="blueLink dark"><Link to="/signup">Sign up</Link></p>
                  
            </div>

        </div>
    );
}

export default Login;