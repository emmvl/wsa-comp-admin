import ApiConstants from "../../../themes/apiConstants";

var umpireObj = {
    id: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    affiliates: null
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireList: [],
    umpireRadioBtn: 'new',
    umpireData: umpireObj,
    affiliateId: null,
    exsitingUmpireId: null,
    affilateList: [],
    umpireListResult: [],
    onLoadSearch: false,
    selectedAffiliate: null,
    onAffiliateLoad: false,
    selectedAffiliateId: null,
    onSaveLoad: false
};

function getAffiliateData(selectedAffiliateId, affiliateArray) {

    let affiliateObj = []
    let obj = ''
    for (let i in affiliateArray) {

        for (let j in selectedAffiliateId) {
            if (selectedAffiliateId[j] == affiliateArray[i].id) {
                obj = {
                    "name": affiliateArray[i].name,
                    "id": affiliateArray[i].id
                }
                affiliateObj.push(obj)
                break;
            }

        }

    }
    return affiliateObj;

}

function genrateAffiliateId(affiliateIdArr) {

    let affiliateId = []
    for (let i in affiliateIdArr) {
        affiliateId.push(affiliateIdArr[i].entityId)
    }

    return affiliateId

}

//// get umpire selected Affiliate
function getumpireAffiliate(selectedUmpireId, umpireListArr) {

    let selectedAffiliate

    for (let i in umpireListArr) {

        if (selectedUmpireId == umpireListArr[i].id) {
            selectedAffiliate = umpireListArr[i].linkedEntity
        }
    }

    return selectedAffiliate
}

function genrateSelectedAffiliateId(linkedEntityArr, affiliateArr) {
    let affiliateIds = []

    for (let i in affiliateArr) {
        for (let j in linkedEntityArr) {
            if (linkedEntityArr[j].entityId == affiliateArr[i].id) {
                affiliateIds.push(linkedEntityArr[j].entityId)
            }
        }
    }
    return affiliateIds
}


function umpireState(state = initialState, action) {
    switch (action.type) {

        //// Umpire List
        case ApiConstants.API_UMPIRE_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_UMPIRE_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                umpireList: action.result,
                umpireListResult: action.result,
                status: action.status
            };

        //// Add Umpire
        case ApiConstants.API_ADD_UMPIRE_LOAD:


            return { ...state, onSaveLoad: true };

        case ApiConstants.API_ADD_UMPIRE_SUCCESS:
            return {
                ...state,
                onSaveLoad: false,
                status: action.status
            };

        //// Get Affiliate List
        case ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_LOAD:


            return { ...state, onAffiliateLoad: true };

        case ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_SUCCESS:
            console.log(action.result, 'affilateListSuccess')
            return {
                ...state,
                onAffiliateLoad: false,
                affilateList: action.result,
                status: action.status
            };


        //// Update Add Umpire Data
        case ApiConstants.UPDATE_ADD_UMPIRE_DATA:
            let key = action.key
            let data = action.data
            console.log(data, 'UPDATE_ADD_UMPIRE_DATA')
            if (key == 'umpireRadioBtn') {
                state.umpireRadioBtn = data
                state.affiliateId = []
            } else if (key == 'affiliateId') {

                state.affiliateId = data
                let affiliateObj = getAffiliateData(data, state.affilateList)
                state.umpireData['affiliates'] = affiliateObj

            } else if (key == 'umnpireSearch') {

                state.exsitingUmpireId = data
                state.selectedAffiliateId = getumpireAffiliate(data, state.umpireListResult)
                console.log(state.selectedAffiliateId, 'getAffiliateId~~')

                let getAffiliateId = genrateSelectedAffiliateId(state.selectedAffiliateId, state.affilateList)
                console.log(getAffiliateId, 'getAffiliateId')
                state.affiliateId = getAffiliateId


            } else if (action.key == 'isEditUmpire') {
                state.umpireData.id = data.id
                state.umpireData.firstName = data.firstName
                state.umpireData.lastName = data.lastName
                state.umpireData.mobileNumber = data.mobileNumber
                state.umpireData.email = data.email
                let getAffiliateId = genrateAffiliateId(data.linkedEntity)
                state.affiliateId = getAffiliateId
                console.log(getAffiliateId, 'UPDATE_ADD_UMPIRE_DATA~~~', state.affiliateId)
                let umpireAffiliateObj = getAffiliateData(state.affiliateId, state.affilateList)
                state.umpireData['affiliates'] = umpireAffiliateObj

                state.umpireRadioBtn = 'new'

            } else if (action.key == 'isAddUmpire') {
                state.umpireData = umpireObj
                state.umpireData.id = null
                state.affiliateId = []
                state.umpireRadioBtn = 'new'

            } else {
                state.umpireData[action.key] = action.data
            }

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        ////Umpire Search
        case ApiConstants.API_UMPIRE_SEARCH_LOAD:
            return { ...state, onLoadSearch: true };

        case ApiConstants.API_UMPIRE_SEARCH_SUCCESS:
            console.log(action, 'API_UMPIRE_SEARCH_SUCCESS')
            return {
                ...state,
                onLoadSearch: false,
                umpireListResult: action.result,
                status: action.status,
            }

        case ApiConstants.CLEAR_UMPIRE_SEARCH:

            return {
                ...state,
                umpireListResult: state.umpireListResult
            }

        //// Fail and Error case
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

export default umpireState;
