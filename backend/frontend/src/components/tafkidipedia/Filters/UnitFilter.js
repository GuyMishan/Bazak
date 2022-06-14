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
    Col
} from "reactstrap";
import axios from 'axios'

const UnitFilter = (props) => {
    const [units, setUnits] = useState([])

    const isDuplicate = (data, obj) => {
        let flag = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == obj) {
                flag = true
            }
        }
        return flag;
    }

    const calculateUnitsAccordingToData = async (data) => {
        let tempunits = [];
        for (let i = 0; i < data.length; i++) {
            if (!isDuplicate(tempunits, data[i].jobinmahzor.job.unit.name)) {
                tempunits.push(data[i].jobinmahzor.job.unit.name)
            }
            console.log(data[i].jobinmahzor.job.unit.name)
        }
        setUnits(tempunits);
    }

    useEffect(() => {
        props.setUnitfilter(undefined)
        // calculateUnitsAccordingToData(props.data)
    }, [props.migzarfilter]);

    useEffect(() => {
        if ((props.originaldata != undefined))
        calculateUnitsAccordingToData(props.originaldata)
    }, [props.originaldata]);

    return (
        props.migzarfilter != undefined ?
            <Row>
                {units.map(unit => {
                    return (
                        <Col xs={12} md={6} style={{ textAlign: 'center' }}>
                            {props.unitfilter == unit ?
                                <Button className='btn btn-success' onClick={() => props.setUnitfilter(undefined)}>{unit}</Button>
                                :
                                <Button onClick={() => props.setUnitfilter(unit)}>{unit}</Button>
                            }
                        </Col>
                    )
                }
                )}
            </Row> : null
    );
}
export default withRouter(UnitFilter);;