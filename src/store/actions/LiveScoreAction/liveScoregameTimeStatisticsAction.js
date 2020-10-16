import ApiConstants from "../../../themes/apiConstants";

function gameTimeStatisticsListAction(competitionId, aggregate, offset, searchText, sortBy, sortOrder) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_LOAD,
        competitionId,
        aggregate: aggregate,
        offset,
        searchText,
        sortBy,
        sortOrder
    }

    return action
}
export {
    gameTimeStatisticsListAction,
}
