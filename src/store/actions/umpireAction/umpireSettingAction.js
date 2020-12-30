import ApiConstants from "../../../themes/apiConstants";

function updateUmpireDataAction(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_SETTINGS_DATA_UPDATE,
        data
    };

    return action;
}

function getUmpireAllocationSettings(data) {
    const action = {
        type: ApiConstants.API_GET_UMPIRE_ALLOCATION_SETTINGS_LOAD,
        data
    };

    return action;
}

function saveUmpireAllocationSettings(data) {
    const action = {
        type: ApiConstants.API_SAVE_UMPIRE_ALLOCATION_SETTINGS_LOAD,
        data
    };

    return action;
}

export {
    updateUmpireDataAction,
    getUmpireAllocationSettings,
    saveUmpireAllocationSettings
} 