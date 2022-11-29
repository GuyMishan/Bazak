import React, { useState, useEffect, useRef } from 'react';
import {useParams, Link, withRouter, Redirect } from "react-router-dom";
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

function ModularChartPage(props) {
  const {screenid} = useParams();
  const [mode, setMode] = useState('normal');// normal/edit
  const [charts, setCharts] = useState([]);
  const [chartsinline, setChartsInline] = useState([]);



  const [filteredcharts, setFilteredcharts] = useState([]);
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

  function init() {
    getchartsbyscreen();
    getchartsinline();
  }

  async function getchartsbyscreen() {
    let response = await axios.get(`http://localhost:8000/api/modularscreens/chartsbyscreenid/${screenid}`)
    let tempcardata = response.data;
    setCharts(tempcardata)
    setFilteredcharts(tempcardata)
  }

  const getchartsinline = async () => {
    var tempscreenid = screenid;
    await axios.get(`http://localhost:8000/api/modularscreens/screenbyscreenid/${tempscreenid}`)
      .then(response => {
        let tempchartsinline = response.data[0].chartsinline;
        console.log(tempchartsinline);
        setChartsInline(tempchartsinline);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
      init();
  }, [props])

  return (
    <>
      <ChartModal isOpen={ischartmodalopen} Toggle={() => Togglechartmodal()} ToggleForModal={ToggleForModal} chartid={chartidformodal} screenid={screenid} init={()=>init()} />
      <div
        style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '90%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
        isOpen={props.isOpen}
        centered
        fullscreen
        scrollable
        size=""
        toggle={props.Toggle}>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
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
                 <ChartCard chart={chart} mode={mode} chartid={chart.chartid} init={()=> init()} Toggle={() => Togglechartmodal(chart.chartid)} />
                : null))}
          </Row>
      </div>
    </>
  );
}

export default withRouter(ModularChartPage);