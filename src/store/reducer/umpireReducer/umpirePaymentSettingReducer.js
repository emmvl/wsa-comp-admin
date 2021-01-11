import ApiConstants from "../../../themes/apiConstants";

var defaultInputFieldForByPoolArray = [{
    name: "Pool A",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Pool B",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Pool C",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
}]

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireComptitionList: [],
    paidByCompOrg: false,
    paidByAffiliate: false,
    byBadgeBtn: false,
    byPoolBtn: false,
    paidByCompOrgDivisionAffiliate: [],
    poolViewArray: [],
    inputFieldForByPool: defaultInputFieldForByPoolArray,
    badgeDataCompOrg: [],
    badgeDataByAffiliate: [],

    paymentSettingsData: null,
};

function getFilterBadgeData(badgeData) {

    let arr = []
    for (let i in badgeData) {
        let obj = {
            description: badgeData[i].description,
            id: badgeData[i].id,
            name: badgeData[i].name,
            sortOrder: badgeData[i].sortOrder,
            subReferences: badgeData[i].subReferences,
            umpireRate: 0,
            umpReserveRate: 0,
            umpCoachRate: 0
        }
        arr.push(obj)
    }
    return arr;
}

function umpirePaymentSetting(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD:


            return { ...state, onLoad: true };

        case ApiConstants.API_UMPIRE_COMPETITION_LIST_SUCCESS:
            let result = action.result
            return {
                ...state,
                onLoad: false,
                umpireComptitionList: result,
                status: action.status
            };

        case ApiConstants.API_UPDATE_UMPIRE_PAYMENT_SETTING:

            let data = action.data.value
            let key = action.data.key
            let subkey = action.data.subkey
            if (key === 'paidByComp') {
                state.paidByCompOrg = data

            } else if (key === 'paidByAffilate') {
                state.paidByAffiliate = data

            } else if (key === 'byBadge') {
                state.byBadgeBtn = data

            } else if (key === 'byPool') {
                state.byPoolBtn = data
            } 
            else if (key === "addPoolFee") {
                var obj = {
                    fee: null,
                }
                state.poolViewArray.push(obj)
            }

            else if (key === 'addAnotherGroupForByPool') {
                var obj = {
                    name: null,
                    umpireRate: null,
                    umpReserveRate: null,
                    umpCoachRate: null
                }
                state.inputFieldForByPool.push(obj)
            }
            else if (key === 'addAnotherInputFieldsAffiliateOrgByPool') {
                var obj = {
                    name: null,
                    umpireRate: null,
                    umpReserveRate: null,
                    umpCoachRate: null
                }
                // state.inputFieldsAffiliateOrgByPool.push(obj)
            }
            else if (key === 'removePoolItem') {
                state.inputFieldForByPool.splice(action.data.index, 1)
            }
            else if (key === "removeItemPool") {
                state.poolViewArray.splice(action.data.index, 1)
            }
            else if (key === 'refreshPage') {
                state.paidByCompOrg = true
                state.paidByAffiliate = false
            }
            else if (key === "fee") {
                state.poolViewArray[action.data.index][key] = data
            }
            else if (key === "umpireRate" || key === "umpReserveRate" || key === "umpCoachRate") {
                state.badgeDataCompOrg[action.data.index][key] = Number(Math.round(data + 'e2') + 'e-2');
            }
            else {
                state.badgeDataCompOrg[action.data.index][key] = data;
            }
            return {
                ...state,

            };

        ////Ref Badge 
        case ApiConstants.API_GET_REF_BADGE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_REF_BADGE_SUCCESS:
            let filterBadgeData = getFilterBadgeData(action.result)
            state.badgeDataCompOrg = filterBadgeData
            state.badgeDataByAffiliate = filterBadgeData
            return {
                ...state,
                onLoad: false,
                status: action.status,
            };


        // get umpire payment settings
        case ApiConstants.API_GET_UMPIRE_PAYMENT_SETTINGS_LOAD:
            return {
                ...state,
                onLoad: true,
            };
            
        case ApiConstants.API_GET_UMPIRE_PAYMENT_SETTINGS_SUCCESS:
            return {
                ...state,
                paymentSettingsData: action.result,
                onLoad: false,
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

export default umpirePaymentSetting;
