import React from 'react';
import { Form, Radio } from 'antd';
import { get } from 'lodash';

import {
  getArrayFromLength,
  getOnlyNumbers,
  isTimeoutsEnabled,
  timeoutsModes,
  timeoutsOptions,
} from 'components/liveScore/liveScoreSettings/liveScoreSettingsUtils';
import InputWithHead from 'customComponents/InputWithHead';

const LiveScoreSettingsTimeoutsFields = ({ isVisible = true, values, onFormChange, formRef }) => {
  if (!isTimeoutsEnabled || !isVisible) return null;
  const { timeouts } = values;

  const getTimeoutsValue = (stateKey, fieldKey) => {
    const value = get(values, `${stateKey}.${fieldKey}`, '');

    return value;
  };

  const handleTimeoutsChange = value => {
    const timeoutsAlreadySet = timeouts && timeouts !== timeoutsModes.NONE;
    let setValue = value || timeoutsModes.TWO_HALVES;

    if (timeoutsAlreadySet && !value) {
      setValue = timeoutsModes.NONE;
    }

    onFormChange({
      key: 'timeouts',
      data: setValue,
    });
  };

  const handleTimeoutInputChange = (e, timeoutFieldKey, fieldOptionsIndex) => {
    const value = getOnlyNumbers(e.target.value);
    const currentTimeoutsValue = values[timeoutFieldKey] || [];
    const newValue = [...currentTimeoutsValue];

    newValue[fieldOptionsIndex] = value;
    onFormChange({
      key: timeoutFieldKey,
      data: newValue,
    });
    formRef.setFieldsValue({
      [`${timeoutFieldKey}${fieldOptionsIndex}`]: value,
    });
  };

  return (
    <>
      <Form.Item name="timeouts">
        {timeoutsOptions.map(timeoutOption => (
          <div key={timeoutOption.key} className="row mr-0" style={{ marginLeft: '20px' }}>
            <div className="col-12 p-0">
              <Radio
                key={timeoutOption.key}
                value={timeoutOption.key}
                onChange={e => handleTimeoutsChange(e.target.value)}
                checked={timeouts === timeoutOption.key}
              >
                {timeoutOption.radioTitle}
              </Radio>
            </div>

            {timeouts === timeoutOption.key && (
              <div className="col-12 p-0">
                <div className="row" style={{ marginLeft: '20px' }}>
                  {getArrayFromLength(timeoutOption.fieldsLength).map((i, index) => {
                    const humanIndex = index + 1;
                    const suffixes = ['st', 'nd', 'rd', 'th'];
                    const suffix = index < 3 ? suffixes[index] : suffixes[3];
                    const title = `${humanIndex}${suffix} ${timeoutOption.optionTitle}`;

                    return (
                      <div key={timeoutOption.key + index} className="col-auto">
                        <Form.Item
                          name={`${timeoutOption.stateKey}.${index}`}
                          rules={[
                            {
                              required: true,
                              pattern: new RegExp('^[1-9][0-9]*$'),
                              message: ' ',
                            },
                          ]}
                          initialValue={getTimeoutsValue(timeoutOption.stateKey, index)}
                        >
                          <InputWithHead
                            required="pt-0"
                            heading={title}
                            placeholder={title}
                            name={`${timeoutOption.stateKey}.${index}`}
                            value={getTimeoutsValue(timeoutOption.stateKey, index)}
                            style={{
                              width: '60px',
                            }}
                            onChange={e =>
                              handleTimeoutInputChange(e, timeoutOption.stateKey, index)
                            }
                          />
                        </Form.Item>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </Form.Item>
    </>
  );
};

export default LiveScoreSettingsTimeoutsFields;
