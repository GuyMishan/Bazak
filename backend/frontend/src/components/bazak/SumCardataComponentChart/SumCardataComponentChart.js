import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

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
import { signin, authenticate, isAuthenticated } from 'auth/index';

function SumCardataComponentChart(props) {
  const [SumCarData, setSumCarData] = useState("");

  const fixCarDataByCharts = async () => {
    console.log("ddsd")
    let temp_cardata_by_chart_final = [];
    let temp_cardata_by_chart;

    for (let k = 0; k < props.charts.length; k++) {
      temp_cardata_by_chart = props.cardatas;

      //filter by chartdata
      if (props.charts[k].units && props.charts[k].units.length > 0) {
        let temp_cardata_by_chart_copy3 = []
        for (let i = 0; i < props.charts[k].units.length; i++) {
          let lastKey = Object.keys(props.charts[k].units[i]).pop();
          let lastValue = props.charts[k].units[i][Object.keys(props.charts[k].units[i]).pop()]
          let temp = temp_cardata_by_chart.filter(cardata => ((cardata[lastKey] == lastValue)));
          temp_cardata_by_chart_copy3 = temp_cardata_by_chart_copy3.concat(temp);//theres duplicates
        }
        temp_cardata_by_chart = [...new Set(temp_cardata_by_chart_copy3)]; // removes duplicates
      }

      if (props.charts[k].tenetree && props.charts[k].tenetree.length > 0) {
        let temp_cardata_by_chart_copy4 = []
        for (let i = 0; i < props.charts[k].tenetree.length; i++) {
          let lastKey = Object.keys(props.charts[k].tenetree[i]).pop();
          let lastValue = props.charts[k].tenetree[i][Object.keys(props.charts[k].tenetree[i]).pop()]
          let temp = temp_cardata_by_chart.filter(cardata => ((cardata[lastKey] == lastValue)));
          temp_cardata_by_chart_copy4 = temp_cardata_by_chart_copy4.concat(temp);//theres duplicates
        }
        temp_cardata_by_chart = [...new Set(temp_cardata_by_chart_copy4)];// removes duplicates
      }

      let temp_cardata_by_chart_copy1 = []
      for (let i = 0; i < props.charts[k].stand.length; i++) {
        let temp = temp_cardata_by_chart.filter(cardata => ((cardata.stand == props.charts[k].stand[i])));
        temp_cardata_by_chart_copy1 = temp_cardata_by_chart_copy1.concat(temp)
      }
      temp_cardata_by_chart = temp_cardata_by_chart_copy1;

      let temp_cardata_by_chart_copy2 = []
      for (let i = 0; i < props.charts[k].status.length; i++) {
        let temp = temp_cardata_by_chart.filter(cardata => ((cardata.status == props.charts[k].status[i])));
        temp_cardata_by_chart_copy2 = temp_cardata_by_chart_copy2.concat(temp)
      }
      temp_cardata_by_chart = temp_cardata_by_chart_copy2;
      //
      temp_cardata_by_chart_final = temp_cardata_by_chart_final.concat(temp_cardata_by_chart)
    }
    temp_cardata_by_chart_final = [...new Set(temp_cardata_by_chart_final)]; // removes duplicates

    setSumCarData(temp_cardata_by_chart_final.length)
  }

  useEffect(() => {
    fixCarDataByCharts();
  }, [props.charts, props.cardatas]);

  return (
    <h3 style={{ margin: '0px' }}>סה"כ צ': {SumCarData}</h3>
  );
}

export default withRouter(SumCardataComponentChart);
