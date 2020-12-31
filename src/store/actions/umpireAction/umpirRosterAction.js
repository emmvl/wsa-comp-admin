import ApiConstants from "../../../themes/apiConstants";

function umpireRosterListAction(competitionID, status, refRoleId, paginationBody, sortBy,
    sortOrder , entityType) {
    const action = {
        type: ApiConstants.API_UMPIRE_ROSTER_LIST_LOAD,
        competitionID,
        status,
        refRoleId,
        paginationBody,
        sortBy,
        sortOrder,
        entityType

    };
    return action;
}

function umpireRosterOnActionClick(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_ROSTER_ACTION_CLICK_LOAD,
        data

    };
    return action;
}

export {
    umpireRosterListAction,
    umpireRosterOnActionClick
} 
