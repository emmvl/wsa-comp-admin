import ApiConstants from "../../../themes/apiConstants";

const settingsChecked = {
    coachChecked: false,
    reserveChecked: false,
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    defaultChecked: settingsChecked
};
function umpireSettingState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_UMPIRE_SETTINGS_DATA_UPDATE:
            state.defaultChecked[action.key] = action.data
            return {
                ...state,
                onLoad: false,
            };

        default:
            return state;
    }
}

export default umpireSettingState;