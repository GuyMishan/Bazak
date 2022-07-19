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

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import CarDataFormModal from "views/generalpages/zminotpage/CarDataFormModal";
import CarDataFormModalDelete from "views/generalpages/zminotpage/CarDataFormModalDelete";
import CarDataFilter from 'components/bazak/Filters/CarDataFilter';
import DownLoadToExcel from "./DownLoadToExcel";

const SortingTable = (props) => {
  const columns = useMemo(() => COLUMNS, []);
  //data
  const [originaldata, setOriginaldata] = useState([])
  const [data, setData] = useState([])
  //filter
  const [filter, setFilter] = useState([])
  //cardata form modal
  const [iscardataformopen, setIscardataformopen] = useState(false);
  const [cardataidformodal, setCardataidformodal] = useState(undefined);
  //cardata form modal delete
  const [iscardataformdeleteopen, setIscardataformdeleteopen] = useState(false);
  const [cardataidfordeletemodal, setCardataidfordeletemodal] = useState(undefined);
  //units
  const [gdods, setGdods] = useState([]);
  const [hativas, setHativas] = useState([]);
  const [ogdas, setOgdas] = useState([]);
  const [pikods, setPikods] = useState([]);
  //cartypes
  const [makats, setMakats] = useState([]);
  const [mkabazs, setMkabazs] = useState([]);
  const [magads, setMagads] = useState([]);
  const [magadals, setMagadals] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);

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

  const loadMakats = async () => {
    let response = await axios.get("http://localhost:8000/api/makat",)
    setMakats(response.data);
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

  function ToggleDelete(evt) {
    if (evt.currentTarget.value == '') {
      setCardataidfordeletemodal(undefined)
    }
    else {
      setCardataidfordeletemodal(evt.currentTarget.value)
    }
    setIscardataformdeleteopen(!iscardataformdeleteopen);
  }

  function ToggleForModalDelete(evt) {
    setIscardataformdeleteopen(!iscardataformdeleteopen);
    updatechangedcardata(); // update table..
  }

  async function updatechangedcardata() {
    if (cardataidformodal != undefined) {
      if (props.unittype != 'notype') {
        let response = await axios.get(`http://localhost:8000/api/cardata/${cardataidformodal}`)
        let tempcardata = response.data[0];

        let tempdata = [...data];
        let temporiginaldata = [...originaldata];

        for (let i = 0; i < tempdata.length; i++) {
          if (cardataidformodal == tempdata[i]._id) {
            tempdata[i] = { ...tempcardata };
          }
        }

        for (let i = 0; i < temporiginaldata.length; i++) {
          if (cardataidformodal == temporiginaldata[i]._id) {
            temporiginaldata[i] = { ...tempcardata };
          }
        }
        setOriginaldata(temporiginaldata)
        setData(tempdata)
      }
      else {
        let tempdata = [...data];
        let temporiginaldata = [...originaldata];

        let tempdeleteindex = 999;
        let tempdeleteindexoriginal = 999;

        for (let i = 0; i < tempdata.length; i++) {
          if (cardataidformodal == tempdata[i]._id) {
            tempdeleteindex = i;
          }
        }

        for (let i = 0; i < temporiginaldata.length; i++) {
          if (cardataidformodal == temporiginaldata[i]._id) {
            //delete from arr
            tempdeleteindexoriginal = i;
          }
        }

        tempdata.splice(tempdeleteindex, 1);
        temporiginaldata.splice(tempdeleteindexoriginal, 1);

        setOriginaldata(temporiginaldata)
        setData(tempdata)
      }
    }
    else {
      init();
    }
  }

  function init() {
    getCardDataByUnitTypeAndUnitId();
    fixfilterunits();
  }

  function init2() {
    loadPikods();
    loadOgdas();
    loadHativas();
    loadGdods();
    loadMagadals();
    loadMagads();
    loadMkabazs();
    loadMakats();
  }

  const getCardDataByUnitTypeAndUnitId = async () => {
    if (props.ismushbat == "false") {
      await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${props.unittype}/${props.unitid}`)
        .then(response => {
          setOriginaldata(response.data)
          setData(response.data)
          setIsdataloaded(true)
        })
        .catch((error) => {
          console.log(error);
        })
    }
    else {
      await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid_mushbat/${props.unittype}/${props.unitid}`)
        .then(response => {
          setOriginaldata(response.data)
          setData(response.data)
          setIsdataloaded(true)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const fixfilterunits = async () => {
    let tempfilter = {};
    if (props.unittype == 'pikod') {
      tempfilter.pikod = props.unitid
    }
    else if (props.unittype == 'ogda') {
      tempfilter.ogda = props.unitid
      let response = await axios.get(`http://localhost:8000/api/ogda/${props.unitid}`,)
      tempfilter.pikod = response.data.pikod
    }
    else if (props.unittype == 'hativa') {
      tempfilter.hativa = props.unitid
      let response1 = await axios.get(`http://localhost:8000/api/hativa/${props.unitid}`,)
      tempfilter.ogda = response1.data.ogda
      let response = await axios.get(`http://localhost:8000/api/ogda/${tempfilter.ogda}`,)
      tempfilter.pikod = response.data.pikod
    }
    else if (props.unittype == 'gdod') {
      tempfilter.gdod = props.unitid
      let response2 = await axios.get(`http://localhost:8000/api/gdod/${props.unitid}`,)
      tempfilter.hativa = response2.data.hativa
      let response1 = await axios.get(`http://localhost:8000/api/hativa/${tempfilter.hativa}`,)
      tempfilter.ogda = response1.data.ogda
      let response = await axios.get(`http://localhost:8000/api/ogda/${tempfilter.ogda}`,)
      tempfilter.pikod = response.data.pikod
    }
    setFilter(tempfilter);
  }

  const setfilterfunction = (evt) => {
    if (evt.currentTarget.name == 'kshirot') {
      if (filter.kshirotfilter) {
        let tempkshirotfilter = [...filter.kshirotfilter]
        const index = tempkshirotfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempkshirotfilter.splice(index, 1);
        }
        else {
          tempkshirotfilter.push(evt.currentTarget.value)
        }
        setFilter({ ...filter, kshirotfilter: tempkshirotfilter })
      }
      else {
        setFilter({ ...filter, kshirotfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'zminot') {
      if (filter.zminotfilter) {
        let tempzminotfilter = [...filter.zminotfilter]
        const index = tempzminotfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempzminotfilter.splice(index, 1);
        }
        else {
          tempzminotfilter.push(evt.currentTarget.value)
        }
        setFilter({ ...filter, zminotfilter: tempzminotfilter })
      }
      else {
        setFilter({ ...filter, zminotfilter: [evt.currentTarget.value] })
      }
    }
  }

  function handleChange2(selectedOption, name) {
    if (!(selectedOption.value == "בחר"))
      setFilter({ ...filter, [name]: selectedOption.value });
    else {
      let tempfilter = { ...filter };
      delete tempfilter[name];
      setFilter(tempfilter);
    }
  }

  const applyfiltersontodata = () => {
    let tempdatabeforefilter = originaldata;

    let myArrayFiltered1 = []; //filter kshirotfilter
    if (filter.kshirotfilter && filter.kshirotfilter.length > 0) {
      myArrayFiltered1 = tempdatabeforefilter.filter((el) => {
        return filter.kshirotfilter.some((f) => {
          return f === el.kshirot;
        });
      });
    }
    else {
      myArrayFiltered1 = tempdatabeforefilter;
    }

    let myArrayFiltered2 = []; //filter zminotfilter
    if (filter.zminotfilter && filter.zminotfilter.length > 0) {
      myArrayFiltered2 = myArrayFiltered1.filter((el) => {
        return filter.zminotfilter.some((f) => {
          return f === el.zminot;
        });
      });
    }
    else {
      myArrayFiltered2 = myArrayFiltered1;
    }

    let myArrayFiltered3 = []; //filter pikod
    if (filter.pikod) {
      myArrayFiltered3 = myArrayFiltered2.filter((el) => {
        return filter.pikod === el.pikod;
      });
    }
    else {
      myArrayFiltered3 = myArrayFiltered2;
    }

    let myArrayFiltered4 = []; //filter ogda
    if (filter.ogda) {
      myArrayFiltered4 = myArrayFiltered3.filter((el) => {
        return filter.ogda === el.ogda;
      });
    }
    else {
      myArrayFiltered4 = myArrayFiltered3;
    }

    let myArrayFiltered5 = []; //filter hativa
    if (filter.hativa) {
      myArrayFiltered5 = myArrayFiltered4.filter((el) => {
        return filter.hativa === el.hativa;
      });
    }
    else {
      myArrayFiltered5 = myArrayFiltered4;
    }

    let myArrayFiltered6 = []; //filter gdod
    if (filter.gdod) {
      myArrayFiltered6 = myArrayFiltered5.filter((el) => {
        return filter.gdod === el.gdod;
      });
    }
    else {
      myArrayFiltered6 = myArrayFiltered5;
    }

    let myArrayFiltered7 = []; //filter magadal
    if (filter.magadal) {
      myArrayFiltered7 = myArrayFiltered6.filter((el) => {
        return filter.magadal === el.magadal;
      });
    }
    else {
      myArrayFiltered7 = myArrayFiltered6;
    }

    let myArrayFiltered8 = []; //filter magad
    if (filter.magad) {
      myArrayFiltered8 = myArrayFiltered7.filter((el) => {
        return filter.magad === el.magad;
      });
    }
    else {
      myArrayFiltered8 = myArrayFiltered7;
    }

    let myArrayFiltered9 = []; //filter mkabaz
    if (filter.mkabaz) {
      myArrayFiltered9 = myArrayFiltered8.filter((el) => {
        return filter.mkabaz === el.mkabaz;
      });
    }
    else {
      myArrayFiltered9 = myArrayFiltered8;
    }

    let myArrayFiltered10 = []; //filter makat
    if (filter.makat) {
      myArrayFiltered10 = myArrayFiltered9.filter((el) => {
        return filter.makat === el.makat;
      });
    }
    else {
      myArrayFiltered10 = myArrayFiltered9;
    }
    setData(myArrayFiltered10)
  }

  useEffect(() => {
    applyfiltersontodata()
  }, [filter]);


  useEffect(() => {
    init();
    init2();
    setPageSize(20);
  }, [props]);

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
    data.length == 0 && !isdataloaded ?
      <div style={{ width: '50%', marginTop: '30%' }}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
      <>
        {/*modals */}
        <CarDataFormModal isOpen={iscardataformopen} cardataid={cardataidformodal} Toggle={Toggle} ToggleForModal={ToggleForModal} unittype={props.unittype} unitid={props.unitid} />
        <CarDataFormModalDelete isOpen={iscardataformdeleteopen} cardataid={cardataidfordeletemodal} Toggle={ToggleDelete} ToggleForModal={ToggleForModalDelete} unittype={props.unittype} unitid={props.unitid} />
        {/*filter */}
        <CarDataFilter originaldata={originaldata} filter={filter} setfilterfunction={setfilterfunction} unittype={props.unittype} unitid={props.unitid} handleChange2={handleChange2} />

        <div style={{ float: 'right', paddingBottom: '5px' }}>
          {/* <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn-green"
            table="table-to-xls"
            filename="קובץ - זמינות"
            sheet="קובץ - זמינות"
            buttonText="הורד כקובץ אקסל"
            style={{ float: 'right' }}
          /> */}
          <DownLoadToExcel data={data}/>
        </div>
        <button className="btn-new-blue" value={undefined} onClick={Toggle} style={{ float: 'right', marginRight: '10px' }}>הוסף צ'</button>
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
                  {props.unittype != 'notype' ? <th></th>
                    : null}
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
                          if ((cell.column.id != "createdAt") && (cell.column.id != "updatedAt") && (cell.column.id != "latest_recalibration_date") && (cell.column.id != "pikod") && (cell.column.id != "ogda") && (cell.column.id != "hativa") && (cell.column.id != "gdod") && (cell.column.id != "magadal") && (cell.column.id != "magad") && (cell.column.id != "mkabaz") && (cell.column.id != "makat") && (cell.column.id != "makat_description") && (cell.column.id != "tipuls")) {
                            return <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          }
                          else {
                            if (cell.column.id == "latest_recalibration_date") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '150px', maxWidth: '150px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value.slice(0, 10).split("-").reverse().join("-")}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "pikod") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{pikods.map((pikod, index) => (pikod._id == cell.value ? pikod.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "ogda") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{ogdas.map((ogda, index) => (ogda._id == cell.value ? ogda.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "hativa") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{hativas.map((hativa, index) => (hativa._id == cell.value ? hativa.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "gdod") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{gdods.map((gdod, index) => (gdod._id == cell.value ? gdod.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "magadal") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{magadals.map((magadal, index) => (magadal._id == cell.value ? magadal.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "magad") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{magads.map((magad, index) => (magad._id == cell.value ? magad.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "mkabaz") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{mkabazs.map((mkabaz, index) => (mkabaz._id == cell.value ? mkabaz.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "makat") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{makats.map((makat, index) => (makat._id == cell.value ? makat.name : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "makat_description") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{makats.map((makat, index) => (makat._id == row.original.makat ? makat.description : null))}</td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "tipuls") {
                              return cell.value ? <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>
                                {/* {cell.value.map((tipul, index) => <p>{tipul.type}</p>)} */}
                                {/* {cell.value.filter(function(item, pos) {return cell.value.indexOf(item.type) == pos;}).map((tipul, index) => <p>{tipul.type}</p>)} */}
                                {cell.value.filter((value, index, self) =>
                                  index === self.findIndex((t) => (
                                    t.type === value.type
                                  ))
                                ).map((tipul, index) => 
                                  tipul.type == 'tipul' ? <p>טיפול</p> :
                                  tipul.type == 'harig_tipul' ? <p>חריג טיפול</p> :
                                    tipul.type == 'takala_mizdamenet' ? <p>תקלה מזדמנת</p> :
                                      tipul.type == 'hh_stand' ? <p>עומד על ח"ח</p> : <p></p>
                                )}
                              </td> : <td style={{ width: `${100 / 23}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                          }
                        })
                      }
                      <td role="cell"> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><button className="btn-new-blue" value={row.original._id} onClick={Toggle}>עדכן</button></div></td>{/*row.original._id=cardata._id*/}
                      {props.unittype != 'notype' ? <td role="cell"> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><button className="btn-new-delete" value={row.original._id} onClick={ToggleDelete}>מחק</button></div></td>
                        : null}
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