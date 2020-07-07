import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireVenueList: [],
    onVenueLoad: false,
    umpireDivisionList: [],
    onDivisionLoad: false,
    umpireDashboardList: [],
    totalPages: null
};

function umpireDashboardState(state = initialState, action) {
    switch (action.type) {
        //// Umpire Dashboard List
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                umpireDashboardList: action.result.results,
                totalPages: action.result.page.totalCount,
                status: action.status
            };
        //// Venue List
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_LOAD:
            return { ...state, onVenueLoad: true };
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_SUCCESS:
            return {
                ...state,
                onVenueLoad: false,
                umpireVenueList: action.result,
                status: action.status
            };
        //// Division List
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_LOAD:
            return { ...state, onDivisionLoad: true };
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_SUCCESS:
            return {
                ...state,
                onDivisionLoad: false,
                umpireDivisionList: action.result,
                status: action.status
            };
        //// Umpire Import
        case ApiConstants.API_UMPIRE_IMPORT_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_UMPIRE_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false
            };
        //// Fail and Error case
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
export default umpireDashboardState;
