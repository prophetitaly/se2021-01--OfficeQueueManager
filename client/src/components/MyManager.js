import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup"
import Form from "react-bootstrap/Form"
import { useState } from 'react';
import { useEffect } from 'react';


function MyManager(props) {

    const [counter, setCounter] = useState();
    const [service, setService] = useState();


    useEffect(() => {
        const fetchAll = async (x) => {
            const response = await fetch('/api/counters');
            const responseBody = await response.json();
            setCounter(responseBody)
        }
        fetchAll();
    },[]);

    useEffect(() => {
        const fetchService = async (x) => {
            const response = await fetch('/api/services');
            const responseBody = await response.json();
            setService(responseBody)
        }
        fetchService();
    },[]);

    return (
        <Container className="bg-dark min-height-100 align-items-center m-0 p-0 text-center" fluid>

            <Container className="p-0 m-0" fluid>
                <h1 className="text-white pt-5 pb-1 pr-0 pl-4">Welcome!</h1>
                <h5 className="text-white pt-0 pb-5 pr-0 pl-4">Here you can assign the services to each counter</h5>
            {
                counter?counter.map((x)=>{return(<Row key={x.id} className="mb-4 mr-4 ml-4 p-2 text-center">
                                                        <Col sm={2} className="bg-primary text-black p-2 text-center border border-dark">
                                                            {x.username}
                                                        </Col>
                                                    <Col sm={10} className="bg-light text-black p-2 text-center border border-dark">
                                                        <Row>
                                                        {service?service.map((x)=>{return(<Col><Form.Check type="checkbox" label={x.service}/></Col>)}):<></>}
                                                        </Row>
                                                    </Col>
                                                    
                                                </Row> )}):<></>
            }
            </Container>
        </Container>
    )

}

export default MyManager;