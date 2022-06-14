import React, { useState } from "react";

import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Modal,
  NavbarToggler,
  ModalHeader,
  Card,
  CardBody
} from "reactstrap";

import tenepic1 from "assets/img/tenepic1.jpg";
import tenepic2 from "assets/img/tenepic2.jpg";
import tenepic3 from "assets/img/tenepic3.jpg";
import tenepic4 from "assets/img/tenepic4.JPG";
import tenepic5 from "assets/img/tenepic5.JPG";
import tenepic6 from "assets/img/tenepic6.JPG";
import tenepic7 from "assets/img/tenepic7.JPG";
import tenepic8 from "assets/img/tenepic8.JPG";

const SegelMessage = (props) => {
  return (
    <div style={{ width: '90%',margin:'auto',paddingTop:'15px'}}>
      <Row>
        <Col xs='12' md='4'>
          <Card>
            <img src={tenepic1}></img>
            <CardBody>
              <h2 style={{ textAlign: 'center' }}>הודעות סגליות</h2>
            </CardBody>
          </Card>
        </Col>
        <Col xs='12' md='4'>
          <Card>
            <img src={tenepic2}></img>
            <CardBody>
              <h2 style={{ textAlign: 'center' }}>הודעות סגליות</h2>
            </CardBody>
          </Card>
        </Col>
        <Col xs='12' md='4'>
          <Card>
            <img src={tenepic3}></img>
            <CardBody>
              <h2 style={{ textAlign: 'center' }}>הודעות סגליות</h2>
            </CardBody>
          </Card>
        </Col>
        {/* <Col xs='12' md='3'>
        <Card>
          <img src={tenepic4} style={{ height: '180px' }}></img>
          <CardBody>
            <h2 style={{ textAlign: 'center' }}>הודעות סגליות</h2>
          </CardBody>
        </Card>
      </Col> */}
      </Row>
    </div>
  );
};

export default SegelMessage;