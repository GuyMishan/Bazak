import React, { useMemo, useState, useEffect } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import people from "assets/img/people.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Button } from "reactstrap";
import SubUnitsRecentFeedsFilter from "../Filters/SubUnitsRecentFeedsFilter";

const SortingTable = (props) => {
    //data
  const [originaldata, setOriginaldata] = useState([])
  const [data, setData] = useState([])
  //filter
  const [filter, setFilter] = useState([])

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
    let response1 = await axios.get("http://localhost:8000/api/gdod")
    let temp_gdods2 = response1.data;
    let response2 = await axios.get("http://localhost:8000/api/hativa")
    let temp_hativas = response2.data;
    let response3 = await axios.get("http://localhost:8000/api/ogda")
    let temp_ogdas = response3.data;
    let response4 = await axios.get("http://localhost:8000/api/pikod")
    let temp_pikods = response4.data;

    let temp_gdods = temp_gdods2.filter((el) => {
      return temp_cardatas.some((f) => {
        return f.gdod === el._id;
      });
    });
    
    for (let i = 0; i < temp_gdods.length; i++) {
      let tempdata = { gdod: temp_gdods[i], cardatas: [], maxdate: new Date(1900, 10, 10), istakin: 'תקין' }
      if(tempdata.gdod.sadir && tempdata.gdod.sadir == 'לא סדיר'){
        tempdata.issadir='לא סדיר'
      }
      else{
        tempdata.issadir='סדיר'
      }
      for (let j = 0; j < temp_hativas.length; j++) {
        if (temp_hativas[j]._id == temp_gdods[i].hativa) {
          tempdata.hativa = temp_hativas[j];
          for (let k = 0; k < temp_ogdas.length; k++) {
            if(temp_ogdas[k]._id==temp_hativas[j].ogda)
            {
              tempdata.ogda=temp_ogdas[k];
              for (let l = 0; l < temp_pikods.length; l++) {    
                if(temp_pikods[l]._id==temp_ogdas[k].pikod)
                {
                  tempdata.pikod=temp_pikods[l];
                }
              }
            }
          }
        }
      }
      temp_data_arr.push(tempdata);
    }

    for (let j = 0; j < temp_data_arr.length; j++) {
      for (let k = 0; k < temp_cartypes.length; k++) {
        temp_data_arr[j].cardatas[k] = { [props.match.params.cartype]: temp_cartypes[k]};
      }
    }

    for (let i = 0; i < temp_cardatas.length; i++) {
      for (let j = 0; j < temp_data_arr.length; j++) {
        if (temp_cardatas[i].gdod == temp_data_arr[j].gdod._id) {
          for (let k = 0; k < temp_data_arr[j].cardatas.length; k++) {
            if (temp_cardatas[i][props.match.params.cartype] == temp_data_arr[j].cardatas[k][props.match.params.cartype]._id) {
              if (new Date(temp_cardatas[i].updatedAt) > temp_data_arr[j].maxdate) { temp_data_arr[j].maxdate = new Date(temp_cardatas[i].updatedAt); }
            }
          }
        }
      }
    }

    for (let i = 0; i < temp_data_arr.length; i++) {
      if(temp_data_arr[i].gdod.sadir && temp_data_arr[i].gdod.sadir=='לא סדיר'){
        let Date_1 = new Date().toLocaleDateString("hi-IN");
        let Date_1_copy = new Date();
        let Date_2 = new Date(Date_1_copy.getFullYear(), Date_1_copy.getMonth(), Date_1_copy.getDate() - 7).toLocaleDateString("hi-IN");
        let Date_to_check = temp_data_arr[i].maxdate.toLocaleDateString("hi-IN");
  
        let D_1 = Date_1.split("/");
        let D_2 = Date_2.split("/");
        let D_3 = Date_to_check.split("/");
  
        let d1 = new Date(D_1[2], parseInt(D_1[1]) - 1, D_1[0]);
        let d2 = new Date(D_2[2], parseInt(D_2[1]) - 1, D_2[0]);
        let d3 = new Date(D_3[2], parseInt(D_3[1]) - 1, D_3[0]);
  
        if (d3 <= d1 && d3 > d2) {
          temp_data_arr[i].istakin = 'תקין'
        } else {
          temp_data_arr[i].istakin = 'לא תקין'
        }
      }
      else{
        let Date_1 = new Date().toLocaleDateString("hi-IN");
        let Date_1_copy = new Date();
        let Date_2 = new Date(Date_1_copy.getFullYear(), Date_1_copy.getMonth(), Date_1_copy.getDate() - 1).toLocaleDateString("hi-IN");
        let Date_to_check = temp_data_arr[i].maxdate.toLocaleDateString("hi-IN");
  
        let D_1 = Date_1.split("/")
        let D_2 = Date_2.split("/")
        let D_3 = Date_to_check.split("/")
  
        let d1 = new Date(D_1[2], parseInt(D_1[1]) - 1, D_1[0]).toLocaleDateString("hi-IN");
        let d2 = new Date(D_2[2], parseInt(D_2[1]) - 1, D_2[0]).toLocaleDateString("hi-IN");
        let d3 = new Date(D_3[2], parseInt(D_3[1]) - 1, D_3[0]).toLocaleDateString("hi-IN");
  
        if (d3 == d1 || d3 == d2) {
          temp_data_arr[i].istakin = 'תקין'
        } else {
          temp_data_arr[i].istakin = 'לא תקין'
        }
      }
    }
    setOriginaldata(temp_data_arr)
    setData(temp_data_arr);
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

  const setfilterfunction = (evt) => {
    if (evt.currentTarget.name == 'takin') {
      if (filter.takinfilter) {
        let temptakinfilter = [...filter.takinfilter]
        const index = temptakinfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          temptakinfilter.splice(index, 1);
        }
        else {
          temptakinfilter.push(evt.currentTarget.value)
        }
        setFilter({ ...filter, takinfilter: temptakinfilter })
      }
      else {
        setFilter({ ...filter, takinfilter: [evt.currentTarget.value] })
      }
    }
    if (evt.currentTarget.name == 'sadir') {
      if (filter.sadirfilter) {
        let tempsadirfilter = [...filter.sadirfilter]
        const index = tempsadirfilter.indexOf(evt.currentTarget.value);
        if (index > -1) {
          tempsadirfilter.splice(index, 1);
        }
        else {
          tempsadirfilter.push(evt.currentTarget.value)
        }
        setFilter({ ...filter, sadirfilter: tempsadirfilter })
      }
      else {
        setFilter({ ...filter, sadirfilter: [evt.currentTarget.value] })
      }
    }
  }

  const applyfiltersontodata = () => {
    let tempdatabeforefilter = originaldata;

    let myArrayFiltered1 = []; //filter takinfilter
    if (filter.takinfilter && filter.takinfilter.length > 0) {
      myArrayFiltered1 = tempdatabeforefilter.filter((el) => {
        return filter.takinfilter.some((f) => {
          return f === el.istakin;
        });
      });
    }
    else {
      myArrayFiltered1 = tempdatabeforefilter;
    }

    let myArrayFiltered2 = []; //filter sadirfilter
    if (filter.sadirfilter && filter.sadirfilter.length > 0) {
      myArrayFiltered2 = myArrayFiltered1.filter((el) => {
        return filter.sadirfilter.some((f) => {
          return f === el.issadir;
        });
      });
    }
    else {
      myArrayFiltered2 = myArrayFiltered1;
    }

    let myArrayFiltered3 = []; //filter pikod
    if (filter.pikod && filter.pikod.length > 0) {
      myArrayFiltered3 = myArrayFiltered2.filter(item => filter.pikod.includes(item.pikod._id));
    }
    else {
      myArrayFiltered3 = myArrayFiltered2;
    }

    let myArrayFiltered4 = []; //filter ogda
    if (filter.ogda && filter.ogda.length > 0) {
      myArrayFiltered4 = myArrayFiltered3.filter(item => filter.ogda.includes(item.ogda._id));
    }
    else {
      myArrayFiltered4 = myArrayFiltered3;
    }

    let myArrayFiltered5 = []; //filter hativa
    if (filter.hativa && filter.hativa.length > 0) {
      myArrayFiltered5 = myArrayFiltered4.filter(item => filter.hativa.includes(item.hativa._id));
    }
    else {
      myArrayFiltered5 = myArrayFiltered4;
    }

    let myArrayFiltered6 = []; //filter gdod
    if (filter.gdod && filter.gdod.length > 0) {
      myArrayFiltered6 = myArrayFiltered5.filter(item => filter.gdod.includes(item.gdod._id));
    }
    else {
      myArrayFiltered6 = myArrayFiltered5;
    }
    setData(myArrayFiltered6)
  }

  function init() {
    CalculateDataArr()
  }

  useEffect(() => {
    applyfiltersontodata()
  }, [filter]);

  useEffect(() => {
    init();
  }, [props]);

  return (
    <>
      <SubUnitsRecentFeedsFilter originaldata={originaldata} filter={filter} setfilterfunction={setfilterfunction} unittype={props.unittype} unitid={props.unitid} /*handleChange2={handleChange2}*/ handleChange8={handleChange8} />
      <div style={{ float: 'right', paddingBottom: '5px' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - הזנות אחרונות"
          sheet="קובץ - הזנות אחרונות"
          buttonText="הורד כקובץ אקסל"
          style={{ float: 'right' }}
        />
      </div>
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls">
          <thead>
            <tr>
              <th>פיקוד</th>
              <th>אוגדה</th>
              <th>חטיבה</th>
              <th>גדוד</th>
              <th>סדיר/לא סדיר</th>
              <th>תאריך עדכון אחרון</th>
              <th>תקין/לא תקין</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => {
              return (
                data.istakin == 'תקין' ?
                  <tr className="greencell">
                    <td>{data.pikod ? data.pikod.name : ""}</td>
                    <td>{data.ogda ? data.ogda.name : ""}</td>
                    <td>{data.hativa ? data.hativa.name : ""}</td>
                    <td>{data.gdod ? data.gdod.name : ""}</td>
                    <td>{data.gdod && data.gdod.sadir && data.gdod.sadir=='לא סדיר' ? "לא סדיר" : "סדיר"}</td>
                    <td>{data.maxdate.toISOString().slice(0, 10).split("-").reverse().join("/")}</td>
                    <td>{data.istakin}</td>
                  </tr> :
                  <tr className="redcell">
                    <td>{data.pikod ? data.pikod.name : ""}</td>
                    <td>{data.ogda ? data.ogda.name : ""}</td>
                    <td>{data.hativa ? data.hativa.name : ""}</td>
                    <td>{data.gdod ? data.gdod.name : ""}</td>
                    <td>{data.gdod && data.gdod.sadir && data.gdod.sadir=='לא סדיר' ? "לא סדיר" : "סדיר"}</td>
                    <td>{data.maxdate.toISOString().slice(0, 10).split("-").reverse().join("/")}</td>
                    <td>{data.istakin}</td>
                  </tr>)
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;