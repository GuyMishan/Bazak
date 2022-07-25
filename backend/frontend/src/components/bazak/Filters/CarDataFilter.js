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

const CarDataFilter = (props) => {
    const [zminots, setZminots] = useState([])

    const [kshirots, setKshirots] = useState([])
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

    function init() {
        getKshirots();
        getZminots();
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
                        <Col xs={12} md={2} style={{ textAlign: 'right' }}>
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
                        <Col xs={12} md={2} style={{ textAlign: 'right' }}>
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
                        <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                            <Row style={{ paddingTop: '10px', marginBottom: '15px' }}>
                                {((props.unittype == "admin")) ?
                                    <>
                                        {(!(props.filter.ogda)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>פיקוד</h6>
                                                <Select data={pikods} handleChange2={props.handleChange2} name={'pikod'} val={props.filter.pikod ? props.filter.pikod : undefined} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>פיקוד</h6>
                                                <Select data={pikods} handleChange2={props.handleChange2} name={'pikod'} val={props.filter.pikod ? props.filter.pikod : undefined} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "pikod")) ?
                                    <>
                                        {((props.filter.pikod) && !(props.filter.hativa)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>אוגדה</h6>
                                                <Select data={ogdas} handleChange2={props.handleChange2} name={'ogda'} val={props.filter.ogda ? props.filter.ogda : undefined} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>אוגדה</h6>
                                                <Select data={ogdas} handleChange2={props.handleChange2} name={'ogda'} val={props.filter.ogda ? props.filter.ogda : undefined} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "pikod") || (props.unittype == "ogda")) ?
                                    <>
                                        {((props.filter.ogda) && !(props.filter.gdod)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>חטיבה</h6>
                                                <Select data={hativas} handleChange2={props.handleChange2} name={'hativa'} val={props.filter.hativa ? props.filter.hativa : undefined} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>חטיבה</h6>
                                                <Select data={hativas} handleChange2={props.handleChange2} name={'hativa'} val={props.filter.hativa ? props.filter.hativa : undefined} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "pikod") || (props.unittype == "ogda") || (props.unittype == "hativa")) ?
                                    <>
                                        {((props.filter.hativa)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>גדוד</h6>
                                                <Select data={gdods} handleChange2={props.handleChange2} name={'gdod'} val={props.filter.gdod ? props.filter.gdod : undefined} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>גדוד</h6>
                                                <Select data={gdods} handleChange2={props.handleChange2} name={'gdod'} val={props.filter.gdod ? props.filter.gdod : undefined} isDisabled={true} />
                                            </Col>}
                                    </> : null}
                            </Row>
                            <Row style={{ marginBottom: '15px' }}>
                                {(!(props.filter.magad)) ?
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מאגד על</h6>
                                        <Select data={magadals} handleChange2={props.handleChange2} name={'magadal'} val={props.filter.magadal ? props.filter.magadal : undefined} />
                                    </Col> :
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מאגד על</h6>
                                        <Select data={magadals} handleChange2={props.handleChange2} name={'magadal'} val={props.filter.magadal ? props.filter.magadal : undefined} isDisabled={true} />
                                    </Col>}

                                {((props.filter.magadal) && !(props.filter.mkabaz)) ?
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מאגד</h6>
                                        <Select data={magads} handleChange2={props.handleChange2} name={'magad'} val={props.filter.magad ? props.filter.magad : undefined} />
                                    </Col> :
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מאגד</h6>
                                        <Select data={magads} handleChange2={props.handleChange2} name={'magad'} val={props.filter.magad ? props.filter.magad : undefined} isDisabled={true} />
                                    </Col>}

                                {((props.filter.magad) && !(props.filter.makat)) ?
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מקבץ</h6>
                                        <Select data={mkabazs} handleChange2={props.handleChange2} name={'mkabaz'} val={props.filter.mkabaz ? props.filter.mkabaz : undefined} />
                                    </Col> :
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מקבץ</h6>
                                        <Select data={mkabazs} handleChange2={props.handleChange2} name={'mkabaz'} val={props.filter.mkabaz ? props.filter.mkabaz : undefined} isDisabled={true} />
                                    </Col>}

                                {((props.filter.mkabaz)) ?
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מק"ט</h6>
                                        <Select data={makats} handleChange2={props.handleChange2} name={'makat'} val={props.filter.makat ? props.filter.makat : undefined} />
                                    </Col> :
                                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                        <h6>מק"ט</h6>
                                        <Select data={makats} handleChange2={props.handleChange2} name={'makat'} val={props.filter.makat ? props.filter.makat : undefined} isDisabled={true} />
                                    </Col>}
                            </Row>
                        </Col>
                    </Row>

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