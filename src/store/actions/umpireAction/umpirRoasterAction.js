import ApiConstants from "../../../themes/apiConstants";

function umpireRoasterListAction(competitionID, status, refRoleId, paginationBody) {
    const action = {
        type: ApiConstants.API_UMPIRE_ROASTER_LIST_LOAD,
        competitionID,
        status,
        refRoleId,
        paginationBody

    };
    console.log(action , "actionactionaction")
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
