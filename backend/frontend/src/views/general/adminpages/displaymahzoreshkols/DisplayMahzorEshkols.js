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
import PanelHeader from "components/general/PanelHeader/PanelHeader";

import SortingTable1 from 'components/tafkidipedia/EshkolByMahzorSortingTable2/SortingTable';

import SortingTable2 from 'components/tafkidipedia/FinalEshkolByMahzorSortingTable2/SortingTable';

const DisplayMahzorEshkols = ({ match }) => {
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
    <div style={{direction:'rtl'}}>
      <PanelHeader size="sm" content={
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}></h1>
          {mahzordata.status == 1 ?
            <>
              <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>התחלת מחזור חדש</h1>
            </> :
            mahzordata.status == 2 ?
              <>
                <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>התחלת סבב העדפות ראשון</h1>
              </> :
              mahzordata.status == 3 ?
                <>
                  <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>סיום סבב העדפות ראשון</h1>
                </> :
                mahzordata.status == 4 ?
                  <>
                    <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>התחלת סבב העדפות שני (לאחר ראיונות)</h1>
                  </> :
                  mahzordata.status == 5 ?
                    <>
                      <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>שיבוצים סופיים</h1>
                    </> :
                    mahzordata.status == 6 ?
                      <>
                        <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>מחזור סגור</h1>
                      </> : null}
        </Container>} />
      <Card>
        {match.params.iseshkols === 'true' ? <SortingTable1 mahzorid={match.params.mahzorid} /> : <SortingTable2 mahzorid={match.params.mahzorid} />}
      </Card>
    </div>
  );
}
export default withRouter(DisplayMahzorEshkols);;