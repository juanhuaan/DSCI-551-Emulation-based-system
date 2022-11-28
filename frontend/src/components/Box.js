import React from "react"
import file from "../images/file1.png"
import folder from "../images/folder.png"
import Button from 'react-bootstrap/Button';


export default function Box(props) {
    // const styles = {
    //     background: props.isfile === true ? "url('./images/file.png') no-repeat top left" : "url('./images/folder.png') no-repeat top left"
    // }
    return (

        <div className="box" onDoubleClick={props.isfile === true ? props.openmodal : props.next}>
            <div>
                <img src={props.isfile === true ? file : folder} />
                <p className="name">{props.name}</p>
            </div>
            <Button className="deletebutton" variant="danger" onClick={props.remove}>Delete</Button>{' '}
        </div>

    )
}