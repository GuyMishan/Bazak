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

import UserInfoCardGeneral from './UserInfoCardGeneral';
import UserInfoCardPicture from './UserInfoCardPicture';
import UserInfoCardSigli from './UserInfoCardSigli';
import UserInfoCardExtra from './UserInfoCardExtra';
import UserInfoCardUserGrade from './UserInfoCardUserGrade';

function DashboardPage({ match }) {
  //user
  const [user, setUser] = useState(undefined)
  //user

  async function loaduser() {
    let tempuser = isAuthenticated();
    setUser(tempuser);
}

  function init() {
    loaduser();
  }

  useEffect(() => {
    init();
  }, [])

    return (
      user? 
        <div>
            {/* <Row>
                <Col xs={12} md={8}>
                <UserInfoCardGeneral user={user}/>

                <UserInfoCardSigli user={user}/>

                <UserInfoCardExtra user={user}/>
                </Col>

                <Col xs={12} md={4}>
                <UserInfoCardPicture user={user}/>

                <UserInfoCardUserGrade user={user}/>
                </Col>
            </Row> */}
        </div>:null
    );
}

export default withRouter(DashboardPage);