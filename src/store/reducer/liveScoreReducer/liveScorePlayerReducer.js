import ApiConstants from "../../../themes/apiConstants";
import liveScoreModal from '../../objectModel/liveScoreModal'

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
    playerDataArr: []
};
function LiveScorePlayerState(state = initialState, action) {
    switch (action.type) {
        ////live score player list
        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SUCCESS:

            var playerListResult = liveScoreModal.getPlayerListData(action.result)

            return {
                ...state,
                onLoad: false,
                result: playerListResult,
                status: action.status
            };

        //// Update player data
        case ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER:
            console.log(action)
            if (action.key == 'addplayerScreen') {
                state.playerData = playerObj
            } else if (action.key == 'editplayerScreen') {
                if (action.data) {
                    var editPlayerObj = {
                        firstName: action.data.firstName,
                        lastName: action.data.lastName,
                        dateOfBirth: action.data.dob,
                        phoneNumber: action.data.phoneNumber,
                        mnbPlayerId: action.data.playerId,
                        teamId: action.data.team.id,
                        competitionId: action.data.division.competitionId,
                        photoUrl: action.data.profilePicture
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

        default:
            return state;
    }
}

export default LiveScorePlayerState;
