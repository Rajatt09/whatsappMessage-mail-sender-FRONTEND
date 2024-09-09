import { useState, useEffect, useRef } from "react";
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
  Form,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import "./MessagePage.css";
import axios from "axios";
import MessagesHistory from "../Components/MessagesHistory";

const MessagePage = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [activeTab, setActiveTab] = useState("message");
  const [showError, setShowError] = useState({
    message: "",
    mail: "",
    uploadfile: "",
    eventdetail: {
      eventname: "",
      eventdate: "",
    },
  });
  const [eventdetail, setEventDetail] = useState({
    name: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("hey buddy: ", whatsappMessage);

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await axios.get("/message/get-mails-messages/history");
        console.log("history is: ", response.data);
        setHistory(response.data.data);
        setHistoryLoading(false);
      } catch (err) {
        setError("Failed to fetch history");
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatText = (text) => {
    return text
      .replace(/\*([^\*]+)\*/g, "<b>$1</b>") // Convert *bold* to <b>bold</b>
      .replace(/_([^_]+)_/g, "<i>$1</i>") // Convert _italic_ to <i>italic</i>
      .replace(/~([^~]+)~/g, "<del>$1</del>"); // Convert ~strikethrough~ to <del>strikethrough</del>
  };

  const sendEmails = () => {
    // setLoading(true);
    setShowError({
      message: "",
      mail: "",
      uploadfile: "",
      eventdetail: {
        eventname: "",
        eventdate: "",
      },
    });
    if (eventdetail.name == "") {
      setShowError((prevData) => ({
        ...prevData,
        eventdetail: {
          ...prevData.eventdetail,
          eventname: "Please fill the event name.",
        },
      }));

      return;
    } else if (eventdetail.date == "") {
      setShowError((prevData) => ({
        ...prevData,
        eventdetail: {
          ...prevData.eventdetail,
          eventdate: "Please fill the event time.",
        },
      }));
      return;
    }
    setActiveTab("sent-status");

    setFileData((prevFileData) =>
      prevFileData.map((user) => ({ ...user, emailStatus: "sending" }))
    );

    const eventSource = new EventSource(
      `${import.meta.env.VITE_LOCALHOST}/message/sendMessage/via-gmail`
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

  const sendWhatsAppMessages = async () => {
    // setLoading(true);
    setShowError({
      message: "",
      mail: "",
      uploadfile: "",
      eventdetail: {
        eventname: "",
        eventdate: "",
      },
    });
    if (eventdetail.name == "") {
      setShowError((prevData) => ({
        ...prevData,
        eventdetail: {
          ...prevData.eventdetail,
          eventname: "Please fill the event name.",
        },
      }));

      return;
    } else if (eventdetail.date == "") {
      setShowError((prevData) => ({
        ...prevData,
        eventdetail: {
          ...prevData.eventdetail,
          eventdate: "Please fill the event time.",
        },
      }));
      return;
    }
    setActiveTab("sent-status");

    setFileData((prevFileData) =>
      prevFileData.map((user) => ({ ...user, messageStatus: "sending" }))
    );

    const whatsappResponse = await axios.post(
      "/message/sendMessage/whatsappData",
      {
        eventdetail,
        whatsappMessage,
      }
    );

    const eventSource = new EventSource(
      `${import.meta.env.VITE_LOCALHOST}/message/sendMessage/via-whatsapp`
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
    setShowError({
      message: "",
      mail: "",
      uploadfile: "",
      eventdetail: {
        eventname: "",
        eventdate: "",
      },
    });
    const validExtensions = ["xlsx", "xls", "xlsm", "csv"];

    if (!excelFile) {
      setShowError((prevData) => ({
        ...prevData,
        uploadfile: "No file chosen.",
      }));

      return;
    }

    if (
      !validExtensions.includes(excelFile.name.split(".").pop().toLowerCase())
    ) {
      setShowError((prevData) => ({
        ...prevData,
        uploadfile: "Please upload a valid excel file.",
      }));

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
      return;
    }
    // Logic to view details
  };

  const additionalAction = () => {
    if (!fileData.length) {
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
                              No messages/mails sent yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="Previously Sent" title="Previously Sent">
                <Row className="justify-content-center mb-3">
                  <Col md={8} className="text-center">
                    {/* <Button
                      variant="primary"
                      onClick={viewDetails}
                      className="m-2"
                      disabled={loading}
                    >
                      Previously sent messages
                    </Button>
                    <Button
                      variant="primary"
                      onClick={sendEmails}
                      className="m-2"
                      disabled={loading}
                    >
                      Previously sent mails
                    </Button> */}
                  </Col>
                </Row>
                {loading && (
                  <div className="text-center">
                    <ClipLoader size={35} color={"#123abc"} />
                  </div>
                )}
                <MessagesHistory
                  history={history}
                  loading={historyLoading}
                  error={error}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {activeTab === "message" && (
          <>
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="p-1 mb-4 shadow">
                  <Card.Body>
                    <h3>
                      Event Details <span style={{ color: "red" }}>*</span>
                    </h3>
                    <p className="mt-0">
                      <strong>
                        ( Event details required only while sending mail and
                        messages )
                      </strong>
                    </p>
                    {/* <br /> */}
                    <Form>
                      <Form.Group controlId="eventName">
                        <Form.Label>
                          <strong>Event Name</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter event name"
                          value={eventdetail.name}
                          onChange={(e) =>
                            setEventDetail((prevData) => ({
                              ...prevData,
                              name: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                      {showError.eventdetail.eventname != "" && (
                        <p className="text-danger mt-2 mb-0">
                          {showError.eventdetail.eventname}
                        </p>
                      )}
                      <Form.Group controlId="eventTime" className="mt-3">
                        <Form.Label>
                          <strong>Event Time</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter event time"
                          value={eventdetail.date}
                          onChange={(e) =>
                            setEventDetail((prevData) => ({
                              ...prevData,
                              date: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                      {showError.eventdetail.eventdate != "" && (
                        <p className="text-danger mt-2 mb-0">
                          {showError.eventdetail.eventdate}
                        </p>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* WhatsApp Message Section */}
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="p-1 mb-4 shadow">
                  <Card.Body>
                    <h3>
                      Write WhatsApp Message{" "}
                      <span style={{ color: "red" }}>*</span>
                    </h3>
                    <p className="mt-0">
                      <strong>
                        ( Required only while sending whatsapp messages )
                      </strong>
                    </p>

                    <Form>
                      <Form.Group controlId="whatsappMessage">
                        <Form.Label>
                          <strong>WhatsApp Message</strong>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          style={{ resize: "none" }}
                          placeholder="Write your WhatsApp message"
                          value={whatsappMessage}
                          onChange={(e) => setWhatsappMessage(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                    {/* <br /> */}
                    <p className="text-muted mt-3">
                      <strong>Formatting Instructions:</strong>
                      <br />
                      <ul>
                        <li>
                          <strong>Bold:</strong> Enclose text with{" "}
                          <code>*</code> (e.g., <code>*bold text*</code>)
                        </li>
                        <li>
                          <strong>Italic:</strong> Enclose text with{" "}
                          <code>_</code> (e.g., <code>_italic text_</code>)
                        </li>
                        <li>
                          <strong>Strikethrough:</strong> Enclose text with{" "}
                          <code>~</code> (e.g.,{" "}
                          <code>~strikethrough text~</code>)
                        </li>
                        <li>
                          <strong>New Lines:</strong> Press <code>Enter</code>{" "}
                          to add a new line
                        </li>
                        <li>
                          <strong>Dynamic Data:</strong> Use{" "}
                          <code>{`{someword}`}</code> to insert dynamic content
                          (e.g., <code>{`{name}`}</code> will be replaced with
                          the receiver's name)
                        </li>
                      </ul>
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Email Message Section */}
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="p-1 mb-4 shadow">
                  <Card.Body>
                    <h3>
                      Write Email Message{" "}
                      <span style={{ color: "red" }}>*</span>
                    </h3>
                    <p className="mt-0">
                      <strong>( Required only while sending mails )</strong>
                    </p>
                    <Form>
                      <Form.Group controlId="emailMessage">
                        <Form.Label>Email Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter your email message"
                          // value={emailMessage}
                          // onChange={(e) => setEmailMessage(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="p-1 mb-4 shadow">
                  <Card.Body>
                    <h3>
                      Upload Excel File <span style={{ color: "red" }}>*</span>
                    </h3>
                    <br />
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept=".xlsx, .xls, .csv"
                    />
                    {showError.uploadfile != "" && (
                      <p className="text-danger mt-2 mb-0">
                        {showError.uploadfile}
                      </p>
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
          </>
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
