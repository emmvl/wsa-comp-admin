import { cloneDeep, debounce, get } from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import InputWithHead from 'customComponents/InputWithHead';
import AppConstants from 'themes/appConstants';
import { useState } from 'react';

const SinBinLengthOfTime = ({ values, onChange }) => {
    const [currentValues, setCurrentValues] = useState({});
    const saveChanges = debounce(onChange, 500);

    const handleTimeChange = e => {
        let lengthTime = e.target.value;
        if (/^\d+$/.test(lengthTime) || lengthTime === '') {
            currentValues[AppConstants.sinBinLengthOfTimeKey] = parseInt(lengthTime);
            saveChanges({
                target: {
                    name: 'foulsSettings',
                    value: currentValues,
                },
            });
        }
    };

    useEffect(() => {
        if (Object.keys(currentValues).length) return;

        setCurrentValues(
            cloneDeep(values) ||
            (process.env.REACT_APP_FLAVOUR === 'football'
                ? { sendOffReport: [{ type: 'RC', value: 1 }] }
                : {}),
        );
    }, [values]);

    return (
        <div className="input-width d-flex align-items-end">
            <InputWithHead
                heading={AppConstants.sinBinLengthOfTimeLabel}
                inputHeadingStyles={{
                    fontWeight: 'bold',
                }}
            />
            <div className="ml-10">
                <InputWithHead
                    placeholder=""
                    onChange={handleTimeChange}
                    value={currentValues[AppConstants.sinBinLengthOfTimeKey] || ''}
                    inputHeadingStyles={{
                        fontWeight: 'bold',
                    }}
                />
            </div>
            <div className="ml-10">
                <InputWithHead
                    heading={AppConstants._minutes}
                />
            </div>
        </div>
    );
};

SinBinLengthOfTime.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default SinBinLengthOfTime;
