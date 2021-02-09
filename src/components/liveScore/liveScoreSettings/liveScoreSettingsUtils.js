import AppConstants from "themes/appConstants";
import { isObject } from 'lodash'

export const isTimeoutsEnabled = !!+process.env.REACT_APP_TIMEOUTS_ENABLED;

export const getArrayFromLength = (length) => Array.from(Array(length).keys());

export const timeoutsModes = {
    NONE: "NONE",
    FOUR_QUARTERS: "FOUR_QUARTERS",
    TWO_HALVES: "TWO_HALVES",
};

export const getTimeoutsData = ({
    timeouts,
    timeoutsToHalves,
    timeoutsToQuarters,
}) => {
    let data = null
    switch (timeouts) {
        case timeoutsModes.FOUR_QUARTERS:
            data = {
                type: timeouts,
                numberOfTimeouts: timeoutsToQuarters,
            }
            break;
        case timeoutsModes.TWO_HALVES:
            data = {
                type: timeouts,
                numberOfTimeouts: timeoutsToHalves,
            }
            break;
        case false:
            data = {
                type: timeoutsModes.NONE,
            }
            break;
        default:
            break;
    }

    return data;
};

export const getTimeoutsDetailsData = (timeoutDetails) => {
    let returnData = {
        timeouts: null,
        timeoutsToQuarters: [],
        timeoutsToHalves: [],
    };

    if (isObject(timeoutDetails)) {
        switch (timeoutDetails.type) {
            case timeoutsModes.FOUR_QUARTERS:
                returnData = {
                    timeouts: timeoutDetails.type,
                    timeoutsToQuarters: timeoutDetails.numberOfTimeouts,
                }
                break;
            case timeoutsModes.TWO_HALVES:
                returnData = {
                    timeouts: timeoutDetails.type,
                    timeoutsToHalves: timeoutDetails.numberOfTimeouts,
                }
                break;
            case timeoutsModes.NONE:
                returnData = {
                    timeouts: false,
                }
                break;
            default:
                break;
        }
    }

    return returnData;
}

export const timeoutsOptions = [
    {
        radioTitle: AppConstants.applyToQuarters,
        stateKey: "timeoutsToQuarters",
        key: timeoutsModes.FOUR_QUARTERS,
        fieldsLength: 4,
        optionTitle: "Quarter",
    },
    {
        radioTitle: AppConstants.applyToHalves,
        stateKey: "timeoutsToHalves",
        key: timeoutsModes.TWO_HALVES,
        fieldsLength: 2,
        optionTitle: "Half",
    },
];
