import React from 'react'
import "./Modal.css";

function Modal({ closeModal }) {
    return (
        <div className='modalBackground'>
            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                    <button onClick={() => closeModal(false)}>X</button>
                </div>
                <div className='title'>
                    <h1>Content of this file</h1>
                </div>
                <div className='body'>
                    <p>the actual paragrah here</p>
                </div>
                <div id="cancelBtn" className='footer'>
                    <button onClick={() => closeModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default Modal