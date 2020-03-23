import ApiConstants from '../../../themes/apiConstants'

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,

};

function liveScoreRound(state = initialState, action) {
    switch (action.type) {

        //// Live Score Create Round
        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_SUCCESS:
            return {
                ...state,
                onLoad: false,
                result: action.result,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status

            };
        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_ERROR:
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

export default liveScoreRound;
