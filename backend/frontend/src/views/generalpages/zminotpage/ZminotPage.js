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
  //flag - cuz theres a problem in sidbar nav
  const [flag, setFlag] = useState(false)

  async function init() {
    setFlag(true);
  }

  useEffect(() => {
    init();
  }, [match])

  useEffect(() => {
    if (flag)
      window.location.reload(true);
  }, [match])

  return (
    <>
      <CarDataByUnitTypeAndUnitIdSortingTable unittype={match.params.unittype} unitid={match.params.unitid} />     {/*spinner in table*/}
    </>
  );
}

export default withRouter(ZminotPage);