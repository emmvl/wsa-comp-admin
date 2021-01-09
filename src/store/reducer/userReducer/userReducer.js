import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty,deepCopyFunction,feeIsNull,formatValue } from "../../../util/helpers";
import { setImpersonation } from 'util/sessionStorage'

const teamMemberObj = {
  "genderRefId": null,
  "email": null,
  "lastName": null,
  "firstName": null,
  "middleName": null,
  "dateOfBirth": null,
  "mobileNumber":null,
  "payingFor": 0,
  "emergencyFirstName": null,
  "emergencyLastName": null,
  "emergencyContactNumber": null,
  "isRegistererAsParent": 0,
  "parentOrGuardian": [],
  "membershipProductTypes": []
}

const teamMembersSaveTemp = {
  "competitionId": null,
  "organisationId": null,
  "registrationId": null,
  "teamMemberRegId": null,
  "existingUserId": null,
  "registeringYourself": 4,
  "competitionMembershipProductDivisionId": null,
  "teamId": null,
  "registeringPersonUserId": null,
  "name": null,
  "countryRefId": null,
  "mobileNumber": null,
  "teamName": null,
  "divisions": [],
  "teamMembers": [],
  "registrationRestrictionTypeRefId": null
}

const teamMemberRegReviewTemp = {
  "total": {
    "gst": "20.90",
    "total": "229.90",
    "shipping": "0.00",
    "subTotal": "209.00",
    "targetValue": "229.90",
    "charityValue": "0.00",
    "transactionFee": "0.00"
  },
  "yourInfo": {
    "email": "manager12345@gmail.com",
    "suburb": "Melbourne",
    "userId": 13367,
    "street1": "123 Queen St",
    "street2": null,
    "lastName": "12",
    "firstName": "Manager123",
    "postalCode": "3000",
    "stateRefId": 7,
    "countryRefId": 1,
    "mobileNumber": "2323289348"
  },
  "compParticipants": [
    {
      "email": "manager12345@gmail.com",
      "gender": "Female",
      "payNow": "229.90",
      "userId": 0,
      "lastName": "12",
      "teamName": "team 98765",
      "firstName": "Manager123",
      "dateOfBirth": "1990-01-17T00:00:00.000Z",
      "noOfPlayers": null,
      "payPerMatch": "0.00",
      "teamMembers": {
        "payingForList": [],
        "notPayingForList": []
      },
      "mobileNumber": "2323289348",
      "participantId": "2440df41-76b3-4209-9b13-e9d86fb3d2ea",
      "paymentOptions": [
        {
          "feesTypeRefId": 2,
          "paymentOptionRefId": 3
        },
        {
          "feesTypeRefId": 1,
          "paymentOptionRefId": 1
        }
      ],
      "competitionName": "Single game fee test 1",
      "selectedOptions": {
        "vouchers": [],
        "discountCodes": [],
        "gameVoucherValue": null,
        "selectedDiscounts": [],
        "paymentOptionRefId": 1,
        "isHardshipCodeApplied": 0,
        "selectedSchoolRegCode": null,
        "isSchoolRegCodeApplied": 0,
        "nominationPayOptionRefId": 1,
        "selectedGovernmentVouchers": []
      },
      "organisationName": "Netball NSW",
      "orgRegistrationId": 6205,
      "competitionEndDate": "2021-03-27T00:00:00.000Z",
      "competitionLogoUrl": "https://www.googleapis.com/download/storage/v1/b/world-sport-action-dev-c1019.appspot.com/o/competitions%2Flogo_comp_f5f531f9-720d-4bf3-8074-dfe14730d9db_1607903705789.png?generation=1607903708831697&alt=media",
      "isTeamRegistration": 1,
      "membershipProducts": [
        {
          "fees": {
            "affiliateFee": null,
            "membershipFee": {
              "name": "Netball NSW",
              "emailId": "netball@nsw.gov.au",
              "phoneNo": "039009000",
              "casualFee": 0,
              "casualGST": 0,
              "feesToPay": 89,
              "seasonalFee": 89,
              "seasonalGST": 8.9,
              "feesToPayGST": 8.9,
              "organisationId": "b540171a-27b3-4c69-991f-b4bf0be28159",
              "discountsToDeduct": 0,
              "membershipMappingId": 1138,
              "childDiscountsToDeduct": 0,
              "governmentVoucherAmount": 0
            },
            "competitionOrganisorFee": {
              "name": "Netball NSW",
              "emailId": "netball@nsw.gov.au",
              "phoneNo": "039009000",
              "casualFee": 10,
              "casualGST": 1,
              "feesToPay": 0,
              "seasonalFee": 120,
              "seasonalGST": 12,
              "feesToPayGST": 0,
              "nominationFee": 0,
              "nominationGST": 0,
              "organisationId": "b540171a-27b3-4c69-991f-b4bf0be28159",
              "discountsToDeduct": 0,
              "nominationFeeToPay": 10,
              "nominationGSTToPay": 1,
              "membershipMappingId": 1138,
              "childDiscountsToDeduct": 0,
              "governmentVoucherAmount": 0
            }
          },
          "email": "virat015@gmail.com.invalid",
          "isPlayer": 1,
          "lastName": "A",
          "feesToPay": "229.90",
          "firstName": "Virat017",
          "divisionId": 3948,
          "divisionName": "D1",
          "mobileNumber": "1212211221",
          "discountsToDeduct": "0.00",
          "membershipTypeName": "Player",
          "membershipMappingId": 1138,
          "orgRegParticipantId": 9927,
          "membershipProductName": "Single game fee",
          "childDiscountsToDeduct": "0.00",
          "governmentVoucherAmount": null,
          "competitionMembershipProductTypeId": 5502
        }
      ],
      "competitionUniqueKey": "18e47b5f-4ab3-4c77-9ff8-e32436388497",
      "isTeamSeasonalUponReg": 0,
      "organisationUniqueKey": "9971815e-d9cb-4d44-bba2-f5be2e12c120",
      "governmentVoucherAmount": "0.00",
      "registeringYourselfRefId": 1,
      "competitionMembershipProductTypeIdCoach": null
    }
  ],
  "securePaymentOptions": [
    {
      "securePaymentOptionRefId": 1
    },
    {
      "securePaymentOptionRefId": 2
    }
  ]
}

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
  userRegistrationList: null,
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
  userProfileUpdate: null,
  userIncidentData: [],
  incidentDataLoad: false,
  incidentCurrentPage: null,
  incidentTotalCount: null,
  userRole: [],
  scorerActivityRoster: [],
  scorerCurrentPage: null,
  scorerTotalCount: null,
  umpireDataLoad: false,
  umpireActivityRoster: [],
  umpireCurrentPage: null,
  umpireTotalCount: null,
  coachDataLoad: false,
  coachActivityRoster: [],
  coachCurrentPage: null,
  coachTotalCount: null,
  umpireActivityOnLoad: false,
  umpireActivityList: [],
  umpireActivityCurrentPage: 1,
  umpireActivityTotalCount: 0,
  userTextualDasboardListAction: null,
  affiliateDirListAction: null,
  userAffiliateListAction: null,
  userFriendListAction: null,
  userReferFriendListAction: null,
  onSaveOrgPhotoLoad: false,
  onDeleteOrgPhotoLoad: false,
  bannerCount: null,
  onLoadSearch: false,
  impersonationAccess: false,
  spectatorList: [],
  spectatorPage: null,
  spectatorTotalCount: null,
  spectatorListAction: null,
  impersonationList: [],
  onImpersonationLoad: false,
  usersToBeMerged: [],
  teamMembersDetails: null,
  getTeamMembersOnLoad: false ,
  teamMembersSave: deepCopyFunction(teamMembersSaveTemp),
  membershipProductsInfo: null,
  onMembershipLoad: false,
  teamMemberRegReviewList: null,
  teamMembersSaveErrorMsg: null,
  teamMemberRegId : null,
  teamMembersSaveOnLoad: false,
  getTeamMembersReviewOnLoad: false
};

function getUpdatedTeamMemberObj(competition){
  try{
    let teamMemberTemp = deepCopyFunction(teamMemberObj);
    teamMemberTemp.membershipProductTypes = [];
    let filteredTeamMembershipProducts =  competition.membershipProducts.filter(x => x.isTeamRegistration == 1 && x.allowTeamRegistrationTypeRefId == 1);
    for(let product of filteredTeamMembershipProducts){
      let obj = {
        "competitionMembershipProductId": product.competitionMembershipProductId,
        "competitionMembershipProductTypeId": product.competitionMembershipProductTypeId,
        "isPlayer": product.isPlayer,
        "productTypeName": product.shortName,
        "isChecked": false
      }
      teamMemberTemp.membershipProductTypes.push(obj);
    }
    return teamMemberTemp;
  }catch(ex){
    console.log("Error in getUpdatedTeamMemberObj::"+ex);
  }
}

function upateTeamMembersSave(state){
  try{
      let membershipProducts = state.membershipProductInfo;
      let organisation = membershipProducts[0];
      let competition  = organisation.competitions[0];
      state.teamMembersSave.registrationRestrictionTypeRefId = competition.registrationRestrictionTypeRefId;
      state.teamMembersSave.teamMembers.push(getUpdatedTeamMemberObj(competition));
      console.log("state",state.teamMembersSave.teamMembers)
  }catch(ex){
      console.log("Error in updateTeamMemberSave::"+ex);
  }
}

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
        status: action.status,
        umpireActivityOnLoad: false,
        onMedicalLoad: false
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
        status: action.status,
        umpireActivityOnLoad: false,
        onMedicalLoad: false
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
      return { ...state, onLoad: action.payload.paging.limit == -1 ? false : true, onImpersonationLoad: action.payload.paging.limit == -1 ? true : false, userAffiliateListAction: action };

    case ApiConstants.API_AFFILIATES_LISTING_SUCCESS:
      let data = action.result;
      return {
        ...state,
        onLoad: false,
        affiliateList: data.affiliates,
        impersonationList: data.affiliates,
        affiliateListPage: data.page ? data.page.currentPage : 1,
        affiliateListTotalCount: data.page ? data.page.totalCount : 0,
        status: action.status
      };

    case ApiConstants.API_AFFILIATES_IMPERSONATION_LISTING_SUCCESS:
      let affiliate_Data = action.result;
      return {
        ...state,
        onImpersonationLoad: false,
        impersonationList: affiliate_Data.affiliates,
        status: action.status
      }
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
      let affiliateOurOrgData = action.result;
      let charityData = getCharityResult(action.charityResult);
      let selectedCharity = checkSelectedCharity(affiliateOurOrgData.charityRoundUp, charityData);
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
      return { ...state, onLoad: true, affiliateToOnLoad: true, onLoadSearch: true };

    case ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS:
      let affiliateToData = action.result;
      return {
        ...state,
        onLoad: false,
        affiliateTo: affiliateToData,
        affiliateToOnLoad: false,
        status: action.status,
        onLoadSearch: false
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

      if (action.key === "name") {
        state.affiliateOurOrg["charity"][action.index][action.key] = action.value
      }
      if (action.key === "description") {
        state.affiliateOurOrg["charity"][action.index][action.key] = action.value
      }

      return { ...state };

      case ApiConstants.UPDATE_NEW_AFFILIATE:
        let oldAffiliateData = state.affiliate.affiliate;
        let updatedVal = action.updatedData;
        let key = action.key;
        if (key === 'addAffiliate') {

          state.affiliate.affiliate = {
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
        } else {
          oldAffiliateData[key] = updatedVal;
        }

        return {
          ...state, error: null
        };

    //Get organisation for add venue
    case ApiConstants.API_ORGANISATION_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_ORGANISATION_SUCCESS:
      return {
        ...state,
        venueOrganisation: action.result,
        onLoad: false,
        error: null,
        status: action.status
      };

    case ApiConstants.API_BANNER_COUNT_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_BANNER_COUNT_SUCCESS:
      return {
        ...state,
        bannerCount: action.result,
        onLoad: false,
        error: null,
        status: action.status
      };

    case ApiConstants.API_UPDATE_BANNER_COUNT_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_UPDATE_BANNER_COUNT_SUCCESS:
      return {
        ...state,
        bannerCount: action.result,
        onLoad: false,
        error: null,
        status: action.status
      };

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
      return { ...state, onLoad: true, error: null, onOrgLoad: true };

    case ApiConstants.API_GET_USER_ORGANISATION_SUCCESS:
      state.allUserOrganisationData = isArrayNotEmpty(action.result) ? action.result : [];
      state.getUserOrganisation = isArrayNotEmpty(action.result) ? action.result : [];
      state.onOrgLoad = false;
      return {
        ...state,
        onLoad: false,
        error: null,
        status: action.status
      };

    ////onchange user organisation data
    case ApiConstants.ONCHANGE_USER_ORGANISATION:
      let allOrgData = JSON.parse(JSON.stringify(state.allUserOrganisationData));
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
      return { ...state, onTextualLoad: true, userTextualDasboardListAction: action };

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
          emergencyFirstName: personalData.emergencyFirstName,
          emergencyLastName: personalData.emergencyLastName,
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
        userRegistrationList: userRegistrationData,
        // userRegistrationDataPage: userRegistrationData.page ? userRegistrationData.page.currentPage : 1,
        // userRegistrationDataTotalCount: userRegistrationData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_LOAD:
      return { ...state, getTeamMembersOnLoad: true };

    case ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_SUCCESS:
      let teamMembersDetailsData = action.result;
      return {
        ...state,
        getTeamMembersOnLoad: false,
        teamMembersDetails: teamMembersDetailsData,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_TEAM_REGISTRATION_LOAD:
      return { ...state, userRegistrationOnLoad: true };

    case ApiConstants.API_USER_MODULE_TEAM_REGISTRATION_SUCCESS:
      let userTeamRegistrationData = action.result;
      return {
        ...state,
        userTeamRegistrationOnLoad: false,
        userTeamRegistrationList: userTeamRegistrationData.registrationTeamDetails,
        userTeamRegistrationDataPage: userTeamRegistrationData.page ? userTeamRegistrationData.page.currentPage : 1,
        userTeamRegistrationDataTotalCount: userTeamRegistrationData.page.totalCount,
        status: action.status
      };

    case ApiConstants.API_USER_MODULE_OTHER_REGISTRATION_LOAD:
      return { ...state, userRegistrationOnLoad: true };

    case ApiConstants.API_USER_MODULE_OTHER_REGISTRATION_SUCCESS:
      let userOtherRegistrationData = action.result;
      return {
        ...state,
        userOtherRegistrationOnLoad: false,
        userOtherRegistrationList: userOtherRegistrationData.registrationYourDetails,
        userOtherRegistrationDataPage: userOtherRegistrationData.page ? userOtherRegistrationData.page.currentPage : 1,
        userOtherRegistrationDataTotalCount: userOtherRegistrationData.page.totalCount,
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
      return { ...state, onLoad: true, userFriendListAction: action };

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
      return { ...state, onLoad: true, userReferFriendListAction: action };

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
      return { ...state, onSaveOrgPhotoLoad: true };

    case ApiConstants.API_SAVE_ORG_PHOTO_SUCCESS:
      return {
        ...state,
        onSaveOrgPhotoLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.API_DELETE_ORG_PHOTO_LOAD:
      return { ...state, onDeleteOrgPhotoLoad: true };

    case ApiConstants.API_DELETE_ORG_PHOTO_SUCCESS:
      return {
        ...state,
        onDeleteOrgPhotoLoad: false,
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
      return { ...state, onAffiliateDirLoad: true, affiliateDirListAction: action };

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
        userProfileUpdate: action.result,
        status: action.status
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
      let updatedCharity = checkSelectedCharity(charityRoundUpResponse, updatedCharityData);
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
      ourOrgTCData["termsAndConditions"] = action.result.organisation.termsAndConditions;
      if (action.result.organisation.termsAndConditionsRefId == "2") {
        ourOrgTCData["termsAndConditionsFile"] = action.result.organisation.termsAndConditions;
        ourOrgTCData["termsAndConditionsLink"] = null;
      }
      else {
        ourOrgTCData["termsAndConditionsLink"] = action.result.organisation.termsAndConditions;
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
      setImpersonation(action.impersonationAccess)
      return {
        ...state,
        impersonationLoad: false,
        impersonation: action.result.success,
        status: action.status,
        impersonationAccess: action.impersonationAccess
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

    case ApiConstants.API_GET_USER_MODULE_INCIDENT_LIST_LOAD:
      return { ...state, incidentDataLoad: true };

    case ApiConstants.API_GET_USER_MODULE_INCIDENT_LIST_SUCCESS:
      return {
        ...state,
        incidentDataLoad: false,
        userIncidentData: action.result.results,
        incidentCurrentPage: action.result.page.currentPage,
        incidentTotalCount: action.result.page.totalCount
      };

    case ApiConstants.API_GET_USER_ROLE_LOAD:
      return { ...state, };

    case ApiConstants.API_GET_USER_ROLE_SUCCESS:
      let userRole = getUserRole(action.result);
      state.userRole = userRole;
      return {
        ...state,
      };

    ////Scorer
    case ApiConstants.API_GET_SCORER_ACTIVITY_LOAD:
      return { ...state, activityScorerOnLoad: true };

    case ApiConstants.API_GET_SCORER_ACTIVITY_SUCCESS:
      return {
        ...state,
        activityScorerOnLoad: false,
        scorerActivityRoster: action.result.activityRoster,
        scorerCurrentPage: action.result.page.currentPage,
        scorerTotalCount: action.result.page.totalCount,
      };

    ////Umpire
    case ApiConstants.API_GET_UMPIRE_DATA_LOAD:
      return { ...state, umpireDataLoad: true };

    case ApiConstants.API_GET_UMPIRE_DATA_SUCCESS:
      return {
        ...state,
        umpireDataLoad: false,
        umpireActivityRoster: action.result.activityRoster,
        umpireCurrentPage: action.result.page.currentPage,
        umpireTotalCount: action.result.page.totalCount,
      };

    ////Coach
    case ApiConstants.API_GET_COACH_DATA_LOAD:
      return { ...state, coachDataLoad: true };

    case ApiConstants.API_GET_COACH_DATA_SUCCESS:
      return {
        ...state,
        coachDataLoad: false,
        coachActivityRoster: action.result.activityRoster,
        coachCurrentPage: action.result.page.currentPage,
        coachTotalCount: action.result.page.totalCount,
      };

    ////umpire activity list
    case ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_LOAD:
      return { ...state, umpireActivityOnLoad: true };

    case ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_SUCCESS:
      let umpireActivityData = action.result;
      return {
        ...state,
        umpireActivityOnLoad: false,
        umpireActivityList: isArrayNotEmpty(umpireActivityData.results) ? umpireActivityData.results : [],
        umpireActivityCurrentPage: umpireActivityData.page.currentPage,
        umpireActivityTotalCount: umpireActivityData.page.totalCount,
      };

    case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
      state.userTextualDasboardListAction = null;
      state.affiliateDirListAction = null;
      state.userAffiliateListAction = null;
      state.userFriendListAction = null;
      state.userReferFriendListAction = null;
      state.spectatorListAction = null;
      return { ...state, onLoad: false };

    case ApiConstants.API_GET_SPECTATOR_LIST_LOAD:
      return { ...state, onLoad: true, spectatorListAction: action };

    case ApiConstants.API_GET_SPECTATOR_LIST_SUCCESS:
      let spectatorData = action.result;
      return {
        ...state,
        onLoad: false,
        spectatorList: spectatorData ? spectatorData.spectator : [],
        spectatorPage: (spectatorData && spectatorData.page) ? spectatorData.page.currentPage : 1,
        spectatorTotalCount: (spectatorData && spectatorData.page) ? spectatorData.page.totalCount : 1,
        status: action.status
      };

    case ApiConstants.API_REGISTRATION_RESEND_EMAIL_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_REGISTRATION_RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status
      }

    ////Coach
    case ApiConstants.API_CLEAR_LIST_DATA:
      state.affiliateTo = []
      return { ...state };

    case ApiConstants.Api_RESET_TFA_LOAD:
      return {
        ...state,
        onMedicalLoad: true,
        status: null
      }

    case ApiConstants.Api_RESET_TFA_SUCCESS:
      return {
        ...state,
        onMedicalLoad: false
      }

    case ApiConstants.ADD_USERS_TO_BE_MERGED:
      state.usersToBeMerged = action.payload
      return {
        ...state
      }
    
    case ApiConstants.API_GET_NETSETGO_LIST_LOAD:
      return { ...state, onLoad: true, netSetGoListAction: action };

    case ApiConstants.API_GET_NETSETGO_LIST_SUCCESS:
      let netSetGoData = action.result;
      return {
        ...state,
        onLoad: false,
        netSetGoList: netSetGoData ? netSetGoData.netSetGo : [],
        netSetGoPage: (netSetGoData && netSetGoData.page) ? netSetGoData.page.currentPage : 1,
        netSetGoTotalCount: (netSetGoData && netSetGoData.page) ? netSetGoData.page.totalCount : 1,
        status: action.status
      };

    case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
      return { ...state, onMembershipLoad: true };

    case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
        state.membershipProductInfo = action.result;
        if(!state.teamMemberRegId){
          upateTeamMembersSave(state)
        }
        return {
            ...state,
            onMembershipLoad: false,
            status: action.status,
        };
    
    case ApiConstants.TEAM_MEMBER_SAVE_UPDATE_ACTION:
        if(action.key == "teamMembersSave"){
            state.teamMembersSave = action.data;
        }else if(action.key == "teamMember"){
            if(action.index == undefined){
                upateTeamMembersSave(state)
            }else{
                state.teamMembersSave.teamMembers.splice(action.index,1);
            }
        }else if(action.key == "membershipProductTypes"){
            state.teamMembersSave.teamMembers[action.index].membershipProductTypes[action.subIndex].isChecked = action.data;
        }
        else if(action.key == "teamMemberRegId"){
            state.teamMemberRegId = action.data
        }
        else{
            console.log("sdfsdfd",action.index,action.key)
            state.teamMembersSave.teamMembers[action.index][action.key] = action.data;
        }
        return{
            ...state
        }
    
    case ApiConstants.API_TEAM_MEMBERS_SAVE_LOAD:
        return{...state,teamMembersSaveOnLoad: true}

    case ApiConstants.API_TEAM_MEMBERS_SAVE_SUCCESS: 
    state.teamMembersSaveErrorMsg = action.result.errorMsg ? action.result.errorMsg : null;
    state.teamMemberRegId= action.result.id ? action.result.id : null;
    state.teamMembersSaveOnLoad= false;
        return {
            ...state,
            status: action.status,
        }

    case ApiConstants.API_GET_TEAM_MEMBERS_LOAD:
        return{...state,getTeamMembersOnLoad: true}

    case ApiConstants.API_GET_TEAM_MEMBERS_SUCCESS: 
        return {
            ...state,
            status: action.status,
            teamMembersSave: action.result,
            getTeamMembersOnLoad: false,
        }
      
    case ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_LOAD:
      return{...state,getTeamMembersReviewOnLoad: true}
  
    case ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_SUCCESS:
        return{
            ...state,
            teamMemberRegReviewList: action.result,
            status: action.status,
            getTeamMembersReviewOnLoad: false
        }

    case ApiConstants.UPDATE_TEAM_MEMBER_REVIEW_INFO:
      try{
        let reviewData = state.teamMemberRegReviewList;
        if(action.subKey == "total"){
            let type = action.key;
            let totalVal = reviewData.total.total; 
            let transactionVal = 0;
            let targetVal = 0;
            if(action.value == 1){
                if(type == "International_CC"){
                    transactionVal = (totalVal * 3.0/100) + 0.30;
                }
                if(type == "International_AE"){
                    transactionVal = (totalVal * 2.7/100) + 0.30;
                }
                else if(type == "DOMESTIC_CC"){
                    transactionVal = (totalVal * 2.25/100)  + 0.30;
                }
                else if(type == "direct_debit"){
                    transactionVal = (totalVal * 1.5/100) + 0.30;
                    console.log("transactionVal DD" + transactionVal);
                    if(transactionVal > 3.50){
                        transactionVal = 3.50;
                    }
                }
                targetVal = feeIsNull(transactionVal) + feeIsNull(totalVal);
                reviewData["total"]["targetValue"] = formatValue(targetVal);
                reviewData["total"]["transactionFee"] = formatValue(transactionVal);
            }
            else{
                reviewData["total"]["targetValue"] = "0.00";
                reviewData["total"]["transactionFee"] = "0.00";
            }
           
        }
        return {
            ...state,
            error: null
        }
      }catch(ex){
        console.log("Error in UPDATE_TEAM_MEMBER_REVIEW_INFO::"+ex);
      }  

    default:
      return state;
  }
}

//get User Role
function getUserRole(userRoleData) {

  let userRole = false;

  for (let i in userRoleData) {
    if (userRoleData[i].roleId == 15 || userRoleData[i].roleId == 20) {

      userRole = true;
      break;
    }
  }
  return userRole
}

//get charity result
function getCharityResult(data) {
  let newCharityResult = [];
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
    };
    if (selected) {
      let filteredRes = selected.find(x => x.charityRoundUpRefId == data[i].id);
      if (filteredRes != null && filteredRes != undefined) {
        obj.id = filteredRes.id;
        obj.charityRoundUpRefId = filteredRes.charityRoundUpRefId;
        obj.isSelected = true;
        arr.push(obj);
      }
      else {
        arr.push(obj);
      }
    } else {
      arr.push(obj);
    }
  }
  return arr;
}



export default userReducer;
