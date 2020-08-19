

import ApiConstants from "../../../themes/apiConstants";

function updateUmpireDataAction(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_SETTINGS_DATA_UPDATE,
        data
    };

    return action;
}

export {
    updateUmpireDataAction
} 