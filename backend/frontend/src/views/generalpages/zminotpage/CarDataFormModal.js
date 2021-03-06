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
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import Select from 'components/general/Select/AnimatedSelect'
import deletepic from "assets/img/delete.png";

const CarDataFormModal = (props) => {
  const { user } = isAuthenticated()
  //cardata
  const [cardata, setCarData] = useState({})
  const [finalspecialkeytwo, setFinalSpecialKeytwo] = useState([])
  //units
  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);
  //cartypes
  const [makats, setMakats] = useState([]);
  const [mkabazs, setMkabazs] = useState([]);
  const [magads, setMagads] = useState([]);
  const [magadals, setMagadals] = useState([]);

  const loadcardata = async () => {
    await axios.get(`http://localhost:8000/api/cardata/${props.cardataid}`)
      .then(response => {
        let tempcardata = response.data[0];
        if (tempcardata.latest_recalibration_date)
          tempcardata.latest_recalibration_date = tempcardata.latest_recalibration_date.slice(0, 10);
        setCarData(tempcardata);
        setFinalSpecialKeytwo(tempcardata.tipuls);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const fixnewcardataunitsbyunittype = async () => {
    let tempcardata = {};
    if (props.unittype == 'pikod') {
      tempcardata.pikod = props.unitid
    }
    else if (props.unittype == 'ogda') {
      tempcardata.ogda = props.unitid
      let response = await axios.get(`http://localhost:8000/api/ogda/${props.unitid}`,)
      tempcardata.pikod = response.data.pikod
    }
    else if (props.unittype == 'hativa') {
      tempcardata.hativa = props.unitid
      let response1 = await axios.get(`http://localhost:8000/api/hativa/${props.unitid}`,)
      tempcardata.ogda = response1.data.ogda
      let response = await axios.get(`http://localhost:8000/api/ogda/${tempcardata.ogda}`,)
      tempcardata.pikod = response.data.pikod
    }
    else if (props.unittype == 'gdod') {
      tempcardata.gdod = props.unitid
      let response2 = await axios.get(`http://localhost:8000/api/gdod/${props.unitid}`,)
      tempcardata.hativa = response2.data.hativa
      let response1 = await axios.get(`http://localhost:8000/api/hativa/${tempcardata.hativa}`,)
      tempcardata.ogda = response1.data.ogda
      let response = await axios.get(`http://localhost:8000/api/ogda/${tempcardata.ogda}`,)
      tempcardata.pikod = response.data.pikod
    }
    setCarData(tempcardata);
  }

  const getMagadals = async () => {
    await axios.get(`http://localhost:8000/api/magadal`)
      .then(response => {
        setMagadals(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const getMagads = async (magadalid) => {
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

  const getMkabazs = async (magadid) => {
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

  const getMakats = async (mkabazid) => {
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

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "??????") {
      if (evt.target.name != 'carnumber') {
        setCarData({ ...cardata, [evt.target.name]: value });
      }
      else {
        CheckCarnumberAndSetFormdata(evt.target.value);
      }
    }
  }

  async function CheckCarnumberAndSetFormdata(carnumber) {
    if (carnumber != '') {
      let response = await axios.get(`http://localhost:8000/api/cardata/cardatabycarnumber/${carnumber}`)
      if (response.data.length > 0) {//??' ???????? ????????????
        if ((!response.data[0].gdod) || (response.data[0].gdod == null) && (!response.data[0].hativa) || (response.data[0].hativa == null) && (!response.data[0].ogda) || (response.data[0].ogda == null) && (!response.data[0].pikod) || (response.data[0].pikod == null)) {
          let tempcardata = response.data[0]
          tempcardata.gdod = cardata.gdod;
          tempcardata.hativa = cardata.hativa;
          tempcardata.ogda = cardata.ogda;
          tempcardata.pikod = cardata.pikod;
        }
        setCarData(response.data[0]);
        toast.success("?????????? ????' ?????????? ??????????");
      }
      else {
        setCarData({ ...cardata, carnumber: carnumber });
      }
    }
    else {
      setCarData({ ...cardata, carnumber: carnumber });
    }
  }

  function handleChange2(selectedOption, name) {
    if (!(selectedOption.value == "??????"))
      setCarData({ ...cardata, [name]: selectedOption.value });
    else {
      let tempcardata = { ...cardata };
      delete tempcardata[name];
      setCarData(tempcardata);
    }
  }

  const clickSubmit = event => {
    CheckFormData()
  }

  const CheckFormData = () => {//check for stuff isnt empty -> specially cartypes/units
    var flag = true;
    var ErrorReason = "";

    if (((cardata.carnumber == undefined) || (cardata.carnumber == ""))) {
      ErrorReason += ", ?????? ?????? ??'"
      flag = false;
    }

    if (((cardata.pikod == undefined) || (cardata.pikod == "")) || ((cardata.ogda == undefined) || (cardata.ogda == "")) || ((cardata.hativa == undefined) || (cardata.hativa == "")) || ((cardata.gdod == undefined) || (cardata.gdod == ""))) {
      ErrorReason += ", ???????? ?????????? ???? ??????????"
      flag = false;
    }

    if (((cardata.magadal == undefined) || (cardata.magadal == "")) || ((cardata.magad == undefined) || (cardata.magad == "")) || ((cardata.mkabaz == undefined) || (cardata.mkabaz == "")) || ((cardata.makat == undefined) || (cardata.makat == ""))) {
      ErrorReason += ", ???????? ?????? ???????? ???? ??????????"
      flag = false;
    }

    if (((cardata.zminot == undefined) || (cardata.zminot == "")) || ((cardata.kshirot == undefined) || (cardata.kshirot == ""))) {
      ErrorReason += ",???????? ?????????? ?????? ???????? ????????/????????"
      flag = false;
    }

    if ((cardata.zminot == '???? ????????') || (cardata.kshirot == '???? ????????')) {
      if (finalspecialkeytwo.length == 0) {
        ErrorReason += "???????? ?????????? ???? ???????? ????-??????????????/????-??????????????"
        flag = false;
      }
    }

    if (flag == true) {
      if (props.cardataid != undefined) {
        UpdateCarData();
      }
      else {
        CreateCarData();
      }
    } else {
      toast.error(ErrorReason);
    }
  }


  async function CreateCarData() {
    let response = await axios.get(`http://localhost:8000/api/cardata/cardatabycarnumber/${cardata.carnumber}`)
    if (response.data.length > 0) {
      if ((!response.data[0].gdod) || (response.data[0].gdod == null) && (!response.data[0].hativa) || (response.data[0].hativa == null) && (!response.data[0].ogda) || (response.data[0].ogda == null) && (!response.data[0].pikod) || (response.data[0].pikod == null)) {
        //create archivecardata
        await axios.get(`http://localhost:8000/api/cardata/${response.data[0]._id}`)
          .then(response => {
            let tempcardata = response.data[0];
            delete tempcardata._id;
            let result = axios.post(`http://localhost:8000/api/archivecardata`, tempcardata);
          })
          .catch((error) => {
            console.log(error);
          })
        //update cardata
        var tempcardataid = response.data[0]._id;
        let tempcardata = { ...cardata }
        if (tempcardata.zminot == '????????' && tempcardata.kshirot == '????????') {
          tempcardata.tipuls = [];
          tempcardata.takala_info = '';
          tempcardata.expected_repair = '';
        }
        else {
          tempcardata.tipuls = finalspecialkeytwo;
        }
        let result = await axios.put(`http://localhost:8000/api/cardata/${tempcardataid}`, tempcardata)
        toast.success(`??' ?????????? ????????????`);
        props.ToggleForModal();
      }
      else {
        toast.error("??' ?????? ???????? ???????????? - ???? ???????? ?????????? ??????????");
      }
    }
    else {
      //create cardata
      let tempcardata = { ...cardata }
      delete tempcardata._id;
      if (tempcardata.zminot == '????????' && tempcardata.kshirot == '????????') {
        tempcardata.tipuls = [];
        delete tempcardata.takala_info;
        delete tempcardata.expected_repair;
      }
      else {
        tempcardata.tipuls = finalspecialkeytwo;
      }
      let result = await axios.post(`http://localhost:8000/api/cardata`, tempcardata);
      toast.success(`??' ???????? ????????????`);
      props.ToggleForModal();
    }
  }

  async function UpdateCarData() {
    //create archivecardata
    await axios.get(`http://localhost:8000/api/cardata/${props.cardataid}`)
      .then(response => {
        let tempcardata = response.data[0];
        delete tempcardata._id;
        let result = axios.post(`http://localhost:8000/api/archivecardata`, tempcardata);
      })
      .catch((error) => {
        console.log(error);
      })
    //update cardata
    var tempcardataid = props.cardataid;
    let tempcardata = { ...cardata }
    if (tempcardata.zminot == '????????' && tempcardata.kshirot == '????????') {
      tempcardata.tipuls = [];
      tempcardata.takala_info = '';
      tempcardata.expected_repair = '';
    }
    else {
      tempcardata.tipuls = finalspecialkeytwo;
    }
    let result = await axios.put(`http://localhost:8000/api/cardata/${tempcardataid}`, tempcardata)
    toast.success(`??' ?????????? ????????????`);
    props.ToggleForModal();
  }

  function init() {
    if (props.cardataid != undefined) {
      loadcardata();
    }
    else {
      fixnewcardataunitsbyunittype();
    }
    getMagadals();
    loadPikods();
    // getTipultypes();
  }

  useEffect(() => {
    setOgdas([]);
    loadOgdas(cardata.pikod);
  }, [cardata.pikod]);

  useEffect(() => {
    setHativas([]);
    loadHativas(cardata.ogda);
  }, [cardata.ogda]);

  useEffect(() => {
    setGdods([]);
    loadGdods(cardata.hativa);
  }, [cardata.hativa]);

  useEffect(() => {
    setMagads([]);
    getMagads(cardata.magadal);
  }, [cardata.magadal]);

  useEffect(() => {
    setMkabazs([]);
    getMkabazs(cardata.magad);
  }, [cardata.magad]);

  useEffect(() => {
    setMakats([]);
    getMakats(cardata.mkabaz);
  }, [cardata.mkabaz]);

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setCarData({})
      setFinalSpecialKeytwo([])
    }
  }, [props.isOpen])

  return (
    <Modal
      style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
      isOpen={props.isOpen}
      centered
      fullscreen
      scrollable
      size=""
      toggle={props.Toggle}>
      <ModalBody>
        <Card>
          <CardHeader style={{ direction: 'rtl' }}>
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>???????? ???????????? ??????</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <Row>
                {props.cardataid ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6 style={{}}>??'</h6>
                    <Input placeholder="??'" type="string" name="carnumber" value={cardata.carnumber} onChange={handleChange} disabled />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6 style={{}}>??'</h6>
                    <Input placeholder="??'" type="string" name="carnumber" value={cardata.carnumber} onChange={handleChange} />
                  </Col>}

                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                  <h6 style={{}}>??????????</h6>
                  <Input placeholder="??????????" type="string" name="family" value={cardata.family} onChange={handleChange} />
                </Col>
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                  <h6 style={{}}>???????????? ????????</h6>
                  <Input placeholder="???????????? ????????" type="select" name="status" value={cardata.status} onChange={handleChange}>
                    <option value={"??????"}>{"??????"}</option>
                    <option value={"????????"}>{"????????"}</option>
                    <option value={"??????????"}>{"??????????"}</option>
                    <option value={"?????????? ????????????"}>{"?????????? ????????????"}</option>
                  </Input>
                </Col>
              </Row>

              <Row>
                {(!(cardata.magad)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>???????? ????</h6>
                    <Select data={magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>???????? ????</h6>
                    <Select data={magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.magadal) && !(cardata.mkabaz)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>????????</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>????????</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.magad) && !(cardata.makat)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>????????</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>????????</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.mkabaz)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>????"??</h6>
                    <Select data={makats} handleChange2={handleChange2} name={'makat'} val={cardata.makat ? cardata.makat : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>????"??</h6>
                    <Select data={makats} handleChange2={handleChange2} name={'makat'} val={cardata.makat ? cardata.makat : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.makat)) ?
                  <Col style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    {makats.map((makat, index) => (makat._id == cardata.makat ? makat.description : null))}
                  </Col> :
                  <Col style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  </Col>}

              </Row>

              <Row style={{ paddingTop: '10px' }}>
                {((props.unittype == "admin") || (props.unittype == "notype")) ?
                  <>
                    {(!(cardata.ogda)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>??????????</h6>
                        <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={cardata.pikod ? cardata.pikod : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>??????????</h6>
                        <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={cardata.pikod ? cardata.pikod : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}

                {((props.unittype == "admin") || (props.unittype == "notype") || (props.unittype == "pikod")) ?
                  <>
                    {((cardata.pikod) && !(cardata.hativa)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>??????????</h6>
                        <Select data={ogdas} handleChange2={handleChange2} name={'ogda'} val={cardata.ogda ? cardata.ogda : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>??????????</h6>
                        <Select data={ogdas} handleChange2={handleChange2} name={'ogda'} val={cardata.ogda ? cardata.ogda : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}

                {((props.unittype == "admin") || (props.unittype == "notype") || (props.unittype == "pikod") || (props.unittype == "ogda")) ?
                  <>
                    {((cardata.ogda) && !(cardata.gdod)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>??????????</h6>
                        <Select data={hativas} handleChange2={handleChange2} name={'hativa'} val={cardata.hativa ? cardata.hativa : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>??????????</h6>
                        <Select data={hativas} handleChange2={handleChange2} name={'hativa'} val={cardata.hativa ? cardata.hativa : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}

                {((props.unittype == "admin") || (props.unittype == "notype") || (props.unittype == "pikod") || (props.unittype == "ogda") || (props.unittype == "hativa")) ?
                  <>
                    {((cardata.hativa)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>????????</h6>
                        <Select data={gdods} handleChange2={handleChange2} name={'gdod'} val={cardata.gdod ? cardata.gdod : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>????????</h6>
                        <Select data={gdods} handleChange2={handleChange2} name={'gdod'} val={cardata.gdod ? cardata.gdod : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}
              </Row>

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>??????????</div>
                  <Input placeholder="??????????" type="string" name="pluga" value={cardata.pluga} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>??????"??</div>
                  <Input placeholder={`??????"??`} type="string" name="shabzak" value={cardata.shabzak} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>?????????? ??????"??</div>
                  <Input placeholder={`?????????? ??????"??`} type="string" name="mikum_bimh" value={cardata.mikum_bimh} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>???????? ????????</div>
                  <Input placeholder="???????? ????????" type="select" name="stand" value={cardata.stand} onChange={handleChange}>
                    <option value={'??????'}>??????</option>
                    <option value={'????????'}>????????</option>
                    <option value={'??????'}>??????</option>
                    <option value={'????"??'}>????"??</option>
                  </Input>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>????????????</div>
                  <Input placeholder="????????????" type="select" name="zminot" value={cardata.zminot} onChange={handleChange}>
                    <option value={'??????'}>??????</option>
                    <option value={'????????'}>????????</option>
                    <option value={'???? ????????'}>???? ????????</option>
                  </Input>
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>???????????? ????????????</div>
                  <Input placeholder="???????????? ????????????" type="select" name="kshirot" value={cardata.kshirot} onChange={handleChange}>
                    <option value={'??????'}>??????</option>
                    <option value={'????????'}>????????</option>
                    <option value={'???? ????????'}>???? ????????</option>
                  </Input>
                </Col>
              </Row>

              {cardata.kshirot == '???? ????????' || cardata.zminot == '???? ????????' ?
                <>
                  {/* tipuls */}
                  <div style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>??????????????</div>

                  <div>
                    {finalspecialkeytwo.length == 0 ?
                      <Row>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "tipul" }]) }}>???????? ??????????</Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "harig_tipul" }]) }}>???????? ?????????? ??????????</Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "takala_mizdamenet" }]) }}>???????? ???????? ????????????</Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "hh_stand" }]) }}>???????? ???????? ???? ??"??</Button>
                        </Col>
                      </Row>
                      : finalspecialkeytwo.map((p, index) => {
                        return (
                          <div>
                            {index == 0 ?
                              <Row>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "tipul" }]) }}>???????? ??????????</Button>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "harig_tipul" }]) }}>???????? ?????????? ??????????</Button>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "takala_mizdamenet" }]) }}>???????? ???????? ????????????</Button>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "hh_stand" }]) }}>???????? ???????? ???? ??"??</Button>
                                </Col>
                              </Row>
                              : null}

                            {p.type == 'tipul' ?
                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>?????? ????????????</p>
                                    <Input onChange={(e) => {
                                      const tipul = e.target.value;
                                      if (e.target.value != "??????")
                                        setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].tipul = tipul }))
                                    }}
                                      value={p.tipul} type="select" placeholder="?????? ????????????">
                                      <option value={"??????"}>{"??????"}</option>
                                      <option value={'?????????? ????????'}>{'?????????? ????????'}</option>
                                      <option value={'?????? ????????????'}>{'?????? ????????????'}</option>
                                      <option value={'???????????? ??????????'}>{'???????????? ??????????'}</option>
                                      <option value={'????????????'}>{'????????????'}</option>
                                      <option value={'?????????? ??????????'}>{'?????????? ??????????'}</option>
                                      <option value={'?????????? ??????????'}>{'?????????? ??????????'}</option>
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>?????????? ?????????? ????????????</p>
                                    <Input onChange={(e) => {
                                      const tipul_entry_date = e.target.value;
                                      if (e.target.value != "??????")
                                        setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].tipul_entry_date = tipul_entry_date }))
                                    }}
                                      value={p.tipul_entry_date} type="date" placeholder="?????????? ?????????? ????????????" />
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>?????????? ????????????</p>
                                    <Input onChange={(e) => {
                                      const mikum_tipul = e.target.value;
                                      if (e.target.value != "??????")
                                        setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].mikum_tipul = mikum_tipul }))
                                    }}
                                      value={p.mikum_tipul} type="select" placeholder="?????????? ????????????">
                                      <option value={"??????"}>{"??????"}</option>
                                      <option value={"????????????"}>{"????????????"}</option>
                                      <option value={"?????? ????????"}>{"?????? ????????"}</option>
                                      <option value={`????"??`}>{`????"??`}</option>
                                      <option value={"???????????? ??????"}>{"???????????? ??????"}</option>
                                    </Input>
                                  </div>
                                </Col>
                              </Row> : p.type == 'harig_tipul' ?
                                <Row>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>???????? ??????????</p>
                                      <Input onChange={(e) => {
                                        const harig_tipul = e.target.value;
                                        if (e.target.value != "??????")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul = harig_tipul }))
                                      }}
                                        value={p.harig_tipul} type="select" placeholder="???????? ??????????">
                                        <option value={"??????"}>{"??????"}</option>
                                        <option value={'?????????? ????????'}>{'?????????? ????????'}</option>
                                        <option value={'?????? ????????????'}>{'?????? ????????????'}</option>
                                        <option value={'???????????? ??????????'}>{'???????????? ??????????'}</option>
                                        <option value={'????????????'}>{'????????????'}</option>
                                        <option value={'?????????? ??????????'}>{'?????????? ??????????'}</option>
                                        <option value={'?????????? ??????????'}>{'?????????? ??????????'}</option>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>?????????? ?????????? ??????????</p>
                                      <Input onChange={(e) => {
                                        const harig_tipul_date = e.target.value;
                                        if (e.target.value != "??????")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul_date = harig_tipul_date }))
                                      }}
                                        value={p.harig_tipul_date} type="date" placeholder="?????????? ?????????? ??????????" />
                                    </div>
                                  </Col>
                                </Row> : p.type == 'takala_mizdamenet' ? <Row>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>???????? ????????????</p>
                                      <Input onChange={(e) => {
                                        const takala_mizdamenet = e.target.value;
                                        if (e.target.value != "??????")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].takala_mizdamenet = takala_mizdamenet }))
                                      }}
                                        value={p.takala_mizdamenet} type="select" placeholder="???????? ????????????">
                                        <option value={"??????"}>{"??????"}</option>
                                        <option value={'??????'}>{'??????'}</option>
                                        <option value={'??????????????'}>{'??????????????'}</option>
                                        <option value={'??????'}>{'??????'}</option>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>?????????? ???????? ??????????</p>
                                      <Input onChange={(e) => {
                                        const takala_mizdamenet_date = e.target.value;
                                        if (e.target.value != "??????")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].takala_mizdamenet_date = takala_mizdamenet_date }))
                                      }}
                                        value={p.takala_mizdamenet_date} type="date" placeholder="?????????? ???????? ??????????" />
                                    </div>
                                  </Col>
                                </Row> : p.type == 'hh_stand' ? <Row>
                                  <Col xs={12} md={6}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>????"?? ??????</p>
                                      <Input onChange={(e) => {
                                        const missing_makat_1 = e.target.value;
                                        if (e.target.value != "??????")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].missing_makat_1 = missing_makat_1 }))
                                      }}
                                        value={p.missing_makat_1} type="string" placeholder={`????"?? ??????`}>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={6}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>????????</p>
                                      <Input onChange={(e) => {
                                        const missing_makat_2 = e.target.value;
                                        if (e.target.value != "??????")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].missing_makat_2 = missing_makat_2 }))
                                      }}
                                        value={p.missing_makat_2} type="string" placeholder={`????????`}>
                                      </Input>
                                    </div>
                                  </Col>
                                </Row> : null}

                            <Button type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => currentSpec.filter(x => x.id !== p.id)) }}><img src={deletepic} height='20px'></img></Button>
                          </div>
                        )
                      })
                    }
                  </div>
                  {/* tipuls */}

                  <Row>
                    <Col>
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>???????? ??????????</div>
                      <Input placeholder="???????? ??????????" type="textarea" name="takala_info" value={cardata.takala_info} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>?????? ??????????</div>
                      <Input placeholder="?????? ??????????" type="select" name="expected_repair" value={cardata.expected_repair} onChange={handleChange}>
                        <option value={"??????"}>{"??????"}</option>
                        <option value={"???? 6 ????????"}>{"???? 6 ????????"}</option>
                        <option value={"???? 12 ????????"}>{"???? 12 ????????"}</option>
                        <option value={"?????? 12 ????????"}>{"?????? 12 ????????"}</option>
                        <option value={"?????? 24 ????????"}>{"?????? 24 ????????"}</option>
                      </Input>
                    </Col>
                  </Row>

                  {/* <Row>
                    <Col xs={12} md={8}>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <p style={{ margin: '0px', float: 'left' }}>???????? ?????? ???? ????????????: 5 ????????</p>
                      </div>
                    </Col>
                  </Row> */}
                </>
                : null}

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>??????????</div>
                  <Input placeholder="??????????" type="string" name="mikum" value={cardata.mikum} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>???????? ???????? ??????????</div>
                  <Input placeholder="???????? ???????? ??????????" type="date" name="latest_recalibration_date" value={cardata.latest_recalibration_date} onChange={handleChange} />
                </Col>
              </Row>

              {user.role == '0' || user.role == '1' ?
                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                  <button className="btn" onClick={clickSubmit}>????????</button>
                </div> : null}
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(CarDataFormModal);;