import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpirePoolData: []
};

function umpirePoolAllocationState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_GET_UMPIRE_POOL_DATA_LOAD:
            return {
                ...state,
                onLoad: true
            };

        case ApiConstants.API_GET_UMPIRE_POOL_DATA_SUCCESS:
            let result = action.result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
                umpirePoolData: result
            };

        case ApiConstants.API_SAVE_UMPIRE_POOL_DATA_LOAD:
            return {
                ...state,
                onLoad: true
            };

        case ApiConstants.API_SAVE_UMPIRE_POOL_DATA_SUCCESS:
            let poolResult = action.result
            let poolObj = {
                competition: poolResult.poolDat,
                competitionId: poolResult.competitionId,
                divisions: [],
                id: poolResult.id,
                name: poolResult.name,
                umpires: poolResult.umpires,
            }
            state.umpirePoolData.push(poolObj)
            return {
                ...state,
                onLoad: false,
                status: action.status,

            };

        case ApiConstants.API_UPDATE_UMPIRE_POOL_DATA_LOAD:
            return {
                ...state,
                onLoad: true
            };
    
        case ApiConstants.API_UPDATE_UMPIRE_POOL_DATA_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                umpirePoolData: action.result
            };

        case ApiConstants.API_DELETE_UMPIRE_POOL_DATA_LOAD:
            return {
                ...state,
                onLoad: true
            };
    
        case ApiConstants.API_DELETE_UMPIRE_POOL_DATA_SUCCESS:
            const umpirePoolDatanew = state.umpirePoolData.filter(poolItem => poolItem.id !== action.result);

            return {
                ...state,
                onLoad: false,
                status: action.status,
                umpirePoolData: umpirePoolDatanew
            };

        case ApiConstants.API_UMPIRE_POOL_ALLOCATION_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_UMPIRE_POOL_ALLOCATION_ERROR:
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

export default umpirePoolAllocationState;