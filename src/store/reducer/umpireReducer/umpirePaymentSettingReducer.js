import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireComptitionList: [],
    paidByCompOrgDivisionAffiliate: [],
    poolViewArray: [],

    paymentSettingsData: null,
};

function umpirePaymentSetting(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD:


            return { ...state, onLoad: true };

        case ApiConstants.API_UMPIRE_COMPETITION_LIST_SUCCESS:
            let result = action.result
            return {
                ...state,
                onLoad: false,
                umpireComptitionList: result,
                status: action.status
            };


        // get umpire payment settings
        case ApiConstants.API_GET_UMPIRE_PAYMENT_SETTINGS_LOAD:
            return {
                ...state,
                onLoad: true,
            };
            
        case ApiConstants.API_GET_UMPIRE_PAYMENT_SETTINGS_SUCCESS:
            return {
                ...state,
                paymentSettingsData: action.result,
                onLoad: false,
            };

        // save umpire payment settings
        case ApiConstants.API_SAVE_UMPIRE_PAYMENT_SETTINGS_LOAD:
            return {
                ...state,
                onLoad: true,
            };
            
        case ApiConstants.API_SAVE_UMPIRE_PAYMENT_SETTINGS_SUCCESS:
            return {
                ...state,
                paymentSettingsData: action.result,
                onLoad: false,
            };

        case ApiConstants.API_UMPIRE_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_UMPIRE_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        default:
            return state;
    }
}

export default umpirePaymentSetting;
