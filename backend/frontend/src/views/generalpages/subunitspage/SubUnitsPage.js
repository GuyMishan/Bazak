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
import Zminot_SortingTable from 'components/bazak/Zminot_SubUnitsCarDatasByUnitTypeAndUnitIdSortingTable/SortingTable';
import Kshirot_SortingTable from 'components/bazak/Kshirot_SubUnitsCarDatasByUnitTypeAndUnitIdSortingTable/SortingTable';

function SubUnitsPage({ match, theme }) {
  //flag - cuz theres a problem in sidbar nav
  const [flag, setFlag] = useState(false)
  //cardatas
  const [cardatas, setCardatas] = useState([])
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);

  async function init() {
    await getCardDataByUnitTypeAndUnitId();
    setFlag(true);
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

  useEffect(() => {
    if (flag)
      window.location.reload(true);
  }, [match])

  return (
    cardatas.length == 0 && !isdataloaded ?
      <div style={{ width: '50%', marginTop: '30%' }}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
      <div>
        <Row>
          {theme == "white-content" ?
            <Zminot_SortingTable unittype={match.params.unittype} unitid={match.params.unitid} />
            : <Kshirot_SortingTable unittype={match.params.unittype} unitid={match.params.unitid} />}
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

export default withRouter(SubUnitsPage);