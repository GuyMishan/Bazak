import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Container,
  Col,
  Collapse,
} from "reactstrap";
import Logo100 from 'assets/img/team100.png';
import Logo100_white from 'assets/img/team100_white.png';

function Team100Comp({ match, theme }) {

  return (
    <div style={{ height: '450px' }}>
      <Row>
        <Col xs={12} md={4}>

        </Col>
        <Col xs={12} md={4} style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'bold', fontSize: '40px', marginBottom: '5px' }}>המערכת פותחה ע"י</h1>
          {theme == 'white-content' ? <img src={Logo100} style={{ height: "200px",marginBottom:'15px'}}></img>
              : <img src={Logo100_white} style={{ height: "200px",marginBottom:'15px'}}></img>}
        </Col>
        <Col xs={12} md={4}>

        </Col>
      </Row>

      <Container>
        <div style={{ textAlign: 'center' }}>
          <h3>צוות מא"ה הוא צוות שעוסק בפיתוח מערכות מידע במפקדת קצין הטכנולוגיה והאחזקה הראשי.
          הצוות ממוקם במדור מערכות מידע בענף תו"ן ומפתח מערכות ייעודיות לחיל הטכנולוגיה והאחזקה בסביבת הWeb.
          </h3>
        </div>
      </Container>
    </div>
  );
}

export default withRouter(Team100Comp);