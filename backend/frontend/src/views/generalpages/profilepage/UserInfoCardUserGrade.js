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

import LiquidFillGauge from 'components/tafkidipedia/LiquidFillGauge/LiquidFillGauge';

function UserInfoCardUserGrade(props) {

    return (
        <Card>
            <CardBody>
                <div style={{overflowX:'auto'}}>
                    <Row style={{ direction: "rtl" ,width:'400px',margin:'auto'}}>
                        <Col xs={12} md={4} style={{ alignSelf: 'center', padding: '0px',width:'130px' }}>
                            <h5 style={{ textAlign: 'center', paddingTop: '10px' }}>ניקוד תפקידים צבור - הנדסי</h5>
                            <LiquidFillGauge style={{ margin: 'auto' }} radius={60} value={props.user.user_grade_handasi * 16.6} text={props.user.user_grade_handasi} color={'#7c99ac'} />
                        </Col>
                        <Col xs={12} md={4} style={{ alignSelf: 'center', padding: '0px',width:'130px' }}>
                            <h5 style={{ textAlign: 'center', paddingTop: '10px' }}>ניקוד תפקידים צבור - ניהולי</h5>
                            <LiquidFillGauge style={{ margin: 'auto' }} radius={60} value={props.user.user_grade_nihuli * 16.6} text={props.user.user_grade_nihuli} color={'#7c99ac'} />
                        </Col>
                        <Col xs={12} md={4} style={{ alignSelf: 'center', padding: '0px',width:'130px' }}>
                            <h5 style={{ textAlign: 'center', paddingTop: '10px' }}>ניקוד תפקידים צבור - פיקודי</h5>
                            <LiquidFillGauge style={{ margin: 'auto' }} radius={60} value={props.user.user_grade_pikudi * 16.6} text={props.user.user_grade_pikudi} color={'#7c99ac'} />
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardUserGrade);