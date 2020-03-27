import ApiConstants from "../../../themes/apiConstants";

function liveScorePlayerListAction(competitionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD,
        competitionID: competitionID
    };

    return action;
}

function liveScoreUpdatePlayerDataAction(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER,
        data,
        key
    };

    return action;
}


function liveScoreAddEditPlayerAction(data, playerId, propsData) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD,
        data,
        playerId,
        propsData,
    };
    return action;
}

function liveScorePlayerImportAction(competitionID, csvFile) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_LOAD,
        competitionID,
        csvFile

    }
    return action
}

export {
    liveScorePlayerListAction,
    liveScoreAddEditPlayerAction,
    liveScoreUpdatePlayerDataAction,
    liveScorePlayerImportAction
};
