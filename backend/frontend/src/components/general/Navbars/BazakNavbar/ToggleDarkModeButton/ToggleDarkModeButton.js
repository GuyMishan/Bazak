import React, { useEffect, useState } from 'react';

// reactstrap components
import { Button, Dropdown, DropdownToggle, Badge } from "reactstrap";
import { ThemeContext, themes } from "contexts/ThemeContext";

import darkmodeimg from 'assets/img/darkmode.png';
import lightmodeimg from 'assets/img/lightmode.png';

import ToggleButton from "react-toggle-button";

function ToggleDarkModeButton(props) {
  const [temptheme, settemptheme] = useState(true);//true=light ,false=dark

  function init() {
    if (props.color == "white")
      settemptheme(true)
    if (props.color == "rgb(32 33 51)")
      settemptheme(false)
  }

  useEffect(() => {
    init();
  }, [props.color])

  return (
    <div style={{ height:'60%',display:'flex',alignItems:'center',textAlign: '-webkit-left' }}>
      <ThemeContext.Consumer>
        {({ changeTheme, theme }) => (
          <ToggleButton
            colors={{
              activeThumb: {
                base: 'rgb(250,250,250)',
              },
              inactiveThumb: {
                base: 'rgb(62,130,247)',
              },
              active: {
                base: 'rgb(62,130,247)',
                hover: 'rgb(84 155 245)',
              },
              inactive: {
                base: 'rgb(65,66,68)',
                hover: 'rgb(95,96,98)',
              }
            }}
            inactiveLabel={/*<img src={darkmodeimg} style={{ width: '15px', height: '15px' }}></img>*/ <p>כשירות</p>}
            activeLabel={/*<img src={lightmodeimg} style={{ width: '15px', height: '15px' }}></img>*/ <p>זמינות</p>}
            value={temptheme}
            onToggle={() => {
              changeTheme((theme) => {
                if (theme == "white-content") {
                  settemptheme(false)
                  return themes.dark;
                }
                else {
                  settemptheme(true)
                  return themes.light;
                }
              });
            }}
          />
        )}
      </ThemeContext.Consumer>
    </div>
  );
}

export default ToggleDarkModeButton;
