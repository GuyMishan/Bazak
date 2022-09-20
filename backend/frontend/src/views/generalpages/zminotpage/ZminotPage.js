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
import axios from 'axios';
import { signin, authenticate, isAuthenticated } from 'auth/index';

import CarDataByUnitTypeAndUnitIdSortingTable from 'components/bazak/CarDataByUnitTypeAndUnitIdSortingTable/SortingTable';

function ZminotPage({ match }) {

  return (
    <>
      <CarDataByUnitTypeAndUnitIdSortingTable unittype={match.params.unittype} unitid={match.params.unitid} cartype={match.params.cartype} carid={match.params.carid} ismushbat={match.params.ismushbat} />     {/*spinner in table*/}
    </>
  );
}

export default withRouter(ZminotPage);