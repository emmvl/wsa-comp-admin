import React from 'react';
import { Input } from 'antd';
import Tooltip from 'react-png-tooltip'
import AppConstants from "../themes/appConstants";

class InputWithHead extends React.Component {

    render() {
        const { heading, placeholder, name, handleBlur, onChange, type, value, maxLength, conceptulHelp, conceptulHelpMsg, marginTop } = this.props
        return <div >
            {heading &&
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={`input-heading ${this.props.required}`}>{heading}</span>
                    {
                        conceptulHelp &&
                        <div className={`Content_Cancel__VinjW_withCrossBtn ${this.props.tooltiprequired}`} style={{ marginTop: marginTop }}>
                            <Tooltip background='#ff8237'>
                                <span>{conceptulHelpMsg}</span>
                            </Tooltip>
                        </div>
                    }

                </div>
            }

            {placeholder &&
                <Input

                    className="input"
                    placeholder={placeholder}
                    name={name}
                    maxLength={maxLength}
                    // handleChange={(name) => alert(name)}
                    onBlur={handleBlur}
                    onChange={onChange}
                    type={type}
                    value={value}
                    // defaultValue="xyz"
                    {...this.props}
                />}
        </div>;
    }
}


export default InputWithHead;