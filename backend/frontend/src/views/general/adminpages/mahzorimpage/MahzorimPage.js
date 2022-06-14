import React, { useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import { Link, withRouter, Redirect } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom'

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

import MahzorimSortingTable from 'components/tafkidipedia/MahzorimSortingTable/SortingTable'

function MahzorimPage() {

  return (
    <>
      <Container>
          <MahzorimSortingTable/>

          <Link to={`mahzorform/0`}><Button>הוסף דש"ב</Button></Link>
      </Container>
    </>
  );
}

export default withRouter(MahzorimPage);