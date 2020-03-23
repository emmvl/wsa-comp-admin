import ApiConstants from '../../../themes/apiConstants'

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    scorerListResult: [],
    scorerListPage: 0,
    scorerListTotalCount: "",
}

function liveScoreScorerState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_SUCCESS:
            let scorerList = action.result
            // let teamData = getTeamData(scorerList.users)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                scorerListResult: scorerList.users,
                scorerListCurrentPage: scorerList.page.currentPage,
                scorerListTotalCount: scorerList.page.totalCount
            }
        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error,
            }
        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error
            }

        default:
            return state;
    }
}

export default liveScoreScorerState;