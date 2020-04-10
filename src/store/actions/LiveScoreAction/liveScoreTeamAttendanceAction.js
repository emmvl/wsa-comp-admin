import ApiConstants from "../../../themes/apiConstants";

function liveScoreTeamAttendanceListAction(competitionId, body) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_LOAD,
        competitionId: competitionId,
        body: body
    }

    return action
}
export {
    liveScoreTeamAttendanceListAction,
}