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

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Button } from "reactstrap";
import CarDataFormModal from "views/generalpages/zminotpage/CarDataFormModal";
import Input from "reactstrap/lib/Input";

const SortingTable = (props) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])

  //cardata form modal
  const [iscardataformopen, setIscardataformopen] = useState(false);
  const [cardataidformodal, setCardataidformodal] = useState(undefined);
  //units
  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);
  //cartypes
  const [mkabazs, setMkabazs] = useState([]);
  const [magads, setMagads] = useState([]);
  const [magadals, setMagadals] = useState([]);

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

  const loadMagadals = async () => {
    let response = await axios.get("http://localhost:8000/api/magadal",)
    setMagadals(response.data);
  }

  const loadMagads = async () => {
    let response = await axios.get("http://localhost:8000/api/magad",)
    setMagads(response.data);
  }

  const loadMkabazs = async () => {
    let response = await axios.get("http://localhost:8000/api/mkabaz",)
    setMkabazs(response.data);
  }

  function Toggle(evt) {
    if (evt.currentTarget.value == '') {
      setCardataidformodal(undefined)
    }
    else {
      setCardataidformodal(evt.currentTarget.value)
    }
    setIscardataformopen(!iscardataformopen);
  }

  function ToggleForModal(evt) {
    setIscardataformopen(!iscardataformopen);
    updatechangedcardata(); // update table..
  }

  async function updatechangedcardata() {
    if (cardataidformodal != undefined) {
      let response = await axios.get(`http://localhost:8000/api/cardata/${cardataidformodal}`)
      let tempcardata = response.data[0];

      let tempdata = [...data];

      for (let i = 0; i < tempdata.length; i++) {
        if (cardataidformodal == tempdata[i]._id) {
          tempdata[i] = { ...tempcardata };
        }
      }
      setData(tempdata)
    }
    else {
      init();
    }
  }

  function init() {
    getCardDataByUnitTypeAndUnitId();
  }

  function init2() {
    loadPikods();
    loadOgdas();
    loadHativas();
    loadGdods();
    loadMagadals();
    loadMagads();
    loadMkabazs();
  }

  const getCardDataByUnitTypeAndUnitId = async () => {
    try {
      await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${props.unittype}/${props.unitid}`)
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
    init2();
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
      <CarDataFormModal isOpen={iscardataformopen} cardataid={cardataidformodal} Toggle={Toggle} ToggleForModal={ToggleForModal} unittype={props.unittype} unitid={props.unitid} />
      <div style={{float:'right'}}>
      <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - זמינות"
          sheet="קובץ - זמינות"
          buttonText="הורד כקובץ אקסל" 
          style={{float:'right'}}
          />
      </div>
        <button className="btn-new-blue" value={undefined} onClick={Toggle} style={{float:'right',marginRight:'10px'}}>הוסף צ'</button>
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
                        if ((cell.column.id != "createdAt") && (cell.column.id != "updatedAt") && (cell.column.id != "latest_recalibration_date") && (cell.column.id != "pikod") && (cell.column.id != "ogda") && (cell.column.id != "hativa") && (cell.column.id != "gdod") && (cell.column.id != "magadal") && (cell.column.id != "magad") && (cell.column.id != "mkabaz")) {
                          return <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        }
                        else {
                          if (cell.column.id == "latest_recalibration_date") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '150px' }} {...cell.getCellProps()}>{cell.value.slice(0, 10).split("-").reverse().join("-")}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "pikod") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{pikods.map((pikod, index) => (pikod._id == cell.value ? pikod.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "ogda") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{ogdas.map((ogda, index) => (ogda._id == cell.value ? ogda.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "hativa") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{hativas.map((hativa, index) => (hativa._id == cell.value ? hativa.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "gdod") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{gdods.map((gdod, index) => (gdod._id == cell.value ? gdod.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "magadal") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{magadals.map((magadal, index) => (magadal._id == cell.value ? magadal.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "magad") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{magads.map((magad, index) => (magad._id == cell.value ? magad.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                          if (cell.column.id == "mkabaz") {
                            return cell.value ? <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}>{mkabazs.map((mkabaz, index) => (mkabaz._id == cell.value ? mkabaz.name : null))}</td> : <td style={{ width: `${100 / 22}%`, minWidth: '50px' }} {...cell.getCellProps()}></td>
                          }
                        }
                      })
                    }
                    <td role="cell"> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><button className="btn-new-blue" value={row.original._id} onClick={Toggle}>עדכן</button></div></td>{/*row.original._id=cardata._id*/}
                    {/* {console.log(row)} */}
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