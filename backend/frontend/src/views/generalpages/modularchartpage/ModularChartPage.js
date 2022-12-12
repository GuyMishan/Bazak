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
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getCarDataFunc } from 'redux/features/cardata/cardataSlice'

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

  const getReduxCardDataByUnitTypeAndUnitId = async () => {
    if (reduxcardata.length == 0) {
      await dispatch(getCarDataFunc(user));
    }
  }

  function init() {
    getchartdata();
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
          let tempsubchart = {};
          tempsubchart.tenetree = [tempchart.tenetree[i]];

          //axios to find name..
          let lastKey = Object.keys(tempsubchart.tenetree[0]).pop();
          let lastValue = tempsubchart.tenetree[0][lastKey]
          let response = await axios.get(`http://localhost:8000/api/${lastKey}/${lastValue}`)
          tempsubchart.name = response.data.name

          tempsubchart.units = tempchart.units;
          tempsubchart.stand = tempchart.stand;
          tempsubchart.status = tempchart.status;
          tempsubcharts.push(tempsubchart)
        }
      }
      else {
        await axios.get(`http://localhost:8000/api/magadal`)
          .then(response => {
            for (let i = 0; i < response.data.length; i++) {
              let tempsubchart = {};
              tempsubchart.tenetree = [{ magadal: response.data[i]._id }];
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
              tempsubchart.tenetree = [{ magad: response.data[i]._id }];
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
              tempsubchart.tenetree = [{ mkabaz: response.data[i]._id }];
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
              tempsubchart.tenetree = [{ makat: response.data[i]._id }];
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
    <>
      <ChartModal isOpen={ischartmodalopen} Toggle={() => ToggleForModal()} ToggleForModal={ToggleForModal} chartid={chartidformodal} screenid={chartdata.screenid} init={() => init()} />

      <div>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {props.theme == "white-content" ?
              <h1 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {chartdata.name}</h1>
              : <h1 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {chartdata.name}</h1>}
          </div>

          <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
            <>
              <Col xs={12} md={8}>
                <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleForModal}>ערוך תרשים</button>
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
      </div>
    </>
  );
}

export default withRouter(ModularChartPage);