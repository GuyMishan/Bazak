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

function UserInfoCardGeneral(props) {

    return (
        <Card>
            <CardHeader>
                <h2 style={{ textAlign: 'right', fontWeight: 'bold' }}>פרטים אישיים</h2>
            </CardHeader>
            <CardBody>
                <Container>
                    <Row>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>גיל: {props.user.birthdate ? (new Date().getFullYear()-new Date(props.user.birthdate).getFullYear()) + " שנים": null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מגורים: {props.user.residence ? props.user.residence : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מצב משפחתי: {props.user.marital_status ? props.user.marital_status : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>השכלה: {props.user.education ? props.user.education : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תת"ש נוכחי: {props.user.curr_tatash ? props.user.curr_tatash.slice(0, 10).split("-").reverse().join("/") : null}</h4>
                        </Col>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>וותק בדרגה: {props.user.promotion_date ? (new Date().getFullYear()-new Date(props.user.promotion_date).getFullYear()) + " שנים": null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>וותק בקבע: {props.user.keva_entry ? (new Date().getFullYear()-new Date(props.user.keva_entry).getFullYear()) + " שנים" : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מודל שירות: {props.user.service_model ? props.user.service_model : null}</h4>
                            {/* <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תנועה 2022:</h4> */}
                        </Col>
                    </Row>

                </Container>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardGeneral);