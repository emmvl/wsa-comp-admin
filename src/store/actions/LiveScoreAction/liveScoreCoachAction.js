import ApiConstants from "../../../themes/apiConstants";

function liveScoreCoachListAction(roleId, entityTypeId, entityId, search, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD,
        roleId,
        entityTypeId,
        entityId,
        search,
        sortBy,
        sortOrder,
    };
}

function liveScoreUpdateCoach(data, key) {
    return {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_COACH,
        data,
        key,
    };
}

function liveScoreAddEditCoach(data, teamId, exsitingManagerId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_LOAD,
        data,
        teamId,
        exsitingManagerId
    };
}

function liveScoreCoachSearch(data, competition_Id) {
    return {
        type: ApiConstants.API_LIVESCORE_COACH_SEARCH_LOAD,
        data,
        competition_Id
    };
}

function liveScoreClear() {
    return {
        type: ApiConstants.CLEAR_LIVESCORE_MANAGER
    };
}

function liveScoreCoachImportAction(payload) {
    return {
        type: ApiConstants.API_LIVE_SCORE_COACH_IMPORT_LOAD,
        payload
    };
}

export {
    liveScoreUpdateCoach,
    liveScoreCoachListAction,
    liveScoreAddEditCoach,
    liveScoreCoachSearch,
    liveScoreClear,
    liveScoreCoachImportAction
};
