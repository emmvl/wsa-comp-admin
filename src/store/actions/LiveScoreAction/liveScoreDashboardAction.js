import ApiConstants from "../../../themes/apiConstants";

function liveScorePlayerListAction(competitionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD,
        competitionID: competitionID
    };

    return action;
}

export {
    liveScorePlayerListAction
}
