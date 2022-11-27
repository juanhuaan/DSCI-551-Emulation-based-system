import React from "react"
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Nav(props) {
    return (
        <Navbar bg="light" className="navbar">
            <button className="gobackbutton" onClick={props.goback}></button>
            <Container>
                <Navbar.Brand className="navtext">Emulated File System {props.database}</Navbar.Brand>
                <p className="directory">Current Directory: {props.currentdirectory}</p>
            </Container>
        </Navbar>
    )
}

