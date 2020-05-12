import ApiConstants from "../../../themes/apiConstants";

function liveScoreUmpiresListAction(competitionId, body) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD,
        competitionId: competitionId,
        body: body
    }

    return action
}
export {
    liveScoreUmpiresListAction,
}
