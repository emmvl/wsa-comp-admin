import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    competitionList: [],
    success: false
};
function innerHorizontalState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_LOAD:


            return { ...state, onLoad: true, success: false };

        case ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_SUCCESS:
            let result = action.result
            console.log(result, 'result_1')
            return {
                ...state,
                onLoad: false,
                competitionList: result,
                status: action.status,
                success: true
            };

        case ApiConstants.API_INNER_HORIZONTAL_FAIL:


            return { ...state, onLoad: false, success: false };

        case ApiConstants.API_INNER_HORIZONTAL_ERROR:
            return {
                ...state,
                onLoad: false,
                success: false
            };

        default:
            return state;
    }
}

export default innerHorizontalState;
