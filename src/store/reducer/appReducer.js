import ApiConstants from "../../themes/apiConstants";
import history from "../../util/history";
import { getRegistrationSetting } from "../objectModel/getRegSettingObject";
import { getUserId, getOrganisationData } from "../../util/sessionStorage"
import AppConstants from "../../themes/appConstants";


const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  yearList: [],
  productValidityList: [],
  competitionTypeList: [],
  membershipProductFeesTypes: [],
  commonDiscountTypes: [],
  venueList: [],
  formSettings: [],
  regMethod: [],
  membershipProductTypes: [],
  typesOfCompetition: [],//////////types of competition from the reference table in the competition fees
  competitionFormatTypes: [],////competition format types in the competition fees section from the reference table
  registrationInvitees: [],////competition registration invitees
  seasonalPaymentOption: [],////payment option  competition payment
  charityRoundUp: [],/// charity roun in competititon
  govtVoucher: [],// vouchers in competition discount section
  casualPaymentOption: [],
  matchTypes: [],
  enhancedRoundRobinTypes: [],

  ////******************Venue and time
  competitionList: [],
  selectedCompetition: null,
  selectedYear: 1,
  own_YearArr: [],
  own_CompetitionArr: [],
  participate_CompetitionArr: [],
  participate_YearArr: [],
  searchVenueList: [],
  mainVenueList: [],
  demographicSetting: [],
  netballQuestionsSetting: [],
  otherQuestionsSetting: [],
  helpMessage: [AppConstants.knockOutMsg, AppConstants.roundRobinMsg, AppConstants.doubleRoundRobinMsg, AppConstants.enhancedRoundRobinMsg],
  regInviteesMsg: [AppConstants.regInviteesAffiliatesMsg, AppConstants.regInviteesAnyOrgMsg, AppConstants.regInviteesDirectMsg],
  membershipProductFeeMsg: [AppConstants.firstComRegOnlyMsg, AppConstants.allCompRegMsg],
  allYearList: [],
  allCompetitionTypeList: [],

};
function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  return arr
}


function sortfunction(a, b) {
  const bandA = a.competitionName;
  const bandB = b.competitionName;

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}

function filteredSettingArray(result) {
  let demographic = []
  let netballQuestions = []
  let otherQuestions = []
  let advanceSettings = []
  for (let i in result) {
    // if (result[i].id == 13 || result[i].id == 14 || result[i].id == 15 || result[i].id == 16) {
    //   demographic.push(result[i])
    // } 
    if (result[i].id >= 7 && result[i].id <= 14) {
      netballQuestions.push(result[i])
    }
    // else if (result[i].id == 8 || result[i].id == 9 || result[i].id == 12 || result[i].id == 11) {
    //   otherQuestions.push(result[i])
    // }
    else if (result[i].id >= 1 && result[i].id <= 6) {
      advanceSettings.push(result[i])
    }

  }
  netballQuestions = arraymove(netballQuestions, 2, 1)
  otherQuestions = arraymove(otherQuestions, 3, 2)
  return {
    demographic,
    netballQuestions,
    otherQuestions,
    advanceSettings
  }

}

function getCompetitionFormatTypeWithHelpMsg(data, helpMsg) {
  for (let i in data) {
    data[i]['helpMsg'] = helpMsg[i]
  }
  return data;
}

function getRegInviteesWithHelpMsg(data, helpMsg) {
  for (let i in data) {
    data[i]['helpMsg'] = helpMsg[i]
  }
  return data;
}

function getMembershipProductFeesTypesWithHelpMsg(data, helpMsg) {
  for (let i in data) {
    data[i]['helpMsg'] = helpMsg[i]
  }
  return data;
}



function appState(state = initialState, action) {
  switch (action.type) {

    case ApiConstants.API_APP_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };
    case ApiConstants.API_APP_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };


    /////get the common year list reference
    case ApiConstants.API_YEAR_LIST_LOAD:
      state.competitionTypeList = [];
      return { ...state, onLoad: true };

    case ApiConstants.API_YEAR_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        yearList: action.result,
        competitionTypeList: action.competetionListResult,
        status: action.status
      };

    /////get the common year list reference
    case ApiConstants.API_ONLY_YEAR_LIST_LOAD:
      state.competitionTypeList = [];
      return { ...state, onLoad: true };

    case ApiConstants.API_ONLY_YEAR_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        yearList: action.result,
        status: action.status
      };

    /////get the common membership product validity type list reference
    case ApiConstants.API_PRODUCT_VALIDITY_LIST_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_PRODUCT_VALIDITY_LIST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        productValidityList: action.result,
        status: action.status
      };

    /////get the common Competition type list reference
    case ApiConstants.API_COMPETITION_TYPE_LIST_LOAD:
      state.competitionTypeList = [];
      return { ...state, onLoad: true };

    case ApiConstants.API_COMPETITION_TYPE_LIST_SUCCESS:
      state.competitionTypeList = [];
      return {
        ...state,
        onLoad: false,
        competitionTypeList: action.result,
        status: action.status
      };

    ///get the common Membership Product Fees Type
    case ApiConstants.API_COMMON_MEMBERSHIP_PRODUCT_FEES_TYPE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_COMMON_MEMBERSHIP_PRODUCT_FEES_TYPE_SUCCESS:
      const membershipProductFeesTypesWithHelpMsg = getMembershipProductFeesTypesWithHelpMsg(action.result, state.membershipProductFeeMsg)
      return {
        ...state,
        onLoad: false,
        // membershipProductFeesTypes: action.result,
        membershipProductFeesTypes: membershipProductFeesTypesWithHelpMsg,
        status: action.status
      };

    // // get Role Entity List for current  user
    // case ApiConstants.API_ROLE_LOAD:
    //   return { ...state, onLoad: true };

    // case ApiConstants.API_ROLE_SUCCESS:
    //   return {
    //     ...state,
    //     onLoad: false,
    //     result: action.result,
    //     status: action.status
    //   };

    // // User Role Entity List for current  user
    // case ApiConstants.API_URE_LOAD:
    //   return { ...state, onLoad: true };

    // case ApiConstants.API_URE_SUCCESS:
    //   return {
    //     ...state,
    //     onLoad: false,
    //     result: action.result,
    //     status: action.status
    //   };

    ////get commom reference discount type
    case ApiConstants.API_COMMON_DISCOUNT_TYPE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_COMMON_DISCOUNT_TYPE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        commonDiscountTypes: action.result,
        status: action.status
      };
    //registration form method

    case ApiConstants.API_REG_FORM_METHOD_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_REG_FORM_METHOD_SUCCESS:
      return {
        ...state,
        onLoad: false,
        regMethod: action.result,
        status: action.status
      };

    //registration form Venue
    case ApiConstants.API_REG_FORM_VENUE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_REG_FORM_VENUE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        venueList: action.result,
        status: action.status,
        error: action.error,
        mainVenueList: action.result,
        searchVenueList: action.result
      };

    //registration form advance  settings
    case ApiConstants.API_REG_FORM_SETTINGS_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_REG_FORM_SETTINGS_SUCCESS:
      const result = getRegistrationSetting(action.result);
      let multipleSettingsArray = filteredSettingArray(result)
      return {
        ...state,
        onLoad: false,
        formSettings: multipleSettingsArray.advanceSettings,
        demographicSetting: multipleSettingsArray.demographic,
        netballQuestionsSetting: multipleSettingsArray.netballQuestions,
        otherQuestionsSetting: multipleSettingsArray.otherQuestions,
        status: action.status
      };


    ////competition format init refernce APis
    case ApiConstants.API_REG_COMPETITION_FEE_INIT_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_REG_COMPETITION_FEE_INIT_SUCCESS:
      const invitees = getRegistrationSetting(action.inviteesResult)
      const regInviteesWithHelpMsg = getRegInviteesWithHelpMsg(invitees, state.regInviteesMsg)
      let notApplicableIndex = invitees.findIndex(
        x =>
          x.name ==
          "not_applicable"
      );
      invitees.splice(notApplicableIndex, 1)
      const casualPayment = getRegistrationSetting(action.paymentOptionResult)
      // const seasonalPayment = getRegistrationSetting(action.paymentOptionResult[1])
      const competitionFormatTypeWithHelpMsg = getCompetitionFormatTypeWithHelpMsg(action.competitionFormat, state.helpMessage)
      return {
        ...state,
        onLoad: false,
        // competitionFormatTypes: action.competitionFormat,
        competitionFormatTypes: competitionFormatTypeWithHelpMsg,
        typesOfCompetition: action.compeitionTypeResult,
        // registrationInvitees: invitees,
        registrationInvitees: regInviteesWithHelpMsg,
        casualPaymentOption: casualPayment,
        seasonalPaymentOption: casualPayment,
        // charityRoundUp: action.charityResult,
        // govtVoucher: action.govtVoucherResult,
        status: action.status,
      };

    case ApiConstants.API_MATCH_TYPES_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_MATCH_TYPES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        matchTypes: action.result,
        status: action.status
      };

    case ApiConstants.API_COMPETITION_FORMAT_TYPES_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_COMPETITION_FORMAT_TYPES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        competitionFormatTypes: action.result,
        status: action.status
      };

    case ApiConstants.API_COMPETITION_TYPES_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_COMPETITION_TYPES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        typesOfCompetition: action.result,
        status: action.status
      };

    /////////

    case ApiConstants.API_GET_YEAR_COMPETITION_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_GET_YEAR_COMPETITION_SUCCESS:
      let yearResult = JSON.parse(JSON.stringify(action.yearList))
      let competitionResult = JSON.parse(JSON.stringify(action.competetionListResult))
      let yearobject = {
        description: "All",
        id: -1,
        name: "All",
        sortOrder: 1,
        subReferences: null,
      }
      let competitionobject = {
        competitionId: "0",
        competitionName: "All",
        id: 0,
      }
      competitionResult.unshift(competitionobject)
      if (action.data == "new") {
        yearResult.unshift(yearobject)
      }

      return {
        ...state,
        onLoad: false,
        allYearList: yearResult,
        allCompetitionTypeList: competitionResult,
        status: action.status,
      };

    case ApiConstants.API_UPDATE_COMPETITION_LIST:
      state.selectedCompetition = action.data
      return {
        ...state,
        onLoad: false,
        status: action.status
      };

    case ApiConstants.CLEAR_COMPETITION_DATA:
      state.competitionList = []
      return { ...state };


    /////////
    case ApiConstants.API_GET_YEAR_Participate_COMPETITION_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_GET_YEAR_Participate_COMPETITION_SUCCESS:
      return {
        ...state,
        onLoad: false,
        participate_CompetitionArr: action.competetionListResult,
        participate_YearArr: action.yearList,
        status: action.status,
      };

    /////////
    case ApiConstants.API_GET_YEAR_OWN_COMPETITION_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_GET_YEAR_OWN_COMPETITION_SUCCESS:
      return {
        ...state,
        onLoad: false,
        own_CompetitionArr: action.competetionListResult,
        own_YearArr: action.yearList,
        status: action.status,
      };


    // case ApiConstants.API_POST_COMPETITION_FEE_DISCOUNT_SUCCESS:
    //   if (state.own_CompetitionArr.length > 0) {
    //     if (action.result.data.competitiondetail.statusRefId == 2) {
    //       let resultdata = action.result.data.competitiondetail
    //       let matchCompetitionArr = state.own_CompetitionArr.findIndex(x => x.competitionId == action.result.data.competitiondetail.competitionCreatorOrgUniqueKey)
    //       if (matchCompetitionArr == -1) {
    //         let manualObj = {
    //           id: '',
    //           competitionName: resultdata.competitionName,
    //           competitionId: resultdata.competitionUniqueKey
    //         }

    //         state.own_CompetitionArr.push(manualObj)
    //         state.own_CompetitionArr.sort(sortfunction)
    //       }
    //     }
    //   }
    //   return {
    //     ...state,
    //   }

    // case ApiConstants.API_SAVE_COMPETITION_FEES_DIVISION_TAB_SUCCESS:
    //   if (state.own_CompetitionArr.length > 0) {
    //     if (action.result.data.competitiondetail.statusRefId == 2) {
    //       let resultdata2 = action.result.data.competitiondetail
    //       let matchCompetitionArr2 = state.own_CompetitionArr.findIndex(x => x.competitionId == action.result.data.competitiondetail.competitionCreatorOrgUniqueKey)
    //       if (matchCompetitionArr2 == -1) {
    //         let manualObj2 = {
    //           id: '',
    //           competitionName: resultdata2.competitionName,
    //           competitionId: resultdata2.competitionUniqueKey
    //         }

    //         let creatorId = resultdata2.competitionCreator
    //         let orgData = getOrganisationData()
    //         let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0
    //         // let userId = getUserId();
    //         let isCreatorEdit = creatorId == organisationUniqueKey ? false : true;
    //         if (isCreatorEdit == true) {
    //           state.own_CompetitionArr.push(manualObj2)
    //           state.own_CompetitionArr.sort(sortfunction)
    //         }
    //       }
    //     }
    //   }
    //   return {
    //     ...state
    //   }


    case ApiConstants.CLEAR_OWN_COMPETITION_DATA:

      if (action.key == "participate_CompetitionArr") {
        state.participate_CompetitionArr = []
      }
      else if (action.key == "all") {
        state.participate_CompetitionArr = []
        state.own_CompetitionArr = []
      }
      else {
        state.own_CompetitionArr = []
      }
      return { ...state }

    case ApiConstants.CLEAR_FILTER_SEARCH_VENUE:
      state.venueList = state.mainVenueList
      return {
        ...state,
      }

    case ApiConstants.API_ADD_VENUE_SUCCESS:
      if (action.result != null) {
        state.mainVenueList.push(action.result)
        state.venueList.push(action.result)
        state.searchVenueList.push(action.result)
      }

      return {
        ...state,
      }
    case ApiConstants.Search_Venue_updated_Competition:
      return { ...state, venueList: action.filterData }

    case ApiConstants.API_ENHANCED_ROUND_ROBIN_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_ENHANCED_ROUND_ROBIN_SUCCESS:
      return {
        ...state,
        onLoad: false,
        enhancedRoundRobinTypes: action.result,
        status: action.status
      };

    case ApiConstants.API_EXPORT_FILES_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_EXPORT_FILES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status
      };

    case ApiConstants.API_USER_EXPORT_FILES_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_USER_EXPORT_FILES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status
      };
    //update status ref id 
    case ApiConstants.API_DRAW_PUBLISH_SUCCESS:
      let publishCompetitionid = action.competitionId
      let publishedCompIndex = state.own_CompetitionArr.findIndex((x) => x.competitionId == publishCompetitionid)
      state.own_CompetitionArr[publishedCompIndex].statusRefId = action.result.statusRefId
      return {
        ...state,
        onLoad: false,
        status: action.status
      }


    ///clear reducer data
    case ApiConstants.API_COMPETITION_STATUS_UPDATE_SUCCESS:
      state.participate_CompetitionArr = []
      state.own_CompetitionArr = []
      state.own_YearArr = []
      state.participate_YearArr = []
      return {
        ...state

      }


    default:
      return state;
  }
}

export default appState;
