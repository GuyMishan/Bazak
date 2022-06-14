import React, { useState, useEffect } from 'react';
import { withRouter, Redirect, Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Container,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import history from 'history.js'
import ManageJobsSortingTable from 'views/general/adminpages/managejobs/ManageJobsSortingTable/SortingTable'

const ManageJobs = (props) => {

  const clickSubmit = (event) => {
    history.push(`/editjob/0`);
  };

  return (
    <div dir='rtl' className="">
      <Card>
        <CardHeader style={{ textAlign: 'right' }}>
          <h3 style={{ fontWeight: 'bold' }}>תפקידים במערכת</h3>
        </CardHeader>
        <CardBody>
          <ManageJobsSortingTable theme={props.theme} />
        </CardBody>
      </Card>

      <div>
        <button onClick={clickSubmit} className="btn">הוסף תפקיד חדש</button>
      </div>
    </div>
  );
}
export default withRouter(ManageJobs);;

