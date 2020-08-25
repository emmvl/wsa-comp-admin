import { all, fork, takeEvery } from "redux-saga/effects";

import ApiConstants from "themes/apiConstants";
import appSaga from "./appSaga";
import authenticationSaga from "./authenticationSaga";
import commonSaga from "./commonSaga";
import homeDashboardSaga from "./homeDashboardSaga";
import liveScoreSaga from "./liveScoreSaga/liveScoreSaga";
import liveScoreCoachSaga from "./liveScoreSaga/liveScoreCoachSaga";
import liveScoreDivisionSaga from "./liveScoreSaga/liveScoreDivisionSaga";
import liveScoreManagerSaga from "./liveScoreSaga/liveScoreManagerSaga";
import liveScoreMatchSaga from "./liveScoreSaga/liveScoreMatchSaga";
import liveScorePlayerSaga from "./liveScoreSaga/liveScorePlayerSaga";
import liveScoreTeamSaga from "./liveScoreSaga/liveScoreTeamSaga";
import shopOrderStatusSaga from "./shopSaga/shopOrderStatusSaga";
import shopOrderSummarySaga from "./shopSaga/shopOrderSummarySaga";
import shopProductSaga from "./shopSaga/shopProductSaga";
import shopSettingSaga from "./shopSaga/shopSettingSaga";
import stripeSaga from "./stripeSaga";
import supportSaga from "./supportSaga";
import userSaga from "./userSaga";

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
  getDivisionsListSaga,
  getTeamRegistrationsSaga
} from "./registrationSaga/registrationSaga";

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
import { liveScoreLaddersDivisionsaga, liveScoreLaddersListSaga, ladderAdjustmentPostSaga, ladderAdjustmentGetSaga, liveScoreResetLadderSaga } from './liveScoreSaga/liveScoreLadderSaga';
import { liveScoreIncidentListSaga, liveScoreAddEditIncidentSaga, liveScoreIncidentTypeSaga } from './liveScoreSaga/liveScoreIncidentSaga';
import { liveScoreRoundSaga, liveScoreRoundListSaga } from './liveScoreSaga/liveScoreRoundSaga';
import { liveScoreNewsListSaga, liveScoreAddNewsSaga, liveScoreNewsNotificationSaga, liveScoreNewsDeleteSaga } from './liveScoreSaga/liveScoreNewsSaga';
import { liveScoreBannerSaga, liveScoreAddBannerSaga, liveScoreRemoveBannerSaga } from './liveScoreSaga/liveScoreBannerSaga';
import { liveScoreGoalSaga } from './liveScoreSaga/liveScoreGoalSaga'
import { liveScoreScorerListSaga, liveScoreAssigneMatches, liveScoreChangeAssignStatus, liveScoreAddEditScorerSaga, liveScoreUnAssignMatcheSaga, liveScoreScorerSearchSaga } from './liveScoreSaga/liveScoreScorerSaga';
import { liveScoreBulkPushBack, liveScoreBulkBringForwardSaga, liveScoreMatchResult, liveScoreEndMatchesSaga, liveScoreDoubleHeaderSaga, liveScoreAbandonMatchSaga } from './liveScoreSaga/liveScoreBulkMatchSaga';
import { liveScoreDashboardSaga } from './liveScoreSaga/liveScoreDashboardSaga';
import { liveScoreCompetitionSaga, liveScoreCompetitionDelete } from './liveScoreSaga/liveScoreCompetionSaga'

////*******************Live Score********************************************End

////Competition Management

import { competitionModuleSaga, competitonGenerateDrawSaga } from './competitionManagementSaga/competitionModuleSaga'
import * as competitionFormatSaga from '../saga/competitionManagementSaga/competitionFormatSaga';
import * as competitionFinalSaga from '../saga/competitionManagementSaga/competitionFinalsSaga';
import * as ladderFormatSaga from '../saga/competitionManagementSaga/ladderFormatSaga';
import { competitonWithTimeSlots, competitonWithTimeSlotsPostApi } from './competitionManagementSaga/competitionTimeAndSlotSaga';

import { fixtureTemplateSaga } from './competitionManagementSaga/competitionManagementSaga';
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

////////competition draws 
import {
  getCompetitionDrawsSaga, getDrawsRoundsSaga,
  updateCompetitionDraws, saveDrawsSaga,
  getCompetitionVenues, updateCourtTimingsDrawsAction,
  getDivisionGradeNameListSaga, publishDraws, drawsMatchesListExportSaga,
  getDivisionSaga, competitionFixtureSaga, updateCompetitionFixtures, updateDrawsLock,
  getActiveDrawsRoundsSaga, getVenueAndDivisionSaga
} from './competitionManagementSaga/competitionDrawsSaga';

import { regDashboardListSaga, getCompetitionSaga, registrationMainDashboardListSaga } from "./registrationSaga/registrationDashboardSaga"
////Competition Dashboard Saga
import { competitionDashboardSaga, updateCompetitionStatusSaga, competitionDashboardDeleteSaga } from './competitionManagementSaga/competitionDashboardSaga';

// EndUserRegistrationSaga
import * as endUserRegSaga from '../saga/registrationSaga/endUserRegistrationSaga';

import { liveScoreGameTimeStatisticsSaga } from './liveScoreSaga/liveScoreGameTimeStatisticsSaga'
import { liveScoreSettingSaga, liveScorePostSaga, settingRegInviteesSaga } from './liveScoreSaga/liveScoreSettingSaga'
import { liveScoreUmpiresSaga, liveScoreUmpiresImportSaga } from './liveScoreSaga/liveScoreUmpiresSaga'

import { liveScoreTeamAttendanceListSaga } from './liveScoreSaga/liveScoreTeamAttendanceSaga'

import { laddersSettingGetMatchResult, laddersSettingGetData, laddersSettingPostData } from './liveScoreSaga/liveScoreLadderSettingSaga'

import { liveScoreChangeVenueSaga } from "./liveScoreSaga/liveScoreVenueChangeSaga"
import { getLiveScoreFixtureCompSaga } from "./liveScoreSaga/liveScoreFixtureCompSaga";

import * as umpireDashboardSaga from "../saga/umpireSaga/umpireDashboardSaga"
import * as umpireCompSaga from "../saga/umpireSaga/umpireCompetitionSaga"
import * as umpireRoasterSaga from "../saga/umpireSaga/umpireRoasterSaga"
import * as umpireSaga from "../saga/umpireSaga/umpireSaga"
import * as assignUmpireSaga from "../saga/umpireSaga/assignUmpireSaga";
import * as competitionQuickSaga from "../saga/competitionManagementSaga/competitionQuickCompetitionSaga";
import * as liveScoreMatchSheetSaga from './liveScoreSaga/liveScoreMatchSheetSaga';

import { getInnerHorizontalCompSaga } from './liveScoreSaga/liveScoreInnerHorizontalSaga'

import { liveScorePositionTrackSaga } from './liveScoreSaga/liveScorePositionTrackSaga'

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(commonSaga),
    fork(authenticationSaga),
    fork(homeDashboardSaga),

    // LiveScore
    fork(liveScoreSaga),
    fork(liveScoreCoachSaga),
    fork(liveScoreDivisionSaga),
    fork(liveScoreManagerSaga),
    fork(liveScoreMatchSaga),
    fork(liveScorePlayerSaga),
    fork(liveScoreTeamSaga),

    // Shop
    fork(shopOrderStatusSaga),
    fork(shopOrderSummarySaga),
    fork(shopProductSaga),
    fork(shopSettingSaga),
    fork(shopOrderStatusSaga),

    // Stripe
    fork(stripeSaga),

    // Support
    fork(supportSaga),

    // User
    fork(userSaga),
  ]);


  yield takeEvery(ApiConstants.API_REG_COMPETITION_LIST_LOAD, regCompetitionFeeListSaga);
  yield takeEvery(ApiConstants.API_REG_MEMBERSHIP_LIST_LOAD, regMembershipFeeListSaga);
  yield takeEvery(ApiConstants.API_REG_COMPETITION_LIST_DELETE_LOAD, regCompetitionFeeListDeleteSaga);
  yield takeEvery(ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_LOAD, regMembershipFeeListDeleteSaga);
  yield takeEvery(ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT_LOAD, regGetMembershipProductDetailSaga);
  yield takeEvery(ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT__LOAD, regSaveMembershipProductDetailSaga);
  yield takeEvery(ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES__LOAD, regDefaultMembershipProductTypesSaga)
  yield takeEvery(ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES__LOAD, regSaveMembershipProductFeeSaga);
  yield takeEvery(ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT__LOAD, regSaveMembershipProductDiscountSaga);
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD, membershipProductDiscountTypeSaga);
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD, membershipProductDiscountTypeSaga);
  yield takeEvery(ApiConstants.API_REG_FORM_LOAD, regSaveRegistrationForm);
  yield takeEvery(ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_LOAD, getMembershipproduct);
  yield takeEvery(ApiConstants.API_GET_REG_FORM_LOAD, getRegistrationFormSaga);
  ///competition Init saga
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

  yield takeEvery(ApiConstants.API_LIVE_SCORE_LADDERS_DIVISION_LOAD, liveScoreLaddersDivisionsaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD, liveScoreLaddersListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_LOAD, liveScoreIncidentListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_NEWS_LIST_LOAD, liveScoreNewsListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_CREATE_ROUND_LOAD, liveScoreRoundSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_PUSH_BACK_LOAD, liveScoreBulkPushBack)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_BRING_FORWARD_LOAD, liveScoreBulkBringForwardSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_END_MATCHES_LOAD, liveScoreEndMatchesSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GOAL_LIST_LOAD, liveScoreGoalSaga)
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


  /* ************Competition Management Ends************ */

  /* ************Competition Management Ends************ */

  yield takeEvery(ApiConstants.API_GET_COMPETITION_WITH_TIME_SLOTS_LOAD, competitonWithTimeSlots)

  ////Venue Constraints
  yield takeEvery(ApiConstants.API_VENUE_CONSTRAINTS_LIST_LOAD, venueTimeSaga)

  ////ownCompetition venue list

  ///part player grading
  yield takeEvery(ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMMARY_LIST_LOAD, getCompPartPlayerGradingSummarySaga)

  ////own team grading
  yield takeEvery(ApiConstants.API_GET_COMPETITION_OWN_PROPOSED_TEAM_GRADING_LIST_LOAD, getCompOwnProposedTeamGradingSaga)
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_OWN_FINAL_TEAM_GRADING_LOAD, saveOwnFinalTeamGradingDataSaga)


  ////////get the divisions list on the basis of year and competition
  yield takeEvery(ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_LOAD, getDivisionsListSaga)

  ////////get the grades reference data

  ////competition part proposed team grading get api
  yield takeEvery(ApiConstants.API_GET_COMPETITION_PART_PROPOSED_TEAM_GRADING_LIST_LOAD, getCompPartProposedTeamGradingSaga)

  ////competition part proposed team grading get api
  yield takeEvery(ApiConstants.API_SAVE_COMPETITION_PART_PROPOSED_TEAM_GRADING_LOAD, savePartProposedTeamGradingDataSaga)

  /********competition time slot post Api */
  yield takeEvery(ApiConstants.API_COMPETITION_TIMESLOT_POST_LOAD, competitonWithTimeSlotsPostApi)

  ///////save the competition part player grade calculate player grading summary or say proposed player grading toggle
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

  yield takeEvery(ApiConstants.API_LIVE_SCORE_DASHBOARD_LOAD, liveScoreDashboardSaga)

  ///// Get Competition Venue 
  yield takeEvery(ApiConstants.API_GET_COMPETITION_VENUES_LOAD, getCompetitionVenues)
  //////////////get the competition final grades on the basis of competition and division
  yield takeEvery(ApiConstants.API_GET_COMPETITION_FINAL_GRADES_LIST_LOAD, getCompFinalGradesListSaga)

  /////////////////update draws court timing where N/A(null) is there
  yield takeEvery(ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_LOAD, updateCourtTimingsDrawsAction)

  //EndUserRegistrationSave
  yield takeEvery(ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD, endUserRegSaga.endUserRegistrationSaveSaga)
  // get notification liveScoreNewsNotificationSaga
  yield takeEvery(ApiConstants.API_LIVESCORE_NEWS_NOTIFICATION_LOAD, liveScoreNewsNotificationSaga)

  //delete news 

  yield takeEvery(ApiConstants.API_LIVESCORE_DELETE_NEWS_LOAD, liveScoreNewsDeleteSaga)

  //liveScoreGameTimeStatisticsSaga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_LOAD, liveScoreGameTimeStatisticsSaga)
  //EndUserRegistration Registration Settings
  yield takeEvery(ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD, endUserRegSaga.orgRegistrationRegistrationSettings)

  //EndUserRegistration Membership Products
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD, endUserRegSaga.endUserRegistrationMembershipProducts)

  yield takeEvery(ApiConstants.API_ADD_NEW_TEAM_LOAD, addNewTeamPartPlayerGradingSaga)


  yield takeEvery(ApiConstants.API_DRAG_NEW_TEAM_LOAD, dragTeamPartPlayerSaga)

  yield takeEvery(ApiConstants.API_MATCH_RESULT_LOAD, liveScoreMatchResult)

  //umpires saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD, liveScoreUmpiresSaga)

  //// Bulk Abandon Match Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_BULK_ABANDON_MATCH_LOAD, liveScoreAbandonMatchSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_LOAD, liveScoreTeamAttendanceListSaga)

  yield takeEvery(ApiConstants.API_GENERATE_DRAW_LOAD, competitonGenerateDrawSaga);

  /// Assigne Matches 

  yield takeEvery(ApiConstants.API_LIVESCORE_ASSIGN_MATCHES_LOAD, liveScoreAssigneMatches)

  yield takeEvery(ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_LOAD, liveScoreChangeAssignStatus)

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

  //Search Scorer saga
  yield takeEvery(ApiConstants.API_LIVESCORE_SCORER_SEARCH_LOAD, liveScoreScorerSearchSaga)
  //// Ladder Setting Saga
  yield takeEvery(ApiConstants.API_LADDER_SETTING_MATCH_RESULT_LOAD, laddersSettingGetMatchResult)
  yield takeEvery(ApiConstants.API_LADDER_SETTING_GET_DATA_LOAD, laddersSettingGetData)
  yield takeEvery(ApiConstants.API_LADDER_SETTING_POST_DATA_LOAD, laddersSettingPostData)
  //// Invitee Search SAGA
  yield takeEvery(ApiConstants.API_COMPETITION_FEE_INVITEES_SEARCH_LOAD, inviteeSearchSaga)
  yield takeEvery(ApiConstants.API_COMPETITION_PLAYER_IMPORT_LOAD, importCompetitionPlayer);
  yield takeEvery(ApiConstants.API_COMPETITION_TEAMS_IMPORT_LOAD, importCompetitionTeams);
  yield takeEvery(ApiConstants.API_SAVE_VENUE_CHANGE_LOAD, liveScoreChangeVenueSaga);
  //EndUserRegistrationDashboard List
  yield takeEvery(ApiConstants.API_USER_REG_DASHBOARD_LIST_LOAD, endUserRegSaga.endUserRegDashboardListSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GET_FIXTURE_COMP_LOAD, getLiveScoreFixtureCompSaga)
  //////////////////draws division grade names list
  yield takeEvery(ApiConstants.API_DRAWS_DIVISION_GRADE_NAME_LIST_LOAD, getDivisionGradeNameListSaga)
  yield takeEvery(ApiConstants.API_DRAW_PUBLISH_LOAD, publishDraws)
  //part proposed team grading comment 
  yield takeEvery(ApiConstants.API_COMPETITION_TEAM_DELETE_LOAD, deleteTeamSaga)
  //part proposed team grading comment 
  yield takeEvery(ApiConstants.API_COMPETITION_TEAM_DELETE_ACTION_LOAD, deleteTeamActionSaga)
  //Draws Matches List Export
  yield takeEvery(ApiConstants.API_DRAW_MATCHES_LIST_LOAD, drawsMatchesListExportSaga)
  //Final Teams Export
  yield takeEvery(ApiConstants.API_EXPORT_FINAL_TEAMS_LOAD, finalTeamsExportSaga)
  yield takeEvery(ApiConstants.API_EXPORT_FINAL_PLAYERS_LOAD, finalPlayersExportSaga)
  yield takeEvery(ApiConstants.API_EXPORT_PROPOSED_TEAMS_LOAD, proposedTeamsExportSaga)
  yield takeEvery(ApiConstants.API_EXPORT_PROPOSED_PLAYERS_LOAD, proposedPlayersExportSaga)
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
  yield takeEvery(ApiConstants.API_UPDATE_DRAWS_LOCK_LOAD, updateDrawsLock)
  // invite send in registration Form
  yield takeEvery(ApiConstants.API_GET_COMMENT_LIST_LOAD, playerCommentList)
  //// Umpire Module
  yield takeEvery(ApiConstants.API_UMPIRE_LIST_LOAD, umpireSaga.umpireListSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_COMPETITION_LIST_LOAD, umpireCompSaga.getUmpireCompSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_AFFILIATE_LIST_LOAD, umpireSaga.getAffiliateSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_SEARCH_LOAD, umpireSaga.umpireSearchSaga)
  yield takeEvery(ApiConstants.API_ADD_UMPIRE_LOAD, umpireSaga.addEditUmpireSaga)
  yield takeEvery(ApiConstants.SETTING_REGISTRATION_INVITEES_LOAD, settingRegInviteesSaga)
  yield takeEvery(ApiConstants.API_GET_ALL_COMPETITION_LOAD, getCompetitionSaga)
  yield takeEvery(ApiConstants.API_FIXTURE_TEMPLATE_ROUNDS_LOAD, fixtureTemplateSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_ROASTER_LIST_LOAD, umpireRoasterSaga.umpireRoasterListSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_LOAD, umpireDashboardSaga.umpireVenueListSaga)
  yield takeEvery(ApiConstants.API_UMPIRE_ROASTER_ACTION_CLICK_LOAD, umpireRoasterSaga.umpireActionPerofomSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_LOAD, umpireDashboardSaga.umpireDivisionListSaga)
  yield takeEvery(ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_LOAD, umpireDashboardSaga.umpireListDashboardSaga)
  ///Update Action Box
  yield takeEvery(ApiConstants.API_UMPIRE_IMPORT_LOAD, umpireDashboardSaga.umpireImportSaga)
  //////assign umpire get list
  yield takeEvery(ApiConstants.API_GET_ASSIGN_UMPIRE_LIST_LOAD, assignUmpireSaga.getAssignUmpireListSaga)
  //////assign umpire get list
  yield takeEvery(ApiConstants.API_ASSIGN_UMPIRE_FROM_LIST_LOAD, assignUmpireSaga.assignUmpireSaga)
  /////unassign umpire from the match(delete)
  yield takeEvery(ApiConstants.API_UNASSIGN_UMPIRE_FROM_LIST_LOAD, assignUmpireSaga.unassignUmpireSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_LOAD, liveScoreUmpiresImportSaga)
  //////////////////////registration main dashboard listing owned and participate registration
  yield takeEvery(ApiConstants.API_GET_REGISTRATION_MAIN_DASHBOARD_LISTING_LOAD, registrationMainDashboardListSaga)
  yield takeEvery(ApiConstants.API_YEAR_AND_QUICK_COMPETITION_LOAD, competitionQuickSaga.getquickYearAndCompetitionListSaga)
  ////////////////post/save quick competition division
  yield takeEvery(ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_LOAD, competitionQuickSaga.saveQuickCompDivisionSaga)
  /// create quick competition 
  yield takeEvery(ApiConstants.API_CREATE_QUICK_COMPETITION_LOAD, competitionQuickSaga.createQuickComptitionSaga)
  yield takeEvery(ApiConstants.API_GET_QUICK_COMPETITION_LOAD, competitionQuickSaga.getQuickComptitionSaga)
  // quick competition time slot
  yield takeEvery(ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_LOAD, competitionQuickSaga.quickcompetitoTimeSlotsPostApi)
  //////update quick competition
  yield takeEvery(ApiConstants.API_UPDATE_QUICK_COMPETITION_LOAD, competitionQuickSaga.updateQuickCompetitionSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_LOAD, liveScoreAddEditIncidentSaga)
  yield takeEvery(ApiConstants.API_LIVE_SCORE_INCIDENT_TYPE_LOAD, liveScoreIncidentTypeSaga)
  yield takeEvery(ApiConstants.QUICKCOMP_IMPORT_DATA_LOAD, competitionQuickSaga.quickCompetitionPlayer)

  // Get match sheet upload
  yield takeEvery(ApiConstants.API_MATCH_SHEET_PRINT_LOAD, liveScoreMatchSheetSaga.liveScoreMatchSheetPrintSaga)

  // Get match sheet download
  yield takeEvery(ApiConstants.API_MATCH_SHEET_DOWNLOADS_LOAD, liveScoreMatchSheetSaga.liveScoreMatchSheetDownloadSaga)

  yield takeEvery(ApiConstants.API_LADDER_ADJUSTMENT_POST_LOAD, ladderAdjustmentPostSaga)
  yield takeEvery(ApiConstants.API_LADDER_ADJUSTMENT_GET_LOAD, ladderAdjustmentGetSaga)


  // Organisation charity update API

  // Organisation terms and conditions update API
  yield takeEvery(ApiConstants.API_COMPETITION_STATUS_UPDATE_LOAD, updateCompetitionStatusSaga)

  // Competition Active Draws rounds
  yield takeEvery(ApiConstants.API_GET_DRAWS_ACTIVE_ROUNDS_LOAD, getActiveDrawsRoundsSaga)

  // Check venue address duplication
  // yield takeEvery(ApiConstants.API_VENUE_ADDRESS_CHECK_DUPLICATION_LOAD, checkVenueAddressDuplicationSaga);

  // Umpire Round Saga
  yield takeEvery(ApiConstants.API_UMPIRE_ROUND_LIST_LOAD, umpireDashboardSaga.umpireRoundListSaga)
  yield takeEvery(ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_LOAD, getInnerHorizontalCompSaga)

  // Add quick competition venue
  yield takeEvery(ApiConstants.API_QUICK_COMPETITION_ADDVENUE_LOAD, competitionQuickSaga.quickCompetitionAddVenueSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_POSITION_TRACKING_LOAD, liveScorePositionTrackSaga)

  yield takeEvery(ApiConstants.API_GET_MERGE_COMPETITION_LOAD, competitionQuickSaga.getMergeCompetitionSaga)

  yield takeEvery(ApiConstants.API_VALIDATE_MERGE_COMPETITION_LOAD, competitionQuickSaga.validateMergeCompetitionSaga)

  yield takeEvery(ApiConstants.API_MERGE_COMPETITION_PROCESS_LOAD, competitionQuickSaga.mergeCompetitionProceedSaga)
  ////Competition Delete 
  yield takeEvery(ApiConstants.API_COMPETITION_DASHBOARD_DELETE_LOAD, competitionDashboardDeleteSaga)

  yield takeEvery(ApiConstants.API_GET_TEAM_REGISTRATIONS_DATA_LOAD, getTeamRegistrationsSaga);

  yield takeEvery(ApiConstants.API_CHANGE_DATE_RANGE_GET_VENUE_DIVISIONS_LOAD, getVenueAndDivisionSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_RESET_LADDER_LOAD, liveScoreResetLadderSaga);
}

