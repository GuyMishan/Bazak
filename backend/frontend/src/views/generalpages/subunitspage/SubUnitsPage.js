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

import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';
import SortingTable from 'components/bazak/SubUnitsCarDataSortingTable/SortingTable';

function SubUnitsPage({ match, theme }) {
  //cardatas
  const [cardatas, setCardatas] = useState([])
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);

  async function init() {
    setIsdataloaded(false);
    await getCardDataByUnitTypeAndUnitId();
  }

  const getCardDataByUnitTypeAndUnitId = async () => {
    await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${match.params.unittype}/${match.params.unitid}`)
      .then(response => {
        setCardatas(response.data);
        setIsdataloaded(true);
      })
      .catch((error) => {
        console.log(error);
      })
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
          <SortingTable theme={theme} match={match} unittype={match.params.unittype} unitid={match.params.unitid} cardatas={cardatas} />
        </Row>
        <Row>
          <Col xs={12} md={3} style={{ textAlign: 'right' }}>
            <LatestUpdateDateComponent cardatas={cardatas} isdataloaded={isdataloaded}/>
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

export default withRouter(SubUnitsPage);