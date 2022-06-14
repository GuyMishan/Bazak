import React, { useState, useEffect, useRef } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import axios from "axios";
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import { Modal, Button } from "reactstrap";
import Container from "reactstrap/lib/Container";

const SettingModal = ({ isOpen, children,title }) => {
  return (
    <>
      <Modal isOpen={isOpen}>
        <Container>
          <h2 style={{margin:'0px',textAlign:'center',fontWeight:'bold'}}>{title}</h2>
          {children}
        </Container>
      </Modal>
    </>
  );
};

export default withRouter(SettingModal);
