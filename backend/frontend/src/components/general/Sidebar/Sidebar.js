import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";

// reactstrap components
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap';

import {
  BackgroundColorContext,
  backgroundColors,
} from "contexts/BackgroundColorContext";

import { ThemeContext, themes } from "contexts/ThemeContext";

import history from '../../../history'

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
  Col
} from "reactstrap";

import { signin, authenticate, isAuthenticated } from 'auth/index';
import Logo100 from 'assets/img/team100.png';
import Logo100_white from 'assets/img/team100_white.png';

import SidebarAdmin from 'components/general/Sidebar/SidebarAdmin';
import SidebarUnit from 'components/general/Sidebar/SidebarUnit';
import SidebarCandidate from 'components/general/Sidebar/SidebarCandidate';

import { signout } from "auth/index";

function Sidebar() {

  const clickSubmit = (event) => {
    event.preventDefault();
    signout().then((response) => {
      history.push(`/signin`);
    });
  };

  const [color, setcolor] = useState("transparent");
  const { user } = isAuthenticated()

  return (
    <>
      <ThemeContext.Consumer>
        {({ changeTheme, theme }) => (
          theme == "white-content" ?
            setcolor("white")
            : setcolor("rgb(32 33 51)")
        )}
      </ThemeContext.Consumer>

      <div className="sidebar" style={{ background: color, marginTop: '60px', boxShadow: 'none', borderRadius: '0px', borderLeft: '1px solid lightgray' }}>
        <div className="sidebar-wrapper" style={{ overflow: 'hidden' }}>
          {user.role === "0" ? <SidebarAdmin theme={color} /> :

            user.role === "1" ? <SidebarUnit theme={color} /> :

              user.role === "2" ? <SidebarCandidate theme={color} /> : null
          }
          <div style={{ textAlign: 'center', position: 'absolute', bottom: 0, width: '100%', marginBottom: '15px' }}>
          {color == 'white' ? <img src={Logo100} style={{ height: "100px" }}></img>
                  : <img src={Logo100_white} style={{ height: "100px" }}></img>}
            <Button
              onClick={clickSubmit}
              className="btn"
              style={{ width: '80%' ,marginTop:'15px' }}
            >
              התנתק
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Sidebar;
