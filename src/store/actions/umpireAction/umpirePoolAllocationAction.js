import ApiConstants from "themes/apiConstants";

function getUmpirePoolData(payload) {
    return {
        type: ApiConstants.API_GET_UMPIRE_POOL_DATA_LOAD,
        payload,
    };
}

function saveUmpirePoolData(payload) {
    return {
        type: ApiConstants.API_SAVE_UMPIRE_POOL_DATA_LOAD,
        payload,
    };
}

function updateUmpirePoolData(payload) {
    return {
        type: ApiConstants.API_SAVE_UMPIRE_POOL_DATA_LOAD,
        payload,
    };
}

function deleteUmpirePoolData(payload) {
    return {
        type: ApiConstants.API_DELETE_UMPIRE_POOL_DATA_LOAD,
        payload,
    };
}

export {
    getUmpirePoolData,
    saveUmpirePoolData,
    updateUmpirePoolData,
    deleteUmpirePoolData,
}