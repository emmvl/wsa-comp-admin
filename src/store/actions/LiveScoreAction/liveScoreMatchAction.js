import ApiConstants from "../../../themes/apiConstants";

function liveScoreMatchListAction(competitionID, start, offset, search, divisionId, roundName, teamIds) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_MATCH_LIST_LOAD,
        competitionID,
        start,
        offset,
        search,
        divisionId,
        roundName,
        teamIds,
    }
    return action;
}

function liveScoreAddEditMatchAction(matchId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_LOAD,
        matchId: matchId
    }
    return action;
}

function liveScoreAddMatchAction() {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_MATCH,
    }
    return action;
}

function liveScoreUpdateMatchAction(data, key, contentType) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_MATCH,
        data: data,
        key: key,
        contentType: contentType,
    }
    console.log(action)
    return action;
}

function liveScoreCreateMatchAction(data, competitionId, key, isEdit, team1resultId, team2resultId, matchStatus, endTime, umpireKey, umpireArr, scorerData, recordUmpireType) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CREATE_MATCH_LOAD,
        data,
        competitionId,
        key,
        isEdit,
        team1resultId,
        team2resultId,
        matchStatus,
        endTime,
        umpireKey,
        umpireArr,
        scorerData,
        recordUmpireType
    }
    return action;
}

function clearMatchAction() {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CLEAR_MATCH_DATA
    }
    return action;
}

function liveScoreDeleteMatch(matchId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_DELETE_MATCH_LOAD,
        matchId
    }
    return action;
}


function getCompetitonVenuesList(competitionID, searchValue) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_LOAD,
        competitionID,
        searchValue
    }
    return action

}

function liveScoreMatchImportAction(competitionID, csvFile) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_LOAD,
        competitionID,
        csvFile
    }
    return action
}

function liveScoreGetMatchDetailInitiate(data, isLineup) {
    return {
        type: ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_INITAITE,
        payload: data,
        isLineup: isLineup
    }
}

function liveScoreClubListAction(competitionId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_CLUB_LIST_LOAD,
        competitionId
    }
}

function searchFilterAction(search, key) {
    const action = {
        type: ApiConstants.API_LIVE_MATCH_LOCAL_SEARCH,
        search: search,
        key: key
    }
    return action
}

function changePlayerLineUpAction(data) {
    const action = {
        type: ApiConstants.CHANGE_PLAYER_LINEUP_LOAD,
        data
    }
    return action
}


function changeMatchBulkScore(value, key, index) {
    const action = {
        type: ApiConstants.CHANGE_BULK_MATCH_SCORE,
        value: value,
        key: key,
        index: index
    }
    return action
}


function bulkScoreUpdate(data) {
    const action = {
        type: ApiConstants.BULK_SCORE_UPDATE_LOAD,
        data: data
    }

    return action

}

function onCancelBulkScoreUpdate(){
    const action = {
        type: ApiConstants.BULK_SCORE_UPDATE_CANCEL,
    }

    return action
}

export {
    liveScoreMatchListAction,
    liveScoreAddEditMatchAction,
    liveScoreAddMatchAction,
    liveScoreUpdateMatchAction,
    liveScoreCreateMatchAction,
    clearMatchAction,
    liveScoreDeleteMatch,
    getCompetitonVenuesList,
    liveScoreMatchImportAction,
    liveScoreGetMatchDetailInitiate,
    liveScoreClubListAction,
    searchFilterAction,
    changePlayerLineUpAction,
    changeMatchBulkScore,
    bulkScoreUpdate,
    onCancelBulkScoreUpdate
};
