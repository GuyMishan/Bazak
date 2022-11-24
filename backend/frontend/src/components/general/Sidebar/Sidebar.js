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
import SidebarGdod from 'components/general/Sidebar/SidebarGdod';
import SidebarHativa from 'components/general/Sidebar/SidebarHativa';
import SidebarOgda from 'components/general/Sidebar/SidebarOgda';
import SidebarPikod from 'components/general/Sidebar/SidebarPikod';
import { signout } from "auth/index";
//
import ModularScreensModal from 'components/bazak/ModularScreensModals/ModularScreensModal/ModularScreensModal';

function Sidebar() {
  const [color, setcolor] = useState("transparent");
  const { user } = isAuthenticated()
  //modularscreens modal
  const [ismodularscreensmodalopen, setIsmodularscreensmodalopen] = useState(false);
  
  const clickSubmit = (event) => {
    event.preventDefault();
    if(user.role === "0"){
        signout().then((response) => {
            history.push(`/adminsignin`);
        });
    }
    else{
      history.push(`/signupotherusers`);
    }
  };

  function Togglemodularscreensmodal(evt) {
    setIsmodularscreensmodalopen(!ismodularscreensmodalopen);
  }

  return (
    <>
      <ModularScreensModal isOpen={ismodularscreensmodalopen} Toggle={Togglemodularscreensmodal} user={user} />

      <ThemeContext.Consumer>
        {({ changeTheme, theme }) => (
          theme == "white-content" ?
            setcolor("white")
            : setcolor("rgb(32 33 51)")
        )}
      </ThemeContext.Consumer>

      <div className="sidebar" style={{ background: color, marginTop: '60px', boxShadow: 'none', borderRadius: '0px', borderLeft: '1px solid lightgray' }}>
        <div className="sidebar-wrapper" style={{ overflow: 'hidden' }}>
          {user.role === "0" ? <SidebarAdmin theme={color} Togglemodularscreensmodal={Togglemodularscreensmodal}/> :

            user.role === "1" ? <SidebarGdod theme={color} Togglemodularscreensmodal={Togglemodularscreensmodal}/> :

              user.role === "2" ? <SidebarHativa theme={color} Togglemodularscreensmodal={Togglemodularscreensmodal}/> :

                user.role === "3" ? <SidebarOgda theme={color} Togglemodularscreensmodal={Togglemodularscreensmodal}/> :

                  user.role === "4" ? <SidebarPikod theme={color} Togglemodularscreensmodal={Togglemodularscreensmodal}/> : null
          }
          <div style={{ textAlign: 'center', position: 'absolute', bottom: 0, width: '100%', marginBottom: '15px' }}>
            {color == 'white' ? <img src={Logo100} style={{ height: "100px" }}></img>
              : <img src={Logo100_white} style={{ height: "100px" }}></img>}
            {user.role === "0" ?
              <button
                onClick={clickSubmit}
                className="btn-new-blue"
                style={{ width: '80%', marginTop: '15px' }}
              >
                התנתק
              </button>
              :
              <button
                onClick={clickSubmit}
                className="btn-new-blue"
                style={{ width: '80%', marginTop: '15px' }}
              >
                 רשום משתמש נוסף
              </button>
              }
            <a href="http://216.1.1.11:8008/presentation">
              <button
                className="btn-new-delete"
                style={{ width: '80%', marginTop: '15px' }}
              >
                חזרה לשולחן הטנ"א שלי
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default Sidebar;
