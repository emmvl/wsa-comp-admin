import ApiConstants from "../../../themes/apiConstants";

function liveScoreDashboardListAction(competitionID, startDay, currentTime, competitionOrganisationId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD,
        competitionID: competitionID,
        startDay: startDay,
        currentTime: currentTime,
        competitionOrganisationId
    };

    return action;
}

export {
    liveScoreDashboardListAction
}
