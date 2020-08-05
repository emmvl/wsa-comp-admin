import ApiConstants from "../../../themes/apiConstants";

// Devision action
function liveScoreAddEditManager(data, teamId, exsitingManagerId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_LOAD,
        data,
        teamId,
        exsitingManagerId
    };
}

// Manager list action
function liveScoreManagerListAction(roleId, entityTypeId, entityId, searchText, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD,
        roleId,
        entityTypeId,
        entityId,
        searchText,
        sortBy,
        sortOrder,
    };
}

// Manager list action
function liveScoreUpdateManagerDataAction(data, key) {
    return {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_MANAGER_DATA,
        data,
        key,
    };
}

function liveScoreManagerFilter(payload) {
    return {
        type: ApiConstants.API_LIVESCORE_MANAGER_FILTER,
        payload,
    };
}

function liveScoreClear() {
    return {
        type: ApiConstants.CLEAR_LIVESCORE_MANAGER
    };
}

function liveScoreManagerSearch(data, competition_Id) {
    return {
        type: ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD,
        data,
        competition_Id
    };
}

function liveScoreManagerImportAction(payload) {
    return {
        type: ApiConstants.API_LIVE_SCORE_MANAGER_IMPORT_LOAD,
        payload
    };
}

export {
    liveScoreAddEditManager,
    liveScoreManagerListAction,
    liveScoreUpdateManagerDataAction,
    liveScoreManagerFilter,
    liveScoreClear,
    liveScoreManagerSearch,
    liveScoreManagerImportAction,
};
