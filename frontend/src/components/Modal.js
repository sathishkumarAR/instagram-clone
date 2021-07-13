
import React,{useContext} from "react";
import { UserContext } from "../App";
import M from "materialize-css";
import {Modal, Button, Icon} from 'react-materialize';


function CustomModal(props){
    const {state, dispatch}= useContext(UserContext);

    return(
            <Modal className={props.needHeader}
                
                header={props.header}
                trigger={props.trigger}>
                {
                    props.options.map((button,index)=>{
                        return(
                            (button.strict)?
                                (props.userId===state._id &&  <button key={index} className={button.className} onClick={()=>{
                                    (button.name==="Delete") ? 
                                    props.delete():button.action()
                                    }}>{button.name}</button>)
                                :
                                <button key={index} className={button.className} onClick={(e)=>{
                                    //add chains for new functions
                                    (button.name==="Delete") ? props.delete():
                                    (button.name==="Unfollow") ? props.unfollow():
                                    (button.name==="Upload Photo")?props.upload(e):
                                    (button.name==="Remove Current Photo")?props.remove():
                                    
                                    button.action()
                                    }}>{button.name}
                                </button>
                        )
                    })
                }
            </Modal>
    )
}

export default CustomModal;