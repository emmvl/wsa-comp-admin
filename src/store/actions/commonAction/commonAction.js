import ApiConstants from "../../../themes/apiConstants";

function timeSlotInit() {
    const action = {
        type: ApiConstants.API_TIME_SLOT_INIT_LOAD,
    };

    return action;
}

function getCommonRefData(data) {
    const action = {
        type: ApiConstants.API_GET_COMMON_REF_DATA_LOAD,
        data: data
    };

    return action;
}

function addVenueAction(data) {
    const action = {
        type: ApiConstants.API_ADD_VENUE_LOAD,
        data: data
    };

    return action;
}


////Venue List for own competitionvenue and times
function venueListAction() {
    const action = {
        type: ApiConstants.API_VENUE_LIST_LOAD,
    };

    return action;
}

//////get the grades reference data 
function gradesReferenceListAction() {
    const action = {
        type: ApiConstants.API_GRADES_REFERENCE_LIST_LOAD,
    };
    return action;
}

//////get the favorite Team Reference Action
function favouriteTeamReferenceAction() {
    const action = {
        type: ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD,
    };
    return action;
}

//////get the Firebird Player Reference Action
function firebirdPlayerReferenceAction() {
    const action = {
        type: ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD,
    };
    return action;
}

//////get the Registration Other Info Reference Action
function registrationOtherInfoReferenceAction() {
    const action = {
        type: ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD,
    };
    return action;
}

//////get the Country Reference Action
function countryReferenceAction() {
    const action = {
        type: ApiConstants.API_COUNTRY_REFERENCE_LOAD,
    };
    return action;
}

//////get the Nationality Reference Action
function nationalityReferenceAction() {
    const action = {
        type: ApiConstants.API_NATIONALITY_REFERENCE_LOAD,
    };
    return action;
}

//////get the Nationality Reference Action
function heardByReferenceAction() {
    const action = {
        type: ApiConstants.API_HEARDBY_REFERENCE_LOAD,
    };
    return action;
}

//////get the Player Position Reference Action
function playerPositionReferenceAction() {
    const action = {
        type: ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD,
    };
    return action;
}

function searchVenueList(filterData) {
    const action = {
        type: ApiConstants.Search_Venue_updated,
        filterData: filterData
    }
    return action
}
function clearFilter() {
    const action = {
        type: ApiConstants.CLEAR_FILTER_SEARCH,
    }
    return action;

}

////Venue List for User Module
function venuesListAction(payload) {
    const action = {
        type: ApiConstants.API_VENUES_LIST_LOAD,
        data: payload
    };

    return action;
}

function venueDeleteAction(payload) {
    const action = {
        type: ApiConstants.API_VENUE_DELETE_LOAD,
        data: payload
    };

    return action;
}

function getGenderAction() {
    const action = {
        type: ApiConstants.API_GET_GENDER_LOAD,

    };
    return action
}


function getInvoice(competitionId, orgnaistationID, registrationid) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        competitionId,
        orgnaistationID,
        registrationid
    }
    console.log(action)
    return action
}

export {
    timeSlotInit,
    getCommonRefData,
    addVenueAction,
    venueListAction,
    gradesReferenceListAction,
    favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction,
    heardByReferenceAction,
    playerPositionReferenceAction,
    searchVenueList,
    clearFilter,
    venuesListAction,
    venueDeleteAction,
    getGenderAction,
    getInvoice
}
