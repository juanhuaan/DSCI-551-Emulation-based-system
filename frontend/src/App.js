import React from "react";
// import { Card } from "reactstrap";
// import Modal from "./components/Modal";
import Box from "./components/Box";
import fakedata from "./data"
import Nav from "./components/Nav"
// import FileSystem from "./api/api.js"
// import firebase from "./firebase.js"


export default function App() {
  const rooturl = "https://edfs-b732d-default-rtdb.firebaseio.com/root";


  const [datarry, setdatarry] = React.useState(null)
  const [inputobj, setval] = React.useState({
    id: 0,
    isfile: true,
    name: ""
  })
  const [url, setUrl] = React.useState(rooturl);
  const [loc, setLoc] = React.useState("root");

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

  // const [showConfirm, setShowConfirm] = React.useState(false);

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

  function handleSubmit(event) {
    event.preventDefault();
    setdatarry(prevarray =>
      [...prevarray, inputobj]
    )
    console.log(datarry)
  }

  const handleRemoveClick = (i) => {
    console.log("remove", i);
    const list = [...datarry];
    list.splice(i, 1);
    setdatarry(list);
    console.log(list);
    // setShowConfirm(false);

  };

  const handleClick = (i) => {
    const firebasedata = []
    console.log(url)
    let newUrl = url + "/" + datarry[i].name
    setUrl(newUrl);
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

  const arrayelements = datarry.map(item => {
    return (
      <Box
        key={item.id}
        name={item.name}
        isfile={item.isfile}
        remove={() => handleRemoveClick(item.id)}
        next={() => handleClick(item.id)}
      />
    )
  })

  return (
    <div>
      <Nav
        currentdirectory={loc}
        goback={() => handleGoback()}
      />
      <div className="boxbox">
        {arrayelements}
      </div>

      <form className="iform" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          onChange={handleChange}
          name="name"
          value={datarry.name}
        />
        <input
          type="checkbox"
          id="isfile"
          checked={datarry.isfile}
          onChange={handleChange}
          name="isfile"
        />
        <label htmlFor="isfile">File?</label>
        <button>submit</button>
      </form>
    </div>
  )
}
