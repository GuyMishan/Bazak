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
import NormalAnimatedMultiSelect from 'components/general/Select/NormalAnimatedMultiSelect'

import deletepic from "assets/img/delete.png";

const UnitsFilterObject = (props) => {
    //units
    const [gdods, setGdods] = useState([]);
    const [hativas, setHativas] = useState([]);
    const [ogdas, setOgdas] = useState([]);
    const [pikods, setPikods] = useState([]);

    async function unitsFilterHierarchy(CurrentUnitFilterType, CurrentUnitFilterId) {
        let tempCurrentUnitFilterId = [...CurrentUnitFilterId];
        let temp2 = [];
        if (CurrentUnitFilterType != 'pikod') {
            for(let i=0;i<tempCurrentUnitFilterId.length;i++){
                await getCurrentParentId(CurrentUnitFilterType, tempCurrentUnitFilterId[i])
                .then(response =>{
                 let flag = false;
                    for(let j=0;j<temp2.length;j++){
                        if(temp2[j] == response){
                            flag = true;
                        }
                    }
                    if(flag == false){
                        temp2.push(response);
                    }
                }
                )
            }
            tempCurrentUnitFilterId = temp2;
            if (CurrentUnitFilterType == 'gdod') {
                CurrentUnitFilterType = 'hativa';
                props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = tempCurrentUnitFilterId }))
            }
            else {
                if (CurrentUnitFilterType == 'hativa') {
                    CurrentUnitFilterType = 'ogda';
                    props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = tempCurrentUnitFilterId }))
                }
                else {
                    if (CurrentUnitFilterType == 'ogda') {
                        CurrentUnitFilterType = 'pikod';
                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = tempCurrentUnitFilterId }))
                    }
                }
            }
            return unitsFilterHierarchy(CurrentUnitFilterType, tempCurrentUnitFilterId);
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
        let fullresposne = [];
        await axios.get("http://localhost:8000/api/pikod",)
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    fullresposne[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setPikods(fullresposne);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const loadOgdas = async (pikodid) => {
        if(pikodid){
        let temppikodogdas = [];
        await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: pikodid })
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    temppikodogdas[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setOgdas(temppikodogdas);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    const loadHativas = async (ogdaid) => {
        let tempogdahativas = [];
        await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: ogdaid })
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    tempogdahativas[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setHativas(tempogdahativas);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const loadGdods = async (hativaid) => {
        let temphativasgdods = [];
        await axios.post("http://localhost:8000/api/gdod/gdodsbyhativaid", { hativa: hativaid })
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    temphativasgdods[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setGdods(temphativasgdods);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function init() {
        loadPikods();
        if(props.unitfilterobject.gdod != undefined || props.unitfilterobject.hativa != undefined || props.unitfilterobject.ogda != undefined || props.unitfilterobject.pikod != undefined){
            unitsFilterHierarchy(Object.keys(props.unitfilterobject)[1],Object.values(props.unitfilterobject)[1]);
        }
        if(props.user.hativaid){
            loadGdods(props.user.hativaid );
            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = [props.user.hativaid] }))
        }
        if(props.user.ogdaid){
            loadHativas(props.user.ogdaid);
            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = [props.user.ogdaid] }))
        }
        if(props.user.pikodid){
            loadOgdas(props.user.pikodid );
            props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = [props.user.pikodid] }))
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
                {((props.user.role == "0" || props.user.role == "5")) ?
                      <>
                        {(!(props.unitfilterobject.ogda) || !(props.unitfilterobject.ogda.length > 0)) ?
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                            <h6>פיקוד</h6>

                                <NormalAnimatedMultiSelect data={pikods}
                                 handleChange2={(selectedOption) => {
                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].pikod }))
                                      }
                                }}
                                 name={'pikods'} 
                                 val={props.unitfilterobject.pikod ? props.unitfilterobject.pikod : []} />

                        </Col> 
                        :
                        <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                               <h6>פיקוד</h6>

                                 <NormalAnimatedMultiSelect data={pikods}
                                 handleChange2={(selectedOption) => {
                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                        tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].pikod = tempvalues }))
                                    }
                                    else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].pikod }))
                                    }
                                 }}
                                 name={'pikods'} 
                                 val={props.unitfilterobject.pikod ? props.unitfilterobject.pikod : []} isDisabled={true}/>
                            </Col>}
                    </> : null}

                {((props.user.role == "0") || props.user.role == "5" || (props.user.role == "4")) ?
                    <>
                        {((props.unitfilterobject.pikod) && (props.unitfilterobject.pikod.length > 0) && (!(props.unitfilterobject.hativa) || !(props.unitfilterobject.hativa.length > 0))) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>אוגדה</h6>

                                <NormalAnimatedMultiSelect data={ogdas}
                                 handleChange2={(selectedOption) => {

                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].ogda }))
                                      }
                                }}
                                 name={'ogdas'} 
                                 val={props.unitfilterobject.ogda ? props.unitfilterobject.ogda : []} />
                            </Col>
                            :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>אוגדה</h6>

                                <NormalAnimatedMultiSelect data={ogdas}
                                 name={'ogdas'} 
                                 handleChange2={(selectedOption) => {

                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].ogda = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].ogda }))
                                      }
                                }}
                                 val={props.unitfilterobject.ogda ? props.unitfilterobject.ogda : []} isDisabled={true}/>
                            </Col>}

                    </> : null}
                
                {((props.user.role == "0") || props.user.role == "5" || (props.user.role == "4") || (props.user.role == "3")) ?
                    <>
                        {((props.unitfilterobject.ogda) && (props.unitfilterobject.ogda.length > 0) && (!(props.unitfilterobject.gdod) || !(props.unitfilterobject.gdod.length > 0))) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>חטיבה</h6>

                                <NormalAnimatedMultiSelect data={hativas}
                                 handleChange2={(selectedOption) => {

                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].hativa }))
                                      }
                                }}
                                 name={'hativas'} 
                                 val={props.unitfilterobject.hativa ? props.unitfilterobject.hativa : []} />
                            </Col>
                        :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>חטיבה</h6>

                                <NormalAnimatedMultiSelect data={hativas}
                                 handleChange2={(selectedOption) => {

                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].hativa = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].hativa }))
                                      }
                                }}
                                 name={'hativas'} 
                                 val={props.unitfilterobject.hativa ? props.unitfilterobject.hativa : []} isDisabled={true}/>
                            </Col>}
                    </> : null}

                {((props.user.role == "0") || props.user.role == "5" || (props.user.role == "4") || (props.user.role == "3") || (props.user.role == "2")) ?
                    <>
                        {((props.unitfilterobject.hativa) && (props.unitfilterobject.hativa.length > 0)) ?
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>גדוד</h6>

                                <NormalAnimatedMultiSelect data={gdods}
                                 handleChange2={(selectedOption) => {
                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].gdod = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].gdod }))
                                      }
                                }}
                                 name={'gdods'} 
                                 val={props.unitfilterobject.gdod ? props.unitfilterobject.gdod : []} />
                            </Col>
                        :
                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                <h6>גדוד</h6>

                                <NormalAnimatedMultiSelect data={gdods}
                                 handleChange2={(selectedOption) => {
                                    if (selectedOption.length != 0) {
                                        let tempvalues = [];
                                        for (let i = 0; i < selectedOption.length; i++) {
                                          tempvalues.push(selectedOption[i].value);
                                        }
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].gdod = tempvalues }))
                                      }
                                      else {
                                        props.setUnitsfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].gdod }))
                                      }
                                }}
                                 name={'gdods'} 
                                 val={props.unitfilterobject.gdod ? props.unitfilterobject.gdod : []} isDisabled={true}/>
                            </Col>}
                    </> : null} 
            </Row>
            {props.user.role!='1' ?
            <Button type="button" onClick={() => {
                props.setUnitsfilterarray(currentSpec => currentSpec.filter(x => x.id !== props.unitfilterobject.id));
            }}><img src={deletepic} height='20px'></img></Button>
            : null} 
        </div>
    );
}
export default withRouter(UnitsFilterObject);