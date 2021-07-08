import React,{useEffect,createContext,useContext,useReducer} from "react";
import Navbar from "./components/Navbar"
import './App.css';
import {BrowserRouter, Route, useHistory} from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import { reducer,initialState } from "./reducers/userReducer";
import ResetPassword from "./components/screens/ResetPassword";
import NewPassword from "./components/screens/NewPassword";
import FollowingPosts from "./components/screens/FollowingPosts";


export const UserContext=createContext();

//the reason why we created this separate component is.. 
//then only we can use useHistory, 
//since App() is not inside BrowserRouter, we cannot use useHistory inside App() function
function Routing(){
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user});
  }
    else{
      if(!(history.location.pathname.startsWith("/reset"))){
          history.push("/login");
      }
    }
  },[])

  return (
    <switch>
      <Route exact path="/"><Home /></Route>
      <Route path="/login"><Login /></Route>
      <Route path="/followingposts"><FollowingPosts /></Route>
      <Route exact path="/profile"><Profile /></Route>
      <Route path="/signup"><Signup /></Route>
      <Route path="/create"><CreatePost /></Route>
      <Route path="/profile/:userId"><UserProfile /></Route>
      <Route exact path="/reset">
        <ResetPassword/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </switch>
  )
}

function App() {
  const [state,dispatch]=useReducer(reducer,initialState);

  return (
    //all the components inside <UserContext.Provider></UserContext.Provider> can access state and dispatch now
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
    
    
  );
}

export default App;
