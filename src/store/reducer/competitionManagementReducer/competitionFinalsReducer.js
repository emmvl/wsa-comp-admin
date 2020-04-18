import ApiConstants from "../../../themes/apiConstants";

var obj = 
{
    competitionFormatTemplateId: 0,
    competitionFinalsId: 0,
    isDefault: 0,
    finalsFixtureTemplateRefId: 0,
    finalsMatchTypeRefId:0,
    matchDuration: 0,
    mainBreak: 0,
    qtrBreak: 0,
    timeBetweenGames: 0,
    applyToRefId: 0,
    extraTimeDuration: 0,
    extraTimeMainBreak: 0,
    extraTimeBreak: 0,
    beforeExtraTime: 0,
    extraTimeDrawRefId: 0
}
const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    competitionFinalsList: [obj]
};
function competitionFinalsReducer(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_GET_COMPETITION_FINALS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_COMPETITION_FINALS_SUCCESS:
            let compFinalsData = action.result;
            return {
                ...state,
                onLoad: false,
                competitionFinalsList: compFinalsData,
                status: action.status
            };

        case ApiConstants.API_SAVE_COMPETITION_FINALS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_COMPETITION_FINALS_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            };
        
        case ApiConstants.UPDATE_COMPETITION_FINALS:
        
            let oldData = state.competitionFinalsList;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            let index = action.index;
            console.log("Index::" +index);
            oldData[index][getKey] = updatedValue;
            return { ...state, error: null };

        case ApiConstants.API_COMPETITION_FINALS_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_FINALS_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_GET_TEMPLATE_DOWNLOAD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_TEMPLATE_DOWNLOAD_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        default:
            return state;
    }
}

export default competitionFinalsReducer;
