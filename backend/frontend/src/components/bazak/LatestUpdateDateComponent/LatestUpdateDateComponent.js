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

function LatestUpdateDateComponent(props) {
  const [date, setDate] = useState("");

  function init() {
    let maxdate = new Date(1900, 10, 10);
    for (let i = 0; i < props.cardatas.length; i++) {
      if (new Date(props.cardatas[i].updatedAt) > maxdate) {
        maxdate = new Date(props.cardatas[i].updatedAt);
      }
    }
    setDate(maxdate.toISOString().slice(0, 10).split("-").reverse().join("/"));
  }

  // useEffect(() => {
  //   if (props.cardatas.length > 0)
  //     init();
  // }, [props.cardatas])

  useEffect(() => {
    if (props.isdataloaded == true)
      init();
  }, [props.isdataloaded,props.cardatas])

  return (
    <div>
      <h3 style={{margin:'0px'}}>תאריך עדכון אחרון : {date}</h3>
    </div>
  );
}

export default withRouter(LatestUpdateDateComponent);