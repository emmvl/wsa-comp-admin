import ApiConstants from "../../../themes/apiConstants";
// import history from "../../../util/history";
// import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    onActionBoxLoad: false,
    error: null,
    result: null,
    status: 0,
    userCount: null,
    registrationCount: null,
    liveScoreCompetitionCount: null,
    registrationCompetitionCount: null,
    yearRefId: null,
    actionBoxList: null,
    actionBoxPage: 1,
    actionBoxTotalCount: 1
};


function homeReducer(state = initialState, action) {
    switch (action.type) {
        //////get the Dashboard list in registration
        case ApiConstants.API_USER_COUNT_LOAD:
            return { ...state, onLoad: true, error: null }
        case ApiConstants.API_USER_COUNT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                userCount: action.result.count,
                registrationCount: action.result.registrationCount,
                liveScoreCompetitionCount: action.result.liveScoreCompetitionCount,
                registrationCompetitionCount: action.result.registrationCompetitionCount,
                status: action.status
            }


        case ApiConstants.clearHomeDashboardData:
            if (action.key === "user") {
                state.userCount = null
                state.registrationCount = null
                state.liveScoreCompetitionCount = null
                state.registrationCompetitionCount = null
            }
            if (action.key === 'yearChange') {
                state.userCount = ""
                state.registrationCount = ""
                state.liveScoreCompetitionCount = ""
                state.registrationCompetitionCount = ""
            }
            return {
                ...state
            }


        ///******fail and error handling */
        case ApiConstants.API_USER_COUNT_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_USER_COUNT_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.setHomeDashboardYearKey:
            return {
                ...state,
                yearRefId: action.year
            }

        case ApiConstants.API_GET_ACTION_BOX_LOAD:
            return { ...state, onActionBoxLoad: true, error: null }

        case ApiConstants.API_GET_ACTION_BOX_SUCCESS:
            let actionData = action.result;
            return {
                ...state,
                onActionBoxLoad: false,
                actionBoxList: actionData.actions!= null ? actionData.actions : [],
                actionBoxPage: actionData.page ? actionData.page.currentPage : 1,
                actionBoxTotalCount: actionData.page ? actionData.page.totalCount: 1,
            }

        case ApiConstants.API_UPDATE_ACTION_BOX_LOAD:
            return { ...state, onActionBoxLoad: true };

        case ApiConstants.API_UPDATE_ACTION_BOX_SUCCESS:
            return {
                ...state,
                onActionBoxLoad: false,
                status: action.status,
                error: null
            };

        default:
            return state;
    }
}

export default homeReducer;
