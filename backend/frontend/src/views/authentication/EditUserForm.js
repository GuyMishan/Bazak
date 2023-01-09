import React, { useState, useEffect } from 'react';
import { withRouter, Redirect } from "react-router-dom";

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
  Col
} from "reactstrap";
import { produce } from 'immer'
import { generate } from 'shortid'
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";
import Select from 'components/general/Select/AnimatedSelect'

const EditUserForm = ({ match }) => {
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
    site_permission: '',
  });

  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);

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
    UpdateUser(event);
  };

  const UpdateUser = () => {
    var userid = match.params.userid;
    const user = {
      name: data.name,
      lastname: data.lastname,
      role: data.role,
      validated: data.validated,
      personalnumber: data.personalnumber,
      gdodid: data.gdodid,
      hativaid: data.hativaid,
      ogdaid: data.ogdaid,
      pikodid: data.pikodid,

      site_permission: data.site_permission,
    };

    axios.put(`http://localhost:8000/api/user/update/${userid}`, user)
      .then(response => {
        toast.success(`המשתמש עודכן בהצלחה`);
        history.push(`/manageusers`);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const init = () => {
    var userid = match.params.userid;
    axios.post("http://localhost:8000/api/getuserbyid", { userid })
      .then(response => {
        let tempuser = { ...response.data };
        setData(tempuser);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    init();
    loadGdods();
    loadHativas();
    loadOgdas();
    loadPikods();
  }, []);

  return (
    <div className="">
      <Container className="" dir='rtl'>
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>עריכת משתמש</small>
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
                      <option value="5">משתמש כלל צה"ל</option>
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

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מאושר/לא מאושר מערכת</div>
                  <FormGroup>
                    <Input type="select" name="validated" value={data.validated} onChange={handleChange}>
                      <option value={true}>מאושר</option>
                      <option value={false}>לא מאושר</option>
                    </Input>
                  </FormGroup>

                  <div className="text-center">
                    <button onClick={clickSubmit} className="btn-new-blue">
                      עדכן
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default withRouter(EditUserForm);;
