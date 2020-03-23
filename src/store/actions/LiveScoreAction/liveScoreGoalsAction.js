
import ApiConstants from "../../../themes/apiConstants";

//Goals action
function liveScoreGoalListAction(competitionID, goalType) {
    console.log('Action', goalType)
    const action = {
        type: ApiConstants.API_LIVE_SCORE_GOAL_LIST_LOAD,
        competitionID: competitionID,
        goalType
    };

    return action;
}

export {
    liveScoreGoalListAction,
};
