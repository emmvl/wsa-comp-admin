import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    drawGenerateLoad: false,
    error: null,
    result: [],
    status: 0,
};
function CompetitionModuleState(state = initialState, action) {

    switch (action.type) {
        ////Competition Dashboard Case
        case ApiConstants.API_GET_YEAR_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_YEAR_SUCCESS:
            console.log(action.result, 'action.result')
            return {
                ...state,
                onLoad: false,
                result: action.result,
                status: action.status
            };

        case ApiConstants.API_GENERATE_DRAW_LOAD:
            console.log("API_GENERATE_DRAW_LOAD");
            return { ...state, drawGenerateLoad: true };

        case ApiConstants.API_GENERATE_DRAW_SUCCESS:
            return {
                ...state,
                drawGenerateLoad: false,
                result: action.result,
                status: action.status,
                error: null
            };

            case ApiConstants.API_GENERATE_DRAW_FAIL:
               // console.log("%%%%%%%%%%%%%%%%%55 Red Fail" + action.error);
                return {
                    ...state,
                    drawGenerateLoad: false,
                    error: action.error,
                    status: action.status
                };
    
            case ApiConstants.API_GENERATE_DRAW_ERROR:
               // console.log("%%%%%%%%%%%%%%%%%55 Red ERROR" + JSON.stringify(action.error) + "&&&&" + action.status);
                return {
                    ...state,
                    drawGenerateLoad: false,
                    error: action.error,
                    status: action.status
                };

        case ApiConstants.API_GET_YEAR_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_GET_YEAR_ERROR:
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



export default CompetitionModuleState;
