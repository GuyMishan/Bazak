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

import ZminotDashboardCard from './Zminot_DashboardCard';
import InTipul_DashboardCard from './InTipul_DashboardCard';
import Tipul_Exceptions_DashboardCard from './Tipul_Exceptions_DashboardCard';
import Hh_DashboardCard from './Hh_DashboardCard';
import Takalot_DashboardCard from './Takalot_DashboardCard';
import Zminot_Tanks_DashboardCard from './Zminot_Tanks_DashboardCard';
import Zminot_Logistic_DashboardCard from './Zminot_Logistic_DashboardCard';
import Zminot_Power_Multiplier_DashboardCard from './Zminot_Power_Multiplier_DashboardCard';
import Zminot_Cars_DashboardCard from './Zminot_Cars_DashboardCard';

function DashboardPage({ match }) {
  //user
  const [user, setUser] = useState(undefined)
  //user
  //cardatas
  const [cardatas, setCardatas] = useState([])
  //cardatas

  async function loaduser() {
    let tempuser = isAuthenticated();
    setUser(tempuser);
  }

  function init() {
    loaduser();
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
  }, [])

  useEffect(() => {
    getCardDataByUnitTypeAndUnitId();
  }, [user])

  return (
    user ?
      <div>
        <Row>
          <Col xs={12} md={3}>
            <ZminotDashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <InTipul_DashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <Tipul_Exceptions_DashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <div style={{ textAlign: 'center' }}>
              <h3>תאריך עדכון אחרון : 14.06.2022</h3>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={3}>
            <Hh_DashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <Takalot_DashboardCard cardatas={cardatas}/>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={3}>
            <Zminot_Tanks_DashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <Zminot_Logistic_DashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <Zminot_Power_Multiplier_DashboardCard cardatas={cardatas}/>
          </Col>
          <Col xs={12} md={3}>
            <Zminot_Cars_DashboardCard cardatas={cardatas}/>
          </Col>
        </Row>

        <Link to={`/zminotpage/${match.params.unittype}/${match.params.unitid}`}><Button>טבלת זמינות</Button></Link>
      </div> : null
  );
}

export default withRouter(DashboardPage);