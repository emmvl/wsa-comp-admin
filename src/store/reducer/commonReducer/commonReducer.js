import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    applyVenue: [],
    timeSlotRotation: [],
    timeSlotGeneration: [],
    weekDays: [],
    stateList: [],
    daysList: [],
    addVenueData: "",
    onVenueDataLoad: false,
    mainVenueList: [],
    registrationOtherInfoOnLoad: false,
    venueList: [],
    addVenueSuccessMsg: "",
    gradesReferenceData: [],
    favouriteTeamsList: [],
    firebirdPlayerList: [],
    registrationOtherInfoList: [],
    countryList: [],
    nationalityList: [],
    heardByList: [],
    playerPositionList: [],
    searchVenueList: [],
    venuesList: [],
    venuesListPage: 1,
    venuesListTotalCount: 1,
    genderDataEnum: [{
        description: "Male",
        id: 2,
        name: "male",
    },
    {
        description: "Female",
        id: 1,
        name: "female",
    }
    ],
    genderData: [],
    photoTypeData: [],
    applyToData: [],
    extraTimeDrawData: [],
    finalFixtureTemplateData: []
};




function commonReducerState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_TIME_SLOT_INIT_LOAD:
            return { ...state }
        case ApiConstants.API_TIME_SLOT_INIT_SUCCESS:
            return {
                ...state,
                applyVenue: action.result.ApplyToVenue,
                timeSlotRotation: action.result.TimeslotRotation,
                timeSlotGeneration: action.result.TimeslotGeneration,
                weekDays: action.result.Day
            };

        ////Common Ref Case
        case ApiConstants.API_GET_COMMON_REF_DATA_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_COMMON_REF_DATA_SUCCESS:
            return {
                ...state,
                onLoad: false,
                stateList: action.result.State,
                daysList: action.result.Day,
                status: action.status
            };

        ////Add Venue Case
        case ApiConstants.API_ADD_VENUE_LOAD:
            return { ...state, onVenueDataLoad: true };

        case ApiConstants.API_ADD_VENUE_SUCCESS:
            console.log(action, 'VenueResult')
            if (action.result != null) {
                state.venueList.push(action.result)
                state.searchVenueList.push(action.result)
            }

            return {
                ...state,
                mainVenueList: action.result,
                onVenueDataLoad: false,
                addVenueData: action.result,
                status: action.status,
                addVenueSuccessMsg: "Successfully Inserted"
            };

        ////Venue List for own competitionvenue and times
        case ApiConstants.API_VENUE_LIST_LOAD:
            return { ...state, onVenueDataLoad: true };

        case ApiConstants.API_VENUE_LIST_SUCCESS:
            console.log(action, 'VenueListResult')
            return {
                ...state,
                status: action.status,
                mainVenueList: action.result,
                venueList: action.result,
                searchVenueList: action.result
            };

        ///////get the grades reference data 
        case ApiConstants.API_GRADES_REFERENCE_LIST_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GRADES_REFERENCE_LIST_SUCCESS:
            console.log(action, 'gradesReferenceData')
            return {
                ...state,
                status: action.status,
                gradesReferenceData: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the Favourite Team List 
        case ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_FAVOURITE_TEAM_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                favouriteTeamsList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the Firebird Player List 
        case ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                firebirdPlayerList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the  registration other info 
        case ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD:
            return { ...state, registrationOtherInfoOnLoad: true, error: null };

        case ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                registrationOtherInfoList: isArrayNotEmpty(action.result) ? action.result : [],
                registrationOtherInfoOnLoad: false,
                error: null
            };

        ///////get the  country list
        case ApiConstants.API_COUNTRY_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_COUNTRY_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                countryList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the  nationality list
        case ApiConstants.API_NATIONALITY_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_NATIONALITY_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                nationalityList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };
        ///////get the  HeardBy list
        case ApiConstants.API_HEARDBY_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_HEARDBY_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                heardByList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the  Player Position Reference
        case ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_PLAYER_POSITION_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                playerPositionList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        case ApiConstants.Search_Venue_updated:
            return { ...state, venueList: action.filterData }

        case ApiConstants.CLEAR_FILTER_SEARCH:
            state.venueList = state.mainVenueList
            return {
                ...state
            }
        ////Venue List for User Module
        case ApiConstants.API_VENUES_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_VENUES_LIST_SUCCESS:
            return {
                ...state,
                status: action.status,
                onLoad: false,
                venuesList: action.result.venues,
                venuesListPage: action.result.page ? action.result.page.currentPage : 1,
                venuesListTotalCount: action.result.page.totalCount,
            };
        case ApiConstants.API_VENUE_DELETE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_VENUE_DELETE_SUCCESS:
            return {
                ...state,
                status: action.status,
                onLoad: false,
            };

        case ApiConstants.API_GET_GENDER_LOAD:
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_GET_GENDER_SUCCESS:
            return {
                ...state,
                onLoad: true,
                genderData: action.result,
                status: action.status
            }



        case ApiConstants.API_GET_PHOTO_TYPE_LOAD:
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_GET_PHOTO_TYPE_SUCCESS:
            return {
                ...state,
                onLoad: true,
                photoTypeData: action.result,
                status: action.status
            }

        case ApiConstants.API_GET_APPY_TO_LOAD:
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_GET_APPY_TO_SUCCESS:
            return {
                ...state,
                onLoad: true,
                applyToData: action.result,
                status: action.status
            }

        case ApiConstants.API_GET_EXTRA_TIME_DRAW_LOAD:
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_GET_EXTRA_TIME_DRAW_SUCCESS:
            return {
                ...state,
                onLoad: true,
                extraTimeDrawData: action.result,
                status: action.status
            }

        case ApiConstants.API_GET_FINAL_FIXTURE_TEMPLATE_LOAD:
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_GET_FINAL_FIXTURE_TEMPLATE_SUCCESS:
            return {
                ...state,
                onLoad: true,
                finalFixtureTemplateData: action.result,
                status: action.status
            }

        default:
            return state;
    }
}

export default commonReducerState;
