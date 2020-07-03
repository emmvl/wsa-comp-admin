import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNotNullOrEmptyString, deepCopyFunction } from "../../../util/helpers";
import moment from 'moment'


const newQuickComp = {
    competitionName: "",
    competitionVenues: [],
    divisions: [],
    draws: [],
    timeslots: []
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
        "competitionDivisionId": 0,
        "divisionName": "",
        "grades": [
            {
                "competitionDivisionGradeId": 0,
                "gradeName": "",
                "noOfTeams": ""
            }
        ]
    }],
    competitionName: "",
    competitionDate: "",
    quick_CompetitionArr: [],
    quick_CompetitionYearArr: [],
    onQuickCompLoad: false,
    selectedCompetition: "",
    quickComptitionDetails: newQuickComp

};
///sort competition data
function sortCompArray(compListData) {
    let isSortedArray = []
    const sortAlphaNum = (a, b) => a.competitionName.localeCompare(b.competitionName, 'en', { numeric: true })
    isSortedArray = compListData.sort(sortAlphaNum)
    return isSortedArray
}

//set comeptitionvenue object
function createCompetitionVenuesData(value) {
    let VenueObject = {
        "competitionVenueId": 0,
        "venueId": ""
    }
    let selectVenueArray = []
    if (value.length > 0) {
        for (let i in value) {
            VenueObject = {
                "competitionVenueId": 0,
                "venueId": value[i]
            }
            selectVenueArray.push(VenueObject)

        }

    }
    return selectVenueArray
}

function getCompetitionResult(result, selectedVenues) {
    let selectVenues = result.competitionVenues
    if (selectVenues.length > 0) {
        for (let i in selectVenues) {
            selectedVenues.push(selectVenues[i].venueId)
        }
    }
    return selectedVenues
}

function checkTimeSlotStatus(timeSlotobj, updatedtimeSlotArr) {
    let obj = {
        status: false,
        index: null
    }
    for (let i in updatedtimeSlotArr) {
        if (timeSlotobj.dayRefId === updatedtimeSlotArr[i].dayRefId) {
            obj = {
                status: true,
                index: [i]
            }
            break;
        }
    }
    return obj
}

// timeslot data
function createTimeslotData(data) {
    let updatedtimeSlotArr = []
    if (data.length > 0) {
        for (let i in data) {
            let matchUpdatedTimeSlot = data[i]
            let timeSlotStatusData = checkTimeSlotStatus(matchUpdatedTimeSlot, updatedtimeSlotArr)
            if (timeSlotStatusData.status == true) {
                let timeslotUpdatedArrayValue = {
                    "startTime": matchUpdatedTimeSlot.startTime,
                    "sortOrder": matchUpdatedTimeSlot.sortOrder,

                }
                updatedtimeSlotArr[timeSlotStatusData.index].startTime.push(JSON.parse(JSON.stringify(timeslotUpdatedArrayValue)))
            }
            else {
                let timeslotUpdatedArray = {
                    "startTime": matchUpdatedTimeSlot.startTime,
                    "sortOrder": matchUpdatedTimeSlot.sortOrder,
                }

                let mainobj = {
                    "competitionVenueTimeslotsDayTimeId": matchUpdatedTimeSlot.competitionVenueTimeslotsDayTimeId,
                    "dayRefId": matchUpdatedTimeSlot.dayRefId,
                    "startTime": [timeslotUpdatedArray]
                }
                updatedtimeSlotArr.push(JSON.parse(JSON.stringify(mainobj)))

            }
        }
    }
    return updatedtimeSlotArr
}


function QuickCompetitionState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_UPDATE_QUICKCOMPETITION_COMPETITION:
            if (action.key == 'add') {
                state.competitionName = action.value
            }
            else if (action.key == "clear") {
                state.competitionName = ""
                state.competitionDate = ""
            }
            else if (action.key == 'allData') {
                state.selectedVenues = []
                state.timeSlot = []
                state.division = []
                state.competitionName = []
            }
            else if (action.key == 'date') {
                state.competitionDate = moment(action.value).format("YYYY-MM-DD")
            }
            return {
                ...state
            }


        ////Competition Dashboard Case
        case ApiConstants.Update_QuickCompetition_Data:
            state.quickComptitionDetails.competitionVenues = createCompetitionVenuesData(JSON.parse(JSON.stringify(action.item)))
            state.selectedVenues = action.item
            return { ...state, onLoad: true };

        case ApiConstants.API_UPDATE_QUICKCOMPETITION_TIMESLOT:
            if (action.key == "add") {
                let timeSlotobject = {
                    "competitionVenueTimeslotsDayTimeId": 0,
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
            }
            if (action.key == "day") {
                state.timeSlot[action.index].dayRefId = action.value
            }
            return {
                ...state
            }

        case ApiConstants.API_UPDATE_QUICKCOMPETITION_Division:
            if (action.key == "addDivision") {
                let divisionObject = {
                    "competitionDivisionId": 0,
                    "divisionName": "",
                    "grades": [
                        {
                            "competitionDivisionGradeId": 0,
                            "gradeName": "",
                            "noOfTeams": ""
                        }
                    ]
                }
                state.division.push(divisionObject)
            }

            if (action.key == "addGrade") {
                let gradeObject = {
                    "competitionDivisionGradeId": 0,
                    "gradeName": "",
                    "noOfTeams": ""
                }
                state.division[action.index].grades.push(gradeObject)
            }
            if (action.key == "removeDivision") {
                state.division.splice(action.index, 1)
            }
            if (action.key == "removeGrade") {
                state.division[action.index].grades.splice(action.gradeIndex, 1)
            }
            if (action.key == "divisionName") {
                state.division[action.index].divisionName = action.value
            }
            if (action.key == "noOfTeams") {
                state.division[action.index].grades[action.gradeIndex].noOfTeams = action.value
            }
            if (action.key == "gradeName") {
                state.division[action.index].grades[action.gradeIndex].gradeName = action.value
            }
            return {
                ...state
            }

        case ApiConstants.API_CREATE_QUICK_COMPETITION_LOAD:
            state.selectedCompetition = ""
            return {
                ...state,
                onLoad: true,
            }
        case ApiConstants.API_CREATE_QUICK_COMPETITION_SUCCESS:
            let AllCompListData = JSON.parse(JSON.stringify(state.quick_CompetitionArr))
            let newCompetitionData = JSON.parse(JSON.stringify(action.result))
            let newCompObj = {
                competitionId: newCompetitionData.competitionId,
                competitionName: newCompetitionData.competitionName
            }
            state.selectedCompetition = newCompetitionData.competitionId
            AllCompListData.push(newCompObj)
            let sortCompData = sortCompArray(AllCompListData)
            state.quick_CompetitionArr = sortCompData
            state.onQuickCompLoad = false
            return {
                ...state,
                onLoad: false
            }
        case ApiConstants.API_QUICK_COMPETITION_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_QUICK_COMPETITION_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        ////////post/save quick competition division
        case ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };
        case ApiConstants.API_YEAR_AND_QUICK_COMPETITION_LOAD:
            return { ...state, onLoad: true }
        case ApiConstants.API_YEAR_AND_QUICK_COMPETITION_SUCCESS:
            return {
                ...state,
                quick_CompetitionArr: action.competetionListResult,
                quick_CompetitionYearArr: action.yearList,
                onLoad: false
            }

        case ApiConstants.API_GET_QUICK_COMPETITION_LOAD:
            return { ...state, onQuickCompLoad: true }

        case ApiConstants.API_GET_QUICK_COMPETITION_SUCCESS:
            let detailsResult = JSON.parse(JSON.stringify(action.result))
            let competiitonResult = getCompetitionResult(JSON.parse(JSON.stringify(action.result)), state.selectedVenues)
            detailsResult.competitionVenues = createCompetitionVenuesData(JSON.parse(JSON.stringify(competiitonResult)))
            state.timeSlot = createTimeslotData(JSON.parse(JSON.stringify(action.result.timeslots)))
            state.selectedVenues = competiitonResult
            state.division = detailsResult.divisions
            state.onQuickCompLoad = false
            return {
                ...state,
                quickComptitionDetails: detailsResult,
                // onQuickCompLoad: false
            }


        case ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_LOAD:
            return { ...state, onQuickCompLoad: true, error: null }

        case ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_SUCCESS:
            return {
                ...state,
                result: action.result,
                onLoad: false,
                onQuickCompLoad: false,
                error: null,
                status: action.status
            }

        ////update quick competition
        case ApiConstants.API_UPDATE_QUICK_COMPETITION_LOAD:
            return { ...state, onLoad: true, onQuickCompLoad: true }

        case ApiConstants.API_UPDATE_QUICK_COMPETITION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null,
                onQuickCompLoad: false
            }



        default:
            return state;
    }
}


export default QuickCompetitionState;
