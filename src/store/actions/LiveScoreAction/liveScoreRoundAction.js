import ApiConstants from "../../../themes/apiConstants";

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

export default liveScoreCreateRoundAction;
