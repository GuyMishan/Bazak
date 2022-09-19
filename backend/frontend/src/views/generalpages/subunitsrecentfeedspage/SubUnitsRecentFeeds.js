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

import SortingTable from 'components/bazak/SubUnitsRecentFeedsSortingTable/SortingTable';

function SubUnitsRecentFeeds({ match, theme }) {
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
        <SortingTable theme={theme} match={match} unittype={match.params.unittype} unitid={match.params.unitid} cardatas={cardatas} />
      </div>
  );
}

export default withRouter(SubUnitsRecentFeeds);