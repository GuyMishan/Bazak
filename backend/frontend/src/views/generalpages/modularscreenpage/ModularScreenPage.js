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
import PropagateLoader from "react-spinners/PropagateLoader";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getCarDataFunc } from 'redux/features/cardata/cardataSlice';
//
import CarDataByUnitTypeAndUnitIdSortingTable from 'components/bazak/CarDataByUnitTypeAndUnitIdSortingTable/SortingTable';
import SumCardataComponentChart from 'components/bazak/SumCardataComponentChart/SumCardataComponentChart';

function ModularScreenPage(props) {
  //user
  const { user } = isAuthenticated()
  //screendata
  const [screendata, setScreenData] = useState({});
  //charts
  const [charts, setCharts] = useState([]);
  const [filteredcharts, setFilteredcharts] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //modes
  const [mode, setMode] = useState('normal');// normal/edit
  const [table_mode, setTable_mode] = useState('hidden');// hidden/shown
  //redux
  const dispatch = useDispatch()
  const reduxcardata = useSelector((state) => state.cardata.value)
  //drag&drop
  const dragChart = useRef();
  const dragNode = useRef();
  const [dragging, setDragging] = useState(false);

  //screen modal
  const [ischartmodalopen, setIschartmodalopen] = useState(false);
  const [chartidformodal, setChartidformodal] = useState(undefined);


  const searchOrder = (evt) => {
    if (evt.target.value == "") {
      setFilteredcharts(charts)
    }
    setFilteredcharts(charts.filter((chart) => chart.name.toString().includes(evt.target.value.toString())))
  }

  const handleDragStart = (e, params) =>{
     console.log('drag starting..', params);
     dragChart.current = params;
     dragNode.current = e.target;
     dragNode.current.addEventListener('dragend', handleDragEnd);
     setDragging(true);
  }

  const handleDragEnter = (e, params) =>{
      const currentChart = dragChart.current;
      dragChart.target = params;
  }

  const handleDragEnd = async() =>{
   console.log('ending drag...');
   const currentChart = dragChart.current;
    let tempchartindex = charts[dragChart.target].index;
    charts[dragChart.target].index = charts[currentChart].index;
    charts[currentChart].index = tempchartindex;
   let response2 = await axios.put(`http://localhost:8000/api/modularscreens/chart/${charts[dragChart.target].chartid}`, charts[dragChart.target])
            .then(async response2 => {
              let response3 = await axios.put(`http://localhost:8000/api/modularscreens/chart/${charts[dragChart.current].chartid}`, charts[dragChart.current])
              .then(response3 => {
  
            })
          })
   setDragging(false);
   dragNode.current.removeEventListener('dragend', handleDragEnd);
   dragChart.current = null;
   dragNode.current = null;
   init();
 }

  function ToggleMode(evt) {
    if (mode == 'normal') {
      setMode('edit');
    }
    else {
      setMode('normal');
    }
  }

  function ToggleTable_mode(evt) {
    if (table_mode == 'hidden') {
      setTable_mode('shown');
    }
    else {
      setTable_mode('hidden');
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
    setIsdataloaded(true);
  }

  async function getscreendata() {
    if (props.match.params.screenid) {
      let response = await axios.get(`http://localhost:8000/api/modularscreens/screenbyscreenid/${props.match.params.screenid}`)
      let tempscreen = response.data[0];
      setScreenData(tempscreen)
    }
    else {
      let response = await axios.get(`http://localhost:8000/api/modularscreens/screenbyscreenid/${props.screenid}`)
      let tempscreen = response.data[0];
      setScreenData(tempscreen)
    }
  }

  async function getchartsbyscreen() {
    if (props.match.params.screenid) {
      let response = await axios.get(`http://localhost:8000/api/modularscreens/chartsbyscreenid/${props.match.params.screenid}`)
      let tempcardata = response.data;
      for(let i=0;i<tempcardata.length;i++){//to fix charts with no index
        if(tempcardata[i].index == undefined){
          tempcardata[i].index = i;
          let response3 = await axios.put(`http://localhost:8000/api/modularscreens/chart/${tempcardata[i].chartid}`, tempcardata[i])
              .then(response3 => {
  
            })
        }
      }
      quickSort(tempcardata,0,tempcardata.length-1);
      setCharts(tempcardata);
      setFilteredcharts(tempcardata);
    }
    else {
      let response = await axios.get(`http://localhost:8000/api/modularscreens/chartsbyscreenid/${props.screenid}`)
      let tempcardata = response.data;
      for(let i=0;i<tempcardata.length;i++){//to fix charts with no index
        if(tempcardata[i].index == undefined){
          tempcardata[i].index = i;
          let response3 = await axios.put(`http://localhost:8000/api/modularscreens/chart/${tempcardata[i].chartid}`, tempcardata[i])
              .then(response3 => {
  
            })
        }
      }
      quickSort(tempcardata,0,tempcardata.length-1);
      setCharts(tempcardata)
      setFilteredcharts(tempcardata)
    }
  }

  // A utility function to swap two elements
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

/* This function takes last element as pivot, places
 the pivot element at its correct position in sorted
 array, and places all smaller (smaller than pivot)
 to left of pivot and all greater elements to right
 of pivot */
function partition(arr, low, high) {

  // pivot
  let pivot = arr[high].index;
  // Index of smaller element and
  // indicates the right position
  // of pivot found so far
  let i = (low - 1);

  for (let j = low; j <= high - 1; j++) {

      // If current element is smaller 
      // than the pivot
      if (arr[j].index < pivot) {

          // Increment index of 
          // smaller element
          i++;
          swap(arr, i, j);
      }
  }
  swap(arr, i + 1, high);
  return (i + 1);
}

/* The main function that implements QuickSort
        arr[] --> Array to be sorted,
        low --> Starting index,
        high --> Ending index
*/
function quickSort(arr, low, high) {
  if (low < high) {

      // pi is partitioning index, arr[p]
      // is now at right place 
      let pi = partition(arr, low, high);

      // Separately sort elements before
      // partition and after partition
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
  }
}

  useEffect(() => {
    if (reduxcardata.length > 0) {
      init();
    }
  }, [props.match, props.screenid]);

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
          {props.match.params.screenid ?
            <ChartModal isOpen={ischartmodalopen} Toggle={() => Togglechartmodal()} ToggleForModal={ToggleForModal} chartid={chartidformodal} screenid={props.match.params.screenid} init={() => init()} index={charts.length}/>
            : <ChartModal isOpen={ischartmodalopen} Toggle={() => Togglechartmodal()} ToggleForModal={ToggleForModal} chartid={chartidformodal} screenid={props.screenid} init={() => init()} index={charts.length}/>}

          <div>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>

                {props.theme == "white-content" ?
                  <h1 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {screendata.name}</h1>
                  : <h1 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {screendata.name}</h1>}
              </div>
              <div style={{textAlign:'left',marginBottom:'10px'}}>
              <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleTable_mode}>תצוגת טבלה</button>
              </div>

              <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
                {mode == 'normal' ?
                  <>
                    <Col xs={12} md={8}>
                      <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>ערוך</button>
                    </Col>
                    <Col xs={12} md={4}>
                      <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
                    </Col>
                  </>
                  : <>
                    <Col xs={12} md={8}>
                      <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>שמור</button>
                      <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={() => Togglechartmodal(undefined)}>צור שעון</button>
                    </Col>
                    <Col xs={12} md={4}>
                      <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
                    </Col>
                  </>}
              </Row>
            </div>
            
              <Row>
                {filteredcharts.map((chart, i) => (
                  chart ?
                    <div className='draggableChart' draggable onDragStart={(e) => {handleDragStart(e,i)}} onDragEnter={dragging?(e) => {handleDragEnter(e,i)}:null} style={{width:`${100/screendata.chartsinline}%`}}>
                    <ChartCard  chart={chart} mode={mode} chartid={chart.chartid} init={() => init()} Toggle={() => Togglechartmodal(chart.chartid)} cardatas={reduxcardata} theme={props.theme} screendata={screendata} charts={charts}/>
                    </div>
                    : null))}
              </Row>

            <Row>
              <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                <SumCardataComponentChart charts={filteredcharts} cardatas={reduxcardata} />
              </Col>
              <Col xs={12} md={4} style={{ textAlign: 'left' }}>
              </Col>
            </Row>

          </div>
        </> :
        <>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>

              {props.theme == "white-content" ?
                <h1 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {screendata.name}</h1>
                : <h1 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {screendata.name}</h1>}
            </div>
          </div>
          <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleTable_mode}>תצוגת שעונים</button>

          <CarDataByUnitTypeAndUnitIdSortingTable charts={filteredcharts} />
        </>
  );
}

export default withRouter(ModularScreenPage);