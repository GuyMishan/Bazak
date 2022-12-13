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

    async function unitsFilterHierarchy(CurrentUnitFilterType, CurrentUnitFilterId) {
        if (CurrentUnitFilterType != 'pikod') {
            CurrentUnitFilterId = await getCurrentParentId(CurrentUnitFilterType, CurrentUnitFilterId);
            if (CurrentUnitFilterType == 'gdod') {
                CurrentUnitFilterType = 'hativa';
                props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = CurrentUnitFilterId }))
            }
            else {
                if (CurrentUnitFilterType == 'hativa') {
                    CurrentUnitFilterType = 'ogda';
                    props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = CurrentUnitFilterId }))
                }
                else {
                    if (CurrentUnitFilterType == 'ogda') {
                        CurrentUnitFilterType = 'pikod';
                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = CurrentUnitFilterId }))
                    }
                }
            }
            return unitsFilterHierarchy(CurrentUnitFilterType, CurrentUnitFilterId);
        }
    }

    async function getCurrentParentId(CurrentUnitFilterType, CurrentUnitFilterId) {
            let response = await axios.get(`http://localhost:8000/api/${CurrentUnitFilterType}/${CurrentUnitFilterId}`)
            if (CurrentUnitFilterType == 'gdod') {
                return response.data.hativa;
            }
            if (CurrentUnitFilterType == 'hativa') {
                return response.data.ogda;
            }
            if (CurrentUnitFilterType == 'ogda') {
                return response.data.pikod;
            }
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

    const loadBackwords = async (unitType, unitId) => {
        let temp = [];
        let parentUnitId = await getCurrentParentId(unitType, unitId);
        if (unitType == 'gdod') {
            await axios.post(`http://localhost:8000/api/gdod/gdodsbyhativaid`, { hativa: parentUnitId })
            .then(response => {
                for (let j = 0; j < response.data.length; j++)
                    temp.push(response.data[j])
            })
            .catch((error) => {
                console.log(error);
            })
            setGdods(temp);
        }
        if (unitType == 'hativa') {
            await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: parentUnitId })
            .then(response => {
                for (let j = 0; j < response.data.length; j++)
                temp.push(response.data[j])
            })
            .catch((error) => {
                console.log(error);
            })
            setHativas(temp);
        }
        if (unitType == 'ogda') {
            await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: parentUnitId })
            .then(response => {
                for (let j = 0; j < response.data.length; j++)
                temp.push(response.data[j])
            })
            .catch((error) => {
                console.log(error);
            })
            setOgdas(temp);
        }
    }

    function init() {
        if(props.unitfilterobject.gdod != undefined || props.unitfilterobject.hativa != undefined || props.unitfilterobject.ogda != undefined || props.unitfilterobject.pikod != undefined){
            loadPikods();
            loadBackwords(Object.keys(props.unitfilterobject)[1],Object.values(props.unitfilterobject)[1]);
            unitsFilterHierarchy(Object.keys(props.unitfilterobject)[1],Object.values(props.unitfilterobject)[1]);
        }
        else{
           loadPikods();
        }
        if(props.user.hativaid){
            loadGdods(props.user.hativaid );
            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = props.user.hativaid }))
        }
        if(props.user.ogdaid){
            loadHativas(props.user.ogdaid);
            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = props.user.ogdaid }))
        }
        if(props.user.pikodid){
            loadOgdas(props.user.pikodid );
            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = props.user.pikodid }))
        }
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
            {props.user.role!='1' ?
            <Button type="button" onClick={() => { props.setUnitsfilterarray(currentSpec => currentSpec.filter(x => x.id !== props.unitfilterobject.id)) }}><img src={deletepic} height='20px'></img></Button>
            : null} 
        </div>
    );
}
export default withRouter(UnitsFilterObject);