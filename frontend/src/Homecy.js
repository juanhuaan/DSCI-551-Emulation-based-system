import React, { useState } from "react";
import Box from "./components/Box";
import Nav from "./components/Nav";
import InputForm from "./components/InputForm";
import Modal from "./components/Modal";
import "./Home.css"
import { Link } from "react-router-dom";


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


    React.useEffect(() => {
        const firebasedata = []
        console.log("effect run");
        //API call
        fetch("https://edfs-b732d-default-rtdb.firebaseio.com/root.json")
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                // console.log(JSON.stringify(data))
                for (let child in data) {
                    console.log(child)
                    firebasedata.push({
                        id: firebasedata.length,
                        isfile: false,
                        name: child
                    })
                }
                setdatarry(firebasedata)
                console.log(firebasedata)
            })
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