import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

let affiliate = {
  affiliateId: 0,
  affiliateOrgId: 0,
  organisationTypeRefId: 0,
  affiliatedToOrgId: 0,
  organisationId: "",
  name: '',
  street1: '',
  street2: '',
  suburb: '',
  phoneNo: '',
  city: '',
  postalCode: '',
  stateRefId: 0,
  whatIsTheLowestOrgThatCanAddChild: 0,
  contacts: [],
  email: '',
  charityRoundUp: [],
  charity: []
};

// let affiliateListObj = {
//   affiliateId: 0,
//   affiliateToOrgId: 0,
//   affiliateOrgId: 0,
//   affiliateName: '',
//   affiliatedToName: '',
//   organisationTypeRefName: '',
//   contact1Name: '',
//   contact2Name: '',
//   statusRefName: ''
// };
//
// let affiliateToObj = {
//   affiliateTo: [],
//   organisationTypes: [],
//   organisationName: ''
// };

const initialState = {
  onLoad: false,
  affiliateOnLoad: false,
  affiliateToOnLoad: false,
  affiliateOurOrgOnLoad: false,
  onTextualLoad: false,
  onUpUpdateLoad: false,
  error: null,
  result: [],
  status: 0,
  affiliate: { affiliate },
  affiliateEdit: affiliate,
  affiliateOurOrg: affiliate,
  affiliateList: [],
  affiliateTo: {},
  roles: [],
  userRolesEntity: [],
  affiliateListPage: 1,
  affiliateListTotalCount: 1,
  venueOrganisation: [],
  allUserOrganisationData: [],
  getUserOrganisation: [],
  userDashboardTextualList: [],
  userDashboardTextualPage: 1,
  userDashboardTextualTotalCount: 1,
  personalData: {},
  personalEmergency: [],
  medicalData: [],
  personalByCompData: [],
  userRegistrationList: [],
  userRegistrationPage: 1,
  userRegistrationTotalCount: 1,
  userRegistrationOnLoad: false,
  activityPlayerOnLoad: false,
  activityPlayerList: [],
  activityPlayerPage: 1,
  activityPlayerTotalCount: 1,
  activityParentOnLoad: false,
  activityParentList: [],
  activityParentPage: 1,
  activityParentTotalCount: 1,
  activityScorerOnLoad: false,
  activityScorerList: [],
  activityScorerPage: 1,
  activityScorerTotalCount: 1,
  activityManagerOnLoad: false,
  activityManagerList: [],
  activityManagerPage: 1,
  activityManagerTotalCount: 1,
  onOrgLoad: false,
  friendList: [],
  friendPage: 1,
  friendTotalCount: 1,
  referFriendList: [],
  referFriendPage: 1,
  referFriendTotalCount: 1,
  orgPhotosList: [],
  userDashboardCounts: null,
  onAffiliateDirLoad: false,
  affiliateDirectoryList: [],
  affiliateDirectoryPage: 1,
  affiliateDirectoryTotalCount: 1,
  organisationTypes: [],
  onExpAffiliateDirLoad: false,
  onMedicalLoad: false,
  onPersonLoad: false,
  userHistoryLoad: false,
  userHistoryList: [],
  userHistoryPage: 1,
  userHistoryTotalCount: 1,
  isProfileLoaded: false,
  userProfile: {},
  userDetailUpdate: false,
  userPhotoUpdate: false,
  userPasswordUpdate: false,
  defaultCharityRoundUp: [],
  impersonationLoad: false,
  impersonation: false,
  userRoleEntity: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_USER_FAIL:
      return {
        ...state,
        onLoad: false,
        impersonationLoad: false,
        userDetailUpdate: false,
        userPhotoUpdate: false,
        userPasswordUpdate: false,
        error: action.error,
        status: action.status
      };

    case ApiConstants.API_USER_ERROR:
      return {
        ...state,
        onLoad: false,
        impersonationLoad: false,
        userDetailUpdate: false,
        userPhotoUpdate: false,
        userPasswordUpdate: false,
        error: action.error,
        status: action.status
      };

    // get Role Entity List for current user
    case ApiConstants.API_ROLE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_ROLE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        roles: action.result,
        status: action.status
      };

    // User Role Entity List for current user
    case ApiConstants.API_URE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_URE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        userRoleEntity: action.result,
        status: action.status
      };

    case ApiConstants.API_AFFILIATES_LISTING_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_AFFILIATES_LISTING_SUCCESS:
      let data = action.result;
      return {
        ...state,
        onLoad: false,
        affiliateList: data.affiliates,
        affiliateListPage: data.page ? data.page.currentPage : 1,
        affiliateListTotalCount: data.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_SAVE_AFFILIATE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_SAVE_AFFILIATE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status
      };

    case ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD:
      return { ...state, onLoad: true, affiliateOnLoad: true };

    case ApiConstants.API_AFFILIATE_BY_ORGANISATION_SUCCESS:
      let affiliateData = action.result;
      return {
        ...state,
        onLoad: false,
        affiliateOnLoad: false,
        affiliateEdit: affiliateData,
        status: action.status
      };

    case ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD:
      return { ...state, onLoad: true, affiliateOurOrgOnLoad: true };

    case ApiConstants.API_AFFILIATE_OUR_ORGANISATION_SUCCESS:
      let affiliateOurOrgData = action.result
      let charityData = getCharityResult(action.charityResult);
      let selectedCharity = checkSelectedCharity(affiliateOurOrgData.charityRoundUp, charityData)
      affiliateOurOrgData["charityRoundUp"] = selectedCharity;

      return {
        ...state,
        onLoad: false,
        affiliateOurOrgOnLoad: false,
        affiliateOurOrg: affiliateOurOrgData,
        defaultCharityRoundUp: charityData,
        status: action.status
      };

    case ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD:
      return { ...state, onLoad: true, affiliateToOnLoad: true };

    case ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS:
      let affiliateToData = action.result;
      return {
        ...state,
        onLoad: false,
        affiliateTo: affiliateToData,
        affiliateToOnLoad: false,
        status: action.status
      };

    case ApiConstants.UPDATE_AFFILIATE:
      let oldData = state.affiliateEdit;
      let updatedValue = action.updatedData;
      let getKey = action.key;
      oldData[getKey] = updatedValue;
      return { ...state, error: null };

    case ApiConstants.UPDATE_ORG_AFFILIATE:
      let oldOrgData = state.affiliateOurOrg;
      let updatedOrgValue = action.updatedData;
      let getOrgKey = action.key;
      oldOrgData[getOrgKey] = updatedOrgValue;
      return { ...state, error: null };

    case ApiConstants.UPDATE_ORGANISATION_CHARITY_ROUND_UP:
      if (action.key == 'charityRoundUp') {
        state.affiliateOurOrg.charityRoundUp[action.index].isSelected = action.value
      }
     
      if (action.key == "name") {
         state.affiliateOurOrg["charity"][action.index][action.key] = action.value
      }
      if (action.key == "description") {
          state.affiliateOurOrg["charity"][action.index][action.key] = action.value
      }
      
      return { ...state }

    case ApiConstants.UPDATE_NEW_AFFILIATE:
      let oldAffiliateData = state.affiliate.affiliate;
      let updatedVal = action.updatedData;
      let key = action.key;
      oldAffiliateData[key] = updatedVal;
      return { ...state, error: null };

    //Get organisation for add venue
    case ApiConstants.API_ORGANISATION_LOAD:
      return { ...state, onLoad: true, error: null }

    case ApiConstants.API_ORGANISATION_SUCCESS:
      return {
        ...state,
        venueOrganisation: action.result,
        onLoad: false,
        error: null,
        status: action.status
      }

    //////delete the Affiliate
    case ApiConstants.API_AFFILIATE_DELETE_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_AFFILIATE_DELETE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    /////get particular user organisation
    case ApiConstants.API_GET_USER_ORGANISATION_LOAD:
      return { ...state, onLoad: true, error: null, onOrgLoad: true }

    case ApiConstants.API_GET_USER_ORGANISATION_SUCCESS:
      state.allUserOrganisationData = isArrayNotEmpty(action.result) ? action.result : [];
      state.getUserOrganisation = isArrayNotEmpty(action.result) ? action.result : [];
      state.onOrgLoad = false;
      return {
        ...state,
        onLoad: false,
        error: null,
        status: action.status
      }

    ////onchange user organisation data
    case ApiConstants.ONCHANGE_USER_ORGANISATION:
      let allOrgData = JSON.parse(JSON.stringify(state.allUserOrganisationData))
      let organisationIndex = allOrgData.findIndex(
        x => x.organisationUniqueKey === action.organisationData.organisationUniqueKey
      );
      if (organisationIndex > -1) {
        allOrgData.splice(organisationIndex, 1);
        state.getUserOrganisation = allOrgData;
      }
      return {
        ...state,
        onLoad: false,
        error: null
      };

    case ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD:
      return { ...state, onTextualLoad: true };

    case ApiConstants.API_USER_DASHBOARD_TEXTUAL_SUCCESS:
      let textualData = action.result;
      return {
        ...state,
        onTextualLoad: false,
        userDashboardTextualList: textualData.users,
        userDashboardTextualPage: textualData.page ? textualData.page.currentPage : 1,
        userDashboardTextualTotalCount: textualData.page.totalCount,
        competitions: isArrayNotEmpty(textualData.competitions) ? textualData.competitions : [],
        organisations: isArrayNotEmpty(textualData.organisations) ? textualData.organisations : [],
        roles: isArrayNotEmpty(textualData.roles) ? textualData.roles : [],
        userDashboardCounts: textualData.counts,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS:
      let personalData = action.result;
      let arr = [];
      if (personalData != null) {
        let obj = {
          emergencyContactName: personalData.emergencyContactName,
          emergencyContactNumber: personalData.emergencyContactNumber,
          userId: personalData.userId
        };
        arr.push(obj);
      }
      return {
        ...state,
        onLoad: false,
        personalData: personalData,
        personalEmergency: arr,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD:
      return { ...state, onPersonLoad: true };

    case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS:
      let personalByCompData = action.result;
      return {
        ...state,
        onPersonLoad: false,
        personalByCompData: personalByCompData,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD:
      return { ...state, onMedicalLoad: true };

    case ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS:
      let medicalData = action.result;
      return {
        ...state,
        onMedicalLoad: false,
        medicalData: medicalData,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_REGISTRATION_LOAD:
      return { ...state, userRegistrationOnLoad: true };

    case ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS:
      let userRegistrationData = action.result;
      return {
        ...state,
        userRegistrationOnLoad: false,
        userRegistrationList: userRegistrationData.registrationDetails,
        userRegistrationDataPage: userRegistrationData.page ? userRegistrationData.page.currentPage : 1,
        userRegistrationDataTotalCount: userRegistrationData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD:
      return { ...state, activityPlayerOnLoad: true };

    case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS:
      let activityPlayerData = action.result;
      return {
        ...state,
        activityPlayerOnLoad: false,
        activityPlayerList: activityPlayerData.activityPlayers,
        activityPlayerPage: activityPlayerData.page ? activityPlayerData.page.currentPage : 1,
        activityPlayerTotalCount: activityPlayerData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD:
      return { ...state, activityParentOnLoad: true };

    case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS:
      let activityParentData = action.result;
      return {
        ...state,
        activityParentOnLoad: false,
        activityParentList: activityParentData.activityParents,
        activityParentPage: activityParentData.page ? activityParentData.page.currentPage : 1,
        activityParentTotalCount: activityParentData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD:
      return { ...state, activityScorerOnLoad: true };

    case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS:
      let activityScorerData = action.result;
      return {
        ...state,
        activityScorerOnLoad: false,
        activityScorerList: activityScorerData.activityScorer,
        activityScorerPage: activityScorerData.page ? activityScorerData.page.currentPage : 1,
        activityScorerTotalCount: activityScorerData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD:
      return { ...state, activityManagerOnLoad: true };

    case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS:
      let activityManagerData = action.result;
      return {
        ...state,
        activityManagerOnLoad: false,
        activityManagerList: activityManagerData.activityManager,
        activityManagerPage: activityManagerData.page ? activityManagerData.page.currentPage : 1,
        activityManagerTotalCount: activityManagerData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_FRIEND_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_USER_FRIEND_SUCCESS:
      let friendData = action.result;
      return {
        ...state,
        onLoad: false,
        friendList: friendData ? friendData.friends : [],
        friendPage: (friendData && friendData.page) ? friendData.page.currentPage : 1,
        friendTotalCount: (friendData && friendData.page) ? friendData.page.totalCount : 1,
        status: action.status
      };

    case ApiConstants.API_USER_REFER_FRIEND_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_USER_REFER_FRIEND_SUCCESS:
      let referFriendData = action.result;
      return {
        ...state,
        onLoad: false,
        referFriendList: referFriendData ? referFriendData.referFriends : [],
        referFriendPage: (referFriendData && referFriendData.page) ? referFriendData.page.currentPage : 1,
        referFriendTotalCount: (referFriendData && referFriendData.page) ? referFriendData.page.totalCount : 1,
        status: action.status
      };

    case ApiConstants.API_GET_ORG_PHOTO_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_GET_ORG_PHOTO_SUCCESS:
      let orgPhotoData = action.result;
      return {
        ...state,
        onLoad: false,
        orgPhotosList: orgPhotoData ? orgPhotoData : [],
        status: action.status
      };

    case ApiConstants.API_SAVE_ORG_PHOTO_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_SAVE_ORG_PHOTO_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_DELETE_ORG_PHOTO_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_DELETE_ORG_PHOTO_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_DELETE_ORG_CONTACT_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_DELETE_ORG_CONTACT_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_LOAD:
      return { ...state, onExpOrgRegQuesLoad: true };

    case ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_SUCCESS:
      return {
        ...state,
        onExpOrgRegQuesLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_AFFILIATE_DIRECTORY_LOAD:
      return { ...state, onAffiliateDirLoad: true };

    case ApiConstants.API_AFFILIATE_DIRECTORY_SUCCESS:
      let affiliateDirData = action.result;
      return {
        ...state,
        onAffiliateDirLoad: false,
        affiliateDirectoryList: affiliateDirData.affiliates,
        affiliateDirectoryPage: affiliateDirData.page ? affiliateDirData.page.currentPage : 1,
        affiliateDirectoryTotalCount: affiliateDirData.page.totalCount,
        organisationTypes: isArrayNotEmpty(affiliateDirData.organisationTypes) ? affiliateDirData.organisationTypes : [],
        status: action.status
      };

    case ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_LOAD:
      return { ...state, onExpAffiliateDirLoad: true };

    case ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_SUCCESS:
      return {
        ...state,
        onExpAffiliateDirLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_USER_PROFILE_UPDATE_PLAYER:
      return { ...state, onExpAffiliateDirLoad: true };

    case ApiConstants.API_USER_PROFILE_UPDATE_LOAD:
      return { ...state, onUpUpdateLoad: true };

    case ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        onUpUpdateLoad: false,
      };

    case ApiConstants.API_USER_MODULE_HISTORY_LOAD:
      return { ...state, userHistoryLoad: true };

    case ApiConstants.API_USER_MODULE_HISTORY_SUCCESS:
      let userHistoryData = action.result;
      return {
        ...state,
        userHistoryLoad: false,
        userHistoryList: userHistoryData.userHistory,
        userHistoryPage: userHistoryData.page ? userHistoryData.page.currentPage : 1,
        userHistoryTotalCount: userHistoryData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_PHOTO_UPDATE_LOAD:
      return { ...state, userPhotoUpdate: true };

    case ApiConstants.API_USER_PHOTO_UPDATE_SUCCESS:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          photoUrl: action.result.photoUrl,
        },
        userPhotoUpdate: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_USER_DETAIL_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_USER_DETAIL_SUCCESS:
      return {
        ...state,
        isProfileLoaded: true,
        userProfile: action.result,
        onLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_USER_DETAIL_UPDATE_LOAD:
      return { ...state, userDetailUpdate: true };

    case ApiConstants.API_USER_DETAIL_UPDATE_SUCCESS:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.result,
        },
        userDetailUpdate: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_USER_PASSWORD_UPDATE_LOAD:
      return { ...state, userPasswordUpdate: true };

    case ApiConstants.API_USER_PASSWORD_UPDATE_SUCCESS:
      return {
        ...state,
        userPasswordUpdate: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_UPDATE_CHARITY_ROUND_UP_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_UPDATE_CHARITY_ROUND_UP_SUCCESS:
      let charityRoundUpResponse = action.result.charityRoundUp;
      let charityResponse = action.result.charity;
      let ourOrgData = state.affiliateOurOrg;
      let updatedCharityData = getCharityResult(state.defaultCharityRoundUp);
      let updatedCharity = checkSelectedCharity(charityRoundUpResponse, updatedCharityData)
      ourOrgData["charityRoundUp"] = updatedCharity;
      ourOrgData.charity = charityResponse;
      return {
        ...state,
        onLoad: false,
        status: action.status,
        affiliateOurOrg: ourOrgData
      };

    case ApiConstants.API_UPDATE_TERMS_AND_CONDITION_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_UPDATE_TERMS_AND_CONDITION_SUCCESS:
      let ourOrgTCData = state.affiliateOurOrg;
      ourOrgTCData["termsAndConditions"] =  action.result.organisation.termsAndConditions;
      if(action.result.organisation.termsAndConditionsRefId == "2"){
        ourOrgTCData["termsAndConditionsFile"] =  action.result.organisation.termsAndConditions;
        ourOrgTCData["termsAndConditionsLink"] = null;
      }
      else{
        ourOrgTCData["termsAndConditionsLink"] =  action.result.organisation.termsAndConditions;
        ourOrgTCData["termsAndConditionsFile"] = null;
      }

      return {
        ...state,
        onLoad: false,
        status: action.status,
        affiliateOurOrg: ourOrgTCData
      };

    case ApiConstants.API_IMPERSONATION_LOAD:
      return { ...state, impersonationLoad: true };

    case ApiConstants.API_IMPERSONATION_SUCCESS:
      return {
        ...state,
        impersonationLoad: false,
        impersonation: action.result.success,
        status: action.status,
      };
	case ApiConstants.API_USER_DELETE_LOAD:
		return {
			...state,
			onLoad: true,
		};
	case ApiConstants.API_USER_DELETE_SUCCESS:
		return {
			...state,
			onLoad: false,
		};    


    default:
      return state;
  }
}

//get charity result
function getCharityResult(data) {
  let newCharityResult = []
  if (isArrayNotEmpty(data)) {
      for (let i in data) {
          data[i]["isSelected"] = false
      }
      newCharityResult = data
  }
  return newCharityResult

}


//for check selected Charity
function checkSelectedCharity(selected, data) {
  let arr = [];
  let chMap = new Map();
  for (let i in data) {
      let obj = {
        id: 0,
        description: data[i].description,
        charityRoundUpRefId: data[i].id,
        isSelected: false
      }
      if (selected){
        let filteredRes = selected.find(x=>x.charityRoundUpRefId == data[i].id);
        if(filteredRes!= null && filteredRes!= undefined){
          obj.id = filteredRes.id;
          obj.charityRoundUpRefId = filteredRes.charityRoundUpRefId;
          obj.isSelected = true;
          arr.push(obj);
        }
        else{
          arr.push(obj);
        }
      } else {
          arr.push(obj);
      }
  }
  return arr;
}



export default userReducer;
