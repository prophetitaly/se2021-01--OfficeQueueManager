import { Container, ListGroup } from "react-bootstrap";
import { useState, useEffect } from 'react';
import API from "./API";

function MyMonitor() {

  const [queues, setQueues] = useState();
  const [tickets, setTickets] = useState();

  const updateMonitor = () => {
    API.loadQueues().then((q) => {
      const t = {};
      if (q.error === undefined) {
        Object.keys(q).forEach(c => {
          const last = q[c].slice(-1)[0];
          if (last.length > 1) {
            if (last.slice(-2, -1) === '@') {
              t[c] = { counter: last.slice(-1), ticket: last.slice(0, -2) };
              q[c].pop();
            }
          }
        });
        setQueues(q);
        setTickets(t);
      }
    });
  };

  useEffect(() => {
    updateMonitor();
    setInterval(() => updateMonitor(), 2000);
  }, []);

  return (
    <Container className="bg-dark min-height-100 justify-content-center align-items-center text-center m-0 p-0" fluid>
      <h1 className="text-white pt-5 pb-1 pr-0 pl-4">Main Display Board</h1>
      <h5 className="text-white pt-0 pb-5 pr-0 pl-4">The number in green is the one being served.</h5>
      {queues ?
        Object.keys(queues).map((c) =>
          <ListGroup horizontal="md" className="mt-3 ml-5 align-items-center" key={c}>
            <ListGroup.Item variant="primary"><h2>{c}</h2></ListGroup.Item>
            <ListGroup.Item variant="success">
              <h6>{tickets && tickets[c] ? 'Counter ' + tickets[c].counter : " "}</h6>
              <h3>{tickets && tickets[c] ? tickets[c].ticket : " "}</h3>
            </ListGroup.Item>
            {queues[c].map(i => <ListGroup.Item key={i}><h3>{i}</h3></ListGroup.Item>)}
          </ListGroup>
        ) :
        <h1 className="text-white pt-5 pb-1 pr-0 pl-4">There are no tickets in queue at the moment.</h1>
      }
    </Container>
  );
}

export default MyMonitor;