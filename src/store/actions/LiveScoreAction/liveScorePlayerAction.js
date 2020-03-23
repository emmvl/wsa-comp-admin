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


function liveScoreAddEditPlayerAction(data, playerId, playerImage, temaViewPlayer, propsData) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD,
        data,
        playerId,
        playerImage,
        temaViewPlayer,
        propsData,
    };
    return action;
}

export {
    liveScorePlayerListAction,
    liveScoreAddEditPlayerAction,
    liveScoreUpdatePlayerDataAction
};
