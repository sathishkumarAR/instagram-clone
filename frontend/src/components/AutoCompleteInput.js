import React, { Component, useContext, useEffect, useRef } from "react";
import M, { Dropdown } from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";


function AutoCompleteInput(){
    const Autocomplete=useRef(null);
    const [search,setSearch]= useState("");
    const [matchingUsers, setMatchingUsers]=useState([]);
    const history=useHistory();
    const {state,dispatch}=useContext(UserContext);
    const [selectedUser,setSelectedUser]=useState("");
    
    

    const fetchUsers=(data)=>{
            setSearch(data)
            fetch("/search-users",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    query:data
                })
            })
            .then(res=>res.json())
            .then(users=>{
                setMatchingUsers(users);   
            })
            .catch(err=>{
                console.log(err);
            })
    }

    useEffect(()=>{
        var options = {
            //Data object for autocomplete
        data: matchingUsers,
      
            //Limit of results autocomplete shows
          limit: 5,
      
            //Callback function for Autocomplete
            onAutocomplete() {
            //   console.log("Completed");
              let input = document.getElementById("autocomplete-input");
            //   console.log(input.value);
            setSearch(input.value)
              setSelectedUser(input.value);
              
            },
      
            //Minimum number of characters before autocomplete starts.
            minLength: 1
          };
          M.Autocomplete.init(Autocomplete.current, options);
          var instance = M.Autocomplete.getInstance(Autocomplete.current);
          instance.isOpen?console.log("dropdown is already open") :instance.open();   
          
    },[matchingUsers])

    useEffect(()=>{
        if(selectedUser!==""){
            fetch("/getID",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    name:selectedUser
                })
            })
            .then(res=>res.json())
            .then(res=>{
                if(res._id===state._id){
                    history.push("/profile")
                }
                else{
                    window.location="/profile/"+res._id;
                }
                setSearch("")
            })
            .catch(err=>{
                console.log(err);
            })
        }
        
    },[selectedUser]);

    return (
        <div>
            <div className="input-field">
                <input
                    ref={Autocomplete}
                    type="text"
                    id="autocomplete-input"
                    placeholder="Search"
                    className="autocomplete search-input"
                    onChange={(e)=>{fetchUsers(e.target.value)}}
                    value={search}
                />
            </div>
        </div>
    );

}

export default AutoCompleteInput;
