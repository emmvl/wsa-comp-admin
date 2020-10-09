import ApiConstants from "../../../themes/apiConstants";

function liveScoreTeamAttendanceListAction(competitionId, body, status, divisionId, roundId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_LOAD,
        competitionId: competitionId,
        body: body,
        select_status: status,
        divisionId: divisionId,
        roundId: roundId
    }
    console.log(action)
    return action
}





export {
    liveScoreTeamAttendanceListAction,
}