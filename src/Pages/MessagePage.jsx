import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Tabs,
  Tab,
  Modal,
  Card,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import "./MessagePage.css";
import axios from "axios";

const MessagePage = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [activeTab, setActiveTab] = useState("message");
  const [showError, setShowError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const sendEmails = () => {
    // setLoading(true);
    setActiveTab("sent-status");

    setFileData((prevFileData) =>
      prevFileData.map((user) => ({ ...user, emailStatus: "sending" }))
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

          if (
            update.email &&
            !updatedFileData.find((user) => user.email === update.email)
          ) {
            updatedFileData.push({
              name: update.name,
              phoneNo: update.phoneNo,
              email: update.email,
              emailSent: update.emailSent === "yes",
              emailStatus: update.emailSent,
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

  const sendWhatsAppMessages = () => {
    // setLoading(true);
    setActiveTab("sent-status");

    setFileData((prevFileData) =>
      prevFileData.map((user) => ({ ...user, messageStatus: "sending" }))
    );

    const eventSource = new EventSource(
      "http://localhost:8000/api/v1/message/sendMessage/via-whatsapp"
    );

    setFileData((prevFileData) =>
      prevFileData.map((user) => ({ ...user, messageStatus: "sending" }))
    );
    eventSource.onopen = () => {
      console.log("Connection to server opened.");
    };

    eventSource.onmessage = (event) => {
      console.log("EventSource message:", event.data);
      setStatus((prevStatus) => [...prevStatus, event.data]);

      const update = JSON.parse(event.data);
      console.log("Update:", update);

      if (update.message === "All messages processed") {
        setLoading(false);
        eventSource.close();
        setShowModal(true);
      } else {
        setFileData((prevFileData) => {
          const updatedFileData = prevFileData.map((user) =>
            user.phoneNo === update.phoneNo
              ? {
                  ...user,
                  messageSent: update.messageSent === "yes",
                  messageStatus: update.messageSent,
                }
              : user
          );

          if (
            update.phoneNo &&
            !updatedFileData.find((user) => user.phoneNo === update.phoneNo)
          ) {
            updatedFileData.push({
              name: update.name,
              phoneNo: update.phoneNo,
              email: update.email,
              messageSent: update.messageSent === "yes",
              messageStatus: update.messageSent,
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
        "An error occurred while sending WhatsApp messages.",
      ]);
      setLoading(false);
      eventSource.close();
    };
  };

  // const sendBoth = () => {
  //   setLoading(true);
  //   setActiveTab("sent-status");

  //   setFileData((prevFileData) =>
  //     prevFileData.map((user) => ({
  //       ...user,
  //       emailStatus: "sending",
  //       messageStatus: "sending",
  //     }))
  //   );

  //   const eventSource = new EventSource(
  //     "http://localhost:8000/api/v1/message/sendMesage/via-both"
  //   );

  //   eventSource.onopen = () => {
  //     console.log("Connection to server opened.");
  //   };

  //   eventSource.onmessage = (event) => {
  //     console.log("EventSource message:", event.data);
  //     setStatus((prevStatus) => [...prevStatus, event.data]);

  //     const update = JSON.parse(event.data);
  //     console.log("Update:", update);

  //     if (update.message === "All messages processed") {
  //       setLoading(false);
  //       eventSource.close();
  //       setShowModal(true);
  //     } else {
  //       setFileData((prevFileData) => {
  //         const updatedFileData = prevFileData.map((user) => {
  //           if (user.email === update.email || user.phoneNo === update.phoneNo) {
  //             return {
  //               ...user,
  //               emailSent: update.emailSent === "yes",
  //               emailStatus: update.emailSent || user.emailStatus,
  //               messageSent: update.messageSent === "yes",
  //               messageStatus: update.messageSent || user.messageStatus,
  //             };
  //           }
  //           return user;
  //         });

  //         if (update.phoneNo && !updatedFileData.find((user) => user.phoneNo === update.phoneNo)) {
  //           updatedFileData.push({
  //             name: update.name,
  //             phoneNo: update.phoneNo,
  //             email: update.email,
  //             emailSent: update.emailSent === "yes",
  //             emailStatus: update.emailSent,
  //             messageSent: update.messageSent === "yes",
  //             messageStatus: update.messageSent,
  //           });
  //         }

  //         return updatedFileData;
  //       });
  //     }
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error("EventSource failed:", error);
  //     setStatus((prevStatus) => [
  //       ...prevStatus,
  //       "An error occurred while sending both emails and WhatsApp messages.",
  //     ]);
  //     setLoading(false);
  //     eventSource.close();
  //   };
  // };

  // uploading a excel file

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    console.log("file is: ", excelFile);
    setShowError("");
    const validExtensions = ["xlsx", "xls", "xlsm", "csv"];

    if (!excelFile) {
      setShowError("No file chosen.");
      return;
    }

    if (
      !validExtensions.includes(excelFile.name.split(".").pop().toLowerCase())
    ) {
      setShowError("Please upload a valid excel file.");
      setExcelFile(null);
      return;
    }

    const formData = new FormData();

    formData.append("usersExcelFile", excelFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/files/upload/excelFile",
        formData
      );

      if (response.status == 200) {
        alert("File uploaded successfully.");
      } else {
        alert("Failed to upload file.");
        console.error("Failed to upload file");
      }
    } catch (error) {
      alert("Failed to upload file.");
      console.error("Failed to upload file", error);
    }
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
                      onClick={sendWhatsAppMessages}
                      className="m-2"
                      disabled={loading}
                    >
                      Send WhatsApp Messages
                    </Button>
                    {/* <Button
                      variant="success"
                      // onClick={sendBoth}
                      className="m-2"
                      disabled={loading}
                    >
                      Send Both
                    </Button> */}
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
                {loading && (
                  <div className="text-center">
                    <ClipLoader size={35} color={"#123abc"} />
                  </div>
                )}
                <div>
                  {status.map((message, index) => (
                    <p key={index}></p>
                  ))}
                </div>
              </Tab>

              <Tab
                eventKey="sent-status"
                title="Sent Status"
                className="ml-auto"
              >
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
                                  <CheckCircleFill color="green" />
                                ) : (
                                  <XCircleFill color="red" />
                                )}
                              </td>
                              <td>
                                {user.messageStatus === "sending" ? (
                                  <ClipLoader size={20} color={"#123abc"} />
                                ) : user.messageStatus === "yes" ? (
                                  <CheckCircleFill color="green" />
                                ) : (
                                  <XCircleFill color="red" />
                                )}
                              </td>
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

        {activeTab === "message" && (
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="p-1 mb-4 shadow">
                <Card.Body>
                  <h3>Upload Excel File</h3>
                  <br />
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept=".xlsx, .xls, .csv"
                  />
                  {showError != "" && (
                    <p className="text-danger mt-2 mb-0">{showError}</p>
                    // add button for uploading file
                  )}

                  {
                    // button for uploading file
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={uploadFile}
                    >
                      Upload File
                    </Button>
                  }

                  <p className="mt-3">
                    <strong>Note: Upload File only in excel format.</strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Emails Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          All emails and WhatsApp messages have been successfully sent!
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
