import React from "react"

export default function Box(props) {
    // const styles = {
    //     background: props.isfile === true ? "url('./images/file.png') no-repeat top left" : "url('./images/folder.png') no-repeat top left"
    // }

    return (
        <div>
            <div className="box">
                <div onClick={props.next}>
                    <p className="name">{props.name}</p>
                </div>
            </div>
            <button onClick={props.remove}>delete</button>
        </div>
    )
}