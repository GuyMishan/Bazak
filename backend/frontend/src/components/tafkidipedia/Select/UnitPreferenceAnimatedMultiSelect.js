import React, { useEffect, useState } from 'react';
import { ThemeContext, themes } from "contexts/ThemeContext";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function UnitPreferenceAnimatedMultiSelect(props) {
    const [dataoptions, setDataOptions] = useState([]);

    useEffect(() => {
        if (props.data.length != 0) {
            let tempdataoptions = [];
            for (let i = 0; i < props.data.length; i++) {
                let tempdataoption = {
                    value: i,
                    label: props.data[i].user.name +" "+ props.data[i].user.lastname
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
                        isMulti={false}
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={dataoptions}
                        onChange={props.handleChangCandidatesOfPreference}
                        isDisabled={props.isDisabled}
                        placeholder='בחר מועמד'
                    /> :
                    <div style={{color:'white'}}>
                    <Select
                        isMulti={false}
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={dataoptions}
                        onChange={props.handleChangCandidatesOfPreference}
                        isDisabled={props.isDisabled}
                        placeholder='בחר מועמד'
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