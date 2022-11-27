//In this file the SQL backend are connected to the frontend


import React, { useState } from "react";
import Box from "./components/Box";
import Nav from "./components/Nav";
import InputForm from "./components/InputForm";
import Modal from "./components/Modal";
import "./Home.css"
import { Link } from "react-router-dom";
import axios from "axios";


export default function Home() {
    const rooturl = "/";
    const [datarry, setdatarry] = React.useState(null)
    const [inputobj, setval] = React.useState({
        id: "",
        isfile: true,
        name: ""
    })
    const [url, setUrl] = React.useState(rooturl);
    // const [loc, setLoc] = React.useState("");
    const [openModal, setOpenModal] = useState(false)


    //API FETCH CALL: ls
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

    React.useEffect(() => {
        const updatePath = async () => {
            const res = await axios.get(`http://localhost:8000/api/commands/?absolute_path=${url}&command=ls`);
            console.log(res.data)
            setdatarry(res.data);
        };
        updatePath();
    }, [url]);

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

    //when submit the new object, the array display update and display on the screen mkdir
    function handleSubmit(event) {
        event.preventDefault();
        setdatarry(prevarray =>
            [...prevarray, inputobj]
        )
        console.log(datarry)
        //TODO connect API Add
    }

    //when delete the object, the object remove from datarry list
    const handleRemoveClick = async (i) => {
        console.log("remove", i);
        const list = [...datarry];
        list.splice(i, 1);
        setdatarry(list);
        await axios.delete("http://127.0.0.1:8000/api/commands/", { data: { absolute_path: url, command: "deleteOnePath" } }, { mode: 'cors' });
        console.log(list);
        //TODO connect API Remove

    };

    //click on the box and go into the subdirectory ls
    const handleClick = (i) => {
        const curdata = []
        console.log(url)
        let newUrl = ""
        if (url === '/') {
            newUrl = "/" + datarry[i].name
        } else {
            newUrl = url + "/" + datarry[i].name
        }
        setUrl(newUrl);
        //this is to realize ls
        fetch(`localhost:8000/api/commands/?command=ls&absolute_path=${newUrl}`, { mode: 'cors' })
            .then(res => res.json)
            .then(data => {
                for (let child in data) {
                    curdata.push({
                        id: child.inode,
                        isFile: child.pathType === "FILE" ? true : false,
                        name: child.name
                    })
                }
                setdatarry(curdata)
            })
        setUrl(newUrl)
    }

    //go to the previous directory
    const handleGoback = async () => {
        try {
            console.log(url);
            let predata = []
            let prevUrl = url.substring(0, url.lastIndexOf("/"))
            setUrl(prevUrl);
            fetch(`localhost:8000/api/commands/?absolute_path=${prevUrl}&command=ls`, { mode: 'cors' })
                .then(res => res.json)
                .then(data => {
                    for (let child in data) {
                        predata.push({
                            id: child.inode,
                            isFile: child.pathType === "FILE" ? true : false,
                            name: child.name
                        })
                    }
                    setdatarry(predata)
                })
            setUrl(prevUrl)
        }
        catch (e) {
            console.error(e)
        }
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
                currentdirectory={url}
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
