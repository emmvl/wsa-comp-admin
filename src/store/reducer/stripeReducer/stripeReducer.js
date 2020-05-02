import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";



const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    accountBalance: null
}


function stripe(state = initialState, action) {
    switch (action.type) {

        ///******fail and error handling */
        case ApiConstants.API_STRIPE_API_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_STRIPE_API_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        //////stripe payment account balance API
        case ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_SUCCESS:
            console.log("account balance", action.result)
            return {
                ...state,
                accountBalance: action.result,
                onLoad: false,
                status: action.status,
                error: null
            };


        ////////For stripe charging payment API
        case ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        default:
            return state;
    }
}

export default stripe;
