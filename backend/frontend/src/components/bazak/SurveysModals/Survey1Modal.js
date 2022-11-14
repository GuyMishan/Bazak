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
import history from 'history.js'
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import deletepic from "assets/img/delete.png";

const Survey1Modal = (props) => {
  const [user, setUser] = useState({})
  // const { user } = isAuthenticated()
  //modal
  const [isOpen, setisOpen] = useState(true)
  //survey1
  const [survey1, setSurvey1] = useState({})

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר") {
      setSurvey1({ ...survey1, [evt.target.name]: value });
    }
  }

  const clickSubmit = async event => {
    let tempsurvey1 = { ...survey1 }
    tempsurvey1.userid = user._id;
    console.log(tempsurvey1);

    let response = await axios.post(`http://localhost:8000/api/survey1`, tempsurvey1)
    toast.success(`שאלון נשמר בהצלחה`);
    setisOpen(false);
  }

  function Toggle(evt) {
    setisOpen(!isOpen);
  }

  async function CheckSurveyAvailability() {
    let response = await axios.get(`http://localhost:8000/api/survey1/survey1byuserid/${user._id}`)
    let tempsurveydata = response.data[0];
    if (tempsurveydata) {
      setisOpen(false);
    }
  }

  function init() {
    CheckSurveyAvailability()
  }

  useEffect(() => {
    if (user && user.validated == true) {
      if (isOpen == true) {
        init();
      }
      else {
        setSurvey1({})
      }
    }
  }, [isOpen, user])

  useEffect(() => {
    let tempuser = isAuthenticated();
    setUser(tempuser.user);
  }, [])

  return (
    <Modal
      style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
      isOpen={isOpen}
      centered
      fullscreen
      scrollable
      size=""
      toggle={Toggle}>
      <ModalBody>
        <Card>
          <CardHeader style={{ direction: 'rtl' }}>
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>הידעת?!</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <h4>מערכת הבז"כ מתממשקת online מרמת הגדוד עד רמת המטה הכללי.</h4>
                <h4>נשמח שתענה על שאלון קצר זה לטובת שיפור חווית השירות מהמערכת ולהפקת לקחים.</h4>
                <h4>שאלון זה הינו אנונימי ולצורכי למידה בלבד.</h4>

                <div style={{ textAlign: 'right', paddingTop: '20px' }}>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>דרג את חווית הממשק עם המערכת (5-גבוה ביותר 1-נמוך ביותר)</div>
                  <Input type="select" name="question1" value={survey1.question1} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'5'}>5</option>
                    <option value={'4'}>4</option>
                    <option value={'3'}>3</option>
                    <option value={'2'}>2</option>
                    <option value={'1'}>1</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>דרג את המענה של המערכת ברמתך ולרמת מפקדיך (5-גבוה ביותר 1-נמוך ביותר)</div>
                  <Input type="select" name="question2" value={survey1.question2} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'5'}>5</option>
                    <option value={'4'}>4</option>
                    <option value={'3'}>3</option>
                    <option value={'2'}>2</option>
                    <option value={'1'}>1</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>דרג את רמת השליטה שלך ביכולות המערכת (5-גבוה ביותר 1-נמוך ביותר)</div>
                  <Input type="select" name="question3" value={survey1.question3} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'5'}>5</option>
                    <option value={'4'}>4</option>
                    <option value={'3'}>3</option>
                    <option value={'2'}>2</option>
                    <option value={'1'}>1</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>האם אתה מנהל דוחות נוספים למערכת בגין מענה שלא מתקבל על ידה? פרט.</div>
                  <Input type="textarea" name="question4" value={survey1.question4} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מהם הדברים שהיית רוצה לשפר במערכת?</div>
                  <Input type="textarea" name="question5" value={survey1.question5} onChange={handleChange} />
                </div>

                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                  <button className="btn-new" onClick={clickSubmit}>שלח</button>
                </div>
              </div>
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(Survey1Modal);;