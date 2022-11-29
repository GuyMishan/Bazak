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
    ModalBody
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import Select from 'components/general/Select/AnimatedSelect'
import deletepic from "assets/img/delete.png";

const UnitsFilterObject = (props) => {
    //units
    const [gdods, setGdods] = useState([]);
    const [hativas, setHativas] = useState([]);
    const [ogdas, setOgdas] = useState([]);
    const [pikods, setPikods] = useState([]);

    const loadPikods = async () => {
        await axios.get("http://localhost:8000/api/pikod",)
            .then(response => {
                setPikods(response.data);
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
        setOgdas(temppikodogdas);
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
        setHativas(tempogdahativas);
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
        setGdods(temphativasgdods);
    }

    function init() {
        loadPikods();
    }

    useEffect(() => {
        setOgdas([]);
        loadOgdas(props.unitfilterobject.pikod);
    }, [props.unitfilterobject.pikod]);

    useEffect(() => {
      setHativas([]);
      loadHativas(props.unitfilterobject.ogda);
    }, [props.unitfilterobject.ogda]);

    useEffect(() => {
      setGdods([]);
      loadGdods(props.unitfilterobject.hativa);
    }, [props.unitfilterobject.hativa]);

    useEffect(() => {
        init();
    }, [])

    return (
        <div>
            <Row style={{ padding: '0px',paddingTop:'5px' }}>
                {((props.user.role == "0")) ?
                    <>
                        {(!(props.unitfilterobject.ogda)) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>פיקוד</h6>
                                <Select data={pikods}
                                    handleChange2={(selectedOption) => {
                                        if (selectedOption.value != "בחר") {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = selectedOption.value }))
                                        }
                                        else {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].pikod }))
                                        }
                                    }} val={props.unitfilterobject.pikod ? props.unitfilterobject.pikod : undefined} />
                            </Col> :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>פיקוד</h6>
                                <Select data={pikods}
                                    handleChange2={(selectedOption) => {
                                        if (selectedOption.value != "בחר") {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = selectedOption.value }))
                                        }
                                        else {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].pikod }))
                                        }
                                    }} val={props.unitfilterobject.pikod ? props.unitfilterobject.pikod : undefined} isDisabled={true} />
                            </Col>}
                    </> : null}

                {((props.user.role == "0") || (props.user.role == "4")) ?
                    <>
                        {((props.unitfilterobject.pikod) && !(props.unitfilterobject.hativa)) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>אוגדה</h6>
                                <Select data={ogdas}
                                    handleChange2={(selectedOption) => {
                                        if (selectedOption.value != "בחר") {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = selectedOption.value }))
                                        }
                                        else {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].ogda }))
                                        }
                                    }} val={props.unitfilterobject.ogda ? props.unitfilterobject.ogda : undefined} />
                            </Col> :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>אוגדה</h6>
                                <Select data={ogdas}
                                    handleChange2={(selectedOption) => {
                                        if (selectedOption.value != "בחר") {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = selectedOption.value }))
                                        }
                                        else {
                                            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].ogda }))
                                        }
                                    }} val={props.unitfilterobject.ogda ? props.unitfilterobject.ogda : undefined} isDisabled={true} />
                            </Col>}
                    </> : null}
                
                {((props.user.role == "0") || (props.user.role == "4") || (props.user.role == "3")) ?
                    <>
                        {((props.unitfilterobject.ogda) && !(props.unitfilterobject.gdod)) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>חטיבה</h6>
                                <Select data={hativas}
                                 handleChange2={(selectedOption =>{
                                    if (selectedOption.value != "בחר") {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = selectedOption.value }))
                                    }
                                    else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].hativa }))
                                    }
                                 })} val={props.unitfilterobject.hativa ? props.unitfilterobject.hativa : undefined} />
                            </Col> :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>חטיבה</h6>
                            <Select data={hativas}
                             handleChange2={(selectedOption =>{
                                if (selectedOption.value != "בחר") {
                                    props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = selectedOption.value }))
                                }
                                else {
                                    props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].hativa }))
                                }
                             })} val={props.unitfilterobject.hativa ? props.unitfilterobject.hativa : undefined} isDisabled={true}/>
                            </Col>}
                    </> : null}

                {((props.user.role == "0") || (props.user.role == "4") || (props.user.role == "3") || (props.user.role == "2")) ?
                    <>
                        {((props.unitfilterobject.hativa)) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>גדוד</h6>
                                <Select data={gdods}
                                 handleChange2={(selectedOption =>{
                                    if (selectedOption.value != "בחר") {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].gdod = selectedOption.value }))
                                    }
                                    else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].gdod }))
                                    }
                                 })} val={props.unitfilterobject.gdod ? props.unitfilterobject.gdod : undefined} />
                            </Col> :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>גדוד</h6>
                                <Select data={gdods}
                                 handleChange2={(selectedOption =>{
                                    if (selectedOption.value != "בחר") {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].gdod = selectedOption.value }))
                                    }
                                    else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].gdod }))
                                    }
                                 })} val={props.unitfilterobject.gdod ? props.unitfilterobject.gdod : undefined} isDisabled={true}/>
                            </Col>}
                    </> : null} 
            </Row>

            <Button type="button" onClick={() => { props.setUnitsfilterarray(currentSpec => currentSpec.filter(x => x.id !== props.unitfilterobject.id)) }}><img src={deletepic} height='20px'></img></Button>
        </div>
    );
}
export default withRouter(UnitsFilterObject);