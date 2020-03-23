import ApiConstants from "../../../themes/apiConstants";

function liveScoreScorerListAction(competitionId, roleId, data) {

    const action = {
        type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_LOAD,
        competitionId: competitionId,
        roleId: roleId,
        body: data

    }
    return action
}

export {
    liveScoreScorerListAction
};