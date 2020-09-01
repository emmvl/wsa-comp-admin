import ApiConstants from "themes/apiConstants";

function liveScorePlayerListAction(competitionID) {
    return {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD,
        competitionID,
    };
}

function liveScoreUpdatePlayerDataAction(data, key) {
    return {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER,
        data,
        key,
    };
}

function liveScoreAddEditPlayerAction(data, playerId, propsData) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD,
        data,
        playerId,
        propsData,
    };
}

function liveScorePlayerImportAction(competitionID, csvFile) {
    return {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_LOAD,
        competitionID,
        csvFile,
    };
}

function liveScorePlayerResetImportResultAction() {
    return {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_RESET,
    };
}

// Player list with pagination
function playerListWithPaginationAction(competitionID, offset, limit, search, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_LOAD,
        competitionID,
        offset,
        limit,
        search,
        sortBy,
        sortOrder,
    };
}

export {
    liveScorePlayerListAction,
    liveScoreAddEditPlayerAction,
    liveScoreUpdatePlayerDataAction,
    liveScorePlayerImportAction,
    liveScorePlayerResetImportResultAction,
    playerListWithPaginationAction,
};
