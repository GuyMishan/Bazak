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
  Modal,
  ModalBody
} from "reactstrap";
import axios from 'axios';
import { signin, authenticate, isAuthenticated } from 'auth/index';

import UserInfoCardGeneral from './UserInfoCardGeneral';
import UserInfoCardPicture from './UserInfoCardPicture';
import UserInfoCardSigli from './UserInfoCardSigli';
import UserInfoCardExtra from './UserInfoCardExtra';
import UserInfoCardUserGrade from './UserInfoCardUserGrade';

function ProfilePageModal(props) {
  //user
  const [user, setUser] = useState(undefined)
  //user

  async function loaduser() {
    let res = await axios.post(`http://localhost:8000/api/getuserbyid`, { userid: props.userid });
    let tempuser = res.data;
    setUser(tempuser)
  }

  function init() {
    loaduser()
  }

  useEffect(() => {
    if (props.userid != undefined)
      init();
  }, [props.userid])

  return (
    user ?
      <Modal
        style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
        isOpen={props.isOpen}
        centered
        fullscreen
        scrollable
        size=""
        toggle={props.Toggle}>
        <ModalBody>
          <Row>
            <Col xs={12} md={8}>
              <UserInfoCardGeneral user={user} />

              <UserInfoCardSigli user={user} />

              <UserInfoCardExtra user={user} />
            </Col>

            <Col xs={12} md={4}>
              <UserInfoCardPicture user={user} />

              <UserInfoCardUserGrade user={user}/>
            </Col>
          </Row>  </ModalBody>
      </Modal> : null
  );
}

export default withRouter(ProfilePageModal);