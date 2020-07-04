

import ApiConstants from "../../../themes/apiConstants";

function updateUmpireDataAction(data, key) {
    const action = {
        type: ApiConstants.API_UMPIRE_SETTINGS_DATA_UPDATE,
        data,
        key
    };

    return action;
}

export {
    updateUmpireDataAction
} 