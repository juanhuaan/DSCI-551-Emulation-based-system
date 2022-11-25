import { getDatabase, ref, set } from "firebase/database";
import React from "react";

const db = getDatabase();
const [datarry, setdatarry] = React.useState([])
const [url, seturl] = React.useState("https://edfs-b732d-default-rtdb.firebaseio.com")


//get data ls
function fget(path) {
    fetch(url + ".json")
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
            setdatarry(firebasedata)
            console.log(firebasedata)

        })

}
//filename and number of partitions
function writefileData(filename, NumP) {
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

}