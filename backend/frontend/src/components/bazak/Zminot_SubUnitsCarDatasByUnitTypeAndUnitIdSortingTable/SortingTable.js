import React, { useMemo, useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import people from "assets/img/people.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Button } from "reactstrap";
import CarDataFormModal from "views/generalpages/zminotpage/CarDataFormModal";

const SortingTable = (props) => {
  const [data, setData] = useState([])
  //cartypes
  const [magadals, setMagadals] = useState([]);

  async function CalculateDataArr() {
    let response2 = await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${props.unittype}/${props.unitid}`)
    let temp_cardatas = response2.data;
    let response = await axios.get("http://localhost:8000/api/magadal",)
    let temp_magadals = response.data;
    setMagadals(temp_magadals)

    let temp_data_arr = []
    if (props.unittype == 'admin') {
      let response1 = await axios.get(`http://localhost:8000/api/pikod`,)
      let temp_pikods = response1.data;
      for (let i = 0; i < temp_pikods.length; i++) {
        temp_data_arr.push({ pikod: temp_pikods[i], cardatas: [] });
      }
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_magadals.length; k++) {
          temp_data_arr[j].cardatas[k] = { magadal: temp_magadals[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }
      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].pikod == temp_data_arr[j].pikod._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i].magadal == temp_data_arr[j].cardatas[k].magadal._id) {
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
        for (let k = 0; k < temp_magadals.length; k++) {
          temp_data_arr[j].cardatas[k] = { magadal: temp_magadals[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }
      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].ogda == temp_data_arr[j].ogda._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i].magadal == temp_data_arr[j].cardatas[k].magadal._id) {
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
        for (let k = 0; k < temp_magadals.length; k++) {
          temp_data_arr[j].cardatas[k] = { magadal: temp_magadals[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }

      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].hativa == temp_data_arr[j].hativa._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i].magadal == temp_data_arr[j].cardatas[k].magadal._id) {
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
        temp_data_arr.push({ gdod: temp_gdods[i], cardatas: [] });
      }
      for (let j = 0; j < temp_data_arr.length; j++) {
        for (let k = 0; k < temp_magadals.length; k++) {
          temp_data_arr[j].cardatas[k] = { magadal: temp_magadals[k], numberofcars: 0, numberofcars_zamin: 0, numberofcars_kashir: 0 };
        }
      }

      for (let i = 0; i < temp_cardatas.length; i++) {
        for (let j = 0; j < temp_data_arr.length; j++) {
          if (temp_cardatas[i].gdod == temp_data_arr[j].gdod._id) {
            for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
              if (temp_cardatas[i].magadal == temp_data_arr[j].cardatas[k].magadal._id) {
                temp_data_arr[j].cardatas[k].numberofcars = temp_data_arr[j].cardatas[k].numberofcars + 1;
                if (temp_cardatas[i].zminot == 'זמין') { temp_data_arr[j].cardatas[k].numberofcars_zamin = temp_data_arr[j].cardatas[k].numberofcars_zamin + 1; }
                if (temp_cardatas[i].kshirot == 'כשיר') { temp_data_arr[j].cardatas[k].numberofcars_kashir = temp_data_arr[j].cardatas[k].numberofcars_kashir + 1; }
              }
            }
          }
        }
      }
    }
    setData(temp_data_arr)
  }

  function init() {
    CalculateDataArr()
  }

  useEffect(() => {
    init();
  }, [props]);

  return (
    <>
      <div style={{ float: 'right',paddingBottom:'5px'}}>
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
              {magadals.map((magadal, index) => {
                return <th key={magadal._id}>{magadal.name}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => {
              return (<tr>
                {props.unittype == 'admin' && data.pikod ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/pikod/${data.pikod._id}`}>{data.pikod.name}</Link></th>
                  : props.unittype == 'pikod' && data.ogda ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/ogda/${data.ogda._id}`}>{data.ogda.name}</Link></th>
                    : props.unittype == 'ogda' && data.hativa ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/subunitspage/hativa/${data.hativa._id}`}>{data.hativa.name}</Link></th>
                      : props.unittype == 'hativa' && data.gdod ? <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/zminotpage/gdod/${data.gdod._id}`}>{data.gdod.name}</Link></th>
                        : <th style={{ width: `${100 / 3}%`, minWidth: '150px' }}></th>}
                {data.cardatas ? data.cardatas.map(cardatas => {
                  return (<td style={{ width: `${100 / 3}%`, minWidth: '150px' }}>
                    {cardatas.numberofcars != 0 ?
                      ((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0) <= 60 ?
                        <p style={{ color: '#ff2128' }}>
                          {((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0)}%
                          <br></br>
                          {cardatas.numberofcars_zamin + '/' + cardatas.numberofcars}
                          {/* {((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0)}% כשירות */}
                        </p> :
                        ((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0) <= 80 ?
                          <p style={{ color: '#ffca3a' }}>
                            {((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0)}%
                            <br></br>
                            {cardatas.numberofcars_zamin + '/' + cardatas.numberofcars}
                            {/* {((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0)}% כשירות */}
                          </p> :
                          ((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0) <= 100 ?
                            <p style={{ color: '#8ac926' }}>
                              {((cardatas.numberofcars_zamin / cardatas.numberofcars) * 100).toFixed(0)}%
                              <br></br>
                              {cardatas.numberofcars_zamin + '/' + cardatas.numberofcars}
                              {/* {((cardatas.numberofcars_kashir / cardatas.numberofcars) * 100).toFixed(0)}% כשירות */}
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