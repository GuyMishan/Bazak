import React, { useEffect, useState } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from 'auth/index';
import axios from 'axios';

function BazakNavbarTitle(props) {
    //text
    const [text, setText] = useState("");

    async function CalculateText() {
        if (props.match.params.unittype != 'admin' && props.match.params.unittype != 'notype') {
            let response = await axios.get(`http://localhost:8000/api/${props.match.params.unittype}/${props.match.params.unitid}`)
            let responsedata = response.data;
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
            props.match.path.substring(1, 17) != "modularchartpage" ?
                props.match.path.substring(1, 10) != "dashboard" || (props.match.path.substring(1, 10) == "dashboard" && (props.user.mainscreenid==undefined && props.user.mainscreenid==null)) ?
                    props.theme == "white-content" ?
                        <h2 style={{ fontWeight: 'bold', color: 'rgb(54,78,104)' }}>זמינות האמל"ח - {text}</h2>
                        : <h2 style={{ fontWeight: 'bold', color: 'hsla(0,0%,100%,.8)' }}>כשירות האמל"ח - {text}</h2>
                    : null
                : null
            : null
    );
}

export default withRouter(BazakNavbarTitle);