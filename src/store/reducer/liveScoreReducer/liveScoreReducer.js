import ApiConstants from "themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    divisionList: [],
    status: 0,
    liveScoreMatchListData: [],
    teamResult: [],
    roundResult: [],
    checkInitState: {
        isDivision: false,
        isTeam: false,
        isRound: false,
        isLadder: false,
    },
    scorerListResult: [],
};

function getNameWithNumber(name, number) {
    let numberLength = number.length < 10 ? new Array(10 - 4).join('x') + number.substr(number - 5, 4) : new Array(number.length - 4).join('x') +
        number.substr(number.length - 5, 4);
    let newName = name + "-" + numberLength
    return newName
}

function updateScorerData(result) {
    if (result.length > 0) {
        for (let i in result) {
            let number = JSON.stringify(result[i].mobileNumber)
            let name = result[i].firstName + " " + result[i].lastName
            let NameWithNumber = getNameWithNumber(name, number)
            result[i].NameWithNumber = NameWithNumber
        }
    }
    return result
}

function LiveScoreState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                divisionList: action.divisionList ? action.divisionList : [],
                teamResult: action.teamResult,
                roundResult: action.roundResult,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_SUCCESS:
            // state.roundResult.push(action.result);
            return {
                ...state,
                onLoad: false,
                // result: action.result,
                // status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_SUCCESS:
            let result = action.result ? updateScorerData(action.result) : []
            return {
                ...state,
                onLoad: false,
                scorerListResult: result,
            };

        default:
            return state;
    }
}

export default LiveScoreState;
