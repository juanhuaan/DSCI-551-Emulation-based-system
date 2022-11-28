//In this file the SQL backend are connected to the frontend

import React, { useState } from "react";
import Box from "./components/Box";
import Nav from "./components/Nav";
import InputForm from "./components/InputForm";
import Modal from "./components/Modal";
import "./Home.css"
import { Link } from "react-router-dom";
import axios from "axios";
import { async } from "@firebase/util";
import Menu from "./components/Menu"

export default function Home() {
    const baseURL = "http://127.0.0.1:8000/api"
    const [datarry, setdatarry] = React.useState([])
    const [inputobj, setval] = React.useState({
        id: 0,
        isfile: true,
        name: "",
        part: "",
        method: "even"
    })
    const [dir, setDir] = React.useState('/');
    const [loc, setLoc] = React.useState("/");
    const [openModal, setOpenModal] = useState(false);
    const [filedata, setFileData] = useState("");
    const [filecontent, setFileContent] = useState("");

    /* functions of CRUD of MYSQL */

    //API: ls
    const readData = async (dirc) => {
        // console.log("in read data function!")
        let curdata = []
        setLoc(dirc.substring(dirc.lastIndexOf("/")))
        const res = await fetch(baseURL + `/commands/?command=ls&absolute_path=${dirc}`, { mode: 'cors' })
        const data = await res.json();
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i])
            curdata.push({
                id: curdata.length,
                isfile: data[i].pathType === "FILE" ? true : false,
                name: data[i].name
            })
        }
        // console.log(data[0].inode)
        // console.log(curdata)
        setdatarry(curdata)
        // console.log(datarry)
    }


    //API: cat
    const displayData = async (file) => {
        console.log("in display data function!")
        let newUrl = ""
        if (dir === '/') {
            newUrl = "/" + file
        } else {
            newUrl = dir + "/" + file
        }
        const res = await fetch(baseURL + `/commands/?command=cat&absolute_path=${newUrl}`, { mode: 'cors' })
        const pre = await res.json();
        const data = JSON.parse(pre);
        console.log(data)
        setFileContent(data.slice(0, 5))
    }

    /* end of API call */

    //run once when start the app
    React.useEffect(() => {
        // console.log("effect run");
        readData(dir)
    }, [dir, inputobj])


    if (datarry === null) {
        return <>Loading</>
    }

    //when people edit the input field, change the object information
    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        console.log("inside handle change")
        setval(prevobj => {
            return {
                ...prevobj,
                id: datarry.length,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    //when submit the new object, the array display update and display on the screen
    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            console.log("insdie handle submit")
            // toggleSubmit(!submit)
            console.log(inputobj)
            //TODO connect API Add
            let newUrl = ""
            if (dir === '/') {
                newUrl = "/" + inputobj.name
            } else {
                newUrl = dir + "/" + inputobj.name
            }
            if (inputobj.isfile) {
                //get three partitions
                await axios.post(baseURL + `/commands/`, { absolute_path: newUrl, type: "FILE", command: "mkdir_or_put", k: inputobj.part });
            } else {
                await axios.post(baseURL + `/commands/`, { absolute_path: newUrl, type: "DIRECTORY", command: "mkdir_or_put" })
            }
            // readData(dir)
        } catch (e) {
            console.error(e)
        }
        console.log("in submit")
        readData(dir)

    }

    //when delete the object, the object remove from datarry list
    const handleRemoveClick = async (i) => {
        try {
            console.log("remove", i);
            console.log(datarry[i])
            let deletepath = datarry[i].name;
            console.log(deletepath)
            //TODO connect API Remove
            let target = ""
            if (dir === '/') {
                target = "/" + datarry[i].name
            } else {
                target = dir + "/" + datarry[i].name
            }
            await axios.delete(baseURL + "/commands/", { data: { absolute_path: target, command: "deleteOnePath" } }, { mode: 'cors' });
            readData(dir)
        } catch (err) {
            console.error(err)
        }

    };

    //click on the box and go into the subdirectory ls
    const handleClick = async (i) => {
        console.log(dir)
        let newUrl = ""
        if (dir === '/') {
            newUrl = "/" + datarry[i].name
        } else {
            newUrl = dir + "/" + datarry[i].name
        }
        console.log(newUrl)
        setDir(newUrl);
        //this is to realize ls
        readData(newUrl)
    }

    //go to the previous directory
    const handleGoback = async () => {
        try {
            console.log(dir);
            let predata = []
            let prevUrl = dir.substring(0, dir.lastIndexOf("/"))
            setDir(prevUrl);
            readData(prevUrl)
        }
        catch (e) {
            console.error(e)
        }
    }

    //handle open modal
    const handleOpenModal = (i) => {
        setOpenModal(true);
        const file = datarry[i].name
        displayData(file);
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
                openmodal={() => handleOpenModal(item.id)}
            />
        )
    })





    //html display
    return (
        <div className="App">
            <Nav
                currentdirectory={loc}
                goback={() => handleGoback()}
                database="「SQL」"
            />
            <div className="row">
                <div className="left">

                    {arrayelements}
                    <p>-------------------------------------------------------------------------</p>

                    {/* input form */}
                    <form className="iform" onSubmit={e => handleSubmit(e)}>                                                                                                                                                                                                                                                <label htmlFor="name">Please input the name of File/Directory</label>
                        <input
                            type="text"
                            placeholder="name"
                            onChange={e => handleChange(e)}
                            name="name"
                            value={inputobj.name}
                        />
                        <br></br>
                        <input
                            type="checkbox"
                            id="isfile"
                            checked={inputobj.isfile}
                            onChange={e => handleChange(e)}
                            name="isfile"
                        />

                        <label className="labelforc" htmlFor="isfile">Is this a File?</label>

                        <br></br>

                        {inputobj.isfile &&
                            <div>
                                <fieldset>

                                    <p>1. Select the number of partitions</p>
                                    <input
                                        type="radio"
                                        id="1"
                                        name="part"
                                        value='1'
                                        checked={inputobj.part === "1"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="1">1</label>
                                    <br />

                                    <input
                                        type="radio"
                                        id="2"
                                        name="part"
                                        value='2'
                                        checked={inputobj.part === "2"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="2">2</label>
                                    <br />

                                    <input
                                        type="radio"
                                        id="3"
                                        name="part"
                                        value='3'
                                        checked={inputobj.part === "3"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="3">3</label>
                                    <br />

                                </fieldset>
                                <label htmlFor="method">2. Select the method of partition</label>
                                <select
                                    id="method"
                                    value={inputobj.method}
                                    onChange={handleChange}
                                    name="method"
                                >
                                    <option value="">-- Choose --</option>
                                    <option value="even">even partition</option>
                                    <option value="asci">First letter asci%n(partitions number)</option>
                                </select>
                            </div>}

                        <button className="button">Submit</button>
                    </form>
                </div>
                <div className="right">
                    <Link to="/analyze" className="button">Go analyzation</Link>
                </div>
            </div>
            {openModal && <Modal
                closeModal={setOpenModal}
                data={JSON.stringify(filedata)}
                content={JSON.stringify(filecontent)} />}
        </div>
    )
}
