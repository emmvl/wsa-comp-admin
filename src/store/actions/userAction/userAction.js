import ApiConstants from "../../../themes/apiConstants";

// Get Role
function getRoleAction() {
  return {
    type: ApiConstants.API_ROLE_LOAD
  };
}

// Get URE
function getUreAction() {
  return {
    type: ApiConstants.API_URE_LOAD
  };
}

/* Affiliates Listing */
function getAffiliatesListingAction(payload) {
  return {
    type: ApiConstants.API_AFFILIATES_LISTING_LOAD,
    payload: payload
  };
}

/* Save Affiliate */
function saveAffiliateAction(payload) {
  return {
    type: ApiConstants.API_SAVE_AFFILIATE_LOAD,
    payload: payload
  };
}

/* Get Affiliate by Organisation Id */
function getAffiliateByOrganisationIdAction(organisationId) {
  return {
    type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD,
    payload: organisationId
  };
}

/* Get Affiliate Our Organisation */
function getAffiliateOurOrganisationIdAction(organisationId) {
  return {
    type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD,
    payload: organisationId
  };
}

/* Get AffiliateTo Organisation */
function getAffiliateToOrganisationAction(organisationId) {
  return {
    type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD,
    payload: organisationId
  };
}

// Update Affiliate
function updateAffiliateAction(data, key) {
  return {
    type: ApiConstants.UPDATE_AFFILIATE,
    updatedData: data,
    key: key
  };
}

// Update NewAffiliate
function updateNewAffiliateAction(data, key) {
  return {
    type: ApiConstants.UPDATE_NEW_AFFILIATE,
    updatedData: data,
    key: key
  };
}

// Update Org Affiliate
function updateOrgAffiliateAction(data, key) {
  return {
    type: ApiConstants.UPDATE_ORG_AFFILIATE,
    updatedData: data,
    key: key
  };
}

// Get organisation
function getOrganisationAction() {
  return {
    type: ApiConstants.API_ORGANISATION_LOAD
  }
}

function affiliateDeleteAction(affiliateId) {
  return {
    type: ApiConstants.API_AFFILIATE_DELETE_LOAD,
    payload: affiliateId
  };
}

// Get particular user organisation
function getUserOrganisationAction() {
  return {
    type: ApiConstants.API_GET_USER_ORGANISATION_LOAD
  };
}

// onchange user organisation data
function onOrganisationChangeAction(organisationData, key) {
  return {
    type: ApiConstants.ONCHANGE_USER_ORGANISATION,
    organisationData,
    key
  };
}

/* User Dashboard Textual Listing */
function getUserDashboardTextualAction(payload) {
  return {
    type: ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD,
    payload: payload
  };
}

function getUserModulePersonalDetailsAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD,
    payload: userId
  };
}

function getUserModulePersonalByCompetitionAction(payload) {
  return {
    type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD,
    payload: payload
  };
}

function getUserModuleRegistrationAction(payload) {
  return {
    type: ApiConstants.API_USER_MODULE_REGISTRATION_LOAD,
    payload: payload
  };
}

function getUserModuleMedicalInfoAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD,
    payload: userId
  };
}

function getUserModuleActivityPlayerAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD,
    payload: userId
  };
}

function getUserModuleActivityParentAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD,
    payload: userId
  };
}

function getUserModuleActivityScorerAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD,
    payload: userId
  };
}

function getUserModuleActivityManagerAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD,
    payload: userId
  };
}

function getUserFriendAction(payload) {
  return {
    type: ApiConstants.API_USER_FRIEND_LOAD,
    payload: payload
  };
}

function getUserReferFriendAction(payload) {
  return {
    type: ApiConstants.API_USER_REFER_FRIEND_LOAD,
    payload: payload
  };
}

function getOrganisationPhotoAction(payload) {
  return {
    type: ApiConstants.API_GET_ORG_PHOTO_LOAD,
    payload: payload
  };
}

function saveOrganisationPhotoAction(payload) {
  return {
    type: ApiConstants.API_SAVE_ORG_PHOTO_LOAD,
    payload: payload
  };
}

function deleteOrganisationPhotoAction(payload) {
  return {
    type: ApiConstants.API_DELETE_ORG_PHOTO_LOAD,
    payload: payload
  };
}

function deleteOrgContact(payload) {
  return {
    type: ApiConstants.API_DELETE_ORG_CONTACT_LOAD,
    payload: payload
  };
}

/* Export Organisation Registration Question */
function exportOrgRegQuestionAction(payload) {
  return {
    type: ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_LOAD,
    payload: payload
  };
}

/* Affiliate Directory Listing */
function getAffiliateDirectoryAction(payload) {
  return {
    type: ApiConstants.API_AFFILIATE_DIRECTORY_LOAD,
    payload: payload
  };
}

/* Export Affiliate Directory */
function exportAffiliateDirectoryAction(payload) {
  return {
    type: ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_LOAD,
    payload: payload
  };
}

function userProfileUpdateAction(data) {
  return {
    type: ApiConstants.API_USER_PROFILE_UPDATE_LOAD,
    data,
  };
}

function userPhotoUpdateAction(payload) {
  return {
    type: ApiConstants.API_USER_PHOTO_UPDATE_LOAD,
    payload,
  }
}

function userDetailUpdateAction(payload) {
  return {
    type: ApiConstants.API_USER_DETAIL_UPDATE_LOAD,
    payload,
  }
}

function userPasswordUpdateAction(payload) {
  return {
    type: ApiConstants.API_USER_PASSWORD_UPDATE_LOAD,
    payload,
  }
}

function getUserHistoryAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_HISTORY_LOAD,
    payload: userId
  };
}

function getUserProfileAction() {
  return {
    type: ApiConstants.API_USER_DETAIL_LOAD,
  };
}

export {
  getRoleAction,
  getUreAction,
  getAffiliatesListingAction,
  saveAffiliateAction,
  getAffiliateByOrganisationIdAction,
  getAffiliateToOrganisationAction,
  updateAffiliateAction,
  updateNewAffiliateAction,
  getAffiliateOurOrganisationIdAction,
  updateOrgAffiliateAction,
  getOrganisationAction,
  affiliateDeleteAction,
  getUserOrganisationAction,
  onOrganisationChangeAction,
  getUserDashboardTextualAction,
  getUserModulePersonalDetailsAction,
  getUserModuleMedicalInfoAction,
  getUserModuleRegistrationAction,
  getUserModulePersonalByCompetitionAction,
  getUserModuleActivityPlayerAction,
  getUserModuleActivityParentAction,
  getUserModuleActivityScorerAction,
  getUserModuleActivityManagerAction,
  getUserFriendAction,
  getUserReferFriendAction,
  getOrganisationPhotoAction,
  saveOrganisationPhotoAction,
  deleteOrganisationPhotoAction,
  deleteOrgContact,
  exportOrgRegQuestionAction,
  getAffiliateDirectoryAction,
  exportAffiliateDirectoryAction,
  userProfileUpdateAction,
  getUserHistoryAction,
  userPhotoUpdateAction,
  userDetailUpdateAction,
  userPasswordUpdateAction,
  getUserProfileAction,
}