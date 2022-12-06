import React, { useEffect, useState } from 'react';
import { ThemeContext, themes } from "contexts/ThemeContext";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function NormalAnimatedMultiSelect(props) {
    const [value, setValue] = useState([]);
    const [dataoptions, setDataOptions] = useState([]);

    function handleChange3(selectedOptions) {
        setValue(selectedOptions)
        props.handleChange2(selectedOptions, props.name)
    }

    useEffect(() => {
        if (props.data.length != 0 && props.val != undefined) {
            let tempvalues = [];
            let tempdataoptions = [];
            for (let i = 0; i < props.data.length; i++) {
                let tempdataoption = {
                    value: props.data[i].value,
                    label: props.data[i].label
                }
                tempdataoptions.push(tempdataoption)

                for (let j = 0; j < props.val.length; j++) {
                    if (tempdataoption.value == props.val[j]) {
                        tempvalues.push(tempdataoption)
                    }
                }
            }
            setValue(tempvalues)
            setDataOptions(tempdataoptions);
        }
        else {
            if (props.data.length != 0) {
                let tempdataoptions = [];
                for (let i = 0; i < props.data.length; i++) {
                    let tempdataoption = {
                        value: props.data[i].value,
                        label: props.data[i].label
                    }
                    tempdataoptions.push(tempdataoption)
                }
                setDataOptions(tempdataoptions);
            }
        }
    }, [props.data, props.val]);

    return (
        <ThemeContext.Consumer>
            {({ changeTheme, theme }) => (
                theme == "white-content" ?
                    <Select
                        isMulti={true}
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={dataoptions}
                        onChange={handleChange3}
                        isDisabled={props.isDisabled}
                        value={value}
                        placeholder='בחר'
                    /> :
                    <div style={{ color: 'white' }}>
                        <Select
                            isMulti={true}
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={dataoptions}
                            onChange={handleChange3}
                            isDisabled={props.isDisabled}
                            value={value}
                            placeholder='בחר'
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
                                    neutral10: '#3d3e50',
                                },
                            })}
                        />
                    </div>
            )}
        </ThemeContext.Consumer>
    );
}