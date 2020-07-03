import ApiConstants from "../../themes/apiConstants";

/////get the common year list reference
function getYearListAction() {
  const action = {
    type: ApiConstants.API_YEAR_LIST__LOAD
  };
  return action;
}

/////get the common year list reference
function getOnlyYearListAction(yearsArray) {
  const action = {
    type: ApiConstants.API_ONLY_YEAR_LIST__LOAD,
    yearsArray: yearsArray
  };
  return action;
}

/////get the common membership product validity type list reference
function getProductValidityListAction() {
  const action = {
    type: ApiConstants.API_PRODUCT_VALIDITY_LIST__LOAD
  };
  return action;
}

/////get the common Membership Product Fees Type
function getMembershipProductFeesTypeAction() {
  const action = {
    type: ApiConstants.API_COMMON_MEMBERSHIP_PRODUCT_FEES_TYPE__LOAD
  };
  return action;
}

////get commom reference discount type
function getCommonDiscountTypeTypeAction() {
  const action = {
    type: ApiConstants.API_COMMON_DISCOUNT_TYPE__LOAD
  };
  return action;
}

/////get the common Competition type list reference
function getCompetitionTypeListAction(year) {
  const action = {
    type: ApiConstants.API_COMPETITION_TYPE_LIST__LOAD,
    year: year
  };
  return action;
}

//get Role Action
// function getRoleAction() {
//   const action = {
//     type: ApiConstants.API_ROLE_LOAD
//   };
//   return action;
// }

// ////get URE Action
// function getUreAction() {
//   const action = {
//     type: ApiConstants.API_URE_LOAD
//   };

//   return action;
// }

function getVenuesTypeAction() {
  const action = {
    type: ApiConstants.API_REG_FORM_VENUE_LOAD
  };
  return action;
}

function getRegFormAdvSettings() {
  const action = {
    type: ApiConstants.API_REG_FORM_SETTINGS_LOAD
  };
  return action;
}

function getRegistrationMethod() {
  const action = {
    type: ApiConstants.API_REG_FORM_METHOD_LOAD
  };
  return action;
}

/////types of competition in competition fees section from reference table
function competitionFeeInit() {
  const action = {
    type: ApiConstants.API_REG_COMPETITION_FEE_INIT_LOAD,

  };
  return action;
}

function getMatchTypesAction() {
  const action = {
    type: ApiConstants.API_MATCH_TYPES_LOAD
  };
  return action;
}

function getCompetitionFormatTypesAction() {
  const action = {
    type: ApiConstants.API_COMPETITION_FORMAT_TYPES_LOAD
  };
  return action;
}
//////year and competition get action
function getYearAndCompetitionAction(yearData, yearId, key) {
  const action = {
    type: ApiConstants.API_GET_YEAR_COMPETITION_LOAD,
    yearData: yearData,
    yearId: yearId,
    key: key
  };
  return action;
}


// get competition
function getCompetitionTypesAction() {
  const action = {
    type: ApiConstants.API_COMPETITION_TYPES_LOAD
  };
  return action;
}
// clear year competition
function clearYearCompetitionAction() {
  const action = {
    type: ApiConstants.CLEAR_COMPETITION_DATA
  }
  return action
}

function getYearAndCompetitionOwnAction(yearData, yearId, key) {
  const action = {
    type: ApiConstants.API_GET_YEAR_OWN_COMPETITION_LOAD,
    yearData: yearData,
    yearId: yearId,
    key: key
  }
  return action
}

function getYearAndCompetitionParticipateAction(yearData, yearId, key) {
  const action = {
    type: ApiConstants.API_GET_YEAR_Participate_COMPETITION_LOAD,
    yearData: yearData,
    yearId: yearId,
    key: key
  }
  return action
}

function searchVenueList(filterData) {
  const action = {
    type: ApiConstants.Search_Venue_updated_Competition,
    filterData: filterData
  }
  return action
}
function clearFilter() {
  const action = {
    type: ApiConstants.CLEAR_FILTER_SEARCH_VENUE,
  }
  return action;

}

function getEnhancedRoundRobinAction() {
  const action = {
    type: ApiConstants.API_ENHANCED_ROUND_ROBIN_LOAD
  };
  return action;
}

function exportFilesAction(URL) {
  const action = {
    type: ApiConstants.API_EXPORT_FILES_LOAD,
    URL: URL
  };
  return action;
}


function CLEAR_OWN_COMPETITION_DATA(key) {
  const action = {
    type: ApiConstants.CLEAR_OWN_COMPETITION_DATA,
    key
  }
  return action
}

function userExportFilesAction(URL) {
  const action = {
    type: ApiConstants.API_USER_EXPORT_FILES_LOAD,
    URL: URL
  };
  return action;
}

export {
  getYearListAction,
  getOnlyYearListAction,
  getProductValidityListAction,
  getCompetitionTypeListAction,
  getVenuesTypeAction,
  getRegFormAdvSettings,
  getRegistrationMethod,
  getMembershipProductFeesTypeAction,
  getCommonDiscountTypeTypeAction,
  competitionFeeInit,
  getMatchTypesAction,
  getCompetitionTypesAction,
  getCompetitionFormatTypesAction,
  getYearAndCompetitionAction,
  clearYearCompetitionAction,
  getYearAndCompetitionOwnAction,
  getYearAndCompetitionParticipateAction,
  searchVenueList,
  clearFilter,
  getEnhancedRoundRobinAction,
  exportFilesAction,
  CLEAR_OWN_COMPETITION_DATA,
  userExportFilesAction
};
