import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString, deepCopyFunction } from "../../../util/helpers";
////Venue Constraints List Object /////////////Start


////Venue Constraints List Object /////////////End

let objData = {
    // "competitionUniqueKey": "",
    // "yearRefId": "",
    "organisationId": 1,
    "venues": [],
    "nonPlayingDates": [],
    "venueConstraintId": 0,
    "courtRotationRefId": 8,
    "homeTeamRotationRefId": 3,
    "courtPreferences": [],
    // "courtDivisionPref": [],
    // "courtGradePref": []
}

var venueDataObj = {
    competitionUniqueKey: '',
    yearRefId: 1,
    competitionMembershipProductDivisionId: 1,
    venueId: 0,
    name: "",
    shortName: "",
    street1: "",
    street2: "",
    suburb: "",
    stateRefId: "",
    postalCode: "",
    statusRefId: 1,
    contactNumber: '',
    organisations: [],
    gameDays: [],
    affiliate: false,
    affiliateData: [],
    venueCourts: [],
    expandedRowKeys: [],
}

const initialState = {
    onLoad: false,
    venueEditOnLoad: false,
    error: null,
    result: [],
    status: 0,
    selectedVenues: []
};



function QuickCompetitionState(state = initialState, action) {

    switch (action.type) {
        ////Competition Dashboard Case
        case ApiConstants.Update_QuickCompetition_Data:
            state.selectedVenues = action.item
            return { ...state, onLoad: true };



        default:
            return state;
    }
}


export default QuickCompetitionState;
