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
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getCarDataFunc } from 'redux/features/cardata/cardataSlice'

function SubUnitsRecentFeeds({ match, theme }) {
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
      case 'general':
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

    setCardatas(myArrayFiltered2);
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
        <SortingTable theme={theme} match={match} unittype={match.params.unittype} unitid={match.params.unitid} cardatas={cardatas} />
      </div>
  );
}

export default withRouter(SubUnitsRecentFeeds);