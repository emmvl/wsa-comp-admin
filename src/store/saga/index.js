import { takeEvery } from "redux-saga/effects";
import { loginApiSaga, qrApiSaga, forgotPasswordSaga } from "./authenticationSaga";

import ApiConstants from "../../themes/apiConstants";
import {
  getRegistrationFormSaga,
  regMembershipFeeListSaga,
  regMembershipFeeListDeleteSaga,
  regGetMembershipProductDetailSaga,
  regSaveMembershipProductDetailSaga,
  regDefaultMembershipProductTypesSaga,
  regSaveMembershipProductFeeSaga,
  regSaveMembershipProductDiscountSaga,
  membershipProductDiscountTypeSaga,
  regSaveRegistrationForm,
  getMembershipproduct,
  getDivisionsListSaga
} from "./registrationSaga/registrationSaga";

import {
  getYearListSaga,
  getOnlyYearListSaga,
  getProductValidityListSaga,
  getCompetitionTypeListSaga,
  // getRoleSaga,
  // getUreSaga,
  getVenuesTypeSaga,
  getRegFormAdvSettings,
  getRegFormMethod,
  getMembershipProductFeesTypeSaga,
  getCommonDiscountTypeTypeSaga,
  getCompetitionFeeInitSaga,
  getMatchTypesSaga,
  getCompetitionTypesSaga,
  getCompetitionFormatTypesSaga,
  getOnlyYearAndCompetitionListSaga,
  getParticipateYearAndCompetitionListSaga,
  getOwnYearAndCompetitionListSaga,
  getEnhancedRoundRobinTypesSaga,
  exportFilesSaga,
  userExportFilesSaga,
} from "./appSaga";

import {
  regCompetitionFeeListSaga,
  regCompetitionFeeListDeleteSaga,
  getAllCompetitionFeesDeatilsSaga,
  saveCompetitionFeesDetailsSaga,
  saveCompetitionFeesMembershipTabSaga,
  getDefaultCompFeesMembershipProductSaga,
  saveCompetitionFeesDivisionSaga,
  getCasualFeeDefault,
  getSeasonalFeeDefault,
  postPaymentOptionSaga,
  saveCompetitionFeesSection,
  postCompetitonDiscountSaga,
  defaultCompetitionDiscountSaga,
  defaultCharity_voucherSaga,
  getDefaultCompFeesLogoSaga,
  inviteeSearchSaga,
  deleteCompetitionDivisionSaga
} from './registrationSaga/competitionFeeSaga';


////**************************Live Score***************************Start
// import { liveScorePlayerSaga } from "./liveScoreSaga/liveScorePlayerSaga";
import { liveScoreMatchListSaga, liveScoreAddMatchSaga, liveScoreCreateMatchSaga, liveScoreDeleteMatchSaga, liveScoreCompetitionVenuesList, liveScoreMatchImportSaga, liveScoreMatchSaga, liveScoreClubListSaga, playerLineUpStatusChnage, bulkScoreChange } from './liveScoreSaga/liveScoreMatchSaga';

import { liveScoreDivisionSaga, getLiveScoreScorerSaga } from "./liveScoreSaga/liveScoreSaga";
import {
  liveScoreTeamSaga,
  liveScoreTeamViewPlayerListSaga,
  liveScoreDeleteTeamSaga,
  liveScoreTeamDivisionSaga,
  liveScoreAffilateSaga,
  addTeamLiveScoreSaga,
  liveScoreTeamImportSaga,
  liveScoreGetTeamSaga,
  liveScoreTeamPaggingSaga
} from './liveScoreSaga/liveScoreTeamSaga';
import { liveScoreLaddersDivisionsaga, liveScoreLaddersListSaga, ladderAdjustmentPostSaga, ladderAdjustmentGetSaga } from './liveScoreSaga/liveScoreLadderSaga';
import { liveScoreIncidentListSaga, liveScoreAddEditIncidentSaga, liveScoreIncidentTypeSaga } from './liveScoreSaga/liveScoreIncidentSaga';
import { liveScoreRoundSaga, liveScoreRoundListSaga } from './liveScoreSaga/liveScoreRoundSaga';
import { liveScoreNewsListSaga, liveScoreAddNewsSaga, liveScoreNewsNotificationSaga, liveScoreNewsDeleteSaga } from './liveScoreSaga/liveScoreNewsSaga';
import { liveScoreBannerSaga, liveScoreAddBannerSaga, liveScoreRemoveBannerSaga } from './liveScoreSaga/liveScoreBannerSaga';
import { liveScoreGoalSaga } from './liveScoreSaga/liveScoreGoalSaga'
import { liveScoreManagerListSaga, liveScoreAddEditManagerSaga, liveScoreManagerSearch, liveScoreManagerImportSaga } from './liveScoreSaga/liveScoreManagerSaga';
import { liveScoreScorerListSaga, liveScorerSearchUserSaga, liveScoreAssigneMatches, liveScoreChangeAssignStatus, liveScoreAddEditScorerSaga, liveScoreUnAssignMatcheSaga, liveScoreScorerSearchSaga } from '../saga/liveScoreSaga/liveScoreScorerSaga';
import { liveScoreBulkPushBack, liveScoreBulkBringForwardSaga, liveScoreMatchResult, liveScoreEndMatchesSaga, liveScoreDoubleHeaderSaga, liveScoreAbandonMatchSaga } from './liveScoreSaga/liveScoreBulkMatchSaga';


import { liveScorePlayerSaga, liveScoreAddEditPlayerSaga, liveScorePlayerImportSaga, getPlayerListPagginationSaga } from "./liveScoreSaga/liveScorePlayerSaga";
import { liveScoreDashboardSaga } from './liveScoreSaga/liveScoreDashboardSaga';
import { liveScoreCompetitionSaga, liveScoreCompetitionDelete } from './liveScoreSaga/liveScoreCompetionSaga'
import { liveScoreDivisionsaga, liveScoreDeleteDivisionSaga, liveScoreCreateDivisionsaga, liveScoreDivisionImportSaga } from './liveScoreSaga/liveScoreDivisionSaga';

////*******************Live Score********************************************End

////Competition Management

import { competitionModuleSaga, competitonGenerateDrawSaga } from './competitionManagementSaga/competitionModuleSaga'
import * as competitionFormatSaga from '../saga/competitionManagementSaga/competitionFormatSaga';
import * as competitionFinalSaga from '../saga/competitionManagementSaga/competitionFinalsSaga';
import * as ladderFormatSaga from '../saga/competitionManagementSaga/ladderFormatSaga';
import { competitonWithTimeSlots, competitonWithTimeSlotsPostApi } from './competitionManagementSaga/competitionTimeAndSlotSaga';
import {
  getTimeSlotInit, getCommonDataSaga, addVenueSaga,
  venueListSaga, gradesReferenceListSaga, countryReferenceSaga,
  registrationOtherInfoReferenceSaga, firebirdPlayerReferenceSaga, favouriteTeamReferenceSaga,
  nationalityReferenceSaga, heardByReferenceSaga, playerPositionReferenceSaga, venuesListSaga,
  venueByIdSaga, venueDeleteSaga,
  getGenderSaga, getPhotoTypeSaga, getAppyToSaga, getExtraTimeDrawSaga,
  getFinalsFixtureTemplateSaga, courtListSaga, getSendInvitesSaga, RegistrationRestrictionType,
  getAllowTeamRegistrationTypeSaga, disabilityReferenceSaga, getCommonInitSaga, getStateReferenceSaga,
  getRegistrationPaymentStatusSaga, getMatchPrintTemplateTypeSaga, checkVenueAddressDuplicationSaga
} from "./commonSaga/commonSaga";

import { fixtureTemplateSaga } from '../saga/competitionManagementSaga/competitionManagementSaga';
////Venue constraints
import { venueTimeSaga, venueConstraintPostSaga } from './competitionManagementSaga/venueTimeSaga'
import {
  getCompPartPlayerGradingSummarySaga,
  saveCompPartPlayerGradingSummarySaga,
  getCompPartPlayerGradingSaga,
  addNewTeamPartPlayerGradingSaga,
  dragTeamPartPlayerSaga,
  partPLayerCommentSaga,
  partPlayerSummaryCommentSaga,
  importCompetitionPlayer,
  importCompetitionTeams,
  deleteTeamSaga,
  playerChangeDivisionSaga,
  playerCommentList
} from './competitionManagementSaga/competitionPartPlayerGradingSaga';
import {
  getCompOwnProposedTeamGradingSaga,
  saveOwnFinalTeamGradingDataSaga,
  getCompPartProposedTeamGradingSaga,
  savePartProposedTeamGradingDataSaga,
  getTeamGradingSummarySaga,
  saveUpdatedGradeTeamSummarySaga,
  publishGradeTeamSummarySaga,
  getCompFinalGradesListSaga,
  proposedTeamGradingComment,
  partProposedTeamGradingComment,
  deleteTeamActionSaga,
  finalTeamsExportSaga,
  finalPlayersExportSaga,
  proposedTeamsExportSaga,
  proposedPlayersExportSaga,
  teamChangeDivisionSaga
} from './competitionManagementSaga/competitionTeamGradingSaga';

// UserSaga
import * as userSaga from '../saga/userSaga/userSaga';
import { homeDashboardSaga, actionBoxListSaga, updateActionBoxSaga } from "./homeDashboardSaga/homeDashboardSaga"

////////competition draws 
import {
  getCompetitionDrawsSaga, getDrawsRoundsSaga,
  updateCompetitionDraws, saveDrawsSaga,
  getCompetitionVenues, updateCourtTimingsDrawsAction,
  getDivisionGradeNameListSaga, publishDraws, drawsMatchesListExportSaga,
  getDivisionSaga, competitionFixtureSaga, updateCompetitionFixtures, updateDrawsLock,
  getActiveDrawsRoundsSaga
} from './competitionManagementSaga/competitionDrawsSaga';

import { regDashboardListSaga, getCompetitionSaga, registrationMainDashboardListSaga } from "./registrationSaga/registrationDashboardSaga"
////Competition Dashboard Saga
import { competitionDashboardSaga, updateCompetitionStatusSaga } from './competitionManagementSaga/competitionDashboardSaga';
// import { liveScoreAddEditManagerSaga } from './liveScoreSaga/liveScoreManagerSaga';

// EndUserRegistrationSaga
import * as endUserRegSaga from '../saga/registrationSaga/endUserRegistrationSaga';

import * as divisionsaga from "../saga/liveScoreSaga/liveScoreDivisionSaga"

import { liveScoreGameTimeStatisticsSaga } from '../saga/liveScoreSaga/liveScoreGameTimeStatisticsSaga'
import { liveScoreSettingSaga, liveScorePostSaga, settingRegInviteesSaga } from './liveScoreSaga/liveScoreSettingSaga'
import { liveScoreUmpiresSaga, liveScoreUmpiresImportSaga } from './liveScoreSaga/liveScoreUmpiresSaga'

import { liveScoreTeamAttendanceListSaga } from './liveScoreSaga/liveScoreTeamAttendanceSaga'

import { laddersSettingGetMatchResult, laddersSettingGetData, laddersSettingPostData } from './liveScoreSaga/liveScoreLadderSettingSaga'

import { liveScoreChangeVenueSaga } from "./liveScoreSaga/liveScoreVenueChangeSaga"
import { getLiveScoreFixtureCompSaga } from "./liveScoreSaga/liveScoreFixtureCompSaga";
import * as stripeSaga from "../saga/stripeSaga/stripeSaga"

import { liveScoreCoachSaga, liveScoreAddCoachSaga, liveScoreCoachImportSaga } from "../saga/liveScoreSaga/liveScoreCoachSaga"

import * as umpireDashboardSaga from "../saga/umpireSaga/umpireDashboardSaga"
import * as umpireCompSaga from "../saga/umpireSaga/umpireCompetitionSaga"
import * as umpireRoasterSaga from "../saga/umpireSaga/umpireRoasterSaga"
import * as umpireSaga from "../saga/umpireSaga/umpireSaga"
import * as assignUmpireSaga from "../saga/umpireSaga/assignUmpireSaga";
import * as shopProductSaga from "../saga/shopSaga/productSaga";
import * as competitionQuickSaga from "../saga/competitionManagementSaga/competitionQuickSaga";
import * as liveScoreMatchSheetSaga from './liveScoreSaga/liveScoreMatchSheetSaga';
import * as shopSettingSaga from './shopSaga/shopSettingSaga';

export default function* root_saga() {
  yield takeEvery(ApiConstants.API_LOGIN_LOAD, loginApiSaga);
  yield takeEvery(ApiConstants.API_QR_CODE_LOAD, qrApiSaga);
  yield takeEvery(ApiConstants.API_ROLE_LOAD, userSaga.getRoleSaga);
  yield takeEvery(ApiConstants.API_URE_LOAD, userSaga.getUreSaga);
  yield takeEvery(ApiConstants.API_REG_COMPETITION_LIST_LOAD, regCompetitionFeeListSaga);
  yield takeEvery(ApiConstants.API_REG_MEMBERSHIP_LIST_LOAD, regMembershipFeeListSaga);
  yield takeEvery(ApiConstants.API_REG_COMPETITION_LIST_DELETE_LOAD, regCompetitionFeeListDeleteSaga);
  yield takeEvery(ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_LOAD, regMembershipFeeListDeleteSaga);
  yield takeEvery(ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT__LOAD, regGetMembershipProductDetailSaga);
  yield takeEvery(ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT__LOAD, regSaveMembershipProductDetailSaga);
  yield takeEvery(ApiConstants.API_YEAR_LIST__LOAD, getYearListSaga);
  yield takeEvery(ApiConstants.API_ONLY_YEAR_LIST__LOAD, getOnlyYearListSaga);
  yield takeEvery(ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES__LOAD, regDefaultMembershipProductTypesSaga)
  yield takeEvery(ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES__LOAD, regSaveMembershipProductFeeSaga);
  yield takeEvery(ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT__LOAD, regSaveMembershipProductDiscountSaga);
  yield takeEvery(ApiConstants.API_COMMON_MEMBERSHIP_PRODUCT_FEES_TYPE__LOAD, getMembershipProductFeesTypeSaga);
  yield takeEvery(ApiConstants.API_COMMON_DISCOUNT_TYPE__LOAD, getCommonDiscountTypeTypeSaga);
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD, membershipProductDiscountTypeSaga);
  yield takeEvery(ApiConstants.API_COMMON_MEMBERSHIP_PRODUCT_FEES_TYPE__LOAD, getMembershipProductFeesTypeSaga);
  yield takeEvery(ApiConstants.API_COMMON_DISCOUNT_TYPE__LOAD, getCommonDiscountTypeTypeSaga);
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD, membershipProductDiscountTypeSaga);
  yield takeEvery(ApiConstants.API_PRODUCT_VALIDITY_LIST__LOAD, getProductValidityListSaga);
  yield takeEvery(ApiConstants.API_COMPETITION_TYPE_LIST__LOAD, getCompetitionTypeListSaga);
  yield takeEvery(ApiConstants.API_REG_FORM_VENUE_LOAD, getVenuesTypeSaga);
  yield takeEvery(ApiConstants.API_REG_FORM_LOAD, regSaveRegistrationForm);
  yield takeEvery(ApiConstants.API_REG_FORM_SETTINGS_LOAD, getRegFormAdvSettings);
  yield takeEvery(ApiConstants.API_REG_FORM_METHOD_LOAD, getRegFormMethod);
  yield takeEvery(ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_LOAD, getMembershipproduct);
  yield takeEvery(ApiConstants.API_GET_REG_FORM_LOAD, getRegistrationFormSaga);
  ///competition Init saga
  yield takeEvery(ApiConstants.API_REG_COMPETITION_FEE_INIT_LOAD, getCompetitionFeeInitSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_FEES_DETAILS_LOAD, saveCompetitionFeesDetailsSaga)
  yield takeEvery(ApiConstants.API_GET_COMPETITION_FEES_DETAILS_LOAD, getAllCompetitionFeesDeatilsSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_FEES_MEMBERHSIP_TAB_LOAD, saveCompetitionFeesMembershipTabSaga)
  yield takeEvery(ApiConstants.API_GET_DEFAULT_COMPETITION_FEES_MEMBERHSIP_PRODUCT_LOAD, getDefaultCompFeesMembershipProductSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_FEES_DIVISION_TAB_LOAD, saveCompetitionFeesDivisionSaga)
  yield takeEvery(ApiConstants.GET_CASUAL_FEE_DETAIL_API_LOAD, getCasualFeeDefault)
  yield takeEvery(ApiConstants.GET_SEASONAL_FEE_DETAIL_API_LOAD, getSeasonalFeeDefault)

  // competition fee payment post api
  yield takeEvery(ApiConstants.API_POST_COMPETITION_FEE_PAYMENT_LOAD, postPaymentOptionSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_FEES_SECTION_LOAD, saveCompetitionFeesSection)

  //competition fee discount post api
  yield takeEvery(ApiConstants.API_POST_COMPETITION_FEE_DISCOUNT_LOAD, postCompetitonDiscountSaga)
  yield takeEvery(ApiConstants.API_COMPETITION_DISCOUNT_TYPE_LOAD, defaultCompetitionDiscountSaga)
  yield takeEvery(ApiConstants.API_COMPETITION_FEE_DEFAULT_CHARITY_LOAD, defaultCharity_voucherSaga)


  //// ****************************Live Score Saga**************************************Start

  yield takeEvery(ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD, liveScorePlayerSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_LADDERS_DIVISION_LOAD, liveScoreLaddersDivisionsaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD, liveScoreLaddersListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DIVISION_LOAD, liveScoreDivisionSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_LOAD, liveScoreTeamSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_LOAD, liveScoreIncidentListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_MATCH_LIST_LOAD, liveScoreMatchListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_LOAD, liveScoreAddMatchSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_CREATE_MATCH_LOAD, liveScoreCreateMatchSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_NEWS_LIST_LOAD, liveScoreNewsListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_CREATE_ROUND_LOAD, liveScoreRoundSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_PUSH_BACK_LOAD, liveScoreBulkPushBack)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_BRING_FORWARD_LOAD, liveScoreBulkBringForwardSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_END_MATCHES_LOAD, liveScoreEndMatchesSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GOAL_LIST_LOAD, liveScoreGoalSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD, liveScoreManagerListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_SCORER_LIST_LOAD, liveScoreScorerListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_NEWS_LOAD, liveScoreAddNewsSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BANNERS_LOAD, liveScoreBannerSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_BANNER_LOAD, liveScoreAddBannerSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_LOAD, liveScoreRemoveBannerSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_DOUBLE_HEADER_LOAD, liveScoreDoubleHeaderSaga)
  yield takeEvery(ApiConstants.API_LIVESCORE_COMPETITION_INITATE, liveScoreCompetitionSaga)
  yield takeEvery(ApiConstants.API_LIVESCORE_COMPETION_DELETE_INITIATE, liveScoreCompetitionDelete)
  yield takeEvery(ApiConstants.LiveScore_SETTING_VIEW_INITITAE, liveScoreSettingSaga)
  yield takeEvery(ApiConstants.LiveScore_SETTING_DATA_POST_INITATE, liveScorePostSaga)

  // ****************************Live Score Saga**************************************End

  /* ************Competition Management Starts************ */
  yield takeEvery(ApiConstants.API_GET_YEAR_LOAD, competitionModuleSaga)

  //////
  yield takeEvery(ApiConstants.API_COMPETITION_FEE_DEFAULT_LOGO_LOAD, getDefaultCompFeesLogoSaga)


  // ****************************Venue And Tiemes**************************************Start
  ////Year and Competition
  yield takeEvery(ApiConstants.API_GET_YEAR_COMPETITION_LOAD, getOnlyYearAndCompetitionListSaga)


  /* Competition Format */
  yield takeEvery(ApiConstants.API_GET_COMPETITION_FORMAT_LOAD, competitionFormatSaga.getCompetitionFormatSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_FORMAT_LOAD, competitionFormatSaga.saveCompetitionFormatSaga)

  /* Competition Finals  */
  yield takeEvery(ApiConstants.API_GET_COMPETITION_FINALS_LOAD, competitionFinalSaga.getCompetitionFinalsSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_FINALS_LOAD, competitionFinalSaga.saveCompetitionFinalsSaga)
  yield takeEvery(ApiConstants.API_GET_TEMPLATE_DOWNLOAD_LOAD, competitionFinalSaga.getDownloadTemplateSaga)

  /* Ladder Format */
  yield takeEvery(ApiConstants.API_GET_LADDER_FORMAT_LOAD, ladderFormatSaga.getLadderFormatSaga)
  yield takeEvery(ApiConstants.API_SAVE_LADDER_FORMAT_LOAD, ladderFormatSaga.saveLadderFormatSaga)

  yield takeEvery(ApiConstants.API_MATCH_TYPES_LOAD, getMatchTypesSaga)
  yield takeEvery(ApiConstants.API_COMPETITION_TYPES_LOAD, getCompetitionTypesSaga)
  yield takeEvery(ApiConstants.API_COMPETITION_FORMAT_TYPES_LOAD, getCompetitionFormatTypesSaga)
  yield takeEvery(ApiConstants.API_ENHANCED_ROUND_ROBIN_LOAD, getEnhancedRoundRobinTypesSaga)

  /* ************Competition Management Ends************ */

  /* ************Competition Management Ends************ */

  yield takeEvery(ApiConstants.API_GET_COMPETITION_WITH_TIME_SLOTS_LOAD, competitonWithTimeSlots)
  yield takeEvery(ApiConstants.API_TIME_SLOT_INIT_LOAD, getTimeSlotInit)
  yield takeEvery(ApiConstants.API_GET_COMMON_REF_DATA_LOAD, getCommonDataSaga)
  yield takeEvery(ApiConstants.API_ADD_VENUE_LOAD, addVenueSaga)

  ////Venue Constraints
  yield takeEvery(ApiConstants.API_VENUE_CONSTRAINTS_LIST_LOAD, venueTimeSaga)

  ////ownCompetition venue list
  yield takeEvery(ApiConstants.API_VENUE_LIST_LOAD, venueListSaga)

  ///part player grading
  yield takeEvery(ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMMARY_LIST_LOAD, getCompPartPlayerGradingSummarySaga)

  ////own team grading
  yield takeEvery(ApiConstants.API_GET_COMPETITION_OWN_PROPOSED_TEAM_GRADING_LIST_LOAD, getCompOwnProposedTeamGradingSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_OWN_FINAL_TEAM_GRADING_LOAD, saveOwnFinalTeamGradingDataSaga)

  /* Affiliates starts */

  // Affiliates Listing
  yield takeEvery(ApiConstants.API_AFFILIATES_LISTING_LOAD, userSaga.getAffiliatesListingSaga)

  //Save Affiliate
  yield takeEvery(ApiConstants.API_SAVE_AFFILIATE_LOAD, userSaga.saveAffiliateSaga)

  //Affiliate by Organisation Id
  yield takeEvery(ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD, userSaga.getAffiliateByOrganisationIdSaga)

  //Affiliate Our Organisation Id
  yield takeEvery(ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD, userSaga.getAffiliateOurOrganisationIdSaga)

  //AffiliateToOrganisation
  yield takeEvery(ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD, userSaga.getAffiliatedToOrganisationSaga)

  //AFfiliateDelete
  yield takeEvery(ApiConstants.API_AFFILIATE_DELETE_LOAD, userSaga.deleteAffiliateSaga)

  ////////get the divisions list on the basis of year and competition
  yield takeEvery(ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_LOAD, getDivisionsListSaga)

  ////////get the grades reference data
  yield takeEvery(ApiConstants.API_GRADES_REFERENCE_LIST_LOAD, gradesReferenceListSaga)

  ////competition part proposed team grading get api
  yield takeEvery(ApiConstants.API_GET_COMPETITION_PART_PROPOSED_TEAM_GRADING_LIST_LOAD, getCompPartProposedTeamGradingSaga)

  ////competition part proposed team grading get api
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_PART_PROPOSED_TEAM_GRADING_LOAD, savePartProposedTeamGradingDataSaga)

  /********competition time slot post Api */
  yield takeEvery(ApiConstants.API_COMPETITION_TIMESLOT_POST_LOAD, competitonWithTimeSlotsPostApi)

  ///////save the competition part player grade calculate player grading summmary or say proposed player grading toggle
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMMARY_LIST_LOAD, saveCompPartPlayerGradingSummarySaga)

  /////////get the own team grading summary listing data
  yield takeEvery(ApiConstants.API_GET_COMPETITION_OWN_TEAM_GRADING_SUMMARY_LIST_LOAD, getTeamGradingSummarySaga)

  /////////competition part player grading get API 
  yield takeEvery(ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADING_LIST_LOAD, getCompPartPlayerGradingSaga)

  ////////competition Draws
  yield takeEvery(ApiConstants.API_GET_COMPETITION_DRAWS_LOAD, getCompetitionDrawsSaga)

  ////////competition Draws rounds
  yield takeEvery(ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_LOAD, getDrawsRoundsSaga)

  ////venueConstraintPostSaga
  yield takeEvery(ApiConstants.API_VENUE_CONSTRAINT_POST_LOAD, venueConstraintPostSaga)

  ////////save the changed grade name in own competition team grading summary data
  yield takeEvery(ApiConstants.API_SAVE_UPDATED_GRADE_NAME_TEAM_GRADING_SUMMARY_LOAD, saveUpdatedGradeTeamSummarySaga)

  ////////save the changed grade name in own competition team grading summary data
  yield takeEvery(ApiConstants.API_PUBLISH_TEAM_GRADING_SUMMARY_LOAD, publishGradeTeamSummarySaga)


  ////Competition Dashboard Saga
  yield takeEvery(ApiConstants.API_COMPETITION_DASHBOARD_LOAD, competitionDashboardSaga)

  ////////competition Draws update
  yield takeEvery(ApiConstants.API_UPDATE_COMPETITION_DRAWS_LOAD, updateCompetitionDraws)

  ////// Save Draws
  yield takeEvery(ApiConstants.API_UPDATE_COMPETITION_SAVE_DRAWS_LOAD, saveDrawsSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD, liveScoreAddEditPlayerSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD, liveScoreDashboardSaga)

  ///// Get Competition Venue 
  yield takeEvery(ApiConstants.API_GET_COMPETITION_VENUES_LOAD, getCompetitionVenues)

  // Get oraganisation for Add venue
  yield takeEvery(ApiConstants.API_ORGANISATION_LOAD, userSaga.getOrganisationForVenueSaga)

  ////Add/Edit Manager Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_LOAD, liveScoreAddEditManagerSaga)

  //// Delete Match Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DELETE_MATCH_LOAD, liveScoreDeleteMatchSaga)
  //////////////get the competition final grades on the basis of competition and division
  yield takeEvery(ApiConstants.API_GET_COMPETITION_FINAL_GRADES_LIST_LOAD, getCompFinalGradesListSaga)

  /////////////////update draws court timing where N/A(null) is there
  yield takeEvery(ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_LOAD, updateCourtTimingsDrawsAction)

  //// Team View Player List saga
  yield takeEvery(ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_LOAD, liveScoreTeamViewPlayerListSaga);

  //// Delete Team saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DELETE_TEAM_LOAD, liveScoreDeleteTeamSaga);
  /// Favourite Team Reference Saga
  yield takeEvery(ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD, favouriteTeamReferenceSaga)

  /// Firebird Player Reference Saga
  yield takeEvery(ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD, firebirdPlayerReferenceSaga)

  /// Registration Other Info Reference Saga
  yield takeEvery(ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD, registrationOtherInfoReferenceSaga)

  /// Country Reference Saga
  yield takeEvery(ApiConstants.API_COUNTRY_REFERENCE_LOAD, countryReferenceSaga)

  /// Nationality Reference Saga
  yield takeEvery(ApiConstants.API_NATIONALITY_REFERENCE_LOAD, nationalityReferenceSaga)

  /// HeardBy Reference Saga
  yield takeEvery(ApiConstants.API_HEARDBY_REFERENCE_LOAD, heardByReferenceSaga)

  /// Player Position Saga
  yield takeEvery(ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD, playerPositionReferenceSaga)

  //AFfiliateDelete
  yield takeEvery(ApiConstants.API_AFFILIATE_DELETE_LOAD, userSaga.deleteAffiliateSaga)

  //EndUserRegistrationSave
  yield takeEvery(ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD, endUserRegSaga.endUserRegistrationSaveSaga)

  // liveScore division saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD, divisionsaga.liveScoreDivisionsaga)

  //get particular user organisation 
  yield takeEvery(ApiConstants.API_GET_USER_ORGANISATION_LOAD, userSaga.getUserOrganisationSaga)

  //get competiiton Venue - live score
  yield takeEvery(ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_LOAD, liveScoreCompetitionVenuesList)
  // get notification liveScoreNewsNotificationSaga
  yield takeEvery(ApiConstants.API_LIVESCORE_NEWS_NOTIFICATION_LOAD, liveScoreNewsNotificationSaga)

  //delete news 

  yield takeEvery(ApiConstants.API_LIVESCORE_DELETE_NEWS_LOAD, liveScoreNewsDeleteSaga)

  //linescore create dividion saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_LOAD, liveScoreCreateDivisionsaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DELETE_DIVISION_LOAD, liveScoreDeleteDivisionSaga)
  // yield takeEvery(ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD, liveScoreDivisionsaga)
  // yield takeEvery(ApiConstants.API_LIVESCORE_COMPETION_DELETE_INITIATE)

  //liveScoreGameTimeStatisticsSaga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_LOAD, liveScoreGameTimeStatisticsSaga)
  //EndUserRegistration Registration Settings
  yield takeEvery(ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD, endUserRegSaga.orgRegistrationRegistrationSettings)

  //EndUserRegistration Membership Products
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD, endUserRegSaga.endUserRegistrationMembershipProducts)


  ////Venues list for user module
  yield takeEvery(ApiConstants.API_VENUES_LIST_LOAD, venuesListSaga)
  /// Venue By Id
  yield takeEvery(ApiConstants.API_VENUE_BY_ID_LOAD, venueByIdSaga)

  yield takeEvery(ApiConstants.API_VENUE_DELETE_LOAD, venueDeleteSaga)

  yield takeEvery(ApiConstants.API_ADD_NEW_TEAM_LOAD, addNewTeamPartPlayerGradingSaga)


  yield takeEvery(ApiConstants.API_DRAG_NEW_TEAM_LOAD, dragTeamPartPlayerSaga)

  yield takeEvery(ApiConstants.API_MATCH_RESULT_LOAD, liveScoreMatchResult)

  //umpires saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD, liveScoreUmpiresSaga)


  /// TEam ADD SAGA
  yield takeEvery(ApiConstants.GET_DIVISION_TEAM, liveScoreTeamDivisionSaga)
  yield takeEvery(ApiConstants.GET_AFFILATE_TEAM, liveScoreAffilateSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_TEAM_LOAD, addTeamLiveScoreSaga)

  //// Bulk Abandon Match Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_ABANDON_MATCH_LOAD, liveScoreAbandonMatchSaga)

  //// LiveScore Match Import Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_LOAD, liveScoreMatchImportSaga)

  //// Live Score Scorer List
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_LOAD, getLiveScoreScorerSaga)

  yield takeEvery(ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_INITAITE, liveScoreMatchSaga)
  // User Dashboard Textual Listing
  yield takeEvery(ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD, userSaga.getUserDashboardTextualListingSaga)

  //UserModule Personal Info
  yield takeEvery(ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD, userSaga.getUserModulePersonalDataSaga)

  //UserModule Personal Info by competition
  yield takeEvery(ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD, userSaga.getUserModulePersonalByCompDataSaga)

  //UserModule Registration
  yield takeEvery(ApiConstants.API_USER_MODULE_REGISTRATION_LOAD, userSaga.getUserModuleRegistrationDataSaga)


  // User Module Medical Info
  yield takeEvery(ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD, userSaga.getUserModuleMedicalInfoSaga)

  ////Live Score Team Import Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_LOAD, liveScoreTeamImportSaga)

  ////Live Score Division Import Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DIVISION_IMPORT_LOAD, liveScoreDivisionImportSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_LOAD, liveScoreTeamAttendanceListSaga)

  //// Get Team Data
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GET_TEAM_LOAD, liveScoreGetTeamSaga)

  yield takeEvery(ApiConstants.API_GENERATE_DRAW_LOAD, competitonGenerateDrawSaga);

  ////Year and  OWN Competition
  yield takeEvery(ApiConstants.API_GET_YEAR_OWN_COMPETITION_LOAD, getOwnYearAndCompetitionListSaga)

  ////Year and Participate Competition
  yield takeEvery(ApiConstants.API_GET_YEAR_Participate_COMPETITION_LOAD, getParticipateYearAndCompetitionListSaga)
  // User Module Activity Player
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD, userSaga.getUserModuleActivityPlayerSaga)

  // User Module Activity Parent
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD, userSaga.getUserModuleActivityParentSaga)

  // User Module Activity Scorer
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD, userSaga.getUserModuleActivityScorerSaga)

  // User Module Activity Manager
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD, userSaga.getUserModuleActivityManagerSaga)

  ////Import Player Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_LOAD, liveScorePlayerImportSaga)

  /// Assigne Matches 

  yield takeEvery(ApiConstants.API_LIVESCORE_ASSIGN_MATCHES_LOAD, liveScoreAssigneMatches)

  yield takeEvery(ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_LOAD, liveScoreChangeAssignStatus)

  //// Manager search saga
  yield takeEvery(ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD, liveScoreManagerSearch)

  yield takeEvery(ApiConstants.API_LIVESCORE_UNASSIGN_STATUS_LOAD, liveScoreUnAssignMatcheSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_SCORER_LOAD, liveScoreAddEditScorerSaga)

  //// Round List Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ROUND_LIST_LOAD, liveScoreRoundListSaga)

  //player grading comment
  yield takeEvery(ApiConstants.API_PLAYER_GRADING_COMMENT_LOAD, partPLayerCommentSaga)
  //player grading summary comment
  yield takeEvery(ApiConstants.API_PLAYER_GRADING_SUMMARY_COMMENT_LOAD, partPlayerSummaryCommentSaga)

  yield takeEvery(ApiConstants.API_TEAM_GRADING_COMMENT_LOAD, proposedTeamGradingComment)

  //part proposed team grading comment 
  yield takeEvery(ApiConstants.API_PART_TEAM_GRADING_COMMENT_LOAD, partProposedTeamGradingComment)

  yield takeEvery(ApiConstants.API_REG_DASHBOARD_LIST_LOAD, regDashboardListSaga)
  yield takeEvery(ApiConstants.API_GET_GENDER_LOAD, getGenderSaga)
  yield takeEvery(ApiConstants.API_GET_PHOTO_TYPE_LOAD, getPhotoTypeSaga)
  yield takeEvery(ApiConstants.API_GET_APPY_TO_LOAD, getAppyToSaga)
  yield takeEvery(ApiConstants.API_GET_EXTRA_TIME_DRAW_LOAD, getExtraTimeDrawSaga)
  yield takeEvery(ApiConstants.API_GET_FINAL_FIXTURE_TEMPLATE_LOAD, getFinalsFixtureTemplateSaga)
  yield takeEvery(ApiConstants.API_ALLOW_TEAM_REGISTRATION_TYPE_LOAD, getAllowTeamRegistrationTypeSaga)



  //Search Scorer saga 
  yield takeEvery(ApiConstants.API_LIVESCORE_SCORER_SEARCH_LOAD, liveScoreScorerSearchSaga)
  //Club List Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_CLUB_LIST_LOAD, liveScoreClubListSaga)
  //// Ladder Setting Saga
  yield takeEvery(ApiConstants.API_LADDER_SETTING_MATCH_RESULT_LOAD, laddersSettingGetMatchResult)
  yield takeEvery(ApiConstants.API_LADDER_SETTING_GET_DATA_LOAD, laddersSettingGetData)
  yield takeEvery(ApiConstants.API_LADDER_SETTING_POST_DATA_LOAD, laddersSettingPostData)
  // Tema list with paggination
  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_WITH_PAGGING_LOAD, liveScoreTeamPaggingSaga);
  //Player list with paggination
  yield takeEvery(ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_LOAD, getPlayerListPagginationSaga);
  yield takeEvery(ApiConstants.API_USERCOUNT_LOAD, homeDashboardSaga)
  //// Invitee Search SAGA
  yield takeEvery(ApiConstants.API_COMPETITION_FEE_INVITEES_SEARCH_LOAD, inviteeSearchSaga)
  yield takeEvery(ApiConstants.API_COMPETITION_PLAYER_IMPORT_LOAD, importCompetitionPlayer);
  yield takeEvery(ApiConstants.API_COMPETITION_TEAMS_IMPORT_LOAD, importCompetitionTeams);
  yield takeEvery(ApiConstants.API_EXPORT_FILES_LOAD, exportFilesSaga)
  yield takeEvery(ApiConstants.API_SAVE_VENUE_CHANGE_LOAD, liveScoreChangeVenueSaga);
  //EndUserRegistrationDashboard List
  yield takeEvery(ApiConstants.API_USER_REG_DASHBOARD_LIST_LOAD, endUserRegSaga.endUserRegDashboardListSaga)
  // User Friend List
  yield takeEvery(ApiConstants.API_USER_FRIEND_LOAD, userSaga.getUserFriendListSaga)
  // User Refer Friend List
  yield takeEvery(ApiConstants.API_USER_REFER_FRIEND_LOAD, userSaga.getUserReferFriendListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GET_FIXTURE_COMP_LOAD, getLiveScoreFixtureCompSaga)
  //////////////////draws division grade names list
  yield takeEvery(ApiConstants.API_DRAWS_DIVISION_GRADE_NAME_LIST_LOAD, getDivisionGradeNameListSaga)
  //////////stripe payment account balance API
  yield takeEvery(ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD, stripeSaga.accountBalanceSaga)
  ///////For stripe charging payment API
  yield takeEvery(ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD, stripeSaga.chargingPaymentSaga)
  yield takeEvery(ApiConstants.API_DRAW_PUBLISH_LOAD, publishDraws)
  //part proposed team grading comment 
  yield takeEvery(ApiConstants.API_COMPETITION_TEAM_DELETE_LOAD, deleteTeamSaga)
  //part proposed team grading comment 
  yield takeEvery(ApiConstants.API_COMPETITION_TEAM_DELETE_ACTION_LOAD, deleteTeamActionSaga)
  //////////stripe payment account balance API
  yield takeEvery(ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_LOAD, stripeSaga.saveStripeAccountSaga)
  // Organisation Photos List
  yield takeEvery(ApiConstants.API_GET_ORG_PHOTO_LOAD, userSaga.getOrgPhotosListSaga)
  // Organisation Photos Save
  yield takeEvery(ApiConstants.API_SAVE_ORG_PHOTO_LOAD, userSaga.saveOrgPhotosSaga)
  // Organisation Photos Delete
  yield takeEvery(ApiConstants.API_DELETE_ORG_PHOTO_LOAD, userSaga.deleteOrgPhotosSaga)
  //Draws Matches List Export
  yield takeEvery(ApiConstants.API_DRAW_MATCHES_LIST_LOAD, drawsMatchesListExportSaga)
  //////////stripe login link
  yield takeEvery(ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_LOAD, stripeSaga.getStripeLoginLinkSaga)
  /////stripe payments transfer list
  yield takeEvery(ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_LOAD, stripeSaga.getStripeTransferListSaga)
  ///forgot password
  yield takeEvery(ApiConstants.API_FORGOT_PASSWORD_LOAD, forgotPasswordSaga);
  //////stripe payout list
  yield takeEvery(ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_LOAD, stripeSaga.getStripePayoutListSaga)
  //Final Teams Export
  yield takeEvery(ApiConstants.API_EXPORT_FINAL_TEAMS_LOAD, finalTeamsExportSaga)
  yield takeEvery(ApiConstants.API_EXPORT_FINAL_PLAYERS_LOAD, finalPlayersExportSaga)
  yield takeEvery(ApiConstants.API_EXPORT_PROPOSED_TEAMS_LOAD, proposedTeamsExportSaga)
  yield takeEvery(ApiConstants.API_EXPORT_PROPOSED_PLAYERS_LOAD, proposedPlayersExportSaga)
  /////stripe single payout transaction list
  yield takeEvery(ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_LOAD, stripeSaga.getTransactionPayoutListSaga)
  ////coach saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD, liveScoreCoachSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_LOAD, liveScoreAddCoachSaga)
  // Organisation Contat Delete
  yield takeEvery(ApiConstants.API_DELETE_ORG_CONTACT_LOAD, userSaga.deleteOrgContactSaga)
  // Organisation Contat Delete
  yield takeEvery(ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_LOAD, userSaga.exportOrgRegQuestionsSaga)
  /////API_GET_INVOICE data
  yield takeEvery(ApiConstants.API_GET_INVOICE_LOAD, stripeSaga.getInvoiceSaga)
  //fixtureSaga get division grade api
  yield takeEvery(ApiConstants.API_GET_DIVISION_LOAD, getDivisionSaga)
  yield takeEvery(ApiConstants.API_GET_FIXTURE_LOAD, competitionFixtureSaga)
  yield takeEvery(ApiConstants.API_UPDATE_COMPETITION_FIXTURE_LOAD, updateCompetitionFixtures)
  //// Competition division delete 
  yield takeEvery(ApiConstants.API_COMPETITION_DIVISION_DELETE_LOAD, deleteCompetitionDivisionSaga)
  // Team Change division 
  yield takeEvery(ApiConstants.API_CHANGE_COMPETITION_DIVISION_TEAM_LOAD, teamChangeDivisionSaga)
  // Player Change division 
  yield takeEvery(ApiConstants.API_CHANGE_COMPETITION_DIVISION_PLAYER_LOAD, playerChangeDivisionSaga)
  yield takeEvery(ApiConstants.API_AFFILIATE_DIRECTORY_LOAD, userSaga.getAffiliateDirectorySaga)
  yield takeEvery(ApiConstants.API_COURT_LIST_LOAD, courtListSaga)
  yield takeEvery(ApiConstants.API_UPDATE_DRAWS_LOCK_LOAD, updateDrawsLock)
  yield takeEvery(ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_LOAD, userSaga.exportAffiliateDirectorySaga)
  // invite send in registration Form
  yield takeEvery(ApiConstants.API_GET_INVITE_TYPE_LOAD, getSendInvitesSaga)
  yield takeEvery(ApiConstants.API_GET_COMMENT_LIST_LOAD, playerCommentList)
  //// Umpire Module
  yield takeEvery(ApiConstants.API_UMPIRE_LIST_LOAD, umpireSaga.umpireListSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD, umpireCompSaga.getUmpireCompSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_LOAD, umpireSaga.getAffiliateSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_SEARCH_LOAD, umpireSaga.umpireSearchSaga)
  yield takeEvery(ApiConstants.API_ADD_UMPIRE_LOAD, umpireSaga.addEditUmpireSaga)
  yield takeEvery(ApiConstants.SETTING_REGISTRATION_INVITEES_LOAD, settingRegInviteesSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_COACH_IMPORT_LOAD, liveScoreCoachImportSaga)
  yield takeEvery(ApiConstants.API_GET_ALL_COMPETITION_LOAD, getCompetitionSaga)
  yield takeEvery(ApiConstants.API_REGISTRATION_RESTRICTIONTYPE_LOAD, RegistrationRestrictionType)
  yield takeEvery(ApiConstants.API_FIXTURE_TEMPLATE_ROUNDS_LOAD, fixtureTemplateSaga)
  yield takeEvery(ApiConstants.API_PAYMENT_TYPE_LIST_LOAD, stripeSaga.getPaymentListSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_ROASTER_LIST_LOAD, umpireRoasterSaga.umpireRoasterListSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_LOAD, umpireDashboardSaga.umpireVenueListSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_ROASTER_ACTION_CLICK_LOAD, umpireRoasterSaga.umpireActionPerofomSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_LOAD, umpireDashboardSaga.umpireDivisionListSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_LOAD, umpireDashboardSaga.umpireListDashboardSaga)
  yield takeEvery(ApiConstants.API_USER_PROFILE_UPDATE_LOAD, userSaga.updateUserProfileSaga)
  /// Disability Reference Saga
  yield takeEvery(ApiConstants.API_DISABILITY_REFERENCE_LOAD, disabilityReferenceSaga)
  yield takeEvery(ApiConstants.API_GET_COMMON_INIT_LOAD, getCommonInitSaga)
  ///Action Box List
  yield takeEvery(ApiConstants.API_GET_ACTION_BOX_LOAD, actionBoxListSaga)
  ///Update Action Box
  yield takeEvery(ApiConstants.API_UPDATE_ACTION_BOX_LOAD, updateActionBoxSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_IMPORT_LOAD, umpireDashboardSaga.umpireImportSaga)
  //////assign umpire get list
  yield takeEvery(ApiConstants.API_GET_ASSIGN_UMPIRE_LIST_LOAD, assignUmpireSaga.getAssignUmpireListSaga)
  //////assign umpire get list
  yield takeEvery(ApiConstants.API_ASSIGN_UMPIRE_FROM_LIST_LOAD, assignUmpireSaga.assignUmpireSaga)
  /////unassign umpire from the match(delete)
  yield takeEvery(ApiConstants.API_UNASSIGN_UMPIRE_FROM_LIST_LOAD, assignUmpireSaga.unassignUmpireSaga)
  yield takeEvery(ApiConstants.CHANGE_PLAYER_LINEUP_LOAD, playerLineUpStatusChnage)
  yield takeEvery(ApiConstants.API_USER_EXPORT_FILES_LOAD, userExportFilesSaga)
  //////shop product listing
  yield takeEvery(ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD, shopProductSaga.getProductListingSaga)
  /////shop add product
  yield takeEvery(ApiConstants.API_ADD_SHOP_PRODUCT_LOAD, shopProductSaga.addProductSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_LOAD, liveScoreUmpiresImportSaga)
  yield takeEvery(ApiConstants.BULK_SCORE_UPDATE_LOAD, bulkScoreChange)
  //////////////////////registration main dashboard listing owned and participate registration
  yield takeEvery(ApiConstants.API_GET_REGISTRATION_MAIN_DASHBOARD_LISTING_LOAD, registrationMainDashboardListSaga)
  yield takeEvery(ApiConstants.API_YEAR_AND_QUICK_COMPETITION_LOAD, competitionQuickSaga.getquickYearAndCompetitionListSaga)
  ////////////////post/save quick competition division
  yield takeEvery(ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_LOAD, competitionQuickSaga.saveQuickCompDivisionSaga)
  ////////////get reference type in the add product screen
  yield takeEvery(ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD, shopProductSaga.getTypesOfProductSaga)
  /// create quick competition 
  yield takeEvery(ApiConstants.API_CREATE_QUICK_COMPETITION_LOAD, competitionQuickSaga.createQuickComptitionSaga)
  yield takeEvery(ApiConstants.API_GET_QUICK_COMPETITION_LOAD, competitionQuickSaga.getQuickComptitionSaga)
  // quick competition time slot
  yield takeEvery(ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_LOAD, competitionQuickSaga.quickcompetitoTimeSlotsPostApi)
  //////update quick competition
  yield takeEvery(ApiConstants.API_UPDATE_QUICK_COMPETITION_LOAD, competitionQuickSaga.updateQuickCompetitionSaga)
  ///////////get state reference data
  yield takeEvery(ApiConstants.API_GET_STATE_REFERENCE_DATA_LOAD, getStateReferenceSaga)
  //////////////////delete product from the product listing API
  yield takeEvery(ApiConstants.API_DELETE_SHOP_PRODUCT_LOAD, shopProductSaga.deleteProductSaga)

  yield takeEvery(ApiConstants.API_REGISTRATION_PAYMENT_STATUS_LOAD, getRegistrationPaymentStatusSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_LOAD, liveScoreAddEditIncidentSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_INCIDENT_TYPE_LOAD, liveScoreIncidentTypeSaga)
  yield takeEvery(ApiConstants.QUICKCOMP_IMPORT_DATA_LOAD, competitionQuickSaga.quickCompetitionPlayer)
  ///////////////////////////delete product variant API
  yield takeEvery(ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_LOAD, shopProductSaga.deleteProductVariantSaga)
  /////////////////////////add type in the typelist array in from the API
  yield takeEvery(ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_LOAD, shopProductSaga.addNewTypeSaga)
  ///////////////////product details on id API
  yield takeEvery(ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD, shopProductSaga.getProductDetailsByIdSaga)

  // Get match print template type
  yield takeEvery(ApiConstants.API_MATCH_PRINT_TEMPLATE_LOAD, getMatchPrintTemplateTypeSaga)

  // Get match sheet upload
  yield takeEvery(ApiConstants.API_MATCH_SHEET_PRINT_LOAD, liveScoreMatchSheetSaga.liveScoreMatchSheetPrintSaga)

  // Get match sheet download
  yield takeEvery(ApiConstants.API_MATCH_SHEET_DOWNLOADS_LOAD, liveScoreMatchSheetSaga.liveScoreMatchSheetDownloadSaga)

  yield takeEvery(ApiConstants.API_LADDER_ADJUSTMENT_POST_LOAD, ladderAdjustmentPostSaga)
  yield takeEvery(ApiConstants.API_LADDER_ADJUSTMENT_GET_LOAD, ladderAdjustmentGetSaga)

  // user history
  yield takeEvery(ApiConstants.API_USER_MODULE_HISTORY_LOAD, userSaga.getUserHistorySaga)

  // Update User Photo
  yield takeEvery(ApiConstants.API_USER_PHOTO_UPDATE_LOAD, userSaga.saveUserPhotosSaga);

  // Get User Detail
  yield takeEvery(ApiConstants.API_USER_DETAIL_LOAD, userSaga.getUserDetailSaga);

  // Update User Detail
  yield takeEvery(ApiConstants.API_USER_DETAIL_UPDATE_LOAD, userSaga.saveUserDetailSaga);

  // Update User Password
  yield takeEvery(ApiConstants.API_USER_PASSWORD_UPDATE_LOAD, userSaga.updateUserPasswordSaga);

  yield takeEvery(ApiConstants.API_LIVE_SCORE_MANAGER_IMPORT_LOAD, liveScoreManagerImportSaga)

  ///////////shop setting get API
  yield takeEvery(ApiConstants.API_GET_SHOP_SETTING_LOAD, shopSettingSaga.getShopSettingSaga);
  ////shop setting create address API
  yield takeEvery(ApiConstants.API_CREATE_SHOP_SETTING_ADDRESS_LOAD, shopSettingSaga.createAddressSaga);

  ////organisation charity update API
  yield takeEvery(ApiConstants.API_UPDATE_CHARITY_ROUND_UP_LOAD, userSaga.updateCharitySaga);

  ////organisation terms and conditions update API
  yield takeEvery(ApiConstants.API_UPDATE_TERMS_AND_CONDITION_LOAD, userSaga.updateTermsAndConditionsSaga);
  yield takeEvery(ApiConstants.API_COMPETITION_STATUS_UPDATE_LOAD, updateCompetitionStatusSaga)

  ////////competition Active Draws rounds
  yield takeEvery(ApiConstants.API_GET_DRAWS_ACTIVE_ROUNDS_LOAD, getActiveDrawsRoundsSaga)

  // Check venue address duplication
  yield takeEvery(ApiConstants.API_VENUE_ADDRESS_CHECK_DUPLICATION_LOAD, checkVenueAddressDuplicationSaga);

  // Umpire Round Saga

  yield takeEvery(ApiConstants.API_UMPIRE_ROUND_LIST_LOAD, umpireDashboardSaga.umpireRoundListSaga)

}
