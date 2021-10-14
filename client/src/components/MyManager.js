import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container";
import { useState } from 'react';
import { useEffect } from 'react';


function MyManager(props) {

    const [counter, setCounter] = useState();

    useEffect(() => {
        const fetchAll = async (x) => {
            const response = await fetch('/api/counters');
            const responseBody = await response.json();
            setCounter(responseBody)
            console.log(responseBody)
        }
        fetchAll();
    },[]);

    return (
        <Container className="bg-dark min-height-100 justify-content-center align-items-center flex m-0" style={{ display: 'flex' }} fluid>

            <Container className="w-100 justify-content-center" >
                <h1 className="text-white justify-content-center">Welcome Manager</h1>
                <br></br>
                <br></br>
            {
                counter?counter.map((x)=>{return(<Row key={x.id} className="m-4 p-2">
                                                    <Col sm={4} className="bg-light text-dark">{x.username}</Col>
                                                    <Col sm={8} className="bg-primary"></Col>
                                                    
                                                </Row> )}):<></>
            }
            </Container>
        </Container>
    )

}

export default MyManager;