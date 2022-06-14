import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
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
    Col,
    Collapse
} from "reactstrap";
import axios from 'axios'

const EshkolFilter = (props) => {

    const [migzars, setMigzars] = useState([])

    const [certains, setCertains] = useState([])

    const [units, setUnits] = useState([])

    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const toggleCollapse = () => {
        setcollapseOpen(!collapseOpen);
    };

    const isDuplicate = (data, obj) => {
        let flag = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i]._id == obj._id) {
                flag = true
            }
        }
        return flag;
    }

    const calculateUnitsAccordingToData = async () => {
        let tempunits = [];
        for (let i = 0; i < props.originaldata.length; i++) {
            if (!isDuplicate(tempunits, props.originaldata[i].jobinmahzor.job.unit)) {
                tempunits.push(props.originaldata[i].jobinmahzor.job.unit)
            }
        }
        setUnits(tempunits);
    }

    const getUnits = async () => {
        let tempunits = [];
        let result = await axios.get(`http://localhost:8000/api/unit`)
        tempunits = result.data;
        setUnits(tempunits)
    }

    const getCertains = async () => {
        let tempcertains = [];
        tempcertains.push('ודאי');
        tempcertains.push('אופציה');
        setCertains(tempcertains)
    }

    const getMigzars = async () => {
        let tempmigzars = [];
        tempmigzars.push('מכונות');
        tempmigzars.push('תו"ן');
        tempmigzars.push('חשמל');
        tempmigzars.push('ורסטילי');
        setMigzars(tempmigzars)
    }

    function init() {
        getCertains();
        // getUnits();
        // calculateUnitsAccordingToData();
        getMigzars();
    }

    useEffect(() => {
        if ((props.originaldata != undefined))
        calculateUnitsAccordingToData()
    }, [props.originaldata]);

    useEffect(() => {
        init();
    }, []);

    return (
        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Button onClick={toggleCollapse} style={{ }}>סינון</Button>
            <Collapse isOpen={collapseOpen}>
                <Card style={{ background: 'rgb(228,228,228,0.2)' }}>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>מגזר</h4>
                            {migzars ? migzars.map((migzar, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.eshkolfilter.migzarfilter && props.eshkolfilter.migzarfilter.indexOf(migzar) != -1 ?
                                                <button className="btn-empty" name={'migzar'} value={migzar} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{migzar}</h6></button>
                                                : <button className="btn-empty" name={'migzar'} value={migzar} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{migzar}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>יחידה</h4>
                            {units ? units.map((unit, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.eshkolfilter.unitfilter && props.eshkolfilter.unitfilter.indexOf(unit._id) != -1 ?
                                                <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{unit.name}</h6></button>
                                                : <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{unit.name}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>ודאי/אופציה</h4>
                            {certains ? certains.map((certain, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.eshkolfilter.certainfilter && props.eshkolfilter.certainfilter.indexOf(certain) != -1 ?
                                                <button className="btn-empty" name={'certain'} value={certain} onClick={props.setfilter}><h6 style={{ color: 'blue', }}>{certain}</h6></button>
                                                : <button className="btn-empty" name={'certain'} value={certain} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{certain}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                    </Row>
                </Card >
            </Collapse>
        </div>
    );
}
export default withRouter(EshkolFilter);;