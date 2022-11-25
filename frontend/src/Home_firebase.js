import React, { useState } from "react";
import Box from "./components/Box";
import Nav from "./components/Nav";
import InputForm from "./components/InputForm";
import Modal from "./components/Modal";
import "./Home.css"
import { Link } from "react-router-dom";
import { db } from './firebase'
import { ref, set, onValue, remove } from "firebase/database";


export default function Home() {
    const rooturl = "https://edfs-b732d-default-rtdb.firebaseio.com/root";
    const [datarry, setdatarry] = React.useState(null)
    const [inputobj, setval] = React.useState({
        id: 0,
        isfile: true,
        name: ""
    })
    const [dir, setDir] = React.useState('/droot');
    const [loc, setLoc] = React.useState("root");
    const [openModal, setOpenModal] = useState(false)

    /* functions of CRUD of firebase */
    //API: mkdir
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

    //run once when start the app
    React.useEffect(() => {
        readData(dir)
        console.log("effect run");
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
        console.log("inside handle change")
        console.log(inputobj)
    }

    //when submit the new object, the array display update and display on the screen
    function handleSubmit(event) {

        event.preventDefault();
        console.log("insdie handle submit")
        console.log(inputobj)
        setdatarry(prevarray =>
            [...prevarray, inputobj]
        )
        console.log("1111111111111")
        console.log(datarry)
        //TODO connect API Add
        writeData("/" + inputobj.name, "content of picasso file")
        readData(dir)
        console.log("2222222222222")
        console.log(datarry)
    }

    //when delete the object, the object remove from datarry list
    const handleRemoveClick = (i) => {
        console.log("remove", i);
        let deletepath = datarry[i].name;
        const list = [...datarry];
        list.splice(i, 1);
        setdatarry(list);
        console.log(list);
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

                    {/* input form */}
                    <form className="iform" onSubmit={handleSubmit}>
                        <label htmlFor="name">Please input the name of File/Directory</label>
                        <br></br>
                        <input
                            type="text"
                            placeholder="name"
                            onChange={handleChange}
                            name="name"
                            value={inputobj.name}
                        />
                        <br></br>
                        <input
                            type="checkbox"
                            id="isfile"
                            checked={inputobj.isfile}
                            onChange={handleChange}
                            name="isfile"
                        />

                        <label className="labelforc" htmlFor="isfile">Is this a File?</label>

                        <br></br>

                        <fieldset>
                            <p>If yes, select the number of partitions</p>
                            <input
                                type="radio"
                                id="1"
                            />
                            <label htmlFor="1">1</label>
                            <br />

                            <input
                                type="radio"
                                id="2"
                            />
                            <label htmlFor="2">2</label>
                            <br />

                            <input
                                type="radio"
                                id="3"
                            />
                            <label htmlFor="3">3</label>
                            <br />
                        </fieldset>
                        <button className="button">Submit</button>
                    </form>
                    {/* <InputForm
                        submit={(e) => handleSubmit(e)}
                        change={(e) => handleChange(e)}
                        val={inputobj.name}
                        checked={inputobj.isfile}
                    /> */}
                </div>
                <div className="right">
                    <Link to="/analyze" className="button">Go analyzation</Link>
                </div>
            </div>
            {openModal && <Modal closeModal={setOpenModal} />}
        </div>


    )
}
