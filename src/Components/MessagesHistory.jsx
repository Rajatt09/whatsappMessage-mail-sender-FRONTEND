import React, { useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Spinner,
  Accordion,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { CheckCircleFill, Trash, XCircleFill } from "react-bootstrap-icons";
import "./MessagesHistory.css";

const MessagesHistory = ({ history, loading, error, onDelete }) => {
  const [searchTerms, setSearchTerms] = useState({});

  // Group by eventName and eventDate
  const groupedHistory = history.reduce((acc, record) => {
    const { eventName, eventDate } = record;
    if (!acc[eventName]) {
      acc[eventName] = {};
    }
    if (!acc[eventName][eventDate]) {
      acc[eventName][eventDate] = [];
    }
    acc[eventName][eventDate].push(record);

    return acc;
  }, {});

  // Handle search term change for individual events
  const handleSearchChange = (eventName, eventDate, e) => {
    setSearchTerms({
      ...searchTerms,
      [`${eventName}-${eventDate}`]: e.target.value,
    });
  };

  // Function to check if a record matches the search term
  const matchesSearchTerm = (record, term) => {
    const lowerTerm = term.toLowerCase();
    return (
      (record.name && record.name.toLowerCase().includes(lowerTerm)) ||
      (record.email && record.email.toLowerCase().includes(lowerTerm)) ||
      (record.phoneNo && record.phoneNo.toLowerCase().includes(lowerTerm))
    );
  };

  const handleDelete = (eventName, eventDate) => {
    if (
      window.confirm(
        `Are you sure you want to delete all records for "${eventName}" on "${eventDate}"?`
      )
    ) {
      onDelete(eventName, eventDate); // Call the function passed as a prop
    }
  };

  return (
    <Container fluid className="py-2">
      <Row className="justify-content-center">
        <Col md={12} style={{ textAlign: "center" }}>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : (
            <>
              <Accordion
                style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
              >
                {Object.keys(groupedHistory).length > 0 ? (
                  Object.keys(groupedHistory).map((eventName, eventIndex) => (
                    <div key={eventIndex}>
                      <Accordion.Header
                        as={Card.Header}
                        eventKey={eventName}
                        style={{
                          cursor: "pointer",
                          border: "4px solid #f8f9fa",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "10px",
                        }}
                      >
                        <div>
                          <h5>
                            {eventName == "undefined"
                              ? "Unknown Event"
                              : eventName}
                          </h5>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body eventKey={eventName}>
                        {Object.keys(groupedHistory[eventName]).length > 0 ? (
                          Object.keys(groupedHistory[eventName]).map(
                            (eventDate, dateIndex) => {
                              const filteredRecords = groupedHistory[eventName][
                                eventDate
                              ].filter((record) =>
                                matchesSearchTerm(
                                  record,
                                  searchTerms[`${eventName}-${eventDate}`] || ""
                                )
                              );
                              return (
                                <div key={dateIndex}>
                                  <Form className="mb-2 d-flex align-items-center">
                                    <Form.Control
                                      type="text"
                                      placeholder={`Search for name, email or phone`}
                                      value={
                                        searchTerms[
                                          `${eventName}-${eventDate}`
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleSearchChange(
                                          eventName,
                                          eventDate,
                                          e
                                        )
                                      }
                                    />
                                    <Button
                                      variant="danger"
                                      className="ms-2"
                                      onClick={() =>
                                        handleDelete(eventName, eventDate)
                                      }
                                    >
                                      <Trash />
                                    </Button>
                                  </Form>

                                  <h6
                                    style={{
                                      textAlign: "left",
                                      marginTop: "20px",
                                    }}
                                  >
                                    <strong>
                                      Time:{" "}
                                      {eventDate == "undefined"
                                        ? "Not Available"
                                        : eventDate}
                                    </strong>
                                  </h6>
                                  <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Email Status</th>
                                        <th>WhatsApp Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filteredRecords.length > 0 ? (
                                        filteredRecords.map((record, index) => (
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{record.name || "N/A"}</td>
                                            <td>{record.email || "N/A"}</td>
                                            <td>{record.phoneNo || "N/A"}</td>
                                            <td style={{ textAlign: "center" }}>
                                              {record.emailSend ? (
                                                <CheckCircleFill color="green" />
                                              ) : (
                                                <XCircleFill color="red" />
                                              )}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                              {record.whatsappSend ? (
                                                <CheckCircleFill color="green" />
                                              ) : (
                                                <XCircleFill color="red" />
                                              )}
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan="6"
                                            className="text-center"
                                          >
                                            No records available.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <p className="text-center">No events available.</p>
                        )}
                      </Accordion.Body>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No records available.</p>
                )}
              </Accordion>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MessagesHistory;
