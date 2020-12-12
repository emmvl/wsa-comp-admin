import ApiConstants from "../../../themes/apiConstants";

//////get the membership fee list in registration
function regMembershipListAction(offset, yearRefId, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_REG_MEMBERSHIP_LIST_LOAD,
        offset,
        yearRefId,
        sortBy,
        sortOrder
    };
}

//////delete the membership list product
function regMembershipListDeleteAction(productId) {
    return {
        type: ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_LOAD,
        productId,
    };
}

//////get the membership  product details
function regGetMembershipProductDetailsAction(productId) {
    return {
        type: ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT_LOAD,
        productId,
    };
}

//////save the membership  product details
function regSaveMembershipProductDetailsAction(payload) {
    return {
        type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT__LOAD,
        payload
    };
}

///////////get the default membership  product types in registartion membership fees
function regGetDefaultMembershipProductTypesAction() {
    return {
        type: ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES__LOAD
    };
}

//////save the membership product fees
function regSaveMembershipProductFeesAction(payload) {
    return {
        type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES__LOAD,
        payload
    };
}

//////save the registration form
function regSaveRegistrationForm(payload) {
    return {
        type: ApiConstants.API_REG_FORM_LOAD,
        payload,
    };
}

// get registration form Data
function getRegistrationForm(yearId, competitionId) {
    return {
        type: ApiConstants.API_GET_REG_FORM_LOAD,
        yearId,
        competitionId,
    };
}

/// update registration object
function updateRegistrationForm(updatedData, key, subKey, membershipProductTypeIndex, getMembershipproductItem) {
    return {
        type: ApiConstants.API_UPDATE_REG_FORM_LOAD,
        updatedData,
        key,
        subKey,
        membershipProductTypeIndex,
        getMembershipproductItem
    };
}

//////save the membership product discount
function regSaveMembershipProductDiscountAction(payload) {
    return {
        type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT__LOAD,
        payload
    };
}

//////chnage the membership fees table data
function membershipFeesTableInputChangeAction(value, record, key) {
    return {
        type: ApiConstants.CHANGE_MEMBERSHIP_FEES_TABLE_INPUT,
        value,
        record,
        key
    };
}

/////get the membership product discount Types
function membershipProductDiscountTypesAction() {
    return {
        type: ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD
    };
}

///////add new membership type in the membership fees section
function addNewMembershipTypeAction(newObject) {
    return {
        type: ApiConstants.ADD_NEW_MEMBERSHIP_TYPE,
        newObject,
    };
}

//////////clearing particular reducer data
function clearReducerDataAction(dataName) {
    return {
        type: ApiConstants.REG_CLEARING_PARTICULAR_REDUCER_DATA,
        dataName,
    };
}

///add another discount in membership fees section
function addRemoveDiscountAction(keyAction, index) {
    return {
        type: ApiConstants.ADD_ANOTHER_DISCOUNT_MEMBERSHIP_FEES,
        keyAction,
        index
    };
}

///updated discount in membership fees section
function updatedDiscountDataAction(discountData) {
    return {
        type: ApiConstants.UPDATE_DISCOUNT_DATA_MEMBERSHIP_FEES,
        discountData,
    };
}

////membership fees radio apply fees on change
function membershipFeesApplyRadioAction(radioApplyId, feesIndex, key) {
    return {
        type: ApiConstants.ON_CHANGE_RADIO_APPLY_FEES_MEMBERSHIP_FEES,
        radioApplyId,
        feesIndex,
        key
    };
}

////age mandate onchange selection checkbox
function onChangeAgeCheckBoxAction(index, checkedValue, keyword) {
    return {
        type: ApiConstants.ON_CHANGE_SELECTION_MEM_TYPE_AGE_MANDATE_CHECKBOX,
        index,
        checkedValue,
        keyword,
    };
}

///////onchange date data in age restriction in the membership types
function updatedMembershipTypeDataAction(data) {
    return {
        type: ApiConstants.ON_CHANGE_DATE_AGE_MANDATE_MEMBERSHIP_TYPES,
        data,
    };
}

function changeMembershipProduct(selectedCategory) {
    return {
        type: ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_CATEGORY,
        selectedCategory,
    };
}

function getMembershipproduct(competition) {
    return {
        type: ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_LOAD,
        competition
    };
}

////remove custom membership type from the membership fees
function removeCustomMembershipTypeAction(index) {
    return {
        type: ApiConstants.REMOVE_CUSTOM_MEMBERSHIP_FEES_TYPE,
        index
    };
}

function updateProductSelection(
    matchkey,
    tableKey,
    value,
    registrationLock
) {
    return {
        type: ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_PRODUCT_TYPES,
        matchkey,
        tableKey,
        isSelected: value !== null ? !value : true,
        registrationLock: value !== true ? registrationLock : false
    };
}

function updateRegistrationLock(matchValue, table_key, selected, value) {
    return {
        type: ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_REGISTRATIONLOCK,
        matchValue,
        table_key,
        isSelected: value ? selected : true,
        registrationLock: value !== null ? !value : true
    };
}

function updateDisclamerText(value, index, key) {
    return {
        type: ApiConstants.REG_FORM_UPDATE_DISCLAIMER_TEXT,
        value,
        index,
        key
    };
}

function isCheckedVisible(checked, key) {
    return {
        type: ApiConstants.REG_FORM_CHECKED_VISIBLE,
        checked,
        key
    };
}

function isReplyCheckVisible(checked, key) {
    return {
        type: ApiConstants.REG_FORM_REPLY_CHECKED_VISIBLE,
        checked,
        key
    };
}

/////get the divisions list on the basis of year and competition
function getDivisionsListAction(yearRefId, competitionId, sourceModule) {
    return {
        type: ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_LOAD,
        yearRefId,
        competitionId,
        sourceModule,
    };
}

function getTeamRegistrationsAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_GET_TEAM_REGISTRATIONS_DATA_LOAD,
        payload,
        sortBy,
        sortOrder
    };
}

function exportTeamRegistrationAction(payload) {
    return {
        type: ApiConstants.API_EXPORT_TEAM_REGISTRATIONS_DATA_LOAD,
        payload
    };
}

export {
    regMembershipListAction,
    regMembershipListDeleteAction,
    regGetMembershipProductDetailsAction,
    regSaveMembershipProductDetailsAction,
    regGetDefaultMembershipProductTypesAction,
    regSaveMembershipProductFeesAction,
    regSaveMembershipProductDiscountAction,
    membershipFeesTableInputChangeAction,
    membershipProductDiscountTypesAction,
    regSaveRegistrationForm,
    getRegistrationForm,
    updateRegistrationForm,
    addNewMembershipTypeAction,
    clearReducerDataAction,
    addRemoveDiscountAction,
    updatedDiscountDataAction,
    membershipFeesApplyRadioAction,
    onChangeAgeCheckBoxAction,
    updatedMembershipTypeDataAction,
    changeMembershipProduct,
    getMembershipproduct,
    removeCustomMembershipTypeAction,
    updateProductSelection,
    updateRegistrationLock,
    updateDisclamerText,
    isCheckedVisible,
    isReplyCheckVisible,
    getDivisionsListAction,
    getTeamRegistrationsAction,
    exportTeamRegistrationAction
};
