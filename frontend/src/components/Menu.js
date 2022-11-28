import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";


function TabsExample() {
    return (
        <Nav variant="tabs" defaultActiveKey="/home">
            <Nav.Item>
                <Nav.Link id="sql" href="/">
                    {/* <Link to="/">SQL</Link> */}
                    SQL
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link id="firebase" href="/firebase">
                    {/* <Link to="/firebase">FIREBASE</Link> */}
                    Firebase
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link id="analyze" href="/analyze">
                    {/* <Link to="/analyze">Go analyzation</Link> */}
                    Go Analyzation
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default TabsExample;