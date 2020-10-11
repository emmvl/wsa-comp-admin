import React from "react";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";

import PrivateRoute from "../util/protectedRoute";
import ProductAdd from "../components/registration/productAdd";
import Dashboard from "../components/dashboard";
import Registration from "../components/registration/registration";
import ProductAddRegistration from "../components/registration/productAddRegistration";
import ProductRegistrationClub from "../components/registration/productRegistrationClub";
import RegistrationCompetitionForm from "../components/competition/registrationCompetitionForm";
import CompetitionOpenRegForm from "../components/competition/competitionOpenRegForm";
import CompetitionFormat from "../components/competition/competitionFormat";
import CompetitionFinals from "../components/competition/competitionFinals";
import CompetitionLadder from "../components/competition/competitionLadder";
import CompetitionCourtAndTimesAssign from "../components/competition/competitionCourtAndTimesAssign";
import UserDashboard from "../components/user/userDashboard";
import CompetitionVenueAndCourts from "../components/competition/competitionVenueAndCourts";
import CompetitionReplicate from "../components/competition/competitionReplicate";
import CompetitionVenueAndTimesAdd from "../components/competition/competitionVenueAndTimesAdd";
import CompetitionVenueAndTimesEdit from "../components/competition/competitionVenueAndTimesEdit";
import CompetitionVenueTimesPrioritisation from "../components/competition/competitionVenueTimesPrioritisation";
import CompetitionReGrading from "../components/competition/competitionReGrading";
import CompetitionReGradingStep2 from "../components/competition/competitionReGradingStep2";
import CompetitionDashboard from "../components/competition/competitionDashboard";
import CompetitionPlayerGrades from "../components/competition/competitionPlayerGrades";
import CompetitionPlayerGradeCalculate from "../components/competition/competitionPlayerGradeCalculate";
import CompetitionProposedTeamGrading from "../components/competition/competitionProposedTeamGrading";
import CompetitionPartPlayerGrades from "../components/competition/competitionPartPlayerGrades";
import CompetitionPartPlayerGradeCalculate from "../components/competition/competitionPartPlayerGradeCalculate";
import CompetitionPartProposedTeamGrading from "../components/competition/competitionPartProposedTeamGrading";
import QuickCompetitionInvitations from "../components/competition/competitionQuickCompetitionInvitations";
import QuickCompetitionMatchFormat from "../components/competition/competitionQuickCompetitionMatchFormat";
import CompetitionPartTeamGradeCalculate from "../components/competition/competitionPartTeamGradeCalculate";
import RegistrationList from "../components/registration/registrationList";
import LiveScorePlayerProfile from "../components/liveScore/liveScorePlayerProfile";
import RegistrationPayments from "../components/registration/registrationPayments";
import HomeDashboard from "../components/home/homeDashboard";
import CompetitionDraws from "../components/competition/competitionDraws";
import CompetitionDrawEdit from "../components/competition/competitionDrawEditNew";
import UmpireAllocation from "../components/umpire/umpireAllocation";
import CompetitionFixtures from "../components/competition/competitionFixtures";
import CompetitionQuickCompetition from "../components/competition/competitionQuickCompetition";
import RegistrationForm from "../components/registration/registrationForm";
import RegistrationMembershipFee from "../components/registration/registrationMembershipFee";
import RegistrationCompetitionFee from "../components/registration/registrationCompetitionFee";
import UserAffiliatesList from "../components/user/userAffiliatesList";
import AffiliateDirectory from "../components/user/affiliateDirectory";
import UserAffiliateApproveRejectForm from "../components/user/userAffiliateApproveRejectForm";
import UserAddAffiliates from "../components/user/userAddAffiliates";
import UserEditAffiliates from "../components/user/userEditAffiliates";
import UserOurOragnization from "../components/user/userOurOragnization";
import UserTextualDashboard from "../components/user/userTextualDashboard";
import UserModulePersonalDetail from "../components/user/userModulePersonalDetail";
import UserProfileEdit from "../components/user/userProfileEdit"
import VenuesList from '../components/user/venuesList';
import AppRegistrationForm from "../components/registration/appRegistrationForm";
import NotFound from "./404";
import RegistrationMembershipList from "../components/registration/registrationMembershipList";
import RegistrationCompetitionList from "../components/registration/registrationCompetitionList";
import RegistrationFormList from "../components/registration/registrationFormList"
import CompetitionPlayerImport from "../components/competition/competitionPlayerImport";
import CompetitionTeamImport from "../components/competition/competitionTeamImport";
import PlayWithFriend from "../components/user/playWithFriend";
import ReferFriend from "../components/user/referFriend";
/////
import LiveScoreDashboard from "../components/liveScore/liveScoreDashboard"
import LiveScoreMatches from "../components/liveScore/liveScoreMatches";
import LiveScoreMatchDetails from "../components/liveScore/liveScoreMatchDetails"
import LiveScoreAddMatch from "../components/liveScore/liveScoreAddMatch"
import LiveScorerList from "../components/liveScore/liveScorerList"
import LiveScoreAddScorer from "../components/liveScore/liveScoreAddScorer"
import LiveScoreTeam from "../components/liveScore/liveScoreTeams"
import LiveScoreAddTeam from "../components/liveScore/liveScoreAddTeam"
import LiveScoreManagerList from "../components/liveScore/liveScoreManagers"
import LiveScoreAddManager from "../components/liveScore/liveScoreAddManagers"
import LiveScoreManagerImport from "../components/liveScore/liveScoreManagerImport"
import LiveScoreManagerView from "../components/liveScore/liveScoreManagerView"
import LiveScoreTeamView from "../components/liveScore/liveScoreTeamView"
import LiveScorerView from "../components/liveScore/liveScorerView"
import LiveScoreMatchImport from "../components/liveScore/liveScoreMatchImport"
import LiveScoreTeamImport from "../components/liveScore/liveScoreTeamImport"
import LiveScoreUmpireList from "../components/liveScore/liveScoreUmpireList"
import LiveScoreLadderList from "../components/liveScore/liveScoreLadderList"
import LiveScorePlayerList from "../components/liveScore/liveScorePlayerList"
import LiveScorerPlayerImport from "../components/liveScore/liveScorePlayerImport"
import LiveScoreAddPlayer from "../components/liveScore/liveScoreAddPlayer"
import LiveScorePlayerView from "../components/liveScore/liveScorePlayerView"
import LiveScoreIncidentView from "../components/liveScore/liveScoreIncidentView"
import LiveScoreIncidentList from "../components/liveScore/liveScoreIncidentList"
import LiveScoreNewsList from "../components/liveScore/liveScoreNewsList"
import LiveScoreAddNews from "../components/liveScore/liveScoreAddNews"
import LiveScoreNewsView from "../components/liveScore/liveScoreNewsView"
import LiveScoreSettingsView from "../components/liveScore/liveScoreSettingsView"
import LiveScoreBanners from "../components/liveScore/liveScoreBanners"
import LiveScoreTeamAttendance from "../components/liveScore/liveScoreTeamAttendance"
import LiveScoreGameTimeList from "../components/liveScore/liveScoreGameTimeList"
import LiveScoreGoalsList from "../components/liveScore/liveScoreGoalsList"
import LiveScoreCompetitions from "../components/liveScore/liveScoreCompetitions"
import LiveScoreBulkChange from "../components/liveScore/liveScoreBulkChange"
import LiveScoreEditBanners from "../components/liveScore/liveScoreEditBanners"
import LiveScoreDivisionList from "../components/liveScore/liveScoreDivisionList"
import LiveScoreAddDivision from '../components/liveScore/liveScoreAddDivision'
import LiveScoreAddIncident from "../components/liveScore/liveScoreAddInicident"
import LiveScoreLadderSettings from '../components/liveScore/liveScoreLadderSettings'
import LiveScoreDivisionImport from '../components/liveScore/liveScoreDivisionImport'
import userModuleMedical from "../components/user/userModuleMedical";
import LiveScoreAssignMatch from "../components/liveScore/liveScoreAssignMatches"
import LiveScoreVenueChange from '../components/liveScore/liveScoreVenueChange'
import LiveScoreIncidentImport from '../components/liveScore/liveScoreIncidentImport'
import LiveScorePublicLadder from '../components/liveScore/liveScorePublicLadder'

import LiveScoreSeasonFixture from "../components/liveScore/liveScoreSeasonFixture"
import RegistrationInvoice from "../components/registration/registrationInvoice"
import Stripe from "../components/stripe/stripe";
import RegistrationSettlements from "../components/registration/registrationSettlements";
import RegistrationPayoutTransaction from "../components/registration/registrationPayoutTransactions";

import LiveScoreCoaches from "../components/liveScore/liveScoreCoaches";
import LiveScoreAddEditCoach from "../components/liveScore/liveScoreAddEditCoach";
import CompetitionException from "../components/competition/comeptitionException";
import LiveScorerCoachImport from "../components/liveScore/liveScoreCoachImport";

import LiveScoreSocialSheet from "../components/liveScore/liveScoreSocialSheet"
import UmpireDashboard from "../components/umpire/umpireDashboard"
import AddUmpire from "../components/umpire/addUmpire"

import LiveScoreMatchSheet from "../components/liveScore/liveScoreMatchSheet";
import ShopDashboard from "../components/shop/shopDashboard";
import UmpireRoaster from "../components/umpire/umpireRoaster"
import UmpireImport from "../components/umpire/umpireImport"
import Umpire from "../components/umpire/umpire"
import ListProducts from "../components/shop/listProducts";
import AddProduct from "../components/shop/addProduct";
import PaymentDashboard from "../components/registration/paymentDashboard"

import OrderSummary from "../components/shop/orderSummary"
import ShopOrderStatus from "../components/shop/shopOrderStatus"
import ShopSettings from '../components/shop/shopSettings'
import AssignUmpire from "../components/umpire/assignUmpire";
import UmpireSetting from "../components/umpire/umpireSetting";
import UmpireDivisions from "../components/umpire/umpireDivisions"
import UmpirePoolAllocation from "../components/umpire/umpirePoolAllocation"
import LiveScoreUmpireImport from "../components/liveScore/liveScoreUmpireImport"
import RegistrationMainDashboard from "../components/registration/registrationMainDashboard"

import LiveScoreLadderAdjustment from "../components/liveScore/liveScoreLadderAdjustment";
import LiveScorePositionTrackReport from "../components/liveScore/liveScorePositionTrackReport";

import Account from "./Account";
import HelpAndSupport from "./Support";
import RegistrationChange from "../components/registration/registrationChange";
import MultifieldDraws from "../components/competition/multifieldDraws";
import RegistrationChangeReview from "../components/registration/registrationChangeReview"
import TeamRegistrations from "../components/registration/teamRegistrations"

import lazyLoad from "../components/lazyLoad";

import UmpirePayment from "../components/umpire/umpirePayments"
import UmpirePaymentSetting from "../components/umpire/umpirePaymentSettings"
import UmpirePayout from "../components/umpire/umpirePayout"
import OrderDetails from "../components/shop/orderDetails";
import deRegistration from "components/registration/deRegistration";
import MultifieldDrawsNew from "../components/competition/multiFieldDrawsNew";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/homeDashboard" />} />
        <PrivateRoute path="/dashboard" component={lazyLoad(Dashboard)} />
        <PrivateRoute path="/productAdd" component={lazyLoad(ProductAdd)} />
        <PrivateRoute path="/registration" component={lazyLoad(Registration)} />
        <PrivateRoute
          path="/productAddRegistration"
          component={lazyLoad(ProductAddRegistration)}
        />
        <PrivateRoute
          path="/productRegistrationClub"
          component={lazyLoad(ProductRegistrationClub)}
        />
        <PrivateRoute
          path="/registrationCompetitionForm"
          component={lazyLoad(RegistrationCompetitionForm)}
        />
        <PrivateRoute
          path="/competitionOpenRegForm"
          component={lazyLoad(CompetitionOpenRegForm)}
        />
        <PrivateRoute
          path="/competitionFormat"
          component={lazyLoad(CompetitionFormat)}
        />
        <PrivateRoute
          path="/competitionFinals"
          component={lazyLoad(CompetitionFinals)}
        />
        <PrivateRoute
          path="/competitionLadder"
          component={lazyLoad(CompetitionLadder)}
        />
        <PrivateRoute
          path="/competitionCourtAndTimesAssign"
          component={lazyLoad(CompetitionCourtAndTimesAssign)}
        />
        <PrivateRoute
          path="/userGraphicalDashboard"
          component={lazyLoad(UserDashboard)}
        />
        <PrivateRoute
          path="/userTextualDashboard"
          component={lazyLoad(UserTextualDashboard)}
        />
        <PrivateRoute
          path="/userPersonal"
          component={lazyLoad(UserModulePersonalDetail)}
        />

        <PrivateRoute
          path="/userMedical"
          component={lazyLoad(userModuleMedical)}
        />

        <PrivateRoute
          path="/competitionVenueAndCourts"
          component={lazyLoad(CompetitionVenueAndCourts)}
        />
        <PrivateRoute
          path="/competitionReplicate"
          component={lazyLoad(CompetitionReplicate)}
        />
        <PrivateRoute
          path="/liveScoreMatchSheet"
          component={lazyLoad(LiveScoreMatchSheet)}
        />
        <PrivateRoute
          path="/competitionVenueAndTimesAdd"
          component={lazyLoad(CompetitionVenueAndTimesAdd)}
        />
        <PrivateRoute
          path="/competitionVenueAndTimesEdit"
          component={lazyLoad(CompetitionVenueAndTimesEdit)}
        />
        <PrivateRoute
          path="/competitionVenueTimesPrioritisation"
          component={lazyLoad(CompetitionVenueTimesPrioritisation)}
        />
        <PrivateRoute
          path="/competitionReGrading"
          component={lazyLoad(CompetitionReGrading)}
        />
        <PrivateRoute
          path="/competitionReGradingStep2"
          component={lazyLoad(CompetitionReGradingStep2)}
        />
        <PrivateRoute
          path="/competitionDashboard"
          component={lazyLoad(CompetitionDashboard)}
        />
        <PrivateRoute
          path="/competitionPlayerGrades"
          component={lazyLoad(CompetitionPlayerGrades)}
        />
        <PrivateRoute
          path="/competitionProposedTeamGrading"
          component={lazyLoad(CompetitionProposedTeamGrading)}
        />
        <PrivateRoute
          path="/competitionPlayerGradeCalculate"
          component={lazyLoad(CompetitionPlayerGradeCalculate)}
        />
        <PrivateRoute
          path="/competitionPartPlayerGrades"
          component={lazyLoad(CompetitionPartPlayerGrades)}
        />
        <PrivateRoute
          path="/competitionPartPlayerGradeCalculate"
          component={lazyLoad(CompetitionPartPlayerGradeCalculate)}
        />
        <PrivateRoute
          path="/competitionPartProposedTeamGrading"
          component={lazyLoad(CompetitionPartProposedTeamGrading)}
        />
        <PrivateRoute
          path="/quickCompetitionInvitations"
          component={lazyLoad(QuickCompetitionInvitations)}
        />
        <PrivateRoute
          path="/quickCompetitionMatchFormat"
          component={lazyLoad(QuickCompetitionMatchFormat)}
        />
        <PrivateRoute
          path="/competitionPartTeamGradeCalculate"
          component={lazyLoad(CompetitionPartTeamGradeCalculate)}
        />
        <PrivateRoute
          path="/registrationList"
          component={lazyLoad(RegistrationList)}
        />
        <PrivateRoute
          path="/liveScorePlayerProfile"
          component={lazyLoad(LiveScorePlayerProfile)}
        />
        <PrivateRoute
          path="/registrationPayments"
          component={lazyLoad(RegistrationPayments)}
        />
        <PrivateRoute
          path="/homeDashboard"
          component={lazyLoad(HomeDashboard)}
        />
        <PrivateRoute
          path="/competitionDraws"
          component={lazyLoad(MultifieldDrawsNew)}
        />
        <PrivateRoute
          path="/competitionDrawEdit"
          component={lazyLoad(CompetitionDrawEdit)}
        />
        <PrivateRoute
          path="/umpireAllocation"
          component={lazyLoad(UmpireAllocation)}
        />
        <PrivateRoute
          path="/competitionFixtures"
          component={lazyLoad(CompetitionFixtures)}
        />
        <PrivateRoute
          path="/quickCompetition"
          component={lazyLoad(CompetitionQuickCompetition)}
        />
        <PrivateRoute
          path="/registrationForm"
          component={lazyLoad(RegistrationForm)}
        />
        <PrivateRoute
          path="/registrationMembershipFee"
          component={lazyLoad(RegistrationMembershipFee)}
        />
        <PrivateRoute
          path="/registrationCompetitionFee"
          component={lazyLoad(RegistrationCompetitionFee)}
        />
        <PrivateRoute
          path="/userAffiliatesList"
          component={lazyLoad(UserAffiliatesList)}
        />
        <PrivateRoute
          path="/affiliateDirectory"
          component={lazyLoad(AffiliateDirectory)}
        />

        <PrivateRoute
          path="/userAffiliateApproveRejectForm"
          component={lazyLoad(UserAffiliateApproveRejectForm)}
        />
        <PrivateRoute
          path="/userAddAffiliates"
          component={lazyLoad(UserAddAffiliates)}
        />
        <PrivateRoute
          path="/userEditAffiliates"
          component={lazyLoad(UserEditAffiliates)}
        />
        <PrivateRoute
          path="/userOurOrganisation"
          component={lazyLoad(UserOurOragnization)}
        />
        <PrivateRoute
          path="/venuesList"
          component={lazyLoad(VenuesList)}
        />
        <PrivateRoute
          path="/appRegistrationForm"
          component={lazyLoad(AppRegistrationForm)}
        />
        <PrivateRoute
          path="/registrationMembershipList"
          component={lazyLoad(RegistrationMembershipList)}
        />
        <PrivateRoute
          path="/registrationCompetitionList"
          component={lazyLoad(RegistrationCompetitionList)}
        />

        <PrivateRoute
          path="/liveScoreDashboard"
          component={lazyLoad(LiveScoreDashboard)}
        />

        <PrivateRoute
          path="/liveScoreMatches"
          component={lazyLoad(LiveScoreMatches)}
        />

        <PrivateRoute
          path="/liveScoreMatchDetails"
          component={lazyLoad(LiveScoreMatchDetails)}
        />

        <PrivateRoute
          path="/liveScoreAddMatch"
          component={lazyLoad(LiveScoreAddMatch)}
        />

        <PrivateRoute
          path="/liveScorerList"
          component={lazyLoad(LiveScorerList)}
        />

        <PrivateRoute
          path="/liveScoreAddScorer"
          component={lazyLoad(LiveScoreAddScorer)}
        />

        <PrivateRoute
          path="/liveScoreTeam"
          component={lazyLoad(LiveScoreTeam)}
        />

        <PrivateRoute
          path="/liveScoreAddTeam"
          component={lazyLoad(LiveScoreAddTeam)}
        />

        <PrivateRoute
          path="/liveScoreManagerList"
          component={lazyLoad(LiveScoreManagerList)}
        />

        <PrivateRoute
          path="/liveScoreAddManagers"
          component={lazyLoad(LiveScoreAddManager)}
        />

        <PrivateRoute
          path="/liveScoreManagerImport"
          component={lazyLoad(LiveScoreManagerImport)}
        />

        <PrivateRoute
          path="/liveScoreManagerView"
          component={lazyLoad(LiveScoreManagerView)}
        />

        <PrivateRoute
          path="/liveScoreTeamView"
          component={lazyLoad(LiveScoreTeamView)}
        />

        <PrivateRoute
          path="/liveScorerView"
          component={lazyLoad(LiveScorerView)}
        />

        <PrivateRoute
          path="/liveScoreMatchImport"
          component={lazyLoad(LiveScoreMatchImport)}
        />

        <PrivateRoute
          path="/liveScoreTeamImport"
          component={lazyLoad(LiveScoreTeamImport)}
        />

        <PrivateRoute
          path="/liveScoreUmpireList"
          component={lazyLoad(LiveScoreUmpireList)}
        />

        <PrivateRoute
          path="/liveScoreLadderList"
          component={lazyLoad(LiveScoreLadderList)}
        />

        <PrivateRoute
          path="/liveScorePlayerList"
          component={lazyLoad(LiveScorePlayerList)}
        />

        <PrivateRoute
          path="/liveScorerPlayerImport"
          component={lazyLoad(LiveScorerPlayerImport)}
        />

        <PrivateRoute
          path="/liveScoreAddPlayer"
          component={lazyLoad(LiveScoreAddPlayer)}
        />

        <PrivateRoute
          path="/liveScorePlayerView"
          component={lazyLoad(LiveScorePlayerView)}
        />

        <PrivateRoute
          path="/liveScoreIncidentView"
          component={lazyLoad(LiveScoreIncidentView)}
        />

        <PrivateRoute
          path="/liveScoreIncidentList"
          component={lazyLoad(LiveScoreIncidentList)}
        />

        <PrivateRoute
          path="/liveScoreNewsList"
          component={lazyLoad(LiveScoreNewsList)}
        />

        <PrivateRoute
          path="/liveScoreAddNews"
          component={lazyLoad(LiveScoreAddNews)}
        />

        <PrivateRoute
          path="/liveScoreNewsView"
          component={lazyLoad(LiveScoreNewsView)}
        />

        <PrivateRoute
          path="/liveScoreSettingsView"
          component={lazyLoad(LiveScoreSettingsView)}
        />

        <PrivateRoute
          path="/liveScoreBanners"
          component={lazyLoad(LiveScoreBanners)}
        />

        <PrivateRoute
          path="/liveScoreTeamAttendance"
          component={lazyLoad(LiveScoreTeamAttendance)}
        />

        <PrivateRoute
          path="/liveScoreGameTimeList"
          component={lazyLoad(LiveScoreGameTimeList)}
        />

        <PrivateRoute
          path="/liveScoreGoalsList"
          component={lazyLoad(LiveScoreGoalsList)}
        />

        <PrivateRoute
          path="/liveScoreCompetitions"
          component={lazyLoad(LiveScoreCompetitions)}
        />

        <PrivateRoute
          path="/liveScoreBulkChange"
          component={lazyLoad(LiveScoreBulkChange)}
        />

        <PrivateRoute
          path="/liveScoreEditBanners"
          component={lazyLoad(LiveScoreEditBanners)}
        />

        <PrivateRoute
          path="/liveScoreDivisionList"
          component={lazyLoad(LiveScoreDivisionList)}
        />

        <PrivateRoute
          path="/liveScoreAddDivision"
          component={lazyLoad(LiveScoreAddDivision)}
        />

        <PrivateRoute
          path="/liveScoreAddIncident"
          component={lazyLoad(LiveScoreAddIncident)}
        />

        <PrivateRoute
          path="/liveScoreLadderSettings"
          component={lazyLoad(LiveScoreLadderSettings)}
        />

        <PrivateRoute
          path="/liveScoreDivisionImport"
          component={lazyLoad(LiveScoreDivisionImport)}
        />

        <PrivateRoute
          path="/liveScoreAssignMatch"
          component={lazyLoad(LiveScoreAssignMatch)}
        />

        <PrivateRoute
          path="/liveScoreVenueChange"
          component={lazyLoad(LiveScoreVenueChange)}
        />

        <PrivateRoute
          path="/registrationFormList"
          component={lazyLoad(RegistrationFormList)}
        />

        <PrivateRoute
          path="/liveScoreIncidentImport"
          component={lazyLoad(LiveScoreIncidentImport)}
        />

        <PrivateRoute
          path="/liveScorePublicLadder"
          component={lazyLoad(LiveScorePublicLadder)}
        />

        <PrivateRoute
          path="/competitionPlayerImport"
          component={lazyLoad(CompetitionPlayerImport)}
        />

        <PrivateRoute
          path="/competitionTeamsImport"
          component={lazyLoad(CompetitionTeamImport)}
        />

        <PrivateRoute
          path="/liveScoreSeasonFixture"
          component={lazyLoad(LiveScoreSeasonFixture)}
        />

        <PrivateRoute
          path="/playWithFriend"
          component={lazyLoad(PlayWithFriend)}
        />

        <PrivateRoute
          path="/referFriend"
          component={lazyLoad(ReferFriend)}
        />

        <PrivateRoute
          path="/invoice"
          component={lazyLoad(RegistrationInvoice)}
        />

        <PrivateRoute
          path="/checkoutPayment"
          component={lazyLoad(Stripe)}
        />

        <PrivateRoute
          path="/registrationSettlements"
          component={lazyLoad(RegistrationSettlements)}
        />

        <PrivateRoute
          path="/registrationPayoutTransaction"
          component={lazyLoad(RegistrationPayoutTransaction)}
        />

        <PrivateRoute
          path="/liveScoreCoaches"
          component={lazyLoad(LiveScoreCoaches)}
        />

        <PrivateRoute
          path="/liveScoreAddEditCoach"
          component={lazyLoad(LiveScoreAddEditCoach)}
        />

        <PrivateRoute
          path="/competitionException"
          component={lazyLoad(CompetitionException)}
        />

        <PrivateRoute
          path="/liveScoreCoachImport"
          component={lazyLoad(LiveScorerCoachImport)}
        />

        <PrivateRoute
          path="/liveScoreSocialSheet"
          component={lazyLoad(LiveScoreSocialSheet)}
        />

        <PrivateRoute
          path="/umpireDashboard"
          component={lazyLoad(UmpireDashboard)}
        />

        <PrivateRoute
          path="/addUmpire"
          component={lazyLoad(AddUmpire)}
        />

        <PrivateRoute
          path="/shopDashboard"
          component={lazyLoad(ShopDashboard)}
        />

        <PrivateRoute
          path="/umpireRoster"
          component={lazyLoad(UmpireRoaster)}
        />

        <PrivateRoute
          path="/umpireImport"
          component={lazyLoad(UmpireImport)}
        />

        <PrivateRoute
          path="/umpire"
          component={lazyLoad(Umpire)}
        />

        <PrivateRoute
          path="/listProducts"
          component={lazyLoad(ListProducts)}
        />

        <PrivateRoute
          path="/addProduct"
          component={lazyLoad(AddProduct)}
        />

        <PrivateRoute
          path="/paymentDashboard"
          component={lazyLoad(PaymentDashboard)}
        />

        <PrivateRoute
          path="/orderSummary"
          component={lazyLoad(OrderSummary)}
        />

        <PrivateRoute
          path="/orderStatus"
          component={lazyLoad(ShopOrderStatus)}
        />

        <PrivateRoute
          path="/shopSettings"
          component={lazyLoad(ShopSettings)}
        />

        <PrivateRoute
          path="/userProfileEdit"
          component={lazyLoad(UserProfileEdit)}
        />

        <PrivateRoute
          path="/assignUmpire"
          component={lazyLoad(AssignUmpire)}
        />

        <PrivateRoute
          path="/umpireSetting"
          component={lazyLoad(UmpireSetting)}
        />

        <PrivateRoute
          path="/umpireDivisions"
          component={lazyLoad(UmpireDivisions)}
        />

        <PrivateRoute
          path="/umpirePoolAllocation"
          component={lazyLoad(UmpirePoolAllocation)}
        />

        <PrivateRoute
          path="/liveScoreUmpireImport"
          component={lazyLoad(LiveScoreUmpireImport)}
        />

        <PrivateRoute
          path="/registrationDashboard"
          component={lazyLoad(RegistrationMainDashboard)}
        />

        <PrivateRoute
          path="/liveScoreLadderAdjustment"
          component={lazyLoad(LiveScoreLadderAdjustment)}
        />

        <PrivateRoute
          path="/liveScorePositionTrackReport"
          component={lazyLoad(LiveScorePositionTrackReport)}
        />

        <PrivateRoute
          path="/registrationChange"
          component={lazyLoad(RegistrationChange)}
        />

        <PrivateRoute
          path="/multifieldDraws"
          component={lazyLoad(MultifieldDraws)}
        />

        <PrivateRoute path="/account" component={lazyLoad(Account)} />
        <PrivateRoute path="/support" component={lazyLoad(HelpAndSupport)} />
        <PrivateRoute path="/registrationChangeReview" component={lazyLoad(RegistrationChangeReview)} />
        <PrivateRoute path='/teamRegistrations' component={lazyLoad(TeamRegistrations)} />

        <PrivateRoute
          path="/umpirePayment"
          component={lazyLoad(UmpirePayment)}
        />

        <PrivateRoute
          path="/umpirePaymentSetting"
          component={lazyLoad(UmpirePaymentSetting)}
        />

        <PrivateRoute
          path="/umpirePayout"
          component={lazyLoad(UmpirePayout)}
        />

        <PrivateRoute
          path="/orderDetails"
          component={lazyLoad(OrderDetails)}
        />
        <PrivateRoute
          path="/deregistration"
          component={lazyLoad(deRegistration)}
        />

        <PrivateRoute
          path="/multiDraws"
          component={lazyLoad(CompetitionDraws)}
        />
        <Route path="/" component={lazyLoad(NotFound)} />

        <Redirect from="*" to="/404" />
      </Switch>
    );
  }
}

export default Routes;
