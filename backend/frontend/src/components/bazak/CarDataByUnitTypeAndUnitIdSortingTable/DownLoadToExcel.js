import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

import ReactExport from "react-data-export";

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

function DownLoadToExcel(props) {
    const [data_to_excel, setData_to_excel] = useState([])
    const [flag, setFlag] = useState(false);
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

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


    const loadPikods = async () => {
        let response = await axios.get("http://localhost:8000/api/pikod",)
        setPikods(response.data);
    }

    const loadOgdas = async () => {
        let response = await axios.get("http://localhost:8000/api/ogda",)
        setOgdas(response.data);
    }

    const loadHativas = async () => {
        let response = await axios.get("http://localhost:8000/api/hativa",)
        setHativas(response.data);
    }

    const loadGdods = async () => {
        let response = await axios.get("http://localhost:8000/api/gdod",)
        setGdods(response.data);
    }

    const loadMagadals = async () => {
        let response = await axios.get("http://localhost:8000/api/magadal",)
        setMagadals(response.data);
    }

    const loadMagads = async () => {
        let response = await axios.get("http://localhost:8000/api/magad",)
        setMagads(response.data);
    }

    const loadMkabazs = async () => {
        let response = await axios.get("http://localhost:8000/api/mkabaz",)
        setMkabazs(response.data);
    }

    const loadMakats = async () => {
        let response = await axios.get("http://localhost:8000/api/makat",)
        setMakats(response.data);
    }

    function FixData() {
        let tempdata_to_excel = [];
        for (let i = 0; i < props.data.length; i++) {
            if (props.data[i].tipuls.length != 0) {
                for (let j = 0; j < props.data[i].tipuls.length; j++) {
                    let tempcardata = { ...props.data[i] };
                    if (tempcardata.tipuls[j].type == 'tipul') {
                        tempcardata.tipul = tempcardata.tipuls[j].tipul;
                        tempcardata.tipul_entry_date = tempcardata.tipuls[j].tipul_entry_date ? tempcardata.tipuls[j].tipul_entry_date.split("-").reverse().join("-") : null;
                        tempcardata.mikum_tipul = tempcardata.tipuls[j].mikum_tipul;
                    }
                    else if (tempcardata.tipuls[j].type == 'harig_tipul') {
                        tempcardata.harig_tipul = tempcardata.tipuls[j].harig_tipul;
                        tempcardata.harig_tipul_date = tempcardata.tipuls[j].harig_tipul_date ? tempcardata.tipuls[j].harig_tipul_date.split("-").reverse().join("-") : null;
                    }
                    else if (tempcardata.tipuls[j].type == 'takala_mizdamenet') {
                        tempcardata.takala_mizdamenet = tempcardata.tipuls[j].takala_mizdamenet;
                        tempcardata.takala_mizdamenet_date = tempcardata.tipuls[j].takala_mizdamenet_date;
                    }
                    else if (tempcardata.tipuls[j].type == 'hh_stand') {
                        tempcardata.missing_makat_1 = tempcardata.tipuls[j].missing_makat_1;
                        tempcardata.missing_makat_2 = tempcardata.tipuls[j].missing_makat_2;
                    }
                    tempdata_to_excel.push(tempcardata)
                }
            }
            else {
                tempdata_to_excel.push(props.data[i])
            }
        }

        for (let i = 0; i < tempdata_to_excel.length; i++) {
            pikods.map((pikod, index) => (pikod._id == tempdata_to_excel[i].pikod ? tempdata_to_excel[i].pikod_name = pikod.name : null));
            ogdas.map((ogda, index) => (ogda._id == tempdata_to_excel[i].ogda ? tempdata_to_excel[i].ogda_name = ogda.name : null));
            hativas.map((hativa, index) => (hativa._id == tempdata_to_excel[i].hativa ? tempdata_to_excel[i].hativa_name = hativa.name : null));
            gdods.map((gdod, index) => (gdod._id == tempdata_to_excel[i].gdod ? tempdata_to_excel[i].gdod_name = gdod.name : null));

            magadals.map((magadal, index) => (magadal._id == tempdata_to_excel[i].magadal ? tempdata_to_excel[i].magadal_name = magadal.name : null));
            magads.map((magad, index) => (magad._id == tempdata_to_excel[i].magad ? tempdata_to_excel[i].magad_name = magad.name : null));
            mkabazs.map((mkabaz, index) => (mkabaz._id == tempdata_to_excel[i].mkabaz ? tempdata_to_excel[i].mkabaz_name = mkabaz.name : null));
            makats.map((makat, index) => (makat._id == tempdata_to_excel[i].makat ? tempdata_to_excel[i].makat_name = makat.name : null));
            makats.map((makat, index) => (makat._id == tempdata_to_excel[i].makat ? tempdata_to_excel[i].makat_description_name = makat.description : null));

            tempdata_to_excel[i].latest_recalibration_date = tempdata_to_excel[i].latest_recalibration_date ? tempdata_to_excel[i].latest_recalibration_date.slice(0, 10).split("-").reverse().join("-") : null;
            tempdata_to_excel[i].expected_repair = tempdata_to_excel[i].expected_repair ? tempdata_to_excel[i].expected_repair.slice(0, 10).split("-").reverse().join("-") : null;
        }

        setData_to_excel(tempdata_to_excel);
    }

    async function init() {
        await loadPikods();
        await loadOgdas();
        await loadHativas();
        await loadGdods();
        await loadMagadals();
        await loadMagads();
        await loadMkabazs();
        await loadMakats();
        setFlag(true);
    }

    useEffect(() => {
        init()
    }, []);

    useEffect(() => {
        if (flag == true) {
            FixData()
        }
    }, [props.data, flag]);

    return (
        <>
            <ExcelFile element={<button>Download Data</button>}>
                <ExcelSheet data={data_to_excel} name="קובץ">
                    <ExcelColumn label="צ'" value="carnumber" />
                    <ExcelColumn label="מאגד על" value="magadal_name" />{/* */}
                    <ExcelColumn label="מאגד" value="magad_name" />{/* */}
                    <ExcelColumn label="מקבץ" value="mkabaz_name" />{/* */}
                    <ExcelColumn label='מק"ט' value="makat_name" />{/* */}
                    <ExcelColumn label='תיאור מק"ט' value="makat_description_name" />{/* */}
                    <ExcelColumn label="משפחה" value="family" />
                    <ExcelColumn label="פיקוד" value="pikod_name" />{/* */}
                    <ExcelColumn label="אוגדה" value="ogda_name" />{/* */}
                    <ExcelColumn label="חטיבה" value="hativa_name" />{/* */}
                    <ExcelColumn label="גדוד" value="gdod_name" />{/* */}
                    <ExcelColumn label="פלוגה" value="pluga" />
                    <ExcelColumn label='שבצ"ק' value="shabzak" />
                    <ExcelColumn label='מיקום בימ"ח' value="mikum_bimh" />
                    <ExcelColumn label="מעמד הכלי" value="stand" />
                    <ExcelColumn label="סטאטוס הכלי" value="status" />
                    <ExcelColumn label="זמינות" value="zminot" />
                    <ExcelColumn label="כשירות למלחמה" value="kshirot" />
                    <ExcelColumn label="מיקום" value="mikum" />
                    <ExcelColumn label="מועד כיול אחרון" value="latest_recalibration_date" />

                    <ExcelColumn label="תיאור תקלה" value="takala_info" />
                    <ExcelColumn label="צפי תיקון" value="expected_repair" />

                    <ExcelColumn label="טיפול" value="tipul" />
                    <ExcelColumn label="תאריך כניסה לטיפול" value="tipul_entry_date" />
                    <ExcelColumn label="מיקום טיפול" value="mikum_tipul" />

                    <ExcelColumn label="חריג טיפול" value="harig_tipul" />
                    <ExcelColumn label="תאריך חריגת טיפול" value="harig_tipul_date" />

                    <ExcelColumn label="תקלה מזדמנת" value="takala_mizdamenet" />
                    <ExcelColumn label="תאריך תקלה מזדמנת" value="takala_mizdamenet_date" />

                    <ExcelColumn label='מק"ט חסר' value="missing_makat_1" />
                    <ExcelColumn label="כמות" value="missing_makat_2" />
                </ExcelSheet>
            </ExcelFile>
        </>
    );
}

export default withRouter(DownLoadToExcel);