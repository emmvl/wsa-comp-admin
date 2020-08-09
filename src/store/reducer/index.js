import { combineReducers } from "redux";
import LoginState from "./authenticationReducer";
import MenuNavigationState from "./menuNavigationReducer";
import RegistrationState from "./registrationReducer/registrationReducer";
import AppState from "./appReducer";
////*****************Live Score**************************Start////
import LiveScorePlayerState from "./liveScoreReducer/liveScorePlayerReducer";
import LiveScoreMatchState from "./liveScoreReducer/liveScoreMatchReducer";
import LiveScoreLadderState from './liveScoreReducer/liveScoreLadderReducer'
import LiveScoreState from './liveScoreReducer/liveScoreReducer';
import LiveScoreTeamState from './liveScoreReducer/liveScoreTeamreducer';
import LiveScoreIncidentState from './liveScoreReducer/liveScoreIncidentReducer';
import LiveScoreNewsState from './liveScoreReducer/liveScoreNewsReducer';
import LiveScoreBannerState from './liveScoreReducer/liveScoreBannerReducer';
import LiveScoreRoundState from './liveScoreReducer/liveScoreRound';
import CompetitionFeesState from './registrationReducer/competitionFeeReducer';
import LiveScoreGoalState from './liveScoreReducer/liveScoreGoalReducer'
import LiveScoreBulkMatchState from './liveScoreReducer/liveScoreBulkMatchReducer'
import LiveScoreMangerState from './liveScoreReducer/liveScoreManagerReducer'
import LiveScoreScorerState from './liveScoreReducer/liveScoreScorerReducer'
import LiveScoreDashboardState from './liveScoreReducer/liveScoreDashboardReducer'
////*****************Live Score**************************End////

import CompetitionDashboardState from './competitionManagementReducer/competitionDashboard'
import CompetitionModuleState from './competitionManagementReducer/competitionModuleReducer'
import liveScoreCompetition from './liveScoreReducer/liveScoreCompetitionReducer';
import CompetitionManagementState from './competitionManagementReducer/competitionManagement';
////Year and Competition
import CommonAppState from './appReducer'
import CompetitionFormatState from './competitionManagementReducer/competitionFormatReducer';
import CompetitionFinalsState from './competitionManagementReducer/competitionFinalsReducer';
import LadderFormatState from './competitionManagementReducer/ladderFormatReducer';
import CompetitionTimeSlots from "./competitionManagementReducer/competitionTimeAndSlotsReducer";
import CommonReducerState from "./commonReducer/commonReducer";
import VenueTimeState from './competitionManagementReducer/venueTimeReducer';
import CompetitionPartPlayerGradingState from "./competitionManagementReducer/competitionPartPlayerGradingReducer";
import CompetitionOwnTeamGradingState from "./competitionManagementReducer/competitionTeamGradingReducer";
import CompetitionDrawsState from "./competitionManagementReducer/competitionDrawsReducer";
import EndUserRegistrationState from "./registrationReducer/endUserRegistrationReducer";
import DivisionState from "./liveScoreReducer/liveScoreDivisionReducer"
import UserState from "./userReducer/userReducer";
import LiveScoreDivisionState from "./liveScoreReducer/liveScoreDivisionReducer"
//liveScoreGameTimeStatisticsState
import LiveScoreGameTimeStatisticsState from './liveScoreReducer/liveScoreGameTimeStatisticsReducer'
import LiveScoreSetting from './liveScoreReducer/liveScoreSettingReducer';
import LiveScoreUmpiresState from './liveScoreReducer/liveScoreUmpiresReducer'
import LiveScoreTeamAttendanceState from './liveScoreReducer/liveScoreTeamAttendanceReducer';
import LiveScoreVenueChangeState from './liveScoreReducer/liveScoreVenueChangeReducer';
import RegistrationDashboardState from "./registrationReducer/registrationDashboardReducer"
import LadderSettingState from './liveScoreReducer/liveScoreLadderSettingReducer'
import HomeDashboardState from './homeReducer/homeReducer'
import LiveScoreFixturCompState from './liveScoreReducer/liveScoreFixtureCompetitionReducer';
import StripeState from "./stripeReducer/stripeReducer";
import QuickCompetitionState from "./competitionManagementReducer/competitionQuickCompetitionReducer"

import LiveScoreCoachState from "./liveScoreReducer/liveScoreCoachReducer"

import LiveScoreMatchSheetState from "./liveScoreReducer/liveScoreMatchSheet"
import ShopProductState from "./shopReducer/productReducer"

//// Umpire Module
import UmpireDashboardState from "./umpireReducer/umpireDashboardReducer"
import UmpireCompetitionState from "./umpireReducer/umpireCompetitionReducer"
import UmpireRoasterdState from "./umpireReducer/umpireRoasterReducer"
import UmpireState from "./umpireReducer/umpireReducer"
import AssignUmpireState from "./umpireReducer/assignUmpireReducer";
import UmpireSettingState from "./umpireReducer/umpireSettingReducer"
import RegistrationChangeState from "./registrationReducer/registrationChangeReducer";
import ShopSettingState from "./shopReducer/shopSettingReducer";

import InnerHorizontalState from './liveScoreReducer/liveScoreInnerHorizontalReducer'

import LiveScorePositionTrackState from './liveScoreReducer/liveScorePositionTrackReducer'
import ShopOrderSummaryState from './shopReducer/orderSummaryReducer';

const rootReducer = combineReducers({
  LoginState,
  MenuNavigationState,
  RegistrationState,
  AppState,
  LiveScorePlayerState,
  LiveScoreMatchState,
  LiveScoreLadderState,
  LiveScoreState,
  LiveScoreTeamState,
  LiveScoreIncidentState,
  LiveScoreNewsState,
  LiveScoreBannerState,
  LiveScoreRoundState,
  CompetitionFeesState,
  LiveScoreGoalState,
  LiveScoreMangerState,
  LiveScoreScorerState,
  LiveScoreBulkMatchState,
  CompetitionDashboardState,
  CompetitionModuleState,
  CommonAppState,
  CompetitionFormatState,
  CompetitionFinalsState,
  LadderFormatState,
  CompetitionTimeSlots,
  CommonReducerState,
  VenueTimeState,
  CompetitionPartPlayerGradingState,
  CompetitionOwnTeamGradingState,
  CompetitionDrawsState,
  LiveScoreDashboardState,
  UserState,
  EndUserRegistrationState,
  DivisionState,
  liveScoreCompetition,
  LiveScoreDivisionState,
  LiveScoreGameTimeStatisticsState,
  LiveScoreSetting,
  LiveScoreUmpiresState,
  LiveScoreTeamAttendanceState,
  LiveScoreVenueChangeState,
  RegistrationDashboardState,
  LadderSettingState,
  HomeDashboardState,
  LiveScoreFixturCompState,
  StripeState,
  QuickCompetitionState,
  LiveScoreCoachState,
  LiveScoreMatchSheetState,
  CompetitionManagementState,
  ShopProductState,
  UmpireDashboardState,
  UmpireCompetitionState,
  UmpireRoasterdState,
  UmpireState,
  AssignUmpireState,
  UmpireSettingState,
  RegistrationChangeState,
  ShopSettingState,
  InnerHorizontalState,
  LiveScorePositionTrackState,
  ShopOrderSummaryState,
});

export default rootReducer;
