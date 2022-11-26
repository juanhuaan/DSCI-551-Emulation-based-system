import React from 'react'
import "./Modal.css";

function Modal(props) {

    return (
        <div className='modalBackground'>
            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                    <button onClick={() => props.closeModal(false)}>X</button>
                </div>
                <div className='title'>
                    <h1>Location of the file:</h1>
                </div>
                <div className='body'>
                    <p> {props.data} {props.content}</p>
                </div>
                <div id="cancelBtn" className='footer'>
                    <button onClick={() => props.closeModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default Modal