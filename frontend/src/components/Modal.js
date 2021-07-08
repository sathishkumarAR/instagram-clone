
import React,{useContext} from "react";
import { UserContext } from "../App";
import M from "materialize-css";
import {Modal, Button, Icon} from 'react-materialize';


function CustomModal(props){
    const {state, dispatch}= useContext(UserContext);

    return(
            <Modal className={props.needHeader}
                
                header={props.header}
                trigger={props.text}>
                {
                    props.options.map(button=>{
                        return(
                            (button.strict)?(props.userId===state._id &&  <button className={button.className} onClick={()=>{
                            (button.name==="Delete") ? props.delete():button.action()
                            }}>{button.name}</button>):<button className={button.className} onClick={()=>{
                                //add chains for new functions
                             (button.name==="Delete") ? props.delete():
                             (button.name==="Unfollow") ? props.unfollow():
                             button.action()
                            }}>{button.name}</button>
                        )
                    })
                }


                {/* <div>
                <button className="modal-button redButton">Report</button>
                {props.elem===state._id &&  <button className="modal-button modal-close redButton" onClick={()=>{
                props.delete()
                }}>Delete</button> }

                <button className="modal-button modal-close" onClick={()=>{""}}>Cancel</button>
                </div> */}



            </Modal>
    )
}

export default CustomModal;