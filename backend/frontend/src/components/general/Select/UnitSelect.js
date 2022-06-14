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

export default function UnitSelect(props) {

    useEffect(() => {
    }, []);

    return (
        <Row>
            {((props.level == "admin")) ?
                <>
                    {((props.pagefilter.ogdas.length == 0)) ?
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>פיקוד</h6>
                            <Select data={props.pikods} handleChange2={props.handleChange2} name={'pikods'} />
                        </Col> :
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>פיקוד</h6>
                            <Select data={props.pikods} handleChange2={props.handleChange2} name={'pikods'} isDisabled={true} />
                        </Col>}
                </> : null}

            {((props.level == "admin") || (props.level == "pikod")) ?
                <>
                    {((props.pagefilter.pikods.length > 0) && (props.pagefilter.hativas.length == 0)) ?
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>אוגדה</h6>
                            <Select data={props.ogdas} handleChange2={props.handleChange2} name={'ogdas'} />
                        </Col> :
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>אוגדה</h6>
                            <Select data={props.ogdas} handleChange2={props.handleChange2} name={'ogdas'} isDisabled={true} />
                        </Col>}
                </> : null}

            {((props.level == "admin") || (props.level == "pikod") || (props.level == "ogda")) ?
                <>
                    {((props.pagefilter.ogdas.length > 0) && (props.pagefilter.gdods.length == 0)) ?
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>חטיבה</h6>
                            <Select data={props.hativas} handleChange2={props.handleChange2} name={'hativas'} />
                        </Col> :
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>חטיבה</h6>
                            <Select data={props.hativas} handleChange2={props.handleChange2} name={'hativas'} isDisabled={true} />
                        </Col>}
                </> : null}

            {((props.level == "admin") || (props.level == "pikod") || (props.level == "ogda") || (props.level == "hativa")) ?
                <>
                    {((props.pagefilter.hativas.length > 0)) ?
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>גדוד</h6>
                            <Select data={props.gdods} handleChange2={props.handleChange2} name={'gdods'} />
                        </Col> :
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>גדוד</h6>
                            <Select data={props.gdods} handleChange2={props.handleChange2} name={'gdods'} isDisabled={true} />
                        </Col>}
                </> : null}
        </Row>
    );
}