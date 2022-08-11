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

import DashboardCard from './DashboardCard';
import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';

function DashboardPage({ match, theme }) {
  //cardatas
  const [cardatas, setCardatas] = useState([])
  const [cartypes, setCartypes] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);

  async function init() {
    setIsdataloaded(false);
    await getCardDataByUnitTypeAndUnitId();
    switch (match.params.cartype) {
      case 'magadal':
        await getMagadals();
        break;
      case 'magad':
        await getMagads(match.params.carid);
        break;
      case 'mkabaz':
        await getMkabazs(match.params.carid);
        break;
      default:
        await getMagadals();
        break;
    }
    // setFlag(true);
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
        setCartypes(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const getMagads = async (magadalid) => {
    let tempmagadalsmagads = [];
    if (magadalid != undefined) {
      await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++)
            tempmagadalsmagads.push(response.data[j])
        })
        .catch((error) => {
          console.log(error);
        })
      setCartypes(tempmagadalsmagads);
    }
  }

  const getMkabazs = async (magadid) => {
    let tempmagadmkabazs = [];
    if (magadid != undefined) {
      await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++)
            tempmagadmkabazs.push(response.data[j])
        })
        .catch((error) => {
          console.log(error);
        })
      setCartypes(tempmagadmkabazs);
    }
  }

  useEffect(() => {
    init();
  }, [match])

  return (
    !isdataloaded ?
      <div style={{ width: '50%', marginTop: '30%' }}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
      <div>
        <Row>
          {cartypes.map((cartype, i) => (
            cartype ?
              <DashboardCard theme={theme} match={match} cartype={cartype} cardatas={cardatas} />
              : null))}
        </Row>
        <Row>
          <Col xs={12} md={3} style={{ textAlign: 'right' }}>
            <LatestUpdateDateComponent cardatas={cardatas} />
          </Col>
          <Col xs={12} md={6}>
          </Col>
          <Col xs={12} md={3}>
            <Link to={`/zminotpage/${match.params.unittype}/${match.params.unitid}/false`}><button className='btn-new-blue'>טבלת זמינות</button></Link>
          </Col>
        </Row>
      </div>
  );
}

export default withRouter(DashboardPage);