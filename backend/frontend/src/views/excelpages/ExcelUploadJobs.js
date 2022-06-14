import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';
import axios from 'axios';

function ExcelUploadJobs() {
  var fileInput = React.createRef();

  const [state, setState] = useState({
    isOpen: false,
    dataLoaded: false,
    isFormInvalid: false,
    rows: null,
    cols: null
  })

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        setState({
          dataLoaded: true,
          cols: resp.cols,
          rows: resp.rows
        });
      }
    });
  }

  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
        setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        renderFile(fileObj)
      }
      else {
        setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }
  }

  const openFileBrowser = () => {
    fileInput.current.click();
  }

  async function SubmitJobs() {
    //if table isnt empty..
    if (state.rows != null) {
      let tableheaders = state.rows[0];

      let tablebody = [];
      let temptablebody = state.rows;
      temptablebody.splice(0, 1)//deletes headers

      for (let k = 0; k < temptablebody.length; k++) {
        tablebody[k] = {};
        for (let l = 0; l < tableheaders.length; l++) {
          let a = tableheaders[l];
          tablebody[k][a] = temptablebody[k][l];
        }
      }

      console.log("headers:")
      console.log(tableheaders)
      console.log("body:")
      console.log(tablebody)

      //end of data

      //get all jobs
      let response = await axios.get(`http://localhost:8000/api/job`)
      let tempjobs = response.data;

      //get all users
      let response2 = await axios.get(`http://localhost:8000/api/unit`)
      let tempunits = response2.data;

      //get all populations
      let response3 = await axios.get(`http://localhost:8000/api/population`)
      let temppopulations = response3.data;

      //run over tabledata-> if personal number doesnt exists=> add him / else => present an error with the name of person
      for (let i = 0; i < tablebody.length; i++) {
        let isjobalreadyexists = false;
        for (let j = 0; j < tempjobs.length; j++) {
          if (tablebody[i].jobcode == tempjobs[j].jobcode) {
            isjobalreadyexists = true;
          }
        }
        if (isjobalreadyexists == false)//modify the user to enter DB
        {
          for (let k = 0; k < tempunits.length; k++) {
            if (tablebody[i].unit == tempunits[k].name) {
              tablebody[i].unit = tempunits[k]._id;
            }
          }
          //to find population of user
          for (let l = 0; l < temppopulations.length; l++) {
            if (tablebody[i].population == temppopulations[l].name) {
              tablebody[i].population = temppopulations[l]._id;
            }
          }
          let response1 = await axios.post(`http://localhost:8000/api/job`, tablebody[i])
        }
      }
    }
  }

  return (
    <div style={{ width: '95%', marginRight: 'auto', marginLeft: 'auto' }}>
      <form>
        <FormGroup row>
          <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>
          <Col xs={4} sm={8} lg={10}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button color="info" style={{ color: "white", zIndex: 0 }} onClick={openFileBrowser}><i className="cui-file"></i> Browse&hellip;</Button>
                <input type="file" hidden onChange={fileHandler} ref={fileInput} onClick={(event) => { event.target.value = null }} style={{ "padding": "10px" }} />
              </InputGroupAddon>
              <Input type="text" className="form-control" value={state.uploadedFileName} readOnly invalid={state.isFormInvalid} />
              <FormFeedback>
                <Fade in={state.isFormInvalid} tag="h6" style={{ fontStyle: "italic" }}>
                  Please select a .xlsx file only !
                </Fade>
              </FormFeedback>
            </InputGroup>
          </Col>
        </FormGroup>
      </form>

      {state.dataLoaded &&
        <div>
          <Card body outline color="secondary" className="restrict-card">
            <div className='table-responsive'>
              <OutTable data={state.rows} columns={state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
            </div>
          </Card>
        </div>}

      <Button onClick={() => SubmitJobs()}>הכנס תפקידים למסד הנתונים</Button>
    </div>
  );
}

export default withRouter(ExcelUploadJobs);