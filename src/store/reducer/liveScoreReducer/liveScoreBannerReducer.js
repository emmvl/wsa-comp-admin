import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    bannerResult: [],
    showOnHome: false,
    showOnDraws: false,
    showOnLadder: false,
    bannerLink: "https://",

};
function LiveScoreBannerState(state = initialState, action) {
    switch (action.type) {
        ////Banner List Case 

        case ApiConstants.API_LIVE_SCORE_BANNERS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_BANNERS_SUCCESS:
            return {
                ...state,
                onLoad: false,
                bannerResult: action.result,
                status: action.status
            };

        ////Add Banner Case
        case ApiConstants.API_LIVE_SCORE_ADD_BANNER_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_BANNER_SUCCESS:

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        ////Remove Banner Case
        case ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_SUCCESS:

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_BANNER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_BANNER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_ADD_BANNER_UPDATE:

            state[action.key] = action.data
            if (action.key == 'isEditBanner') {
                state.showOnHome = action.data.showOnHome
                state.showOnDraws = action.data.showOnDraws
                state.showOnLadder = action.data.showOnLadder
                state.bannerLink = action.data.bannerLink

            } else if (action.key == 'isAddBanner') {
                state.showOnHome = false
                state.showOnDraws = false
                state.showOnLadder = false
                state.bannerLink = "https://"
            } else {
                state[action.key] = action.data
            }

            return {
                ...state,
            };

        case ApiConstants.API_LIVE_SCORE_CLEAR_BANNER_REDUCER:
            state.showOnDraws = false
            state.showOnHome = false
            state.showOnLadder = false
            return { ...state }

        default:
            return state;
    }
}

export default LiveScoreBannerState;
