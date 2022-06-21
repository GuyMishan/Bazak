import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
    const [cardata_by_magadal_zamin_grade, setCardata_by_magadal_zamin_grade] = useState(0)
    //
    const [cardata_by_magadal_intipul_grade, setCardata_by_magadal_intipul_grade] = useState(0)
    const [cardata_by_magadal_harigtipul_grade, setCardata_by_magadal_harigtipul_grade] = useState(0)
    const [cardata_by_magadal_takalotmizdamnot_grade, setCardata_by_magadal_takalotmizdamnot_grade] = useState(0)
    const [cardata_by_magadal_hhstand_grade, setCardata_by_magadal_hhstand_grade] = useState(0)

    const [collapseOpen, setcollapseOpen] = useState(false);

    const toggleCollapse = (event) => {
        setcollapseOpen(!collapseOpen);
    };

    function init() {
        let temp_cardata_by_magadal = props.cardatas.filter(cardata => ((cardata.magadal == props.magadal._id)));

        let temp_cardata_by_magadal_zamin = temp_cardata_by_magadal.filter(cardata => ((cardata.zminot == 'זמין') && (cardata.kshirot == 'כשיר')));

        let tempgarde = 0;
        if (temp_cardata_by_magadal_zamin.length > 0)
            tempgarde = (temp_cardata_by_magadal_zamin.length / temp_cardata_by_magadal.length) * 100;
        //
        let temp_cardata_by_magadal_not_zamin = temp_cardata_by_magadal.filter(cardata => ((cardata.zminot != 'זמין') || (cardata.kshirot != 'לא כשיר')));

        let temp_cardata_by_magadal_intipul = [];
        let temp_cardata_by_magadal_harigtipul = [];
        let temp_cardata_by_magadal_takalotmizdamnot = [];
        let temp_cardata_by_magadal_hhstand = [];
        for (let i = 0; i < temp_cardata_by_magadal_not_zamin.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand = false;

            for (let j = 0; j < temp_cardata_by_magadal_not_zamin[i].tipuls.length; j++) {
                if (temp_cardata_by_magadal_not_zamin[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                }
                if (temp_cardata_by_magadal_not_zamin[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                }
                if (temp_cardata_by_magadal_not_zamin[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                }
                if (temp_cardata_by_magadal_not_zamin[i].tipuls[j].type == 'hh_stand') {
                    is_hhstand = true;
                }
            }
            if (is_intipul)
                temp_cardata_by_magadal_intipul.push(temp_cardata_by_magadal_not_zamin[i])
            if (is_harigtipul)
                temp_cardata_by_magadal_harigtipul.push(temp_cardata_by_magadal_not_zamin[i])
            if (is_takalotmizdamnot)
                temp_cardata_by_magadal_takalotmizdamnot.push(temp_cardata_by_magadal_not_zamin[i])
            if (is_hhstand)
                temp_cardata_by_magadal_hhstand.push(temp_cardata_by_magadal_not_zamin[i])
        }
        setCardata_by_magadal_zamin_grade(tempgarde)
        //
        if (temp_cardata_by_magadal.length > 0) {
            setCardata_by_magadal_intipul_grade((temp_cardata_by_magadal_intipul.length / temp_cardata_by_magadal.length) * 100);
            setCardata_by_magadal_harigtipul_grade((temp_cardata_by_magadal_harigtipul.length / temp_cardata_by_magadal.length) * 100);
            setCardata_by_magadal_takalotmizdamnot_grade((temp_cardata_by_magadal_takalotmizdamnot.length / temp_cardata_by_magadal.length) * 100);
            setCardata_by_magadal_hhstand_grade((temp_cardata_by_magadal_hhstand.length / temp_cardata_by_magadal.length) * 100);
        }
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px', cursor: 'pointer' }} onClick={(e) => toggleCollapse(e)}>
            <CardHeader>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>זמינות {props.magadal.name}</h3>
            </CardHeader>
            <CardBody style={{ textAlign: 'center', margin: 'auto' }}>
                <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <CircularProgressbar value={cardata_by_magadal_zamin_grade} text={`${cardata_by_magadal_zamin_grade.toFixed(0)}%`} styles={{
                        root: {},
                        path: {
                            stroke: `#9925be`,
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
                            fill: '#9925be',
                            fontSize: '18px',
                        },
                        background: {
                            fill: '#3e98c7',
                        },
                    }} />
                </div>

                {collapseOpen ?
                    <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                        <h6>{props.magadal.name} בטיפול</h6>
                        <Progress color="guypurple" value={cardata_by_magadal_intipul_grade} style={{ height: '10px', marginBottom: '8px' }}>{cardata_by_magadal_intipul_grade.toFixed(0)}%</Progress>
                        <h6>{props.magadal.name} חריגי טיפול</h6>
                        <Progress color="guypurple" value={cardata_by_magadal_harigtipul_grade} style={{ height: '10px', marginBottom: '8px' }}>{cardata_by_magadal_harigtipul_grade.toFixed(0)}%</Progress>
                        <h6>{props.magadal.name} בתקלות מזדמנות</h6>
                        <Progress color="guypurple" value={cardata_by_magadal_takalotmizdamnot_grade} style={{ height: '10px', marginBottom: '8px' }}>{cardata_by_magadal_takalotmizdamnot_grade.toFixed(0)}%</Progress>
                        <h6>{props.magadal.name} עומדים על ח"ח</h6>
                        <Progress color="guypurple" value={cardata_by_magadal_hhstand_grade} style={{ height: '10px', marginBottom: '8px' }}>{cardata_by_magadal_hhstand_grade.toFixed(0)}%</Progress>
                    </div>
                    : <CardFooter></CardFooter>}
            </CardBody>
        </Card>
    );
}

export default withRouter(Zminot_Magadal_DashboardCard);