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

const CarTypesFilterObject = (props) => {
  //cartypes
  const [makats, setMakats] = useState([]);
  const [mkabazs, setMkabazs] = useState([]);
  const [magads, setMagads] = useState([]);
  const [magadals, setMagadals] = useState([]);

  async function carsFilterHierarchy(CurrentCarFilterType, CurrentCarFilterId) {
    let tempCurrentCarFilterId = [...CurrentCarFilterId];
        let temp2 = [];
    if (CurrentCarFilterType != 'magadal') {
      for(let i=0;i<tempCurrentCarFilterId.length;i++){
        await getCurrentParentId(CurrentCarFilterType, tempCurrentCarFilterId[i])
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
    tempCurrentCarFilterId = temp2;
        if (CurrentCarFilterType == 'makat') {
            CurrentCarFilterType = 'mkabaz';
            props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].mkabaz = tempCurrentCarFilterId }))
        }
        else {
            if (CurrentCarFilterType == 'mkabaz') {
                CurrentCarFilterType = 'magad';
                props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magad = tempCurrentCarFilterId }))
            }
            else {
                if (CurrentCarFilterType == 'magad') {
                    CurrentCarFilterType = 'magadal';
                    props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magadal = tempCurrentCarFilterId }))
                }
            }
        }
        return carsFilterHierarchy(CurrentCarFilterType, tempCurrentCarFilterId);
    }
}

async function getCurrentParentId(CurrentCarFilterType, CurrentCarFilterId) {
        let response = await axios.get(`http://localhost:8000/api/${CurrentCarFilterType}/${CurrentCarFilterId}`)
        if (CurrentCarFilterType == 'makat') {
            return response.data.mkabaz;
        }
        if (CurrentCarFilterType == 'mkabaz') {
            return response.data.magad;
        }
        if (CurrentCarFilterType == 'magad') {
            return response.data.magadal;
        }
}

  const loadMagadals = async () => {
    let fullresposne = [];
    await axios.get(`http://localhost:8000/api/magadal`)
      .then(response => {
        for(let j = 0; j < response.data.length; j++){
          fullresposne[j] = { label: response.data[j].name, value: response.data[j]._id}
        }
        setMagadals(fullresposne)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadMagads = async (magadalid) => {
    if (magadalid != undefined) {
      let tempmagadalsmagads = [];
      for(let i=0;i<magadalid.length;i++){
      await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid[i]}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++){
            tempmagadalsmagads.push({label: response.data[j].name, value: response.data[j]._id});
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
      setMagads(tempmagadalsmagads);
    }
  }

  const loadMkabazs = async (magadid) => {
    let tempmagadmkabazs = [];
    if (magadid != undefined) {
      for(let i=0;i<magadid.length;i++){
      await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid[i]}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++){
            tempmagadmkabazs.push({ label: response.data[j].name, value: response.data[j]._id});
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
    setMkabazs(tempmagadmkabazs);
    }
  }

  const loadMakats = async (mkabazid) => {
    let tempmkabazmakats = [];
    if (mkabazid != undefined) {
      for(let i=0;i<mkabazid.length;i++){
      await axios.get(`http://localhost:8000/api/makat/makatsbymkabaz/${mkabazid[i]}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++){
            tempmkabazmakats.push({ label: response.data[j].name, value: response.data[j]._id});
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
    setMakats(tempmkabazmakats);
    }
  }

  function init() {
    loadMagadals();
    if(props.cartypesfilterobject.makat != undefined || props.cartypesfilterobject.mkabaz != undefined || props.cartypesfilterobject.magad != undefined || props.cartypesfilterobject.magadal != undefined){
      carsFilterHierarchy(Object.keys(props.cartypesfilterobject)[1],Object.values(props.cartypesfilterobject)[1]);
    }
  }

  useEffect(() => {
    setMagads([]);
    loadMagads(props.cartypesfilterobject.magadal);
  }, [props.cartypesfilterobject.magadal]);

  useEffect(() => {
    setMkabazs([]);
    loadMkabazs(props.cartypesfilterobject.magad);
  }, [props.cartypesfilterobject.magad]);

  useEffect(() => {
    setMakats([]);
    loadMakats(props.cartypesfilterobject.mkabaz);
  }, [props.cartypesfilterobject.mkabaz]);

  useEffect(() => {
    init();
  }, [])

  return (
    <div>
      <Row style={{ padding: '0px', paddingTop: '5px' }}>
        {(!(props.cartypesfilterobject.magad)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד על</h6>
            <NormalAnimatedMultiSelect data={magadals}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magadal = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magadal }))
                }
              }} val={props.cartypesfilterobject.magadal ? props.cartypesfilterobject.magadal : []} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד על</h6>
            <NormalAnimatedMultiSelect data={magadals}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magadal = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magadal }))
                }
              }} val={props.cartypesfilterobject.magadal ? props.cartypesfilterobject.magadal : []} isDisabled={true} />
          </Col>}

        {((props.cartypesfilterobject.magadal) && !(props.cartypesfilterobject.mkabaz)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד</h6>
            <NormalAnimatedMultiSelect data={magads}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magad = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magad }))
                }
              }} val={props.cartypesfilterobject.magad ? props.cartypesfilterobject.magad : []} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד</h6>
            <NormalAnimatedMultiSelect data={magads}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magad = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magad }))
                }
              }} val={props.cartypesfilterobject.magad ? props.cartypesfilterobject.magad : []} isDisabled = {true}/>
          </Col>}

        {((props.cartypesfilterobject.magad) && !(props.cartypesfilterobject.makat)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מקבץ</h6>
            <NormalAnimatedMultiSelect data={mkabazs}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].mkabaz = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].mkabaz }))
                }
              }} val={props.cartypesfilterobject.mkabaz ? props.cartypesfilterobject.mkabaz : []} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מקבץ</h6>
            <NormalAnimatedMultiSelect data={mkabazs}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].mkabaz = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].mkabaz }))
                }
              }} val={props.cartypesfilterobject.mkabaz ? props.cartypesfilterobject.mkabaz : []} isDisabled={true} />
          </Col>}

        {((props.cartypesfilterobject.mkabaz)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מק"ט</h6>
            <NormalAnimatedMultiSelect data={makats}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].makat = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].makat }))
                }
              }} val={props.cartypesfilterobject.makat ? props.cartypesfilterobject.makat : []} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מק"ט</h6>
            <NormalAnimatedMultiSelect data={makats}
              handleChange2={(selectedOption) => {
                if (selectedOption.length != 0) {
                  let tempvalues = [];
                  for (let i = 0; i < selectedOption.length; i++) {
                    tempvalues.push(selectedOption[i].value);
                  }
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].makat = tempvalues }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].makat }))
                }
              }} val={props.cartypesfilterobject.makat ? props.cartypesfilterobject.makat : []}  isDisabled={true}/>
          </Col>}
      </Row>
      <Button type="button" onClick={() => { props.setCartypesfilterarray(currentSpec => currentSpec.filter(x => x.id !== props.cartypesfilterobject.id)) }}><img src={deletepic} height='20px'></img></Button>
    </div>
  );
}
export default withRouter(CarTypesFilterObject);