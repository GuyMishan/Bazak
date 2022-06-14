import React, { useEffect, useState } from 'react';
import { ThemeContext, themes } from "contexts/ThemeContext";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function AnimatedMultiSelect(props) {
    const [values, setValues] = useState([]);
    const [dataoptions, setDataOptions] = useState([]);

    function handleChange3(selectedOptions) {
        setValues(selectedOptions)
        props.handleChange2(selectedOptions, props.name)
    }

    useEffect(() => {
        if (props.data.length != 0) {
            // console.log(props.data)
            let tempdataoptions = [];
            for (let i = 0; i < props.data.length; i++) {
                let tempdataoption = {
                    value: props.data[i],
                    label: props.data[i].name
                }
                tempdataoptions.push(tempdataoption)
            }
            setDataOptions(tempdataoptions);
        }
        else {
            setDataOptions([]);
        }
    }, [props.data]);

    return (
        <ThemeContext.Consumer>
            {({ changeTheme, theme }) => (
                theme == "white-content" ?
                    <Select
                        isMulti={true}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        options={dataoptions}
                        onChange={handleChange3}
                        isDisabled={props.isDisabled}
                        value={values}
                    /> :
                    <div style={{color:'white'}}>
                    <Select
                        isMulti={true}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        options={dataoptions}
                        onChange={handleChange3}
                        isDisabled={props.isDisabled}
                        value={values}

                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                neutral0: '#27293d',
                                neutral5: '#1e1e2f',
                                primary25: '#1e1e2f',
                                primary50: 'transparent',
                                neutral50: 'white',
                            },
                        })}
                    />
                    </div>
            )}
        </ThemeContext.Consumer>
    );
}