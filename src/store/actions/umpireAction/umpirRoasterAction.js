import ApiConstants from "../../../themes/apiConstants";

function umpireRoasterListAction(competitionID, status, refRoleId, paginationBody, sortBy,
    sortOrder) {
    const action = {
        type: ApiConstants.API_UMPIRE_ROASTER_LIST_LOAD,
        competitionID,
        status,
        refRoleId,
        paginationBody,
        sortBy,
        sortOrder

    };
    return action;
}

function umpireRoasterOnActionClick(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_ROASTER_ACTION_CLICK_LOAD,
        data

    };
    return action;
}

export {
    umpireRoasterListAction,
    umpireRoasterOnActionClick
} 
