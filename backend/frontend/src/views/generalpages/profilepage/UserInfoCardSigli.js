import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
} from "reactstrap";

function UserInfoCardSigli(props) {

    return (
        <Card>
            <CardHeader>
                <h2 style={{ textAlign: 'right', fontWeight: 'bold' }}>נתונים סיגליים</h2>
            </CardHeader>
            <CardBody>
                <Container>
                    <div className='table-responsive' style={{overflow:'auto'}}>
                        <table>
                            <thead style={{ backgroundColor: '#4fff64' }}>
                                <tr>
                                    <th colSpan="1" style={{ borderLeft: "1px solid white" }}>שנה</th>
                                    <th colSpan="1" style={{ borderLeft: "1px solid white" }}>סוציומטרי</th>
                                    <th colSpan="1" style={{ borderLeft: "1px solid white" }}>דירוג חילי</th>
                                    <th colSpan="1" style={{ borderLeft: "1px solid white" }}>בשל לקידום</th>
                                    <th colSpan="1" style={{ borderLeft: "1px solid white" }}>פוטנציאל קבע ארוך</th>
                                    <th colSpan="1" style={{ borderLeft: "1px solid white" }}>מידת הצלחה בתפקיד</th>
                                    <th colSpan="1" >בולט לחיוב</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    props.user.sigli_data ? props.user.sigli_data.map(row => {
                                        return (
                                            <tr>
                                                {row.year ? <td><p>{row.year}</p></td> : <td></td>}

                                                {row.socio ? <td><p>{row.socio}</p></td> : <td></td>}

                                                {row.hili_ranking ? row.hili_ranking == 'א' ? <td><p style={{ color: 'green' }}>א</p></td> : <td><p style={{ color: 'red' }}>ב</p></td> : <td></td>}

                                                {row.promo_ready ? <td><p>{row.promo_ready}</p></td> : <td></td>}

                                                {row.long_term ? <td><p>{row.long_term}</p></td> : <td></td>}

                                                {row.job_success ? <td><p>{row.job_success}</p></td> : <td></td>}

                                                {row.outstanding ? row.outstanding == 'כן' ? <td><p style={{ color: 'green' }}>כן</p></td> : <td><p style={{ color: 'red' }}>לא</p></td> : <td></td>}
                                            </tr>
                                        )
                                    }) : null
                                }
                                {/* <tr>
                                    <td><p>2021</p></td>
                                    <td><p>50</p></td>
                                    <td><p style={{ color: 'lime' }}>א</p></td>
                                    <td><p>כ</p></td>
                                    <td><p>4</p></td>
                                    <td><p>5</p></td>
                                    <td><p style={{ color: 'red' }}>ל</p></td>
                                </tr>
                                <tr>
                                    <td><p>2020</p></td>
                                    <td><p>75</p></td>
                                    <td><p style={{ color: 'red' }}>ב</p></td>
                                    <td><p>-</p></td>
                                    <td><p>5</p></td>
                                    <td><p>5</p></td>
                                    <td><p style={{ color: 'lime' }}>כ</p></td>
                                </tr>
                                <tr>
                                    <td><p>2019</p></td>
                                    <td><p>85</p></td>
                                    <td><p style={{ color: 'lime' }}>א</p></td>
                                    <td><p>-</p></td>
                                    <td><p>4</p></td>
                                    <td><p>4</p></td>
                                    <td><p style={{ color: 'lime' }}>כ</p></td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </Container>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardSigli);