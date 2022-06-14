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

function ProfilePage({ match }) {
  //user
  const [user, setUser] = useState(undefined)
  //user

  async function loaduser() {
    let res = await axios.post(`http://localhost:8000/api/smartgetuserbyid`,{userid:match.params.userid});
    let tempuser = res.data;
    setUser(tempuser)
}

  function init() {
    loaduser()
  }

  useEffect(() => {
    init();
  }, [])

    return (
      user? 
        <div>
            <Row>
                <Col xs={12} md={8}>
                <UserInfoCardGeneral user={user}/>

                <UserInfoCardSigli user={user}/>

                <UserInfoCardExtra user={user}/>
                </Col>

                <Col xs={12} md={4}>
                <UserInfoCardPicture user={user}/>

                <UserInfoCardUserGrade user={user}/>
                </Col>
            </Row>
        </div>:null
    );
}

export default withRouter(ProfilePage);