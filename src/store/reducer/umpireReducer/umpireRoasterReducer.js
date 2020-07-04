import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireRoasterList: [],
    umpireCurrentPage: null,
    umpireTotalCount: null,
    roasterLoading: false
};

function umpireRoasterdState(state = initialState, action) {
    switch (action.type) {
        //// Umpire List
        case ApiConstants.API_UMPIRE_ROASTER_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_UMPIRE_ROASTER_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                umpireRoasterList: action.result.results,
                umpireCurrentPage: action.result.page.currentPage,
                umpireTotalCount: action.result.page.totalCount,
                status: action.status
            };
        //// Umpire List
        case ApiConstants.API_UMPIRE_ROASTER_ACTION_CLICK_LOAD:
            return { ...state, roasterLoading: true };
        case ApiConstants.API_UMPIRE_ROASTER_ACTION_CLICK_SUCCESS:
            return {
                ...state,
                roasterLoading: false,
                status: action.status
            };
        //// Add Umpire
        case ApiConstants.API_ADD_UMPIRE_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_ADD_UMPIRE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
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
export default umpireRoasterdState;
