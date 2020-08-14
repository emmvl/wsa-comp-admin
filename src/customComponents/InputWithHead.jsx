import React from "react";
import { Input } from "antd";
import Tooltip from "react-png-tooltip";

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
    auto_Complete,
  } = props;

  return (
    <div>
      {heading && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span id={headingId} className={`input-heading ${required}`}>{heading}</span>
          {conceptulHelp && (
            <div
              className={`Content_Cancel__VinjW_withCrossBtn ${tooltiprequired}`}
              style={{ marginTop: marginTop }}
            >
              <Tooltip background="#ff8237">
                <span>{conceptulHelpMsg}</span>
              </Tooltip>
            </div>
          )}
        </div>
      )}

      {placeholder && (
        <Input
          autoComplete={auto_Complete}
          id={id}
          className="input"
          placeholder={placeholder}
          name={name ? name : 'hidden'}
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
