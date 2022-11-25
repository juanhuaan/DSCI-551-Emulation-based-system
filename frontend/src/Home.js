import React, { useState } from "react";
import Box from "./components/Box";
import Nav from "./components/Nav";
import InputForm from "./components/InputForm";
import Modal from "./components/Modal";
import "./Home.css"
import { Link } from "react-router-dom";
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8000/api"



export default function Home() {
    const rooturl = "https://edfs-b732d-default-rtdb.firebaseio.com/root";
    const [datarry, setdatarry] = React.useState(null)
    const [inputobj, setval] = React.useState({
        id: 0,
        isfile: true,
        name: ""
    })
    const [url, setUrl] = React.useState(rooturl);
    const [loc, setLoc] = React.useState("root");
    const [openModal, setOpenModal] = useState(false)

    let para = {
        "absolute_path": "/user/s",
        "type": "DIRECTORY",
        "command": "mkdir_or_put"
    };

    const makeAPICall = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/commands/?absolute_path=/&command=checkAllPath", { mode: 'cors' });
            const data = await response.json();
            console.log({ data })

        }
        catch (e) {
            console.error(e)
        }
    }
    // const invocation = new XMLHttpRequest();
    // const url1 = "http://127.0.0.1:8000/api/commands/?absolute_path=/&command=checkAllPath"
    // const handler = async (data) => {
    //     try {
    //         const res = await axios.get(`/commands/?absolute_path=/&command=checkAllPath`)
    //         data = res.data
    //         console.log(data)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }
    // function callOther() {
    //     if (invocation) {
    //         invocation.open("GET", url, true);
    //         invocation.withCredentials = true;
    //         invocation.onreadystatechange = handler;
    //         invocation.send();
    //     }
    // }
    // callOther()

    // fetchPaths();

    // fetch('http://127.0.0.1:8000/api/commands/?absolute_path=/&command=checkAllPath', {
    //     method: 'GET',
    //     headers: {
    //         'Access-Control-Allow-Origin': 'cors'
    //     },

    // })
    //     .then(response => response.json())
    //     .then(response => console.log(JSON.stringify(response)))

    React.useEffect(() => {
        const firebasedata = []
        console.log("effect run");
        //API call
        makeAPICall();
    }, [])

    if (datarry === null) {
        return <>Loading</>
    }

    //when people edit the input field, change the object information
    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setval(prevobj => {
            return {
                ...prevobj,
                id: datarry.length,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    //when submit the new object, the array display update and display on the screen
    function handleSubmit(event) {
        event.preventDefault();
        setdatarry(prevarray =>
            [...prevarray, inputobj]
        )
        console.log(datarry)
        //TODO connect API Add
    }

    //when delete the object, the object remove from datarry list
    const handleRemoveClick = (i) => {
        console.log("remove", i);
        const list = [...datarry];
        list.splice(i, 1);
        setdatarry(list);
        console.log(list);
        //TODO connect API Remove

    };

    //click on the box and go into the subdirectory
    const handleClick = (i) => {
        const firebasedata = []
        console.log(url)
        let newUrl = url + "/" + datarry[i].name
        setUrl(newUrl);
        //this is to realize ls
        fetch(newUrl + ".json")
            .then(res => res.json())
            .then(data => {
                for (let child in data) {
                    console.log(child)
                    firebasedata.push({
                        id: firebasedata.length,
                        isfile: false,
                        name: child
                    })
                }
                console.log(firebasedata)
                setdatarry(firebasedata)
            })
        setLoc(newUrl.substring(newUrl.lastIndexOf("/")))
    }

    //go to the previous directory
    const handleGoback = () => {
        console.log(url);
        let firebasedata = []
        let prevUrl = url.substring(0, url.lastIndexOf("/"))
        setUrl(prevUrl);
        fetch(prevUrl + ".json")
            .then(res => res.json())
            .then(data => {
                for (let child in data) {
                    firebasedata.push({
                        id: firebasedata.length,
                        isfile: false,
                        name: child
                    })
                }
                setdatarry(firebasedata)
            })
        setLoc(prevUrl.substring(prevUrl.lastIndexOf("/")))
    }

    //list of boxes 
    const arrayelements = datarry.map(item => {
        return (
            <Box
                key={item.id}
                name={item.name}
                isfile={item.isfile}
                remove={() => handleRemoveClick(item.id)}
                next={() => handleClick(item.id)}
                openmodal={() => setOpenModal(true)}
            />
        )
    })


    //html display
    return (

        <div className="App">

            <Nav
                currentdirectory={loc}
                goback={() => handleGoback()}
            />


            <div className="row">
                <div className="left">

                    {arrayelements}

                    <InputForm
                        submit={(e) => handleSubmit(e)}
                        change={(e) => handleChange(e)}
                        val={datarry.name}
                        checked={datarry.isfile}
                    />
                </div>
                <div className="right">
                    <Link to="/analyze" className="button">Go analyzation</Link>
                </div>
            </div>
            {openModal && <Modal closeModal={setOpenModal} />}

        </div>


    )
}
