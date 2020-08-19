import ApiConstants from "../../../themes/apiConstants";

// Division action
function getLiveScoreDivisionList(competitionID, compKey, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD,
        competitionID,
        compKey,
        sortBy,
        sortOrder,
    };
}

//liveScoreUpdateDivisionAction
function liveScoreUpdateDivisionAction(data, key, contentType) {
    return {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_DIVISION,
        data,
        key,
        contentType,
    };
}

//createDivisionAction
function createDivisionAction(name, divisionName, gradeName, competitionId, divisionId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_LOAD,
        name,
        divisionName,
        gradeName,
        competitionId,
        divisionId,
    };
}

//liveScoreDeleteDivision
function liveScoreDeleteDivision(divisionId) {
    return {
        type: ApiConstants.API_LIVE_SCORE_DELETE_DIVISION_LOAD,
        divisionId,
    };
}

function liveScoreDivisionImportAction(payload) {
    return {
        type: ApiConstants.API_LIVE_SCORE_DIVISION_IMPORT_LOAD,
        payload,
    };
}

//Division action
function getMainDivisionListAction(competitionID, offset, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_LIVE_SCORE_MAIN_DIVISION_LIST_LOAD,
        competitionID,
        offset,
        sortBy,
        sortOrder
    };
}

export {
    getLiveScoreDivisionList,
    liveScoreUpdateDivisionAction,
    createDivisionAction,
    liveScoreDeleteDivision,
    liveScoreDivisionImportAction,
    getMainDivisionListAction,
};
