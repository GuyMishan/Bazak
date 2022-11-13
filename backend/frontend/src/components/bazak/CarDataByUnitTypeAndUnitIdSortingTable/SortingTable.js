import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import { signin, authenticate, isAuthenticated } from 'auth/index';
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  Row,
  Col,
} from "reactstrap";
import CarDataFormModal from "views/generalpages/zminotpage/CarDataFormModal";
import CarDataFormModalDelete from "views/generalpages/zminotpage/CarDataFormModalDelete";
import CarDataFilter from 'components/bazak/Filters/CarDataFilter';
import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getCarDataFunc, findcardatabyidandupdateFunc, findcardatabyidanddeleteFunc } from 'redux/features/cardata/cardataSlice'
import SumCardataComponent from "../SumCardataComponent/SumCardataComponent";

const SortingTable = (props) => {
  //user
  const { user } = isAuthenticated()
  //table
  const columns = useMemo(() => COLUMNS, []);
  //data
  const [data, setData] = useState([])
  const [originaldata, setOriginaldata] = useState([])
  //filter
  const [filter, setFilter] = useState([])
  //cardata form modal
  const [iscardataformopen, setIscardataformopen] = useState(false);
  const [cardataidformodal, setCardataidformodal] = useState(undefined);
  //cardata form modal delete
  const [iscardataformdeleteopen, setIscardataformdeleteopen] = useState(false);
  const [cardataidfordeletemodal, setCardataidfordeletemodal] = useState(undefined);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //excel download
  const XLSX = require('xlsx')
  //redux
  const dispatch = useDispatch()
  const reduxcardata = useSelector((state) => state.cardata.value)

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
    updatechangedcardatadelete(); // update table..
  }

  async function updatechangedcardata() {
    if (cardataidformodal != undefined) {
      if (props.unittype != 'notype') {
        //update table row
        let response = await axios.get(`http://localhost:8000/api/cardata/${cardataidformodal}`)
        let tempcardata = response.data[0];

        let tempdata = [...data];
        let temporiginaldata = [...originaldata];


        if (props.ismushbat == 'true') {
          if (tempcardata.status == 'מושבת') {
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
          }
          else {
            let tempdeleteindex = 999;
            let tempdeleteindexoriginal = 999;

            for (let i = 0; i < tempdata.length; i++) {
              if (cardataidformodal == tempdata[i]._id) {
                tempdeleteindex = i;
              }
            }

            for (let i = 0; i < temporiginaldata.length; i++) {
              if (cardataidformodal == temporiginaldata[i]._id) {
                tempdeleteindexoriginal = i;
              }
            }

            tempdata.splice(tempdeleteindex, 1);
            temporiginaldata.splice(tempdeleteindexoriginal, 1);
          }
        }
        else {
          if (tempcardata.status == 'מושבת') {
            let tempdeleteindex = 999;
            let tempdeleteindexoriginal = 999;

            for (let i = 0; i < tempdata.length; i++) {
              if (cardataidformodal == tempdata[i]._id) {
                tempdeleteindex = i;
              }
            }

            for (let i = 0; i < temporiginaldata.length; i++) {
              if (cardataidformodal == temporiginaldata[i]._id) {
                tempdeleteindexoriginal = i;
              }
            }

            tempdata.splice(tempdeleteindex, 1);
            temporiginaldata.splice(tempdeleteindexoriginal, 1);
          }
          else {
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
          }
        }

        setOriginaldata(temporiginaldata)
        setData(tempdata)
        dispatch(findcardatabyidandupdateFunc(tempcardata))
      }
      else {
        //delete from table but add to redux
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
            tempdeleteindexoriginal = i;
          }
        }

        tempdata.splice(tempdeleteindex, 1);
        temporiginaldata.splice(tempdeleteindexoriginal, 1);

        setOriginaldata(temporiginaldata)
        setData(tempdata)
        dispatch(getCarDataFunc(user))
      }
    }
    else {//add to table
      setIsdataloaded(false);
      dispatch(getCarDataFunc(user))
    }
  }

  async function updatechangedcardatadelete() {
    //delete from table
    let tempdata = [...data];
    let temporiginaldata = [...originaldata];

    let tempdeleteindex = 999;
    let tempdeleteindexoriginal = 999;

    for (let i = 0; i < tempdata.length; i++) {
      if (cardataidfordeletemodal == tempdata[i]._id) {
        tempdeleteindex = i;
      }
    }

    for (let i = 0; i < temporiginaldata.length; i++) {
      if (cardataidfordeletemodal == temporiginaldata[i]._id) {
        tempdeleteindexoriginal = i;
      }
    }

    tempdata.splice(tempdeleteindex, 1);
    temporiginaldata.splice(tempdeleteindexoriginal, 1);

    setOriginaldata(temporiginaldata)
    setData(tempdata)
    dispatch(findcardatabyidanddeleteFunc(cardataidfordeletemodal))
  }

  function init() {
    setIsdataloaded(false);
    getCardDataByUnitTypeAndUnitId();
    fixfilterbyurl();
    ReadLocalStorage();
  }

  const getReduxCardDataByUnitTypeAndUnitId = async () => {
    if (reduxcardata.length == 0) {
      await dispatch(getCarDataFunc(user));
    }
  }

  const getCardDataByUnitTypeAndUnitId = async () => {
    if (props.unittype != 'notype') {
      let myArrayFiltered1 = []; //filter cartype

      switch (props.match.params.cartype) {
        case 'magadal':
          myArrayFiltered1 = reduxcardata;
          break;
        case 'magad':
          myArrayFiltered1 = reduxcardata.filter((el) => {
            return props.match.params.carid === el.magadal;
          });
          break;
        case 'mkabaz':
          myArrayFiltered1 = reduxcardata.filter((el) => {
            return props.match.params.carid === el.magad;
          });
          break;
      }

      let myArrayFiltered2 = []; //filter cartype

      switch (props.match.params.unittype) {
        case 'admin':
          myArrayFiltered2 = myArrayFiltered1;
          break;
        case 'pikod':
          myArrayFiltered2 = myArrayFiltered1.filter((el) => {
            return props.match.params.unitid === el.pikod;
          });
          break;
        case 'ogda':
          myArrayFiltered2 = myArrayFiltered1.filter((el) => {
            return props.match.params.unitid === el.ogda;
          });
          break;
        case 'hativa':
          myArrayFiltered2 = myArrayFiltered1.filter((el) => {
            return props.match.params.unitid === el.hativa;
          });
          break;
        case 'gdod':
          myArrayFiltered2 = myArrayFiltered1.filter((el) => {
            return props.match.params.unitid === el.gdod;
          });
          break;
      }

      let myArrayFiltered3 = []; //filter ismushbat

      if (props.ismushbat == "false") {
        myArrayFiltered3 = myArrayFiltered2.filter((el) => {
          return 'מושבת' != el.status;
        });
      }
      else {
        myArrayFiltered3 = myArrayFiltered2.filter((el) => {
          return 'מושבת' === el.status;
        });
      }

      let myArrayFiltered4 = []; //filter isstopped

      if (props.isstopped == "false") {
        myArrayFiltered4 = myArrayFiltered3;
      }
      else {
        myArrayFiltered4 = myArrayFiltered3.filter((el) => {
          return 'עצור' === el.status;
        });
      }

      setOriginaldata(myArrayFiltered4)
      setData(myArrayFiltered4)
      setIsdataloaded(true)
    }
    else { //read from db only for nounit cardatas..
      await axios.get(`http://localhost:8000/api/cardatanotype`)
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

  const fixfilterbyurl = async () => {
    let tempfilter = {};
    if (props.unittype == 'admin') {
      // nothing
    }
    if (props.unittype == 'pikod') {
      tempfilter.pikod = [props.unitid]
    }
    else if (props.unittype == 'ogda') {
      tempfilter.ogda = [props.unitid]
      let response = await axios.get(`http://localhost:8000/api/ogda/${props.unitid}`,)
      tempfilter.pikod = [response.data.pikod]
    }
    else if (props.unittype == 'hativa') {
      tempfilter.hativa = [props.unitid]
      let response1 = await axios.get(`http://localhost:8000/api/hativa/${props.unitid}`,)
      tempfilter.ogda = [response1.data.ogda]
      let response = await axios.get(`http://localhost:8000/api/ogda/${tempfilter.ogda}`,)
      tempfilter.pikod = [response.data.pikod]
    }
    else if (props.unittype == 'gdod') {
      tempfilter.gdod = [props.unitid]
      let response2 = await axios.get(`http://localhost:8000/api/gdod/${props.unitid}`,)
      tempfilter.hativa = [response2.data.hativa]
      let response1 = await axios.get(`http://localhost:8000/api/hativa/${tempfilter.hativa}`,)
      tempfilter.ogda = [response1.data.ogda]
      let response = await axios.get(`http://localhost:8000/api/ogda/${tempfilter.ogda}`,)
      tempfilter.pikod = [response.data.pikod]
    }
    //
    if (props.cartype == 'magadal') {
      // nothing
    }
    else if (props.cartype == 'magad') {
      tempfilter.magadal = [props.carid]
    }
    else if (props.cartype == 'mkabaz') {
      tempfilter.magad = [props.carid]
      let response1 = await axios.get(`http://localhost:8000/api/magad/${props.carid}`,)
      tempfilter.magadal = [response1.data[0].magadal]
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
    if (filter.pikod && filter.pikod.length > 0) {
      myArrayFiltered3 = myArrayFiltered2.filter(item => filter.pikod.includes(item.pikod));
    }
    else {
      myArrayFiltered3 = myArrayFiltered2;
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

    let myArrayFiltered7 = []; //filter magadal
    if (filter.magadal && filter.magadal.length > 0) {
      myArrayFiltered7 = myArrayFiltered6.filter(item => filter.magadal.includes(item.magadal));
    }
    else {
      myArrayFiltered7 = myArrayFiltered6;
    }

    let myArrayFiltered8 = []; //filter magad
    if (filter.magad && filter.magad.length > 0) {
      myArrayFiltered8 = myArrayFiltered7.filter(item => filter.magad.includes(item.magad));
    }
    else {
      myArrayFiltered8 = myArrayFiltered7;
    }

    let myArrayFiltered9 = []; //filter mkabaz
    if (filter.mkabaz && filter.mkabaz.length > 0) {
      myArrayFiltered9 = myArrayFiltered8.filter(item => filter.mkabaz.includes(item.mkabaz));
    }
    else {
      myArrayFiltered9 = myArrayFiltered8;
    }

    let myArrayFiltered10 = []; //filter makat
    if (filter.makat && filter.makat.length > 0) {
      myArrayFiltered10 = myArrayFiltered9.filter(item => filter.makat.includes(item.makat));
    }
    else {
      myArrayFiltered10 = myArrayFiltered9;
    }
    setData(myArrayFiltered10)
  }

  function ReadLocalStorage() {
    if (localStorage.getItem('zminot_page_hidden_columns')) {
    } else {
      localStorage.setItem('zminot_page_hidden_columns', JSON.stringify([]));
    }
  }

  function FixLocalStorageHeaders() {
    localStorage.setItem('zminot_page_hidden_columns', JSON.stringify(hiddenColumns));
  }

  function FixDataAndExportToExcel() {
    let tempdata_to_excel = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].tipuls.length != 0) {
        for (let j = 0; j < data[i].tipuls.length; j++) {
          let tempcardata = { ...data[i] };
          if (tempcardata.tipuls[j].type == 'tipul') {
            tempcardata.tipul = tempcardata.tipuls[j].tipul;
            tempcardata.tipul_entry_date = tempcardata.tipuls[j].tipul_entry_date ? tempcardata.tipuls[j].tipul_entry_date.split("-").reverse().join("-") : null;
            tempcardata.mikum_tipul = tempcardata.tipuls[j].mikum_tipul;
          }
          else if (tempcardata.tipuls[j].type == 'harig_tipul') {
            tempcardata.harig_tipul = tempcardata.tipuls[j].harig_tipul;
            tempcardata.harig_tipul_date = tempcardata.tipuls[j].harig_tipul_date ? tempcardata.tipuls[j].harig_tipul_date.split("-").reverse().join("-") : null;
          }
          else if (tempcardata.tipuls[j].type == 'takala_mizdamenet') {
            tempcardata.takala_mizdamenet = tempcardata.tipuls[j].takala_mizdamenet;
            tempcardata.takala_mizdamenet_date = tempcardata.tipuls[j].takala_mizdamenet_date;
          }
          else if (tempcardata.tipuls[j].type == 'hh_stand') {
            tempcardata.missing_makat_1 = tempcardata.tipuls[j].missing_makat_1;
            tempcardata.missing_makat_2 = tempcardata.tipuls[j].missing_makat_2;
          }
          tempdata_to_excel.push(tempcardata)
        }
      }
      else {
        tempdata_to_excel.push({ ...data[i] })
      }
    }

    for (let i = 0; i < tempdata_to_excel.length; i++) {
      tempdata_to_excel[i].pikod_data ? tempdata_to_excel[i].pikod_name = tempdata_to_excel[i].pikod_data[0].name : tempdata_to_excel[i].pikod_name = " ";
      tempdata_to_excel[i].ogda_data ? tempdata_to_excel[i].ogda_name = tempdata_to_excel[i].ogda_data[0].name : tempdata_to_excel[i].ogda_name = " ";
      tempdata_to_excel[i].hativa_data ? tempdata_to_excel[i].hativa_name = tempdata_to_excel[i].hativa_data[0].name : tempdata_to_excel[i].hativa_name = " ";
      tempdata_to_excel[i].gdod_data ? tempdata_to_excel[i].gdod_name = tempdata_to_excel[i].gdod_data.name : tempdata_to_excel[i].gdod_name = " ";

      tempdata_to_excel[i].magadal_data ? tempdata_to_excel[i].magadal_name = tempdata_to_excel[i].magadal_data[0].name : tempdata_to_excel[i].magadal_name = " ";
      tempdata_to_excel[i].magad_data ? tempdata_to_excel[i].magad_name = tempdata_to_excel[i].magad_data[0].name : tempdata_to_excel[i].magad_name = " ";
      tempdata_to_excel[i].mkabaz_data ? tempdata_to_excel[i].mkabaz_name = tempdata_to_excel[i].mkabaz_data[0].name : tempdata_to_excel[i].mkabaz_name = " ";
      tempdata_to_excel[i].makat_data ? tempdata_to_excel[i].makat_name = tempdata_to_excel[i].makat_data._id : tempdata_to_excel[i].makat_name = " ";
      tempdata_to_excel[i].makat_data ? tempdata_to_excel[i].makat_description_name = tempdata_to_excel[i].makat_data.name : tempdata_to_excel[i].makat_description_name = " ";

      tempdata_to_excel[i].latest_recalibration_date = tempdata_to_excel[i].latest_recalibration_date ? tempdata_to_excel[i].latest_recalibration_date.slice(0, 10).split("-").reverse().join("-") : null;
      tempdata_to_excel[i].expected_repair = tempdata_to_excel[i].expected_repair ? tempdata_to_excel[i].expected_repair.slice(0, 10).split("-").reverse().join("-") : null;
    }

    //export to excel -fix 
    for (let i = 0; i < tempdata_to_excel.length; i++) {
      //delete unwanted fields
      delete tempdata_to_excel[i]._id;
      delete tempdata_to_excel[i].magadal;
      delete tempdata_to_excel[i].magad;
      delete tempdata_to_excel[i].mkabaz;
      delete tempdata_to_excel[i].makat;
      delete tempdata_to_excel[i].makat_description;
      delete tempdata_to_excel[i].pikod;
      delete tempdata_to_excel[i].ogda;
      delete tempdata_to_excel[i].hativa;
      delete tempdata_to_excel[i].gdod;
      delete tempdata_to_excel[i].tipuls;
      delete tempdata_to_excel[i].__v;
      delete tempdata_to_excel[i].createdAt;
      delete tempdata_to_excel[i].updatedAt;

      //add non-existing fields - 31
      if (!tempdata_to_excel[i].carnumber) { tempdata_to_excel[i].carnumber = " " }
      if (!tempdata_to_excel[i].expected_repair) { tempdata_to_excel[i].expected_repair = " " }
      if (!tempdata_to_excel[i].family) { tempdata_to_excel[i].family = " " }
      if (!tempdata_to_excel[i].gdod_name) { tempdata_to_excel[i].gdod_name = " " }
      if (!tempdata_to_excel[i].hativa_name) { tempdata_to_excel[i].hativa_name = " " }
      if (!tempdata_to_excel[i].kshirot) { tempdata_to_excel[i].kshirot = " " }
      if (!tempdata_to_excel[i].latest_recalibration_date) { tempdata_to_excel[i].latest_recalibration_date = " " }
      if (!tempdata_to_excel[i].magad_name) { tempdata_to_excel[i].magad_name = " " }
      if (!tempdata_to_excel[i].magadal_name) { tempdata_to_excel[i].magadal_name = " " }
      if (!tempdata_to_excel[i].makat_description_name) { tempdata_to_excel[i].makat_description_name = " " }
      if (!tempdata_to_excel[i].makat_name) { tempdata_to_excel[i].makat_name = " " }
      if (!tempdata_to_excel[i].mikum) { tempdata_to_excel[i].mikum = " " }
      if (!tempdata_to_excel[i].mikum_bimh) { tempdata_to_excel[i].mikum_bimh = " " }
      if (!tempdata_to_excel[i].mkabaz_name) { tempdata_to_excel[i].mkabaz_name = " " }
      if (!tempdata_to_excel[i].ogda_name) { tempdata_to_excel[i].ogda_name = " " }
      if (!tempdata_to_excel[i].pikod_name) { tempdata_to_excel[i].pikod_name = " " }
      if (!tempdata_to_excel[i].pluga) { tempdata_to_excel[i].pluga = " " }
      if (!tempdata_to_excel[i].shabzak) { tempdata_to_excel[i].shabzak = " " }
      if (!tempdata_to_excel[i].stand) { tempdata_to_excel[i].stand = " " }
      if (!tempdata_to_excel[i].status) { tempdata_to_excel[i].status = " " }
      if (!tempdata_to_excel[i].takala_info) { tempdata_to_excel[i].takala_info = " " }
      if (!tempdata_to_excel[i].zminot) { tempdata_to_excel[i].zminot = " " } //22
      //
      if (!tempdata_to_excel[i].tipul) { tempdata_to_excel[i].tipul = " " }
      if (!tempdata_to_excel[i].tipul_entry_date) { tempdata_to_excel[i].tipul_entry_date = " " }
      if (!tempdata_to_excel[i].mikum_tipul) { tempdata_to_excel[i].mikum_tipul = " " }
      if (!tempdata_to_excel[i].harig_tipul) { tempdata_to_excel[i].harig_tipul = " " }
      if (!tempdata_to_excel[i].harig_tipul_date) { tempdata_to_excel[i].harig_tipul_date = " " }
      if (!tempdata_to_excel[i].takala_mizdamenet) { tempdata_to_excel[i].takala_mizdamenet = " " }
      if (!tempdata_to_excel[i].takala_mizdamenet_date) { tempdata_to_excel[i].takala_mizdamenet_date = " " }
      if (!tempdata_to_excel[i].missing_makat_1) { tempdata_to_excel[i].missing_makat_1 = " " }
      if (!tempdata_to_excel[i].missing_makat_2) { tempdata_to_excel[i].missing_makat_2 = " " }
    }
    console.log(tempdata_to_excel)

    let EXCEL_EXTENSION = '.xlsx';
    let worksheet = XLSX.WorkSheet;
    let sheetName = 'גזירה';

    const headers = {
      carnumber: "צ'", magadal_name: 'מאגד על', magad_name: 'מאגד', mkabaz_name: 'מקבץ', makat_name: 'מק"ט', makat_description_name: 'תיאור מק"ט', family: 'משפחה', pikod_name: 'פיקוד', ogda_name: 'אוגדה', hativa_name: 'חטיבה', gdod_name: 'גדוד', pluga: 'פלוגה', shabzak: 'שבצ"ק', mikum_bimh: 'מיקום בימ"ח', stand: 'מעמד', status: 'סטאטוס', zminot: 'זמינות', kshirot: 'כשירות', mikum: 'מיקום', latest_recalibration_date: 'מועד כיול אחרון'
      , takala_info: 'מידע תקלה', expected_repair: 'צפי תיקון', tipul: 'טיפול', tipul_entry_date: 'תאריך כניסה לטיפול', mikum_tipul: 'מיקום טיפול', harig_tipul: 'חריג טיפול', harig_tipul_date: 'תאריך חריגת טיפול', takala_mizdamenet: 'תקלה מזדמנת', takala_mizdamenet_date: 'תאריך תקלה מזדמנת', missing_makat_1: 'מק"ט חסר', missing_makat_2: 'כמות'
    };
    tempdata_to_excel.unshift(headers); // if custom header, then make sure first row of data is custom header 

    worksheet = XLSX.utils.json_to_sheet(tempdata_to_excel, { skipHeader: true });

    const workbook = XLSX.utils.book_new();
    const fileName = 'גזירה' + EXCEL_EXTENSION;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);

    window.location.reload();
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
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
    setGlobalFilter,
  } = useTable({
    columns, data, initialState: { pageIndex: 0, hiddenColumns: localStorage.getItem('zminot_page_hidden_columns') ? JSON.parse(localStorage.getItem('zminot_page_hidden_columns')) : [] },
  },
    useGlobalFilter, useFilters, useSortBy, usePagination);

  useEffect(() => {
    applyfiltersontodata()
  }, [filter]);

  useEffect(() => {
    if (reduxcardata.length > 0) {
      init();
    }
  }, [props.unittype, props.unitid, props.ismushbat, props.isstopped, props.match]);

  useEffect(() => {
    if (reduxcardata.length > 0 && isdataloaded == false) {
      init();
    }
  }, [reduxcardata]);

  useEffect(() => {
    getReduxCardDataByUnitTypeAndUnitId();
    setPageSize(20);
  }, [])

  useEffect(() => {
    FixLocalStorageHeaders();
  }, [hiddenColumns]);

  //window
  const [windowSize, setWindowSize] = useState(getWindowSize());

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    !isdataloaded ?
      <div style={{ width: '50%', marginTop: '30%' }}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
      <>
        {/*modals */}
        <CarDataFormModal isOpen={iscardataformopen} cardataid={cardataidformodal} Toggle={Toggle} ToggleForModal={ToggleForModal} unittype={props.unittype} unitid={props.unitid} />
        <CarDataFormModalDelete isOpen={iscardataformdeleteopen} cardataid={cardataidfordeletemodal} Toggle={ToggleDelete} ToggleForModal={ToggleForModalDelete} unittype={props.unittype} unitid={props.unitid} />

        <div className="table-responsive" style={{ overflow: 'auto', height: (windowSize.innerHeight) * 0.9 }}>
          {/*filter */}
          <CarDataFilter originaldata={originaldata} filter={filter} setfilterfunction={setfilterfunction} unittype={props.unittype} unitid={props.unitid} cartype={props.cartype} carid={props.carid}/*handleChange2={handleChange2}*/ allColumns={allColumns} handleChange8={handleChange8} />

          <div style={{ float: 'right', paddingBottom: '5px' }}>
            <button className="btn-new-blue" onClick={FixDataAndExportToExcel}>הורד כקובץ אקסל</button>
          </div>
          <button className="btn-new-blue" value={undefined} onClick={Toggle} style={{ float: 'right', marginRight: '10px' }}>הוסף צ'</button>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

          <Row>
            <Col xs={12} md={6} style={{ textAlign: 'right', left: '20rem', marginTop: '1rem' }}>
              <LatestUpdateDateComponent cardatas={data} isdataloaded={isdataloaded} />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} style={{ textAlign: 'right', right: '1rem' }}>
              <SumCardataComponent cardatas={data} isdataloaded={isdataloaded} />
            </Col>
          </Row>

          <table {...getTableProps()} id="table-to-xls">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th style={{ position: 'sticky', top: '-2px' }}>
                      <div {...column.getHeaderProps(column.getSortByToggleProps())}> {column.render('Header')} </div>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                      <div>
                        {column.isSorted ? (column.isSortedDesc ? '🔽' : '⬆️') : ''}
                      </div>
                    </th>
                  ))}
                  <th style={{ position: 'sticky', top: '-2px' }}></th>
                  {props.unittype != 'notype' ? <th style={{ position: 'sticky', top: '-2px' }}></th>
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
                            return <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          }
                          else {
                            if (cell.column.id == "updatedAt") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '150px', maxWidth: '150px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value.slice(0, 10).split("-").reverse().join("-")}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "latest_recalibration_date") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '150px', maxWidth: '150px', overflow: 'auto' }} {...cell.getCellProps()}>{cell.value.slice(0, 10).split("-").reverse().join("-")}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "pikod") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.pikod_data ? row.original.pikod_data[0].name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "ogda") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.ogda_data ? row.original.ogda_data[0].name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "hativa") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.hativa_data ? row.original.hativa_data[0].name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "gdod") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.gdod_data ? row.original.gdod_data.name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "magadal") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.magadal_data ? row.original.magadal_data[0].name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "magad") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.magad_data ? row.original.magad_data[0].name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "mkabaz") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.mkabaz_data ? row.original.mkabaz_data[0].name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "makat") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.makat_data ? row.original.makat_data._id : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "makat_description") {
                              return row.original.makat ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>{row.original.makat_data ? row.original.makat_data.name : null}</td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
                            }
                            if (cell.column.id == "tipuls") {
                              return cell.value ? <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}>
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
                              </td> : <td style={{ width: `${100 / (23 - hiddenColumns)}%`, minWidth: '50px', maxWidth: '100px', overflow: 'auto' }} {...cell.getCellProps()}></td>
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