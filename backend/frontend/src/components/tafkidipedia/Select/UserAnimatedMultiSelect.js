import React, { useEffect, useState } from 'react';
import { ThemeContext, themes } from "contexts/ThemeContext";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function UserAnimatedMultiSelect(props) {
    const [value, setValue] = useState([]);

    const [dataoptions, setDataOptions] = useState([]);

    function handleChange3(selectedOption) {
        setValue(selectedOption)
        props.handle_change(selectedOption)
    }

    useEffect(() => {
        if (props.data.length != 0 && props.val != undefined) {
            let tempdataoptions = [];
            for (let i = 0; i < props.data.length; i++) {
                let tempdataoption = {
                    value: props.data[i]._id,
                    label: props.data[i].name + " " + props.data[i].lastname + " / " + props.data[i].personalnumber
                }
                tempdataoptions.push(tempdataoption)

                if (props.val == props.data[i]._id) {
                    setValue(tempdataoptions[i])
                }
            }
            setDataOptions(tempdataoptions);
        }
        else {
            if (props.data.length != 0) {
                let tempdataoptions = [];
                for (let i = 0; i < props.data.length; i++) {
                    let tempdataoption = {
                        value: props.data[i]._id,
                        label: props.data[i].name + " " + props.data[i].lastname + " / " + props.data[i].personalnumber
                    }
                    tempdataoptions.push(tempdataoption)

                    if (props.val == props.data[i]._id) {
                        setValue(tempdataoptions[i])
                    }
                }
                setDataOptions(tempdataoptions);
            }
            else {
                setDataOptions([]);
            }
        }
    }, [props.data, props.val]);

    return (
        <ThemeContext.Consumer>
            {({ changeTheme, theme }) => (
                theme == "white-content" ?
                    <Select
                        isMulti={false}
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={dataoptions}
                        onChange={handleChange3}
                        isDisabled={props.isDisabled}
                        value={value}
                        placeholder={props.placeholder}
                    /> :
                    <div style={{ color: 'white' }}>
                        <Select
                            isMulti={false}
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={dataoptions}
                            onChange={handleChange3}
                            isDisabled={props.isDisabled}
                            value={value}
                            placeholder={props.placeholder}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    neutral0: '#27293d',
                                    neutral5: '#1e1e2f',
                                    primary25: '#1e1e2f',
                                    primary50: 'transparent',
                                    neutral50: 'white',
                                    neutral80: 'white',
                                },
                            })}
                        />
                    </div>
            )}
        </ThemeContext.Consumer>
    );
}