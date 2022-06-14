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
import SortingTable from 'components/tafkidipedia/FinalEshkolByMahzorSortingTable2/SortingTable';

function DisplayMahzorFinalEshkol(props) {
    const [mahzorhaseshkols, setMahzorhaseshkols] = useState(false);

    function init() {
        getMahzorEshkol();
    }

    const getMahzorEshkol = async () => {
        let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${props.mahzorid}`)
        let tempeshkolbymahzorid = response.data;
        if (tempeshkolbymahzorid.length > 0)
            setMahzorhaseshkols(true)
        else {
            setMahzorhaseshkols(false)
        }
    }

    async function CalculateMahzorFinalEshkol() {
        // //delete all eshkols of certain mahzor
        // let response1 = await axios.delete(`http://localhost:8000/api/finaleshkol/deletemahzorfinaleshkol/${props.mahzorid}`)
        // let tempdata = response1.data;
        // // console.log(tempdata)

        let tempmahzoreshkol = [];// final result

        //get all jobs of mahzor
        let response2 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${props.mahzorid}`)
        let tempmahzorjobs = response2.data;
        console.log(tempmahzorjobs)

        //get all candidatepreferences of mahzor
        let response3 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${props.mahzorid}`)
        let tempcandidatespreferencesdata = response3.data;
        for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
            for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
                let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
                tempcandidatespreferencesdata[i].certjobpreferences[j] = result1.data;
                delete tempcandidatespreferencesdata[i].certjobpreferences[j].__v;
                delete tempcandidatespreferencesdata[i].certjobpreferences[j]._id;
            }
            for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
                let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
                tempcandidatespreferencesdata[i].noncertjobpreferences[j] = result1.data;
                delete tempcandidatespreferencesdata[i].noncertjobpreferences[j].__v;
                delete tempcandidatespreferencesdata[i].noncertjobpreferences[j]._id;
            }
        }
        console.log(tempcandidatespreferencesdata)

        //get all unitpreferences of mahzor
        let response4 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${props.mahzorid}`)
        let tempunitspreferences = response4.data;
        console.log(tempunitspreferences)

        //init eshkols
        for (let i = 0; i < tempmahzorjobs.length; i++) {
            tempmahzoreshkol[i] = ({ mahzor: props.mahzorid, jobinmahzor: tempmahzorjobs[i]._id, finalconfirmation: false, candidatesineshkol: [] })
        }

        for (let i = 0; i < tempmahzoreshkol.length; i++) {

            //calculate eshkols candidate preferences 
            for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
                for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                    if (tempcandidatespreferencesdata[j].certjobpreferences[k].jobinmahzor == tempmahzoreshkol[i].jobinmahzor) {
                        tempmahzoreshkol[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].certjobpreferences[k].rank })
                    }
                }
                for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                    if (tempcandidatespreferencesdata[j].noncertjobpreferences[k].jobinmahzor == tempmahzoreshkol[i].jobinmahzor) {
                        tempmahzoreshkol[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].noncertjobpreferences[k].rank })
                    }
                }
            }

            //calculate eshkols unit preferences 
            for (let l = 0; l < tempunitspreferences.length; l++) {
                if (tempunitspreferences[l].jobinmahzor._id == tempmahzoreshkol[i].jobinmahzor) {
                    for (let m = 0; m < tempunitspreferences[l].preferencerankings.length; m++) {
                        let flag = false;  //flag = is candidate exists in certain eshkol 
                        for (let n = 0; n < tempmahzoreshkol[i].candidatesineshkol.length; n++) {
                            if (tempmahzoreshkol[i].candidatesineshkol[n].candidate == tempunitspreferences[l].preferencerankings[m].candidate) {
                                flag = true;
                                tempmahzoreshkol[i].candidatesineshkol[n].unitrank = tempunitspreferences[l].preferencerankings[m].rank;
                            }
                        }
                        if (flag == false) {
                            tempmahzoreshkol[i].candidatesineshkol.push({ candidate: tempunitspreferences[l].preferencerankings[m].candidate, unitrank: tempunitspreferences[l].preferencerankings[m].rank })
                        }
                    }
                }
            }
        }
        console.log("before:")
        console.log(tempmahzoreshkol)


        //post mahzor eshkols candidatesineshkol to db
        for (let i = 0; i < tempmahzoreshkol.length; i++) {
            for (let j = 0; j < tempmahzoreshkol[i].candidatesineshkol.length; j++) {
                let response1 = await axios.post(`http://localhost:8000/api/candidateineshkol`, tempmahzoreshkol[i].candidatesineshkol[j])
                let tempdata = response1.data;
                tempmahzoreshkol[i].candidatesineshkol[j] = tempdata._id
            }
        }

        console.log("after:")
        console.log(tempmahzoreshkol)

        //post mahzor eshkols to db
        for (let i = 0; i < tempmahzoreshkol.length; i++) {
            let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol[i])
            // let tempdata = response1.data;
        }
        window.location.reload();
    }

    useEffect(() => {
        init();
    }, [])

    return (
        <>
            <Row>
                <Col>
                    <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת אשכולות</h3>
                </Col>
                <Col>
                    <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit', float: 'left' }} to={`/displaymahzoreshkols/${false}/${props.mahzorid}`}><button className="btn" style={{ padding: "0.5rem" }}>פתח במסך מלא</button></Link>
                </Col>
            </Row>

            {/* <Row style={{ direction: 'rtl', textAlign: 'center' }}>
                <Col xs={12} md={3}>
                    <h5 style={{ color: "rgb(255 97 97)" }}>&#9632; בחירת מתמודד בלבד</h5>
                </Col>
                <Col xs={12} md={3}>
                    <h5 style={{ color: "rgb(255 229 63)" }}>&#9632; בחירת יחידה בלבד</h5>
                </Col>
                <Col xs={12} md={3}>
                    <h5 style={{ color: 'rgb(106 255 92)' }}>&#9632; בחירת מתמודד ויחידה</h5>
                </Col>
                <Col xs={12} md={3}>
                    <h5 style={{ color: 'rgb(98 85 255)' }}>&#9632; הוסף ע"י מנהל מערכת</h5>
                </Col>
            </Row> */}

            <SortingTable mahzorid={props.mahzorid} editable={props.editable} />

            {mahzorhaseshkols ? null
                : <Button onClick={() => CalculateMahzorFinalEshkol()}>חשב אשכולות</Button>}
        </>
    );
}

export default withRouter(DisplayMahzorFinalEshkol);