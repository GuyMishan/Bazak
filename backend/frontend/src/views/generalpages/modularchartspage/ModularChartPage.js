import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, withRouter, Redirect } from "react-router-dom";
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
  ModalBody,
  CardFooter
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import ChartModal from 'components/bazak/ModularScreensModals/ChartModal/ChartModal';
import ChartCard from './ChartCard';
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getCarDataFunc } from 'redux/features/cardata/cardataSlice'

function ModularChartPage(props) {
  //user
  const { user } = isAuthenticated()
  //screendata
  const [screendata, setScreenData] = useState({});
  //charts
  const [charts, setCharts] = useState([]);
  const [filteredcharts, setFilteredcharts] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //mode
  const [mode, setMode] = useState('normal');// normal/edit
  //redux
  const dispatch = useDispatch()
  const reduxcardata = useSelector((state) => state.cardata.value)

  //screen modal
  const [ischartmodalopen, setIschartmodalopen] = useState(false);
  const [chartidformodal, setChartidformodal] = useState(undefined);

  const searchOrder = (evt) => {
    if (evt.target.value == "") {
      setFilteredcharts(charts)
    }
    setFilteredcharts(charts.filter((chart) => chart.name.toString().includes(evt.target.value.toString())))
  }

  function ToggleMode(evt) {
    if (mode == 'normal') {
      setMode('edit');
    }
    else {
      setMode('normal');
    }
  }

  const Togglechartmodal = (value) => {
    if (value == undefined) {
      setChartidformodal(undefined);
    }
    else {
      setChartidformodal(value);
    }
    setIschartmodalopen(!ischartmodalopen);
  }

  function ToggleForModal(evt) {
    setIschartmodalopen(!ischartmodalopen);
  }

  const getReduxCardDataByUnitTypeAndUnitId = async () => {
    if (reduxcardata.length == 0) {
      await dispatch(getCarDataFunc(user));
    }
  }

  function init() {
    getscreendata();
    getchartsbyscreen();
  }

  async function getscreendata() {
    let response = await axios.get(`http://localhost:8000/api/modularscreens/screenbyscreenid/${props.match.params.screenid}`)
    let tempscreen = response.data[0];
    setScreenData(tempscreen)
  }

  async function getchartsbyscreen() {
    let response = await axios.get(`http://localhost:8000/api/modularscreens/chartsbyscreenid/${props.match.params.screenid}`)
    let tempcardata = response.data;
    setCharts(tempcardata)
    setFilteredcharts(tempcardata)
  }

  useEffect(() => {
    if (reduxcardata.length > 0) {
      init();
    }
  }, [props.match]);

  useEffect(() => {
    if (reduxcardata.length > 0 && isdataloaded == false) {
      init();
    }
  }, [reduxcardata]);

  useEffect(() => {
    getReduxCardDataByUnitTypeAndUnitId();
  }, [])

  return (
    <>
      <ChartModal isOpen={ischartmodalopen} Toggle={() => Togglechartmodal()} ToggleForModal={ToggleForModal} chartid={chartidformodal} screenid={props.match.params.screenid} init={() => init()} />
      <div>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>

            {props.theme == "white-content" ?
                <h1 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {screendata.name}</h1>
                : <h1 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {screendata.name}</h1>}
          </div>

          {mode == 'normal' ?
            <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>ערוך</button>
            : <>
              <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>צא ממצב עריכה</button>
              <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={() => Togglechartmodal(undefined)}>צור תרשים</button>
            </>}
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Row>
            <Col xs={12} md={4}>
              <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
            </Col>
            <Col xs={12} md={8}>
            </Col>
          </Row>
        </div>

        <Row>
          {filteredcharts.map((chart, i) => (
            chart ?
              <ChartCard chart={chart} mode={mode} chartid={chart.chartid} init={() => init()} Toggle={() => Togglechartmodal(chart.chartid)} cardatas={reduxcardata} theme={props.theme} screendata={screendata}/>
              : null))}
        </Row>
      </div>
    </>
  );
}

export default withRouter(ModularChartPage);