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
function liveScoreScorerUpdate(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_SCORER,
        data: data,
        key: key,
    }

    return action;
}


//Devision action
function liveScoreAddEditScorer(body, teamId, existingScorerId, isEdit) {

    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_SCORER_LOAD,
        body,
        teamId,
        existingScorerId,
        isEdit
    };

    return action;
}


/// Assign matches action

function assignMatchesAction(competitionId, teamId, body) {
    const action = {
        type: ApiConstants.API_LIVESCORE_ASSIGN_MATCHES_LOAD,
        competitionId,
        teamId,
        body
    };

    return action;
}

/// Chnage assign status
function changeAssignStatus(index, records, roleId, teamID, scorerKey, teamkey, scorer_Id) {
    const action = {
        type: ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_LOAD,
        index,
        records,
        roleId,
        teamID,
        scorerKey,
        teamkey,
        scorer_Id
    };

    return action;
}


/// Chnage assign status
function unAssignMatcheStatus(index, records, scorerKey, teamkey) {
    const action = {
        type: ApiConstants.API_LIVESCORE_UNASSIGN_STATUS_LOAD,
        index,
        records,
        scorerKey,
        teamkey
    };

    return action;
}

export {
    liveScoreScorerListAction,
    liveScoreScorerUpdate,
    liveScoreAddEditScorer,
    assignMatchesAction,
    changeAssignStatus,
    unAssignMatcheStatus
};