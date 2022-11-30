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

const CarTypesFilterObject = (props) => {
  //cartypes
  const [makats, setMakats] = useState([]);
  const [mkabazs, setMkabazs] = useState([]);
  const [magads, setMagads] = useState([]);
  const [magadals, setMagadals] = useState([]);

  const loadMagadals = async () => {
    await axios.get(`http://localhost:8000/api/magadal`)
      .then(response => {
        setMagadals(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadMagads = async (magadalid) => {
    let tempmagadalsmagads = [];
    if (magadalid != undefined) {
      await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++)
            tempmagadalsmagads.push(response.data[j])
        })
        .catch((error) => {
          console.log(error);
        })
      setMagads(tempmagadalsmagads);
    }
  }

  const loadMkabazs = async (magadid) => {
    let tempmagadmkabazs = [];
    if (magadid != undefined) {
      await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++)
            tempmagadmkabazs.push(response.data[j])
        })
        .catch((error) => {
          console.log(error);
        })
      setMkabazs(tempmagadmkabazs);
    }
  }

  const loadMakats = async (mkabazid) => {
    let tempmkabazmakats = [];
    if (mkabazid != undefined) {
      await axios.get(`http://localhost:8000/api/makat/makatsbymkabaz/${mkabazid}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++)
            tempmkabazmakats.push(response.data[j])
        })
        .catch((error) => {
          console.log(error);
        })
      setMakats(tempmkabazmakats);
    }
  }

  function init() {
    loadMagadals();
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
            <Select data={magadals}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magadal = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magadal }))
                }
              }} val={props.cartypesfilterobject.magadal ? props.cartypesfilterobject.magadal : undefined} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד על</h6>
            <Select data={magadals}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magadal = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magadal }))
                }
              }} val={props.cartypesfilterobject.magadal ? props.cartypesfilterobject.magadal : undefined} isDisabled={true} />
          </Col>}

        {((props.cartypesfilterobject.magadal) && !(props.cartypesfilterobject.mkabaz)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד</h6>
            <Select data={magads}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magad = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magad }))
                }
              }} val={props.cartypesfilterobject.magad ? props.cartypesfilterobject.magad : undefined} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מאגד</h6>
            <Select data={magads}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].magad = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].magad }))
                }
              }} val={props.cartypesfilterobject.magad ? props.cartypesfilterobject.magad : undefined} isDisabled={true} />
          </Col>}

        {((props.cartypesfilterobject.magad) && !(props.cartypesfilterobject.makat)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מקבץ</h6>
            <Select data={mkabazs}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].mkabaz = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].mkabaz }))
                }
              }} val={props.cartypesfilterobject.mkabaz ? props.cartypesfilterobject.mkabaz : undefined} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מקבץ</h6>
            <Select data={mkabazs}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].mkabaz = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].mkabaz }))
                }
              }} val={props.cartypesfilterobject.mkabaz ? props.cartypesfilterobject.mkabaz : undefined} isDisabled={true} />
          </Col>}

        {((props.cartypesfilterobject.mkabaz)) ?
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מק"ט</h6>
            <Select data={makats}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].makat = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].makat }))
                }
              }} val={props.cartypesfilterobject.makat ? props.cartypesfilterobject.makat : undefined} />
          </Col> :
          <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
            <h6>מק"ט</h6>
            <Select data={makats}
              handleChange2={(selectedOption) => {
                if (selectedOption.value != "בחר") {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { v[props.index].makat = selectedOption.value }))
                }
                else {
                  props.setCartypesfilterarray(currentSpec => produce(currentSpec, v => { delete v[props.index].makat }))
                }
              }} val={props.cartypesfilterobject.makat ? props.cartypesfilterobject.makat : undefined} isDisabled={true} />
          </Col>}
      </Row>
      <Button type="button" onClick={() => { props.setCartypesfilterarray(currentSpec => currentSpec.filter(x => x.id !== props.cartypesfilterobject.id)) }}><img src={deletepic} height='20px'></img></Button>
    </div>
  );
}
export default withRouter(CarTypesFilterObject);