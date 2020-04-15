import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    userCount: null,
    registrationCount: null,

};


function homeReducer(state = initialState, action) {
    switch (action.type) {
        //////get the Dashboard list in registration
        case ApiConstants.API_USERCOUNT_LOAD:
            return { ...state, onLoad: true, error: null }
        case ApiConstants.API_USERCOUNT_SUCCESS:
            console.log(action)
            return {
                ...state,
                onLoad: false,
                userCount: action.result.count,
                registrationCount: action.result.registrationCount,
                status: action.status
            }


        case ApiConstants.clearHomeDashboardData:
            if (action.key == "user") {
                state.userCount = null
                state.registrationCount = null
            }
            return {
                ...state
            }


        ///******fail and error handling */
        case ApiConstants.API_USERCOUNT_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_USERCOUNT_ERROR:
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

export default homeReducer;
