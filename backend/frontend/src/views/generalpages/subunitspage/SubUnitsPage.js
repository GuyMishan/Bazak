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

import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';
import SortingTable from 'components/bazak/SubUnitsCarDatasByUnitTypeAndUnitIdSortingTable/SortingTable';

function SubUnitsPage({ match }) {
  //flag - cuz theres a problem in sidbar nav
  const [flag, setFlag] = useState(false)
  //cardatas
  const [cardatas, setCardatas] = useState([])

  async function init() {
    await getCardDataByUnitTypeAndUnitId();
    setFlag(true);
  }

  const getCardDataByUnitTypeAndUnitId = async () => {
    await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${match.params.unittype}/${match.params.unitid}`)
      .then(response => {
        setCardatas(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    init();
  }, [match])

  useEffect(() => {
    if (flag)
      window.location.reload(true);
  }, [match])

  return (
    <div>
      <Row>
        <SortingTable unittype={match.params.unittype} unitid={match.params.unitid} />
      </Row>
      <Row>
        <Col xs={12} md={3} style={{ textAlign: 'right' }}>
          <LatestUpdateDateComponent cardatas={cardatas} />
        </Col>
        <Col xs={12} md={6}>
        </Col>
        <Col xs={12} md={3}>
          <Link to={`/zminotpage/${match.params.unittype}/${match.params.unitid}`}><Button>טבלת זמינות</Button></Link>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(SubUnitsPage);