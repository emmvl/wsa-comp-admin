import ApiConstants from "themes/apiConstants";

function getUmpireDashboardList(data) {
    return {
        type: ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_LOAD,
        data,
    };
}

function getUmpireDashboardVenueList(compId) {
    return {
        type: ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_LOAD,
        compId,
    };
}

function getUmpireDashboardDivisionList(competitionID) {
    return {
        type: ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_LOAD,
        competitionID,
    };
}

function umpireDashboardImportAction(data) {
    return {
        type: ApiConstants.API_UMPIRE_IMPORT_LOAD,
        data,
    };
}

function umpireDashboardResetImportResultAction() {
    return {
        type: ApiConstants.API_UMPIRE_IMPORT_RESET,
    };
}

function umpireRoundListAction(competitionID, divisionId) {
    return {
        type: ApiConstants.API_UMPIRE_ROUND_LIST_LOAD,
        competitionID,
        divisionId,
    };
}

function umpireDashboardUpdate(data) {
    return {
        type: ApiConstants.UPDATE_UMPIRE_DASHBOARD,
        data,
    };
}

export {
    getUmpireDashboardList,
    getUmpireDashboardVenueList,
    getUmpireDashboardDivisionList,
    umpireDashboardImportAction,
    umpireDashboardResetImportResultAction,
    umpireRoundListAction,
    umpireDashboardUpdate,
}
