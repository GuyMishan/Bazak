import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
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
    Modal,
    ModalBody,
    CardFooter,
    Progress
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import arrowhead from "assets/img/arrowhead.png";
import arrowhead_white from "assets/img/arrowhead_white.png";

const ChartCard = (props) => { //instate - zamin/kashir
    const [cardata_by_chart, setCardata_by_chart] = useState(0)
    const [cardata_by_chart_instate, setCardata_by_chart_instate] = useState(0)
    const [cardata_by_chart_not_instate, setCardata_by_chart_not_instate] = useState(0)
    //
    const [cardata_by_chart_intipul, setCardata_by_chart_intipul] = useState(0)
    const [cardata_by_chart_harigtipul, setCardata_by_chart_harigtipul] = useState(0)
    const [cardata_by_chart_takalotmizdamnot, setCardata_by_chart_takalotmizdamnot] = useState(0)
    const [cardata_by_chart_hhstand, setCardata_by_chart_hhstand] = useState(0)
    //
    const [collapseOpen, setcollapseOpen] = useState(false);

    const toggleCollapse = (event) => {
        setcollapseOpen(!collapseOpen);
    };

    const clickDelete = async () => {
        let response = axios.post(`http://localhost:8000/api/modularscreens/chart/remove/${props.chartid}`)
        toast.success(`תרשים נמחק בהצלחה`);
        props.init();
    }

    function init() {
        let temp_cardata_by_chart;
        let temp_cardata_by_chart_instate;
        let temp_cardata_by_chart_not_instate;

        temp_cardata_by_chart = props.cardatas;

        //filter by chartdata
        if (props.chart.units && props.chart.units.length > 0) {
            let temp_cardata_by_chart_copy3 = []
            for (let i = 0; i < props.chart.units.length; i++) {
                let lastKey = Object.keys(props.chart.units[i]).pop();
                let lastValue = props.chart.units[i][Object.keys(props.chart.units[i]).pop()]
                let temp = temp_cardata_by_chart.filter(cardata => ((cardata[lastKey] == lastValue)));
                temp_cardata_by_chart_copy3 = temp_cardata_by_chart_copy3.concat(temp);//theres duplicates
            }
            temp_cardata_by_chart = [...new Set(temp_cardata_by_chart_copy3)]; // removes duplicates
        }

        if (props.chart.tenetree && props.chart.tenetree.length > 0) {
            let temp_cardata_by_chart_copy4 = []
            for (let i = 0; i < props.chart.tenetree.length; i++) {
                let lastKey = Object.keys(props.chart.tenetree[i]).pop();
                let lastValue = props.chart.tenetree[i][Object.keys(props.chart.tenetree[i]).pop()]
                let temp = temp_cardata_by_chart.filter(cardata => ((cardata[lastKey] == lastValue)));
                temp_cardata_by_chart_copy4 = temp_cardata_by_chart_copy4.concat(temp);//theres duplicates
            }
            temp_cardata_by_chart = [...new Set(temp_cardata_by_chart_copy4)];// removes duplicates
        }

        let temp_cardata_by_chart_copy1 = []
        for (let i = 0; i < props.chart.stand.length; i++) {
            let temp = temp_cardata_by_chart.filter(cardata => ((cardata.stand == props.chart.stand[i])));
            temp_cardata_by_chart_copy1 = temp_cardata_by_chart_copy1.concat(temp)
        }
        temp_cardata_by_chart = temp_cardata_by_chart_copy1;

        let temp_cardata_by_chart_copy2 = []
        for (let i = 0; i < props.chart.status.length; i++) {
            let temp = temp_cardata_by_chart.filter(cardata => ((cardata.status == props.chart.status[i])));
            temp_cardata_by_chart_copy2 = temp_cardata_by_chart_copy2.concat(temp)
        }
        temp_cardata_by_chart = temp_cardata_by_chart_copy2;

        //filter by zamin/kashir
        if (props.theme == 'white-content') {
            temp_cardata_by_chart_instate = temp_cardata_by_chart.filter(cardata => ((cardata.zminot == 'זמין')));
            temp_cardata_by_chart_not_instate = temp_cardata_by_chart.filter(cardata => ((cardata.zminot != 'זמין')));
        }
        else {
            temp_cardata_by_chart_instate = temp_cardata_by_chart.filter(cardata => ((cardata.kshirot == 'כשיר')));
            temp_cardata_by_chart_not_instate = temp_cardata_by_chart.filter(cardata => ((cardata.kshirot != 'כשיר')));
        }

        //calculate intipul/harigtipul/takalotmizdamnot/hhstand
        let temp_cardata_by_chart_intipul = [];
        let temp_cardata_by_chart_harigtipul = [];
        let temp_cardata_by_chart_takalotmizdamnot = [];
        let temp_cardata_by_chart_hhstand = [];
        for (let i = 0; i < temp_cardata_by_chart_not_instate.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand = false;

            for (let j = 0; j < temp_cardata_by_chart_not_instate[i].tipuls.length; j++) {
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                }
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                }
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                }
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'hh_stand') {
                    is_hhstand = true;
                }
            }
            if (is_intipul)
                temp_cardata_by_chart_intipul.push(temp_cardata_by_chart_not_instate[i])
            if (is_harigtipul)
                temp_cardata_by_chart_harigtipul.push(temp_cardata_by_chart_not_instate[i])
            if (is_takalotmizdamnot)
                temp_cardata_by_chart_takalotmizdamnot.push(temp_cardata_by_chart_not_instate[i])
            if (is_hhstand)
                temp_cardata_by_chart_hhstand.push(temp_cardata_by_chart_not_instate[i])
        }

        setCardata_by_chart(temp_cardata_by_chart.length)
        setCardata_by_chart_instate(temp_cardata_by_chart_instate.length)
        setCardata_by_chart_not_instate(temp_cardata_by_chart_not_instate.length)

        setCardata_by_chart_intipul(temp_cardata_by_chart_intipul.length);
        setCardata_by_chart_harigtipul(temp_cardata_by_chart_harigtipul.length);
        setCardata_by_chart_takalotmizdamnot(temp_cardata_by_chart_takalotmizdamnot.length);
        setCardata_by_chart_hhstand(temp_cardata_by_chart_hhstand.length);
    }

    useEffect(() => {
        init();
    }, [props])

    return (
        props.mode == 'normal' ?
            cardata_by_chart != 0 ?
                <div style={{ width: `${100 / props.screendata.chartsinline}%`, paddingLeft: '15px', paddingRight: '15px' }}>
                    <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                        <CardHeader style={{ padding: '0px' }}>
                            <div style={{ textAlign: 'right' }}>
                                {props.theme == "white-content" ?
                                    <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.chart.chartid}/notype/0`}><img style={{ cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px',paddingRight:'2rem',paddingLeft:'2rem' }}>זמינות {props.chart.name}</h3></>
                                    : <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.chart.chartid}/notype/0`}><img style={{ cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px',paddingRight:'2rem',paddingLeft:'2rem' }}>כשירות {props.chart.name}</h3></>
                                }
                            </div>
                        </CardHeader>
                        <CardBody style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer' }} onClick={(e) => toggleCollapse(e)}>
                            <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                                {(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0) < 60 ?
                                    <ProgressProvider valueStart={0} valueEnd={(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0)}>
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
                                                <h5 style={{ margin: '0px' }}>{cardata_by_chart_instate + '/' + cardata_by_chart}</h5>
                                            </div>
                                        </CircularProgressbarWithChildren>}
                                    </ProgressProvider>
                                    : (cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0) < 80 ?
                                        <ProgressProvider valueStart={0} valueEnd={(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0)}>
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
                                                    <h5 style={{ margin: '0px' }}>{cardata_by_chart_instate + '/' + cardata_by_chart}</h5>
                                                </div>
                                            </CircularProgressbarWithChildren>}
                                        </ProgressProvider>
                                        : (cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0) <= 100 ?
                                            <ProgressProvider valueStart={0} valueEnd={(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0)}>
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
                                                        <h5 style={{ margin: '0px' }}>{cardata_by_chart_instate + '/' + cardata_by_chart}</h5>
                                                    </div>
                                                </CircularProgressbarWithChildren>}
                                            </ProgressProvider>
                                            : null}
                            </div>

                            {collapseOpen ?
                                <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                                    <h6>{props.chart.name} בטיפול: {cardata_by_chart_intipul}</h6>
                                    <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_intipul / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_intipul / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                    <h6>{props.chart.name} חריגי טיפול:  {cardata_by_chart_harigtipul}</h6>
                                    <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_harigtipul / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_harigtipul / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                    <h6>{props.chart.name} בתקלות מזדמנות: {cardata_by_chart_takalotmizdamnot}</h6>
                                    <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_takalotmizdamnot / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_takalotmizdamnot / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                    <h6>{props.chart.name} עומדים על ח"ח: {cardata_by_chart_hhstand}</h6>
                                    <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_hhstand / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_hhstand / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                </div>
                                : null}
                        </CardBody>
                    </Card>
                </div> : 
                <div style={{ width: `${100 / props.screendata.chartsinline}%`, paddingLeft: '15px', paddingRight: '15px' }}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                    <CardHeader style={{ padding: '0px' }}>
                        <div style={{ textAlign: 'right' }}>
                            {props.theme == "white-content" ?
                                <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.chart.chartid}/notype/0`}><img style={{ cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px',paddingRight:'2rem',paddingLeft:'2rem' }}>זמינות {props.chart.name}</h3></>
                                : <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.chart.chartid}/notype/0`}><img style={{ cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px',paddingRight:'2rem',paddingLeft:'2rem' }}>כשירות {props.chart.name}</h3></>
                            }
                        </div>
                    </CardHeader>
                    <CardBody style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer' }} onClick={(e) => toggleCollapse(e)}>
                        <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                                <ProgressProvider valueStart={0} valueEnd={0}>
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
                                            <h2 style={{ margin: '0px' }}>{`${0}%`}</h2>
                                        </div>
                                        <div style={{ fontSize: 12, marginTop: -2 }}>
                                            <h5 style={{ margin: '0px' }}>{0 + '/' + 0}</h5>
                                        </div>
                                    </CircularProgressbarWithChildren>}
                                </ProgressProvider>
                        </div>

                        {collapseOpen ?
                            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                                <h6>{props.chart.name} בטיפול: {0}</h6>
                                <Progress color="guyblue" value={0} style={{ height: '10px', marginBottom: '8px' }}>{0}%</Progress>
                                <h6>{props.chart.name} חריגי טיפול:  {0}</h6>
                                <Progress color="guyblue" value={0} style={{ height: '10px', marginBottom: '8px' }}>{0}%</Progress>
                                <h6>{props.chart.name} בתקלות מזדמנות: {0}</h6>
                                <Progress color="guyblue" value={0} style={{ height: '10px', marginBottom: '8px' }}>{0}%</Progress>
                                <h6>{props.chart.name} עומדים על ח"ח: {0}</h6>
                                <Progress color="guyblue" value={0} style={{ height: '10px', marginBottom: '8px' }}>{0}%</Progress>
                            </div>
                            : null}
                    </CardBody>
                </Card>
            </div>
            :
            <div style={{ width: `${100 / props.screendata.chartsinline}%`, paddingLeft: '15px', paddingRight: '15px'}}>
                <Card style={{boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                    <CardHeader style={{ padding: '0px' }}>
                        <div style={{ textAlign: 'left', height: '0px', marginRight:'3rem' }}>
                            <button className='btn-new-delete' style={{position:'relative',padding: '11px 17px',borderRadius: '50%'}} onClick={clickDelete}>X</button>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ textAlign: 'right' }}>
                                {props.theme == "white-content" ?
                                    <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.chart.chartid}/notype/0`}><img style={{ cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px',paddingRight:'2rem',paddingLeft:'2rem' }}>זמינות {props.chart.name}</h3></>
                                    : <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.chart.chartid}/notype/0`}><img style={{ cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px',paddingRight:'2rem',paddingLeft:'2rem' }}>כשירות {props.chart.name}</h3></>
                                }
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer' }} onClick={(e) => toggleCollapse(e)}>
                        <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                <button className='btn-new' style={{ padding: '5px' }} onClick={props.Toggle}> ערוך <img src={editpic} style={{ height: "40px",padding: '3px' }} ></img></button>
                        </div>
                    </CardBody>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
    );
}
export default withRouter(ChartCard);;