import React, { useState, useEffect, useRef } from "react";
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
  CardFooter,
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { signin, authenticate, isAuthenticated } from "auth/index";
import { produce } from "immer";
import { generate } from "shortid";
import { toast } from "react-toastify";
import ChartModal from "components/bazak/ModularScreensModals/ChartModal/ChartModal";
import ChartCard from "./ChartCard";
import PropagateLoader from "react-spinners/PropagateLoader";
//redux
import { useSelector, useDispatch } from "react-redux";
import { getCarDataFunc } from "redux/features/cardata/cardataSlice";
//
import CarDataByUnitTypeAndUnitIdSortingTable from "components/bazak/CarDataByUnitTypeAndUnitIdSortingTable/SortingTable";
import SumCardataComponentChart from "components/bazak/SumCardataComponentChart/SumCardataComponentChart";

function ModularScreenPage(props) {
  //user
  const { user } = isAuthenticated();
  //screendata
  const [screendata, setScreenData] = useState({});
  //charts
  const [charts, setCharts] = useState([]);
  const [filteredcharts, setFilteredcharts] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //modes
  const [mode, setMode] = useState("normal"); // normal/edit
  const [table_mode, setTable_mode] = useState("hidden"); // hidden/shown
  //redux
  const dispatch = useDispatch();
  const reduxcardata = useSelector((state) => state.cardata.value);
  //drag&drop
  const dragChart = useRef();
  const targetDragChart = useRef();
  const dragNode = useRef();
  const [dragging, setDragging] = useState(false);

  //screen modal
  const [ischartmodalopen, setIschartmodalopen] = useState(false);
  const [chartidformodal, setChartidformodal] = useState(undefined);

  const searchOrder = (evt) => {
    if (evt.target.value == "") {
      setFilteredcharts(charts);
    }
    setFilteredcharts(
      charts.filter((chart) =>
        chart.name.toString().includes(evt.target.value.toString())
      )
    );
  };

  // Handles the start of a drag event.
  const handleDragStart = (e, params) => {
      // e.preventDefault();
      // Get the component element
      let component = document.getElementsByClassName("draggableChart")[params];
      // makeDraggableComponentFollowMouse(component); //this function makes a copy of the draggable component, corrently not working properly 

    dragChart.current = params;
    dragNode.current = e.target;

    // Add an event listener for the dragend event
    dragNode.current.addEventListener("dragend", handleDragEnd);

    // Set the dragging state to true
    setDragging(true);
  };

  // Handles the enter of a drag event over another element.
  const handleDragEnter = (e, params) => {
    // Store a reference to the params for the chart being dragged over
    const currentChart = dragChart.current;
    targetDragChart.current = params;
  };

  /**
   * Handles the end of a drag event.
   */
  const handleDragEnd = async () => {
    // Swap the index values of the charts at the targetDragChart.current and dragChart.current indices
    const currentChart = dragChart.current;
    let tempchartindex = charts[targetDragChart.current].index;
    charts[targetDragChart.current].index = charts[currentChart].index;
    charts[currentChart].index = tempchartindex;

    // Make HTTP PUT requests to update the charts on the server
    let response2 = await axios
      .put(`http://localhost:8000/api/modularscreens/chart/${charts[targetDragChart.current].chartid}`, charts[targetDragChart.current])
      .then(async (response2) => {
        let response3 = await axios
          .put(`http://localhost:8000/api/modularscreens/chart/${charts[dragChart.current].chartid}`, charts[dragChart.current])
          .then((response3) => {});
      });

    // Reset the dragging state, remove the dragend event listener, and clear the dragChart.current and dragNode.current variables
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragChart.current = null;
    dragNode.current = null;

    // Call the init function
    init();
  };

  // function makeDraggableComponentFollowMouse(component) {//this function makes a copy of the draggable component, corrently not working properly 
  //  // Create a copy of the component
  //  let copy = component.cloneNode(true);
  
  //   // Set the copy's position to absolute so it can be positioned on top of other elements
  //   copy.style.position = "absolute";
  
  //   // Set the copy's z-index to a high value so it appears above other elements on the page
  //   copy.style.zIndex = 1000;
  
  //   // Add the copy to the document body
  //   document.body.appendChild(copy);
  
  //   // Make the copy visible
  //   copy.style.opacity = 1;

  //   // Get the dimensions of the copy
  //   let rect = copy.getBoundingClientRect();
  
  //   // Calculate the x and y offsets to center the copy under the mouse
  //   let xOffset = rect.width / 2;
  //   let yOffset = rect.height / 2;
  
  //   // Set the initial position of the copy based on the mouse position
  //   copy.style.left = (copy.clientX - xOffset) + "px";
  //   copy.style.top = (copy.clientY - yOffset) + "px";
  
  //   // Attach the mouseMoveHandler function as a mousemove event listener
  //   document.body.addEventListener("mousemove", mouseMoveHandler);
  
  //   // Add a mouseup event listener to the document body
  //   document.body.addEventListener("mouseup", (event) => {
  //     // Remove the copy from the document
  //      copy.remove();
  
  //     // Remove the mouseMoveHandler function as a mousemove event listener
  //     document.body.removeEventListener("mousemove", mouseMoveHandler);
  //   });
  
  //   // Define the mouseMoveHandler function
  //   function mouseMoveHandler(event) {
  //     // Get the dimensions of the copy
  //     let rect = copy.getBoundingClientRect();
  
  //     // Calculate the x and y offsets to center the copy under the mouse
  //     let xOffset = rect.width / 2;
  //     let yOffset = rect.height / 2;
  
  //     // Update the position of the copy based on the mouse position and the offsets
  //     copy.style.left = (event.clientX - xOffset) + "px";
  //     copy.style.top = (event.clientY - yOffset) + "px";
  //   }
  // }
  
  

  function ToggleMode(evt) {
    if (mode == "normal") {
      setMode("edit");
    } else {
      setMode("normal");
    }
  }

  function ToggleTable_mode(evt) {
    if (table_mode == "hidden") {
      setTable_mode("shown");
    } else {
      setTable_mode("hidden");
    }
  }

  const Togglechartmodal = (value) => {
    if (value == undefined) {
      setChartidformodal(undefined);
    } else {
      setChartidformodal(value);
    }
    setIschartmodalopen(!ischartmodalopen);
  };

  function ToggleForModal(evt) {
    setIschartmodalopen(!ischartmodalopen);
  }

  const getReduxCardDataByUnitTypeAndUnitId = async () => {
    if (reduxcardata.length == 0) {
      await dispatch(getCarDataFunc(user));
    }
  };

  function init() {
    getscreendata();
    getchartsbyscreen();
    setIsdataloaded(true);
  }

  async function getscreendata() {
    if (props.match.params.screenid) {
      let response = await axios.get(
        `http://localhost:8000/api/modularscreens/screenbyscreenid/${props.match.params.screenid}`
      );
      let tempscreen = response.data[0];
      setScreenData(tempscreen);
    } else {
      let response = await axios.get(
        `http://localhost:8000/api/modularscreens/screenbyscreenid/${props.screenid}`
      );
      let tempscreen = response.data[0];
      setScreenData(tempscreen);
    }
  }

  async function getchartsbyscreen() {
    if (props.match.params.screenid) {
      let response = await axios.get(
        `http://localhost:8000/api/modularscreens/chartsbyscreenid/${props.match.params.screenid}`
      );
      let tempcardata = response.data;
      for (let i = 0; i < tempcardata.length; i++) {
        //to fix charts with no index
        if (tempcardata[i].index == undefined) {
          tempcardata[i].index = i;
          let response3 = await axios
            .put(
              `http://localhost:8000/api/modularscreens/chart/${tempcardata[i].chartid}`,
              tempcardata[i]
            )
            .then((response3) => {});
        }
      }
      quickSort(tempcardata, 0, tempcardata.length - 1);
      setCharts(tempcardata);
      setFilteredcharts(tempcardata);
    } else {
      let response = await axios.get(
        `http://localhost:8000/api/modularscreens/chartsbyscreenid/${props.screenid}`
      );
      let tempcardata = response.data;
      for (let i = 0; i < tempcardata.length; i++) {
        //to fix charts with no index
        if (tempcardata[i].index == undefined) {
          tempcardata[i].index = i;
          let response3 = await axios
            .put(
              `http://localhost:8000/api/modularscreens/chart/${tempcardata[i].chartid}`,
              tempcardata[i]
            )
            .then((response3) => {});
        }
      }
      quickSort(tempcardata, 0, tempcardata.length - 1);
      setCharts(tempcardata);
      setFilteredcharts(tempcardata);
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
    let i = low - 1;

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
    return i + 1;
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
  }, []);

  return !isdataloaded ? (
    <div style={{ width: "50%", marginTop: "30%" }}>
      <PropagateLoader color={"#ff4650"} loading={true} size={25} />
    </div>
  ) : table_mode == "hidden" ? (
    <>
      {props.match.params.screenid ? (
        <ChartModal
          isOpen={ischartmodalopen}
          Toggle={() => Togglechartmodal()}
          ToggleForModal={ToggleForModal}
          chartid={chartidformodal}
          screenid={props.match.params.screenid}
          init={() => init()}
          index={charts.length}
        />
      ) : (
        <ChartModal
          isOpen={ischartmodalopen}
          Toggle={() => Togglechartmodal()}
          ToggleForModal={ToggleForModal}
          chartid={chartidformodal}
          screenid={props.screenid}
          init={() => init()}
          index={charts.length}
        />
      )}

      <div>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            {props.theme == "white-content" ? (
              <h1 style={{ fontWeight: "bold", color: "rgb(54,78,104)" }}>
                זמינות האמל"ח - {screendata.name}
              </h1>
            ) : (
              <h1 style={{ fontWeight: "bold", color: "hsla(0,0%,100%,.8)" }}>
                כשירות האמל"ח - {screendata.name}
              </h1>
            )}
          </div>
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <button
              className="btn-new-blue"
              style={{ marginLeft: "5px" }}
              onClick={ToggleTable_mode}
            >
              תצוגת טבלה
            </button>
          </div>

          <Row style={{ textAlign: "right", marginBottom: "20px" }}>
            {mode == "normal" ? (
              <>
                <Col xs={12} md={8}>
                  <button
                    className="btn-new-blue"
                    style={{ marginLeft: "5px" }}
                    onClick={ToggleMode}
                  >
                    ערוך
                  </button>
                </Col>
                <Col xs={12} md={4}>
                  <Input
                    placeholder="חפש..."
                    onChange={(text) => searchOrder(text)}
                  />
                </Col>
              </>
            ) : (
              <>
                <Col xs={12} md={8}>
                  <button
                    className="btn-new-blue"
                    style={{ marginLeft: "5px" }}
                    onClick={ToggleMode}
                  >
                    שמור
                  </button>
                  <button
                    className="btn-new-blue"
                    style={{ marginLeft: "5px" }}
                    onClick={() => Togglechartmodal(undefined)}
                  >
                    צור שעון
                  </button>
                </Col>
                <Col xs={12} md={4}>
                  <Input
                    placeholder="חפש..."
                    onChange={(text) => searchOrder(text)}
                  />
                </Col>
              </>
            )}
          </Row>
        </div>

        <Row>

          {filteredcharts.map((chart, i) =>
            chart ? (
              mode == "edit" ?
              (
              <div className="draggableChart" draggable onDragStart={(e) => {handleDragStart(e, i); }} onDragEnter={ dragging ? (e) => { handleDragEnter(e, i); } : null } style={{ width: `${100 / screendata.chartsinline}%`}}>
                <ChartCard chart={chart} mode={mode} chartid={chart.chartid} init={() => init()} Toggle={() => Togglechartmodal(chart.chartid)} cardatas={reduxcardata} theme={props.theme} screendata={screendata} charts={charts} />
              </div>
              )
              :
              (
                <div style={{ width: `${100 / screendata.chartsinline}%`}}>
               <ChartCard chart={chart} mode={mode} chartid={chart.chartid} init={() => init()} Toggle={() => Togglechartmodal(chart.chartid)} cardatas={reduxcardata} theme={props.theme} screendata={screendata} charts={charts} />
               </div>
              )
              
            ) : null
          )}
        </Row>

        <Row>
          <Col xs={12} md={8} style={{ textAlign: "right" }}>
            <SumCardataComponentChart
              charts={filteredcharts}
              cardatas={reduxcardata}
            />
          </Col>
          <Col xs={12} md={4} style={{ textAlign: "left" }}></Col>
        </Row>
      </div>
    </>
  ) : (
    <>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {props.theme == "white-content" ? (
            <h1 style={{ fontWeight: "bold", color: "rgb(54,78,104)" }}>
              זמינות האמל"ח - {screendata.name}
            </h1>
          ) : (
            <h1 style={{ fontWeight: "bold", color: "hsla(0,0%,100%,.8)" }}>
              כשירות האמל"ח - {screendata.name}
            </h1>
          )}
        </div>
      </div>
      <button
        className="btn-new-blue"
        style={{ marginLeft: "5px" }}
        onClick={ToggleTable_mode}
      >
        תצוגת שעונים
      </button>

      <CarDataByUnitTypeAndUnitIdSortingTable charts={filteredcharts} />
    </>
  );
}

export default withRouter(ModularScreenPage);