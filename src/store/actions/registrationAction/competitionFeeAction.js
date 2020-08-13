import ApiConstants from "../../../themes/apiConstants";
import { func } from "prop-types";

// get the competition fees list in registration
function regCompetitionListAction(offset, yearRefId, searchText, sortBy, sortOrder) {
    const action = {
        type: ApiConstants.API_REG_COMPETITION_LIST_LOAD,
        offset: offset,
        yearRefId: yearRefId,
        searchText: searchText,
        sortBy, sortOrder
    };
    return action;
}

//////delete the competition list product
function regCompetitionListDeleteAction(competitionId) {
    const action = {
        type: ApiConstants.API_REG_COMPETITION_LIST_DELETE_LOAD,
        competitionId: competitionId
    };
    return action;
}

/////get the competition fees all the data in one API
function getAllCompetitionFeesDeatilsAction(competitionId, hasRegistration, sourceModule) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_FEES_DETAILS_LOAD,
        competitionId: competitionId,
        hasRegistration,
        sourceModule: sourceModule
    };
    return action;
}



/////save the competition fees deatils 
function saveCompetitionFeesDetailsAction(payload, logoOrgId, sourceModule) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_FEES_DETAILS_LOAD,
        payload: payload,
        logoOrgId,
        sourceModule: sourceModule
    };
    return action;
}

////save the competition membership tab details
function saveCompetitionFeesMembershipTabAction(payload, competitionId) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_FEES_MEMBERHSIP_TAB_LOAD,
        payload: payload,
        competitionId: competitionId
    };
    return action;
}

////get default competition membershipproduct tab details
function getDefaultCompFeesMembershipProductTabAction(hasRegistration) {
    const action = {
        type: ApiConstants.API_GET_DEFAULT_COMPETITION_FEES_MEMBERHSIP_PRODUCT_LOAD,
        hasRegistration
    };
    return action;
}

////membership product selected action tochange membership typearray data
function membershipProductSelectedAction(checked, index, membershipProductUniqueKey) {
    const action = {
        type: ApiConstants.COMPETITION_FEES_MEMBERSHIP_PRODUCT_SELECTED_ONCHANGE,
        checked: checked,
        index: index,
        membershipProductUniqueKey: membershipProductUniqueKey,
    };
    return action;
}

///membership product selected action tochange membership typearray data
function membershipTypeSelectedAction(checked, membershipIndex, typeIndex) {
    const action = {
        type: ApiConstants.COMPETITION_FEES_MEMBERSHIP_TYPES_SELECTED_ONCHANGE,
        checked: checked,
        membershipIndex: membershipIndex,
        typeIndex: typeIndex,
    };
    return action;
}

/////save the division table data  in the competition fees section
function saveCompetitionFeesDivisionAction(payload, competitionId) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_FEES_DIVISION_TAB_LOAD,
        payload: payload,
        competitionId: competitionId
    };
    return action;
}

/////onchange the division table data on change
function divisionTableDataOnchangeAction(checked, record, index, keyword) {
    const action = {
        type: ApiConstants.COMPETITION_FEES_DIVISION_TABLE_DATA_ONCHANGE,
        checked: checked,
        record: record,
        index: index,
        keyword: keyword,
    };
    return action;
}

//////add or remove another division inthe divsision tab
function addRemoveDivisionAction(index, item, keyword) {
    const action = {
        type: ApiConstants.COMPETITION_FEES_DIVISION_ADD_REMOVE,
        index: index,
        item: item,
        keyword: keyword,
    };
    return action;
}

//update payments competition fee
function updatePaymentOption(value, index, key) {
    const action = {
        type: ApiConstants.UPDATE_PAYMENTS_COMPETITION_FEES,
        value: value,
        index: index,
        key: key
    }
    return action;
}


// update casual seasonal fee 
function updatePaymentFeeOption(value, key) {
    const action = {
        type: ApiConstants.UPDATE_PAYMENTS_OPTIONS_COMPETITION_FEES,
        value: value,
        key: key
    }
    return action;

}

function paymentFeeDeafault() {
    const action = {
        type: ApiConstants.GET_CASUAL_FEE_DETAIL_API_LOAD,
    }
    return action
}

function instalmentDateAction(value, key) {
    const action = {
        type: ApiConstants.UPDATE_INSTALMENT_DATE,
        value: value,
        key: key
    }
    return action
}
function paymentSeasonalFee() {
    const action = {
        type: ApiConstants.GET_SEASONAL_FEE_DETAIL_API_LOAD,

    }
    return action
}

function competitionPaymentApi(value, competitionId) {
    const action = {
        type: ApiConstants.API_POST_COMPETITION_FEE_PAYMENT_LOAD,
        value: value,
        competitionId: competitionId,
    }
    return action
}


function addRemoveCompFeeDiscountAction(keyAction, index) {
    const action = {
        type: ApiConstants.ADD_ANOTHER_DISCOUNT_COMPETITION_FEE,
        keyAction: keyAction,
        index: index
    }
    return action
}

//// add/edit competition FeeDeatils Action
function add_editcompetitionFeeDeatils(data, key) {
    const action = {
        type: ApiConstants.API_ADD_EDIT_COMPETITION_FEES_DETAILS,
        data: data,
        key: key
    }
    return action
}


///updated discount in membership fees section
function updatedDiscountDataAction(discountData) {
    const action = {
        type: ApiConstants.UPDATE_DISCOUNT_DATA_COMPETITION_FEES,
        discountData: discountData,
    };
    return action;
}

// for update membership fee product
function updatedDiscountMemberPrd(value, discountData, index) {
    const action = {
        type: ApiConstants.UPDATE_DISCOUNT_MEMBERSHIP_PRODUCT,
        value: value,
        discountData: discountData,
        index: index
    }
    return action;
}

////save competition fees discount
function regSaveCompetitionFeeDiscountAction(payload, competitionId) {
    const action = {
        type: ApiConstants.API_POST_COMPETITION_FEE_DISCOUNT_LOAD,
        payload: payload,
        competitionId: competitionId,
    }
    return action
}

//////get default discount type for competition feess
function competitionDiscountTypesAction() {
    const action = {
        type: ApiConstants.API_COMPETITION_DISCOUNT_TYPE_LOAD
    };
    return action;
}


//// check box and Radio btn handler - competition fees section
function checkUncheckcompetitionFeeSction(data, parentIndex, key) {
    const action = {
        type: ApiConstants.CHECK_UNCHECK_COMPETITION_FEES_SECTION,
        data: data,
        parentIndex: parentIndex,
        key: key
    }
    return action
}


/// save competition fee section 
function saveCompetitionFeeSection(data, competitionId) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_FEES_SECTION_LOAD,
        data: data,
        competitionId: competitionId,
    }
    return action
}



///// Add/Edit competition fee section details
function add_editFee_deatialsScetion(data, tableIndex, item, key, arrayKey) {
    const action = {
        type: ApiConstants.API_ADD_EDIT_COMPETITION_FEES_SECTION,
        data: data,
        key: key,
        record: item,
        tableIndex: tableIndex,
        arrayKey: arrayKey
    }

    return action
}

//////clear the reducer data action
function clearCompReducerDataAction(dataName) {
    const action = {
        type: ApiConstants.REG_COMPETITION_FEES_CLEARING_REDUCER_DATA,
        dataName: dataName
    };
    return action;
}

/////get default charity and government voucherss
function getDefaultCharity() {
    const action = {
        type: ApiConstants.API_COMPETITION_FEE_DEFAULT_CHARITY_LOAD
    };
    return action;
}

//////get the default competition logo api
function getDefaultCompFeesLogoAction() {
    const action = {
        type: ApiConstants.API_COMPETITION_FEE_DEFAULT_LOGO_LOAD
    };
    return action;
}


///// On invitees serach action 
function onInviteesSearchAction(value, inviteesType) {
    const action = {
        type: ApiConstants.API_COMPETITION_FEE_INVITEES_SEARCH_LOAD,
        value: value,
        inviteesType: inviteesType
    }
    return action
}

//Delete Competition Division from Comp Details
function removeCompetitionDivisionAction(payload) {
    const action = {
        type: ApiConstants.API_COMPETITION_DIVISION_DELETE_LOAD,
        payload: payload
    };
    return action;
}
export {
    regCompetitionListAction,
    regCompetitionListDeleteAction,
    getAllCompetitionFeesDeatilsAction,
    saveCompetitionFeesDetailsAction,
    saveCompetitionFeesMembershipTabAction,
    getDefaultCompFeesMembershipProductTabAction,
    membershipProductSelectedAction,
    membershipTypeSelectedAction,
    saveCompetitionFeesDivisionAction,
    divisionTableDataOnchangeAction,
    addRemoveDivisionAction,
    updatePaymentOption,
    updatePaymentFeeOption,
    paymentFeeDeafault,
    paymentSeasonalFee,
    competitionPaymentApi,
    addRemoveCompFeeDiscountAction,
    add_editcompetitionFeeDeatils,
    checkUncheckcompetitionFeeSction,
    add_editFee_deatialsScetion,
    saveCompetitionFeeSection,
    updatedDiscountDataAction,
    updatedDiscountMemberPrd,
    regSaveCompetitionFeeDiscountAction,
    competitionDiscountTypesAction,
    clearCompReducerDataAction,
    getDefaultCharity,
    getDefaultCompFeesLogoAction,
    onInviteesSearchAction,
    removeCompetitionDivisionAction,
    instalmentDateAction
};
