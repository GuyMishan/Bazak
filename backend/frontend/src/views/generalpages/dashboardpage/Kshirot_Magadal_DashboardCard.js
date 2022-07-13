import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";

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

function Zminot_Magadal_DashboardCard(props) {
    const [cardata_by_magadal, setCardata_by_magadal] = useState(0)
    const [cardata_by_magadal_kashir, setCardata_by_magadal_kashir] = useState(0)
    const [cardata_by_magadal_not_kashir, setCardata_by_magadal_not_kashir] = useState(0)
    //
    const [cardata_by_magadal_intipul, setCardata_by_magadal_intipul] = useState(0)
    const [cardata_by_magadal_harigtipul, setCardata_by_magadal_harigtipul] = useState(0)
    const [cardata_by_magadal_takalotmizdamnot, setCardata_by_magadal_takalotmizdamnot] = useState(0)
    const [cardata_by_magadal_hhstand, setCardata_by_magadal_hhstand] = useState(0)
    //
    const [collapseOpen, setcollapseOpen] = useState(false);

    const toggleCollapse = (event) => {
        setcollapseOpen(!collapseOpen);
    };

    function init() {
        let temp_cardata_by_magadal = props.cardatas.filter(cardata => ((cardata.magadal == props.magadal._id)));

        let temp_cardata_by_magadal_kashir = temp_cardata_by_magadal.filter(cardata => (/*(cardata.zminot == 'זמין') &&*/ (cardata.kshirot == 'כשיר')));

        let temp_cardata_by_magadal_not_kashir = temp_cardata_by_magadal.filter(cardata => (/*(cardata.zminot != 'זמין')||*/ (cardata.kshirot != 'כשיר')));

        let temp_cardata_by_magadal_intipul = [];
        let temp_cardata_by_magadal_harigtipul = [];
        let temp_cardata_by_magadal_takalotmizdamnot = [];
        let temp_cardata_by_magadal_hhstand = [];
        for (let i = 0; i < temp_cardata_by_magadal_not_kashir.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand = false;

            for (let j = 0; j < temp_cardata_by_magadal_not_kashir[i].tipuls.length; j++) {
                if (temp_cardata_by_magadal_not_kashir[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                }
                if (temp_cardata_by_magadal_not_kashir[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                }
                if (temp_cardata_by_magadal_not_kashir[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                }
                if (temp_cardata_by_magadal_not_kashir[i].tipuls[j].type == 'hh_stand') {
                    is_hhstand = true;
                }
            }
            if (is_intipul)
                temp_cardata_by_magadal_intipul.push(temp_cardata_by_magadal_not_kashir[i])
            if (is_harigtipul)
                temp_cardata_by_magadal_harigtipul.push(temp_cardata_by_magadal_not_kashir[i])
            if (is_takalotmizdamnot)
                temp_cardata_by_magadal_takalotmizdamnot.push(temp_cardata_by_magadal_not_kashir[i])
            if (is_hhstand)
                temp_cardata_by_magadal_hhstand.push(temp_cardata_by_magadal_not_kashir[i])
        }

        setCardata_by_magadal(temp_cardata_by_magadal.length)
        setCardata_by_magadal_kashir(temp_cardata_by_magadal_kashir.length)
        setCardata_by_magadal_not_kashir(temp_cardata_by_magadal_not_kashir.length)

        // if (temp_cardata_by_magadal.length > 0) {
        setCardata_by_magadal_intipul(temp_cardata_by_magadal_intipul.length);
        setCardata_by_magadal_harigtipul(temp_cardata_by_magadal_harigtipul.length);
        setCardata_by_magadal_takalotmizdamnot(temp_cardata_by_magadal_takalotmizdamnot.length);
        setCardata_by_magadal_hhstand(temp_cardata_by_magadal_hhstand.length);
        // }
    }

    useEffect(() => {
        init();
    }, [])

    return (
        cardata_by_magadal != 0 ?
            <Col xs={12} md={3}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px', cursor: 'pointer' }} onClick={(e) => toggleCollapse(e)}>
                    <CardHeader>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>כשירות {props.magadal.name}</h3>
                    </CardHeader>
                    <CardBody style={{ textAlign: 'center', margin: 'auto' }}>
                        <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                            {(cardata_by_magadal != 0 ? ((cardata_by_magadal_kashir / cardata_by_magadal) * 100) : 0) <= 60 ?
                                <ProgressProvider valueStart={0} valueEnd={(cardata_by_magadal != 0 ? ((cardata_by_magadal_kashir / cardata_by_magadal) * 100) : 0)}>
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
                                            <h5 style={{ margin: '0px' }}>{cardata_by_magadal_kashir + '/' + cardata_by_magadal}</h5>
                                        </div>
                                    </CircularProgressbarWithChildren>}
                                </ProgressProvider>
                                : (cardata_by_magadal != 0 ? ((cardata_by_magadal_kashir / cardata_by_magadal) * 100) : 0) <= 80 ?
                                    <ProgressProvider valueStart={0} valueEnd={(cardata_by_magadal != 0 ? ((cardata_by_magadal_kashir / cardata_by_magadal) * 100) : 0)}>
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
                                                <h5 style={{ margin: '0px' }}>{cardata_by_magadal_kashir + '/' + cardata_by_magadal}</h5>
                                            </div>
                                        </CircularProgressbarWithChildren>}
                                    </ProgressProvider>
                                    : (cardata_by_magadal != 0 ? ((cardata_by_magadal_kashir / cardata_by_magadal) * 100) : 0) <= 100 ?
                                        <ProgressProvider valueStart={0} valueEnd={(cardata_by_magadal != 0 ? ((cardata_by_magadal_kashir / cardata_by_magadal) * 100) : 0)}>
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
                                                    <h5 style={{ margin: '0px' }}>{cardata_by_magadal_kashir + '/' + cardata_by_magadal}</h5>
                                                </div>
                                            </CircularProgressbarWithChildren>}
                                        </ProgressProvider>
                                        : null}
                        </div>

                        {collapseOpen ?
                            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                                <h6>{props.magadal.name} בטיפול: {cardata_by_magadal_intipul}</h6>
                                <Progress color="guyblue" value={(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_intipul / cardata_by_magadal_not_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_intipul / cardata_by_magadal_not_kashir) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.magadal.name} חריגי טיפול:  {cardata_by_magadal_harigtipul}</h6>
                                <Progress color="guyblue" value={(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_harigtipul / cardata_by_magadal_not_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_harigtipul / cardata_by_magadal_not_kashir) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.magadal.name} בתקלות מזדמנות: {cardata_by_magadal_takalotmizdamnot}</h6>
                                <Progress color="guyblue" value={(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_takalotmizdamnot / cardata_by_magadal_not_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_takalotmizdamnot / cardata_by_magadal_not_kashir) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.magadal.name} עומדים על ח"ח: {cardata_by_magadal_hhstand}</h6>
                                <Progress color="guyblue" value={(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_hhstand / cardata_by_magadal_not_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_magadal_not_kashir != 0 ? ((cardata_by_magadal_hhstand / cardata_by_magadal_not_kashir) * 100) : 0).toFixed(0)}%</Progress>
                            </div>
                            : null}
                    </CardBody>
                </Card>
            </Col> : null
    );
}

export default withRouter(Zminot_Magadal_DashboardCard);