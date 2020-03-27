import ApiConstants from "../../../themes/apiConstants";

///// get Venue by competition

function getCompetitionVenue(competitionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_VENUES_LOAD,
        competitionId: competitionId
    }
    return action
}


/////get competition draws
function getCompetitionDrawsAction(yearRefId, competitionId, venueId, roundId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_DRAWS_LOAD,
        yearRefId, competitionId, venueId, roundId
    };
    console.log("is colled")
    return action;
}


///get rounds in the competition draws
function getDrawsRoundsAction(yearRefId, competitionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_LOAD,
        yearRefId, competitionId
    };
    return action;
}

////update competition drwas
function updateCompetitionDraws(data, source, target, actionType) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_DRAWS_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        actionType: actionType
    }
    return action
}

/// Save Draws
function saveDraws(yearId, competitionId, drawsMasterId) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_SAVE_DRAWS_LOAD,
        yearId: yearId,
        competitionId: competitionId,
        drawsMasterId: drawsMasterId
    }
    return action
}

/////update draws court timing where N/A is there
function updateCourtTimingsDrawsAction(data, source, target, actionType) {
    console.log(data)
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        actionType: actionType
    }
    return action
}

function dateSelectionRounds(data) {
    const action = {
        type: ApiConstants.UPDATE_ROUNDS_TIME,
        data
    }
    return action

}
function clearDraws(key) {
    const action = {
        type: ApiConstants.cleardrawsData,
        key
    }
    return action
}

export {
    getCompetitionDrawsAction,
    getDrawsRoundsAction,
    updateCompetitionDraws,
    saveDraws,
    getCompetitionVenue,
    updateCourtTimingsDrawsAction,
    dateSelectionRounds,
    clearDraws
}