import React, { useEffect, useState } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";

import axios from 'axios';

function BazakNavbarTitle(props) {
    const [text, setText] = useState("");

    async function CalculateText() {
        // console.log("hello")
        if (props.match.params.unittype != 'admin' && props.match.params.unittype != 'notype') {
            let response = await axios.get(`http://localhost:8000/api/${props.match.params.unittype}/${props.match.params.unitid}`)
            let responsedata = response.data;
            // let unittypetext;
            // switch(props.match.params.unittype){
            //     case 'pikod':unittypetext='פיקוד'; break;
            //     case 'ogda':unittypetext='אוגדה'; break;
            //     case 'hativa':unittypetext='חטיבה'; break;
            //     case 'gdod':unittypetext='גדוד'; break;
            // }
            // setText(unittypetext + " " + responsedata.name);
            setText(responsedata.name);
        }
        else {
            setText('כלל צה"ל');
        }
    }

    useEffect(() => {
        if (props.match.params.unittype != undefined && props.match.params.unitid != undefined)
            CalculateText()
    }, [props.match])

    return (
        text ?
            props.theme == "white-content" ?
                <h3 style={{ fontWeight: 'bold' }}>זמינות האמל"ח - {text}</h3>
                : <h3 style={{ fontWeight: 'bold' }}>כשירות האמל"ח - {text}</h3>
            : null
    );
}

export default withRouter(BazakNavbarTitle);