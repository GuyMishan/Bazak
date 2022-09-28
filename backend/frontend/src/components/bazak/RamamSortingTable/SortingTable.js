import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import people from "assets/img/people.png";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  Row,
  Col,
} from "reactstrap";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import RamamFormModal from "views/generalpages/subunitspage/RamamFormModal";
import RamamFormModalDelete from "views/generalpages/subunitspage/RamamFormModalDelete";

const SortingTable = (props) => {
  const columns = useMemo(() => COLUMNS, []);
  //data
  const [data, setData] = useState([])
  //ramam form modal
  const [isramamformopen, setIsramamformopen] = useState(false);
  const [ramamidformodal, setRamamidformodal] = useState(undefined);
  //ramam form modal delete
  const [isramamformdeleteopen, setIsramamformdeleteopen] = useState(false);
  const [ramamidfordeletemodal, setRamamidfordeletemodal] = useState(undefined);

  function Toggle(evt) {
    if (evt.currentTarget.value == '') {
      setRamamidformodal(undefined)
    }
    else {
      setRamamidformodal(evt.currentTarget.value)
    }
    setIsramamformopen(!isramamformopen);
  }

  function ToggleForModal(evt) {
    setIsramamformopen(!isramamformopen);
    init(); // update table..
  }

  function ToggleDelete(evt) {
    if (evt.currentTarget.value == '') {
      setRamamidfordeletemodal(undefined)
    }
    else {
      setRamamidfordeletemodal(evt.currentTarget.value)
    }
    setIsramamformdeleteopen(!isramamformdeleteopen);
  }

  function ToggleForModalDelete(evt) {
    setIsramamformdeleteopen(!isramamformdeleteopen);
    init(); // update table..
  }

  async function CalculateDataArr() {
    await axios.get(`http://localhost:8000/api/ramam/ramambyunitid/${props.unitid}`)
      .then(response => {
        setData(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function init() {
    CalculateDataArr()
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    allColumns,
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
    init();
  }, [props.unittype, props.unitid, props.match]);

  return (
    <>
      <div style={{ float: 'right', paddingBottom: '5px' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename='קובץ - רמ"מ'
          sheet='קובץ - רמ"מ'
          buttonText="הורד כקובץ אקסל"
          style={{}}
        />
        <button className="btn-new-blue" value={undefined} onClick={Toggle} style={{ marginRight: '5px' }}>הוסף רמ"מ</button>
      </div>
      {/*<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />*/}
      {/*modals */}
      <RamamFormModal isOpen={isramamformopen} ramamid={ramamidformodal} Toggle={Toggle} ToggleForModal={ToggleForModal} unittype={props.unittype} unitid={props.unitid} />
      <RamamFormModalDelete isOpen={isramamformdeleteopen} ramamid={ramamidfordeletemodal} Toggle={ToggleDelete} ToggleForModal={ToggleForModalDelete} unittype={props.unittype} unitid={props.unitid} />
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
                  <tr className="">
                    {
                      row.cells.map(cell => {
                        if (cell.column.id == "see") {
                          return cell.value ? <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value}</td> : <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                        }
                        if (cell.column.id == "estimate") {
                          return cell.value ? <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value}</td> : <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                        }
                        if (cell.column.id == "suggest") {
                          return cell.value ? <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value}</td> : <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                        }
                        if (cell.column.id == "user") {
                          return cell.value ? <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value.name} {cell.value.lastname}</td> : <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                        }
                        if (cell.column.id == "updatedAt") {
                          return cell.value ? <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value.slice(0, 10).split("-").reverse().join("/")}</td> : <td style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                        }
                      })
                    }
                    <td role="cell"> <div style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><button className="btn-new-blue" value={row.original._id} onClick={Toggle}>עדכן</button></div></td>
                    <td role="cell"> <div style={{ width: `${100 / 7}%`, minWidth: '50px', maxWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><button className="btn-new-delete" value={row.original._id} onClick={ToggleDelete}>מחק</button></div></td>
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
                הראה {pageSize}
              </option>
            ))}
            <option key={data.length} value={data.length}>
              הראה הכל
              </option>
          </select>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;