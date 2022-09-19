import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
} from "reactstrap";
import axios from 'axios';
import { signin, authenticate, isAuthenticated } from 'auth/index';
import PropagateLoader from "react-spinners/PropagateLoader";
import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';
import StatisticsComponent from "./StatisticsComponent";

function StatisticsPage({ match }) {
    //cardatas
    const [cardatas, setCardatas] = useState([]);
    const [cartypes, setCartypes] = useState([]);
    const [unittypes, setUnittypes] = useState([]);
    //spinner
    const [isdataloaded, setIsdataloaded] = useState(false);

    async function init() {
        setIsdataloaded(false);
        await getCardDataByUnitTypeAndUnitId();
        switch (match.params.cartype) {
            case 'magadal':
                await getMagadals();
                break;
            case 'magad':
                await getMagads(match.params.carid);
                break;
            case 'mkabaz':
                await getMkabazs(match.params.carid);
                break;
            default:
                await getMagadals();
                break;
        }
        switch (match.params.unittype) {
            case 'admin':
                await loadPikods();
                break;
            case 'pikod':
                await loadOgdas(match.params.unitid);
                break;
            case 'ogda':
                await loadHativas(match.params.unitid);
                break;
            case 'hativa':
                await loadGdods(match.params.unitid);
                break;
            case 'gdod':
                break;
            default:
                await loadPikods();
                break;
        }
    }

    const getMagadals = async () => {
        await axios.get(`http://localhost:8000/api/magadal`)
            .then(response => {
                setCartypes(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getMagads = async (magadalid) => {
        let tempmagadalsmagads = [];
        if (magadalid != undefined) {
            await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid}`)
                .then(response => {
                    for (let j = 0; j < response.data.length; j++)
                        tempmagadalsmagads.push(response.data[j])
                })
                .catch((error) => {
                    console.log(error);
                })
            setCartypes(tempmagadalsmagads);
        }
    }

    const getMkabazs = async (magadid) => {
        let tempmagadmkabazs = [];
        if (magadid != undefined) {
            await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid}`)
                .then(response => {
                    for (let j = 0; j < response.data.length; j++)
                        tempmagadmkabazs.push(response.data[j])
                })
                .catch((error) => {
                    console.log(error);
                })
            setCartypes(tempmagadmkabazs);
        }
    }

    const loadPikods = async () => {
        await axios.get("http://localhost:8000/api/pikod",)
            .then(response => {
                setUnittypes(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const loadOgdas = async (pikodid) => {
        let temppikodogdas = [];
        await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: pikodid })
            .then(response => {
                for (let j = 0; j < response.data.length; j++)
                    temppikodogdas.push(response.data[j])
            })
            .catch((error) => {
                console.log(error);
            })
        setUnittypes(temppikodogdas);
    }

    const loadHativas = async (ogdaid) => {
        let tempogdahativas = [];
        await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: ogdaid })
            .then(response => {
                for (let j = 0; j < response.data.length; j++)
                    tempogdahativas.push(response.data[j])
            })
            .catch((error) => {
                console.log(error);
            })
        setUnittypes(tempogdahativas);
    }

    const loadGdods = async (hativaid) => {
        let temphativasgdods = [];
        await axios.post("http://localhost:8000/api/gdod/gdodsbyhativaid", { hativa: hativaid })
            .then(response => {
                for (let j = 0; j < response.data.length; j++)
                    temphativasgdods.push(response.data[j])
            })
            .catch((error) => {
                console.log(error);
            })
        setUnittypes(temphativasgdods);
    }

    const getCardDataByUnitTypeAndUnitId = async () => {
        await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${match.params.unittype}/${match.params.unitid}`)
            .then(response => {
                setCardatas(response.data)
                setIsdataloaded(true)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        init();
    }, [match])

    return (
        !isdataloaded ?
            <div style={{ width: '50%', marginTop: '30%' }}>
                <PropagateLoader color={'#ff4650'} loading={true} size={25} />
            </div>
            :
            <div>
                <StatisticsComponent />
                <Row>
                    <Col xs={12} md={3} style={{ textAlign: 'right' }}>
                        <LatestUpdateDateComponent cardatas={cardatas} />
                    </Col>
                    <Col xs={12} md={6}>
                    </Col>
                    <Col xs={12} md={3}>
                        <Link to={`/zminotpage/${match.params.unittype}/${match.params.unitid}/${match.params.cartype}/${match.params.carid}/false`}><button className='btn-new-blue'>טבלת זמינות</button></Link>
                    </Col>
                </Row>
            </div>
    );
}
export default withRouter(StatisticsPage);