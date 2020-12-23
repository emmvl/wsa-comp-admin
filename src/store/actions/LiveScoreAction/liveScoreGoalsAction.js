
import ApiConstants from "../../../themes/apiConstants";

//Goals action
function liveScoreGoalListAction(competitionID, goalType, search, offset, sortBy, sortOrder , isParent , compOrgId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_GOAL_LIST_LOAD,
        competitionID: competitionID,
        goalType,
        search,
        offset,
        sortBy,
        sortOrder,
        isParent , 
        compOrgId
    };

    return action;
}

export {
    liveScoreGoalListAction,
};
