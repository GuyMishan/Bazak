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
import PropagateLoader from "react-spinners/PropagateLoader";

import Zminot_Magadal_DashboardCard from './Zminot_Magadal_DashboardCard';
import Kshirot_Magadal_DashboardCard from './Kshirot_Magadal_DashboardCard';
import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';

function DashboardPage({ match, theme }) {
  //flag - cuz theres a problem in sidbar nav
  const [flag, setFlag] = useState(false)
  //cardatas
  const [cardatas, setCardatas] = useState([])
  const [magadals, setMagadals] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  
  async function init() {
    await getCardDataByUnitTypeAndUnitId();
    await getMagadals();
    setFlag(true);
  }

  const getCardDataByUnitTypeAndUnitId = async () => {
    await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${match.params.unittype}/${match.params.unitid}`)
      .then(response => {
        setCardatas(response.data)
        setIsdataloaded(true)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const getMagadals = async () => {
    await axios.get(`http://localhost:8000/api/magadal`)
      .then(response => {
        setMagadals(response.data)
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
    cardatas.length == 0 && !isdataloaded ?
      <div style={{ width: '50%',marginTop:'30%'}}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
      <div>
        <Row>
          {theme == "white-content" ?
            magadals.map((magadal, i) => (
              magadal ?
                <Zminot_Magadal_DashboardCard magadal={magadal} cardatas={cardatas} />
                : null
            )) : magadals.map((magadal, i) => (
              magadal ?
                <Kshirot_Magadal_DashboardCard magadal={magadal} cardatas={cardatas} />
                : null
            ))}
        </Row>
        <Row>
          <Col xs={12} md={3} style={{ textAlign: 'right' }}>
            <LatestUpdateDateComponent cardatas={cardatas} />
          </Col>
          <Col xs={12} md={6}>
          </Col>
          <Col xs={12} md={3}>
            <Link to={`/zminotpage/${match.params.unittype}/${match.params.unitid}`}><button className='btn-new-blue'>טבלת זמינות</button></Link>
          </Col>
        </Row>
      </div>
  );
}

export default withRouter(DashboardPage);