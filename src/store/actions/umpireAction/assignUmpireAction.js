import ApiConstants from "../../../themes/apiConstants";

//////get the umpire assign list
function getAssignUmpireListAction(competitionId, body) {
    const action = {
        type: ApiConstants.API_GET_ASSIGN_UMPIRE_LIST_LOAD,
        competitionId,
        body
    };
    return action;
}

//////////assign umpire to a match
function assignUmpireAction(payload, index, umpireKey, rosterLocked,sameUmpire) {
    const action = {
        type: ApiConstants.API_ASSIGN_UMPIRE_FROM_LIST_LOAD,
        payload,
        index,
        umpireKey,
        rosterLocked,
        sameUmpire
    };
    return action;
}

////unassign umpire from the match(delete)
function unassignUmpireAction(rosterId, index, umpireKey, rosterLocked) {
    const action = {
        type: ApiConstants.API_UNASSIGN_UMPIRE_FROM_LIST_LOAD,
        rosterId,
        index,
        umpireKey,
        rosterLocked
    };
    return action;
}

export {
    getAssignUmpireListAction,
    assignUmpireAction,
    unassignUmpireAction,
} 
