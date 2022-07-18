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
import logobazakshort from "assets/img/logobazakshort.png";

function BazakComp({ match, theme }) {

  return (
    <div style={{ height: '500px' }}>
      <Row>
        <Col xs={12} md={4}>

        </Col>
        <Col xs={12} md={4} style={{ textAlign: 'center' }}>
          <img src={logobazakshort} height='200px' style={{ marginBottom: '10px' }}></img>
          <h1 style={{ fontWeight: 'bold', fontSize: '50px' }}>מערכת בז"כ</h1>
        </Col>
        <Col xs={12} md={4}>

        </Col>
      </Row>

      <Container>
        <div style={{ textAlign: 'center' }}>
          <h3>מערכת הבז"כ היא מערכת שמסייעת בניהול של נושא הזמינות והכשירות בצה"ל. המערכת מאפשרת קבלת החלטות ביצועיות שוטפות, ובכך משפרת את הפעילות והיעילות בצה"ל.
             המערכת משרתת את תחומי התכנון, קבלת ההחלטות, ניהול הפרויקט והתוצר, איתור חריגים והפיקוח על תהליכים מובנים אשר ניתן לבצע בצורה ממוחשבת.</h3>
        </div>
      </Container>
    </div>
  );
}

export default withRouter(BazakComp);