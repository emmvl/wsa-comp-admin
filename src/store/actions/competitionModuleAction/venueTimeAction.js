import ApiConstants from "../../../themes/apiConstants";

function venueConstraintListAction(yearRefId, competitionUniqueKey, organisationId) {
    const action = {
        type: ApiConstants.API_VENUE_CONSTRAINTS_LIST_LOAD,
        yearRefId: yearRefId,
        competitionUniqueKey: competitionUniqueKey,
        organisationId: organisationId
    };
    return action;
}

function updateVenuListAction(data) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_LIST,
        data: data
    };

    return action;
}

function updateVenuAndTimeDataAction(data, index, key, contentType, tableIndex) {
    const action = {
        type: ApiConstants.API_UPDATE_VENUE_TIME_DATA,
        data: data,
        index: index,
        key: key,
        contentType: contentType,
        tableIndex: tableIndex
    };

    return action;
}

function refreshVenueFieldsAction(data) {
    const action = {
        type: ApiConstants.API_REFRESH_VENUE_FIELDS,
        data: data
    };

    return action;
}

function updateVenueConstraintsData(data, index, key, contentType, tableIndex) {
    const action = {
        type: ApiConstants.API_UPDATE_VENUE_CONSTRAINTS_DATA,
        data: data,
        index: index,
        key: key,
        contentType: contentType,
        tableIndex: tableIndex
    };
    return action;
}

function venueConstraintPostAction(data) {
    const action = {
        type: ApiConstants.API_VENUE_CONSTRAINT_POST_LOAD,
        data: data
    };
    return action;
}

function clearVenueTimesDataAction(competitionId) {
    const action = {
        type: ApiConstants.CLEAR_VENUE_TIMES_DATA,
        competitionId: competitionId
    };
    return action;
}
function removePrefencesObjectAction(index, data, key) {
    const action = {
        type: ApiConstants.DELETE_PREFENCE_OBJECT,
        index: index,
        data: data,
        key: key
    };
    return action;
}

function removeObjectAction(index, data, key) {
    const action = {
        type: ApiConstants.DELETE_PREFENCE_OBJECT_ADD_VENUE,
        index: index,
        data: data,
        key: key
    }
    return action
}

function venueByIdAction(data) {
    const action = {
        type: ApiConstants.API_VENUE_BY_ID_LOAD,
        data: data
    };
    return action;
}

function clearVenueDataAction(dataName) {
    const action = {
        type: ApiConstants.API_CLEARING_VENUE_DATA,
        dataName: dataName
    };
    return action;
}


export {
    venueConstraintListAction,
    updateVenuListAction,
    updateVenuAndTimeDataAction,
    refreshVenueFieldsAction,
    updateVenueConstraintsData,
    venueConstraintPostAction,
    clearVenueTimesDataAction,
    removePrefencesObjectAction,
    removeObjectAction,
    venueByIdAction,
    clearVenueDataAction
}
