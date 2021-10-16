import { Container, ListGroup } from "react-bootstrap";
import { useState, useEffect } from 'react';
import API from "./API";

function MyMonitor() {

  const [queues, setQueues] = useState();
  const [tickets, setTickets] = useState();

  useEffect(() => {
    API.loadQueues().then((q) => { if (q.error === undefined) setQueues(q); });
    API.loadServings().then((t) => { if (t.error === undefined) setTickets(t); });
  }, []);

  return (
    <Container className="bg-dark min-height-100 justify-content-center align-items-center text-center m-0 p-0" fluid>
      <h1 className="text-white pt-5 pb-1 pr-0 pl-4">Main Display Board</h1>
      <h5 className="text-white pt-0 pb-5 pr-0 pl-4">The number in green is the one being served.</h5>
      {queues &&
        Object.keys(queues).map((c) =>
          <ListGroup horizontal="md" className="mt-3 ml-5 align-items-center" key={c}>
            <ListGroup.Item variant="primary"><h2>{c}</h2></ListGroup.Item>
            <ListGroup.Item variant="success">
              <h6>{tickets && tickets[c] ? tickets[c].counter : " "}</h6>
              <h3>{tickets && tickets[c] ? tickets[c].ticket : " "}</h3>
            </ListGroup.Item>
            {queues[c].map(i => <ListGroup.Item key={i}><h3>{i}</h3></ListGroup.Item>)}
          </ListGroup>
        )
      }
    </Container>
  );
}

export default MyMonitor;