import ApiConstants from "themes/apiConstants";

function liveScoreCoachListAction(roleId, entityTypeId, entityId, search, offset, sortBy, sortOrder, isParent, competitionId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD,
        roleId,
        entityTypeId,
        entityId,
        search,
        offset,
        sortBy,
        sortOrder,
        isParent,
        competitionId
    };
}

function liveScoreUpdateCoach(data, key) {
    return {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_COACH,
        data,
        key,
    };
}

function liveScoreAddEditCoach(data, teamId, existingManagerId, compOrgId, isParent) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_LOAD,
        data,
        teamId,
        existingManagerId,
        compOrgId,
        isParent
    };
}

function liveScoreCoachSearch(data, competitionId) {
    return {
        type: ApiConstants.API_LIVESCORE_COACH_SEARCH_LOAD,
        data,
        competitionId,
    };
}

function liveScoreClear() {
    return {
        type: ApiConstants.CLEAR_LIVESCORE_MANAGER,
    };
}

function liveScoreCoachImportAction(payload) {
    return {
        type: ApiConstants.API_LIVE_SCORE_COACH_IMPORT_LOAD,
        payload,
    };
}

function liveScoreCoachResetImportResultAction() {
    return {
        type: ApiConstants.API_LIVE_SCORE_COACH_IMPORT_RESET,
    };
}

export {
    liveScoreUpdateCoach,
    liveScoreCoachListAction,
    liveScoreAddEditCoach,
    liveScoreCoachSearch,
    liveScoreClear,
    liveScoreCoachImportAction,
    liveScoreCoachResetImportResultAction,
};
