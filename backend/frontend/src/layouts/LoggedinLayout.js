import React from "react";

// core components
import Sidebar from "components/general/Sidebar/Sidebar.js";
import WorkplanNavbar from "components/general/Navbars/WorkplanNavbar.js";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import { ThemeContext } from "contexts/ThemeContext";

function LoggedinLayout({ component: Component, ...rest }) {
    // on this page, we need on the body tag the classes .rtl and .menu-on-right
    document.body.classList.add("rtl", "menu-on-right");

    return (
        <ThemeContext.Consumer>
        {({ changeTheme, theme }) => (
                <React.Fragment>
                    <div className="wrapper">
                        <Sidebar rtlActive theme={theme}/>
                        <div className="main-panel">
                            <WorkplanNavbar theme={theme}/>
                            <div className="content" style={{ direction: 'rtl' }}>
                                <Component {...rest} theme={theme}/>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </ThemeContext.Consumer>
    );
}

export default LoggedinLayout;
