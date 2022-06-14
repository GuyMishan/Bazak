import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import JobWithoutUnitPreferenceFilter from "../Filters/JobWithoutUnitPreferenceFilter";

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [originaldata, setOriginalData] = useState([])
  const [data, setData] = useState([])

  const [unitpreferencefilter, setUnitpreferencefilter] = useState({})

  function init() {
    getMahzorUnitsJobsWithoutPreferences();
  }

  const getMahzorUnitsJobsWithoutPreferences = async () => {//get + sort by mahzorid
    //get mahzor jobinmahzors
    let response1 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
    let tempdata1 = response1.data;
    console.log(tempdata1)

    //get all unit preferences + sort by mahzorid
    let response = await axios.get(`http://localhost:8000/api/smartunitpreference`)
    let tempdata = response.data;

    let tempunitsjobpreferences = [];

    for (let i = 0; i < tempdata.length; i++) {
      if (tempdata[i].mahzor._id == match.params.mahzorid) {
        tempunitsjobpreferences.push(tempdata[i])
      }
    }

    console.log(tempunitsjobpreferences)


    // find jobinmahzors without unitpreference

    let tempjobinmahzorswithoutunitpreference = [];
    for (let i = 0; i < tempdata1.length; i++) {
      let flag = false;
      for (let j = 0; j < tempunitsjobpreferences.length; j++) {
        if (tempdata1[i]._id == tempunitsjobpreferences[j].jobinmahzor._id) {
          flag = true;
        }
      }

      if (flag == false) {
        tempjobinmahzorswithoutunitpreference.push(tempdata1[i])
      }
    }

    setData(tempjobinmahzorswithoutunitpreference)
    setOriginalData(tempjobinmahzorswithoutunitpreference)
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
          return f === el.job.unit._id;
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
          return f === el.certain;
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
      <JobWithoutUnitPreferenceFilter originaldata={originaldata} unitpreferencefilter={unitpreferencefilter} setfilter={setfilter} />
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
                        if (cell.column.id == "job.unit.name") {
                          return <td className='redcell' style={{ width: `${100 /3}%`, minWidth: '125px' }}>{cell.value}</td>
                        }
                        if (cell.column.id == "job.jobname") {
                          return <td className='redcell' style={{ width: `${100 /3}%`, minWidth: '125px' }}>{cell.value}</td>
                        }
                        if (cell.column.id == "certain") {
                          return <td className='redcell' style={{ width: `${100 /3}%`, minWidth: '125px' }}>{cell.value}</td>
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
          <h4 style={{ fontWeight: 'bold' }}>מספר תפקידים ללא העדפות יחידה: {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;