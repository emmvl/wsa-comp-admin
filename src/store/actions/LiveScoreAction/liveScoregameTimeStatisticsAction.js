import ApiConstants from "../../../themes/apiConstants";

function gameTimeStatisticsListAction(competitionId, aggregate, offset, searchText) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_LOAD,
        competitionId: competitionId,
        aggregate: aggregate,
        offset: offset,
        searchText:searchText
    }

    return action
}
export {
    gameTimeStatisticsListAction,
}
