import React, { useState } from "react";
import Box from "./components/Box";
import Nav from "./components/Nav";
import Modal from "./components/Modal";
import "./Home.css"
import { Link } from "react-router-dom";
import { db } from './firebase'
import { ref, set, onValue, remove } from "firebase/database";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Home() {
    const [datarry, setdatarry] = React.useState([])
    const [inputobj, setval] = React.useState({
        id: 0,
        isfile: true,
        name: "",
        part: "",
        method: "even"
    })
    const [dir, setDir] = React.useState('/droot');
    const [loc, setLoc] = React.useState("root");
    const [openModal, setOpenModal] = useState(false);
    const [filedata, setFileData] = useState("");
    const [filecontent, setFileContent] = useState("");

    /* functions of CRUD of firebase */
    //API: mkdir/put
    function writeData(dirc, content) {
        set(ref(db, dir + dirc), content);
    }

    //API: rm
    function deleteData(dirc) {
        remove(ref(db, dir + dirc))
    }

    //API: ls
    function readData(dirc) {
        console.log("in read data function!")
        setLoc(dirc.substring(dirc.lastIndexOf("/") + 2))
        const firebasedata = []
        const query = ref(db, dirc);
        return onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                for (let child in data) {
                    firebasedata.push({
                        id: firebasedata.length,
                        isfile: child.substring(0, 1) === 'f' ? true : false,
                        name: child
                    })
                }
                setdatarry(firebasedata)
            }
        })
    }

    //API: cat
    function displayData(dirc, file) {
        console.log("in display data function!")
        const firebasedata = []
        const query = ref(db, dirc);
        return onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setFileData(data[file])
                fetch(data[file] + ".json")
                    .then(res => res.json())
                    .then(data => {
                        console.log(data[0, 5])
                        setFileContent(data[0, 5])
                    })
            }
        })
    }

    /* end of API call */

    //run once when start the app
    React.useEffect(() => {
        console.log("effect run");
        readData(dir)
    }, [])


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
    function handleSubmit(event) {
        event.preventDefault();
        console.log("insdie handle submit")
        // toggleSubmit(!submit)
        console.log(inputobj)
        //TODO connect API Add
        if (inputobj.isfile) {
            //get three partitions
            writeData("/f" + inputobj.name + '1', `https://edfs-b732d-default-rtdb.firebaseio.com/${inputobj.name}/${inputobj.name}1`)
            writeData("/f" + inputobj.name + '2', `https://edfs-b732d-default-rtdb.firebaseio.com/${inputobj.name}/${inputobj.name}2`)
            writeData("/f" + inputobj.name + '3', `https://edfs-b732d-default-rtdb.firebaseio.com/${inputobj.name}/${inputobj.name}3`)
        } else {
            writeData("/d" + inputobj.name, "1")
        }
        readData(dir)
    }

    //when delete the object, the object remove from datarry list
    const handleRemoveClick = (i) => {
        let deletepath = datarry[i].name;
        //TODO connect API Remove
        deleteData("/" + deletepath)
        readData(dir)
    };

    //click on the box and go into the subdirectory
    const handleClick = (i) => {
        let newDir = datarry[i].name
        let next = dir + "/" + newDir;
        setDir(next)
        readData(next)
    }

    //go to the previous directory
    const handleGoback = () => {
        let prevUrl = dir.substring(0, dir.lastIndexOf("/"))
        setDir(prevUrl)
        readData(prevUrl)
    }

    //handle open modal
    const handleOpenModal = (i) => {
        setOpenModal(true);
        const file = datarry[i].name
        displayData(dir, file);
    }

    //list of boxes 
    const arrayelements = datarry.map(item => {
        return (
            <Box
                key={item.id}
                name={item.name.substring(1)}
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
                database="「FIREBASE」"
            />
            <div className="row">
                <div className="left">

                    {arrayelements}
                    <p>-------------------------------------------------------------------------</p>

                    {/* input form */}
                    <form className="iform" onSubmit={e => handleSubmit(e)}>
                        <label htmlFor="name">Please input the name of File/Directory</label>
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
