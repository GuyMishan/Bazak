import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])
  //units
  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);

  const loadPikods = async () => {
    let response = await axios.get("http://localhost:8000/api/pikod",)
    setPikods(response.data);
  }

  const loadOgdas = async () => {
    let response = await axios.get("http://localhost:8000/api/ogda",)
    setOgdas(response.data);
  }

  const loadHativas = async () => {
    let response = await axios.get("http://localhost:8000/api/hativa",)
    setHativas(response.data);
  }

  const loadGdods = async () => {
    let response = await axios.get("http://localhost:8000/api/gdod",)
    setGdods(response.data);
  }

  const UserDelete = UserId => {
    axios.post(`http://localhost:8000/api/user/remove/${UserId}`)
      .then(response => {
        loadUsers()
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadUsers = () => {
    axios.get("http://localhost:8000/api/usersvalidated")
      .then(response => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    (async () => {
      await loadPikods();
      await loadOgdas();
      await loadHativas();
      await loadGdods();
      const result = await axios.get("http://localhost:8000/api/usersvalidated");
      setData(result.data);
    })();
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
      <div style={{ float: 'right', paddingBottom: '5px' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls-users"
          filename="קובץ - משתמשי מערכת"
          sheet="קובץ - משתמשי מערכת"
          buttonText="הורד כקובץ אקסל"
          style={{ float: 'right' }}
        />
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls-users" {...getTableProps()}>
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
                <th>עדכן</th>
                <th>מחק</th>
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
                        if ((cell.column.id != "createdAt") && (cell.column.id != "updatedAt") && (cell.column.id != "role") && (cell.column.id != "unit")) {
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        }
                        else {
                          if (cell.column.id == "createdAt") {
                            return <td>{cell.value.slice(0, 10).split("-").reverse().join("-")}</td>
                          }
                          if (cell.column.id == "updatedAt") {
                            return <td>{cell.value.slice(0, 10).split("-").reverse().join("-")}</td>
                          }
                          if (cell.column.id == "role") {
                            if (cell.value == '0')
                              return <td>מנהל מערכת</td>
                            if (cell.value == '1')
                              return <td>משתמש גדוד</td>
                            if (cell.value == '2')
                              return <td>משתמש חטיבה</td>
                            if (cell.value == '3')
                              return <td>משתמש אוגדה</td>
                            if (cell.value == '4')
                              return <td>משתמש פיקוד</td>
                          }
                          if (cell.column.id == "unit") {
                            if (row.original.role == '0')
                              return <td></td>
                            if (row.original.role == '1')
                              return row.original.gdodid ? <td {...cell.getCellProps()}>{gdods.map((gdod, index) => (gdod._id == row.original.gdodid ? gdod.name : null))}</td> : <td {...cell.getCellProps()}></td>
                            if (row.original.role == '2')
                              return row.original.hativaid ? <td {...cell.getCellProps()}>{hativas.map((hativa, index) => (hativa._id == row.original.hativaid ? hativa.name : null))}</td> : <td {...cell.getCellProps()}></td>
                            if (row.original.role == '3')
                              return row.original.ogdaid ? <td {...cell.getCellProps()}>{ogdas.map((ogda, index) => (ogda._id == row.original.ogdaid ? ogda.name : null))}</td> : <td {...cell.getCellProps()}></td>
                            if (row.original.role == '4')
                              return row.original.pikodid ? <td {...cell.getCellProps()}>{pikods.map((pikod, index) => (pikod._id == row.original.pikodid ? pikod.name : null))}</td> : <td {...cell.getCellProps()}></td>
                          }
                        }

                      })
                    }
                    {/* {console.log(row.original._id)} */}
                    <td role="cell"> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <Link to={`/edituser/${row.original._id}`}><button className="btn-new">עדכן</button></Link> </div> </td>{/*row.original._id=user._id*/}
                    <td role="cell"> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <button className="btn-new-delete" onClick={() => UserDelete(row.original._id)}>מחק</button></div></td>
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
            {[10, 20, 30, 40, 50].map(pageSize => (
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