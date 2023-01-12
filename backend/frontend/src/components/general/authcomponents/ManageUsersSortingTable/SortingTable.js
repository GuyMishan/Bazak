import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ManageUsersFilter from "components/bazak/Filters/ManageUsersFilter";

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])
  const [originaldata, setOriginaldata] = useState([])
  //filter
  const [filter, setFilter] = useState([])
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
    axios.get("http://localhost:8000/api/usersvalidatedaggregate")
      .then(response => {
        setData(response.data);
        setOriginaldata(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const setfilterfunction = (evt) => {
    if (evt.currentTarget.name == 'role') {
      if (filter.rolefilter) {
        let temprolefilter = [...filter.rolefilter]
        const index = temprolefilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          temprolefilter.splice(index, 1);
        }
        else {
          temprolefilter.push(evt.currentTarget.value)
        }
        setFilter({ ...filter, rolefilter: temprolefilter })
      }
      else {
        setFilter({ ...filter, rolefilter: [evt.currentTarget.value] })
      }
    }
  }

  function handleChange8(selectedOption, name) {
    if (!(selectedOption.value == "בחר")) {
      let tempvalues = [];
      for (let i = 0; i < selectedOption.length; i++) {
        tempvalues.push(selectedOption[i].value);
      }
      setFilter({ ...filter, [name]: tempvalues });
    }
    else {
      let tempfilter = { ...filter };
      delete tempfilter[name];
      setFilter(tempfilter);
    }
  }

  const applyfiltersontodata = () => {
    let tempdatabeforefilter = originaldata;

    let myArrayFiltered1 = []; //filter rolefilter
    if (filter.rolefilter && filter.rolefilter.length > 0) {

      myArrayFiltered1 = tempdatabeforefilter.filter((el) => {
        return filter.rolefilter.some((f) => {
          let ff;
          if (f == 'הרשאת אדמין') {
            ff = '0';
          }
          if (f == 'הרשאת פיקוד') {
            ff = '4';
          }
          if (f == 'הרשאת אוגדה') {
            ff = '3';
          }
          if (f == 'הרשאת חטיבה') {
            ff = '2';
          }
          if (f == 'הרשאת גדוד') {
            ff = '1';
          }
          return ff === el.role;
        });
      });
    }
    else {
      myArrayFiltered1 = tempdatabeforefilter;
    }

    let myArrayFiltered3 = []; //filter pikod
    if (filter.pikod && filter.pikod.length > 0) {
      myArrayFiltered3 = myArrayFiltered1.filter(item => filter.pikod.includes(item.pikod));
    }
    else {
      myArrayFiltered3 = myArrayFiltered1;
    }

    let myArrayFiltered4 = []; //filter ogda
    if (filter.ogda && filter.ogda.length > 0) {
      myArrayFiltered4 = myArrayFiltered3.filter(item => filter.ogda.includes(item.ogda));
    }
    else {
      myArrayFiltered4 = myArrayFiltered3;
    }

    let myArrayFiltered5 = []; //filter hativa
    if (filter.hativa && filter.hativa.length > 0) {
      myArrayFiltered5 = myArrayFiltered4.filter(item => filter.hativa.includes(item.hativa));
    }
    else {
      myArrayFiltered5 = myArrayFiltered4;
    }

    let myArrayFiltered6 = []; //filter gdod
    if (filter.gdod && filter.gdod.length > 0) {
      myArrayFiltered6 = myArrayFiltered5.filter(item => filter.gdod.includes(item.gdod));
    }
    else {
      myArrayFiltered6 = myArrayFiltered5;
    }

    setData(myArrayFiltered6)
  }

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

  useEffect(() => {
    (async () => {
      await loadPikods();
      await loadOgdas();
      await loadHativas();
      await loadGdods();
      const result = await axios.get("http://localhost:8000/api/usersvalidatedaggregate");
      setData(result.data);
      setOriginaldata(result.data);
    })();
  }, []);

  useEffect(() => {
    applyfiltersontodata()
  }, [filter]);

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
        {/*filter */}
        <ManageUsersFilter originaldata={originaldata} filter={filter} setfilterfunction={setfilterfunction} unittype={'admin'} handleChange8={handleChange8} />

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
                            if (cell.value == '5')
                            return <td>משתמש כלל צה"ל</td>
                          }
                          if (cell.column.id == "unit") {
                            if (row.original.role == '0' || row.original.role == '5')
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