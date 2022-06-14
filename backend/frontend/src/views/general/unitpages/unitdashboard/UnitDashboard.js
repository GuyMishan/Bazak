import React, { useState, useEffect, useRef } from 'react';
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

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
import axios from 'axios';

import UserCard from "components/general/DashboardCards/UserCard/UserCard";

import SegelMessage from "components/general/DashboardCards/UserCard/SegelMessage";

function UnitDashboard({ match }) {

  useEffect(() => {
    // init();
  }, [])

  return (
    <>
      <Container>
        <UserCard />
      </Container>

      <Container style={{ paddingTop: '2rem' }}>
        <SegelMessage />
      </Container>
    </>
  );
}

export default withRouter(UnitDashboard);