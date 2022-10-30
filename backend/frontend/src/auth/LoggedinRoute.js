import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {isAuthenticated} from './index';

import LoggedinLayout from "layouts/LoggedinLayout";

function unitid(){
  if (isAuthenticated().user.role === "1") {
    return isAuthenticated().user.gdodid;
  }
  if (isAuthenticated().user.role === "2") {
    return isAuthenticated().user.hativaid;
  }
  if (isAuthenticated().user.role === "3") {
    return isAuthenticated().user.ogdaid;
  }
  if (isAuthenticated().user.role === "4") {
    return isAuthenticated().user.pikodid;
  }
}
const LoggedinRoute = ({props, component: Component, ...rest }) => (
    <Route
        {...rest}
        render ={ props =>
            isAuthenticated() && (isAuthenticated().user.validated===true) && ((props.match.params.unitid==unitid())||(isAuthenticated().user.role == "0"))  ? (
                <LoggedinLayout component={Component}/>
            ) : (
                <Redirect to = {{
                    pathname:"/signin",
                    state: {from: props.location}
    
                }}
                />
            )
        }
    />
)
export default LoggedinRoute;