import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import { Link, withRouter, Redirect } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom'

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

import tzahalpng from "assets/img/unitsimg/defaultTzahal.png";
import JobFilter from "components/tafkidipedia/Filters/JobFilter";

function Tafkidipediapage() {
    const [originaljobs, setOriginalJobs] = useState([])
    const [jobs, setJobs] = useState([])

    const [jobfilter, setJobFilter] = useState([])

    function init() {
        getJobs();
    }

    const getJobs = async () => {
        let alljobs = [];
        let result = await axios.get(`http://localhost:8000/api/smartjobs2`);
        alljobs = result.data
        let result2 = await axios.get(`http://localhost:8000/api/smartjobs`);
        for (let i = 0; i < result2.data.length; i++) {
            let isalreadyinarr = false;
            for (let j = 0; j < alljobs.length; j++) {
                if (result2.data[i]._id == alljobs[j]._id) {
                    isalreadyinarr = true;
                }
            }
            if (isalreadyinarr == false) {
                alljobs.push(result2.data[i])
            }
        }
        setJobs(alljobs);
        setOriginalJobs(alljobs);
    }

    const setfilter = (evt) => {
        if (evt.currentTarget.name == 'population') {
            if (jobfilter.populationfilter) {
                let temppopulationfilter = [...jobfilter.populationfilter]
                const index = temppopulationfilter.indexOf(evt.currentTarget.value);
                if (index > -1) {
                    temppopulationfilter.splice(index, 1);
                }
                else {
                    temppopulationfilter.push(evt.currentTarget.value)
                }
                setJobFilter({ ...jobfilter, populationfilter: temppopulationfilter })
            }
            else {
                setJobFilter({ ...jobfilter, populationfilter: [evt.currentTarget.value] })
            }
        }
        if (evt.currentTarget.name == 'unit') {
            if (jobfilter.unitfilter) {
                let tempunitfilter = [...jobfilter.unitfilter]
                const index = tempunitfilter.indexOf(evt.currentTarget.value);
                if (index > -1) {
                    tempunitfilter.splice(index, 1);
                }
                else {
                    tempunitfilter.push(evt.currentTarget.value)
                }
                setJobFilter({ ...jobfilter, unitfilter: tempunitfilter })
            }
            else {
                setJobFilter({ ...jobfilter, unitfilter: [evt.currentTarget.value] })
            }
        }
        if (evt.currentTarget.name == 'migzar') {
            if (jobfilter.migzarfilter) {
                let tempmigzarfilter = [...jobfilter.migzarfilter]
                const index = tempmigzarfilter.indexOf(evt.currentTarget.value);
                if (index > -1) {
                    tempmigzarfilter.splice(index, 1);
                }
                else {
                    tempmigzarfilter.push(evt.currentTarget.value)
                }
                setJobFilter({ ...jobfilter, migzarfilter: tempmigzarfilter })
            }
            else {
                setJobFilter({ ...jobfilter, migzarfilter: [evt.currentTarget.value] })
            }
        }
    }

    const applyfiltersontodata = () => {
        let tempdatabeforefilter = originaljobs;

        let myArrayUnitFiltered = [];
        if (jobfilter.unitfilter && jobfilter.unitfilter.length > 0) {
            myArrayUnitFiltered = tempdatabeforefilter.filter((el) => {
                return jobfilter.unitfilter.some((f) => {
                    return f === el.unit._id;
                });
            });
        }
        else {
            myArrayUnitFiltered = originaljobs;
        }

        let myArrayUnitAndPopulationFiltered = [];
        if (jobfilter.populationfilter && jobfilter.populationfilter.length > 0) {
            myArrayUnitAndPopulationFiltered = myArrayUnitFiltered.filter((el) => {
                return jobfilter.populationfilter.some((f) => {
                    return f === el.population._id;
                });
            });
        }
        else {
            myArrayUnitAndPopulationFiltered = myArrayUnitFiltered;
        }

        let myArrayUnitAndPopulationAndMigzarFiltered = [];
        if (jobfilter.migzarfilter && jobfilter.migzarfilter.length > 0) {
            myArrayUnitAndPopulationAndMigzarFiltered = myArrayUnitAndPopulationFiltered.filter((el) => {
                return jobfilter.migzarfilter.some((f) => {
                    return f === el.migzar;
                });
            });
        }
        else {
            myArrayUnitAndPopulationAndMigzarFiltered = myArrayUnitAndPopulationFiltered;
        }

        setJobs(myArrayUnitAndPopulationAndMigzarFiltered)
    }

    useEffect(() => {
        applyfiltersontodata()
    }, [jobfilter]);

    const CheckImgPath = (englishname) => {
        try {
            require(`assets/img/unitsimg/${englishname}.png`)
        }
        catch (err) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <div style={{ width: '95%' }}>
                <Card>
                    <CardBody>
                        <Row style={{ direction: "rtl", paddingTop: '10px' }}>
                            <JobFilter originaljobs={originaljobs} jobfilter={jobfilter} setfilter={setfilter} />
                        </Row>
                        <Row style={{ direction: "rtl", paddingTop: '10px' }}>
                            {jobs ? jobs.map((job, index) => (
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                    <Card style={{ direction: 'ltr', background: '#1e1e2f', height: '200px' }}>
                                        <CardBody style={{ direction: 'rtl',padding:'0px'}}>
                                            <Row style={{height: '200px',width:'100%',margin:'0px'}}>
                                                <Col xs={12} md={5} style={{margin:'auto'}}>
                                                    {job.unit.englishname ? CheckImgPath(job.unit.englishname) == true ? <img src={require(`assets/img/unitsimg/${job.unit.englishname}.png`)}></img> : <img src={tzahalpng}></img> : <img src={tzahalpng}></img>}
                                                    {/*job.unit.englishname ? CheckImgPath(job.unit.englishname) == true ? <img src={require(`assets/img/unitsimg/${job.unit.englishname}.png`).default}></img> : <img src={tzahalpng}></img> : <img src={tzahalpng}></img>*/} 
                                                </Col>
                                                <Col xs={12} md={7} style={{ padding: '0px',overflow:'auto',maxHeight:'200px'}}>
                                                    <Link to={`/displayjob/${job._id}`}>
                                                        <button className="btn-empty"/*value={user._id} onClick={Toggle}*/ style={{ width: '100%' }}>
                                                            <h2 style={{ color: 'white', marginBottom: '10px' }}>{job.jobname}</h2>
                                                        </button>
                                                    </Link>
                                                    <h3 style={{ color: 'grey', marginBottom: '10px', textAlign: 'center' }}>{job.unit.name}</h3>
                                                    {job.meaish ?
                                                        // <Link to={`/profilepage/${job.meaish._id}`}>
                                                        <h4 style={{ color: 'gray', marginBottom: '10px', textAlign: 'center' }}>{job.meaish.name ? job.meaish.name : null} {job.meaish.lastname ? job.meaish.lastname : null}</h4>
                                                        // </Link> 
                                                        :
                                                        <h4 style={{ color: 'gray', marginBottom: '10px', textAlign: 'center' }}> </h4>
                                                    }
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )) : null}
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

export default withRouter(Tafkidipediapage);