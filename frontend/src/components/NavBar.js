import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import logo from '../assets/logos/brunel.png'
class NavBar extends Component {
    render() {
        return (
            <div>
                <Navbar bg="light" variant="light" expand="lg">
                    <Navbar.Brand href="#home"> <img
                        src="https://www.brunel.ac.uk/SiteElements/images/brunel-logo-blue.png"
                        height="30"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />Brunel CDEPS IOT</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                     <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="https://iot.jasonpraful.co.uk/android_app.apk">ANDROID APP</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavBar;