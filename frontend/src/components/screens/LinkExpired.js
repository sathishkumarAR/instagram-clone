import React,{useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import {useHistory} from "react-router-dom";
import {UserContext} from "../../App";



function LinkExpired(){
    const history= useHistory();
    const {state,dispatch}= useContext(UserContext);

    return(
        <div className="mycard home-card mt100px">
            <div className="card auth-card input-field">
                <i className="material-icons large warning-icon" >mood_bad</i>
               <h3 className="heading-text">Link Expired</h3>
               <hr></hr>
               <p >The password reset link is invalid, possibly because it has already been used or expired. Please request a new <Link  className="blueLink light px16" to="/reset">password reset</Link>.</p>
            </div>

        </div>
        
    );
}

export default LinkExpired;