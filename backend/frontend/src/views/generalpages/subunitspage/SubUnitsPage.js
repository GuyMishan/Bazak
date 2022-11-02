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

import RamamSortingTable from 'components/bazak/RamamSortingTable/SortingTable';
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getCarDataFunc } from 'redux/features/cardata/cardataSlice'

function SubUnitsPage({ match, theme }) {
  //user
  const { user } = isAuthenticated()
  //cardatas
  const [cardatas, setCardatas] = useState([])
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //redux
  const dispatch = useDispatch()
  const reduxcardata = useSelector((state) => state.cardata.value)

  async function init() {
    setIsdataloaded(false);
    filterreduxcardata();
  }

  const getReduxCardDataByUnitTypeAndUnitId = async () => {
    if(reduxcardata.length==0){
      await dispatch(getCarDataFunc(user));
    }
    setIsdataloaded(true)
  }

  const filterreduxcardata = async () => {
    let myArrayFiltered1 = []; //filter cartype

    switch (match.params.cartype) {
      case 'magadal':
        myArrayFiltered1 = reduxcardata;
        break;
      case 'magad':
        myArrayFiltered1 = reduxcardata.filter((el) => {
          return match.params.carid === el.magadal;
        });
        break;
      case 'mkabaz':
        myArrayFiltered1 = reduxcardata.filter((el) => {
          return match.params.carid === el.magad;
        });
        break;
    }

    let myArrayFiltered2 = []; //filter cartype

    switch (match.params.unittype) {
      case 'admin':
        myArrayFiltered2 = myArrayFiltered1;
        break;
      case 'pikod':
        myArrayFiltered2 = myArrayFiltered1.filter((el) => {
          return match.params.unitid === el.pikod;
        });
        break;
      case 'ogda':
        myArrayFiltered2 = myArrayFiltered1.filter((el) => {
          return match.params.unitid === el.ogda;
        });
        break;
      case 'hativa':
        myArrayFiltered2 = myArrayFiltered1.filter((el) => {
          return match.params.unitid === el.hativa;
        });
        break;
      case 'gdod':
        myArrayFiltered2 = myArrayFiltered1.filter((el) => {
          return match.params.unitid === el.gdod;
        });
        break;
    }

    let myArrayFiltered3 = []; //filter ismushbat

    myArrayFiltered3 = myArrayFiltered2.filter((el) => {
      return 'מושבת' != el.status;
    });

    setCardatas(myArrayFiltered3);
    setIsdataloaded(true);
  }

  useEffect(() => {
    if (reduxcardata.length > 0) {
      init();
    }
  }, [match]);

  useEffect(() => {
    if (reduxcardata.length > 0 && isdataloaded == false) {
      init();
    }
  }, [reduxcardata]);

  useEffect(() => {
    getReduxCardDataByUnitTypeAndUnitId();
  }, [])

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
          <RamamSortingTable theme={theme} match={match} unittype={match.params.unittype} unitid={match.params.unitid} />
        </Row>
        <Row>
          <Col xs={12} md={3} style={{ textAlign: 'right' }}>
            <LatestUpdateDateComponent cardatas={cardatas} isdataloaded={isdataloaded} />
          </Col>
          <Col xs={12} md={6}>
          </Col>
          <Col xs={12} md={3}>
            <Link to={`/zminotpage/${match.params.unittype}/${match.params.unitid}/${match.params.cartype}/${match.params.carid}/false/false`}><button className='btn-new-blue'>טבלת זמינות</button></Link>
          </Col>
        </Row>
      </div>
  );
}

export default withRouter(SubUnitsPage);