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

const CertainFilter = (props) => {

    useEffect(() => {
        props.setCertainfilter(undefined)
    }, [props.unitfilter]);

    return (
        props.unitfilter != undefined ?
            <Row>
                <Col xs={12} md={6} style={{ textAlign: 'center' }}>
                    {props.certainfilter == 'ודאי' ?
                        <Button className='btn btn-success' onClick={() => props.setCertainfilter(undefined)}>ודאי</Button>
                        :
                        <Button onClick={() => props.setCertainfilter('ודאי')}>ודאי</Button>
                    }
                </Col>

                <Col xs={12} md={6} style={{ textAlign: 'center' }}>
                    {props.certainfilter == 'אופציה' ?
                        <Button className='btn btn-success' onClick={() => props.setCertainfilter(undefined)}>אופציה</Button>
                        :
                        <Button onClick={() => props.setCertainfilter('אופציה')}>אופציה</Button>
                    }
                </Col>
            </Row> : null
    );
}
export default withRouter(CertainFilter);;