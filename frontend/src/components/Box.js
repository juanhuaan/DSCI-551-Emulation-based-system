import React from "react"
import File from "../images/file.png"

export default function Box(props) {
    // const styles = {
    //     background: props.isfile === true ? "url('./images/file.png') no-repeat top left" : "url('./images/folder.png') no-repeat top left"
    // }

    return (
        <div className="boxbox">
            <div className="box" onClick={props.next}>
                <div>
                    <img src={File} />
                    <p className="name">{props.name}</p>
                </div>
            </div>
            <button onClick={props.remove}>delete</button>
        </div>
    )
}