import ApiConstants from "../../../themes/apiConstants";
import liveScoreModal from '../../objectModel/liveScoreModal'
import moment from "moment";

var playerObj = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    mnbPlayerId: "",
    teamId: "",
    competitionId: null,
    photoUrl: null
}


const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    playerData: playerObj,
    playerDataArr: [],
    totalCount: null
};
function LiveScorePlayerState(state = initialState, action) {
    switch (action.type) {
        ////live score player list
        // case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD:
        //     return { ...state, onLoad: true };

        // case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SUCCESS:

        //     var playerListResult = liveScoreModal.getPlayerListData(action.result)

        //     return {
        //         ...state,
        //         onLoad: false,
        //         result: playerListResult,
        //         status: action.status
        //     };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:

            const result = action.result

            return {
                ...state,
                onLoad: false,
                teamResult: result,
                status: action.status

            }


        //// Update player data
        case ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER:

            if (action.key == 'addplayerScreen') {
                state.playerData = playerObj
            } else if (action.key == 'editplayerScreen') {
                if (action.data) {
                    var editPlayerObj = {
                        firstName: action.data.firstName,
                        lastName: action.data.lastName,
                        dateOfBirth: moment(action.data.dob).format('DD-MM-YYYY'),
                        phoneNumber: action.data.phoneNumber,
                        mnbPlayerId: action.data.playerId,
                        teamId: action.data.team? action.data.team.id :action.data.id,
                        competitionId: action.data.division? action.data.division.competitionId : action.data.competitionId,
                        photoUrl: action.data.profilePicture? action.data.profilePicture:action.data.photoUrl
                    }
                    state.playerData = editPlayerObj
                }
            } else {
                state.playerData[action.key] = action.data

            }
            return {
                ...state,
            };

        ////live score add/edit player
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_SUCCESS:

            return {
                ...state,
                onLoad: false,
                playerData: action.result,
            };

        ////live score add/edit player
        case ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_SUCCESS:

            return {
                ...state,
                onLoad: false,
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_PLAYER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_SUCCESS:
            var playerListResult = liveScoreModal.getPlayerListData(action.result.players)
            state.totalCount = action.result.page.totalCount
            return {
                ...state,
                onLoad: false,
                result: playerListResult,
                status: action.status
            };

        default:
            return state;
    }
}

export default LiveScorePlayerState;
