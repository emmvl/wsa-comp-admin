import ApiConstants from "../../../themes/apiConstants";
import liveScoreGoalModal from '../../objectModel/liveScoreGoalModal'

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0
};
function LiveScoreGoalState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_GOAL_LIST_LOAD:


            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_GOAL_LIST_SUCCESS:
            let result = action.result
            console.log(result, "result")
            var goalListResult = liveScoreGoalModal.getGoalListData(action.result)
            console.log(goalListResult, "goalListResult")
            return {
                ...state,
                onLoad: false,
                result: goalListResult,
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

        default:
            return state;
    }
}

export default LiveScoreGoalState;
