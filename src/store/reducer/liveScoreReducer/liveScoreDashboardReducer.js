import ApiConstants from '../../../themes/apiConstants'
import {isArrayNotEmpty } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    status: 0,
    dashboardIncidentList: null,
    dashboardNewsList: null,
    dashboardMatchList: null,
    onSingleGameLoad: false,
    onSingleGameRedeemPayLoad: false

};

function liveScoreDashboardsReducer(state = initialState, action) {

    switch (action.type) {

        //LiveScore Dashboard List
        case ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DASHBOARD_SUCCESS:
            let dashboardMatches = [];
            if(isArrayNotEmpty(action.result.match)){
                (action.result.match || []).map((item) => {
                    if(item){
                        dashboardMatches.push(item);
                    }
                })
            }

            return {
                ...state,
                onLoad: false,
                dashboardIncidentList: action.result.incident,
                dashboardNewsList: action.result.news,
                dashboardMatchList: dashboardMatches,
            };

         //Match Day SingleGame List
         case ApiConstants.API_LIVE_SCORE_SINGLE_GAME_LIST_LOAD:
            return { ...state, onSingleGameLoad: true };

        case ApiConstants.API_LIVE_SCORE_SINGLE_GAME_LIST_SUCCESS:
            return {
                ...state,
                onSingleGameLoad: false,
                singleGameDataList: action.result.singleGameData,
                liveScoreSingleGameListPage: action.result.page ? action.result.page.currentPage : 1,
                liveScoreSingleGameListTotalCount: action.result.page ? action.result.page.totalCount : 0,
            };

        //Match Day SingleGame Pay Redeem
        case ApiConstants.API_LIVE_SCORE_SINGLE_GAME_REDEEM_PAY_LOAD:
            return { ...state, onSingleGameRedeemPayLoad: true };

        case ApiConstants.API_LIVE_SCORE_SINGLE_GAME_REDEEM_PAY_SUCCESS:
            return {
                ...state,
                onSingleGameRedeemPayLoad: false,
                status: action.status,
            };


        case ApiConstants.API_LIVE_SCORE_DASHBOARD_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_DASHBOARD_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_PLAYERS_TO_PAY_LIST_LOAD:
            return { ...state, onPlayersToPayLoad: true };

        case ApiConstants.API_LIVE_SCORE_PLAYERS_TO_PAY_LIST_SUCCESS:
            return {
                ...state,
                onPlayersToPayLoad: false,
                playersToPayList: action.result.playersToPay,
                liveScorePlayerstoPayListPage: action.result.page ? action.result.page.currentPage : 1,
                liveScorePlayerstoPayListTotalCount: action.result.page ? action.result.page.totalCount : 0,
            };

        default:
            return state;
    };

}

export default liveScoreDashboardsReducer;