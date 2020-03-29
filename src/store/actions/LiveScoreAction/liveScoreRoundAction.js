import ApiConstants from "../../../themes/apiConstants";


function liveScoreRoundListAction(competitionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ROUND_LIST_LOAD,
        competitionID
    };
    return action;
}

function liveScoreCreateRoundAction(roundName, sequence, competitionID, divisionId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CREATE_ROUND_LOAD,
        roundName: roundName,
        sequence: sequence,
        competitionID: competitionID,
        divisionId: divisionId
    };
    return action;
}

export {
    liveScoreRoundListAction,
    liveScoreCreateRoundAction
} 
