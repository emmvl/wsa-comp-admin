import ApiConstants from "../../../themes/apiConstants";



//////get the membership fee list in registration
function regDashboardListAction(offset, yearRefId) {
    const action = {
        type: ApiConstants.API_REG_DASHBOARD_LIST_LOAD,
        offset: offset,
        yearRefId: yearRefId,
    };
    return action;
}

function getAllCompetitionAction(yearRefId) {
    const action = {
        type: ApiConstants.API_GET_ALL_COMPETITION_LOAD,
        yearRefId
    }
    return action
}


export {
    regDashboardListAction,
    getAllCompetitionAction
};
