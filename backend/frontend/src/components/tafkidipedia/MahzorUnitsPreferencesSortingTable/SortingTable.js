import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import info from "assets/img/info.png";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
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

import UnitPreferenceFilter from "../Filters/UnitPreferenceFilter";

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [originaldata, setOriginalData] = useState([])
  const [data, setData] = useState([])

  const [headerspan, setheaderspan] = useState(0)

  const [unitpreferencefilter, setUnitpreferencefilter] = useState({})

  function init() {
    getMahzorUnitsPreferences();
  }

  const getMahzorUnitsPreferences = async () => {//get + sort by mahzorid
    let tempcandidatesbymahzor = [];

    let result = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${match.params.mahzorid}`);
    tempcandidatesbymahzor = result.data;

    await axios.get(`http://localhost:8000/api/smartunitpreference`)
      .then(async response => {
        let tempdata = response.data;
        let tempunitspreferences = [];
        for (let i = 0; i < tempdata.length; i++) {
          if (tempdata[i].mahzor._id == match.params.mahzorid) {
            for (let j = 0; j < tempdata[i].preferencerankings.length; j++) {
              for (let k = 0; k < tempcandidatesbymahzor.length; k++) {
                if (tempdata[i].preferencerankings[j].candidate == tempcandidatesbymahzor[k]._id) {
                  tempdata[i].preferencerankings[j].candidate = tempcandidatesbymahzor[k];
                  delete tempdata[i].preferencerankings[j].__v;
                  delete tempdata[i].preferencerankings[j]._id;
                  delete tempdata[i].preferencerankings[j].candidate.__v;
                }
              }
            }
            tempunitspreferences.push(tempdata[i])
          }
        }
        setData(tempunitspreferences)
        setOriginalData(tempunitspreferences)
        CalculateHeaderSpan(tempunitspreferences)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const CalculateHeaderSpan = async (tabledata) => {
    let tempheaderspan = 0;

    for (let i = 0; i < tabledata.length; i++) {
      if (tabledata[i].preferencerankings.length > tempheaderspan) {
        tempheaderspan = tabledata[i].preferencerankings.length
      }
    }
    setheaderspan(tempheaderspan);
  }

  const setfilter = (evt) => {
    if (evt.currentTarget.name == 'unit') {
      if (unitpreferencefilter.unitfilter) {
        let tempunitfilter = [...unitpreferencefilter.unitfilter]
        const index = tempunitfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempunitfilter.splice(index, 1);
        }
        else {
          tempunitfilter.push(evt.currentTarget.value)
        }
        setUnitpreferencefilter({ ...unitpreferencefilter, unitfilter: tempunitfilter })
      }
      else {
        setUnitpreferencefilter({ ...unitpreferencefilter, unitfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'certain') {
      if (unitpreferencefilter.certainfilter) {
        let tempcertainfilter = [...unitpreferencefilter.certainfilter]
        const index = tempcertainfilter.indexOf(evt.currentTarget.value);
        console.log(index)
        if (index > -1) {
          tempcertainfilter.splice(index, 1);
        }
        else {
          tempcertainfilter.push(evt.currentTarget.value)
        }
        setUnitpreferencefilter({ ...unitpreferencefilter, certainfilter: tempcertainfilter })
      }
      else {
        setUnitpreferencefilter({ ...unitpreferencefilter, certainfilter: [evt.currentTarget.value] })
      }
    }
  }

  const applyfiltersontodata = () => {
    let tempdatabeforefilter = originaldata;

    let myArrayUnitFiltered = [];
    if (unitpreferencefilter.unitfilter && unitpreferencefilter.unitfilter.length > 0) {
      myArrayUnitFiltered = tempdatabeforefilter.filter((el) => {
        return unitpreferencefilter.unitfilter.some((f) => {
          return f === el.jobinmahzor.job.unit._id;
        });
      });
    }
    else {
      myArrayUnitFiltered = originaldata;
    }

    let myArrayUnitAndCertainFiltered = [];
    if (unitpreferencefilter.certainfilter && unitpreferencefilter.certainfilter.length > 0) {
      myArrayUnitAndCertainFiltered = myArrayUnitFiltered.filter((el) => {
        return unitpreferencefilter.certainfilter.some((f) => {
          return f === el.jobinmahzor.certain;
        });
      });
    }
    else {
      myArrayUnitAndCertainFiltered = myArrayUnitFiltered;
    }

    setData(myArrayUnitAndCertainFiltered)
  }

  useEffect(() => {
    applyfiltersontodata()
  }, [unitpreferencefilter]);

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
      <UnitPreferenceFilter originaldata={originaldata} unitpreferencefilter={unitpreferencefilter} setfilter={setfilter} />
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
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
            <th colSpan="1">יחידה</th>
              <th colSpan="1">תפקיד</th>
              <th colSpan="1">ודאי/אופציה</th>
              <th colSpan="100%">מועמדים</th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        if (cell.column.id == "jobinmahzor.job.unit.name") {
                          return <td style={{width:`${100/(headerspan+3)}%`,minWidth:'125px'}}>{cell.value}</td>
                        }
                        if (cell.column.id == "jobinmahzor.job.jobname") {
                          return <td style={{ width: `${100 / (headerspan + 3)}%`, minWidth: '125px' }}>
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
                              <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/displayjob/${row.original.jobinmahzor.job._id}`}>{cell.value}</Link>
                            </div>
                          </td>
                        }
                        if (cell.column.id == "jobinmahzor.certain") {
                          return <td style={{width:`${100/(headerspan+3)}%`,minWidth:'125px'}}>{cell.value}</td>
                        }
                        if (cell.column.id == "preferencerankings") {
                          // return <> {cell.value.map((preferenceranking, index) => (
                          //   <td style={{width:`${100/(headerspan+2)}%`,minWidth:'125px'}}><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${preferenceranking.candidate.user._id}`}>{preferenceranking.candidate.user.name} {preferenceranking.candidate.user.lastname}</Link> ({preferenceranking.rank})</td>
                          // ))}</>
                          return [...Array(headerspan)].map((x, i) =>
                          cell.value[i] ? <td style={{width:`${100/(headerspan+3)}%`,minWidth:'125px'}}><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${cell.value[i].candidate.user._id}`}>{cell.value[i].candidate.user.name} {cell.value[i].candidate.user.lastname}</Link> ({cell.value[i].rank})</td>
                            : <td tyle={{width:`${100/(headerspan+3)}%`,minWidth:'125px'}}></td>)
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