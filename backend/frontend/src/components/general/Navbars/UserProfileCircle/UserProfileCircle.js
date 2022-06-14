import React, { useEffect, useState } from 'react';

import { Button, Dropdown, DropdownToggle, Badge } from "reactstrap";
import { ThemeContext, themes } from "contexts/ThemeContext";
import { backgroundColors } from "contexts/BackgroundColorContext";

import ToggleDarkModeButton from '../UserProfileDropdownMenu/ToggleDarkModeButton'

import UserProfileDropdownMenu from '../UserProfileDropdownMenu/UserProfileDropdownMenu'

function UserProfileCircle(props) {
    const [dropDownIsOpen, setdropDownIsOpen] = React.useState(false);
    const handleClick = () => {
        setdropDownIsOpen(!dropDownIsOpen);
    };

    return (
        <>
            <UserProfileDropdownMenu fname={props.fname} dropDownIsOpen={dropDownIsOpen} bgcolor={props.bgcolor} handleClick={handleClick}/>
        </>
    );
}

export default UserProfileCircle;
