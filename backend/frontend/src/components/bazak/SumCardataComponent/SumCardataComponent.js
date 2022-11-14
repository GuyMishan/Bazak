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

function SumCardataComponent(props) {
  const [SumCarData, setSumCarData] = useState("");

  function init() {
    setSumCarData(props.cardatas.length);
  }

  // useEffect(() => {
  //   if (props.cardatas.length > 0)
  //     init();
  // }, [props.cardatas])

  useEffect(() => {
    if (props.isdataloaded == true)
      init();
  }, [props.isdataloaded, props.cardatas])

  return (
    <div>
      <h3 style={{ margin: '0px' }}>סה"כ צ': {SumCarData}</h3>
    </div>
  );
}

export default withRouter(SumCardataComponent);
