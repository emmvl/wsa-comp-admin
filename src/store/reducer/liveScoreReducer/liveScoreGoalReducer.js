import ApiConstants from "../../../themes/apiConstants";
import liveScoreGoalModal from '../../objectModel/liveScoreGoalModal'

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    totalCount: null,
    currentPage: null,
    livescoreGoalActionObject: null,
};
function LiveScoreGoalState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_GOAL_LIST_LOAD:


            return { ...state, onLoad: true, result: [], livescoreGoalActionObject: action };

        case ApiConstants.API_LIVE_SCORE_GOAL_LIST_SUCCESS:
            let result = action.result.result
            var goalListResult
            if (action.goalType === 'By Match') {
                goalListResult = liveScoreGoalModal.getGoalListData(result)
            } else {
                goalListResult = liveScoreGoalModal.getGoalTypeAllData(result)
            }
            return {
                ...state,
                onLoad: false,
                result: goalListResult,
                totalCount: action.result.page.totalCount,
                currentPage: action.result.page.currentPage,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_GOAL_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_GOAL_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.livescoreGoalActionObject = null
            return { ...state, onLoad: false };

        default:
            return state;
    }
}

export default LiveScoreGoalState;
