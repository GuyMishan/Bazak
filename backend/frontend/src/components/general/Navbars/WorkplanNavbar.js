import React, { useEffect, useState } from 'react';
// nodejs library that concatenates classes
import classNames from "classnames";
import { isAuthenticated } from '../../../auth/index';
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Modal,
  NavbarToggler,
  ModalHeader,
} from "reactstrap";

import ToggleDarkModeButton from './UserProfileDropdownMenu/ToggleDarkModeButton'

import { ThemeContext, themes } from "contexts/ThemeContext";

import Logoeged from 'assets/img/logotene2.png';

import UserProfileCircle from './UserProfileCircle/UserProfileCircle'

function WorkplanNavbar(props) {
  const [colorhr, setcolorhr] = useState("transparent");
  const [color, setcolor] = useState("transparent");
  const { user } = isAuthenticated()

  return (
    <>
      <ThemeContext.Consumer>
        {({ changeTheme, theme }) => (
          <>
            {theme == "white-content" ?
              setcolor("white")
              : setcolor("rgb(32 33 51)")}
            {theme == "white-content" ?
              setcolorhr("lightGray")
              : setcolorhr("white")}
            <Navbar style={{ display: 'block', height: '60px', backgroundColor: color,boxShadow:"none",top: '0',paddingBottom:'0px',marginRight:'60px',position: 'sticky'}}>
              <Row>
                <Col xs={12} md={4}>
                <UserProfileCircle fname={user.name} lname={user.lastname} bgcolor={color}/>
                  {/* <img src={Logoeged} height='50px'></img> */}
                </Col>
                <Col xs={12} md={4}>

                </Col>
                <Col xs={12} md={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* <ToggleDarkModeButton /> */}
                  <h3 style={{ fontWeight: 'bold', paddingLeft: '30px' }}> שלום, {user.name + ' ' + user.lastname}</h3>
                </Col>
              </Row>
            </Navbar>
            <hr style={{margin:'0px' , borderTop: `1px solid ${colorhr}`}}/>
          </>

        )}
      </ThemeContext.Consumer>
    </>
  );
}

export default WorkplanNavbar;
