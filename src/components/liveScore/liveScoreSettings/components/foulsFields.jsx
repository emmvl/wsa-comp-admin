import React, { useEffect, useState } from 'react'
import { cloneDeep, debounce, get } from 'lodash'
import PropTypes from "prop-types";

import InputWithHead from "customComponents/InputWithHead";
import AppConstants from "themes/appConstants";
import { getOnlyNumbers } from "components/liveScore/liveScoreSettings/liveScoreSettingsUtils";

const columns = [
    "name",
    "removedFromGame",
    "refereeReport",
    "sinBin",
    "includeInPersonalFouls",
]

const rows = [
    AppConstants.personal,
    AppConstants.technical,
    AppConstants.unsportsmanlike,
    AppConstants.disqualifying,
]

const FoulsFields = ({ onChange, values = [] }) => {
    const [currentValues, setCurrentValues] = useState([])

    const saveChanges = debounce(onChange, 1000);

    const handleFoulsChange = (rowName, target) => {
        const fieldName = target.name;
        const fieldValue = getOnlyNumbers(target.value);
        const currentRow = currentValues.find((row) => row.name === rowName)
        const currentRowValues = (currentRow?.values) || {};

        const newRowValues = {
            ...currentRowValues,
            [fieldName]: fieldValue,
        }

        if (currentRow) {
            currentRow.values = newRowValues;
        } else {
            currentValues.push({
                name: rowName,
                values: newRowValues,
            })
        }

        setCurrentValues([...currentValues])
        saveChanges({
            target: {
                name: "foulsSettings",
                value: currentValues,
            },
        })
    };

    const getFieldValuePath = (rowName, fieldName) => {
        const currentRowIndex = currentValues?.findIndex((row) => row.name === rowName);
        if (currentRowIndex === -1) return "";

        return `[${currentRowIndex}].values.${fieldName}`
    }

    const renderHeaders = () => (
        <div className="row">
            { columns.map((columnName) => {
                const columnNameValue = AppConstants[columnName];

                return (
                    <div
                        key={columnName}
                        className="col-sm input-width d-flex align-items-end"
                    >
                        <InputWithHead
                            heading={columnNameValue}
                        />
                    </div>
                )
            })}
        </div>
    )

    const renderRow = ({ rowName }) => (
        <div key={rowName} className="row mt-4">
            <div className="col-sm input-width d-flex align-items-end">
                <InputWithHead
                    heading={rowName}
                    inputHeadingStyles={{
                        fontWeight: 'bold',
                    }}
                />
            </div>

            {columns.map((columnName) => {
                const columnNameValue = AppConstants[columnName];
                const isNameColumn = columnNameValue === AppConstants.name;
                if (isNameColumn) return;

                const fieldValue = get(currentValues, getFieldValuePath(rowName, columnName), 0)

                return (
                    <div
                        key={columnName}
                        className="col-sm input-width d-flex align-items-end"
                    >
                        <InputWithHead
                            placeholder=""
                            name={columnName}
                            onChange={(e) => handleFoulsChange(rowName, e.target)}
                            value={fieldValue}
                        />
                    </div>
                )
            })}

        </div>
    )

    const renderFieldsTable = () => (
        <>
            {renderHeaders()}
            {
                rows.map((rowName) => renderRow({ rowName }))
            }
        </>
    )

    useEffect(() => {
        if (currentValues.length) return;

        setCurrentValues(cloneDeep(values))
    }, [values])

    return renderFieldsTable()
};

FoulsFields.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default FoulsFields;
