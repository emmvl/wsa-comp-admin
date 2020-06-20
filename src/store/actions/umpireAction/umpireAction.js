import ApiConstants from "../../../themes/apiConstants";

function umpireListAction(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_LIST_LOAD,
        data
    };
    return action;
}

function addUmpireAction(data, affiliateId, exsitingUmpireId) {
    const action = {
        type: ApiConstants.API_ADD_UMPIRE_LOAD,
        data,
        affiliateId,
        exsitingUmpireId
    };
    return action;
}

function updateAddUmpireData(data, key) {
    const action = {
        type: ApiConstants.UPDATE_ADD_UMPIRE_DATA,
        data,
        key
    };
    return action;
}

function getUmpireAffiliateList(data) {
    const action = {
        type: ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_LOAD,
        data,
    };
    return action;
}

function umpireSearchAction(data) {
    const action = {
        type: ApiConstants.API_UMPIRE_SEARCH_LOAD,
        data
    }
    return action
}

function umpireClear() {
    const action = {
        type: ApiConstants.CLEAR_UMPIRE_SEARCH
    }
    return action
}

export {
    umpireListAction,
    addUmpireAction,
    updateAddUmpireData,
    getUmpireAffiliateList,
    umpireSearchAction,
    umpireClear
} 
