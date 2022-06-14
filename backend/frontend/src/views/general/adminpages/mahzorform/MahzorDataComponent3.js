import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
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
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";

import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import SettingModal from "../../../../components/general/modal/SettingModal";

const MahzorDataComponent3 = (props) => {

    const [isdisabledfield, setIsdisabledfield] = useState(true)

    function init() {

    }

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        if (props.mahzordata.status == 1 || props.mahzordata.status == '1') {
            setIsdisabledfield(false)
        }
        else {
            setIsdisabledfield(true)
        }
    }, [props.mahzordata.status])

    return (
        <Card>
            <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס דש"ב</CardTitle>{/*headline*/}
            </CardHeader>
            <CardBody style={{ direction: 'rtl' }}>
                <Container>
                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>פרטים כלליים</h5>
                    <Row>
                        <Col xs={12} md={6}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>אוכלוסייה</div>
                            <FormGroup dir="rtl" >
                                <Input type="select" name="population" value={props.mahzordata.population} onChange={props.handleChangeMahzorData} disabled={isdisabledfield}>
                                    <option value={"בחר"}>{"בחר"}</option>
                                    {props.population.map((population, index) => (
                                        <option key={index} value={population._id}>{population.name}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={6}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>עונת איוש</div>
                            <FormGroup dir="rtl" >
                                <Input type="month" name="season" value={props.mahzordata.season} onChange={props.handleChangeMahzorData} disabled={isdisabledfield}></Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>כמות בחירות תפקיד (למועמד)</div>
                            <FormGroup dir="rtl" >
                                <Input type="number" name="numberofjobpicks" value={props.mahzordata.numberofjobpicks} onChange={props.handleChangeMahzorData} disabled={isdisabledfield}></Input>
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={6}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>שלב (אין לחזור לשלב קודם)</div>
                            <FormGroup dir="rtl" >
                                <Input type="select" name="status" value={props.mahzordata.status} onChange={props.handleChangeMahzorData}>
                                    {props.oldmahzordata ?
                                        props.oldmahzordata.status == 1 ?
                                            <>
                                                <option key={1} value={1}>התחלת מחזור חדש</option>
                                                <option key={2} value={2}>התחלת סבב העדפות ראשון</option>
                                            </> :
                                            props.oldmahzordata.status == 2 ?
                                                <>
                                                    <option key={2} value={2}>התחלת סבב העדפות ראשון</option>
                                                    <option key={3} value={3}>סיום סבב העדפות ראשון</option>
                                                </> :
                                                props.oldmahzordata.status == 3 ?
                                                    <>
                                                        <option key={3} value={3}>סיום סבב העדפות ראשון</option>
                                                        <option key={4} value={4}>התחלת סבב העדפות שני (לאחר ראיונות)</option>
                                                    </> :
                                                    props.oldmahzordata.status == 4 ?
                                                        <>
                                                            <option key={4} value={4}>התחלת סבב העדפות שני (לאחר ראיונות)</option>
                                                            <option key={5} value={5}>שיבוצים סופיים</option>
                                                        </> :
                                                        props.oldmahzordata.status == 5 ?
                                                            <>
                                                                <option key={5} value={5}>שיבוצים סופיים</option>
                                                                <option key={6} value={6}>מחזור סגור</option>
                                                            </> :
                                                            props.oldmahzordata.status == 6 ?
                                                                <>
                                                                    <option key={6} value={6}>מחזור סגור</option>
                                                                </> : null
                                        :
                                        <>
                                            <option value={""}>בחר סטטוס מחזור</option>
                                            <option key={1} value={1}>התחלת מחזור חדש</option>
                                        </>}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
}
export default withRouter(MahzorDataComponent3);;