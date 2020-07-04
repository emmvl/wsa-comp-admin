import ApiConstants from "../../../themes/apiConstants";

//Devision action
function liveScoreAddEditManager(data, teamId, exsitingManagerId) {

    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_LOAD,
        data,
        teamId,
        exsitingManagerId
    };

    return action;
}
// Manager list action
function liveScoreManagerListAction(roleId, entityTypeId, entityId, searchText) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD,
        roleId: roleId,
        entityTypeId: entityTypeId,
        entityId: entityId,
        searchText


    }
    return action
}

// Manager list action
function liveScoreUpdateManagerDataAction(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_MANAGER_DATA,
        data,
        key,
    }
    return action
}
function liveScoreManagerFilter(data) {
    const action = {
        type: ApiConstants.API_LIVESCORE_MANAGER_FILTER,
        payload: data
    }
    return action
}
function liveScoreClear() {
    const action = {
        type: ApiConstants.CLEAR_LIVESCORE_MANAGER
    }
    return action
}

function liveScoreManagerSearch(data, competition_Id) {
    const action = {
        type: ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD,
        data,
        competition_Id
    }
    return action
}
export {
    liveScoreAddEditManager,
    liveScoreManagerListAction,
    liveScoreUpdateManagerDataAction,
    liveScoreManagerFilter,
    liveScoreClear,
    liveScoreManagerSearch

};
