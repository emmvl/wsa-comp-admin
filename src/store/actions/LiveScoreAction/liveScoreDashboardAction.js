import ApiConstants from "../../../themes/apiConstants";

function liveScorePlayerListAction(competitionID, startDay, currentTime) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD,
        competitionID: competitionID,
        startDay:startDay,
        currentTime:currentTime
    };

    return action;
}

export {
    liveScorePlayerListAction
}
