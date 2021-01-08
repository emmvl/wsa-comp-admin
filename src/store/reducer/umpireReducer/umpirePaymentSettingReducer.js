import ApiConstants from "../../../themes/apiConstants";

var affiliateDivObj = [{ id: 1, name: 'OpenA', disabled: false }, { id: 2, name: 'OpenB', disabled: false }, { id: 3, name: 'OpenC', disabled: false }]
var compOrgDivObj = [{ id: 1, name: 'OpenA', disabled: false }, { id: 2, name: 'OpenB', disabled: false }, { id: 3, name: 'OpenC', disabled: false }]
var defaultInputFieldArray = [{
    name: "Badge AA",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Badge A",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Badge B",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Badge C",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
}]

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

var defaultInputFieldArrayAffiliate = [{
    name: "Badge AA",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Badge A",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Badge B",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
},
{
    name: "Badge C",
    umpireRate: 0,
    umpReserveRate: 0,
    umpCoachRate: 0
}]

var defaulInputFieldsAffiliateOrgByPool = [{
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
    inputFieldArray: defaultInputFieldArray,
    paidByCompOrgDivision: [],
    byBadgeDivision: [],
    selectAllDiv: false,
    paidByAffiliateDivision: [],
    affiliateDiv: affiliateDivObj,
    compOrgDiv: compOrgDivObj,
    allDivisionBadge: false,
    inputFieldArrayAffiliate: defaultInputFieldArrayAffiliate,
    paidByCompOrgDivisionAffiliate: [],
    poolViewArray: [],
    inputFieldForByPool: defaultInputFieldForByPoolArray,
    badgeDataCompOrg: [],
    badgeDataByAffiliate: [],

    paymentSettingsData: null,
};

function getSelectedValue(divId, allArray) {
    for (let i in allArray) {
        for (let j in divId) {
            if (divId[j] === allArray[i].id) {
                allArray[i].disabled = true
            }
        }
    }

    return allArray
}


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

            } else if (key === 'selectAllDiv') {
                state[key] = data

            } else if (key === 'paidByCompOrgDivision' || key === 'paidByAffiliateDivision') {
                state[key] = data

            } else if (key === 'byBadge') {
                state.byBadgeBtn = data

            } else if (key === 'byPool') {
                state.byPoolBtn = data
            } else if (key === 'addAnotherGroup') {
                var obj = {
                    name: null,
                    umpireRate: null,
                    umpReserveRate: null,
                    umpCoachRate: null
                }
                state.inputFieldArray.push(obj)
            }
            else if (key === "addPoolFee") {
                var obj = {
                    fee: null,
                }
                state.poolViewArray.push(obj)
            }

            else if (key === 'addAnotherGroupAffiliate') {
                var obj = {
                    name: null,
                    umpireRate: null,
                    umpReserveRate: null,
                    umpCoachRate: null
                }
                state.inputFieldArrayAffiliate.push(obj)
            } else if (key === 'addAnotherGroupForByPool') {
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
            else if (key === 'removeItem') {
                state.inputFieldArray.splice(action.data.index, 1)
            }
            else if (key === 'removePoolItem') {
                state.inputFieldForByPool.splice(action.data.index, 1)
            }
            else if (key === "removeItemPool") {
                state.poolViewArray.splice(action.data.index, 1)
            }
            else if (key === 'removeItemAffiliate') {
                state.inputFieldArrayAffiliate.splice(action.data.index, 1)
            }
            else if (key === 'byBadgeDivision' || key === 'paidByCompOrgDivision') {
                state[key] = data
            } else if (key === 'refreshPage') {
                state.paidByCompOrg = true
                state.paidByAffiliate = false
                state.byBadgeDivision = []
            }
            else if (key === "allDivisionBadge") {
                state.allDivisionBadge = data
            }
            else if (key === "fee") {
                state.poolViewArray[action.data.index][key] = data
            }
            else if (subkey === "byPoolInputFeilds") {

                if (key === "umpireRate" || key === "umpReserveRate" || key === "umpCoachRate") {
                    state.inputFieldForByPool[action.data.index][key] = Number(Math.round(data + 'e2') + 'e-2');
                } else {
                    state.inputFieldForByPool[action.data.index][key] = data;
                }

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

        default:
            return state;
    }
}

export default umpirePaymentSetting;
