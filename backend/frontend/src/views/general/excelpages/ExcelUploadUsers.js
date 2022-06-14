import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';
import axios from 'axios';

function ExcelUploadUsers() {
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

  async function SubmitUsers() {
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

      // console.log("headers:")
      // console.log(tableheaders)
      // console.log("body:")
      // console.log(tablebody)

      //end of data

      //get all users
      let response = await axios.get(`http://localhost:8000/api/users`)
      let tempusers = response.data;

      //get all jobs
      let response2 = await axios.get(`http://localhost:8000/api/job`)
      let tempjobs = response2.data;

      //get all populations
      let response3 = await axios.get(`http://localhost:8000/api/population`)
      let temppopulations = response3.data;

      //run over tabledata-> if personal number doesnt exists=> add him + search for his job by jobcode / else => present an error with the name of person
      for (let i = 0; i < tablebody.length; i++) {
        let isuseralreadyexists = false;
        for (let j = 0; j < tempusers.length; j++) {
          if (tablebody[i].personalnumber == tempusers[j].personalnumber) {
            tablebody[i].tempid=tempusers[j]._id;
            isuseralreadyexists = true;
          }
        }
        if (isuseralreadyexists == false)//modify the user + post to DB
        {
          tablebody[i].validated = true;
          tablebody[i].role = '2';
          tablebody[i].password = tablebody[i].personalnumber;

          //to find job of user
          for (let k = 0; k < tempjobs.length; k++) {
            if (tablebody[i].jobcode == tempjobs[k].jobcode) {
              tablebody[i].job = tempjobs[k]._id;
            }
          }
          delete tablebody[i].jobcode;

          //to find population of user
          for (let l = 0; l < temppopulations.length; l++) {
            if (tablebody[i].population == temppopulations[l].name) {
              tablebody[i].population = temppopulations[l]._id;
            }
          }

          let dateParts =  tablebody[i].birthdate.split("/");
          tablebody[i].birthdate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]+1);
          let dateParts1 =  tablebody[i].curr_tatash.split("/");
          tablebody[i].curr_tatash = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]+1);
          let dateParts2 =  tablebody[i].promotion_date.split("/");
          tablebody[i].promotion_date = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0]+1);
          let dateParts3 =  tablebody[i].keva_entry.split("/");
          tablebody[i].keva_entry = new Date(+dateParts3[2], dateParts3[1] - 1, +dateParts3[0]+1);

          let temp_sigli_data = [];

          let temp_sigli_data_1 = {};
          temp_sigli_data_1.year='2019'
          temp_sigli_data_1.socio=tablebody[i].socio_1
          temp_sigli_data_1.hili_ranking=tablebody[i].hili_ranking_1
          temp_sigli_data_1.promo_ready=tablebody[i].promo_ready_1
          temp_sigli_data_1.long_term=tablebody[i].long_term_1
          temp_sigli_data_1.job_success=tablebody[i].job_success_1
          temp_sigli_data_1.outstanding=tablebody[i].outstanding_1

          let temp_sigli_data_2 = {};
          temp_sigli_data_2.year='2020'
          temp_sigli_data_2.socio=tablebody[i].socio_2
          temp_sigli_data_2.hili_ranking=tablebody[i].hili_ranking_2
          temp_sigli_data_2.promo_ready=tablebody[i].promo_ready_2
          temp_sigli_data_2.long_term=tablebody[i].long_term_2
          temp_sigli_data_2.job_success=tablebody[i].job_success_2
          temp_sigli_data_2.outstanding=tablebody[i].outstanding_2

          let temp_sigli_data_3 = {};
          temp_sigli_data_3.year='2021'
          temp_sigli_data_3.socio=tablebody[i].socio_3
          temp_sigli_data_3.hili_ranking=tablebody[i].hili_ranking_3
          temp_sigli_data_3.promo_ready=tablebody[i].promo_ready_3
          temp_sigli_data_3.long_term=tablebody[i].long_term_3
          temp_sigli_data_3.job_success=tablebody[i].job_success_3
          temp_sigli_data_3.outstanding=tablebody[i].outstanding_3

          temp_sigli_data.push(temp_sigli_data_1)
          temp_sigli_data.push(temp_sigli_data_2)
          temp_sigli_data.push(temp_sigli_data_3)

          tablebody[i].sigli_data = temp_sigli_data;

          //may have a problem if job isnt found->user inserted with no job.. / population
          let response1 = await axios.post(`http://localhost:8000/api/signup`, tablebody[i])
        }
        else{ //modify the user + update user in DB
          //יש בעיה עם עדכון יוזרים
          //עם עדכון תפקיד של יוזר- אם התפקיד השתנה צריך לעדכן את התפקיד עצמו גם (מסובך)
          tablebody[i].validated = true;
          tablebody[i].role = '2';
          tablebody[i].password = tablebody[i].personalnumber;

          //to find job of user
          for (let k = 0; k < tempjobs.length; k++) {
            if (tablebody[i].jobcode == tempjobs[k].jobcode) {
              tablebody[i].job = tempjobs[k]._id;
            }
          }
          delete tablebody[i].jobcode;

          //to find population of user
          for (let l = 0; l < temppopulations.length; l++) {
            if (tablebody[i].population == temppopulations[l].name) {
              tablebody[i].population = temppopulations[l]._id;
            }
          }

          let dateParts =  tablebody[i].birthdate.split("/");
          tablebody[i].birthdate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]+1);
          let dateParts1 =  tablebody[i].curr_tatash.split("/");
          tablebody[i].curr_tatash = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]+1);
          let dateParts2 =  tablebody[i].promotion_date.split("/");
          tablebody[i].promotion_date = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0]+1);
          let dateParts3 =  tablebody[i].keva_entry.split("/");
          tablebody[i].keva_entry = new Date(+dateParts3[2], dateParts3[1] - 1, +dateParts3[0]+1);

          let temp_sigli_data = [];

          let temp_sigli_data_1 = {};
          temp_sigli_data_1.id='1'
          temp_sigli_data_1.year='2019'
          temp_sigli_data_1.socio=tablebody[i].socio_1
          temp_sigli_data_1.hili_ranking=tablebody[i].hili_ranking_1
          temp_sigli_data_1.promo_ready=tablebody[i].promo_ready_1
          temp_sigli_data_1.long_term=tablebody[i].long_term_1
          temp_sigli_data_1.job_success=tablebody[i].job_success_1
          temp_sigli_data_1.outstanding=tablebody[i].outstanding_1

          let temp_sigli_data_2 = {};
          temp_sigli_data_2.year='2020'
          temp_sigli_data_2.id='2'
          temp_sigli_data_2.socio=tablebody[i].socio_2
          temp_sigli_data_2.hili_ranking=tablebody[i].hili_ranking_2
          temp_sigli_data_2.promo_ready=tablebody[i].promo_ready_2
          temp_sigli_data_2.long_term=tablebody[i].long_term_2
          temp_sigli_data_2.job_success=tablebody[i].job_success_2
          temp_sigli_data_2.outstanding=tablebody[i].outstanding_2

          let temp_sigli_data_3 = {};
          temp_sigli_data_3.year='2021'
          temp_sigli_data_3.id='3'
          temp_sigli_data_3.socio=tablebody[i].socio_3
          temp_sigli_data_3.hili_ranking=tablebody[i].hili_ranking_3
          temp_sigli_data_3.promo_ready=tablebody[i].promo_ready_3
          temp_sigli_data_3.long_term=tablebody[i].long_term_3
          temp_sigli_data_3.job_success=tablebody[i].job_success_3
          temp_sigli_data_3.outstanding=tablebody[i].outstanding_3

          temp_sigli_data.push(temp_sigli_data_1)
          temp_sigli_data.push(temp_sigli_data_2)
          temp_sigli_data.push(temp_sigli_data_3)

          tablebody[i].sigli_data = temp_sigli_data;

          //may have a problem if job isnt found->user inserted with no job.. / population
          let response1 = await axios.put(`http://localhost:8000/api/user/update/${tablebody[i].tempid}`, tablebody[i])
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

      <Button onClick={() => SubmitUsers()}>הכנס משתמשים למסד הנתונים</Button>
    </div>
  );
}

export default withRouter(ExcelUploadUsers);