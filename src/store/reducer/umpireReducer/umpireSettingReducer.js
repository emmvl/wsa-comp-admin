import ApiConstants from "../../../themes/apiConstants";

const settingsChecked = {
    coachChecked: true,
    reserveChecked: true,
}
const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    allocationSettingsData: null,


    defaultChecked: settingsChecked,
    allocateViaPool: false,
    manuallyAllocate: false,
    compOrganiser: true,
    affiliateOrg: false,
    noUmpire: false,
};
function umpireSettingState(state = initialState, action) {

    switch (action.type) {
        
        case ApiConstants.API_GET_UMPIRE_ALLOCATION_SETTINGS_LOAD:
            return {
                ...state,
                onLoad: true,
            };
            
        case ApiConstants.API_GET_UMPIRE_ALLOCATION_SETTINGS_SUCCESS:
            return {
                ...state,
                allocationSettingsData: action.result,
                onLoad: false,
            };

        case ApiConstants.API_SAVE_UMPIRE_ALLOCATION_SETTINGS_LOAD:
            return {
                ...state,
                onLoad: true,
            };
                
        case ApiConstants.API_SAVE_UMPIRE_ALLOCATION_SETTINGS_SUCCESS:
            return {
                ...state,
                allocationSettingsData: action.result,
                onLoad: false,
            };

        default:
            return state;
    }
}

export default umpireSettingState;