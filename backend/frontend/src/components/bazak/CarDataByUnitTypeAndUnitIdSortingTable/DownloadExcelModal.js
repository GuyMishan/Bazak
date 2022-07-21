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
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const DownloadExcelModal = (props) => {
  const [data_to_excel, setData_to_excel] = useState([])
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
  }

  useEffect(() => {
    init()
  }, []);

  useEffect(() => {
    if (props.isOpen == true)
      FixData();
    else {

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
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>תצוגה מקדימה</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <>
                <div style={{ float: 'right', paddingBottom: '5px' }}>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-123"
                    className="btn-green"
                    table="table-to-xls-123"
                    filename="קובץ - זמינות"
                    sheet="קובץ - זמינות"
                    buttonText="הורד כקובץ אקסל"
                    style={{ float: 'right' }}
                  />
                </div>
                <div className="table-responsive" style={{ overflow: 'auto' }}>
                  <table id="table-to-xls-123">
                    <thead>
                      <tr>
                        <th>צ'</th>
                        <th>מאגד על</th>
                        <th>מאגד</th>
                        <th>מקבץ</th>
                        <th>מק"ט</th>
                        <th>תיאור מק"ט</th>
                        <th>משפחה</th>
                        <th>פיקוד</th>
                        <th>אוגדה</th>
                        <th>חטיבה</th>
                        <th>גדוד</th>
                        <th>פלוגה</th>
                        <th>שבצ"ק</th>
                        <th>מיקום בימ"ח</th>
                        <th>מעמד הכלי</th>
                        <th>סטאטוס הכלי</th>
                        <th>זמינות</th>
                        <th>כשירות למלחמה</th>
                        <th>מיקום</th>
                        <th>מועד כיול אחרון</th>

                        <th>תיאור תקלה</th>
                        <th>צפי תיקון</th>

                        <th>טיפול</th>
                        <th>תאריך כניסה לטיפול</th>
                        <th>מיקום טיפול</th>

                        <th>חריג טיפול</th>
                        <th>תאריך חריגת טיפול</th>

                        <th>תקלה מזדמנת</th>
                        <th>תאריך תקלה מזדמנת</th>

                        <th>מק"ט חסר</th>
                        <th>כמות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data_to_excel.map((data, index) => {
                        return (<tr>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.carnumber}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.magadal_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.magad_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.mkabaz_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.makat_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.makat_description_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.family}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.pikod_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.ogda_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.hativa_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.gdod_name}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.pluga}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.shabzak}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.mikum_bimh}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.stand}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.status}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.zminot}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.kshirot}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.mikum}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.latest_recalibration_date}</td>

                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.takala_info}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.expected_repair}</td>

                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.tipul}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.tipul_entry_date}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.mikum_tipul}</td>

                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.harig_tipul}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.harig_tipul_date}</td>

                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.takala_mizdamenet}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.takala_mizdamenet_date}</td>

                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.missing_makat_1}</td>
                          <td style={{ width: `${100 / 31}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }}>{data.missing_makat_2}</td>
                        </tr>)
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(DownloadExcelModal);;