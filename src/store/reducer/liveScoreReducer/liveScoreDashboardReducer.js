import ApiConstants from '../../../themes/apiConstants'

const initialState = {
    onLoad: false,
    error: null,
    status: 0,
    dashboardIncidentList: null,
    dashboardNewsList: null,
    dashboardMatchList: null,

};

function liveScoreDashboardsReducer(state = initialState, action) {

    switch (action.type) {

        //LiveScore Dashboard List
        case ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DASHBOARD_SUCCESS:
            return {
                ...state,
                onLoad: false,
                dashboardIncidentList: action.result.incident,
                dashboardNewsList: action.result.news,
                dashboardMatchList: action.result.match,
            };

        case ApiConstants.API_LIVE_SCORE_DASHBOARD_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_DASHBOARD_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        default:
            return state;
    };

}

export default liveScoreDashboardsReducer;