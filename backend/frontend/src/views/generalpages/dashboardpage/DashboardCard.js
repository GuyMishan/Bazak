import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";
import arrowhead from "assets/img/arrowhead.png";
import arrowhead_white from "assets/img/arrowhead_white.png";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
    Progress,
} from "reactstrap";

function DashboardCard(props) { //instate - zamin/kashir
    const [cardata_by_cartype, setCardata_by_cartype] = useState(0)
    const [cardata_by_cartype_instate, setCardata_by_cartype_instate] = useState(0)
    const [cardata_by_cartype_not_instate, setCardata_by_cartype_not_instate] = useState(0)
    //
    const [cardata_by_cartype_intipul, setCardata_by_cartype_intipul] = useState(0)
    const [cardata_by_cartype_harigtipul, setCardata_by_cartype_harigtipul] = useState(0)
    const [cardata_by_cartype_takalotmizdamnot, setCardata_by_cartype_takalotmizdamnot] = useState(0)
    const [cardata_by_cartype_hhstand_intipul, setCardata_by_cartype_hhstand_intipul] = useState(0)
    const [cardata_by_cartype_hhstand_harigtipul, setCardata_by_cartype_hhstand_harigtipul] = useState(0)
    const [cardata_by_cartype_hhstand_takalotmizdamnot, setCardata_by_cartype_hhstand_takalotmizdamnot] = useState(0)
    //
    const [collapseOpen, setcollapseOpen] = useState(false);

    const toggleCollapse = (event) => {
        setcollapseOpen(!collapseOpen);
    };

    function init() {
        let temp_cardata_by_cartype;
        let temp_cardata_by_cartype_instate;
        let temp_cardata_by_cartype_not_instate;

        if (props.theme == 'white-content') {
            switch (props.match.params.cartype) {
                case 'magadal':
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר') &&(cardata.magadal == props.cartype._id)));
                    break;
                case 'magad':
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר') &&(cardata.magad == props.cartype._id)));
                    break;
                case 'mkabaz':
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר') &&(cardata.mkabaz == props.cartype._id)));
                    break;
                default:
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר') &&(cardata.magadal == props.cartype._id)));
                    break;
            }
            temp_cardata_by_cartype_instate = temp_cardata_by_cartype.filter(cardata => ((cardata.stand == 'סדיר') && (cardata.zminot == 'זמין')));
            temp_cardata_by_cartype_not_instate = temp_cardata_by_cartype.filter(cardata => ((cardata.stand == 'סדיר') && (cardata.zminot != 'זמין')));
        }
        else {
            switch (props.match.params.cartype) {
                case 'magadal':
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.magadal == props.cartype._id)));
                    break;
                case 'magad':
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.magad == props.cartype._id)));
                    break;
                case 'mkabaz':
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.mkabaz == props.cartype._id)));
                    break;
                default:
                    temp_cardata_by_cartype = props.cardatas.filter(cardata => ((cardata.magadal == props.cartype._id)));
                    break;
            }
            temp_cardata_by_cartype_instate = temp_cardata_by_cartype.filter(cardata => ((cardata.kshirot == 'כשיר')));
            temp_cardata_by_cartype_not_instate = temp_cardata_by_cartype.filter(cardata => ((cardata.kshirot != 'כשיר')));
        }

        //calculate intipul/harigtipul/takalotmizdamnot/hhstand
        let temp_cardata_by_cartype_intipul = [];
        let temp_cardata_by_cartype_harigtipul = [];
        let temp_cardata_by_cartype_takalotmizdamnot = [];
        let temp_cardata_by_cartype_hhstand_intipul = [];
        let temp_cardata_by_cartype_hhstand_harigtipul = [];
        let temp_cardata_by_cartype_hhstand_takalotmizdamnot = [];
        for (let i = 0; i < temp_cardata_by_cartype_not_instate.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand_intipul = false;
            let is_hhstand_harigtipul = false;
            let is_hhstand_takalotmizdamnot = false;

            for (let j = 0; j < temp_cardata_by_cartype_not_instate[i].tipuls.length; j++) {
                if (temp_cardata_by_cartype_not_instate[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                    if(temp_cardata_by_cartype_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_intipul = true;
                    }
                }
                if (temp_cardata_by_cartype_not_instate[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                    if(temp_cardata_by_cartype_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_harigtipul = true;
                    }
                }
                if (temp_cardata_by_cartype_not_instate[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                    if(temp_cardata_by_cartype_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_takalotmizdamnot = true;
                    }
                }
            }
            if (is_intipul)
                temp_cardata_by_cartype_intipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_harigtipul)
                temp_cardata_by_cartype_harigtipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_takalotmizdamnot)
                temp_cardata_by_cartype_takalotmizdamnot.push(temp_cardata_by_cartype_not_instate[i])
            if (is_hhstand_intipul)
                temp_cardata_by_cartype_hhstand_intipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_hhstand_harigtipul)
                temp_cardata_by_cartype_hhstand_harigtipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_hhstand_takalotmizdamnot)
                temp_cardata_by_cartype_hhstand_takalotmizdamnot.push(temp_cardata_by_cartype_not_instate[i])
        }

        setCardata_by_cartype(temp_cardata_by_cartype.length)
        setCardata_by_cartype_instate(temp_cardata_by_cartype_instate.length)
        setCardata_by_cartype_not_instate(temp_cardata_by_cartype_not_instate.length)

        setCardata_by_cartype_intipul(temp_cardata_by_cartype_intipul.length);
        setCardata_by_cartype_harigtipul(temp_cardata_by_cartype_harigtipul.length);
        setCardata_by_cartype_takalotmizdamnot(temp_cardata_by_cartype_takalotmizdamnot.length);
        setCardata_by_cartype_hhstand_intipul(temp_cardata_by_cartype_hhstand_intipul.length);
        setCardata_by_cartype_hhstand_harigtipul(temp_cardata_by_cartype_hhstand_harigtipul.length);
        setCardata_by_cartype_hhstand_takalotmizdamnot(temp_cardata_by_cartype_hhstand_takalotmizdamnot.length);
    }

    useEffect(() => {
        init();
    }, [props])

    return (
        cardata_by_cartype != 0 ?
            <Col xs={12} md={3}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px'}}>
                    <CardHeader style={{padding:'0px'}}>
                    <div style={{textAlign:'right'}}>
                        {props.theme == "white-content" ?
                            props.match.params.cartype == 'magadal' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/magad/${props.cartype._id}/true`}><img style={{cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>זמינות {props.cartype.name}</h3></>
                                : props.match.params.cartype == 'magad' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/mkabaz/${props.cartype._id}/true`}><img style={{cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>זמינות {props.cartype.name}</h3></>
                                    : <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>זמינות {props.cartype.name}</h3>

                            : props.match.params.cartype == 'magadal' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/magad/${props.cartype._id}/true`}><img style={{cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות {props.cartype.name}</h3></>
                                : props.match.params.cartype == 'magad' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/mkabaz/${props.cartype._id}/true`}><img style={{cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות {props.cartype.name}</h3></>
                                    : <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>כשירות {props.cartype.name}</h3>
                        }
                        </div>

                    </CardHeader>
                    <CardBody style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer'  }} onClick={(e) => toggleCollapse(e)}>
                        <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                            {(cardata_by_cartype != 0 ? ((cardata_by_cartype_instate / cardata_by_cartype) * 100) : 0) < 60 ?
                                <ProgressProvider valueStart={0} valueEnd={(cardata_by_cartype != 0 ? ((cardata_by_cartype_instate / cardata_by_cartype) * 100) : 0)}>
                                    {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                        root: {},
                                        path: {
                                            stroke: `#ff2128`,
                                            strokeLinecap: 'butt',
                                            transition: 'stroke-dashoffset 0.5s ease 0s',
                                        },
                                        trail: {
                                            stroke: 'rgb(141 141 141 / 30%)',
                                            strokeLinecap: 'butt',
                                            transform: 'rotate(0.25turn)',
                                            transformOrigin: 'center center',
                                        },
                                        text: {
                                            fill: '#ff2128',
                                            fontSize: '18px',
                                        },
                                        background: {
                                            fill: '#3e98c7',
                                        },
                                    }}>
                                        <div>
                                            <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                        </div>
                                        <div style={{ fontSize: 12, marginTop: -2 }}>
                                            <h5 style={{ margin: '0px' }}>{cardata_by_cartype_instate + '/' + cardata_by_cartype}</h5>
                                        </div>
                                    </CircularProgressbarWithChildren>}
                                </ProgressProvider>
                                : (cardata_by_cartype != 0 ? ((cardata_by_cartype_instate / cardata_by_cartype) * 100) : 0) < 80 ?
                                    <ProgressProvider valueStart={0} valueEnd={(cardata_by_cartype != 0 ? ((cardata_by_cartype_instate / cardata_by_cartype) * 100) : 0)}>
                                        {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                            root: {},
                                            path: {
                                                stroke: `#ffca3a`,
                                                strokeLinecap: 'butt',
                                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                            },
                                            trail: {
                                                stroke: 'rgb(141 141 141 / 30%)',
                                                strokeLinecap: 'butt',
                                                transform: 'rotate(0.25turn)',
                                                transformOrigin: 'center center',
                                            },
                                            text: {
                                                fill: '#ffca3a',
                                                fontSize: '18px',
                                            },
                                            background: {
                                                fill: '#3e98c7',
                                            },
                                        }}>
                                            <div>
                                                <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                            </div>
                                            <div style={{ fontSize: 12, marginTop: -2 }}>
                                                <h5 style={{ margin: '0px' }}>{cardata_by_cartype_instate + '/' + cardata_by_cartype}</h5>
                                            </div>
                                        </CircularProgressbarWithChildren>}
                                    </ProgressProvider>
                                    : (cardata_by_cartype != 0 ? ((cardata_by_cartype_instate / cardata_by_cartype) * 100) : 0) <= 100 ?
                                        <ProgressProvider valueStart={0} valueEnd={(cardata_by_cartype != 0 ? ((cardata_by_cartype_instate / cardata_by_cartype) * 100) : 0)}>
                                            {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                                root: {},
                                                path: {
                                                    stroke: `#8ac926`,
                                                    strokeLinecap: 'butt',
                                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                                },
                                                trail: {
                                                    stroke: 'rgb(141 141 141 / 30%)',
                                                    strokeLinecap: 'butt',
                                                    transform: 'rotate(0.25turn)',
                                                    transformOrigin: 'center center',
                                                },
                                                text: {
                                                    fill: '#8ac926',
                                                    fontSize: '18px',
                                                },
                                                background: {
                                                    fill: '#3e98c7',
                                                },
                                            }}>
                                                <div>
                                                    <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                                </div>
                                                <div style={{ fontSize: 12, marginTop: -2 }}>
                                                    <h5 style={{ margin: '0px' }}>{cardata_by_cartype_instate + '/' + cardata_by_cartype}</h5>
                                                </div>
                                            </CircularProgressbarWithChildren>}
                                        </ProgressProvider>
                                        : null}
                        </div>

                        {collapseOpen ?
                            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                                <h6>{props.cartype.name} בטיפול: {cardata_by_cartype_intipul} <span style={{color:'red'}}>(ח"ח: {cardata_by_cartype_hhstand_intipul})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_intipul / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_intipul / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <Progress color="guydanger" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_hhstand_intipul / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_hhstand_intipul / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.cartype.name} חריגי טיפול:  {cardata_by_cartype_harigtipul} <span style={{color:'red'}}>(ח"ח: {cardata_by_cartype_hhstand_harigtipul})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_harigtipul / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_harigtipul / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <Progress color="guydanger" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_hhstand_harigtipul / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_hhstand_harigtipul / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.cartype.name} בתקלות מזדמנות: {cardata_by_cartype_takalotmizdamnot} <span style={{color:'red'}}>(ח"ח: {cardata_by_cartype_hhstand_takalotmizdamnot})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_takalotmizdamnot / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_takalotmizdamnot / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <Progress color="guydanger" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_hhstand_takalotmizdamnot / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_hhstand_takalotmizdamnot / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                            </div>
                            : null}
                    </CardBody>
                </Card>
            </Col> : null
        // <h1>hello</h1>
    );
}

export default withRouter(DashboardCard);