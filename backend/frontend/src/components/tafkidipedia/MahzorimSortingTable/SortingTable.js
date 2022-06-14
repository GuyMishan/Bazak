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
    getMahzors();
  }

  const getMahzors = async () => {
    try {
      await axios.get(`http://localhost:8000/api/smartmahzors`)
        .then(response => {
          setData(response.data)
        })
        .catch((error) => {
          console.log(error);
        })
    }
    catch {

    }
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
          filename="קובץ - מחזורים"
          sheet="קובץ - מחזורים"
          buttonText="הורד כקובץ אקסל" />
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table {...getTableProps()} id="table-to-xls">
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
                <th></th>
                <th></th>
              </tr>
            ))}

          </thead>
          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        if (cell.column.id == "population") {
                          return <td>{cell.value.name}</td>
                        }
                        if (cell.column.id == "season") {
                          return <td>{cell.value.split("-").reverse().join("-")}</td>
                        }
                        if (cell.column.id == "status") {
                          if (cell.value == 1)
                            return <td>התחלת מחזור חדש</td>
                          if (cell.value == 2)
                            return <td>התחלת סבב העדפות ראשון</td>
                          if (cell.value == 3)
                            return <td>סיום סבב העדפות ראשון</td>
                          if (cell.value == 4)
                            return <td>התחלת סבב העדפות שני (לאחר ראיונות)</td>
                          if (cell.value == 5)
                            return <td>שיבוצים סופיים</td>
                          if (cell.value == 6)
                            return <td>מחזור סגור</td>
                        }
                      })
                    }
                    {/* {console.log(row)} */}
                    <td style={{ textAlign: "center" }}>
                      <Link to={`/jobsbymahzor/${row.original._id}`}>
                        <button
                          className="btn-new"
                          style={{ padding: "0.5rem" }}
                        >
                          לצפייה בתפקידים
                        </button>
                      </Link>
                    </td>
                    {
                      row.original.status == 1 ? <td style={{ textAlign: "center" }}>
                        <Link to={`/mahzorform/${row.original._id}`}>
                          <button
                            className="btn-new"
                            style={{ padding: "0.5rem" }}
                          >
                            <img
                              src={editpic}
                              alt="bookmark"
                              style={{ height: "2rem" }}
                            />
                          </button>
                        </Link>
                      </td> :
                        <td style={{ textAlign: "center" }}>
                          <Link to={`/displaymahzor/${row.original._id}`}>
                            <button
                              className="btn-new"
                              style={{ padding: "0.5rem" }}
                            >
                              <img
                                src={editpic}
                                alt="bookmark"
                                style={{ height: "2rem" }}
                              />
                            </button>
                          </Link>
                        </td>
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
      </div>
    </>
  );
}
export default withRouter(SortingTable);;