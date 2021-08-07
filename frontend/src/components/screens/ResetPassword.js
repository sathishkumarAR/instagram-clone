import React, {useState,useContext} from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom";
import {UserContext} from "../../App";


function ResetPassword(){
    
    const [unameOrEmail,setUnameOrEmail]= useState();
    const [validation, setValidation]=useState(undefined);
    const history= useHistory();
    
    function PostData(){
        // if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        //     return M.toast({html: "Invalid email", classes:"#ef5350 red lighten-1"})
        // }
        setValidation(undefined)
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                unameOrEmail:unameOrEmail,
            })
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            if(data.error){
                setValidation(data.error);
                // M.toast({html: data.error, classes:"#ef5350 red lighten-1"})
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
                <h6 style={{"fontWeight":"600"}}>
                    Trouble Logging in?
                </h6>
                <br></br>
                <div className="text-center">
                Enter your username or email. We'll send you a link to get back into your account
                </div>
                <input onChange={(event)=>{setUnameOrEmail(event.target.value)}} className="input-outlined" type="text" value={unameOrEmail} placeholder="Email or username"></input>

                <button onClick={()=>{
                    PostData()
                }} className="btn waves-effect waves-light blueButton blue" >
                    Reset password
                </button>

                {
                    validation && 
                        (
                            <div className="input-validation-red">
                                    {validation}
                                </div>
                        )
                }
            </div>
            <div className="card auth-card">
                  <p>Don't have an account?</p>
                  <Link to="/signup">Sign up</Link>
            </div>

        </div>
    );
}

export default ResetPassword;