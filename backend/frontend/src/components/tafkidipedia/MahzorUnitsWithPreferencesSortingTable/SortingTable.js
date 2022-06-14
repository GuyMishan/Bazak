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

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])

  function init() {
    getMahzorUnitsWithPreferences();
  }

  const isDuplicate = (data, obj) => {
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].unit._id == obj._id) {
        flag = true
      }
    }
    return flag;
  }

  const getMahzorUnitsWithPreferences = async () => {
    //get mahzor jobinmahzors
    let response1 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
    let tempdata1 = response1.data;

    let tempunitsandtotaljobs = [];
    for (let i = 0; i < tempdata1.length; i++) {
      if (!isDuplicate(tempunitsandtotaljobs, tempdata1[i].job.unit)) {
        tempunitsandtotaljobs.push({ unit: tempdata1[i].job.unit, numberofjobs: 1 })
      }
      else {
        for (let j = 0; j < tempunitsandtotaljobs.length; j++) {
          if (tempdata1[i].job.unit._id == tempunitsandtotaljobs[j].unit._id) {
            tempunitsandtotaljobs[j].numberofjobs++;
          }
        }
      }
    }

    //get all unit preferences + sort by mahzorid
    let response = await axios.get(`http://localhost:8000/api/smartunitpreference`)
    let tempdata = response.data;
    let tempunitsandjobpreferences = [];

    for (let i = 0; i < tempdata.length; i++) {
      if (tempdata[i].mahzor._id == match.params.mahzorid) {
        if (!isDuplicate(tempunitsandjobpreferences, tempdata[i].jobinmahzor.job.unit)) {
          tempunitsandjobpreferences.push({ unit: tempdata[i].jobinmahzor.job.unit, numberofjobpreferences: 1 })
        }
        else {
          for (let j = 0; j < tempunitsandjobpreferences.length; j++) {
            if (tempdata[i].jobinmahzor.job.unit._id == tempunitsandjobpreferences[j].unit._id) {
              tempunitsandjobpreferences[j].numberofjobpreferences++;
            }
          }
        }
      }
    }

    //merge arrays
    let tempunits = [];
    for (let i = 0; i < tempunitsandtotaljobs.length; i++) {
      for (let j = 0; j < tempunitsandjobpreferences.length; j++) {
        if (tempunitsandtotaljobs[i].unit._id == tempunitsandjobpreferences[j].unit._id) {
          tempunits.push({ unit: tempunitsandtotaljobs[i].unit, numberofjobs: tempunitsandtotaljobs[i].numberofjobs, numberofjobpreferences: tempunitsandjobpreferences[j].numberofjobpreferences })
        }
      }
    }

    setData(tempunits)
  }

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
      <div style={{ float: 'right' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - העדפות"
          sheet="קובץ - העדפות"
          buttonText="הורד כקובץ אקסל" />
      <Link style={{color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/mahzorunitspreferecespage/${match.params.mahzorid}`}> <button className="btn-new"style={{ padding: "0.5rem" }}>לחץ לפרטים</button></Link>
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
                        return <td style={{width:`${100/3}%`,minWidth:'125px'}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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