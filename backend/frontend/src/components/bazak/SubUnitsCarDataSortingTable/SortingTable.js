import React, { useMemo, useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import people from "assets/img/people.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Button } from "reactstrap";

const SortingTable = (props) => {
  const [data, setData] = useState([])
  //cartypes
  const [cartypes, setCartypes] = useState([]);

  async function CalculateDataArr() {
    let temp_cardatas;
    let temp_cartypes;

    if (props.theme == 'white-content') {
      switch (props.match.params.cartype) {
        case 'magadal':
          temp_cardatas = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר')));
          let response1 = await axios.get("http://localhost:8000/api/magadal",)
          temp_cartypes = response1.data;
          break;
        case 'magad':
          temp_cardatas = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר') && (cardata.magadal == props.match.params.carid)));
          let response2 = await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${props.match.params.carid}`)
          temp_cartypes = response2.data;
          break;
        case 'mkabaz':
          temp_cardatas = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר') && (cardata.magad == props.match.params.carid)));
          let response3 = await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${props.match.params.carid}`)
          temp_cartypes = response3.data;
          break;
        default:
          temp_cardatas = props.cardatas.filter(cardata => ((cardata.stand == 'סדיר')));
          let response4 = await axios.get("http://localhost:8000/api/magadal",)
          temp_cartypes = response4.data;
          break;
      }
    }
    else {
      switch (props.match.params.cartype) {
        case 'magadal':
          temp_cardatas = props.cardatas;
          let response5 = await axios.get("http://localhost:8000/api/magadal",)
          temp_cartypes = response5.data;
          break;
        case 'magad':
          temp_cardatas = props.cardatas.filter(cardata => ((cardata.magadal == props.match.params.carid)));
          let response6 = await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${props.match.params.carid}`)
          temp_cartypes = response6.data;
          break;
        case 'mkabaz':
          temp_cardatas = props.cardatas.filter(cardata => ((cardata.magad == props.match.params.carid)));
          let response7 = await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${props.match.params.carid}`)
          temp_cartypes = response7.data;
          break;
        default:
          temp_cardatas = props.cardatas;
          let response8 = await axios.get("http://localhost:8000/api/magadal",)
          temp_cartypes = response8.data;
          break;
      }
    }

    let temp_data_arr = []
    if (props.unittype == 'admin') {
      let response1 = await axios.get(`http://localhost:8000/api/pikod`,)
      let temp_pikods = response1.data;
      for (let i = 0; i < temp_pikods.length; i++) {
        temp_data_arr.push({ pikod: temp_pikods[i], cardatas: [] });
      }
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_cartypes.length; k++) {
          temp_data_arr[j].cardatas[k] = { [props.match.params.cartype]: temp_cartypes[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }
      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].pikod == temp_data_arr[j].pikod._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i][props.match.params.cartype] == temp_data_arr[j].cardatas[k][props.match.params.cartype]._id) {
                temp_data_arr[j].cardatas[k].numberofcars = temp_data_arr[j].cardatas[k].numberofcars + 1;
                if (temp_cardatas[i].zminot == 'זמין') { temp_data_arr[j].cardatas[k].numberofcars_zamin = temp_data_arr[j].cardatas[k].numberofcars_zamin + 1; }
                if (temp_cardatas[i].kshirot == 'כשיר') { temp_data_arr[j].cardatas[k].numberofcars_kashir = temp_data_arr[j].cardatas[k].numberofcars_kashir + 1; }
              }
            }
          }
        }
      }
    }
    if (props.unittype == 'pikod') {
      let response1 = await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: props.unitid })
      let temp_ogdas = response1.data;
      for (let i = 0; i < temp_ogdas.length; i++) {
        temp_data_arr.push({ ogda: temp_ogdas[i], cardatas: [] });
      }
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_cartypes.length; k++) {
          temp_data_arr[j].cardatas[k] = { [props.match.params.cartype]: temp_cartypes[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }
      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].ogda == temp_data_arr[j].ogda._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i][props.match.params.cartype] == temp_data_arr[j].cardatas[k][props.match.params.cartype]._id) {
                temp_data_arr[j].cardatas[k].numberofcars = temp_data_arr[j].cardatas[k].numberofcars + 1;
                if (temp_cardatas[i].zminot == 'זמין') { temp_data_arr[j].cardatas[k].numberofcars_zamin = temp_data_arr[j].cardatas[k].numberofcars_zamin + 1; }
                if (temp_cardatas[i].kshirot == 'כשיר') { temp_data_arr[j].cardatas[k].numberofcars_kashir = temp_data_arr[j].cardatas[k].numberofcars_kashir + 1; }
              }
            }
          }
        }
      }
    }
    if (props.unittype == 'ogda') {
      let response1 = await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: props.unitid })
      let temp_hativas = response1.data;
      for (let i = 0; i < temp_hativas.length; i++) {
        temp_data_arr.push({ hativa: temp_hativas[i], cardatas: [] });
      }
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_cartypes.length; k++) {
          temp_data_arr[j].cardatas[k] = { [props.match.params.cartype]: temp_cartypes[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }

      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].hativa == temp_data_arr[j].hativa._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i][props.match.params.cartype] == temp_data_arr[j].cardatas[k][props.match.params.cartype]._id) {
                temp_data_arr[j].cardatas[k].numberofcars = temp_data_arr[j].cardatas[k].numberofcars + 1;
                if (temp_cardatas[i].zminot == 'זמין') { temp_data_arr[j].cardatas[k].numberofcars_zamin = temp_data_arr[j].cardatas[k].numberofcars_zamin + 1; }
                if (temp_cardatas[i].kshirot == 'כשיר') { temp_data_arr[j].cardatas[k].numberofcars_kashir = temp_data_arr[j].cardatas[k].numberofcars_kashir + 1; }
              }
            }
          }
        }
      }
    }
    if (props.unittype == 'hativa') {
      let response1 = await axios.post("http://localhost:8000/api/gdod/gdodsbyhativaid", { hativa: props.unitid })
      let temp_gdods = response1.data;
      for (let i = 0; i < temp_gdods.length; i++) {
        temp_data_arr.push({ gdod: temp_gdods[i], cardatas: [] ,maxdate : new Date(1900, 10, 10)});
      }
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_cartypes.length; k++) {
          temp_data_arr[j].cardatas[k] = { [props.match.params.cartype]: temp_cartypes[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }

      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].gdod == temp_data_arr[j].gdod._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i][props.match.params.cartype] == temp_data_arr[j].cardatas[k][props.match.params.cartype]._id) {
                temp_data_arr[j].cardatas[k].numberofcars = temp_data_arr[j].cardatas[k].numberofcars + 1;
                if (temp_cardatas[i].zminot == 'זמין') { temp_data_arr[j].cardatas[k].numberofcars_zamin = temp_data_arr[j].cardatas[k].numberofcars_zamin + 1; }
                if (temp_cardatas[i].kshirot == 'כשיר') { temp_data_arr[j].cardatas[k].numberofcars_kashir = temp_data_arr[j].cardatas[k].numberofcars_kashir + 1; }
                if (new Date(temp_cardatas[i].updatedAt) > temp_data_arr[j].maxdate) { temp_data_arr[j].maxdate = new Date(temp_cardatas[i].updatedAt); }
              }
            }
          }
        }
      }
    }
    // setCartypes(temp_cartypes);
    // setData(temp_data_arr);
    FixDataArr(temp_cartypes, temp_data_arr)
  }

  async function FixDataArr(temp_cartypes, temp_data_arr) {
    let temp_temp_cartypes = [...temp_cartypes];
    let temp_temp_data_arr = [...temp_data_arr];

    for (let i = 0; i < temp_cartypes.length; i++) {
      let is_cartype_needed = false;
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
          if (temp_data_arr[j].cardatas[k][props.match.params.cartype]._id == temp_cartypes[i]._id) {
            if (temp_data_arr[j].cardatas[k].numberofcars != 0) {
              is_cartype_needed = true;
            }
          }
        }
      }
      if (is_cartype_needed == false) {//delete stuff
        temp_temp_cartypes = temp_temp_cartypes.filter(function (obj) {
          return obj._id !== temp_cartypes[i]._id;
        });
        //more..
        for (let z = 0; z < temp_temp_data_arr.length; z++) {
          temp_temp_data_arr[z].cardatas = temp_temp_data_arr[z].cardatas.filter(function (obj) {
            return obj[props.match.params.cartype]._id !== temp_cartypes[i]._id;
          });
        }
      }
    }

    for (let i = temp_temp_data_arr.length-1; i >= 0; i--) {
      let is_unit_needed = false;
      for (let j = 0; j < temp_temp_data_arr[i].cardatas.length; j++) {
        if (temp_temp_data_arr[i].cardatas[j].numberofcars != 0) {
          is_unit_needed = true;
        }
      }
      if (is_unit_needed == false) {
        temp_temp_data_arr.splice(i, 1);
      }
    }

    setCartypes(temp_temp_cartypes);
    setData(temp_temp_data_arr);
  }

  function init() {
    CalculateDataArr()
  }

  useEffect(() => {
    init();
  }, [props]);

  return (
    <>
      <div style={{ float: 'right', paddingBottom: '5px' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - זמינות תת-יחידות"
          sheet="קובץ - זמינות תת-יחידות"
          buttonText="הורד כקובץ אקסל"
          style={{ float: 'right' }}
        />
      </div>
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls">
          <thead>
            <tr>
              <th> </th>
              {props.unittype == 'hativa' ? <th>תאריך עדכון אחרון</th>:null}
              {cartypes.map((cartype, index) => {
                return (props.match.params.cartype == 'magadal' ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/${props.match.params.unittype}/${props.match.params.unitid}/magad/${cartype._id}`}>{cartype.name}</Link></th>
                  : props.match.params.cartype == 'magad' ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/${props.match.params.unittype}/${props.match.params.unitid}/mkabaz/${cartype._id}`}>{cartype.name}</Link></th>
                    : <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}>{cartype.name}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => {
              return (<tr>
                {props.unittype == 'admin' && data.pikod ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/pikod/${data.pikod._id}/${props.match.params.cartype}/${props.match.params.carid}`}>{data.pikod.name}</Link></th>
                  : props.unittype == 'pikod' && data.ogda ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/ogda/${data.ogda._id}/${props.match.params.cartype}/${props.match.params.carid}`}>{data.ogda.name}</Link></th>
                    : props.unittype == 'ogda' && data.hativa ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/hativa/${data.hativa._id}/${props.match.params.cartype}/${props.match.params.carid}`}>{data.hativa.name}</Link></th>
                      : props.unittype == 'hativa' && data.gdod ? <><th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/zminotpage/gdod/${data.gdod._id}/false`}>{data.gdod.name}</Link></th> <td>{data.maxdate.toISOString().slice(0, 10).split("-").reverse().join("/")}</td></>
                        : <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}></th>}
                {props.theme == 'white-content' ?
                  data.cardatas ? data.cardatas.map(cardatas => {
                    return (<td style={{ width: `${100 / 3}%`, minWidth: '150px' }}>
                      {cardatas.numberofcars != 0 ?
                        ((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0) <= 60 ?
                          <p style={{ color: '#ff2128' }}>
                            {((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0)}%
                            <br></br>
                            {cardatas.numberofcars_zamin + '/' + cardatas.numberofcars}
                          </p> :
                          ((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0) <= 80 ?
                            <p style={{ color: '#ffca3a' }}>
                              {((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0)}%
                              <br></br>
                              {cardatas.numberofcars_zamin + '/' + cardatas.numberofcars}
                            </p> :
                            ((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0) <= 100 ?
                              <p style={{ color: '#8ac926' }}>
                                {((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0)}%
                                <br></br>
                                {cardatas.numberofcars_zamin + '/' + cardatas.numberofcars}
                              </p> : null
                        : <p>X</p>}
                    </td>)
                  }) : null
                  : data.cardatas ? data.cardatas.map(cardatas => {
                    return (<td style={{ width: `${100 / 3}%`, minWidth: '150px' }}>
                      {cardatas.numberofcars != 0 ?
                        ((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0) <= 60 ?
                          <p style={{ color: '#ff2128' }}>
                            {((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0)}%
                            <br></br>
                            {cardatas.numberofcars_kashir + '/' + cardatas.numberofcars}
                          </p> :
                          ((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0) <= 80 ?
                            <p style={{ color: '#ffca3a' }}>
                              {((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0)}%
                              <br></br>
                              {cardatas.numberofcars_kashir + '/' + cardatas.numberofcars}
                            </p> :
                            ((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0) <= 100 ?
                              <p style={{ color: '#8ac926' }}>
                                {((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0)}%
                                <br></br>
                                {cardatas.numberofcars_kashir + '/' + cardatas.numberofcars}
                              </p> : null
                        : <p>X</p>}
                    </td>)
                  }) : null}
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;