import { Button, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router";
import API from "./API";

function handleSubmit(id) {
    API.getNextTicket(id).then((response) => {
        if (response === null) {
            document.getElementById("number").innerText = "Response undefined"
            return;
        }
        if (response.error === undefined) {
            console.log(response);
            document.getElementById("number").innerText = JSON.parse(response.ticket)
        }
        else {
            document.getElementById("number").innerText = response.error
        }
    })
}
function MyOfficer(props) {
    let {id} = useParams()
    return (
        <>
        <Container className="bg-dark min-height-100" style={{ display: 'flex', justifyContent: "center" }} fluid>
            <Row className=" justify-content-center align-items-center">
                <Col><h1 className='text-white' id="number">-</h1></Col>
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