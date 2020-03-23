import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    loader: false,
    List: null,

}
export default function liveScoreCompetition(state = initialState, { type, payload }) {
    switch (type) {
        case ApiConstants.API_LIVESCORE_COMPETITION_INITATE:
            return { ...state, loader: true }
        case ApiConstants.API_LIVESCORE_COMPETITION_SUCCESS:
            return { ...state, loader: false, List: payload }
        case ApiConstants.API_LIVESCORE_COMPETITION_ERROR:
            return { ...state, loader: false, errorMessage: payload }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_INITIATE:
            return { ...state, loader: true }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_SUCCESS:
            const index = state.List.competitions.findIndex(data => data.id === payload.id)
            state.List.competitions.splice(index, 1)
            // console.log('index', index, state.List)

            return { ...state, loader: false, }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_ERROR:
            // console.log('wooooooo')
            return { ...state, loader: false, deleteError: payload.message }
        default:
            return state
    }
}