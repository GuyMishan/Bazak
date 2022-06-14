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

const UnitPreferenceFilter = (props) => {

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

    const calculateUnitsAccordingToData = async (data) => {
        let tempunits = [];
        for (let i = 0; i < data.length; i++) {
            if (!isDuplicate(tempunits, data[i].jobinmahzor.job.unit)) {
                tempunits.push(data[i].jobinmahzor.job.unit)
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
        tempcertains.push('ודאי')
        tempcertains.push('אופציה')
        setCertains(tempcertains)
    }

    function init() {
        // getUnits();
        getCertains();
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if ((props.originaldata != undefined))
        calculateUnitsAccordingToData(props.originaldata)
    }, [props.originaldata]);

    return (
        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Button onClick={toggleCollapse} style={{ }}>סינון</Button>
            <Collapse isOpen={collapseOpen}>
                <Card style={{background: 'rgb(228,228,228,0.2)' }}>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={6} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>יחידה</h4>
                            {units ? units.map((unit, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.unitpreferencefilter.unitfilter && props.unitpreferencefilter.unitfilter.indexOf(unit._id) != -1 ?
                                                <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{unit.name}</h6></button>
                                                : <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{unit.name}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={6} style={{ textAlign: 'right' }}>
                        <h4 style={{ fontWeight: 'bold' }}>ודאי/אופציה</h4>
                            {certains ? certains.map((certain, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.unitpreferencefilter.certainfilter && props.unitpreferencefilter.certainfilter.indexOf(certain) != -1 ?
                                                <button className="btn-empty" name={'certain'} value={certain} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{certain}</h6></button>
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
export default withRouter(UnitPreferenceFilter);;