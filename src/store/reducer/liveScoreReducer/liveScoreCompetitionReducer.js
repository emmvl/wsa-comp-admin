import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    loader: false,
    List: null,
    yearList:[]

}
export default function liveScoreCompetition(state = initialState, payload ) {
    switch (payload.type) {
        case ApiConstants.API_LIVESCORE_COMPETITION_INITATE:
            return {
                ...state,
                loader: true
            }
        case ApiConstants.API_LIVESCORE_COMPETITION_SUCCESS:
            console.log(payload)
            return {
                ...state,
                loader: false,
                List: payload.payload
            }
        case ApiConstants.API_LIVESCORE_COMPETITION_ERROR:
            return {
                ...state,
                loader: false,
                errorMessage: payload.payload
            }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_INITIATE:
            return {
                ...state,
                loader: true
            }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_SUCCESS:
            const index = state.List.competitions.findIndex(data => data.id === payload.payload.id)
            state.List.competitions.splice(index, 1)
            // console.log('index', index, state.List)

            return {
                ...state,
                loader: false,
            }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_ERROR:
            // console.log('wooooooo')
            return {
                ...state,
                loader: false,
                deleteError: payload.payload.message
            }

        //LIve score year reducer 

        case ApiConstants.API_ONLY_YEAR_LIST__LOAD:
            return { ...state, loader: true };

        case ApiConstants.API_ONLY_YEAR_LIST_SUCCESS:
            return {
                ...state,
                loader: false,
                yearList: payload.result,
                // status: action.status
            };

        default:
            return state
    }
}