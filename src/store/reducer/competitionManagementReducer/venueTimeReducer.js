import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
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
    venuData: venueDataObj,
    venue: [],
    selectedVenueId: [],
    venueConstrainstData: objData,
    venueConstrainstListData: null, // final get object
    homeTeamRotation: [],
    courtArray: [], //// court list
    venueList: [], // all venue list
    allocateToSameCourt: "",
    evenRotation: 1,
    homeRotation: "",
    courtId: [], /// 
    courtRotation: [],
    radioButton: "noPreference",
    divisionList: null,
    gradeList: null,
    /////venue constraints post 
    venues: [],
    nonPlayingDates: [],
    courtPreferences: [],
    courtDivisionPref: [],
    courtGradePref: [],
    venuePost: [],
    selectedRadioBtn: '',
    venueConstrainstPostData: null,
    competitionUniqueKey: null,
    yearRefId: null,
    venuePostResult: null,
    courtPreferencesPost: [],
    onVenueDataClear: false,
    courtPrefArrayStore: null,
    searchVenueList: []
};

///
function getOrganisation(key) {
    let organisationsArr = []
    let organisationsObj = null
    for (let i in key) {
        organisationsObj = {
            "venueOrganisationId": 0,
            'organisationId': key[i]
        }
        organisationsArr.push(organisationsObj)

    }
    return organisationsArr
}

function getEditOrganisation(key, organisationData) {
    let organisationsArr = []
    let organisationsObj = null;
    for (let i in key) {
        let venueOrganisation = organisationData.find(x => x.organisationId == key[i]);
        organisationsObj = {
            "venueOrganisationId": venueOrganisation == undefined ? 0 : venueOrganisation.venueOrganisationId,
            'organisationId': key[i]
        }
        organisationsArr.push(organisationsObj)

    }
    return organisationsArr
}

////genrate table key
function generateTableKey(data) {
    let arrayKey = data.length + 1
    return arrayKey
}

/// Generate court array
function generateCourtData(courtData) {
    let courtselectedArr = []
    for (let i in courtData) {
        let courtDetails = courtData[i].venueCourts
        if (isArrayNotEmpty(courtDetails)) {
            for (let j in courtDetails) {
                let object = {
                    lat: courtDetails[j].lat,
                    lng: courtDetails[j].lng,
                    courtNumber: courtDetails[j].courtNumber,
                    venueId: courtDetails[j].venueCourtId,
                    availabilities: courtDetails[j].availabilities,
                    name: courtData[i].venueName + " - " + courtDetails[j].courtNumber
                }
                courtselectedArr.push(object)
            }
        }
    }

    return courtselectedArr
}

//// Match selected venues
function checkMatchedWithSelectedVenue(venueId, selectedVenueArr) {
    let object = {
        status: false,
        result: []
    }

    for (let i in selectedVenueArr) {
        if (selectedVenueArr[i].venueId == venueId) {

            object = {
                status: true,
                result: selectedVenueArr[i]
            }

            break;
        }
    }
    return object
}

///// Method to check selected venue 

function checkSelectedVenuesList(selectedVenue, venueList) {
    let defaultVenues = isArrayNotEmpty(selectedVenue) ? selectedVenue : []
    let selectedVenuesList = []
    for (let i in venueList) {
        let venueObject = null
        let matchedWithSelectedVenue = checkMatchedWithSelectedVenue(venueList[i].venueId, defaultVenues)

        if (matchedWithSelectedVenue.status == true) {
            venueObject = {
                "competitionVenueId": matchedWithSelectedVenue.result.competitionVenueId,
                "venueId": venueList[i].venueId,
                // "name": venueList[i].name,
            }
        } else {
            venueObject = {
                "competitionVenueId": 0,
                "venueId": venueList[i].venueId,
                // "name": venueList[i].name,
            }
        }

        selectedVenuesList.push(venueObject)
    }
    return selectedVenuesList
}

function getVenueObj(venueObj) {

    let venueArr = []

    // for (let i in venueObj.venues) {
    //     let venueobj = {
    //         "competitionVenueId": venueObj.venues[i].competitionVenueId,
    //         "venueId": venueObj.venues[i].venueId
    //     }
    //     venueArr.push(venueobj)
    // }



    let objData = {
        "competitionUniqueKey": "",
        "yearRefId": "",
        "organisationId": 1,
        "venues": [],
        "nonPlayingDates": [],
        "venueConstraintId": 0,
        "courtRotationRefId": 8,
        "homeTeamRotationRefId": 1,
        "courtPreferences": [],
        // "courtDivisionPref": [],
        // "courtGradePref": []
    }

    return objData
}

function getSelectedCourt(courtVenueId, checkSelectedCourts) {
    let courtObject = {
        status: false,
        result: []
    }
    for (let i in checkSelectedCourts) {
        if (courtVenueId == checkSelectedCourts[i].venueId) {
            courtObject = {
                status: true,
                result: checkSelectedCourts[i]
            }
            break;
        } else {
            courtObject = {
                status: false,
                result: checkSelectedCourts[i]
            }
        }
    }
    return courtObject
}

function getEnitityIdArray(entities) {
    let array = []
    for (let i in entities) {
        array.push(entities[i].venuePreferenceEntityId)
    }
    return array
}

function checkEntitiyObjectValues(selected, defaultEnitties, venuePrefId) {
    let entityOnjecy = {
        status: false,
        result: []
    }

    for (let i in defaultEnitties) {
        let entitiy = defaultEnitties[i].entities
        for (let j in entitiy) {
            if (entitiy[j].venuePreferenceEntityId == selected && venuePrefId == defaultEnitties[j].venueConstraintCourtPreferenceId) {
                entityOnjecy = {
                    status: true,
                    result: entitiy[j]
                }


                break;
            }
        }
    }

    return entityOnjecy
}

////create selected court array
function craeteSelectedCourtPrefArray(selectedCourts, allCourtsList, courtRotationId) {
    let courtsArray = []

    let courtPreferencesPost = []

    for (let i in selectedCourts) {
        let selectedCourtListId = getSelectedCourt(selectedCourts[i].venueCourtId, allCourtsList)

        let entitiesArray = selectedCourts[i].entities
        let divisionId = getEnitityIdArray(selectedCourts[i].entities)
        let gradesId = getEnitityIdArray([])
        let venuCourtObj = null

        let venuCourtObjPost = null

        if (selectedCourtListId.status == true) {
            venuCourtObj = {
                "venueConstraintCourtPreferenceId": selectedCourts[i].venueConstraintCourtPreferenceId,
                "venueCourtId": selectedCourtListId.result.venueId,
                "name": selectedCourtListId.result.name,
                "entitiesDivision": selectedCourts[i].entities,
                "entitiesDivisionId": courtRotationId == 6 ? divisionId : [],
                "entitiesGrade": selectedCourts[i].entities,
                "entitiesGradeId": courtRotationId == 7 ? divisionId : []
            }
            venuCourtObjPost = {
                "venueConstraintCourtPreferenceId": selectedCourts[i].venueConstraintCourtPreferenceId,
                "venueCourtId": selectedCourtListId.result.venueId,
                "entities": selectedCourts[i].entities,
            }
        } else {
            venuCourtObj = {
                "venueConstraintCourtPreferenceId": 0,
                "venueCourtId": selectedCourtListId.result.venueId,
                "name": selectedCourtListId.result.name,
                "entitiesDivision": [],
                "entitiesDivisionId": [],
                "entitiesGrade": [],
                "entitiesGradeId": []
            }

            venuCourtObjPost = {
                "venueConstraintCourtPreferenceId": selectedCourts[i].venueConstraintCourtPreferenceId,
                "venueCourtId": selectedCourtListId.result.venueId,
                "entities": selectedCourts[i].entities,
            }



        }


        courtPreferencesPost.push(venuCourtObjPost)
        courtsArray.push(venuCourtObj)

    }

    return { courtsArray, courtPreferencesPost }

}

function createEntityObject(action, courtPreferencesPost, evenRotation, venuePrefId) {

    let entityObjectArr = []
    for (let i in action.data) {
        let checkEntitiyObject = checkEntitiyObjectValues(action.data[i], courtPreferencesPost, venuePrefId)

        let entityObject = null

        if (checkEntitiyObject.status == true) {
            entityObject = {
                "venueConstraintCourtPreferenceEntityId": checkEntitiyObject.result.venueConstraintCourtPreferenceEntityId,
                "venuePreferenceTypeRefId": evenRotation,
                "venuePreferenceEntityId": action.data[i]
            }
        } else {
            entityObject = {
                "venueConstraintCourtPreferenceEntityId": 0,
                "venuePreferenceTypeRefId": evenRotation,
                "venuePreferenceEntityId": action.data[i]
            }
        }



        entityObjectArr.push(entityObject)


    }
    return entityObjectArr
}

function VenueTimeState(state = initialState, action) {

    switch (action.type) {
        ////Competition Dashboard Case
        case ApiConstants.API_VENUE_CONSTRAINTS_LIST_LOAD:
            state.competitionUniqueKey = action.competitionUniqueKey
            state.yearId = action.yearRefId
            return { ...state, onLoad: true };

        case ApiConstants.API_VENUE_CONSTRAINTS_LIST_SUCCESS:

            state.venueConstrainstData = action.result
            state.divisionList = action.result.divisions
            state.gradeList = action.result.grades
            state.homeRotation = action.result.homeTeamRotationRefId

            let selecetdVenueListId = []

            let allCourtsList = generateCourtData(action.result && action.result.venues)
            state.courtArray = allCourtsList

            let selectedCourtPrefArray = craeteSelectedCourtPrefArray(action.result.courtPreferences, allCourtsList, action.result.courtRotationRefId)



            for (let i in action.result.venues) {
                selecetdVenueListId.push(action.result.venues[i].venueId)
                // state.courtArray.push(action.result.venues[i]
            }

            state.selectedVenueId = selecetdVenueListId

            state.courtPrefArrayStore = selectedCourtPrefArray.courtPreferencesPost
            state.venueConstrainstData.courtPreferences = selectedCourtPrefArray.courtsArray
            state.courtPreferencesPost = selectedCourtPrefArray.courtPreferencesPost
            state.venuePost = state.venueConstrainstData.venues

            // let setVenueObj = getVenueObj(action.result)
            // state.venueConstrainstData = setVenueObj


            // let selectedVenues = checkSelectedVenuesList(state.venueConstrainstData.venues, venueSelectedData)
            // state.venuePost = selectedVenues

            let courtRotationRefId = action.result.courtRotationRefId
            state.evenRotation = action.result.courtRotationRefId

            if (courtRotationRefId == 2 || courtRotationRefId == 3 || courtRotationRefId == 4) {
                state.courtRotation[0].selectedPrefrence = 1
                state.selectedRadioBtn = 1
            } else if (courtRotationRefId == 6 || courtRotationRefId == 7) {
                state.courtRotation[1].selectedPrefrence = 5
                state.selectedRadioBtn = 5
            } else {
                state.courtRotation[2].selectedPrefrence = 8;
                state.selectedRadioBtn = 8;
            }
          //  state.venueConstrainstData['courtRotationRefId'] = state.selectedRadioBtn;

            return {
                ...state,
                onLoad: false,
                result: action.result,
                status: action.status
            };


        case ApiConstants.API_UPDATE_VENUE_TIME_DATA:
            if (action.key == "remove") {
                let expandedRowKeyRemove = action.index + 1
                state.venuData['venueCourts'].splice(action.index, 1)
                let matchKey = state.venuData.expandedRowKeys.findIndex(x => x == expandedRowKeyRemove.toString())
                if (matchKey != -1)
                    state.venuData.expandedRowKeys.splice(matchKey, 1);

                // let venueCourts = state.venuData['venueCourts'].filter(x=>x.key > expandedRowKeyRemove);
                let venueCourts = state.venuData['venueCourts'];
                if (isArrayNotEmpty(venueCourts)) {
                    let keyIndex = 1;
                    for (let i in venueCourts) {
                        venueCourts[i]["courtNumber"] = keyIndex;
                        venueCourts[i]["key"] = keyIndex.toString();
                        //venueCourts[i]["overideSlot"] = true;
                        keyIndex++;
                    }
                }
                if (isArrayNotEmpty(state.venuData.expandedRowKeys)) {
                    let keyIndex = 1;
                    let expandedRowKeys = state.venuData.expandedRowKeys;
                    for (let j in expandedRowKeys) {
                        expandedRowKeys[j] = keyIndex.toString();
                        keyIndex++;
                    }
                }
            }
            if (action.index == 'Venue') {
                let upDateData = state.venuData
                upDateData[action.key] = action.data
                state.venuData = upDateData

            }
            else if (action.contentType == 'courtData') {
                let upDateCourtData = state.venuData.venueCourts
                upDateCourtData[action.index][action.key] = action.data
                state.venuData.venueCourts = upDateCourtData

            }
            else if (action.index == 'addGameAndCourt') {
                console.log("addGameAndCourt" + state.venuData[action.key].length);

                let setKey = generateTableKey(state.venuData.venueCourts)
                var court_obj = {
                    key: setKey.toString(),
                    venueCourtId: "",
                    courtNumber: setKey,
                    venueCourtName: "",
                    lat: '',
                    lng: '',
                    overideSlot: false,
                    isDisabled: false,
                    availabilities: []
                }
                var gameObj = {
                    venueGameId: "",
                    dayRefId: 1,
                    startTime: "00:00",
                    endTime: "00:00",
                    isDisabled: false
                }
                state.venuData[action.key].push(action.key == 'venueCourts' ? court_obj : gameObj)
            }
            else if (action.index == 'addGameAndCourtThroughCSV') {
                let venueCourtData = action.data;
                if (isArrayNotEmpty(venueCourtData)) {
                    let venueDataCourts = [...state.venuData.venueCourts];
                    for (let i in venueCourtData) {
                        let setKey = generateTableKey(venueDataCourts);
                        let name = venueCourtData[i].name;
                        let lat = venueCourtData[i].latitude;
                        let lng = venueCourtData[i].longitude;
                        var court_obj = {
                            key: setKey.toString(),
                            venueCourtId: "",
                            courtNumber: setKey,
                            venueCourtName: name,
                            lat: lat,
                            lng: lng,
                            overideSlot: false,
                            isDisabled: false,
                            availabilities: []
                        }
                        venueDataCourts.push(court_obj)
                    }
                    state.venuData[action.key] = venueDataCourts;
                }
            }
            else if (action.key == 'overideSlot') {
                let changeData = state.venuData.venueCourts
                changeData[action.index][action.key] = action.data
                state.venuData.venueCourts = changeData
                let expandedRowKey = changeData[action.index]['key'];
                console.log("expandedRowKey" + expandedRowKey + "action.data" + action.data);
                if (action.data == true) {
                    state.venuData.expandedRowKeys.push(expandedRowKey.toString())
                } else {
                    let sortArray = state.venuData.expandedRowKeys.findIndex(x => x == expandedRowKey.toString())
                    state.venuData.expandedRowKeys.splice(sortArray, 1)
                }
            } else if (action.contentType == 'gameTimeslot') {
                let changeGameData = state.venuData.gameDays
                changeGameData[action.index][action.key] = action.data
                state.venuData.gameDays = changeGameData
            } else if (action.contentType == 'add_TimeSlot') {
                if (action.key == "availabilities") {
                    let timSlotObj = {
                        venueCourtAvailabilityId: "",
                        dayRefId: 1,
                        startTime: '00:00',
                        endTime: '00:00',
                        isDisabled: false
                    }
                    state.venuData.venueCourts[action.index][action.key].push(timSlotObj)
                }
                else {
                    state.venuData.venueCourts[action.tableIndex].availabilities.splice(action.index, 1)
                }
            } else if (action.contentType == 'addTimeSlotField') {
                let timSlotData = state.venuData.venueCourts[action.tableIndex].availabilities
                timSlotData[action.index][action.key] = action.data
                state.venuData.venueCourts[action.tableIndex].availabilities = timSlotData
            } else if (action.index == "organisations") {
                let organisations = getOrganisation(action.data)
                state.venuData['organisations'] = organisations
                state.venuData['affiliateData'] = action.data
            }
            else if (action.index == "editOrganisations") {
                state.venuData['affiliateData'] = action.data;
                let organisations = getEditOrganisation(action.data, state.venuData.organisations);
                state.venuData['organisations'] = organisations;
                console.log("action.data" + JSON.stringify(action.data));
                console.log("organisations" + JSON.stringify(organisations));
            }

            return {
                ...state,
                onLoad: false,
            };

        //// Refresh Venue Fields
        case ApiConstants.API_REFRESH_VENUE_FIELDS:
            let refreshData = {
                competitionUniqueKey: '',
                yearRefId: 1,
                competitionMembershipProductDivisionId: 1,
                venueId: 0,
                name: "",
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
                expandedRowKeys: []
            }
            state.venuData = refreshData
            return {
                ...state,
                onLoad: false,
            };

        ///////get the venue list in the first tab

        case ApiConstants.API_VENUE_LIST_SUCCESS:
            return {
                ...state,
                status: action.status,
                venueList: action.result,
                searchVenueList: action.result
            };

        case ApiConstants.API_UPDATE_VENUE_CONSTRAINTS_DATA:

            if (action.contentType == 'venueListSection') {

                // state.venues.push(venueObj) //// add Venue object*
                state.selectedVenueId = action.data
                let venueSelectedData = state.venueList.filter(function (object_1) {
                    return action.data.some(function (object_2) {
                        return object_1.venueId === object_2;
                    });
                });

                let courtDataArray = generateCourtData(venueSelectedData)

                state.courtArray = courtDataArray

                if (state.courtArray.length == 0) {
                    state.courtId = []
                }

                let selectedVenues = checkSelectedVenuesList(state.venueConstrainstData.venues, venueSelectedData)
                state.venuePost = selectedVenues
                // state.venueConstrainstData[action.key] = selectedVenues

            } else if (action.contentType == 'addAnotherNonPlayingDate') {
                let nonPlayingDatesObj = {
                    competitionNonPlayingDatesId: 0,
                    name: "",
                    nonPlayingDate: null
                }
                state.venueConstrainstData[action.key].push(nonPlayingDatesObj)
                state.nonPlayingDates.push(nonPlayingDatesObj) //// add nonplaying date object*

            } else if (action.contentType == 'nonPlayingDates') {

                let nonPlayingData = state.venueConstrainstData[action.contentType]
                nonPlayingData[action.index][action.key] = action.data
                state.venueConstrainstData[action.contentType] = nonPlayingData



            } else if (action.contentType == 'radioButton') {
                let prefrenceArr = state.courtRotation
                for (let i in state.courtRotation) {
                    if (prefrenceArr[i].id == action.data) {
                        prefrenceArr[i].selectedPrefrence = action.data
                    } else {
                        prefrenceArr[i].selectedPrefrence = null
                    }
                }

                state.courtRotation = prefrenceArr
                state.radioButton = action.data

            } else if (action.contentType == 'radioButtonValue') {
                state[action.key] = action.data
                state.venueConstrainstData['courtRotationRefId'] = action.data

            } else if (action.contentType == 'evenRotationValue') {
                state.evenRotation = action.data
                state.venueConstrainstData['courtRotationRefId'] = action.data
            }
            else if (action.contentType == 'homeRotationValue') {
                // state.homeRotation = action.data
                state.venueConstrainstData.homeTeamRotationRefId = action.data
            } else if (action.contentType == "courtPreferences") {


                // let selectedCourt_PrefArray = craeteSelectedCourtPrefArray(state.venueConstrainstData.courtPreferences, state.courtArray)


                let venuePrefId = state.venueConstrainstData[action.contentType][action.index].venueConstraintCourtPreferenceId
                if (action.key == "entitiesDivision") {


                    let checkCourts = createEntityObject(action, state.courtPreferencesPost, 1, venuePrefId)

                    state.venueConstrainstData[action.contentType][action.index][action.key] = action.data
                    state.venueConstrainstData[action.contentType][action.index].entitiesDivisionId = action.data
                    state.courtPreferencesPost[action.index].entities = checkCourts

                } else if (action.key == "entitiesGrade") {
                    let checkCourts = createEntityObject(action, state.courtPreferencesPost, 2, venuePrefId)
                    state.venueConstrainstData[action.contentType][action.index][action.key] = action.data
                    state.venueConstrainstData[action.contentType][action.index].entitiesGradeId = action.data
                    state.courtPreferencesPost[action.index].entities = checkCourts
                }
                else {
                    state.venueConstrainstData[action.contentType][action.index][action.key] = action.data
                    state.courtPreferencesPost[action.index][action.key] = action.data
                }


                // if (action.key == "entitiesDivision" || action.key == "entitiesGrade") {
                //     let entitiesArray = createEntityObject(action.data, action.key)
                //     state.venueConstrainstData[action.contentType][action.index][action.key] = entitiesArray
                // } else {

                // }

            }
            ////add non playing date fields
            else if (action.contentType == 'nonPLayingDateFields') {
                state.nonPlayingDates[action.index][action.key] = action.data
            } else if (action.contentType == 'courtParentSelection') {
                state.selectedRadioBtn = action.data
                if (action.data == 1) {
                    state.evenRotation = 2
                    state.venueConstrainstData['courtRotationRefId'] = state.evenRotation
                    state.courtPreferencesPost = []
                    state.venueConstrainstData[action.key] = []

                } else if (action.data == 5) {
                    state.evenRotation = 6
                    state.venueConstrainstData['courtRotationRefId'] = state.evenRotation
                    state.courtPreferencesPost = state.courtPrefArrayStore
                } else if (action.data == 8) {
                    state.venueConstrainstData['courtRotationRefId'] = action.data
                    state.courtPreferencesPost = []
                    state.venueConstrainstData[action.key] = []
                }

                for (let i in state.courtRotation) {
                    if (state.courtRotation[i].id == action.data) {
                        state.courtRotation[i].selectedPrefrence = state.courtRotation[i].id
                    } else {
                        state.courtRotation[i].selectedPrefrence = null
                    }
                }


            }

            else {
                let venueConstrainstDetails = state.venueConstrainstData
                if (action.contentType == 'addCourtPreferences') {
                    let venuCourtObj = {
                        "venueConstraintCourtPreferenceId": 0,
                        "venueCourtId": null,
                        "name": "",
                        "entitiesDivision": [],
                        "entitiesDivisionId": [],
                        "entitiesGrade": [],
                        "entitiesGradeId": []
                    }

                    let divisionObj = {
                        venueConstraintCourtPreferenceId: 0,
                        venueCourtId: null,
                        entities: [],
                    }
                    state.venueConstrainstData[action.key].push(venuCourtObj)
                    state.courtPreferencesPost.push(divisionObj)
                }
            }

            return {
                ...state,
                error: null
            }
        ////Competition Dashboard Case
        case ApiConstants.API_VENUE_CONSTRAINT_POST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_VENUE_CONSTRAINT_POST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                venuePostResult: action.result.message,
                status: action.status
            };

        ////get common data for rotation radio button on own competition venue and times 
        case ApiConstants.API_GET_COMMON_REF_DATA_SUCCESS:

            for (let i in action.result.CourtRotation) {
                action.result.CourtRotation[i]["selectedPrefrence"] = null
            }
            state.courtRotation = action.result.CourtRotation
            state.evenRotation = action.result.CourtRotation[0].subReferences[0].id
            state.radioButton = action.result.CourtRotation[2].id
            state.allocateToSameCourt = action.result.CourtRotation[1].subReferences[0].id
            return {
                ...state,
                onLoad: false,
                homeTeamRotation: action.result.HomeTeamRotation
            };



        ////Year and competition seletion
        case ApiConstants.API_GET_YEAR_COMPETITION_SUCCESS:
            // state.venueConstrainstData['yearRefId'] = action.selectedYearId

            return {
                ...state,
                onLoad: false,
                competitionUniqueKey: action.competetionListResult.length > 0 && action.competetionListResult[0].competitionId,
                yearRefId: action.selectedYearId
            };

        case ApiConstants.API_UPDATE_COMPETITION_LIST:
            // state.venueConstrainstData['competitionUniqueKey'] = action.data
            state.competitionUniqueKey = action.data
            return {
                ...state,
            };

        case ApiConstants.CLEAR_VENUE_TIMES_DATA:


            let selectedPrefence = state.courtRotation
            for (let i in selectedPrefence) {
                selectedPrefence[i].selectedPrefrence = null
            }
            state.venueConstrainstData = objData
            state.competitionUniqueKey = action.competitionId
            state.selectedVenueId = []
            state.selectedRadioBtn = 8
            state.evenRotation = 8
            state.onVenueDataClear = true

            return {
                ...state,
            };

        case ApiConstants.DELETE_PREFENCE_OBJECT:
            state.venueConstrainstData[action.key].splice(action.index, 1)
            state.courtPreferencesPost.splice(action.index, 1)
            return {
                ...state,
            };

        case ApiConstants.DELETE_PREFENCE_OBJECT_ADD_VENUE:
            state.venuData['gameDays'].splice(action.index, 1)
            return { ...state }

        case ApiConstants.API_VENUE_BY_ID_LOAD:
            return { ...state, venueEditOnLoad: true };

        case ApiConstants.API_VENUE_BY_ID_SUCCESS:

            let venueDataByIdRes = action.result;
            if (venueDataByIdRes != null && venueDataByIdRes != "") {
                venueDataByIdRes["expandedRowKeys"] = [];
                let courts = venueDataByIdRes.venueCourts;
                let isVenueMapped = venueDataByIdRes["isVenueMapped"];
                if (isArrayNotEmpty(courts)) {
                    for (let i in courts) {
                        let key = Number(i) + 1;
                        courts[i]["key"] = key.toString();
                        courts[i]["isDisabled"] = isVenueMapped === 1 ? true : false;
                        let availabilities = courts[i].availabilities;
                        if (isArrayNotEmpty(availabilities)) {
                            courts[i]["overideSlot"] = true;
                        }
                        else {
                            courts[i]["overideSlot"] = false;
                        }

                        for (let j in courts[i].availabilities) {
                            courts[i].availabilities[j]["isDisabled"] = isVenueMapped === 1 ? true : false;
                        }

                        venueDataByIdRes.expandedRowKeys.push(key.toString())
                    }
                }
                let gameDays = venueDataByIdRes.gameDays;
                if (isArrayNotEmpty(gameDays)) {
                    for (let k in gameDays) {
                        gameDays[k]["isDisabled"] = isVenueMapped === 1 ? true : false;
                    }
                }

                let organisations = venueDataByIdRes.organisations;
                let arr = [];
                if (isArrayNotEmpty(organisations)) {

                    for (let l in organisations) {
                        arr.push(organisations[l]["organisationId"]);
                    }
                    venueDataByIdRes["affiliateData"] = arr;
                    venueDataByIdRes["affiliate"] = true;
                }
                else {
                    venueDataByIdRes["affiliate"] = false;
                    venueDataByIdRes["affiliateData"] = arr;
                }

            }
            return {
                ...state,
                venueEditOnLoad: false,
                venuData: venueDataByIdRes,
                status: action.status
            };
        default:
            return state;
    }
}


export default VenueTimeState;
