import React,{useState} from "react";
import {Link} from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom"



function Signup(){
    const [username,setUsername]= useState();
    const [usernameAvailability, setUsernameAvailability]=useState();

    const [fullname, setFullname]= useState();
    const [email,setEmail]= useState();
    const [validation, setValidation]=useState();
    const [password,setPassword]= useState();
    const [confirmPass,setConfirmPass]= useState();

    const history= useHistory();

    function PostData(){
        checkUsername();

        if(!username || !email || !password || !fullname){
            return setValidation("Please enter all the fields");
        }

        else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return setValidation("Enter a valid email address")
        }
        else if(password!==confirmPass){
            return setValidation("Passwords do not match")
        }
        else{
            setValidation(undefined)
        }
        
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                username:username,
                email:email,
                fullname:fullname,
                password:password,
                confirmPass:confirmPass
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
                M.toast({html:data.message, classes:"#4caf50 green"})
                history.push("/login");
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const checkUsername=()=>{
        if(username){
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
        if(username===""){
            setUsernameAvailability(undefined);
            hideCheckIcon("hidden")
            
        }
        
    }

    function hideCheckIcon(prop){
        document.getElementById("check-icon").style.visibility=prop;
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h1>Instagram</h1>
                <div>
                <div className="input-container">
                    <input 
                        onChange={(event)=>{
                            setUsername((event.target.value).toLowerCase())
                        }} 
                        onBlur={()=>{
                            checkUsername()
                        }}
                        className="input-outlined textTransform-lowercase input-contain-icon" 
                        value={username} 
                        id="username"
                        type="text" 
                        placeholder="Username">
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

                </div>

                <input onChange={(event)=>{setEmail((event.target.value).toLowerCase())}} className="input-outlined textTransform-lowercase" value={email} type="email" placeholder="Email"></input>
                <input onChange={(event)=>{setFullname(event.target.value)}} className="input-outlined" value={fullname} type="text" placeholder="Fullname"></input>
                
                
                <input onChange={(event)=>{
                    setPassword(event.target.value)
                }} className="input-outlined" type="password" value={password} placeholder="Password"></input>
                
                <input onChange={(event)=>{
                    setConfirmPass(event.target.value)
                }} className="input-outlined" type="password" value={confirmPass} placeholder="Confirm Password"></input>
                
                <button 
                    onClick={PostData} 
                    disabled={(!username || !email || !password || !fullname || !confirmPass || !usernameAvailability)} 
                    className="btn waves-effect waves-light blueButton blue" >
                    Sign up
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
                  <p>Already have an account?</p>
                  <p className="blueLink dark"><Link to="/login" >Log in</Link></p>
                  
            </div>

        </div>
    );
}

export default Signup;