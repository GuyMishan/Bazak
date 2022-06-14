import React, { useEffect, useState } from 'react';
import axios from 'axios'
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import { Link, withRouter, Redirect } from "react-router-dom";

import MeagedalCard from "components/workplan/UpkeepPlan/MeagedalCard"

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    Collapse,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";

import Select from 'components/general/Select/AnimatedMultiSelect'

export default function TipulSelect(props) {

    useEffect(() => {
    }, []);
    
    return (
        <Row>
            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                <h6>גוף ביצוע</h6>
                <Select data={props.gofbizoas} handleChange2={props.handleChange2} name={'gofbizoas'} />
            </Col>

            {props.statuss ?<Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                <h6>סטטוס</h6>
                <Select data={props.statuss} handleChange2={props.handleChange2} name={'statuss'} />
            </Col> :null}
            

            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                <h6>סוג טיפול</h6>
                <Select data={props.tipultypes} handleChange2={props.handleChange2} name={'tipultypes'} />
            </Col>

            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                <h6>סוג טיפול-זכאות</h6>
                <Select data={props.zkaottipuls} handleChange2={props.handleChange2} name={'zkaottipuls'} />
            </Col>
        </Row>
    );
}