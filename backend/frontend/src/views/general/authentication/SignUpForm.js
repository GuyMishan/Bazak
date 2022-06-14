import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Container,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import ToggleButton from "react-toggle-button";
import history from 'history.js'
import { toast } from "react-toastify";

export default function SignUpForm() {
  const [data, setData] = useState({
    name: "",
    lastname: "",
    personalnumber: "",
    password: "",
    role: "",
    unitid: "",
    migzar: "",
    gender: "",
    cellphone: "",
    rank: "",
    error: false,
    successmsg: false,
    loading: false,
    redirectToReferrer: false,
  });

  const [units, setUnits] = useState([]);

  const loadUnits = () => {
    axios
      .get("http://localhost:8000/api/unit")
      .then((response) => {
        setUnits(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChange(evt) {
    const value = evt.target.value;
    setData({ ...data, [evt.target.name]: value });
  }

  const clickSubmit = (event) => {
    CheckSignUpForm(event);
  };

  const CheckSignUpForm = (event) => {
    event.preventDefault();
    var flag = true;
    var ErrorReason = "";
    if (data.name == "") {
      flag = false;
      ErrorReason += "שם ריק \n";
    }
    if (data.lastname == "") {
      flag = false;
      ErrorReason += "שם משפחה ריק \n";
    }
    if (data.personalnumber == "") {
      flag = false;
      ErrorReason += "מס אישי ריק \n";
    }
    if (data.password == "") {
      flag = false;
      ErrorReason += "סיסמא ריקה \n";
    }
    if (data.role == "") {
      flag = false;
      ErrorReason += "הרשאה ריקה \n";
    } else {
      if (data.role === "0") {

      }
      if (data.role === "1") {
        if (data.unitid === "") {
          flag = false;
          ErrorReason += "יחידה ריקה \n";
        }
      }
    }

    if (flag == true) {
      FixUser(event);
    } else {
      toast.error(ErrorReason);
    }
  };

  const FixUser = (event) => {
    event.preventDefault();
    if (data.role === "0") {
      delete data.unitid;
    }
    if (data.role === "1") {

    }
    if (data.role === "2") {
      delete data.unitid;
    }
    SignUp(event);
  };

  const SignUp = (event) => {
    event.preventDefault();
    setData({ ...data, loading: true, successmsg: false, error: false });
    const user = {
      name: data.name,
      lastname: data.lastname,
      password: data.password,
      personalnumber: data.personalnumber,
      unitid: data.unitid,
      role: data.role,
      migzar: data.migzar,
      gender: data.gender,
      cellphone: data.cellphone,
      rank: data.rank,
    };
    axios
      .post(`http://localhost:8000/api/signup`, user)
      .then((res) => {
        setData({ ...data, loading: false, error: false, successmsg: true });
        toast.success(`משתמש נרשם בהצלחה - אנא המתן לאישור מנהל מערכת`);
        history.push(`/signin`);
        console.log(res.data);
      })
      .catch((error) => {
        setData({
          ...data,
          errortype: error.response.data.error,
          loading: false,
          error: true,
        });
      });
  };

  const redirectUser = () => {
    if (data.redirectToReferrer) {
      return <Redirect to="/signin" />;
    }
  };

  const showSuccess = () => (
    <div
      className="alert alert-info "
      style={{ textAlign: "right", display: data.successmsg ? "" : "none" }}
    >
      <h2>הבקשה נשלחה למנהל המערכת</h2>
      <Link to="/signin">להתחברות</Link>
    </div>
  );
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ textAlign: "right", display: data.error ? "" : "none" }}
    >
      <h2>שגיאה בשליחת הטופס</h2>
    </div>
  );
  const showLoading = () => (
    <div
      className="alert alert-success"
      style={{ textAlign: "right", display: data.loading ? "" : "none" }}
    >
      <h2>{"בטעינה"}</h2>
    </div>
  );

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    setData({ ...data, password: data.personalnumber });
  }, [data.personalnumber]);

  const signUpForm = () => (
    <>
      <Container className="">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>הרשמה</small>
                </div>
                <Form role="form">
                  <FormGroup dir="rtl">
                    <Input
                      placeholder="שם פרטי"
                      name="name"
                      type="string"
                      value={data.name}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup dir="rtl">
                    <Input
                      placeholder="שם משפחה"
                      name="lastname"
                      type="string"
                      value={data.lastname}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup className="mb-3" dir="rtl">
                    <Input
                      placeholder="מספר אישי"
                      name="personalnumber"
                      type="string"
                      value={data.personalnumber}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מגזר</div>
                    <FormGroup >
                      <Input placeholder="מגזר" type="select" name="migzar" value={data.migzar} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={"מכונות"}>מכונות</option>
                        <option value={'תו"ן'}>תו"ן</option>
                        <option value={"חשמל"}>חשמל</option>
                        <option value={'ורסטילי'}>ורסטילי</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מין</div>
                    <FormGroup >
                      <Input placeholder='מין' type="select" name="gender" value={data.gender} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'זכר'}>זכר</option>
                        <option value={'נקבה'}>נקבה</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>פלאפון</div>
                    <FormGroup >
                      <Input placeholder="פלאפון" type="string" name="cellphone" value={data.cellphone} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>דרגה</div>
                    <FormGroup >
                      <Input placeholder='דרגה' type="select" name="rank" value={data.rank} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'סג"ם'}>סג"ם</option>
                        <option value={'סג"ן'}>סג"ן</option>
                        <option value={'סר"ן'}>סר"ן</option>
                        <option value={'רס"ן'}>רס"ן</option>
                        <option value={'סא"ל'}>סא"ל</option>
                        <option value={'נגדים'}>נגדים</option>
                      </Input>
                    </FormGroup>

                  <FormGroup dir="rtl">
                    <Input
                      type="select"
                      name="role"
                      value={data.role}
                      onChange={handleChange}
                    >
                      <option value="">הרשאה</option>
                      <option value="0">מנהל מערכת</option>
                      <option value="1">הרשאת יחידה</option>
                      <option value="2">הרשאת מתמודד</option>
                    </Input>
                  </FormGroup>

                  {data.role === "0" ? (
                    <div>מנהל מערכת</div>
                  ) : data.role === "1" ? (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        יחידה
                      </div>
                      <FormGroup dir="rtl">
                        <Input
                          type="select"
                          name="unitid"
                          value={data.unitid}
                          onChange={handleChange}
                        >
                          <option value={""}>יחידה</option>
                          {units.map((unit, index) => (
                            <option value={unit._id}>{unit.name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </>
                  ) : null}
                  <div className="text-center">
                    <button onClick={clickSubmit} className="btn">
                      הרשם
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );

  return (
    <>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col>
            {showLoading()}
            {showSuccess()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
          </Col>
        </Row>
      </Container>
    </>
  );
}
