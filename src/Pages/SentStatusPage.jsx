import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import "./SentStatusPage.css";

const SentStatusPage = () => {
  // Placeholder for sent status data
  const sentStatusData = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      emailSent: true,
      messageSent: false,
    },
    // More data...
  ];

  return (
    <Container fluid>
      <header className="text-center my-4">
        <h1>Sent Status</h1>
      </header>

      <main>
        <Row className="justify-content-center">
          <Col md={12}>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Email Sent</th>
                  <th>WhatsApp Sent</th>
                </tr>
              </thead>
              <tbody>
                {sentStatusData.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.emailSent ? "Yes" : "No"}</td>
                    <td>{user.messageSent ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </main>
    </Container>
  );
};

export default SentStatusPage;
