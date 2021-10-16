import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';


function MyManager(props) {

    const [counter, setCounter] = useState();
    const [service, setService] = useState();
    const [close, setClose] = useState(false);
    const [postTrigger, setPostTriggger] = useState(undefined)



    useEffect(() => {
        const fetchAll = async (x) => {
            const response = await fetch('/api/counters');

            let responseBody = await response.json();
            if (responseBody.error) return;

            responseBody.forEach(async (x) => { x.services = await JSON.parse(x.services) });

            let i = await responseBody

            for (i = 0; i < responseBody.length; i++) {
                let v = responseBody[i].services
                responseBody[i].services = {}
                for (let e = 0; e < v.length; e++) {
                    responseBody[i].services[v[e]] = 1;
                }

            }
            setCounter(responseBody)
        }
        fetchAll();
    }, []);

    useEffect(() => {
        const fetchService = async (x) => {
            const response = await fetch('/api/services');
            const responseBody = await response.json();
            if (responseBody.error) return;
            setService(responseBody)
        }
        fetchService();
    }, []);

    let handleResponse = (c, s) => (event) => {
        let tmp_counter = [...counter]
        let index
        for (let i = 0; i < tmp_counter.length; i++) {
            if (tmp_counter[i].username === c.username) {
                index = i;
            }
        }
        if (event.target.checked) {
            tmp_counter[index].services[s.service] = 1;
        }
        else {
            tmp_counter[index].services[s.service] = 0;
        }
        setCounter(tmp_counter)
    }

    useEffect(() => {
        const postCounters = async () => {
            const response = await fetch('/api/counters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postTrigger)
            });
            if (response.status === 500) {
                console.log(response.err);
            }
        }
        if (postTrigger) {
            for (let i = 0; i < postTrigger.length; i++) {

                let buff = []

                for (let elem in postTrigger[i].services) {
                    if (postTrigger[i].services[elem] !== 0) {
                        if (elem === []) {
                            elem = null
                        }
                        buff.push(elem)
                    }
                }
                postTrigger[i].services = [...buff]

                postTrigger[i].services = JSON.stringify(postTrigger[i].services)
            }
            postCounters()
            setClose(true)
        }
    }, [postTrigger])

    let cnt = -1;

    if (close) {
        return (<Redirect to="/"></Redirect>)
    }

    return (
        <>
            {!props.user || props.user !== "manager" && <Redirect to={"/"} />}
            <Container className="bg-dark min-height-100 align-items-center m-0 p-0 text-center" fluid>

                <Container className="p-0 m-0" fluid>
                    <h1 className="text-white pt-5 pb-1 pr-0 pl-4">Welcome Mr. Manager!</h1>
                    <h5 className="text-white pt-0 pb-5 pr-0 pl-4">Here you can assign the services to each counter</h5>
                    {
                        counter ? counter.map((x) => {
                            cnt++;
                            return (<Row key={x.id} className="mb-4 mr-5 ml-5 text-center">
                                <Col sm={2} className="bg-primary text-black p-4 text-center border border-dark">
                                    <h5><b>{x.username}</b></h5>
                                </Col>
                                <Col sm={10} className="bg-light text-black p-4 text-center border border-dark">
                                    <Row>
                                        {service ? service.map((y) => { return (<Col key={y.service}><Form.Check onChange={handleResponse(x, y)} checked={counter[cnt].services[y.service] === 1 ? true : false} type="checkbox" label={y.service} /></Col>) }) : <></>}
                                    </Row>
                                </Col>

                            </Row>)
                        }) : <></>
                    }
                    <br />
                    <Row>
                        <Col sm={6}><Button className="mt-4 w-50 p-3" variant="danger" size="lg" onClick={() => setClose(true)}>Abort</Button></Col>
                        <Col sm={6}><Button className="mt-4 w-50 p-3" variant="success" size="lg" onClick={() => (setPostTriggger(counter))}>Confirm</Button></Col>
                    </Row>
                </Container>
            </Container>
        </>
    )

}

export default MyManager;