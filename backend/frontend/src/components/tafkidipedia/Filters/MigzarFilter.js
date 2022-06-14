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

const MigzarFilter = (props) => {
    return (
        <Row>
            <Col xs={12} md={3} style={{ textAlign: 'center' }}>
                {props.migzarfilter == 'מכונות' ?
                    <Button className='btn btn-success' onClick={() => props.setMigzarfilter(undefined)}>מכונות</Button>
                    :
                    <Button onClick={() => props.setMigzarfilter('מכונות')}>מכונות</Button>
                }
            </Col>

            <Col xs={12} md={3} style={{ textAlign: 'center' }}>
                {props.migzarfilter == 'תו"ן' ?
                    <Button className='btn btn-success' onClick={() => props.setMigzarfilter(undefined)}>תו"ן</Button>
                    :
                    <Button onClick={() => props.setMigzarfilter('תו"ן')}>תו"ן</Button>
                }
            </Col>

            <Col xs={12} md={3} style={{ textAlign: 'center' }}>
                {props.migzarfilter == 'חשמל' ?
                    <Button className='btn btn-success' onClick={() => props.setMigzarfilter(undefined)}>חשמל</Button>
                    :
                    <Button onClick={() => props.setMigzarfilter('חשמל')}>חשמל</Button>
                }
            </Col>

            <Col xs={12} md={3} style={{ textAlign: 'center' }}>
                {props.migzarfilter == 'ורסטילי' ?
                    <Button className='btn btn-success' onClick={() => props.setMigzarfilter(undefined)}>ורסטילי</Button>
                    :
                    <Button onClick={() => props.setMigzarfilter('ורסטילי')}>ורסטילי</Button>
                }
            </Col>
        </Row>
    );
}
export default withRouter(MigzarFilter);;