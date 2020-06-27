import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNotNullOrEmptyString, deepCopyFunction } from "../../../util/helpers";
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
    selectedVenues: [],
    timeSlot: [{
        "dayRefId": 1,
        "startTime": [{
            "startTime": "00:00",
            "sortOrder": 0,
        }]

    }
    ],
    division: [{
        "division": "",
        "grade": [{
            "grade": "",
            "sortOrder": 0,
            "team": "",

        }]
    }
    ],
    competitionName: ""
};



function QuickCompetitionState(state = initialState, action) {

    switch (action.type) {


        case ApiConstants.API_UPDATE_QUICKCOMPETITION_COMPETITION:
            if (action.key == 'add') {
                state.competitionName = action.value
            }
            else {
                state.competitionName = ""
            }

            return {
                ...state
            }


        ////Competition Dashboard Case
        case ApiConstants.Update_QuickCompetition_Data:
            state.selectedVenues = action.item
            return { ...state, onLoad: true };

        case ApiConstants.API_UPDATE_QUICKCOMPETITION_TIMESLOT:
            if (action.key == "add") {
                let timeSlotobject = {
                    "dayRefId": 1,
                    "startTime": [{
                        "startTime": "00:00",
                        "sortOrder": 0,

                    }]
                }
                state.timeSlot.push(timeSlotobject)
            }

            if (action.key == "addStartTime") {
                let startTimeObject = {
                    "startTime": "00:00",
                    "sortOrder": 0,
                }
                state.timeSlot[action.index].startTime.push(startTimeObject)
            }
            if (action.key == "remove") {
                state.timeSlot.splice(action.index, 1)
            }
            if (action.key == "removeStartTime") {
                state.timeSlot[action.index].startTime.splice(action.timeIndex, 1)
            }
            if (action.key == "changeTime") {
                state.timeSlot[action.index].startTime[action.timeindex].startTime = action.value
                // console.log(state.timeSlot[action.index].startTime[action.timeindex].startTime == action.value)
            }
            if (action.key == "day") {
                state.timeSlot[action.index].dayRefId = action.value
            }
            return {
                ...state
            }

        case ApiConstants.API_UPDATE_QUICKCOMPETITION_Division:
            console.log(action)
            if (action.key == "addDivision") {
                let divisionObject = {
                    "division": "",

                    "grade": [{
                        "grade": "",
                        "sortOrder": 0,
                        "team": "",

                    }]
                }
                state.division.push(divisionObject)
            }

            if (action.key == "addGrade") {
                let gradeObject = {
                    "grade": "",
                    "sortOrder": 0,
                    "team": "",
                }
                state.division[action.index].grade.push(gradeObject)
            }
            if (action.key == "removeDivision") {
                state.division.splice(action.index, 1)
            }
            if (action.key == "removeGrade") {
                state.division[action.index].grade.splice(action.gradeIndex, 1)
            }
            if (action.key == "division") {
                state.division[action.index].division = action.value
                // console.log(state.timeSlot[action.index].startTime[action.timeindex].startTime == action.value)
            }
            if (action.key == "team") {
                state.division[action.index].grade[action.gradeIndex].team = action.value
            }
            if (action.key == "grade") {
                state.division[action.index].grade[action.gradeIndex].grade = action.value
            }
            return {
                ...state
            }




        default:
            return state;
    }
}


export default QuickCompetitionState;
