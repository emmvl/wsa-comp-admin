import ApiConstants from "../../../themes/apiConstants";



//////get the membership fee list in registration
function regMembershipListAction(offset, yearRefId) {
  const action = {
    type: ApiConstants.API_REG_MEMBERSHIP_LIST_LOAD,
    offset: offset,
    yearRefId: yearRefId,
  };
  return action;
}


//////delete the membership list product
function regMembershipListDeleteAction(productId) {
  const action = {
    type: ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_LOAD,
    productId: productId
  };
  return action;
}

//////get the membership  product details
function regGetMembershipProductDetailsAction(productId) {
  const action = {
    type: ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT__LOAD,
    productId: productId
  };
  return action;
}

//////save the membership  product details
function regSaveMembershipProductDetailsAction(payload) {
  const action = {
    type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT__LOAD,
    payload: payload
  };
  return action;
}

///////////get the default membership  product types in registartion membership fees
function regGetDefaultMembershipProductTypesAction() {
  const action = {
    type: ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES__LOAD
  };
  return action;
}

//////save the membership product fees
function regSaveMembershipProductFeesAction(payload) {
  const action = {
    type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES__LOAD,
    payload: payload
  };
  return action;
}

//////save the registration form
function regSaveRegistrationForm(data) {
  const action = {
    type: ApiConstants.API_REG_FORM_LOAD,
    payload: data
  };
  return action;
}

// get registration form Data
function getRegistrationForm(year, competition) {
  const action = {
    type: ApiConstants.API_GET_REG_FORM_LOAD,
    yearId: year,
    competitionId: competition
  };
  return action;
}
/// update registration object
function updateRegistrationForm(data, key) {
  const action = {
    type: ApiConstants.API_UPDATE_REG_FORM_LOAD,
    updatedData: data,
    key: key
  };
  return action;
}
//////save the membership product discount
function regSaveMembershipProductDiscountAction(payload) {
  const action = {
    type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT__LOAD,
    payload: payload
  };
  return action;
}

//////chnage the membership fees table data
function membershipFeesTableInputChangeAction(value, record, key) {
  const action = {
    type: ApiConstants.CHANGE_MEMBERSHIP_FEES_TABLE_INPUT,
    value: value,
    record: record,
    key: key
  };
  return action;
}

/////get the membership product discount Types
function membershipProductDiscountTypesAction() {
  const action = {
    type: ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD
  };
  return action;
}

///////add new membership type in the membership fees section
function addNewMembershipTypeAction(newObject) {
  const action = {
    type: ApiConstants.ADD_NEW_MEMBERSHIP_TYPE,
    newObject: newObject
  };
  return action;
}

//////////clearing particular reducer data
function clearReducerDataAction(dataName) {
  const action = {
    type: ApiConstants.REG_CLEARING_PARTICULAR_REDUCER_DATA,
    dataName: dataName
  };
  return action;
}


///add another discount in membership fees section
function addRemoveDiscountAction(keyAction, index) {
  const action = {
    type: ApiConstants.ADD_ANOTHER_DISCOUNT_MEMBERSHIP_FEES,
    keyAction: keyAction,
    index: index
  };
  return action;
}

///updated discount in membership fees section
function updatedDiscountDataAction(discountData) {
  const action = {
    type: ApiConstants.UPDATE_DISCOUNT_DATA_MEMBERSHIP_FEES,
    discountData: discountData,
  };
  return action;
}

////membership fees radip apply fees on change
function membershipFeesApplyRadioAction(radioApplyId, feesIndex) {
  const action = {
    type: ApiConstants.ON_CHANGE_RADIO_APPLY_FEES_MEMBERSHIP_FEES,
    radioApplyId: radioApplyId,
    feesIndex: feesIndex
  };
  return action;
}

////age mandate onchange selection checkbox
function onChangeAgeCheckBoxAction(index, checkedValue, keyword) {
  const action = {
    type: ApiConstants.ON_CHANGE_SELECTION_MEM_TYPE_AGE_MANDATE_CHECKBOX,
    index: index,
    checkedValue: checkedValue,
    keyword: keyword
  };
  return action;
}

///////onchange date data in age restriction in the membership types
function updatedMembershipTypeDataAction(data) {
  const action = {
    type: ApiConstants.ON_CHANGE_DATE_AGE_MANDATE_MEMBERSHIP_TYPES,
    data: data,
  };
  return action;
}

function changeMembershipProduct(data) {
  const action = {
    type: ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_CATEGORY,
    selectedCategory: data
  };
  return action;
}

function getMembershipproduct(CompetitionId) {
  const action = {
    type: ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_LOAD,
    competition: CompetitionId
  };
  return action;
}

////remove custom membership type from the membership fees
function removeCustomMembershipTypeAction(index) {
  const action = {
    type: ApiConstants.REMOVE_CUSTOM_MEMBERSHIP_FEES_TYPE,
    index: index
  };
  return action;
}

function updateProductSelection(
  matchIndex,
  tableIndex,
  value,
  registrationLock
) {
  const action = {
    type: ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_PRODUCT_TYPES,
    matchkey: matchIndex,
    tableKey: tableIndex,
    isSelected: value !== null ? !value : true,
    registrationLock: value !== true ? registrationLock : false
  };
  return action;
}

function updateRegistrationLock(matchIndex, tableIndex, selected, value) {
  const action = {
    type: ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_REGISTRATIONLOCK,
    matchValue: matchIndex,
    table_key: tableIndex,
    isSelected: value == true ? selected : true,
    registrationLock: value !== null ? !value : true
  };

  return action;
}
function updateDisclamerText(value, index, key) {
  const action = {
    type: ApiConstants.REG_FORM_UPDATE_DISCLAIMER_TEXT,
    value: value,
    index: index,
    key: key
  }
  return action;
}

function isCheckedVisible(checked, key) {
  const action = {
    type: ApiConstants.REG_FORM_CHECKED_VISIBLE,
    checked: checked,
    key: key
  }
  return action;
}
function isReplyCheckVisible(checked, key) {
  const action = {
    type: ApiConstants.REG_FORM_REPLY_CHECKED_VISIBLE,
    checked: checked,
    key: key
  }
  return action;
}

/////get the divisions list on the basis of year and competition
function getDivisionsListAction(yearRefId, competitionId) {
  const action = {
    type: ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_LOAD,
    yearRefId: yearRefId,
    competitionId: competitionId
  };
  return action;
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
  getDivisionsListAction
};
