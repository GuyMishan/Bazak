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

function UserInfoCardExtra(props) {

    return (
        <Card>
            <CardHeader>
                <h2 style={{ textAlign: 'right', fontWeight: 'bold' }}>פרטים נוספים</h2>
            </CardHeader>
            <CardBody>
                <Container>
                    <Row>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>הצטיינות (תא"ל ומעלה): {props.user.taal_excellence ? props.user.taal_excellence : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>עיין תיק: {props.user.ayen_tik ? props.user.ayen_tik : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מצ"ח: {props.user.mezah ? props.user.mezah : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תלונות (3 שנים אחרונות): {props.user.tlunot ? props.user.tlunot : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תמריץ בשלוש שנים אחרונות: {props.user.tamriz ? props.user.tamriz : null}</h4>
                        </Col>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>ציון מ"ה: {props.user.tziun_mh ? props.user.tziun_mh : null}</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>סיווג: {props.user.sivug ? props.user.sivug : null}</h4>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardExtra);