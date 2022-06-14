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

const JobFilter = (props) => {

    const [migzars, setMigzars] = useState([])

    const [populations, setPopulations] = useState([])

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
            if (!isDuplicate(tempunits, data[i].unit)) {
                tempunits.push(data[i].unit)
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

    const getPopulations = async () => {
        let tempopulations = [];
        let result = await axios.get(`http://localhost:8000/api/population`)
        tempopulations = result.data;
        setPopulations(tempopulations)
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
        getPopulations();
        // // getUnits();
        getMigzars();
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if ((props.originaljobs != undefined))
            calculateUnitsAccordingToData(props.originaljobs)
    }, [props.originaljobs]);

    return (
        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Button onClick={toggleCollapse} style={{}}>סינון</Button>
            <Collapse isOpen={collapseOpen}>
                <Card style={{background: 'rgb(228,228,228,0.2)'}}>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>יחידה</h4>
                            {units ? units.map((unit, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.jobfilter.unitfilter && props.jobfilter.unitfilter.indexOf(unit._id) != -1 ?
                                                <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{unit.name}</h6></button>
                                                : <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{unit.name}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>אוכלוסייה</h4>
                            {populations ? populations.map((population, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.jobfilter.populationfilter && props.jobfilter.populationfilter.indexOf(population._id) != -1 ?
                                                <button className="btn-empty" name={'population'} value={population._id} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{population.name}</h6></button>
                                                : <button className="btn-empty" name={'population'} value={population._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{population.name}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}

                        </Col>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>מגזר</h4>
                            {migzars ? migzars.map((migzar, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.jobfilter.migzarfilter && props.jobfilter.migzarfilter.indexOf(migzar) != -1 ?
                                                <button className="btn-empty" name={'migzar'} value={migzar} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{migzar}</h6></button>
                                                : <button className="btn-empty" name={'migzar'} value={migzar} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{migzar}</h6></button>}
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
export default withRouter(JobFilter);;