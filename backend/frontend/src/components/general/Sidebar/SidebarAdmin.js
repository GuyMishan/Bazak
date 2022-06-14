import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

// reactstrap components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";

import {
  BackgroundColorContext,
  backgroundColors,
} from "contexts/BackgroundColorContext";

import { ThemeContext, themes } from "contexts/ThemeContext";

import tafkidipedialogo from "assets/img/tafkidipedialogo.png";

import home from "assets/img/home3.png";
import home_white from "assets/img/home3_white.png";

import table from "assets/img/table.png";
import table_white from "assets/img/table_white.png";

import people from "assets/img/people.png";
import people_white from "assets/img/people_white.png";

import editusers from "assets/img/editusers.png";
import editusers_white from "assets/img/editusers_white.png";

import shortlist from "assets/img/shortlist.png";
import shortlist_white from "assets/img/shortlist_white.png";

import { signout } from "auth/index";
import history from "../../../history";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Alert,
  Spinner,
  Label,
  Col,
} from "reactstrap";

import { isAuthenticated } from "auth/index";

function SidebarAdmin(props) {

  const clickSubmit = (event) => {
    event.preventDefault();
    signout().then((response) => {
      history.push(`/signin`);
    });
  };

  return (
    <>
      <div className="logo">
        <img src={tafkidipedialogo}></img>
      </div>
      <Nav style={{ textAlign: "right" }}>
        <li>
          <NavLink to="/dashboard" style={{ margin: '0px' }} activeClassName="sidebar_active_link">
            <Row style={{ direction: "rtl" }}>
              <Col xs={12} md={3} style={{ paddingLeft: "0px", textAlign: 'center', alignSelf: 'center' }}>
                {props.theme == 'white' ? <img src={home} style={{ height: "20px" }}></img>
                  : <img src={home_white} style={{ height: "20px" }}></img>}
              </Col>
              <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
                <h4 style={{ margin: "0px", paddingTop: '6px', paddingBottom: '6px' }}>
                  דף הבית
                </h4>
              </Col>
            </Row>
          </NavLink>
        </li>
        <li>
          <NavLink to="/mahzorimpage" style={{ margin: '0px' }} activeClassName="sidebar_active_link">
            <Row style={{ direction: "rtl" }}>
              <Col xs={12} md={3} style={{ paddingLeft: "0px", textAlign: 'center', alignSelf: 'center' }}>
                {props.theme == 'white' ? <img src={table} style={{ height: "20px" }}></img>
                  : <img src={table_white} style={{ height: "20px" }}></img>}
              </Col>
              <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
                <h4 style={{ margin: "0px", paddingTop: '6px', paddingBottom: '6px' }}>
                  דיוני איוש
                </h4>
              </Col>
            </Row>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tafkidipedia" style={{ margin: '0px' }} activeClassName="sidebar_active_link">
            <Row style={{ direction: "rtl" }}>
              <Col xs={12} md={3} style={{ paddingLeft: "0px", textAlign: 'center', alignSelf: 'center' }}>
                {props.theme == 'white' ? <img src={people} style={{ height: "20px" }}></img>
                  : <img src={people_white} style={{ height: "20px" }}></img>}
              </Col>
              <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
                <h4 style={{ margin: "0px", paddingTop: '6px', paddingBottom: '6px' }}>
                  תפקידיפדיה
                </h4>
              </Col>
            </Row>
          </NavLink>
        </li>
        <li>
          <NavLink to="/manageusers" style={{ margin: '0px' }} activeClassName="sidebar_active_link">
            <Row style={{ direction: "rtl" }}>
              <Col xs={12} md={3} style={{ paddingLeft: "0px", textAlign: 'center', alignSelf: 'center' }}>
                {props.theme == 'white' ? <img src={editusers} style={{ height: "20px" }}></img>
                  : <img src={editusers_white} style={{ height: "20px" }}></img>}
              </Col>
              <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
                <h4 style={{ margin: "0px", paddingTop: '6px', paddingBottom: '6px' }}>
                  נתוני כח אדם
                </h4>
              </Col>
            </Row>
          </NavLink>
        </li>
        <li>
          <NavLink to="/managejobs" style={{ margin: '0px' }} activeClassName="sidebar_active_link">
            <Row style={{ direction: "rtl" }}>
              <Col xs={12} md={3} style={{ paddingLeft: "0px", textAlign: 'center', alignSelf: 'center' }}>
                {props.theme == 'white' ? <img src={shortlist} style={{ height: "20px" }}></img>
                  : <img src={shortlist_white} style={{ height: "20px" }}></img>}
              </Col>
              <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
                <h4 style={{ margin: "0px", paddingTop: '6px', paddingBottom: '6px' }}>
                  עריכת תפקידים
                </h4>
              </Col>
            </Row>
          </NavLink>
        </li>
      </Nav>
    </>
  );
}

export default SidebarAdmin;
