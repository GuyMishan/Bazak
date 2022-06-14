import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Container,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Alert,
    Spinner,
    Label,
    Col
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";

import MahzorCandidatesPreferencesSortingTable from 'components/tafkidipedia/MahzorCandidatesPreferencesSortingTable/SortingTable'
import MahzorFinalCandidatesPreferencesSortingTable from 'components/tafkidipedia/MahzorFinalCandidatesPreferencesSortingTable/SortingTable'

const Mahzorcandidatespreferencepage = ({ match }) => {
    //mahzor
    const [mahzordata, setMahzorData] = useState({})
    //mahzor

    const loadmahzor = () => {
        axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
            .then(response => {
                let tempmahzor = response.data;
                setMahzorData(tempmahzor);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function init() {
        loadmahzor()
    }

    useEffect(() => {
        init();
    }, [])

    return (
        mahzordata ?
            <div>
                {mahzordata.status == 2 || mahzordata.status == 3 ?
                    <>
                        <Card style={{ marginTop: '30px' }}>
                            <CardBody>
                                <MahzorCandidatesPreferencesSortingTable />
                            </CardBody>
                        </Card>
                    </> : null}

                {mahzordata.status == 4 || mahzordata.status == 5 || mahzordata.status == 6 ?
                    <>
                        <Card style={{ marginTop: '30px' }}>
                            <CardBody>
                                <MahzorFinalCandidatesPreferencesSortingTable />
                            </CardBody>
                        </Card>
                    </> : null}
            </div> : null
    );
}
export default withRouter(Mahzorcandidatespreferencepage);;