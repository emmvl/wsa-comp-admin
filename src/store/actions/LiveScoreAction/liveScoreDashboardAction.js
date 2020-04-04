import ApiConstants from "../../../themes/apiConstants";

function liveScorePlayerListAction(competitionID, startDay) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD,
        competitionID: competitionID,
        startDay:startDay
    };

    return action;
}

export {
    liveScorePlayerListAction
}
