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
    defaultChecked: settingsChecked,
    allocateViaPool: false,
    umpireYourOwn: false,
};
function umpireSettingState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_UMPIRE_SETTINGS_DATA_UPDATE:

            let data = action.data.data
            let key = action.data.key

            if (key === 'allocateViaPool' || key === 'umpireYourOwn') {

                if (key === 'allocateViaPool') {
                    state[key] = data
                    state['umpireYourOwn'] = false

                } else if (key === 'umpireYourOwn') {
                    state[key] = data
                    state['allocateViaPool'] = false
                }
            } else {
                state.defaultChecked[key] = data
            }
            return {
                ...state,
                onLoad: false,
            };

        default:
            return state;
    }
}

export default umpireSettingState;