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
                    {/* <li>
                        <input type="text" placeholder="Search" className="searchbox" />
                    </li> */}
                    {/* <li><Link to="/followingposts">Following Posts</Link></li> */}
                    <li title="Search"><Link to="/"><i className="material-icons navbar-icon">search</i></Link></li>
                    <li title="Home"><Link to="/"><i className="material-icons navbar-icon">home</i></Link></li>
                    <li title="Profile"><Link to="/profile"><i className="material-icons navbar-icon">person</i></Link></li>

                    <li title="Explore"><Link to="/followingposts"><i className="material-icons navbar-icon">explore</i></Link></li>
                    {/* <li><Link to="/create">Create Post</Link></li> */}
                    <li title="Post"><Link to="/create"><i className="material-icons navbar-icon">add_circle</i></Link></li>
                    {/* control_point, file_upload, navigation, publish, create,add_circle*/}
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