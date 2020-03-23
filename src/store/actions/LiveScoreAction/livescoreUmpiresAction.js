import ApiConstants from "../../../themes/apiConstants";

function liveScoreUmpiresListAction(competitionId, offset) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD,
        competitionId: competitionId,
        offset: offset
    }

    return action
}
export {
    liveScoreUmpiresListAction,
}
