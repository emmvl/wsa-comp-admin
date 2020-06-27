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
function getCompetitionDrawsAction(yearRefId, competitionId, venueId, roundId,orgId ) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_DRAWS_LOAD,
        yearRefId, competitionId, venueId, roundId,
        orgId
    };
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
function updateCompetitionDraws(data, source, target, actionType, drawData) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_DRAWS_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        actionType: actionType,
        drawData: drawData
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
function updateCourtTimingsDrawsAction(data, source, target, actionType, drawData) {
    console.log(data)
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        actionType: actionType,
        drawData: drawData
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

function clearFixtureData(key) {
    const action = {
        type: ApiConstants.clearFixtureData,
        key
    }
    return action
}

////draws division grade names list
function getDivisionGradeNameLisAction(competitionId) {
    const action = {
        type: ApiConstants.API_DRAWS_DIVISION_GRADE_NAME_LIST_LOAD,
        competitionId: competitionId
    }
    return action
}

function publishDraws(competitionId, key) {
    const action = {
        type: ApiConstants.API_DRAW_PUBLISH_LOAD,
        competitionId: competitionId,
        key: key
    }
    return action
}

function matchesListDrawsAction(competitionId) {
    const action = {
        type: ApiConstants.API_DRAW_MATCHES_LIST_LOAD,
        competitionId: competitionId
    }
    return action
}

///// get Division by competition
function getDivisionAction(competitionId) {
    const action = {
        type: ApiConstants.API_GET_DIVISION_LOAD,
        competitionId: competitionId
    }
    return action
}

//get competition fixtures
function getCompetitionFixtureAction(yearId, competitionId, competitionDivisionGradeId) {
    const action = {
        type: ApiConstants.API_GET_FIXTURE_LOAD,
        yearId,
        competitionId,
        competitionDivisionGradeId
    }
    return action
}

////update competition drwas
function updateCompetitionFixtures(data, source, target, roundId, yearId, competitionId, competitionDivisionGradeId) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_FIXTURE_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        roundId: roundId,
        yearId, competitionId, competitionDivisionGradeId
    }
    return action
}


//unlockDrawsAction
function unlockDrawsAction(drawsId, roundId, venueCourtId) {
    const action = {
        type: ApiConstants.API_UPDATE_DRAWS_LOCK_LOAD,
        drawsId,
        roundId, venueCourtId

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
    clearDraws,
    getDivisionGradeNameLisAction,
    publishDraws,
    matchesListDrawsAction,
    getDivisionAction,
    getCompetitionFixtureAction,
    clearFixtureData,
    updateCompetitionFixtures,
    unlockDrawsAction
}