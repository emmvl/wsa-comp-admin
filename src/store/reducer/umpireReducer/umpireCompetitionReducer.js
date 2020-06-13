import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireComptitionList: []
};
function umpireCompetitionState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD:


            return { ...state, onLoad: true };

        case ApiConstants.API_UMPIRE_COMPETITION_LIST_SUCCESS:
            let result = action.result
            console.log(result, "API_UMPIRE_COMPETITION_LIST_SUCCESS")
            return {
                ...state,
                onLoad: false,
                umpireComptitionList: result,
                status: action.status
            };

        case ApiConstants.API_UMPIRE_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_UMPIRE_ERROR:
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

export default umpireCompetitionState;
