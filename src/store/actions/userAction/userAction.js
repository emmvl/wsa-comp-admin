import ApiConstants from "../../../themes/apiConstants";

//get Role Action
function getRoleAction() {
  const action = {
    type: ApiConstants.API_ROLE_LOAD
  };
  return action;
}

////get URE Action
function getUreAction() {
  const action = {
    type: ApiConstants.API_URE_LOAD
  };

  return action;
}

/* Affiliates Listing */
function getAffiliatesListingAction(payload) {
  const action = {
    type: ApiConstants.API_AFFILIATES_LISTING_LOAD,
    payload: payload
  };
  return action;
}

/* Save Affiliate */
function saveAffiliateAction(payload) {
  const action = {
    type: ApiConstants.API_SAVE_AFFILIATE_LOAD,
    payload: payload
  };
  return action;
}


/* Get Affiliate by Organisation Id */
function getAffiliateByOrganisationIdAction(organisationId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD,
    payload: organisationId
  };
  return action;
}

/* Get Affiliate Our Organisation */
function getAffiliateOurOrganisationIdAction(organisationId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD,
    payload: organisationId
  };
  return action;
}

/* Get AffiliateTo Organisation*/
function getAffiliateToOrganisationAction(organisationId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD,
    payload: organisationId
  };
  return action;
}

// Update Affiliate
function updateAffiliateAction(data, key) {
  const action = {
    type: ApiConstants.UPDATE_AFFILIATE,
    updatedData: data,
    key: key
  };
  return action;
}

// Update NewAffiliate
function updateNewAffiliateAction(data, key) {
  const action = {
    type: ApiConstants.UPDATE_NEW_AFFILIATE,
    updatedData: data,
    key: key
  };
  return action;
}

// Update Org Affiliate
function updateOrgAffiliateAction(data, key) {
  const action = {
    type: ApiConstants.UPDATE_ORG_AFFILIATE,
    updatedData: data,
    key: key
  };
  return action;
}

////get organisation
function getOrganisationAction() {
  const action = {
    type: ApiConstants.API_ORGANISATION_LOAD
  }
  return action
}

function affiliateDeleteAction(affiliateId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_DELETE_LOAD,
    payload: affiliateId
  };
  return action;
}

////get particular user organisation 
function getUserOrganisationAction() {
  const action = {
    type: ApiConstants.API_GET_USER_ORGANISATION_LOAD
  }
  return action
}

//onchange user organisation data
function onOrganisationChangeAction(organisationData, key) {
  const action = {
    type: ApiConstants.ONCHANGE_USER_ORGANISATION,
    organisationData,
    key
  }
  return action
}


/* User Dashboard Textual Listing */
function getUserDashboardTextualAction(payload) {
  const action = {
    type: ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD,
    payload: payload
  };
  return action;
}

function getUserModulePersonalDetailsAction(userId){
  const action = {
    type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD,
    payload: userId
  };
  return action;
}

function getUserModulePersonalByCompetitionAction(payload)
{
  const action = {
    type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD,
    payload: payload
  };
  return action;
}

function getUserModuleRegistrationAction(payload)
{
  const action = {
    type: ApiConstants.API_USER_MODULE_REGISTRATION_LOAD,
    payload: payload
  };
  return action;
}

function getUserModuleMedicalInfoAction(userId){
  const action = {
    type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityPlayerAction(userId){
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityParentAction(userId){
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityScorerAction(userId){
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityManagerAction(userId){
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD,
    payload: userId
  };
  return action;
}


function getUserFriendAction(payload){
  const action = {
    type: ApiConstants.API_USER_FRIEND_LOAD,
    payload: payload
  };
  return action;
}


function getUserReferFriendAction(payload){
  const action = {
    type: ApiConstants.API_USER_REFER_FRIEND_LOAD,
    payload: payload
  };
  return action;
}

function getOrganiationPhotoAction(payload){
  const action = {
    type: ApiConstants.API_GET_ORG_PHOTO_LOAD,
    payload: payload
  };
  return action;
}
function saveOrganiationPhotoAction(payload){
  const action = {
    type: ApiConstants.API_SAVE_ORG_PHOTO_LOAD,
    payload: payload
  };
  return action;
}

function deleteOrganiationPhotoAction(payload){
  const action = {
    type: ApiConstants.API_DELETE_ORG_PHOTO_LOAD,
    payload: payload
  };
  return action;
}

function deleteOrgContact(payload){
  const action = {
    type: ApiConstants.API_DELETE_ORG_CONTACT_LOAD,
    payload: payload
  };
  return action;
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
  getOrganiationPhotoAction,
  saveOrganiationPhotoAction,
  deleteOrganiationPhotoAction,
  deleteOrgContact
}