import ApiConstants from '../../../themes/apiConstants'

var incidentObj = {
    date: "",
    time: "",
    mnbMatchId: "",
    team: "",
    player: "",
    injury: "",
    claim: "",
    description: "",
    addImages: null,
    addVideo: null
}

const initialState = {
    onLoad: false,
    status: 0,
    error: null,
    result: null,
    liveScoreIncidentResult: [],
    incidentData: incidentObj
}

function liveScoreIncidentState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_LOAD:
            return { ...state, onLoad: true }

        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_SUCCESS:
            const result = action.result

            return {

                ...state,
                onLoad: false,
                liveScoreIncidentResult: result,
                status: action.status
            }

        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: result.status

            }
        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            }
        case ApiConstants.API_LIVE_SCORE_UPDATE_INCIDENT:
            let new_object = state.incidentData
            state.incidentData[action.key] = action.data
            return {
                ...state,

            }

        case ApiConstants.API_LIVE_SCORE_CLEAR_INCIDENT:
            state.incidentData = JSON.parse(JSON.stringify(incidentObj))
            return {
                ...state,

            }
        default:
            return state
    }
}

export default liveScoreIncidentState