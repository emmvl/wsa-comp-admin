import ApiConstants from "themes/apiConstants";

const initialState = {
    onLoad: false,
    status: 0,
    error: null,
    umpiresListResult: [],
    umpires: "",
    umpiresPage: 0,
    umpiresTotalCount: 0,
};

function liveScoreUmpiresState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_SUCCESS:
            let result = action.result;
            state.umpiresListResult = result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
                umpiresPage: result.page.currentPage,
                umpiresTotalCount: result.page.totalCount,
            };

        case ApiConstants.API_LIVE_SCORE_UMPIRES_FAIL:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error,
            };

        case ApiConstants.API_LIVE_SCORE_UMPIRES_ERROR:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error,
            };

        case ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_SUCCESS:
            return {
                onLoad: false,
                importResult: action.result,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_RESET:
            return {
                onLoad: false,
                importResult: null,
            };

        default:
            return state;
    }
}

export default liveScoreUmpiresState;
