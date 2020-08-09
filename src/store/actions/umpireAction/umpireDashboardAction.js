import ApiConstants from "../../../themes/apiConstants";

function getUmpireDashboardList(data) {
    const action = {
        type: ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_LOAD,
        data
    };
    return action;
}

function getUmpireDashboardVenueList(compId) {
    const action = {
        type: ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_LOAD,
        compId
    };
    return action;
}

function getUmpireDashboardDivisionList(competitionID) {
    const action = {
        type: ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_LOAD,
        competitionID
    };
    return action;
}

function umpireDashboardImportAction(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_IMPORT_LOAD,
        data
    }
    return action
}

function umpireRoundListAction(competitionID, divisionId) {
    const action = {
        type: ApiConstants.API_UMPIRE_ROUND_LIST_LOAD,
        competitionID,
        divisionId
    };
    return action;
}

function umpireDashboardUpdate(data) {
    const action = {
        type: ApiConstants.UPDATE_UMPIRE_DASHBOARD,
        data
    }
    return action
}

export {
    getUmpireDashboardList,
    getUmpireDashboardVenueList,
    getUmpireDashboardDivisionList,
    umpireDashboardImportAction,
    umpireRoundListAction,
    umpireDashboardUpdate
} 
