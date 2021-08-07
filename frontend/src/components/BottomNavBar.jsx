import React, { useContext } from "react";
import {Link, useHistory} from "react-router-dom";

function BottomNavBar(){
    return (
        <footer class="page-footer">
            <div class="row" id="frow" style={{marginBottom:"0px"}}>
    <div class="col s12" style={{paddingLeft:"0px !important",paddingRight:"0px!important"}}>
      <ul class="tabs tabs-fixed-width transparent white-text">
        {/* <li title="Home"><Link to="/"><i className="material-icons navbar-icon">home</i></Link></li> */}
        <li class="tab col s3 white-text"><a href="#test1" class="active"><i class="material-icons navbar-icon">home</i></a></li>
        <li class="tab col s3"><a href="#test2" class=""><i class="material-icons navbar-icon">search</i></a></li>
        <li class="tab col s3"><a href="#test2" class=""><i class="material-icons navbar-icon">publish</i></a></li>
        <li class="tab col s3"><a href="#test3" class=""><i class="material-icons navbar-icon">explore</i></a></li>
        <li class="tab col s3"><a href="#test4" class=""><i class="material-icons navbar-icon">account_circle</i></a></li>
      </ul>
    </div>
            </div>

        </footer>

    )
}

export default BottomNavBar;