import { Button, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router";
import { useState } from 'react';
import { Redirect } from "react-router-dom";
import API from "./API";

function MyOfficer(props) {

    const [ticketNumber, setTicketNumber] = useState("-");
    let { id } = useParams();

    function handleSubmit(id) {

        API.getNextTicket(id).then(async (response) => {
            if (response === null) {
                setTicketNumber("Response undefined");
                return;
            }
            if (response.error === undefined) {
                let num = await JSON.parse(response.ticket);
                if (num === 0) num = "x";
                setTicketNumber(num);
            }
            else {
                setTicketNumber(response.error);
            }
        })
    }

    return (
        <>
            {!props.user || (props.user !== "counter"+id && <Redirect to={"/"} />)}
            <Container className="bg-dark min-height-100" style={{ display: 'flex', justifyContent: "center" }} fluid>
                <Row className=" justify-content-center align-items-center">
                    <Col><h1 className='text-white' id="number">{ticketNumber}</h1></Col>
                    <Col>
                        <Button onClick={() => handleSubmit(id)}>
                            Click to serve a new ticket
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default MyOfficer