import ApiConstants from "../../../themes/apiConstants";

var affiliateDivObj = [{ id: 1, name: 'OpenA', disabled: false }, { id: 2, name: 'OpenB', disabled: false }, { id: 3, name: 'OpenC', disabled: false }]
var compOrgDivObj = [{ id: 1, name: 'OpenA', disabled: false }, { id: 2, name: 'OpenB', disabled: false }, { id: 3, name: 'OpenC', disabled: false }]

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
    inputFieldArray: [],
    paidByCompOrgDivision: [],
    byBadgeDivision: [],
    selectAllDiv: false,
    paidByAffiliateDivision: [],
    affiliateDiv: affiliateDivObj,
    compOrgDiv: compOrgDivObj,
};

function getSelectedValue(divId, allArray) {
    console.log(divId, 'getSelectedValue', allArray)
    for (let i in allArray) {

        for (let j in divId) {

            if (divId[j] === allArray[i].id) {
                allArray[i].disabled = true

            }
        }
    }

    return allArray
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

            if (key === 'paidByComp') {
                state.paidByCompOrg = data

            } else if (key === 'paidByAffilate') {
                state.paidByAffiliate = data

            } else if (key === 'selectAllDiv') {
                state[key] = data

            } else if (key === 'paidByCompOrgDivision' || key === 'paidByAffiliateDivision') {
                // if (key === 'paidByCompOrgDivision') {
                //     state.affiliateDiv = getSelectedValue(data, state.affiliateDiv)
                // }
                // if (key === 'paidByAffiliateDivision') {
                //     state.compOrgDiv = getSelectedValue(data, state.compOrgDiv)
                // }
                state[key] = data

            } else if (key === 'byBadge') {
                state.byBadgeBtn = data
                state.byPoolBtn = false

            } else if (key === 'byPool') {
                state.byPoolBtn = data
                state.byBadgeBtn = false
                state.inputFieldArray = []
                state.byBadgeDivision = []
            } else if (key === 'addAnotherGroup') {

                var obj = {
                    name: null,
                    umpireRate: null,
                    umpReserveRate: null,
                    umpCoachRate: null
                }
                state.inputFieldArray.push(obj)

            } else if (key === 'removeItem') {
                state.inputFieldArray.splice(action.data.index, 1)

            } else if (key === 'byBadgeDivision' || key === 'paidByCompOrgDivision') {
                state[key] = data

            } else if (key === 'refreshPage') {
                state.paidByCompOrg = true
                state.paidByAffiliate = false
                state.byBadgeDivision = []
                state.inputFieldArray = []

            } else {
                state.inputFieldArray[action.data.index][key] = data;
            }

            return {
                ...state,

            };

        default:
            return state;
    }
}

export default umpirePaymentSetting;
