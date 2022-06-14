import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import info from "assets/img/info.png";

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
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledPopover
} from "reactstrap";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import CandidatePreferenceFilter from 'components/tafkidipedia/Filters/CandidatePreferenceFilter';

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [originaldata, setOriginalData] = useState([])
  const [data, setData] = useState([])

  const [certheaderspan, setCertheaderspan] = useState(0)
  const [noncertheaderspan, setNoncertheaderspan] = useState(0)

  const [candidatepreferencefilter, setCandidatepreferencefilter] = useState({})

  function init() {
    getMahzorCabdidatePreferences();
  }

  const getMahzorCabdidatePreferences = async () => {//get + sort by mahzorid
    let tempcandidatepreferenceranking = [];
    let tempjobsinmahzor = [];

    let result = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`);
    tempjobsinmahzor = result.data;

    let result2 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking`);//need to be changed to only jobinmahzors preferencerankings
    tempcandidatepreferenceranking = result2.data;

    await axios.get(`http://localhost:8000/api/smartfinalcandidatepreference`)
      .then(async response => {
        let tempdata = response.data;
        let tempcandidatepreferences = [];
        for (let i = 0; i < tempdata.length; i++) {
          if (tempdata[i].mahzor._id == match.params.mahzorid) {
            for (let j = 0; j < tempdata[i].certjobpreferences.length; j++) {
              for (let k = 0; k < tempcandidatepreferenceranking.length; k++) {
                if (tempdata[i].certjobpreferences[j] == tempcandidatepreferenceranking[k]._id) {
                  tempdata[i].certjobpreferences[j] = tempcandidatepreferenceranking[k];
                  delete tempdata[i].certjobpreferences[j].__v;
                  delete tempdata[i].certjobpreferences[j]._id;
                  for (let l = 0; l < tempjobsinmahzor.length; l++) {
                    if (tempdata[i].certjobpreferences[j].jobinmahzor == tempjobsinmahzor[l]._id) {
                      tempdata[i].certjobpreferences[j].jobinmahzor = tempjobsinmahzor[l];
                    }
                  }
                }
              }
            }
            for (let j = 0; j < tempdata[i].noncertjobpreferences.length; j++) {
              for (let k = 0; k < tempcandidatepreferenceranking.length; k++) {
                if (tempdata[i].noncertjobpreferences[j] == tempcandidatepreferenceranking[k]._id) {
                  tempdata[i].noncertjobpreferences[j] = tempcandidatepreferenceranking[k];
                  delete tempdata[i].noncertjobpreferences[j].__v;
                  delete tempdata[i].noncertjobpreferences[j]._id;
                  for (let l = 0; l < tempjobsinmahzor.length; l++) {
                    if (tempdata[i].noncertjobpreferences[j].jobinmahzor == tempjobsinmahzor[l]._id) {
                      tempdata[i].noncertjobpreferences[j].jobinmahzor = tempjobsinmahzor[l];
                    }
                  }
                }
              }
            }
            tempcandidatepreferences.push(tempdata[i])
          }
        }
        setData(tempcandidatepreferences)
        setOriginalData(tempcandidatepreferences)
        CalculateHeaderSpan(tempcandidatepreferences)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const CalculateHeaderSpan = async (tabledata) => {
    let tempcertheaderspan = 0;
    let tempnoncertheaderspan = 0;

    for (let i = 0; i < tabledata.length; i++) {
      if (tabledata[i].certjobpreferences.length > tempcertheaderspan) {
        tempcertheaderspan = tabledata[i].certjobpreferences.length
      }
      if (tabledata[i].noncertjobpreferences.length > tempnoncertheaderspan) {
        tempnoncertheaderspan = tabledata[i].noncertjobpreferences.length
      }
    }
    setCertheaderspan(tempcertheaderspan);
    setNoncertheaderspan(tempnoncertheaderspan);
  }

  const setfilter = (evt) => {
    if (evt.currentTarget.name == 'movement') {
      if (candidatepreferencefilter.movementfilter) {
        let tempmovementfilter = [...candidatepreferencefilter.movementfilter]
        const index = tempmovementfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempmovementfilter.splice(index, 1);
        }
        else {
          tempmovementfilter.push(evt.currentTarget.value)
        }
        setCandidatepreferencefilter({ ...candidatepreferencefilter, movementfilter: tempmovementfilter })
      }
      else {
        setCandidatepreferencefilter({ ...candidatepreferencefilter, movementfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'unit') {
      if (candidatepreferencefilter.unitfilter) {
        let tempunitfilter = [...candidatepreferencefilter.unitfilter]
        const index = tempunitfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempunitfilter.splice(index, 1);
        }
        else {
          tempunitfilter.push(evt.currentTarget.value)
        }
        setCandidatepreferencefilter({ ...candidatepreferencefilter, unitfilter: tempunitfilter })
      }
      else {
        setCandidatepreferencefilter({ ...candidatepreferencefilter, unitfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'migzar') {
      if (candidatepreferencefilter.migzarfilter) {
        let tempmigzarfilter = [...candidatepreferencefilter.migzarfilter]
        const index = tempmigzarfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempmigzarfilter.splice(index, 1);
        }
        else {
          tempmigzarfilter.push(evt.currentTarget.value)
        }
        setCandidatepreferencefilter({ ...candidatepreferencefilter, migzarfilter: tempmigzarfilter })
      }
      else {
        setCandidatepreferencefilter({ ...candidatepreferencefilter, migzarfilter: [evt.currentTarget.value] })
      }
    }
  }

  const applyfiltersontodata = () => {
    let tempdatabeforefilter = originaldata;

    let myArrayUnitFiltered = [];
    if (candidatepreferencefilter.unitfilter && candidatepreferencefilter.unitfilter.length > 0) {
      myArrayUnitFiltered = tempdatabeforefilter.filter((el) => {
        return candidatepreferencefilter.unitfilter.some((f) => {
          return f === el.candidate.user.job.unit._id;
        });
      });
    }
    else {
      myArrayUnitFiltered = originaldata;
    }

    let myArrayUnitAndMovementFiltered = [];
    if (candidatepreferencefilter.movementfilter && candidatepreferencefilter.movementfilter.length > 0) {
      myArrayUnitAndMovementFiltered = myArrayUnitFiltered.filter((el) => {
        return candidatepreferencefilter.movementfilter.some((f) => {
          return f === el.candidate.movement._id;
        });
      });
    }
    else {
      myArrayUnitAndMovementFiltered = myArrayUnitFiltered;
    }

    let myArrayUnitAndMovementAndMigzarFiltered = [];
    if (candidatepreferencefilter.migzarfilter && candidatepreferencefilter.migzarfilter.length > 0) {
      myArrayUnitAndMovementAndMigzarFiltered = myArrayUnitAndMovementFiltered.filter((el) => {
        return candidatepreferencefilter.migzarfilter.some((f) => {
          return f === el.candidate.user.migzar;
        });
      });
    }
    else {
      myArrayUnitAndMovementAndMigzarFiltered = myArrayUnitAndMovementFiltered;
    }

    setData(myArrayUnitAndMovementAndMigzarFiltered)
  }

  useEffect(() => {
    applyfiltersontodata()
  }, [candidatepreferencefilter]);

  useEffect(() => {
    init();
    setPageSize(5);
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable({
    columns, data, initialState: { pageIndex: 0 },
  },
    useGlobalFilter, useFilters, useSortBy, usePagination);

  return (
    <>
      <CandidatePreferenceFilter originaldata={originaldata} candidatepreferencefilter={candidatepreferencefilter} setfilter={setfilter} />
      <div style={{ float: 'right' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - העדפות"
          sheet="קובץ - העדפות"
          buttonText="הורד כקובץ אקסל" />
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table {...getTableProps()} id="table-to-xls">
          {data[0] ?
            <thead style={{ backgroundColor: '#4fff64' }}>
              <tr>
                <th colSpan="1" style={{ borderLeft: "1px solid white" }}>שם מתמודד</th>
                <th colSpan="1" style={{ borderLeft: "1px solid white" }}>יחידה</th>
                <th colSpan="1" style={{ borderLeft: "1px solid white" }}>תנועה</th>
                <th colSpan="1" style={{ borderLeft: "1px solid white" }}>מגזר</th>
                {certheaderspan != 0 ? <th colSpan={certheaderspan} style={{ borderLeft: "1px solid white" }}>תפקידים ודאי</th>
                  : null}
                {noncertheaderspan != 0 ? <th colSpan={noncertheaderspan}>תפקידים אופציה</th>
                  : null}
              </tr>
            </thead> : null}

          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        if (cell.column.id == "candidate.user.name") {
                          return <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}>
                            <div>
                              {row.original.remarks ?
                                <>
                                  <button id={`UncontrolledPopover${row.original._id}`} type="button" className="btn-empty">
                                    <img src={info} style={{ height: '20px' }} />
                                  </button>
                                  <UncontrolledPopover
                                    target={`UncontrolledPopover${row.original._id}`}
                                    trigger="focus"
                                  >
                                    <PopoverHeader style={{ textAlign: 'right' }}>
                                      הערות
                                    </PopoverHeader>
                                    <PopoverBody style={{ textAlign: 'right' }}>
                                      {row.original.remarks}
                                    </PopoverBody>
                                  </UncontrolledPopover>
                                </> : null}
                              <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${row.original.candidate.user._id}`}>{cell.value}{" "}{row.original.candidate.user.lastname}</Link>
                            </div>
                          </td>
                        }
                        if (cell.column.id == "candidate.user.job.unit") {
                          return <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}>{cell.value.name}</td>
                        }
                        if (cell.column.id == "candidate.movement") {
                          return <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}>{cell.value.name}</td>
                        }
                        if (cell.column.id == "candidate.user.migzar") {
                          return <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}>{cell.value}</td>
                        }
                        if (cell.column.id == "certjobpreferences") {
                          return [...Array(certheaderspan)].map((x, i) =>
                            cell.value[i] ? <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/displayjob/${cell.value[i].jobinmahzor.job._id}`}> {cell.value[i].jobinmahzor.job.jobname}/{cell.value[i].jobinmahzor.job.unit.name}</Link>({cell.value[i].rank})</td>
                              : <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}></td>)
                        }
                        if (cell.column.id == "noncertjobpreferences") {
                          return [...Array(noncertheaderspan)].map((x, i) =>
                            cell.value[i] ? <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/displayjob/${cell.value[i].jobinmahzor.job._id}`}> {cell.value[i].jobinmahzor.job.jobname}/{cell.value[i].jobinmahzor.job.unit.name}</Link>({cell.value[i].rank})</td>
                              : <td style={{ width: `${100 / (certheaderspan + noncertheaderspan + 4)}%`, minWidth: '125px' }}></td>)
                        }
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <div className="pagination">

          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}

          <span>
            עמוד{' '}
            <strong>
              {pageIndex + 1} מתוך {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | חפש עמוד:{' '}
            <input

              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px', borderRadius: '10px' }}
            />
          </span>{' '}
          <select
            style={{ borderRadius: '10px' }}
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 15, 20, 25].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', paddingTop: '5px' }}>
          <h4 style={{ fontWeight: 'bold' }}>מספר העדפות: {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;