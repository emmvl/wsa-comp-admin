import ApiConstants from "../../../themes/apiConstants";

// function liveScoreLaddersDivisionAction(competitionID) {
//     const action = {
//         type: ApiConstants.API_LIVE_SCORE_LADDERS_DIVISION_LOAD,
//         competitionID:competitionID
//     };
//     return action;

// }

function liveScoreLaddersListAction(competitionID, divisionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD,

        competitionID: competitionID,
        divisionID: divisionID
    };
    return action;
}

export {
    liveScoreLaddersListAction
}