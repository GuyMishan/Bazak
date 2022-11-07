import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {isAuthenticated,HierarchyCheck} from './index';

import LoggedinLayout from "layouts/LoggedinLayout";

const LoggedinRoute = ({props, component: Component, ...rest }) => (
    <Route
        {...rest}
        render ={ props =>
            isAuthenticated() && (isAuthenticated().user.validated===true) && ((props.match.params.unitid==undefined)||(HierarchyCheck(props.match.params.unitid,props.match.params.unittype))||(isAuthenticated().user.role == '0' && props.match.params.unitid=='0'))  ? (// bug in zminotpage because unitid is 0 for some reason
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