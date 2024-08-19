import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  // Card,
  Tabs,
  Tab,
  Modal
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import "./MessagePage.css";
import { CheckCircleFill } from 'react-bootstrap-icons';

import { XCircleFill } from 'react-bootstrap-icons';


const MessagePage = () => {
  const [fileData, setFileData] = useState([]);
  const [activeTab, setActiveTab] = useState("message");
  // const [uploaded, setUploaded] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setUploaded(true);
  //     setFileData(file);
  //     // setshowError(false);
  //     // Parsing logic can be added here if necessary (e.g., using a library like papaparse)
  //   } else {
  //     setUploaded(false);
  //     setFileData([]);
  //   }
  // };

  const sendEmails = () => {
    setLoading(true);
    setActiveTab("sent-status"); // Switch to "Sent Status" tab


    setFileData((prevFileData) =>
      prevFileData.map(user => ({ ...user, emailStatus: "sending" }))
    );

    const eventSource = new EventSource(
      "http://localhost:8000/api/v1/message/sendMessage/via-gmail"
    );

    eventSource.onopen = () => {
      console.log("Connection to server opened.");
    };

    eventSource.onmessage = (event) => {
      console.log("EventSource message:", event.data);
      setStatus((prevStatus) => [...prevStatus, event.data]);

      const update = JSON.parse(event.data);
      console.log("Update:", update);

      if (update.message === "All mails processed") {
        setLoading(false);
        eventSource.close();
        setShowModal(true);
      } else {
        setFileData((prevFileData) => {
          const updatedFileData = prevFileData.map((user) =>
            user.email === update.email
              ? {
                ...user,
                emailSent: update.emailSent === "yes",
                emailStatus: update.emailSent,
              }
              : user
          );

          if (update.email && !updatedFileData.find((user) => user.email === update.email)) {
            updatedFileData.push({
              name: update.name,
              phoneNo: update.phoneNo,
              email: update.email,
              emailSent: update.emailSent === "yes",
              emailStatus: update.emailSent,
              messageSent: false, // Update this based on your logic for WhatsApp messages
            });
          }

          return updatedFileData;
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      setStatus((prevStatus) => [
        ...prevStatus,
        "An error occurred while sending emails.",
      ]);
      setLoading(false);
      eventSource.close();
    };
  };

  const viewDetails = () => {
    if (!fileData.length) {
      setShowError(true);
      return;
    }
    // Logic to view details
  };

  const additionalAction = () => {
    if (!fileData.length) {
      setShowError(true);
      return;
    }
    // Logic for another action
  };

  return (
    <Container fluid>
      <header className="text-center my-4">
        <h2>Send Mail & WhatsApp Messages</h2>
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
                <Row className="justify-content-center mb-3">
                  <Col md={8} className="text-center">
                    <Button
                      variant="primary"
                      onClick={viewDetails}
                      className="m-2"
                      disabled={loading}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="warning"
                      onClick={sendEmails}
                      className="m-2"
                      disabled={loading}
                    >
                      Send Emails
                    </Button>
                    <Button
                      variant="info"
                      onClick={additionalAction}
                      className="m-2"
                      disabled={loading}
                    >
                      Additional Action
                    </Button>
                  </Col>
                </Row>
                {/* <Row className="justify-content-center">
                  <Col md={8}>
                    <Card className="p-4 mb-4 shadow">
                     
                    </Card>
                  </Col>
                </Row> */}
                {loading && (
                  <div className="text-center">
                    {/* <ClipLoader size={35} color={"#123abc"} /> */}
                  </div>
                )}
                <div>
                  {status.map((message, index) => (
                    <p key={index}></p>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="sent-status" title="Sent Status">
                <Row className="justify-content-center">
                  <Col md={12} style={{ textAlign: "center" }}>
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
                        {fileData.length > 0 ? (
                          fileData.map((user, index) => (
                            <tr key={index}>
                              <td>{user.name}</td>
                              <td>{user.phoneNo}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.emailStatus === "sending" ? (
                                  <ClipLoader size={20} color={"#123abc"} />
                                ) : user.emailStatus === "yes" ? (
                                  // green  tick icon
                                  <CheckCircleFill color="green" />
                                ) : (
                                  // red cross icon
                                  <XCircleFill color="red" />
                                )}
                              </td>
                              <td>{user.messageSent ? "Yes" : "No"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        {/* <Row className="justify-content-center">
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
        </Row> */}
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Emails Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          All emails have been successfully sent!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MessagePage;
