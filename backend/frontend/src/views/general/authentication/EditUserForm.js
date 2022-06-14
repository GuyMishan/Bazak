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
import JobAnimatedMultiSelect from 'components/tafkidipedia/Select/JobAnimatedMultiSelect';

const EditUserForm = ({ match }) => {
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
  });

  const [finalspecialkeytwo, setFinalSpecialKeytwo] = useState([])

  const [units, setUnits] = useState([]);

  const [populations, setPopulations] = useState([]);

  const [jobs, setJobs] = useState([]);

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

  const loadPopulations = () => {
    axios
      .get("http://localhost:8000/api/population")
      .then((response) => {
        setPopulations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadJobs = () => {
    axios
      .get("http://localhost:8000/api/smartjobs")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר")
      setData({ ...data, [evt.target.name]: value });
  }

  const handle_change_user_job = event => {
    if (event.value != "בחר תפקיד") {
      setData({ ...data, job: event.value });
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
      delete data.job;
    }
    if (data.role === "1") {
      delete data.job;
    }
    if (data.role === "2") {
      delete data.unitid;
    }
    UpdateUser(event);
  };

  const UpdateUser = () => {
    var userid = match.params.userid;
    const user = {
      name: data.name,
      lastname: data.lastname,
      password: data.password,
      personalnumber: data.personalnumber,
      unitid: data.unitid,
      job: data.job,
      role: data.role,
      validated: data.validated,
      migzar: data.migzar,
      gender: data.gender,
      cellphone: data.cellphone,
      rank: data.rank,
      // new
      birthdate: data.birthdate,
      residence: data.residence,
      marital_status: data.marital_status,
      education: data.education,
      curr_tatash: data.curr_tatash,
      promotion_date: data.promotion_date,
      keva_entry: data.keva_entry,
      service_model: data.service_model,
      jobs_in_rank: data.jobs_in_rank,
      sigli_data: finalspecialkeytwo, //ARRAY!
      taal_excellence: data.taal_excellence,
      ayen_tik: data.ayen_tik,
      mezah: data.mezah,
      tlunot: data.tlunot,
      tamriz: data.tamriz,
      tziun_mh: data.tziun_mh,
      sivug: data.sivug,
      comment: data.comment,
    };

    axios.put(`http://localhost:8000/api/user/update/${userid}`, user)
      .then(response => {
        let jobid = user.job;
        if (jobid) {
          axios.get(`http://localhost:8000/api/job/${jobid}`)
            .then(response => {
              let jobtoupdate = response.data;
              jobtoupdate.meaish = userid;
              axios.put(`http://localhost:8000/api/job/update/${jobid}`, jobtoupdate)
                .then(response => {
                  // console.log(response);
                  toast.success(`המשתמש עודכן בהצלחה`);
                  history.push(`/manageusers`);
                })
                .catch((error) => {
                  console.log(error);
                  toast.success(`המשתמש עודכן בהצלחה-תפקיד לא שונה`);
                  history.push(`/manageusers`);
                })
            })
            .catch((error) => {
              console.log(error);
            })
        }
        else {
          toast.success(`המשתמש עודכן בהצלחה`);
          history.push(`/manageusers`);
        }
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
        if(tempuser.birthdate)
        tempuser.birthdate = tempuser.birthdate.slice(0, 10);
        if(tempuser.curr_tatash)
        tempuser.curr_tatash = tempuser.curr_tatash.slice(0, 10);
        if(tempuser.promotion_date)
        tempuser.promotion_date = tempuser.promotion_date.slice(0, 10);
        if(tempuser.keva_entry)
        tempuser.keva_entry = tempuser.keva_entry.slice(0, 10);
        
        setData(tempuser);
        setFinalSpecialKeytwo(tempuser.sigli_data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    init();
    loadUnits();
    loadPopulations();
    loadJobs();
  }, [])

  useEffect(() => {
    setData({ ...data, password: data.personalnumber });
  }, [data.personalnumber])

  return (
    <div className="">
      <Container>
        <Row>
          <Col>
            <Card>
              <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'right' }}>ערוך משתמש: {data.name} {data.lastname}</CardTitle>{/*headline*/}
              </CardHeader>

              <CardBody >
                <Container>
                  <Form role="form" style={{ direction: 'rtl' }}>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם פרטי</div>
                    <FormGroup>
                      <Input placeholder="שם פרטי" type="string" name="name" value={data.name} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם משפחה</div>
                    <FormGroup>
                      <Input placeholder="שם משפחה" type="string" name="lastname" value={data.lastname} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מספר אישי (כולל - s)</div>
                    <FormGroup >
                      <Input placeholder="מספר אישי" type="string" name="personalnumber" value={data.personalnumber} onChange={handleChange} />
                    </FormGroup>

                    {/*<div style={{ textAlign: 'right', paddingTop: '10px' }}>סיסמא</div>
                                        <FormGroup>
                                            <Input placeholder="סיסמא (אופציונלי)" type="password" name="password" value={data.password} onChange={handleChange} />
                                        </FormGroup>*/}

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

                    {/* new */}

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תאריך לידה</div>
                    <FormGroup>
                      <Input type="date" name="birthdate" value={data.birthdate} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>כתובת מגורים</div>
                    <FormGroup>
                      <Input placeholder="כתובת מגורים" type="string" name="residence" value={data.residence} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מצב משפחתי</div>
                    <FormGroup >
                      <Input placeholder='מצב משפחתי' type="select" name="marital_status" value={data.marital_status} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'רווק'}>רווק</option>
                        <option value={'נשוי'}>נשוי</option>
                        <option value={'גרוש'}>גרוש</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>השכלה</div>
                    <FormGroup >
                      <Input placeholder='השכלה' type="select" name="education" value={data.education} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'יסודית'}>יסודית</option>
                        <option value={'תיכונית'}>תיכונית</option>
                        <option value={'על-תיכונית'}>על-תיכונית</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תת"ש נוכחי</div>
                    <FormGroup>
                      <Input type="date" name="curr_tatash" value={data.curr_tatash} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תאריך קידום</div>
                    <FormGroup>
                      <Input type="date" name="promotion_date" value={data.promotion_date} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תאריך כניסה לקבע</div>
                    <FormGroup>
                      <Input type="date" name="keva_entry" value={data.keva_entry} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מודל שירות</div>
                    <FormGroup >
                      <Input placeholder='השכלה' type="select" name="service_model" value={data.service_model} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'2016'}>2016</option>
                        <option value={'2016 תקציבית'}>2016 תקציבית</option>
                        <option value={'2010'}>2010</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תפקידים בדרגה</div>
                    <FormGroup>
                      <Input type="string" name="jobs_in_rank" value={data.jobs_in_rank} onChange={handleChange} disabled />
                    </FormGroup>

                    {/* sigli_data???? */}
                    <div style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>נתונים סגליים</div>

                    <div>
                      {finalspecialkeytwo.length == 0 ?
                        <Row>
                          <Button style={{ float: "right" }} type="button" onClick={() => {
                            setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate() }])
                          }}>
                            הוסף נתונים
                          </Button>
                        </Row>
                        : finalspecialkeytwo.map((p, index) => {
                          return (
                            <div>
                              {index == 0 ?
                                <Row>
                                  <Button style={{ float: "right" }} type="button" onClick={() => { 
                                    if(finalspecialkeytwo.length<3)
                                    setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate() }]) 
                                    }}>
                                    הוסף נתונים
                                  </Button>
                                </Row>
                                : null}

                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>שנה</p>
                                    <Input onChange={(e) => {
                                      const year = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].year = year }))
                                    }}
                                      value={p.year} type="select" placeholder="שנה">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"2018"}>{"2018"}</option>
                                      <option value={"2019"}>{"2019"}</option>
                                      <option value={"2020"}>{"2020"}</option>
                                      <option value={"2021"}>{"2021"}</option>
                                      <option value={"2022"}>{"2022"}</option>
                                      <option value={"2023"}>{"2023"}</option>
                                      <option value={"2024"}>{"2024"}</option>
                                      <option value={"2025"}>{"2025"}</option>
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>סוצימטרי</p>
                                    <Input onChange={(e) => {
                                      const socio = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].socio = socio }))
                                    }}
                                      value={p.socio} type="number" placeholder="סוצימטרי" />
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>דירוג חילי</p>
                                    <Input onChange={(e) => {
                                      const hili_ranking = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].hili_ranking = hili_ranking }))
                                    }}
                                      value={p.hili_ranking} type="select" placeholder="דירוג חילי">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"א"}>{"א"}</option>
                                      <option value={"ב"}>{"ב"}</option>
                                    </Input>
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>בשל לקידום</p>
                                    <Input onChange={(e) => {
                                      const promo_ready = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].promo_ready = promo_ready }))
                                    }}
                                      value={p.promo_ready} type="select" placeholder="בשל לקידום">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"כן"}>{"כן"}</option>
                                      <option value={"לא"}>{"לא"}</option>
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>פוטנציאל קבע ארוך</p>
                                    <Input onChange={(e) => {
                                      const long_term = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].long_term = long_term }))
                                    }}
                                      value={p.long_term} type="select" placeholder="פוטנציאל קבע ארוך">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"1"}>{"1"}</option>
                                      <option value={"2"}>{"2"}</option>
                                      <option value={"3"}>{"3"}</option>
                                      <option value={"4"}>{"4"}</option>
                                      <option value={"5"}>{"5"}</option>
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>מידת הצלחה בתפקיד</p>
                                    <Input onChange={(e) => {
                                      const job_success = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].job_success = job_success }))
                                    }}
                                      value={p.job_success} type="select" placeholder="מידת הצלחה בתפקיד">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"1"}>{"1"}</option>
                                      <option value={"2"}>{"2"}</option>
                                      <option value={"3"}>{"3"}</option>
                                      <option value={"4"}>{"4"}</option>
                                      <option value={"5"}>{"5"}</option>
                                    </Input>
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>בולט לחיוב</p>
                                    <Input onChange={(e) => {
                                      const outstanding = e.target.value;
                                      if(e.target.value!="בחר")
                                      setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].outstanding = outstanding }))
                                    }}
                                      value={p.outstanding} type="select" placeholder="בולט לחיוב">
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"כן"}>{"כן"}</option>
                                      <option value={"לא"}>{"לא"}</option>
                                    </Input>
                                  </div>
                                </Col>
                              </Row>

                              <Button type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => currentSpec.filter(x => x.id !== p.id)) }}>
                                x
                              </Button>
                            </div>
                          )
                        })
                      }
                    </div>
                    {/* sigli_data???? */}

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>הצטיינות תא"ל</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="taal_excellence" value={data.taal_excellence} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="לא">לא</option>
                        <option value="כן">כן</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>עיין תיק</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="ayen_tik" value={data.ayen_tik} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="לא">לא</option>
                        <option value="כן">כן</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מצ"ח</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="mezah" value={data.mezah} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="לא">לא</option>
                        <option value="כן">כן</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תלונות</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="tlunot" value={data.tlunot} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="לא">לא</option>
                        <option value="כן">כן</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>תמריץ</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="tamriz" value={data.tamriz} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="לא">לא</option>
                        <option value="כן">כן</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>ציון מ"ה</div>
                    <FormGroup >
                      <Input placeholder='ציון מ"ה' type="number" name="tziun_mh" value={data.tziun_mh} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>סיווג</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="sivug" value={data.sivug} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="שמור">שמור</option>
                        <option value="סודי">סודי</option>
                        <option value="סודי ביותר">סודי ביותר</option>
                        <option value='שו"ס'>שו"ס</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>הערות</div>
                    <FormGroup >
                      <Input placeholder='הערות' type="string" name="comment" value={data.comment} onChange={handleChange} />
                    </FormGroup>

                    {/* new */}

                    <div style={{ textAlign: "right", paddingTop: "10px" }}>אוכלוסיה</div>
                    <FormGroup dir="rtl">
                      <Input
                        type="select"
                        name="population"
                        value={data.population}
                        onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        {populations ? populations.map((population, index) => (
                          <option value={population._id}>{population.name}</option>
                        )) : null}
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>הרשאה</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="role" value={data.role} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="0">מנהל מערכת</option>
                        <option value="1">הרשאת יחידה</option>
                        <option value="2">הרשאת מתמודד</option>
                      </Input>
                    </FormGroup>

                    {data.role === "0" ? (
                      <div>מנהל מערכת</div>
                    ) : data.role === "1" ? (
                      <>
                        <div style={{ textAlign: "right", paddingTop: "10px" }}>יחידה</div>
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
                    ) : data.role === "2" ? (
                      <>
                        <div style={{ textAlign: "right", paddingTop: "10px" }}>תפקיד</div>
                        {/* <FormGroup dir="rtl">
                          <Input
                            type="select"
                            name="job"
                            value={data.job}
                            onChange={handleChange}>
                            <option value={"בחר"}>בחר</option>
                            {jobs ? jobs.map((job, index) => (
                              <option value={job._id}>{job.jobname} / {job.unit.name} / {job.jobcode}</option>
                            )) : null}
                          </Input>
                        </FormGroup> */}
                    {jobs ?
                    <div style={{ textAlign: 'right' }}>
                      <JobAnimatedMultiSelect data={jobs} handle_change={handle_change_user_job} placeholder={"בחר תפקיד"} val={data.job ? data.job : undefined} />
                    </div>
                    : null}
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
                      <button onClick={clickSubmit} className="btn">עדכן</button>
                    </div>
                  </Form>
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default withRouter(EditUserForm);;
