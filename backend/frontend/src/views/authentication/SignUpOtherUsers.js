import React, { useState, useEffect } from "react";

import { signin, authenticate, isAuthenticated } from 'auth/index';

import { Link, Redirect, useHistory } from "react-router-dom";
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
import history from 'history.js';
import { toast } from "react-toastify";
import Select from 'components/general/Select/AnimatedSelect'

export default function SignUpForm() {
  const [data, setData] = useState({
    name: "",
    lastname: "",
    personalnumber: "",
    role: "",
    gdodid: "",
    hativaid: "",
    ogdaid: "",
    pikodid: "",
    //
    errortype: "",
    error: false,
    successmsg: false,
    loading: false,
    redirectToReferrer: false,
    //
    site_permission:'צפייה ועריכה',
  });
  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);

  const { user } = isAuthenticated();

  const loadGdods = () => {
    axios
      .get("http://localhost:8000/api/gdod")
      .then((response) => {
        setGdods(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadHativas = () => {
    axios
      .get("http://localhost:8000/api/hativa")
      .then((response) => {
        setHativas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadOgdas = () => {
    axios
      .get("http://localhost:8000/api/ogda")
      .then((response) => {
        setOgdas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadPikods = () => {
    axios
      .get("http://localhost:8000/api/pikod")
      .then((response) => {
        setPikods(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChange(evt) {
    const value = evt.target.value;
    setData({ ...data, [evt.target.name]: value });
  }

  function handleChange2(selectedOption, name) {
    if (!(selectedOption.value == "בחר"))
      setData({ ...data, [name]: selectedOption.value });
    else {
      setData({ ...data, [name]: "" });
    }
  }
  
  const returnBack = () => {
      if (user && user.validated == true) {
        if (user.role === "0") {
          history.push(`/dashboard/admin/0/magadal/0/false`);
        }
        if (user.role === "1") {
          history.push(`/dashboard/gdod/${user.gdodid}/magadal/0/false`);
        }
        if (user.role === "2") {
          history.push(`/dashboard/hativa/${user.hativaid}/magadal/0/false`);
        }
        if (user.role === "3") {
          history.push(`/dashboard/ogda/${user.ogdaid}/magadal/0/false`);
        }
        if (user.role === "4") {
          history.push(`/dashboard/pikod/${user.pikodid}/magadal/0/false`);
        }
        if (user.role === "5") {
          history.push(`/dashboard/general/5/magadal/0/false`);
        }
      }
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
    if (data.role == "") {
      flag = false;
      ErrorReason += "הרשאה ריקה \n";
    } else {
      if (data.role === "0") {
      }
      if (data.role === "1") {
        if (data.gdodid === "") {
          flag = false;
          ErrorReason += "גדוד ריק \n";
        }
      }
      if (data.role === "2") {
        if (data.hativaid === "") {
          flag = false;
          ErrorReason += "חטיבה ריקה \n";
        }
      }
      if (data.role === "3") {
        if (data.ogdaid === "") {
          flag = false;
          ErrorReason += "אוגדה ריקה \n";
        }
      }
      if (data.role === "4") {
        if (data.pikodid === "") {
          flag = false;
          ErrorReason += "פיקוד ריק \n";
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
    //check and fix roles
    if (data.role === "0") {
      delete data.gdodid;
      delete data.hativaid;
      delete data.ogdaid;
      delete data.pikodid;
    } 
    if (data.role === "5") {
      data.site_permission = 'צפייה';
      delete data.gdodid;
      delete data.hativaid;
      delete data.ogdaid;
      delete data.pikodid;
    }
    if (data.role === "1") {
      delete data.hativaid;
      delete data.ogdaid;
      delete data.pikodid;
    }
    if (data.role === "2") {
      delete data.gdodid;
      delete data.ogdaid;
      delete data.pikodid;
    }
    if (data.role === "3") {
      delete data.gdodid;
      delete data.hativaid;
      delete data.pikodid;
    }
    if (data.role === "4") {
      delete data.gdodid;
      delete data.hativaid;
      delete data.ogdaid;
    }
    //check and fix personalnumber
    let c = data.personalnumber.charAt(0);
    if (c >= '0' && c <= '9') {
      // it is a number
      let temppersonalnumber = data.personalnumber;
      temppersonalnumber = 's' + temppersonalnumber;
      data.personalnumber = temppersonalnumber;
    } else {
      // it isn't
      if (c == c.toUpperCase()) {
        //UpperCase Letter -Make Lowercase
        let tempc=c.toLowerCase();
        let temppersonalnumber = data.personalnumber;
        temppersonalnumber = temppersonalnumber.substring(1);
        temppersonalnumber = tempc + temppersonalnumber;
        data.personalnumber = temppersonalnumber;
      }
      if (c == c.toLowerCase()) {
        //LowerCase Letter - All Good
      }
    }

    SignUp(event);
  };

  const SignUp = (event) => {
    event.preventDefault();
    setData({ ...data, loading: true, successmsg: false, error: false });
    const user = {
      name: data.name,
      lastname: data.lastname,
      role: data.role,
      personalnumber: data.personalnumber,
      gdodid: data.gdodid,
      hativaid: data.hativaid,
      ogdaid: data.ogdaid,
      pikodid: data.pikodid,

      site_permission: data.site_permission,
    };
    axios
      .post(`http://localhost:8000/api/signup`, user)
      .then((res) => {
        setData({ ...data, loading: false, error: false, successmsg: true });
        toast.success(`הרשמתך נקלטה בהצלחה, מתן ההרשאות יתבצע תוך עד 72 שעות`);
        history.goBack();
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
    loadGdods();
    loadHativas();
    loadOgdas();
    loadPikods();
  }, []);

  const signUpForm = () => (
    <>
      <Container className="" dir='rtl'>
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>הרשמה</small>
                </div>
                <Form role="form">
                  <FormGroup>
                    <Input
                      placeholder="שם פרטי"
                      name="name"
                      type="string"
                      value={data.name}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Input
                      placeholder="שם משפחה"
                      name="lastname"
                      type="string"
                      value={data.lastname}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Input
                      placeholder="מספר אישי"
                      name="personalnumber"
                      type="string"
                      value={data.personalnumber}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <div style={{ textAlign: "right", paddingTop: "10px" }}>
                    הרשאה
                  </div>
                  <FormGroup dir="rtl">
                    <Input
                      type="select"
                      name="role"
                      value={data.role}
                      onChange={handleChange}
                    >
                      <option value="">הרשאה</option>
                      <option value="0">מנהל מערכת</option>
                      {/* <option value="5">משתמש כלל צה"ל</option> */}
                      <option value="1">הרשאת גדוד</option>
                      <option value="2">הרשאת חטיבה</option>
                      <option value="3">הרשאת אוגדה</option>
                      <option value="4">הרשאת פיקוד</option>
                    </Input>
                  </FormGroup>

                  {data.role === "0" ? (
                    <div style={{textAlign:'right', paddingTop: "10px"}}>מנהל מערכת</div>
                  ) : data.role === "5" ? (
                    <div style={{textAlign:'right', paddingTop: "10px"}}>משתמש כלל צה"ל</div>
                  ) : data.role === "1" ? (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        גדוד
                      </div>
                      <FormGroup dir="rtl" style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <Select data={gdods} handleChange2={handleChange2} name={'gdodid'} val={data.gdodid ? data.gdodid : undefined} />
                      </FormGroup>
                    </>
                  ) : data.role === "2" ? (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        חטיבה
                      </div>
                      <FormGroup dir="rtl" style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <Select data={hativas} handleChange2={handleChange2} name={'hativaid'} val={data.hativaid ? data.hativaid : undefined} />
                      </FormGroup>
                    </>
                  ) : data.role === "3" ? (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        אוגדה
                      </div>
                      <FormGroup dir="rtl" style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <Select data={ogdas} handleChange2={handleChange2} name={'ogdaid'} val={data.ogdaid ? data.ogdaid : undefined} />
                      </FormGroup>
                    </>
                  ) : data.role === "4" ? (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        פיקוד
                      </div>
                      <FormGroup dir="rtl" style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <Select data={pikods} handleChange2={handleChange2} name={'pikodid'} val={data.pikodid ? data.pikodid : undefined} />
                      </FormGroup>
                    </>
                  ) : data.role === "" ? (
                    <div style={{textAlign:'right', paddingTop: "10px"}}>נא להכניס הרשאה</div>
                  ) : null}
                  
                  {data.role != "" && data.role != "0" && data.role != "5" ? (
                    <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>
                        הרשאת עריכה
                      </div>
                      <FormGroup dir="rtl">
                        <Input
                          type="select"
                          name="site_permission"
                          value={data.site_permission}
                          onChange={handleChange}
                        >
                          <option value={'צפייה ועריכה'}>צפייה ועריכה</option>
                          <option value={'צפייה'}>צפייה</option>
                        </Input>
                      </FormGroup>
                    </>
                  ) : null}

                  <div className="text-center">
                    <button style={{marginLeft:'30px'}} onClick={() => returnBack()} className="btn-new-blue">
                      חזור
                    </button>
                    <button onClick={clickSubmit} className="btn-new-blue">
                      רשום משתמש
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
          </Col>
        </Row>
      </Container>
    </>
  );
}