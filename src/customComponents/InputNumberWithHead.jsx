import React from 'react';
import { InputNumber } from 'antd';

function InputNumberWithHead(props) {
    const {
        heading,
        required,
        id,
        headingId,
        prefixValue,
    } = props;

    return (
        <div>
            {heading && (
                <div className="d-flex align-items-center">
                    <span id={headingId} className={`input-heading ${required}`}>{heading}</span>
                </div>
            )}

            <InputNumber
                id={id}
                formatter={value => `${prefixValue} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(`${prefixValue}` + /\s?|(,*)/g, '')}
                className="input"
                {...props}
            />
        </div>
    );
}

export default InputNumberWithHead;
