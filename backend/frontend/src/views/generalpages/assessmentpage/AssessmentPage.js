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
import AssessmentComponent from "./AssessmentComponent";
import AssessmentFormModal from "./AssessmentFormModal"
import editpic from "assets/img/edit.png";
import editpic_black from "assets/img/edit_black.png";

function AssessmentPage(props) {
    const { user } = isAuthenticated()

    const [assessments, setAssessments] = useState([]);
    //assessmentdata form modal
    const [isassessmentdataformopen, setIsassessmentdataformopen] = useState(false);
    const [assessmentdataidformodal, setAssessmentdataidformodal] = useState(undefined);
    //
    const [pikods, setPikods] = useState([]);
    //spinner
    const [isdataloaded, setIsdataloaded] = useState(false);

    async function init() {
        GetAssessments();
        loadPikods();
    }

    async function GetAssessments() {
        await axios.get(`http://localhost:8000/api/assessment`)
            .then(response => {
                setAssessments(response.data)
                setIsdataloaded(true);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function Toggle(evt) {
        if (evt.currentTarget.value == '') {
            setAssessmentdataidformodal(undefined)
        }
        else {
            setAssessmentdataidformodal(evt.currentTarget.value)
        }
        setIsassessmentdataformopen(!isassessmentdataformopen);
    }

    function ToggleForModal(evt) {
        setIsassessmentdataformopen(!isassessmentdataformopen);
        init();
    }

    const loadPikods = async () => {
        await axios.get("http://localhost:8000/api/pikod",)
            .then(response => {
                setPikods(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        init();
    }, [props.match])

    return (
        !isdataloaded ?
            <div style={{ width: '50%', marginTop: '30%' }}>
                <PropagateLoader color={'#ff4650'} loading={true} size={25} />
            </div>
            :
            <div>
                <AssessmentFormModal isOpen={isassessmentdataformopen} assessmentdataid={assessmentdataidformodal} Toggle={Toggle} ToggleForModal={ToggleForModal} unittype={props.unittype} unitid={props.unitid} user={user}/>

                {user.role == '0' ?
                    <div style={{ display: 'flex', justifyContent: 'right', paddingBottom: '15px' }}>
                        <button className="btn-new-blue" value={undefined} onClick={Toggle} style={{ marginRight: '10px' }}>הוסף הערכת מצב</button>
                    </div> : null}

                <div>
                    <Row>
                        {assessments.map((assessment, i) => (
                            assessment ?
                                <>
                                    {user.role == '0' || (user.role == '4' && user.pikodid && user.pikodid == assessment.pikod) ?
                                        <div style={{ display: 'flex', justifyContent: 'right' }}>
                                            {props.theme == 'white-content' ? <button className='btn-empty' style={{ height: "50px" }} value={assessment._id} onClick={Toggle}><img src={editpic_black} style={{ height: "100%" }}></img></button>
                                                : <button className='btn-empty' style={{ height: "50px" }} value={assessment._id} onClick={Toggle}><img src={editpic} style={{ height: "100%" }} ></img></button>}
                                        </div> : null}

                                    <AssessmentComponent theme={props.theme} match={props.match} assessment={assessment} pikods={pikods} />
                                </>
                                : null))}
                    </Row>
                </div>
            </div>
    );
}
export default withRouter(AssessmentPage);