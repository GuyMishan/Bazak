
import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { isAuthenticated } from '../../../../auth/index';
import {
    Card,
    CardText,
    CardBody,
    CardLink,
    CardTitle,
    Container,
    Row,
    Col,
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
} from "reactstrap";
import { ThemeContext, themes } from "contexts/ThemeContext";

import history from "../../../../history";

import soldier from "assets/img/soldier.png";
import tafkidipediashortlogo from "assets/img/tafkidipedialogo3.png";

import UserCarousel from "./UserCarousel"

const signout = (event) => {
    event.preventDefault();
    signout().then((response) => {

        history.push(`/signin`);
    });
};

const UserCard = (props) => {
    const { user } = isAuthenticated()
    const [value, onChange] = useState(new Date());

    return (
        <Card style={{ borderRadius: '40px', boxShadow: "0 1px 10px 0 rgb(0 0 0 / 10%), 0 1px 10px 0 rgb(0 0 0 / 15%)", marginBottom: '10px' }}>
            <CardBody style={{ padding: "0px" }}>
                <Row style={{ margin: 'auto' }}>
                    {/* <Col lg="3" style={{ padding: "0px", direction: 'ltr' }}>
                        <div>

                        </div>
                    </Col> */}
                    <Col lg="12" style={{ padding: "0px", direction: 'ltr' }}>
                        <div /*style={{ filter: 'brightness(50%)' }}*/>
                            <UserCarousel />
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default UserCard;