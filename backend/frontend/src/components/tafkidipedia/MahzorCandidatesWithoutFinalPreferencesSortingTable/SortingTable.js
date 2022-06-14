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

import CandidateFilter from 'components/tafkidipedia/Filters/CandidateFilter';

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [originaldata, setOriginalData] = useState([])
  const [data, setData] = useState([])

  const [candidatefilter, setCandidatefilter] = useState({})

  function init() {
    getMahzorCabdidateWithoutPreferences();
  }

  const setfilter = (evt) => {
    if (evt.currentTarget.name == 'movement') {
      if (candidatefilter.movementfilter) {
        let tempmovementfilter = [...candidatefilter.movementfilter]
        const index = tempmovementfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempmovementfilter.splice(index, 1);
        }
        else {
          tempmovementfilter.push(evt.currentTarget.value)
        }
        setCandidatefilter({ ...candidatefilter, movementfilter: tempmovementfilter })
      }
      else {
        setCandidatefilter({ ...candidatefilter, movementfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'unit') {
      if (candidatefilter.unitfilter) {
        let tempunitfilter = [...candidatefilter.unitfilter]
        const index = tempunitfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempunitfilter.splice(index, 1);
        }
        else {
          tempunitfilter.push(evt.currentTarget.value)
        }
        setCandidatefilter({ ...candidatefilter, unitfilter: tempunitfilter })
      }
      else {
        setCandidatefilter({ ...candidatefilter, unitfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'migzar') {
      if (candidatefilter.migzarfilter) {
        let tempmigzarfilter = [...candidatefilter.migzarfilter]
        const index = tempmigzarfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempmigzarfilter.splice(index, 1);
        }
        else {
          tempmigzarfilter.push(evt.currentTarget.value)
        }
        setCandidatefilter({ ...candidatefilter, migzarfilter: tempmigzarfilter })
      }
      else {
        setCandidatefilter({ ...candidatefilter, migzarfilter: [evt.currentTarget.value] })
      }
    }
  }

  const applyfiltersontodata = () => {
    let tempdatabeforefilter = originaldata;

    let myArrayUnitFiltered = [];
    if (candidatefilter.unitfilter && candidatefilter.unitfilter.length > 0) {
      myArrayUnitFiltered = tempdatabeforefilter.filter((el) => {
        return candidatefilter.unitfilter.some((f) => {
          return f === el.user.job.unit._id;
        });
      });
    }
    else {
      myArrayUnitFiltered = originaldata;
    }

    let myArrayUnitAndMovementFiltered = [];
    if (candidatefilter.movementfilter && candidatefilter.movementfilter.length > 0) {
      myArrayUnitAndMovementFiltered = myArrayUnitFiltered.filter((el) => {
        return candidatefilter.movementfilter.some((f) => {
          return f === el.movement._id;
        });
      });
    }
    else {
      myArrayUnitAndMovementFiltered = myArrayUnitFiltered;
    }

    let myArrayUnitAndMovementAndMigzarFiltered = [];
    if (candidatefilter.migzarfilter && candidatefilter.migzarfilter.length > 0) {
      myArrayUnitAndMovementAndMigzarFiltered = myArrayUnitAndMovementFiltered.filter((el) => {
        return candidatefilter.migzarfilter.some((f) => {
          return f === el.user.migzar;
        });
      });
    }
    else {
      myArrayUnitAndMovementAndMigzarFiltered = myArrayUnitAndMovementFiltered;
    }

    setData(myArrayUnitAndMovementAndMigzarFiltered)
    // console.log("dsdsds")
  }


  const getMahzorCabdidateWithoutPreferences = async () => {
    let tempcandidateswithoutpreferences = [];

    //get all mahzor candidates
    let result = await axios.get(`http://localhost:8000/api/activecandidatesbymahzorid/${match.params.mahzorid}`)
    let tempallcandidates = result.data;

    //get all candidates with a preference
    let response = await axios.get(`http://localhost:8000/api/smartfinalcandidatepreference`)
    let tempdata = response.data;
    let tempcandidateswithpreference = [];
    for (let i = 0; i < tempdata.length; i++) {
      if (tempdata[i].mahzor._id == match.params.mahzorid) {
        tempcandidateswithpreference.push(tempdata[i].candidate)
      }
    }

    //aves only candiidates without a preference
    for (let k = 0; k < tempallcandidates.length; k++) {
      let flag = false;
      for (let l = 0; l < tempcandidateswithpreference.length; l++)
        if (tempallcandidates[k]._id == tempcandidateswithpreference[l]._id) {
          flag = true;
        }
      if (flag == false) {
        tempcandidateswithoutpreferences.push(tempallcandidates[k]);
      }
    }

    setData(tempcandidateswithoutpreferences)
  }

  useEffect(() => {
    applyfiltersontodata()
  }, [candidatefilter]);

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
      <CandidateFilter originaldata={originaldata} candidatefilter={candidatefilter} setfilter={setfilter} />
      <div style={{ float: 'right' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - מועמדים"
          sheet="קובץ - מועמדים"
          buttonText="הורד כקובץ אקסל" />
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table {...getTableProps()} id="table-to-xls">
          {data[0] ?
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th  >
                      <div {...column.getHeaderProps(column.getSortByToggleProps())}> {column.render('Header')} </div>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                      <div>
                        {column.isSorted ? (column.isSortedDesc ? '🔽' : '⬆️') : ''}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}

            </thead> : null}

          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        if (cell.column.id != "user.name") {
                          return <td className="redcell" style={{width:`${100/4}%`,minWidth:'125px'}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        }
                        else {
                          return <td className="redcell"  style={{width:`${100/4}%`,minWidth:'125px'}}><Link style={{color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${row.original.user._id}`}>{cell.value}{" "}{row.original.user.lastname}</Link></td>
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
          <h4 style={{ fontWeight: 'bold' }}>מספר מתמודדים: {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;