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
import SubChartCard from './SubChartCard';
import PropagateLoader from "react-spinners/PropagateLoader";
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getCarDataFunc } from 'redux/features/cardata/cardataSlice'

import CarDataByUnitTypeAndUnitIdSortingTable from 'components/bazak/CarDataByUnitTypeAndUnitIdSortingTable/SortingTable';
import SumCardataComponentChart from 'components/bazak/SumCardataComponentChart/SumCardataComponentChart';

function ModularChartPage(props) {
  //user
  const { user } = isAuthenticated()
  //chartdata
  const [chartdata, setChartData] = useState({});
  //subcharts
  const [subcharts, setSubcharts] = useState([]);
  const [filteredsubcharts, setFilteredsubcharts] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //modes
  const [table_mode, setTable_mode] = useState('hidden');// hidden/shown
  //redux
  const dispatch = useDispatch()
  const reduxcardata = useSelector((state) => state.cardata.value)

  //screen modal
  const [ischartmodalopen, setIschartmodalopen] = useState(false);
  const [chartidformodal, setChartidformodal] = useState(props.match.params.chartid);

  const searchOrder = (evt) => {
    if (evt.target.value == "") {
      setFilteredsubcharts(subcharts)
    }
    setFilteredsubcharts(subcharts.filter((chart) => chart.name.toString().includes(evt.target.value.toString())))
  }

  function ToggleForModal(evt) {
    setIschartmodalopen(!ischartmodalopen);
  }

  function ToggleTable_mode(evt) {
    if (table_mode == 'hidden') {
      setTable_mode('shown');
    }
    else {
      setTable_mode('hidden');
    }
  }

  const getReduxCardDataByUnitTypeAndUnitId = async () => {
    if (reduxcardata.length == 0) {
      await dispatch(getCarDataFunc(user));
    }
  }

  function init() {
    getchartdata();
    setIsdataloaded(true);
  }

  async function getchartdata() {
    //get chart
    let response = await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${props.match.params.chartid}`)
    let tempchart = response.data[0];
    setChartData(tempchart);

    //calculate subcharts
    let tempsubcharts = [];

    if (props.match.params.cartype == 'notype') {
      if (tempchart.tenetree.length > 0) {
        for (let i = 0; i < tempchart.tenetree.length; i++) {
          for(let j=0;j<tempchart.tenetree[i][Object.keys([tempchart.tenetree[i]][0]).pop()].length;j++){
            let tempsubchart = {};
            //axios to find name..
            let lastKey = Object.keys([tempchart.tenetree[i]][0]).pop();
            let lastValue = [tempchart.tenetree[i]][0][lastKey][j]
              let response = await axios.get(`http://localhost:8000/api/${lastKey}/${lastValue}`)
              tempsubchart.name = response.data.name;
              tempsubchart.tenetree = {[Object.keys([tempchart.tenetree[i]][0]).pop()]:response.data._id};
              tempsubchart.units = tempchart.units;
              tempsubchart.stand = tempchart.stand;
              tempsubchart.status = tempchart.status;
              tempsubcharts.push(tempsubchart)
          }
        }
      }
      else {
        await axios.get(`http://localhost:8000/api/magadal`)
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              let tempsubchart = {};
              tempsubchart.tenetree = { magadal: response.data[i]._id };
              tempsubchart.name = response.data[i].name

              tempsubchart.units = tempchart.units;
              tempsubchart.stand = tempchart.stand;
              tempsubchart.status = tempchart.status;
              tempsubcharts.push(tempsubchart)
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
    else {
      if (props.match.params.cartype == 'magad') {
        await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${props.match.params.carid}`)
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              let tempsubchart = {};
              tempsubchart.tenetree = { magad: response.data[i]._id };
              tempsubchart.name = response.data[i].name

              tempsubchart.units = tempchart.units;
              tempsubchart.stand = tempchart.stand;
              tempsubchart.status = tempchart.status;
              tempsubcharts.push(tempsubchart)
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }

      if (props.match.params.cartype == 'mkabaz') {
        await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${props.match.params.carid}`)
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              let tempsubchart = {};
              tempsubchart.tenetree = { mkabaz: response.data[i]._id };
              tempsubchart.name = response.data[i].name

              tempsubchart.units = tempchart.units;
              tempsubchart.stand = tempchart.stand;
              tempsubchart.status = tempchart.status;
              tempsubcharts.push(tempsubchart)
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }

      if (props.match.params.cartype == 'makat') {
        await axios.get(`http://localhost:8000/api/makat/makatsbymkabaz/${props.match.params.carid}`)
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              let tempsubchart = {};
              tempsubchart.tenetree = { makat: response.data[i]._id };
              tempsubchart.name = response.data[i].name

              tempsubchart.units = tempchart.units;
              tempsubchart.stand = tempchart.stand;
              tempsubchart.status = tempchart.status;
              tempsubcharts.push(tempsubchart)
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
    setSubcharts(tempsubcharts)
    setFilteredsubcharts(tempsubcharts)
  }

  useEffect(() => {
    if (reduxcardata.length > 0) {
      init();
    }
  }, [props.match, props.chartid]);

  useEffect(() => {
    if (reduxcardata.length > 0 && isdataloaded == false) {
      init();
    }
  }, [reduxcardata]);

  useEffect(() => {
    getReduxCardDataByUnitTypeAndUnitId();
  }, [])

  return (
    !isdataloaded ?
      <div style={{ width: '50%', marginTop: '30%' }}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
      table_mode == 'hidden' ?
        <>
          {/* <ChartModal isOpen={ischartmodalopen} Toggle={() => ToggleForModal()} ToggleForModal={ToggleForModal} chartid={chartidformodal} screenid={chartdata.screenid} init={() => init()} /> */}

          <div>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {props.theme == "white-content" ?
                  <h1 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {chartdata.name}</h1>
                  : <h1 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {chartdata.name}</h1>}
              </div>

              <div style={{textAlign:'left',marginBottom:'10px'}}>
              <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleTable_mode}>תצוגת טבלה</button>
              </div>

              <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
                <>
                  <Col xs={12} md={8}>
                    {/* <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleForModal}>ערוך שעון</button> */}
                  </Col>
                  <Col xs={12} md={4}>
                    <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
                  </Col>
                </>
              </Row>
            </div>

            <Row>
              {filteredsubcharts.map((chart, i) => (
                chart ?
                  <SubChartCard chart={chart} init={() => init()} cardatas={reduxcardata} theme={props.theme} />
                  : null))}
            </Row>

            <Row>
              <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                <SumCardataComponentChart charts={filteredsubcharts} cardatas={reduxcardata} />
              </Col>
              <Col xs={12} md={4} style={{ textAlign: 'left' }}>
              </Col>
            </Row>

          </div>
        </> : <>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>

              {props.theme == "white-content" ?
                <h1 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {chartdata.name}</h1>
                : <h1 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {chartdata.name}</h1>}
            </div>
          </div>
          <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleTable_mode}>תצוגת שעונים</button>
          <CarDataByUnitTypeAndUnitIdSortingTable charts={filteredsubcharts} />
        </>
  );
}

export default withRouter(ModularChartPage);