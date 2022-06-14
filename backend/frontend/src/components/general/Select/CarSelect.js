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

export default function CarSelect(props) {

    useEffect(() => {
    }, []);

    return (
        <Row>
            {((props.pagefilter.magads.length == 0)) ?
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={props.magadals} handleChange2={props.handleChange2} name={'magadals'} />
                </Col> :
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={props.magadals} handleChange2={props.handleChange2} name={'magadals'} isDisabled={true} />
                </Col>}

            {((props.pagefilter.magadals.length > 0) && (props.pagefilter.mkabazs.length == 0)) ?
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={props.magads} handleChange2={props.handleChange2} name={'magads'} />
                </Col> :
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={props.magads} handleChange2={props.handleChange2} name={'magads'} isDisabled={true} />
                </Col>}

            {((props.pagefilter.magads.length > 0) && (props.pagefilter.mkats.length == 0)) ?
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={props.mkabazs} handleChange2={props.handleChange2} name={'mkabazs'} />
                </Col> :
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={props.mkabazs} handleChange2={props.handleChange2} name={'mkabazs'} isDisabled={true} />
                </Col>}

                {/* נותן את כל הצ' בלי התחשבות ברמה.. */}
                {/* {((props.pagefilter.mkabazs.length > 0) && (props.pagefilter.cars.length == 0)) ?
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקט</h6>
                    <Select data={props.mkats} handleChange2={props.handleChange2} name={'mkats'} />
                </Col> :
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקט</h6>
                    <Select data={props.mkats} handleChange2={props.handleChange2} name={'mkats'} isDisabled={true} />
                </Col>}

            {((props.pagefilter.mkats.length > 0)) ?
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>צ'</h6>
                    <Select data={props.cars} handleChange2={props.handleChange2} name={'cars'} />
                </Col> :
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>צ'</h6>
                    <Select data={props.cars} handleChange2={props.handleChange2} name={'cars'} isDisabled={true} />
                </Col>} */}
        </Row>
    );
}