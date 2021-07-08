import React, { useContext } from "react";
import {Link, useHistory} from "react-router-dom";
import { UserContext } from "../App";


function Navbar(){
    const history= useHistory();

    const {state,dispatch}=useContext(UserContext);
    if(state){
        return (
            <nav>
                <div className="nav-wrapper white">
                <Link to="/" className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    <li><Link to="/followingposts">Following Posts</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/create">Create Post</Link></li>
                    <button className="btn waves-effect waves-light blueButton blue" 
                    onClick={()=>{
                        localStorage.clear();
                        dispatch({type:"CLEAR"});
                        history.push("/login");
                    }}>
                        Log out
                    </button>
                </ul>
                </div>
            </nav>
        )
    }
    return null
    
    
}

export default Navbar;