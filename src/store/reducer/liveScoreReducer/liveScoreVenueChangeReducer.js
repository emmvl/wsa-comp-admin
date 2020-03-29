import ApiConstants from "../../../themes/apiConstants";

var venueChangeObj = {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venueId: [],
    courtId: [],
    changeToVenueId: [],
    changeToCourtId: []
}


const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    venueChangeData: venueChangeObj,

    venueData: "",
    courtData: "",
    courtDataForChange: "",
};

function LiveScoreVenueChange(state = initialState, action) {

    switch (action.type) {

        case ApiConstants.API_LIVE_SCORE_UPDATE_VENUE_CHANGE:


            if (action.key == "venueId") {
                state.venueChangeData[action.key] = action.data
                state.venueChangeData['courtId'] = []
                let index = state.venueData.findIndex(x => x.venueId == action.data)
                if (index > -1) {
                    let courts = state.venueData[index].venueCourts
                    state.courtData = courts

                }
            } if (action.key == "changeToVenueId") {
                state.venueChangeData[action.key] = action.data
                state.venueChangeData['changeToCourtId'] = []

                let index = state.venueData.findIndex(x => x.venueId == action.data)
                if (index > -1) {
                    let courts = state.venueData[index].venueCourts
                    state.courtDataForChange = courts

                }
            } else {
                state.venueChangeData[action.key] = action.data
            }
            return {
                ...state,
                onLoad: false,
                status: action.status
            }

        case ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_SUCCESS:
            state.venueData = action.venues
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        default:
            return state;
    }
}

export default LiveScoreVenueChange;
