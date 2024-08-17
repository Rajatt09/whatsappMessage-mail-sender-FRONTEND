import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

const CustomNavbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/" className="logo">
          &nbsp; Optica
        </Navbar.Brand>
        <Navbar.Toggle
          className="sidebar-btn"
          aria-controls="basic-navbar-nav"
          onClick={toggleSidebar}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-none d-lg-flex">
            <Nav.Link className="nav-link-navbar" as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link className="nav-link-navbar" as={Link} to="/sent-status">
              Sent Status
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <button className="closebtn" onClick={toggleSidebar}>
          &times;
        </button>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/" onClick={toggleSidebar}>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/sent-status" onClick={toggleSidebar}>
            Sent Status
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default CustomNavbar;
