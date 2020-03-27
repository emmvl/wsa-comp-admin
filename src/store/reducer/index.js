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
import LiveScoreVenueChangeState from './liveScoreReducer/liveScoreVenueChangeReducer'


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
  LiveScoreVenueChangeState
});

export default rootReducer;
