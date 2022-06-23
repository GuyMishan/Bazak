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

const CarDataFormModal = (props) => {
  //cardata
  const [cardata, setCarData] = useState({})
  const [finalspecialkeytwo, setFinalSpecialKeytwo] = useState([])
  //units
  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);
  //cartypes
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

  // const getTipultypes = async () => {
  //   await axios.get("http://localhost:8000/api/tipultype")
  //     .then(response => {
  //       setTipultypes(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }

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
    if (value != "בחר")
      setCarData({ ...cardata, [evt.target.name]: value });
  }

  function handleChange2(selectedOption, name) {
    if (!(selectedOption.value == "בחר"))
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
      ErrorReason += ", שדה חסר צ'"
      flag = false;
    }

    if (((cardata.pikod == undefined) || (cardata.pikod == "")) || ((cardata.ogda == undefined) || (cardata.ogda == "")) || ((cardata.hativa == undefined) || (cardata.hativa == "")) || ((cardata.gdod == undefined) || (cardata.gdod == ""))) {
      ErrorReason += ", פרטי יחידה לא מלאים"
      flag = false;
    }

    if (((cardata.magadal == undefined) || (cardata.magadal == "")) || ((cardata.magad == undefined) || (cardata.magad == "")) || ((cardata.mkabaz == undefined) || (cardata.mkabaz == ""))) {
      ErrorReason += ", פרטי סוג הכלי לא מלאים"
      flag = false;
    }

    if (((cardata.zminot == undefined) || (cardata.zminot == ""))|| ((cardata.kshirot == undefined) || (cardata.kshirot == ""))) {
      ErrorReason += ",חובה להזין האם הכלי זמין/כשיר"
      flag = false;
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
      toast.error("צ' כבר קיים במערכת");
    }
    else {
      let tempcardata = { ...cardata }
      if (tempcardata.zminot == 'זמין' && tempcardata.kshirot == 'כשיר') {
        tempcardata.tipuls = [];
        delete tempcardata.takala_info;
        delete tempcardata.expected_repair;

      }
      else {
        tempcardata.tipuls = finalspecialkeytwo;
      }
      let result = await axios.post(`http://localhost:8000/api/cardata`, tempcardata);
      toast.success(`צ' נוסף בהצלחה`);
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
    if (tempcardata.zminot == 'זמין' && tempcardata.kshirot == 'כשיר') {
      tempcardata.tipuls = [];
      tempcardata.takala_info = '';
      tempcardata.expected_repair = '';
    }
    else {
      tempcardata.tipuls = finalspecialkeytwo;
    }
    let result = await axios.put(`http://localhost:8000/api/cardata/${tempcardataid}`, tempcardata) //needs to check if tipuls/takala need to be emptied
    toast.success(`צ' עודכן בהצלחה`);
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
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס זמינות כלי</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <Row>
                <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                  <h6 style={{}}>צ'</h6>
                  <Input placeholder="צ'" type="string" name="carnumber" value={cardata.carnumber} onChange={handleChange} />
                </Col>
                {(!(cardata.magad)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.magadal) && !(cardata.mkabaz)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.magad)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} isDisabled={true} />
                  </Col>}
              </Row>

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מק"ט</div>
                  <Input placeholder={`מק"ט`} type="string" name="makat" value={cardata.makat} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תיאור מק"ט</div>
                  <Input placeholder={`תיאור מק"ט`} type="string" name="makat_description" value={cardata.makat_description} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>משפחה</div>
                  <Input placeholder="משפחה" type="string" name="family" value={cardata.family} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>סטאטוס הכלי</div>
                  <Input placeholder="סטאטוס הכלי" type="select" name="status" value={cardata.status} onChange={handleChange}>
                    <option value={"בחר"}>{"בחר"}</option>
                    <option value={"פעיל"}>{"פעיל"}</option>
                    <option value={"מושבת"}>{"מושבת"}</option>
                    <option value={"מיועד להשבתה"}>{"מיועד להשבתה"}</option>
                  </Input>
                </Col>
              </Row>

              <Row style={{ paddingTop: '10px' }}>
                {((props.unittype == "admin")) ?
                  <>
                    {(!(cardata.ogda)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>פיקוד</h6>
                        <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={cardata.pikod ? cardata.pikod : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>פיקוד</h6>
                        <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={cardata.pikod ? cardata.pikod : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}

                {((props.unittype == "admin") || (props.unittype == "pikod")) ?
                  <>
                    {((cardata.pikod) && !(cardata.hativa)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>אוגדה</h6>
                        <Select data={ogdas} handleChange2={handleChange2} name={'ogda'} val={cardata.ogda ? cardata.ogda : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>אוגדה</h6>
                        <Select data={ogdas} handleChange2={handleChange2} name={'ogda'} val={cardata.ogda ? cardata.ogda : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}

                {((props.unittype == "admin") || (props.unittype == "pikod") || (props.unittype == "ogda")) ?
                  <>
                    {((cardata.ogda) && !(cardata.gdod)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>חטיבה</h6>
                        <Select data={hativas} handleChange2={handleChange2} name={'hativa'} val={cardata.hativa ? cardata.hativa : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>חטיבה</h6>
                        <Select data={hativas} handleChange2={handleChange2} name={'hativa'} val={cardata.hativa ? cardata.hativa : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}

                {((props.unittype == "admin") || (props.unittype == "pikod") || (props.unittype == "ogda") || (props.unittype == "hativa")) ?
                  <>
                    {((cardata.hativa)) ?
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>גדוד</h6>
                        <Select data={gdods} handleChange2={handleChange2} name={'gdod'} val={cardata.gdod ? cardata.gdod : undefined} />
                      </Col> :
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>גדוד</h6>
                        <Select data={gdods} handleChange2={handleChange2} name={'gdod'} val={cardata.gdod ? cardata.gdod : undefined} isDisabled={true} />
                      </Col>}
                  </> : null}
              </Row>

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>פלוגה</div>
                  <Input placeholder="פלוגה" type="string" name="pluga" value={cardata.pluga} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>שבצ"ק</div>
                  <Input placeholder={`שבצ"ק`} type="string" name="shabzak" value={cardata.shabzak} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מיקום בימ"ח</div>
                  <Input placeholder={`מיקום בימ"ח`} type="string" name="mikum_bimh" value={cardata.mikum_bimh} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מעמד הכלי</div>
                  <Input placeholder="מעמד הכלי" type="select" name="stand" value={cardata.stand} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'סדיר'}>סדיר</option>
                    <option value={'הכן'}>הכן</option>
                    <option value={'הח"י'}>הח"י</option>
                  </Input>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>זמינות</div>
                  <Input placeholder="זמינות" type="select" name="zminot" value={cardata.zminot} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'זמין'}>זמין</option>
                    <option value={'לא זמין'}>לא זמין</option>
                  </Input>
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>כשירות למלחמה</div>
                  <Input placeholder="כשירות למלחמה" type="select" name="kshirot" value={cardata.kshirot} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'כשיר'}>כשיר</option>
                    <option value={'לא כשיר'}>לא כשיר</option>
                  </Input>
                </Col>
              </Row>

              {cardata.kshirot == 'לא כשיר' || cardata.zminot == 'לא זמין' ?
                <>
                  {/* tipuls */}
                  <div style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>טיפולים</div>

                  <div>
                    {finalspecialkeytwo.length == 0 ?
                      <Row>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "tipul" }]) }}>הוסף טיפול</Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "harig_tipul" }]) }}>הוסף חריגת טיפול</Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "takala_mizdamenet" }]) }}>הוסף תקלה מזדמנת</Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "hh_stand" }]) }}>הוסף עומד על ח"ח</Button>
                        </Col>
                      </Row>
                      : finalspecialkeytwo.map((p, index) => {
                        return (
                          <div>
                            {index == 0 ?
                              <Row>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "tipul" }]) }}>הוסף טיפול</Button>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "harig_tipul" }]) }}>הוסף חריגת טיפול</Button>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "takala_mizdamenet" }]) }}>הוסף תקלה מזדמנת</Button>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "hh_stand" }]) }}>הוסף עומד על ח"ח</Button>
                                </Col>
                              </Row>
                              : null}

                            {p.type == 'tipul' ?
                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>סוג הטיפול</p>
                                    <Input onChange={(e) => {
                                      const tipul = e.target.value;
                                      if (e.target.value != "בחר")
                                        setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].tipul = tipul }))
                                    }}
                                      value={p.tipul} type="select" placeholder="סוג הטיפול">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={'טיפול שנתי'}>{'טיפול שנתי'}</option>
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>תאריך כניסה לטיפול</p>
                                    <Input onChange={(e) => {
                                      const tipul_entry_date = e.target.value;
                                      if (e.target.value != "בחר")
                                        setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].tipul_entry_date = tipul_entry_date }))
                                    }}
                                      value={p.tipul_entry_date} type="date" placeholder="תאריך כניסה לטיפול" />
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>מיקום הטיפול</p>
                                    <Input onChange={(e) => {
                                      const mikum_tipul = e.target.value;
                                      if (e.target.value != "בחר")
                                        setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].mikum_tipul = mikum_tipul }))
                                    }}
                                      value={p.mikum_tipul} type="select" placeholder="מיקום הטיפול">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"ביחידה"}>{"ביחידה"}</option>
                                      <option value={"אגד ארצי"}>{"אגד ארצי"}</option>
                                      <option value={`מש"א`}>{`מש"א`}</option>
                                      <option value={"אחזקות חוץ"}>{"אחזקות חוץ"}</option>
                                    </Input>
                                  </div>
                                </Col>
                              </Row> : p.type == 'harig_tipul' ?
                                <Row>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>חריג טיפול</p>
                                      <Input onChange={(e) => {
                                        const harig_tipul = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul = harig_tipul }))
                                      }}
                                        value={p.harig_tipul} type="select" placeholder="חריג טיפול">
                                        <option value={"בחר"}>{"בחר"}</option>
                                        <option value={'טיפול שנתי'}>{'טיפול שנתי'}</option>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>תאריך חריגת טיפול</p>
                                      <Input onChange={(e) => {
                                        const harig_tipul_date = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul_date = harig_tipul_date }))
                                      }}
                                        value={p.harig_tipul_date} type="date" placeholder="תאריך חריגת טיפול" />
                                    </div>
                                  </Col>
                                </Row> : p.type == 'takala_mizdamenet' ? <Row>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>תקלה מזדמנת</p>
                                      <Input onChange={(e) => {
                                        const takala_mizdamenet = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].takala_mizdamenet = takala_mizdamenet }))
                                      }}
                                        value={p.takala_mizdamenet} type="select" placeholder="תקלה מזדמנת">
                                        <option value={"בחר"}>{"בחר"}</option>
                                        <option value={'קלה'}>{'קלה'}</option>
                                        <option value={'בינונית'}>{'בינונית'}</option>
                                        <option value={'קשה'}>{'קשה'}</option>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>תאריך תקלה מזמנת</p>
                                      <Input onChange={(e) => {
                                        const takala_mizdamenet_date = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].takala_mizdamenet_date = takala_mizdamenet_date }))
                                      }}
                                        value={p.takala_mizdamenet_date} type="date" placeholder="תאריך תקלה מזמנת" />
                                    </div>
                                  </Col>
                                </Row> : p.type == 'hh_stand' ? <Row>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>עומד על ח"ח</p>
                                      <Input onChange={(e) => {
                                        const hh_stand = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].hh_stand = hh_stand }))
                                      }}
                                        value={p.hh_stand} type="select" placeholder={`עומד על ח"ח`}>
                                        <option value={"בחר"}>{"בחר"}</option>
                                        <option value={"כן"}>{"כן"}</option>
                                        <option value={"לא"}>{"לא"}</option>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>מק"ט חסר</p>
                                      <Input onChange={(e) => {
                                        const missing_makat_1 = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].missing_makat_1 = missing_makat_1 }))
                                      }}
                                        value={p.missing_makat_1} type="string" placeholder={`מק"ט חסר`}>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}>מק"ט חסר</p>
                                      <Input onChange={(e) => {
                                        const missing_makat_2 = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].missing_makat_2 = missing_makat_2 }))
                                      }}
                                        value={p.missing_makat_2} type="string" placeholder={`מק"ט חסר`}>
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
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>מהות התקלה</div>
                      <Input placeholder="מהות התקלה" type="textarea" name="takala_info" value={cardata.takala_info} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>צפי תיקון</div>
                      <Input placeholder="צפי תיקון" type="select" name="expected_repair" value={cardata.expected_repair} onChange={handleChange}>
                        <option value={"בחר"}>{"בחר"}</option>
                        <option value={"עד 6 שעות"}>{"עד 6 שעות"}</option>
                        <option value={"עד 12 שעות"}>{"עד 12 שעות"}</option>
                        <option value={"מעל 12 שעות"}>{"מעל 12 שעות"}</option>
                        <option value={"מעל 24 שעות"}>{"מעל 24 שעות"}</option>
                      </Input>
                    </Col>
                  </Row>

                  {/* <Row>
                    <Col xs={12} md={8}>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <p style={{ margin: '0px', float: 'left' }}>כמות ימי אי זמינות: 5 ימים</p>
                      </div>
                    </Col>
                  </Row> */}
                </>
                : null}

              <Row>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מיקום</div>
                  <Input placeholder="מיקום" type="string" name="mikum" value={cardata.mikum} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מועד כיול אחרון</div>
                  <Input placeholder="מועד כיול אחרון" type="date" name="latest_recalibration_date" value={cardata.latest_recalibration_date} onChange={handleChange} />
                </Col>
              </Row>

              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <button className="btn" onClick={clickSubmit}>עדכן</button>
              </div>
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(CarDataFormModal);;