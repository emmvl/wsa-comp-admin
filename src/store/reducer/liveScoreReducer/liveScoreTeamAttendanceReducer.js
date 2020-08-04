import ApiConstants from "../../../themes/apiConstants";


const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    teamAttendanceResult: [],
    teamAttendanceList: [],
    teamAttendancePage: 0,
    teamAttendanceTotalCount: "",
}

function liveScoreTeamAttendanceState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_LOAD:
            state.teamAttendanceResult = []
            return {
                ...state,
                onLoad: true,
            }
        case ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_SUCCESS:
            let result = action.result.stats
            state.teamAttendanceResult = result
            return {
                ...state,
                onLoad: false,
                status: action.status,
                teamAttendancePage: action.result.page.currentPage,
                teamAttendanceTotalCount: action.result.page.totalCount
            }
        case ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_FAIL:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error,
            }
        case ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_ERROR:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error
            }

        default:
            return state

    }
}

export default liveScoreTeamAttendanceState;