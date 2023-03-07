import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
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
    Collapse
} from "reactstrap";
import axios from 'axios'
import Select from 'components/general/Select/AnimatedSelect'
import MultiSelect from 'components/general/Select/AnimatedMultiSelect'

const CarDataFilter = (props) => {
    const [zminots, setZminots] = useState([])

    const [kshirots, setKshirots] = useState([])

    const [stands, setStands] = useState([])

    const [tipuls, setTipuls] = useState([]);
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
    //
    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const toggleCollapse = () => {
        setcollapseOpen(!collapseOpen);
    };

    const getKshirots = async () => {
        let tempkshirots = [];
        tempkshirots.push('כשיר');
        tempkshirots.push('לא כשיר');
        setKshirots(tempkshirots)
    }

    const getZminots = async () => {
        let tempzminots = [];
        tempzminots.push('זמין');
        tempzminots.push('לא זמין');
        setZminots(tempzminots)
    }

    const getStands = async () => {
        let tempstands = [];
        tempstands.push('סדיר');
        tempstands.push('הכן');
        tempstands.push('הח"י');
        setStands(tempstands)
    } 
    const getTipuls = async () => {
        let temptipuls = [];
        temptipuls.push(['טיפול','tipul']);
        temptipuls.push(['חריג טיפול', 'harig_tipul']);
        temptipuls.push(['תקלה מזדמנת','takala_mizdamenet']);
        setTipuls(temptipuls)
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

    const getMagads = async (magadalids) => {
        let tempmagadalsmagads = [];
        if (magadalids != undefined && magadalids.length > 0) {
            for (let i = 0; i < magadalids.length; i++) {
                await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalids[i]}`)
                    .then(response => {
                        for (let j = 0; j < response.data.length; j++)
                            tempmagadalsmagads.push(response.data[j])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        setMagads(tempmagadalsmagads);
    }

    const getMkabazs = async (magadids) => {
        let tempmagadsmkabazs = [];
        if (magadids != undefined && magadids.length > 0) {
            for (let i = 0; i < magadids.length; i++) {
                await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadids[i]}`)
                    .then(response => {
                        for (let j = 0; j < response.data.length; j++)
                            tempmagadsmkabazs.push(response.data[j])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        setMkabazs(tempmagadsmkabazs);
    }

    const getMakats = async (mkabazids) => {
        let tempmkabazsmakats = [];
        if (mkabazids != undefined && mkabazids.length > 0) {
            for (let i = 0; i < mkabazids.length; i++) {
                await axios.get(`http://localhost:8000/api/makat/makatsbymkabaz/${mkabazids[i]}`)
                    .then(response => {
                        for (let j = 0; j < response.data.length; j++)
                            tempmkabazsmakats.push(response.data[j])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        setMakats(tempmkabazsmakats);
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

    const loadOgdas = async (pikodids) => {
        let temppikodids = pikodids;
        if (temppikodids != undefined && !temppikodids.isArray) {
            temppikodids = [pikodids]
        }
        let temppikodsogdas = [];
        if (temppikodids != undefined && temppikodids.length > 0) {
            for (let i = 0; i < temppikodids.length; i++) {
                await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: temppikodids[i] })
                    .then(response => {
                        for (let j = 0; j < response.data.length; j++)
                            temppikodsogdas.push(response.data[j])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        setOgdas(temppikodsogdas);
    }

    const loadHativas = async (ogdaids) => {
        let tempogdaids = ogdaids;
        if (tempogdaids != undefined && !tempogdaids.isArray) {
            tempogdaids = [ogdaids]
        }
        let tempogdashativas = [];
        if (tempogdaids != undefined && tempogdaids.length > 0) {
            for (let i = 0; i < tempogdaids.length; i++) {
                await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: tempogdaids[i] })
                    .then(response => {
                        for (let j = 0; j < response.data.length; j++)
                            tempogdashativas.push(response.data[j])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        setHativas(tempogdashativas);
    }

    const loadGdods = async (hativaids) => {
        let temphativaids = hativaids;
        if (temphativaids != undefined && !temphativaids.isArray) {
            temphativaids = [hativaids]
        }
        let temphativasgdods = [];
        if (temphativaids != undefined && temphativaids.length > 0) {
            for (let i = 0; i < temphativaids.length; i++) {
                await axios.post("http://localhost:8000/api/gdod/gdodsbyhativaid", { hativa: temphativaids[i] })
                    .then(response => {
                        for (let j = 0; j < response.data.length; j++)
                            temphativasgdods.push(response.data[j])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        setGdods(temphativasgdods);
    }

    function init() {
        getKshirots();
        getZminots();
        getStands();
        getTipuls();
        getMagadals();
        loadPikods();
    }

    useEffect(() => {
        setOgdas([]);
        loadOgdas(props.filter.pikod);
    }, [props.filter.pikod]);

    useEffect(() => {
        setHativas([]);
        loadHativas(props.filter.ogda);
    }, [props.filter.ogda]);

    useEffect(() => {
        setGdods([]);
        loadGdods(props.filter.hativa);
    }, [props.filter.hativa]);

    useEffect(() => {
        setMagads([]);
        getMagads(props.filter.magadal);
    }, [props.filter.magadal]);

    useEffect(() => {
        setMkabazs([]);
        getMkabazs(props.filter.magad);
    }, [props.filter.magad]);

    useEffect(() => {
        setMakats([]);
        getMakats(props.filter.mkabaz);
    }, [props.filter.mkabaz]);

    useEffect(() => {
        init();
    }, []);

    return (
        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Button onClick={toggleCollapse} style={{}}>סינון</Button>
            <Collapse isOpen={collapseOpen}>
                <Card style={{ background: 'rgb(228,228,228,0.2)' }}>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>זמינות</h4>
                            {zminots ? zminots.map((zminot, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.filter.zminotfilter && props.filter.zminotfilter.indexOf(zminot) != -1 ?
                                                <button className="btn-empty" name={'zminot'} value={zminot} onClick={props.setfilterfunction}><h6 style={{ color: 'blue' }}>{zminot}</h6></button>
                                                : <button className="btn-empty" name={'zminot'} value={zminot} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{zminot}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>כשירות</h4>
                            {kshirots ? kshirots.map((kshirot, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.filter.kshirotfilter && props.filter.kshirotfilter.indexOf(kshirot) != -1 ?
                                                <button className="btn-empty" name={'kshirot'} value={kshirot} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{kshirot}</h6></button>
                                                : <button className="btn-empty" name={'kshirot'} value={kshirot} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{kshirot}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>מעמד</h4>
                            {stands ? stands.map((stand, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.filter.standfilter && props.filter.standfilter.indexOf(stand) != -1 ?
                                                <button className="btn-empty" name={'stand'} value={stand} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{stand}</h6></button>
                                                : <button className="btn-empty" name={'stand'} value={stand} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{stand}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>סיבת אי זמינות</h4>
                            {tipuls ? tipuls.map((tipul, index) => {
                                {
                                    return (
                                        <>
                                        <Row>
                                            {props.filter.tipulfilter && props.filter.tipulfilter.indexOf(tipul[1]) != -1 ?
                                                <button className="btn-empty" name={'tipul'} value={tipul[1]} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{tipul[0]}</h6></button>
                                                : <button className="btn-empty" name={'tipul'} value={tipul[1]} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{tipul[0]}</h6></button>}
                                        </Row>
                                        {tipul[0] == 'חריג טיפול' ?
                                        props.filter.tipulfilter && props.filter.tipulfilter.indexOf('harig_tipul') != -1 ?
                                        <Row>
                                           {props.filter.maamalfilter && props.filter.maamalfilter.indexOf('is_maamal') != -1 ?
                                               <button className="btn-empty" name={'is_maamal'} value={'is_maamal'} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{'האם ביצע טיפול מעמ"ל'}</h6></button>
                                               : 
                                               <button className="btn-empty" name={'is_maamal'} value={'is_maamal'} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{'האם ביצע טיפול מעמ"ל'}</h6></button>}
                                        </Row>
                                        :null
                                        :null}
                                        </>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                            <Row style={{ paddingTop: '10px', marginBottom: '15px' }}>
                                {((props.unittype == "admin") || (props.unittype == "general")) ?
                                    <>
                                        {(!(props.filter.ogda) || !(props.filter.ogda.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>פיקוד</h6>
                                                <MultiSelect data={pikods} handleChange2={props.handleChange8} name={'pikod'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>פיקוד</h6>
                                                <MultiSelect data={pikods} handleChange2={props.handleChange8} name={'pikod'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "general") || (props.unittype == "pikod")) ?
                                    <>
                                        {((props.filter.pikod) && (props.filter.pikod.length > 0) && (!(props.filter.hativa) || !(props.filter.hativa.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>אוגדה</h6>
                                                <MultiSelect data={ogdas} handleChange2={props.handleChange8} name={'ogda'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>אוגדה</h6>
                                                <MultiSelect data={ogdas} handleChange2={props.handleChange8} name={'ogda'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "general") || (props.unittype == "pikod") || (props.unittype == "ogda")) ?
                                    <>
                                        {((props.filter.ogda) && (props.filter.ogda.length > 0) && (!(props.filter.gdod) || !(props.filter.gdod.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>חטיבה</h6>
                                                <MultiSelect data={hativas} handleChange2={props.handleChange8} name={'hativa'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>חטיבה</h6>
                                                <MultiSelect data={hativas} handleChange2={props.handleChange8} name={'hativa'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "general") || (props.unittype == "pikod") || (props.unittype == "ogda") || (props.unittype == "hativa")) ?
                                    <>
                                        {((props.filter.hativa) && (props.filter.hativa.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>גדוד</h6>
                                                <MultiSelect data={gdods} handleChange2={props.handleChange8} name={'gdod'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>גדוד</h6>
                                                <MultiSelect data={gdods} handleChange2={props.handleChange8} name={'gdod'} isDisabled={true} />
                                            </Col>}
                                    </> : null}
                            </Row>
                            <Row style={{ marginBottom: '15px' }}>
                                {((props.cartype == "magadal")) ?
                                    <>
                                        {(!(props.filter.magad) || !(props.filter.magad.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד על</h6>
                                                <MultiSelect data={magadals} handleChange2={props.handleChange8} name={'magadal'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד על</h6>
                                                <MultiSelect data={magadals} handleChange2={props.handleChange8} name={'magadal'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.cartype == "magadal") || (props.cartype == "magad")) ?
                                    <>
                                        {((props.filter.magadal) && (props.filter.magadal.length > 0) && (!(props.filter.mkabaz) || !(props.filter.mkabaz.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד</h6>
                                                <MultiSelect data={magads} handleChange2={props.handleChange8} name={'magad'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד</h6>
                                                <MultiSelect data={magads} handleChange2={props.handleChange8} name={'magad'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.cartype == "magadal") || (props.cartype == "magad") || (props.cartype == "mkabaz")) ?
                                    <>
                                        {((props.filter.magad) && (props.filter.magad.length > 0) && (!(props.filter.makat) || !(props.filter.makat.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מקבץ</h6>
                                                <MultiSelect data={mkabazs} handleChange2={props.handleChange8} name={'mkabaz'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מקבץ</h6>
                                                <MultiSelect data={mkabazs} handleChange2={props.handleChange8} name={'mkabaz'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.cartype == "magadal") || (props.cartype == "magad") || (props.cartype == "mkabaz")) ?
                                    <>
                                        {((props.filter.mkabaz) && (props.filter.mkabaz.length > 0) && (props.filter.mkabaz.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מק"ט</h6>
                                                <MultiSelect data={makats} handleChange2={props.handleChange8} name={'makat'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מק"ט</h6>
                                                <MultiSelect data={makats} handleChange2={props.handleChange8} name={'makat'} isDisabled={true} />
                                            </Col>}
                                    </> : null}
                            </Row>
                        </Col>
                    </Row>

                    {props.filter.tipulfilter && props.filter.tipulfilter.indexOf('harig_tipul') != -1 ?
                    <div>
                        <Row style={{margin:'0px', marginBottom:'20px'}}>
                          <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                          <h4 style={{ fontWeight: 'bold', width:'150px' }}>תאריך חריג טיפול</h4>
                            <div style={{display:'flex', alignItems:'center', width:'120px'}}>
                                <Input name={'taarichtipulEnd'} onChange={props.handleChangeForTaarichTipul} type="date" min={props.filter.taarichtipulStart ? props.filter.taarichtipulStart :"1900-01-01"} max="2040-01-01" /> - <Input name={'taarichtipulStart'} onChange={props.handleChangeForTaarichTipul} type="date" min="1900-01-01" max={props.filter.taarichtipulEnd ? props.filter.taarichtipulEnd :"2040-01-01"} />
                            </div>
                          </Col>
                        </Row>
                    </div>
                    :null}

                    <div>
                        <Row>
                            {props.allColumns.map(column => (
                                <Col xs={12} md={2}>
                                    <div key={column.id}>
                                        <label>
                                            <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                                            {column.Header}
                                        </label>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Card >
            </Collapse>
        </div>
    );
}
export default withRouter(CarDataFilter);;