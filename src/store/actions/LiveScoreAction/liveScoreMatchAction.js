import ApiConstants from "themes/apiConstants";

function liveScoreMatchListAction(competitionID, start, offset, search, divisionId, roundName, teamIds, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_LIVE_SCORE_MATCH_LIST_LOAD,
        competitionID,
        start,
        offset,
        search,
        divisionId,
        roundName,
        teamIds,
        sortBy,
        sortOrder,
    };
}

function liveScoreAddEditMatchAction(matchId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_LOAD,
        matchId,
    };
}

function liveScoreAddMatchAction() {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_MATCH,
    };
}

function liveScoreUpdateMatchAction(data, key, contentType) {
    return {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_MATCH,
        data,
        key,
        contentType,
    };
}

function liveScoreCreateMatchAction(data, competitionId, key, isEdit, team1resultId, team2resultId, matchStatus, endTime, umpireKey, umpireArr, scorerData, recordUmpireType, screenName) {
    return {
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
        recordUmpireType,
        screenName
    };
}

function clearMatchAction() {
    return {
        type: ApiConstants.API_LIVE_SCORE_CLEAR_MATCH_DATA,
    };
}

function liveScoreDeleteMatch(matchId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_DELETE_MATCH_LOAD,
        matchId,
    };
}

function getCompetitionVenuesList(competitionID, searchValue) {
    return {
        type: ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_LOAD,
        competitionID,
        searchValue,
    };
}

function liveScoreMatchImportAction(competitionID, csvFile) {
    return {
        type: ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_LOAD,
        competitionID,
        csvFile,
    };
}

function liveScoreMatchResetImportResultAction() {
    return {
        type: ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_RESET,
    };
}

function liveScoreGetMatchDetailInitiate(data, isLineup) {
    return {
        type: ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_INITAITE,
        payload: data,
        isLineup: isLineup,
    };
}

function liveScoreClubListAction(competitionId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_CLUB_LIST_LOAD,
        competitionId,
    };
}

function searchFilterAction(search, key) {
    return {
        type: ApiConstants.API_LIVE_MATCH_LOCAL_SEARCH,
        search,
        key,
    };
}

function changePlayerLineUpAction(data) {
    return {
        type: ApiConstants.CHANGE_PLAYER_LINEUP_LOAD,
        data,
    };
}

function changeMatchBulkScore(value, key, index) {
    return {
        type: ApiConstants.CHANGE_BULK_MATCH_SCORE,
        value,
        key,
        index,
    };
}

function bulkScoreUpdate(data) {
    return {
        type: ApiConstants.BULK_SCORE_UPDATE_LOAD,
        data,
    };
}

function onCancelBulkScoreUpdate() {
    return {
        type: ApiConstants.BULK_SCORE_UPDATE_CANCEL,
    };
}

function liveScoreAddLiveStreamAction(data) {
    return {
        type: ApiConstants.API_ADD_LIVE_STREM_LOAD,
        data,
    };
}

function clearDataOnCompChangeAction() {
    return {
        type: ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE,
    };
}

export {
    liveScoreMatchListAction,
    liveScoreAddEditMatchAction,
    liveScoreAddMatchAction,
    liveScoreUpdateMatchAction,
    liveScoreCreateMatchAction,
    clearMatchAction,
    liveScoreDeleteMatch,
    getCompetitionVenuesList,
    liveScoreMatchImportAction,
    liveScoreMatchResetImportResultAction,
    liveScoreGetMatchDetailInitiate,
    liveScoreClubListAction,
    searchFilterAction,
    changePlayerLineUpAction,
    changeMatchBulkScore,
    bulkScoreUpdate,
    onCancelBulkScoreUpdate,
    liveScoreAddLiveStreamAction,
    clearDataOnCompChangeAction,
};
