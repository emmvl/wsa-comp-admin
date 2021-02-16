import React from 'react';
import { Input } from 'antd';
import Tooltip from 'react-png-tooltip';

function InputWithHead(props) {
    const {
        heading,
        placeholder,
        name,
        handleBlur,
        onChange,
        type,
        value,
        maxLength,
        conceptulHelp,
        conceptulHelpMsg,
        marginTop,
        required,
        tooltiprequired,
        id,
        headingId,
        auto_complete,
        isOptional,
        inputHeadingStyles = {}
    } = props;

    return (
        <div>
            {heading && (
                <div className="d-flex align-items-center">
                    <span id={headingId} className={`input-heading ${required}`} style={inputHeadingStyles}>
                        {heading}

                        {conceptulHelp && (
                            <div
                                className={`Content_Cancel__VinjW_withCrossBtn ${tooltiprequired}`}
                                style={{ marginTop }}
                            >
                                <Tooltip>
                                    <span>{conceptulHelpMsg}</span>
                                </Tooltip>
                            </div>
                        )}

                        { isOptional ? <i className="input-heading__optional">- optional</i> : null }
                    </span>
                </div>
            )}

            {placeholder && (
                <Input
                    autoComplete={auto_complete}
                    id={id}
                    className="input"
                    placeholder={placeholder}
                    name={name || 'hidden'}
                    maxLength={maxLength}
                    // handleChange={(name) => alert(name)}
                    onBlur={handleBlur}
                    onChange={onChange}
                    type={type}
                    value={value}
                    // defaultValue="xyz"
                    {...props}
                />
            )}
        </div>
    );
}

export default InputWithHead;
