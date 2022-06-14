import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'

import { Card, CardHeader, CardBody, CardTitle, Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Row } from 'reactstrap';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import MigzarFilter from 'components/tafkidipedia/Filters/MigzarFilter';
import CertainFilter from 'components/tafkidipedia/Filters/CertainFilter';
import UnitFilter from 'components/tafkidipedia/Filters/UnitFilter';
import EditEshkolFormModal from "views/general/adminpages/editeshkol/EditEshkolFormModal";
import ProfilePageModal from 'views/general/generalpages/profilepage/ProfilePageModal';

import EshkolFilter from 'components/tafkidipedia/Filters/EshkolFilter';

const SortingTable = (props) => {
  const [data, setData] = useState([])
  const [originaldata, setOriginaldata] = useState([])
  const [candidatesinmahzor, setCandidatesinmahzor] = useState([])
  const [highestnumber, setHighestnumber] = useState(0)

  // const [migzarfilter, setMigzarfilter] = useState(undefined)
  // const [unitfilter, setUnitfilter] = useState(undefined)
  // const [certainfilter, setCertainfilter] = useState(undefined)
  const [eshkolfilter, setEshkolfilter] = useState({})

  //eshkol modal
  const [iseshkolformopen, setIseshkolformopen] = useState(false);
  const [eshkolidformodal, setEshkolidformodal] = useState(undefined);

  function Toggle(evt) {
    setEshkolidformodal(evt.currentTarget.value)
    setIseshkolformopen(!iseshkolformopen);
  }

  function ToggleForModal(evt) {
    setIseshkolformopen(!iseshkolformopen);
    updatechangedeshkol();
  }
  //eshkol modal

  //user modal
  const [isprofilepageopen, setIsprofilepageopen] = useState(false);
  const [useridformodal, setUseridformodal] = useState(undefined);

  async function ToggleUserModal(evt) {
    setUseridformodal(evt.currentTarget.value)
    setIsprofilepageopen(!isprofilepageopen);
  }
  //user modal

  async function updatechangedeshkol() {
    let response = await axios.get(`http://localhost:8000/api/finaleshkolbyid/${eshkolidformodal}`)
    let tempeshkol = response.data[0];
    let temhighestnumber = tempeshkol.candidatesineshkol.length;


    for (let j = 0; j < tempeshkol.candidatesineshkol.length; j++) {
      for (let k = 0; k < candidatesinmahzor.length; k++) {
        if (tempeshkol.candidatesineshkol[j].candidate == candidatesinmahzor[k]._id) {
          tempeshkol.candidatesineshkol[j].candidate = candidatesinmahzor[k];
        }
      }
    }

    if (tempeshkol.finalcandidate) {
      let result2 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${tempeshkol.finalcandidate}`);
      tempeshkol.finalcandidate = result2.data[0];
    }

    let tempdata = [...data];
    let temporiginaldata = [...originaldata];

    for (let i = 0; i < tempdata.length; i++) {
      if (eshkolidformodal == tempdata[i]._id) {
        tempdata[i] = { ...tempeshkol };
      }
    }

    for (let i = 0; i < temporiginaldata.length; i++) {
      if (eshkolidformodal == temporiginaldata[i]._id) {
        temporiginaldata[i] = { ...tempeshkol };
      }
    }

    setOriginaldata(temporiginaldata)
    setData(tempdata)

    if (temhighestnumber >= highestnumber) {
      setHighestnumber(temhighestnumber)
    }
  }

  function init() {
    getCandidatesinmahzor();
  }

  const getCandidatesinmahzor = async () => {
    let response = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${props.mahzorid}`)
    let tempcandidatesinmahzor = response.data;

    setCandidatesinmahzor(tempcandidatesinmahzor)
  }

  const getMahzorEshkol = async () => {
    let temhighestnumber = 0;
    let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${props.mahzorid}`)
    let tempeshkolbymahzorid = response.data;

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      if (tempeshkolbymahzorid[i].candidatesineshkol.length >= temhighestnumber) {
        temhighestnumber = tempeshkolbymahzorid[i].candidatesineshkol.length;
      }
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        for (let k = 0; k < candidatesinmahzor.length; k++) {
          if (tempeshkolbymahzorid[i].candidatesineshkol[j].candidate == candidatesinmahzor[k]._id) {
            tempeshkolbymahzorid[i].candidatesineshkol[j].candidate = candidatesinmahzor[k];
          }
        }
      }
      if (tempeshkolbymahzorid[i].finalcandidate) {
        for (let k = 0; k < candidatesinmahzor.length; k++) {
          if (tempeshkolbymahzorid[i].finalcandidate == candidatesinmahzor[k]._id) {
            tempeshkolbymahzorid[i].finalcandidate = candidatesinmahzor[k];
          }
        }
      }
    }

    setOriginaldata(tempeshkolbymahzorid)
    setData(tempeshkolbymahzorid)
    setHighestnumber(temhighestnumber)
  }

  // const FilterEshkols = async () => {
  //   let temhighestnumber = 0;
  //   let tempeshkolbymahzorid = [];
  //   let tempeshkolbymahzorid_beforefilters = originaldata;

  //   //to filter eshkols
  //   if (migzarfilter != undefined) {
  //     if (unitfilter != undefined) {
  //       if (certainfilter != undefined) {
  //         tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
  //           return el.jobinmahzor.job.migzar == migzarfilter &&
  //             el.jobinmahzor.certain == certainfilter &&
  //             el.jobinmahzor.job.unit.name == unitfilter;
  //         });
  //       }
  //       else {
  //         tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
  //           return el.jobinmahzor.job.migzar == migzarfilter &&
  //             el.jobinmahzor.job.unit.name == unitfilter;
  //         });
  //       }
  //     }
  //     else {
  //       tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
  //         return el.jobinmahzor.job.migzar == migzarfilter
  //       });
  //     }
  //   }
  //   else {
  //     tempeshkolbymahzorid = originaldata
  //   }

  //   for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
  //     if (tempeshkolbymahzorid[i].candidatesineshkol.length >= temhighestnumber) {
  //       temhighestnumber = tempeshkolbymahzorid[i].candidatesineshkol.length;
  //     }
  //   }

  //   setData(tempeshkolbymahzorid)
  //   setHighestnumber(temhighestnumber)
  // }

  const setfilter = (evt) => {
    if (evt.currentTarget.name == 'certain') {
      if (eshkolfilter.certainfilter) {
        let tempcertainfilter = [...eshkolfilter.certainfilter]
        const index = tempcertainfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempcertainfilter.splice(index, 1);
        }
        else {
          tempcertainfilter.push(evt.currentTarget.value)
        }
        setEshkolfilter({ ...eshkolfilter, certainfilter: tempcertainfilter })
      }
      else {
        setEshkolfilter({ ...eshkolfilter, certainfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'unit') {
      if (eshkolfilter.unitfilter) {
        let tempunitfilter = [...eshkolfilter.unitfilter]
        const index = tempunitfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempunitfilter.splice(index, 1);
        }
        else {
          tempunitfilter.push(evt.currentTarget.value)
        }
        setEshkolfilter({ ...eshkolfilter, unitfilter: tempunitfilter })
      }
      else {
        setEshkolfilter({ ...eshkolfilter, unitfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'migzar') {
      if (eshkolfilter.migzarfilter) {
        let tempmigzarfilter = [...eshkolfilter.migzarfilter]
        const index = tempmigzarfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempmigzarfilter.splice(index, 1);
        }
        else {
          tempmigzarfilter.push(evt.currentTarget.value)
        }
        setEshkolfilter({ ...eshkolfilter, migzarfilter: tempmigzarfilter })
      }
      else {
        setEshkolfilter({ ...eshkolfilter, migzarfilter: [evt.currentTarget.value] })
      }
    }
  }

  const applyfiltersontodata = () => {
    let temhighestnumber = 0;
    let tempdatabeforefilter = originaldata;

    let myArrayUnitFiltered = [];
    if (eshkolfilter.unitfilter && eshkolfilter.unitfilter.length > 0) {
      myArrayUnitFiltered = tempdatabeforefilter.filter((el) => {
        return eshkolfilter.unitfilter.some((f) => {
          return f === el.jobinmahzor.job.unit._id;
        });
      });
    }
    else {
      myArrayUnitFiltered = originaldata;
    }

    let myArrayUnitAndMovementFiltered = [];
    if (eshkolfilter.certainfilter && eshkolfilter.certainfilter.length > 0) {
      myArrayUnitAndMovementFiltered = myArrayUnitFiltered.filter((el) => {
        return eshkolfilter.certainfilter.some((f) => {
          return f === el.jobinmahzor.certain;
        });
      });
    }
    else {
      myArrayUnitAndMovementFiltered = myArrayUnitFiltered;
    }

    let myArrayUnitAndMovementAndMigzarFiltered = [];
    if (eshkolfilter.migzarfilter && eshkolfilter.migzarfilter.length > 0) {
      myArrayUnitAndMovementAndMigzarFiltered = myArrayUnitAndMovementFiltered.filter((el) => {
        return eshkolfilter.migzarfilter.some((f) => {
          return f === el.jobinmahzor.job.migzar;
        });
      });
    }
    else {
      myArrayUnitAndMovementAndMigzarFiltered = myArrayUnitAndMovementFiltered;
    }

    for (let i = 0; i < myArrayUnitAndMovementAndMigzarFiltered.length; i++) {
      if (myArrayUnitAndMovementAndMigzarFiltered[i].candidatesineshkol.length >= temhighestnumber) {
        temhighestnumber = myArrayUnitAndMovementAndMigzarFiltered[i].candidatesineshkol.length;
      }
    }
    setData(myArrayUnitAndMovementAndMigzarFiltered)
    setHighestnumber(temhighestnumber)
  }

  useEffect(() => {
    applyfiltersontodata()
  }, [eshkolfilter]);

  useEffect(() => {
    getMahzorEshkol()
  }, [candidatesinmahzor]);

  // useEffect(() => {
  //   FilterEshkols()
  // }, [migzarfilter, unitfilter, certainfilter]);

  useEffect(() => {
    init()
  }, []);

  return (
    <>
      {/* modals */}
      <ProfilePageModal isOpen={isprofilepageopen} userid={useridformodal} Toggle={ToggleUserModal} />
      <EditEshkolFormModal isOpen={iseshkolformopen} eshkolid={eshkolidformodal} iseshkol={'false'} Toggle={Toggle} ToggleForModal={ToggleForModal} />
      {/* modals */}

      {/* filters */}
      {/* <MigzarFilter data={data} setMigzarfilter={setMigzarfilter} migzarfilter={migzarfilter} />
      <UnitFilter originaldata={originaldata} data={data} setUnitfilter={setUnitfilter} unitfilter={unitfilter} migzarfilter={migzarfilter} certainfilter={certainfilter} />
      <CertainFilter data={data} setCertainfilter={setCertainfilter} certainfilter={certainfilter} unitfilter={unitfilter} /> */}
      <EshkolFilter originaldata={originaldata} eshkolfilter={eshkolfilter} setfilter={setfilter} />
      {/* filters */}

      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls">
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
              {data.length > 0 ? <th></th> : null}
              {data && data.length > 0 ? data.map(eshkol => {
                return (
                  <th>
                    <button value={eshkol._id} onClick={Toggle} className="btn-empty">
                      <p style={{ fontWeight: 'bold', color: 'white' }}>{eshkol.jobinmahzor.job.unit.name} / {eshkol.jobinmahzor.job.jobname}</p>
                    </button>
                    <h5 style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit', margin: '0px' }}>{eshkol.jobinmahzor.certain}</h5>
                  </th>
                )
              }
              ) : null}
            </tr>
          </thead>
          <tbody>
            <tr>
              {data.length > 0 ? <th style={{width:`${100/(data.length+1)}%`,minWidth:'150px'}}>שיבוץ סופי</th> : null}
              {data && data.length > 0 ? data.map(eshkol => {
                return (
                  eshkol.finalcandidate && eshkol.finalcandidate.user ?
                    <td>
                      <button value={eshkol.finalcandidate.user._id} className="btn-empty" onClick={ToggleUserModal}>
                        <p style={{ fontWeight: 'bold' }}>{eshkol.finalcandidate.user.name} {eshkol.finalcandidate.user.lastname}</p>
                      </button>
                    </td>
                    : <td></td>)
              }) : null}
            </tr>
            {[...Array(highestnumber)].map((x, i) => {
              return (<tr>
                {data.length > 0 ? <th></th> : null}
                {data && data.length > 0 ? data.map(eshkol => {
                  return (
                    eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (eshkol.candidatesineshkol[i].candidaterank && eshkol.candidatesineshkol[i].unitrank) ?
                      <td style={{width:`${100/(data.length+1)}%`,minWidth:'150px'}}>
                        <button value={eshkol.candidatesineshkol[i].candidate.user._id} className="btn-empty" onClick={ToggleUserModal}>
                          <p style={{ fontWeight: 'bold' }}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</p>
                        </button>
                        {eshkol.candidatesineshkol[i].candidaterank ? <p>דירוג מתמודד:{eshkol.candidatesineshkol[i].candidaterank}</p> : null}
                        {eshkol.candidatesineshkol[i].unitrank ? <p>דירוג יחידה:{eshkol.candidatesineshkol[i].unitrank}</p> : null}
                      </td>
                      : eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (eshkol.candidatesineshkol[i].candidaterank && !eshkol.candidatesineshkol[i].unitrank) ?
                        <td style={{width:`${100/(data.length+1)}%`,minWidth:'150px'}}>
                          <button value={eshkol.candidatesineshkol[i].candidate.user._id} className="btn-empty" onClick={ToggleUserModal}>
                            <p style={{ fontWeight: 'bold' }}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</p>
                          </button>
                          {eshkol.candidatesineshkol[i].candidaterank ? <p>דירוג מתמודד:{eshkol.candidatesineshkol[i].candidaterank}</p> : null}
                        </td> : eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (!eshkol.candidatesineshkol[i].candidaterank && eshkol.candidatesineshkol[i].unitrank) ?
                          <td style={{width:`${100/(data.length+1)}%`,minWidth:'150px'}}>
                            <button value={eshkol.candidatesineshkol[i].candidate.user._id} className="btn-empty" onClick={ToggleUserModal}>
                              <p style={{ fontWeight: 'bold' }}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</p>
                            </button>
                            {eshkol.candidatesineshkol[i].unitrank ? <p>דירוג יחידה:{eshkol.candidatesineshkol[i].unitrank}</p> : null}
                          </td> : eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (!eshkol.candidatesineshkol[i].candidaterank && !eshkol.candidatesineshkol[i].unitrank) ?
                            <td style={{width:`${100/(data.length+1)}%`,minWidth:'150px'}}>
                              <button value={eshkol.candidatesineshkol[i].candidate.user._id} className="btn-empty" onClick={ToggleUserModal}>
                                <p style={{ fontWeight: 'bold' }}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</p>
                              </button>
                              <p>הוסף ע"י מנהל מערכת</p>
                            </td> : <td style={{width:`${100/(data.length+1)}%`,minWidth:'150px'}}></td>)
                }) : null}
              </tr>)
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          {data.length == 0 ? <h2 style={{ fontWeight: 'bold' }}>אין נתונים בטבלה</h2> : null}
        </div>
        <div style={{ display: 'flex', paddingTop: '5px' }}>
          <h4 style={{ fontWeight: 'bold' }}>מספר אשכולות : {data.length}</h4>
        </div>
        <div style={{ float: 'right' }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn-green"
            table="table-to-xls"
            filename="קובץ - אשכולות"
            sheet="קובץ - אשכולות"
            buttonText="הורד כקובץ אקסל" />
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;