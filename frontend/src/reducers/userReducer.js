
export const initialState=null;

export const reducer=(state, action)=>{
    if(action.type==="USER"){
        return action.payload;
    }
    else if(action.type==="CLEAR"){
        return null;
    }
    else if(action.type==="UPDATE_FOLLOW"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    else if(action.type==="UPDATE_PROFILE_PHOTO"){
        return {
            ...state,
            profilePhoto:action.payload.profilePhoto
        }
    }
    return state;
}



