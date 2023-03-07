import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
import TreeMenu from 'react-simple-tree-menu';
import '../../../../node_modules/react-simple-tree-menu/dist/main.css';
import 'components/TreeCss.css'

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Container,
} from "reactstrap";
import axios from 'axios';
import PropagateLoader from "react-spinners/PropagateLoader";
import history from '../../../history'

function UnitTreePage({ match }) {
    //treedata
    const [treedata, setTreeData] = useState([]);
    //spinner
    const [isdataloaded, setIsdataloaded] = useState(false);


    async function loadAdminData() {
        let response1 = await axios.get("http://localhost:8000/api/pikod",)
        let pikodarr = response1.data;
        let response2 = await axios.get("http://localhost:8000/api/ogda",)
        let ogdasarr = response2.data;
        let response3 = await axios.get("http://localhost:8000/api/hativa",)
        let hativasarr = response3.data;
        let response4 = await axios.get("http://localhost:8000/api/gdod",)
        let gdodsarr = response4.data;
        AdmintipulsToTreeData(pikodarr, ogdasarr, hativasarr, gdodsarr);
    }

    async function loadPikodData() {
        let ogdasarr = [];
        let response2 = await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: match.params.unitid })
        for (let j = 0; j < response2.data.length; j++) {
            ogdasarr.push(response2.data[j])
        }
        let response3 = await axios.get("http://localhost:8000/api/hativa",)
        let hativasarr = response3.data;
        let response4 = await axios.get("http://localhost:8000/api/gdod",)
        let gdodsarr = response4.data;
        PikodtipulsToTreeData(ogdasarr, hativasarr, gdodsarr);
    }

    async function loadOgdaData() {
        let hativasarr = [];
        let response2 = await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: match.params.unitid })
        for (let j = 0; j < response2.data.length; j++) {
            hativasarr.push(response2.data[j])
        }
        let response4 = await axios.get("http://localhost:8000/api/gdod",)
        let gdodsarr = response4.data;
        OgdatipulsToTreeData(hativasarr, gdodsarr);
    }

    async function loadHativaData() {
        let gdodsarr = [];
        let response2 = await axios.post("http://localhost:8000/api/gdod/gdodsbyhativaid", { hativa: match.params.unitid })
        for (let j = 0; j < response2.data.length; j++) {
            gdodsarr.push(response2.data[j])
        }
        HativatipulsToTreeData(gdodsarr);
    }

    const AdmintipulsToTreeData = (pikodarr, ogdasarr, hativasarr, gdodsarr) => {
        var finalarr = [];
        for (var i = 0; i < pikodarr.length; i++) {
            var pikodnodes = []
            for (var j = 0; j < ogdasarr.length; j++) {
                var ogdasnodes = []
                if (ogdasarr[j].pikod == pikodarr[i]._id) {
                    for (var k = 0; k < hativasarr.length; k++) {
                        var hativasnodes = []
                        if (hativasarr[k].ogda == ogdasarr[j]._id) {
                            for (var l = 0; l < gdodsarr.length; l++) {
                                if (gdodsarr[l].hativa == hativasarr[k]._id) {
                                    var tempgdodobj = {
                                        gdodskshirotid: gdodsarr[l].kshirot,
                                        type: "gdod",
                                        key: gdodsarr[l]._id,
                                        label: gdodsarr[l].name,
                                        nodes: [],
                                    }
                                    hativasnodes.push(tempgdodobj)
                                }
                            }
                            var temphativaobj = {
                                type: "hativa",
                                key: hativasarr[k]._id,
                                label: hativasarr[k].name,
                                nodes: hativasnodes,
                            }
                            ogdasnodes.push(temphativaobj)
                        }
                    }
                    var tempogdaobj = {
                        type: "ogda",
                        key: ogdasarr[j]._id,
                        label: ogdasarr[j].name,
                        nodes: ogdasnodes,
                    }
                    pikodnodes.push(tempogdaobj)
                }
            }
            var temppikodobj = {
                type: "pikod",
                key: pikodarr[i]._id,
                label: pikodarr[i].name,
                nodes: pikodnodes,
            }
            finalarr.push(temppikodobj);
        }
        setTreeData(finalarr);
        setIsdataloaded(true);
    }

    const PikodtipulsToTreeData = (ogdasarr, hativasarr, gdodsarr) => {
        var finalarr = [];
        for (var j = 0; j < ogdasarr.length; j++) {
            var ogdasnodes = []
            for (var k = 0; k < hativasarr.length; k++) {
                var hativasnodes = []
                if (hativasarr[k].ogda == ogdasarr[j]._id) {
                    for (var l = 0; l < gdodsarr.length; l++) {
                        if (gdodsarr[l].hativa == hativasarr[k]._id) {
                            var tempgdodobj = {
                                gdodskshirotid: gdodsarr[l].kshirot,
                                type: "gdod",
                                key: gdodsarr[l]._id,
                                label: gdodsarr[l].name,
                                nodes: [],
                            }
                            hativasnodes.push(tempgdodobj)
                        }
                    }
                    var temphativaobj = {
                        type: "hativa",
                        key: hativasarr[k]._id,
                        label: hativasarr[k].name,
                        nodes: hativasnodes,
                    }
                    ogdasnodes.push(temphativaobj)
                }
            }
            var tempogdaobj = {
                type: "ogda",
                key: ogdasarr[j]._id,
                label: ogdasarr[j].name,
                nodes: ogdasnodes,
            }
            finalarr.push(tempogdaobj);
        }
        setTreeData(finalarr);
        setIsdataloaded(true);
    }

    const OgdatipulsToTreeData = (hativasarr, gdodsarr) => {
        var finalarr = [];
        for (var k = 0; k < hativasarr.length; k++) {
            var hativasnodes = []
            for (var l = 0; l < gdodsarr.length; l++) {
                if (gdodsarr[l].hativa == hativasarr[k]._id) {
                    var tempgdodobj = {
                        gdodskshirotid: gdodsarr[l].kshirot,
                        type: "gdod",
                        key: gdodsarr[l]._id,
                        label: gdodsarr[l].name,
                        nodes: [],
                    }
                    hativasnodes.push(tempgdodobj)
                }
            }
            var temphativaobj = {
                type: "hativa",
                key: hativasarr[k]._id,
                label: hativasarr[k].name,
                nodes: hativasnodes,
            }
            finalarr.push(temphativaobj);
        }
        setTreeData(finalarr);
        setIsdataloaded(true);
    }

    const HativatipulsToTreeData = (gdodsarr) => {
        var finalarr = [];
        for (var l = 0; l < gdodsarr.length; l++) {
            var tempgdodobj = {
                gdodskshirotid: gdodsarr[l].kshirot,
                type: "gdod",
                key: gdodsarr[l]._id,
                label: gdodsarr[l].name,
                nodes: [],
            }
            finalarr.push(tempgdodobj);
        }
        setTreeData(finalarr);
        setIsdataloaded(true);
    }
    /*end of data */

    function handleTreeClick(event) {
        var idstr = event.key; //idstr = _id
        if (match.params.unittype == 'admin' || match.params.unittype == 'general') {
            if (event.type == "pikod") {
                history.push(`/dashboard/pikod/${idstr}/magadal/0/true`);
            }
            if (event.type == "ogda") {
                var ogdaidstr = idstr.split('/')[1];
                history.push(`/dashboard/ogda/${ogdaidstr}/magadal/0/true`);
            }
            if (event.type == "hativa") {
                var hativaidstr = idstr.split('/')[2];
                history.push(`/dashboard/hativa/${hativaidstr}/magadal/0/true`);
            }
            if (event.type == "gdod") {
                var gdodidstr = idstr.split('/')[3];
                history.push(`/dashboard/gdod/${gdodidstr}/magadal/0/true`);
            }
        }
        else if (match.params.unittype == 'pikod') {
            if (event.type == "ogda") {
                var ogdaidstr = idstr;
                history.push(`/dashboard/ogda/${ogdaidstr}/magadal/0/true`);
            }
            if (event.type == "hativa") {
                var hativaidstr = idstr.split('/')[1];
                history.push(`/dashboard/hativa/${hativaidstr}/magadal/0/true`);
            }
            if (event.type == "gdod") {
                var gdodidstr = idstr.split('/')[2];
                history.push(`/dashboard/gdod/${gdodidstr}/magadal/0/true`);
            }
        }
        else if (match.params.unittype == 'ogda') {
            if (event.type == "hativa") {
                var hativaidstr = idstr;
                history.push(`/dashboard/hativa/${hativaidstr}/magadal/0/true`);
            }
            if (event.type == "gdod") {
                var gdodidstr = idstr.split('/')[1];
                history.push(`/dashboard/gdod/${gdodidstr}/magadal/0/true`);
            }
        }
        else if (match.params.unittype == 'hativa') {
            if (event.type == "gdod") {
                var gdodidstr = idstr;
                history.push(`/dashboard/gdod/${gdodidstr}/magadal/0/true`);
            }
        }
    }

    useEffect(() => {
        if (match.params.unittype == 'admin' || match.params.unittype == 'general')
            loadAdminData();
        if (match.params.unittype == 'pikod')
            loadPikodData();
        if (match.params.unittype == 'ogda')
            loadOgdaData();
        if (match.params.unittype == 'hativa')
            loadHativaData();
    }, [])

    return (
        !isdataloaded ?
            <div style={{ width: '50%', marginTop: '30%' }}>
                <PropagateLoader color={'#ff4650'} loading={true} size={25} />
            </div>
            :
            <Container style={{ paddingTop: '80px' }}>
                <Card>
                    <CardHeader style={{ direction: 'rtl' }}>
                        <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'right' }}>עץ יחידות</CardTitle>{/*headline*/}
                    </CardHeader>
                    <CardBody>
                        <TreeMenu
                            cacheSearch
                            data={treedata}
                            debounceTime={125}
                            disableKeyboard={false}
                            hasSearch
                            onClickItem={handleTreeClick}
                            resetOpenNodesOnDataUpdate={false}
                        />
                    </CardBody>
                </Card>
            </Container>
    );
}
export default withRouter(UnitTreePage);