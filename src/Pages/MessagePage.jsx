import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Card,
  Tabs,
  Tab,
} from "react-bootstrap";
import "./MessagePage.css";

const MessagePage = () => {
  const [fileData, setFileData] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  const [showError, setshowError] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploaded(true);
      setFileData(file);
      setshowError(false);
      // Parsing logic can be added here if necessary (e.g., using a library like papaparse)
    } else {
      setUploaded(false);
      setFileData([]);
    }
  };

  const sendEmails = () => {
    if (fileData.length == 0) {
      setshowError(true);
      return;
    }
    // Logic to send emails
  };

  const sendMessages = () => {
    if (fileData.length == 0) {
      setshowError(true);
      return;
    }
    // Logic to send WhatsApp messages
  };

  const viewDetails = () => {
    if (fileData.length == 0) {
      setshowError(true);
      return;
    }
    // Logic to view details
  };

  const additionalAction = () => {
    if (fileData.length == 0) {
      setshowError(true);
      return;
    }
    // Logic for another action
  };

  return (
    <Container fluid>
      <header className="text-center my-4">
        <h1>Optica Mail & WhatsApp Sender</h1>
      </header>

      <main>
        <Row className="justify-content-center">
          <Col md={10}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="message" title="Message">
                <Row className="justify-content-center">
                  <Col md={8} className="text-center">
                    <Button
                      variant="primary"
                      onClick={viewDetails}
                      className="m-2"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="success"
                      onClick={sendMessages}
                      className="m-2"
                    >
                      Send WhatsApp Messages
                    </Button>
                    <Button
                      variant="warning"
                      onClick={sendEmails}
                      className="m-2"
                    >
                      Send Emails
                    </Button>
                    <Button
                      variant="info"
                      onClick={additionalAction}
                      className="m-2"
                    >
                      Additional Action
                    </Button>
                  </Col>
                </Row>
              </Tab>
              &nbsp;&nbsp;
              <Tab eventKey="sent-status" title="Sent Status">
                <Row className="justify-content-center">
                  <Col md={12}>
                    <Table striped bordered hover className="mt-4">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Phone Number</th>
                          <th>Email</th>
                          <th>Email Sent</th>
                          <th>WhatsApp Sent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fileData.map((user, index) => (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.phoneNo}</td>
                            <td>{user.email}</td>
                            <td>{user.emailSent ? "Yes" : "No"}</td>
                            <td>{user.messageSent ? "Yes" : "No"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Tab>
              &nbsp;&nbsp;
            </Tabs>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4 mb-4 shadow">
              <Card.Body>
                <h3>Upload Excel File</h3>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv"
                />
                {showError && (
                  <p className="text-danger mt-2">No file chosen</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </Container>
  );
};

export default MessagePage;
