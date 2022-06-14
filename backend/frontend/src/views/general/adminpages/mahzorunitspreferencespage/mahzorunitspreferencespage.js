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

import MahzorUnitsPreferencesSortingTable from 'components/tafkidipedia/MahzorUnitsPreferencesSortingTable/SortingTable'
import MahzorFinalUnitsPreferencesSortingTable from 'components/tafkidipedia/MahzorFinalUnitsPreferencesSortingTable/SortingTable'

import MahzorUnitsJobsWithoutPreferencesSortingTable from 'components/tafkidipedia/MahzorUnitsJobsWithoutPreferencesSortingTable/SortingTable'
import MahzorUnitsJobsWithoutFinalPreferencesSortingTable from 'components/tafkidipedia/MahzorUnitsJobsWithoutFinalPreferencesSortingTable/SortingTable'

const Mahzorunitspreferencespage = ({ match }) => {
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
                                <MahzorUnitsPreferencesSortingTable />
                            </CardBody>
                        </Card>

                        <Card style={{ marginTop: '30px' }}>
                            <CardBody>
                                <MahzorUnitsJobsWithoutPreferencesSortingTable />
                            </CardBody>
                        </Card>
                    </> : null}

                {mahzordata.status == 4 || mahzordata.status == 5 || mahzordata.status == 6 ?
                    <>
                        <Card style={{ marginTop: '30px' }}>
                            <CardBody>
                                <MahzorFinalUnitsPreferencesSortingTable />
                            </CardBody>
                        </Card>

                        <Card style={{ marginTop: '30px' }}>
                            <CardBody>
                                <MahzorUnitsJobsWithoutFinalPreferencesSortingTable />
                            </CardBody>
                        </Card>
                    </> : null}
            </div> : null
    );
}
export default withRouter(Mahzorunitspreferencespage);;