import React, {useState,useContext} from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom";
import {UserContext} from "../../App";


function Login(){
    const [unameOrEmail,setUnameOrEmail]= useState();
    const [password,setPassword]= useState();

    const [validation, setValidation]=useState();

    const history= useHistory();

    const {state,dispatch} = useContext(UserContext);

    function PostData(){
        setValidation(undefined)
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            //When sending data to a web server, the data has to be a string. JSON.stringify() converts JSON object to string
            body:JSON.stringify({
                unameOrEmail:unameOrEmail,
                password:password
            })
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            if(data.error){
                setValidation(data.error);
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
        <div className="mt100px">

        
            <div className="card auth-card input-field">
                <h1>Instagram</h1>
                <input onChange={(event)=>{setUnameOrEmail(event.target.value)}} className="input-outlined textTransform-lowercase" type="text" value={unameOrEmail} placeholder="Email or username"></input>
                <input onChange={(event)=>{setPassword(event.target.value)}} className="input-outlined" type="password" value={password} placeholder="Password"></input>

                <button 
                    className="btn waves-effect waves-light blueButton blue" 
                    onClick={()=>{
                        PostData()
                    }}
                    disabled={(!unameOrEmail || !password)}
                >
                    Log in
                </button>
                {
                    validation && 
                        (
                            <div className="input-validation-red">
                                {validation}
                            </div>
                        )
                }

                <p className="blueLink dark"><Link to="/reset">Forgot password?</Link></p>
            </div>
            <div className="card auth-card">
                  <p>Don't have an account?</p>
                  <p className="blueLink dark"><Link to="/signup">Sign up</Link></p>
                  
            </div>
            </div>

        </div>
    );
}

export default Login;