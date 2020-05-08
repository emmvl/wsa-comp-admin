import React from 'react';
import { Input } from 'antd';

class InputWithHead extends React.Component {

    render() {
        const { heading, placeholder, name, handleBlur, onChange, type, value, maxLength } = this.props
        return <div >
            {heading &&
                <span className={`input-heading ${this.props.required}`}>{heading}</span>}
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