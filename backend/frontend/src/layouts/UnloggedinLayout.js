import React from "react";

// core components
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import { ThemeContext } from "contexts/ThemeContext";

import {
    Container,
  } from "reactstrap";

function UnloggedinLayout({ component: Component, ...rest }) {
    // on this page, we need on the body tag the classes .rtl and .menu-on-right
    document.body.classList.add("rtl", "menu-on-right");

    return (
        <ThemeContext.Consumer>
        {({ changeTheme, theme }) => (
                <React.Fragment>
                    <div className="main-panel">
                        <Container style={{ paddingTop: '4rem' }}>
                            <Component {...rest} theme={theme}/>
                        </Container>
                    </div>
                </React.Fragment>
            )}
        </ThemeContext.Consumer>
    );
}

export default UnloggedinLayout;
