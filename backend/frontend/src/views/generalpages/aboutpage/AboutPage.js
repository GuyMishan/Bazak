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
import BazakComp from './BazakComp';
import Team100Comp from './Team100Comp';
function AboutPage({ match, theme }) {

  return (
    <>
      <BazakComp theme={theme}/>
      <Team100Comp theme={theme}/>
    </>
  );
}

export default withRouter(AboutPage);