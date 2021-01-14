import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from 'util/protectedRoute';
import { getUserRoleId } from 'util/permissions';

import lazyLoad from 'components/lazyLoad';

import Dashboard from 'components/dashboard';
import HomeDashboard from 'components/home/homeDashboard';

import CompetitionCourtAndTimesAssign from 'components/competition/competitionCourtAndTimesAssign';
import CompetitionDashboard from 'components/competition/competitionDashboard';
import CompetitionDraws from 'components/competition/competitionDraws';
import CompetitionDrawEdit from 'components/competition/competitionDrawEditNew';
import CompetitionException from 'components/competition/comeptitionException';
import CompetitionFinals from 'components/competition/competitionFinals';
import CompetitionFixtures from 'components/competition/competitionFixtures';
import CompetitionFormat from 'components/competition/competitionFormat';
import CompetitionLadder from 'components/competition/competitionLadder';
import CompetitionOpenRegForm from 'components/competition/competitionOpenRegForm';
import CompetitionPartPlayerGradeCalculate from 'components/competition/competitionPartPlayerGradeCalculate';
import CompetitionPartPlayerGrades from 'components/competition/competitionPartPlayerGrades';
import CompetitionPartProposedTeamGrading from 'components/competition/competitionPartProposedTeamGrading';
import CompetitionPartTeamGradeCalculate from 'components/competition/competitionPartTeamGradeCalculate';
import CompetitionPlayerGradeCalculate from 'components/competition/competitionPlayerGradeCalculate';
import CompetitionPlayerGrades from 'components/competition/competitionPlayerGrades';
import CompetitionPlayerImport from 'components/competition/competitionPlayerImport';
import CompetitionProposedTeamGrading from 'components/competition/competitionProposedTeamGrading';
import CompetitionQuickCompetition from 'components/competition/competitionQuickCompetition';
import CompetitionQuickCompetitionInvitations from 'components/competition/competitionQuickCompetitionInvitations';
import CompetitionQuickCompetitionMatchFormat from 'components/competition/competitionQuickCompetitionMatchFormat';
import CompetitionReGrading from 'components/competition/competitionReGrading';
import CompetitionReGradingStep2 from 'components/competition/competitionReGradingStep2';
import CompetitionReplicate from 'components/competition/competitionReplicate';
import CompetitionTeamImport from 'components/competition/competitionTeamImport';
import CompetitionVenueAndCourts from 'components/competition/competitionVenueAndCourts';
import CompetitionVenueAndTimesAdd from 'components/competition/competitionVenueAndTimesAdd';
import CompetitionVenueAndTimesEdit from 'components/competition/competitionVenueAndTimesEdit';
import CompetitionVenueTimesPrioritisation from 'components/competition/competitionVenueTimesPrioritisation';
import MultiFieldDraws from 'components/competition/multiFieldDraws';
import MultiFieldDrawsNew from 'components/competition/multiFieldDrawsNew';
import MultiFieldDrawsNewTimeline from 'components/competition/multiFieldDrawsNewTimeline';
import RegistrationCompetitionForm from 'components/competition/registrationCompetitionForm';

import AppRegistrationForm from 'components/registration/appRegistrationForm';
import deRegistration from 'components/registration/deRegistration';
import PaymentDashboard from 'components/registration/paymentDashboard';
import ProductAdd from 'components/registration/productAdd';
import ProductAddRegistration from 'components/registration/productAddRegistration';
import ProductRegistrationClub from 'components/registration/productRegistrationClub';
import Registration from 'components/registration/registration';
import RegistrationChange from 'components/registration/registrationChange';
import RegistrationChangeReview from 'components/registration/registrationChangeReview';
import RegistrationCompetitionFee from 'components/registration/registrationCompetitionFee';
import RegistrationCompetitionList from 'components/registration/registrationCompetitionList';
import RegistrationForm from 'components/registration/registrationForm';
import RegistrationFormList from 'components/registration/registrationFormList';
import RegistrationInvoice from 'components/registration/registrationInvoice';
import RegistrationList from 'components/registration/registrationList';
import RegistrationMainDashboard from 'components/registration/registrationMainDashboard';
import RegistrationMembershipFee from 'components/registration/registrationMembershipFee';
import RegistrationMembershipList from 'components/registration/registrationMembershipList';
import RegistrationMembershipCap from 'components/registration/registrationMembershipCap';
import RegistrationPayments from 'components/registration/registrationPayments';
import RegistrationPayoutTransaction from 'components/registration/registrationPayoutTransactions';
import RegistrationSettlements from 'components/registration/registrationSettlements';
import RegistrationRefunds from 'components/registration/registrationRefunds';
import TeamRegistrations from 'components/registration/teamRegistrations';

import AddUmpire from 'components/umpire/addUmpire';
import AssignUmpire from 'components/umpire/assignUmpire';
import Umpire from 'components/umpire/umpire';
import UmpireAllocation from 'components/umpire/umpireAllocation';
import UmpireDashboard from 'components/umpire/umpireDashboard';
import UmpireDivisions from 'components/umpire/umpireDivisions';
import UmpireImport from 'components/umpire/umpireImport';
import UmpirePayment from 'components/umpire/umpirePayments';
import UmpirePaymentSetting from 'components/umpire/umpirePaymentSettings';
import UmpirePayout from 'components/umpire/umpirePayout';
import UmpirePoolAllocation from 'components/umpire/umpirePoolAllocation';
import UmpireRoster from 'components/umpire/umpireRoster';
import UmpireSetting from 'components/umpire/umpireSetting';

import AffiliateDirectory from 'components/user/affiliateDirectory';
import NetSetGo from 'components/user/netSetGo';
import PlayWithFriend from 'components/user/playWithFriend';
import ReferFriend from 'components/user/referFriend';
import Spectator from 'components/user/spectator';
import UserAddAffiliates from 'components/user/userAddAffiliates';
import UserAffiliateApproveRejectForm from 'components/user/userAffiliateApproveRejectForm';
import UserAffiliatesList from 'components/user/userAffiliatesList';
import UserDashboard from 'components/user/userDashboard';
import UserEditAffiliates from 'components/user/userEditAffiliates';
import userModuleMedical from 'components/user/userModuleMedical';
import UserModulePersonalDetail from 'components/user/userModulePersonalDetail';
import UserOurOrganization from 'components/user/userOurOragnization';
import UserProfileEdit from 'components/user/userProfileEdit';
import UserTextualDashboard from 'components/user/userTextualDashboard';
import VenuesList from 'components/user/venuesList';

import CommunicationBanner from 'components/communication/CommunicationBanner';
import CommunicationEditBanners from 'components/communication/CommunicationEditBanners';

import LiveScoreAddDivision from 'components/liveScore/liveScoreAddDivision';
import LiveScoreAddEditCoach from 'components/liveScore/liveScoreAddEditCoach';
import LiveScoreAddIncident from 'components/liveScore/liveScoreAddInicident';
import LiveScoreAddManager from 'components/liveScore/liveScoreAddManagers';
import LiveScoreAddMatch from 'components/liveScore/liveScoreAddMatch';
import LiveScoreAddNews from 'components/liveScore/liveScoreAddNews';
import LiveScoreAddPlayer from 'components/liveScore/liveScoreAddPlayer';
import LiveScoreAddScorer from 'components/liveScore/liveScoreAddScorer';
import LiveScoreAddTeam from 'components/liveScore/liveScoreAddTeam';
import LiveScoreAssignMatch from 'components/liveScore/liveScoreAssignMatches';
import LiveScoreBanners from 'components/liveScore/liveScoreBanners';
import LiveScoreBulkChange from 'components/liveScore/liveScoreBulkChange';
import LiveScoreCoaches from 'components/liveScore/liveScoreCoaches';
import LiveScoreCompetitions from 'components/liveScore/liveScoreCompetitions';
import LiveScoreDashboard from 'components/liveScore/liveScoreDashboard';
import LiveScoreDivisionImport from 'components/liveScore/liveScoreDivisionImport';
import LiveScoreDivisionList from 'components/liveScore/liveScoreDivisionList';
import LiveScoreEditBanners from 'components/liveScore/liveScoreEditBanners';
import LiveScoreGameTimeList from 'components/liveScore/liveScoreGameTimeList';
import LiveScoreGoalsList from 'components/liveScore/liveScoreGoalsList';
import LiveScoreIncidentImport from 'components/liveScore/liveScoreIncidentImport';
import LiveScoreIncidentList from 'components/liveScore/liveScoreIncidentList';
import LiveScoreIncidentView from 'components/liveScore/liveScoreIncidentView';
import LiveScoreLadderAdjustment from 'components/liveScore/liveScoreLadderAdjustment';
import LiveScoreLadderList from 'components/liveScore/liveScoreLadderList';
import LiveScoreLadderSettings from 'components/liveScore/liveScoreLadderSettings';
import LiveScoreManagerImport from 'components/liveScore/liveScoreManagerImport';
import LiveScoreManagerList from 'components/liveScore/liveScoreManagers';
import LiveScoreManagerView from 'components/liveScore/liveScoreManagerView';
import LiveScoreMatchDetails from 'components/liveScore/liveScoreMatchDetails';
import LiveScoreMatches from 'components/liveScore/liveScoreMatches';
import LiveScoreMatchImport from 'components/liveScore/liveScoreMatchImport';
import LiveScoreMatchSheet from 'components/liveScore/liveScoreMatchSheet';
import LiveScoreNewsList from 'components/liveScore/liveScoreNewsList';
import LiveScoreNewsView from 'components/liveScore/liveScoreNewsView';
import LiveScorerPlayerImport from 'components/liveScore/liveScorePlayerImport';
import LiveScorePlayerList from 'components/liveScore/liveScorePlayerList';
import LiveScorePlayerProfile from 'components/liveScore/liveScorePlayerProfile';
import LiveScorePlayerView from 'components/liveScore/liveScorePlayerView';
import LiveScorePositionTrackReport from 'components/liveScore/liveScorePositionTrackReport';
import LiveScorePublicLadder from 'components/liveScore/liveScorePublicLadder';
import LiveScorerCoachImport from 'components/liveScore/liveScoreCoachImport';
import LiveScorerList from 'components/liveScore/liveScorerList';
import LiveScorerView from 'components/liveScore/liveScorerView';
import LiveScoreSeasonFixture from 'components/liveScore/liveScoreSeasonFixture';
import LiveScoreSettingsView from 'components/liveScore/liveScoreSettingsView';
import LiveScoreSocialSheet from 'components/liveScore/liveScoreSocialSheet';
import LiveScoreTeam from 'components/liveScore/liveScoreTeams';
import LiveScoreTeamAttendance from 'components/liveScore/liveScoreTeamAttendance';
import LiveScoreTeamImport from 'components/liveScore/liveScoreTeamImport';
import LiveScoreTeamView from 'components/liveScore/liveScoreTeamView';
import LiveScoreUmpireImport from 'components/liveScore/liveScoreUmpireImport';
import LiveScoreUmpireList from 'components/liveScore/liveScoreUmpireList';
import LiveScoreVenueChange from 'components/liveScore/liveScoreVenueChange';
import LiveScoreSingleGameFee from 'components/liveScore/liveScoreSingleGameFee';
import OrgBecsSetup from  'components/registration/orgBecsSetup';
import Stripe from 'components/stripe/stripe';

import AddProduct from 'components/shop/addProduct';
import ListProducts from 'components/shop/listProducts';
import OrderDetails from 'components/shop/orderDetails';
import OrderSummary from 'components/shop/orderSummary';
import ShopDashboard from 'components/shop/shopDashboard';
import ShopOrderStatus from 'components/shop/shopOrderStatus';
import ShopSettings from 'components/shop/shopSettings';

import Account from 'pages/Account';
import HelpAndSupport from 'pages/Support';

import { routeAdminRole, routeUmpireRole, routeFinanceRole } from './routeAccess';
import NotFound from './404';

import CommunicationList from 'components/communication/communicationList';
import AddCommunication from 'components/communication/addCommunication';
import CommunicationView from 'components/communication/communictionView';
import MergeUserMatches from 'components/user/mergeUserMatches'
import MergeUserDetail from 'components/user/mergeUserDetail'
import AddTeamMember from 'components/user/addTeamMember';
import TeamMemberRegPayment from 'components/user/teamMemberRegPayment';
import RegistrationInvoiceNew from 'components/registration/registrationInvoiceNew';

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRoleId: getUserRoleId(),
        };
    }

    haveAccess = (role, screen) => {
        if (role == 2) {
            return routeAdminRole.includes(screen);
        } if (role == 11) {
            return routeUmpireRole.includes(screen);
        } if (role == 13) {
            return routeFinanceRole.includes(screen);
        }
    }

    render() {
        const { userRoleId } = this.state;
        return (
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/homeDashboard" />} />

                <PrivateRoute
                    path="/dashboard"
                    component={this.haveAccess(userRoleId, '/dashboard') ? lazyLoad(Dashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/homeDashboard"
                    component={this.haveAccess(userRoleId, '/homeDashboard') ? lazyLoad(HomeDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationCompetitionForm"
                    component={this.haveAccess(userRoleId, '/registrationCompetitionForm')
                        ? lazyLoad(RegistrationCompetitionForm)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionOpenRegForm"
                    component={this.haveAccess(userRoleId, '/competitionOpenRegForm')
                        ? lazyLoad(CompetitionOpenRegForm)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionFormat"
                    component={this.haveAccess(userRoleId, '/competitionFormat')
                        ? lazyLoad(CompetitionFormat)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionFinals"
                    component={this.haveAccess(userRoleId, '/competitionFinals')
                        ? lazyLoad(CompetitionFinals)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionLadder"
                    component={this.haveAccess(userRoleId, '/competitionLadder')
                        ? lazyLoad(CompetitionLadder)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionCourtAndTimesAssign"
                    component={this.haveAccess(userRoleId, '/competitionCourtAndTimesAssign')
                        ? lazyLoad(CompetitionCourtAndTimesAssign)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueAndCourts"
                    component={this.haveAccess(userRoleId, '/competitionVenueAndCourts')
                        ? lazyLoad(CompetitionVenueAndCourts)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionReplicate"
                    component={this.haveAccess(userRoleId, '/competitionReplicate')
                        ? lazyLoad(CompetitionReplicate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueAndTimesAdd"
                    component={this.haveAccess(userRoleId, '/competitionVenueAndTimesAdd')
                        ? lazyLoad(CompetitionVenueAndTimesAdd)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueAndTimesEdit"
                    component={this.haveAccess(userRoleId, '/competitionVenueAndTimesEdit')
                        ? lazyLoad(CompetitionVenueAndTimesEdit)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueTimesPrioritisation"
                    component={this.haveAccess(userRoleId, '/competitionVenueTimesPrioritisation')
                        ? lazyLoad(CompetitionVenueTimesPrioritisation)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionReGrading"
                    component={this.haveAccess(userRoleId, '/competitionReGrading') ? lazyLoad(CompetitionReGrading) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionReGradingStep2"
                    component={this.haveAccess(userRoleId, '/competitionReGradingStep2') ? lazyLoad(CompetitionReGradingStep2) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDashboard"
                    component={this.haveAccess(userRoleId, '/competitionDashboard') ? lazyLoad(CompetitionDashboard) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPlayerGrades"
                    component={this.haveAccess(userRoleId, '/competitionPlayerGrades') ? lazyLoad(CompetitionPlayerGrades) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionProposedTeamGrading"
                    component={this.haveAccess(userRoleId, '/competitionProposedTeamGrading')
                        ? lazyLoad(CompetitionProposedTeamGrading)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPlayerGradeCalculate"
                    component={this.haveAccess(userRoleId, '/competitionPlayerGradeCalculate')
                        ? lazyLoad(CompetitionPlayerGradeCalculate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartPlayerGrades"
                    component={this.haveAccess(userRoleId, '/competitionPartPlayerGrades')
                        ? lazyLoad(CompetitionPartPlayerGrades)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartPlayerGradeCalculate"
                    component={this.haveAccess(userRoleId, '/competitionPartPlayerGradeCalculate')
                        ? lazyLoad(CompetitionPartPlayerGradeCalculate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartProposedTeamGrading"
                    component={this.haveAccess(userRoleId, '/competitionPartProposedTeamGrading')
                        ? lazyLoad(CompetitionPartProposedTeamGrading)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/quickCompetitionInvitations"
                    component={this.haveAccess(userRoleId, '/quickCompetitionInvitations')
                        ? lazyLoad(CompetitionQuickCompetitionInvitations)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/quickCompetitionMatchFormat"
                    component={this.haveAccess(userRoleId, '/quickCompetitionMatchFormat')
                        ? lazyLoad(CompetitionQuickCompetitionMatchFormat)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartTeamGradeCalculate"
                    component={this.haveAccess(userRoleId, '/competitionPartTeamGradeCalculate')
                        ? lazyLoad(CompetitionPartTeamGradeCalculate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDrawsOld"
                    component={this.haveAccess(userRoleId, '/competitionDraws') ? lazyLoad(MultiFieldDrawsNew) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDraws"
                    component={this.haveAccess(userRoleId, '/competitionDraws') ? lazyLoad(MultiFieldDrawsNewTimeline) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDrawEdit"
                    component={this.haveAccess(userRoleId, '/competitionDrawEdit') ? lazyLoad(CompetitionDrawEdit) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionFixtures"
                    component={this.haveAccess(userRoleId, '/competitionFixtures') ? lazyLoad(CompetitionFixtures) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/quickCompetition"
                    component={this.haveAccess(userRoleId, '/quickCompetition') ? lazyLoad(CompetitionQuickCompetition) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/competitionPlayerImport"
                    component={this.haveAccess(userRoleId, '/competitionPlayerImport') ? lazyLoad(CompetitionPlayerImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/competitionTeamsImport"
                    component={this.haveAccess(userRoleId, '/competitionTeamsImport') ? lazyLoad(CompetitionTeamImport) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionException"
                    component={this.haveAccess(userRoleId, '/competitionException') ? lazyLoad(CompetitionException) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/multifieldDraws"
                    component={this.haveAccess(userRoleId, '/multifieldDraws') ? lazyLoad(MultiFieldDraws) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/multiDraws"
                    component={this.haveAccess(userRoleId, '/multiDraws') ? lazyLoad(CompetitionDraws) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/productAdd"
                    component={this.haveAccess(userRoleId, '/productAdd') ? lazyLoad(ProductAdd) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registration"
                    component={this.haveAccess(userRoleId, '/registration') ? lazyLoad(Registration) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/productAddRegistration"
                    component={this.haveAccess(userRoleId, '/productAddRegistration')
                        ? lazyLoad(ProductAddRegistration)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/productRegistrationClub"
                    component={this.haveAccess(userRoleId, '/productRegistrationClub')
                        ? lazyLoad(ProductRegistrationClub)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/userGraphicalDashboard"
                    component={this.haveAccess(userRoleId, '/userGraphicalDashboard')
                        ? lazyLoad(UserDashboard)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userTextualDashboard"
                    component={this.haveAccess(userRoleId, '/userTextualDashboard')
                        ? lazyLoad(UserTextualDashboard)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userPersonal"
                    component={this.haveAccess(userRoleId, '/userPersonal')
                        ? lazyLoad(UserModulePersonalDetail)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/mergeUserMatches"
                    component={this.haveAccess(userRoleId, '/userPersonal')
                        ? lazyLoad(MergeUserMatches)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/mergeUserDetail"
                    component={this.haveAccess(userRoleId, '/userPersonal')
                        ? lazyLoad(MergeUserDetail)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userMedical"
                    component={this.haveAccess(userRoleId, '/userMedical') ? lazyLoad(userModuleMedical) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/matchDayMatchSheet"
                    component={this.haveAccess(userRoleId, '/matchDayMatchSheet')
                        ? lazyLoad(LiveScoreMatchSheet)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationList"
                    component={this.haveAccess(userRoleId, '/registrationList') ? lazyLoad(RegistrationList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/matchDayPlayerProfile"
                    component={this.haveAccess(userRoleId, '/matchDayPlayerProfile') ? lazyLoad(LiveScorePlayerProfile) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationPayments"
                    component={this.haveAccess(userRoleId, '/registrationPayments') ? lazyLoad(RegistrationPayments) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/orgBecsSetup"
                    component={this.haveAccess(userRoleId, '/registrationPayments') ? lazyLoad(OrgBecsSetup) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/umpireAllocation"
                    component={this.haveAccess(userRoleId, '/umpireAllocation') ? lazyLoad(UmpireAllocation) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationForm"
                    component={this.haveAccess(userRoleId, '/registrationForm') ? lazyLoad(RegistrationForm) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationMembershipFee"
                    component={this.haveAccess(userRoleId, '/registrationMembershipFee') ? lazyLoad(RegistrationMembershipFee) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationCompetitionFee"
                    component={this.haveAccess(userRoleId, '/registrationCompetitionFee') ? lazyLoad(RegistrationCompetitionFee) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userAffiliatesList"
                    component={this.haveAccess(userRoleId, '/userAffiliatesList') ? lazyLoad(UserAffiliatesList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/affiliateDirectory"
                    component={this.haveAccess(userRoleId, '/affiliateDirectory') ? lazyLoad(AffiliateDirectory) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userAffiliateApproveRejectForm"
                    component={this.haveAccess(userRoleId, '/userAffiliateApproveRejectForm')
                        ? lazyLoad(UserAffiliateApproveRejectForm)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userAddAffiliates"
                    component={this.haveAccess(userRoleId, '/userAddAffiliates') ? lazyLoad(UserAddAffiliates) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userEditAffiliates"
                    component={this.haveAccess(userRoleId, '/userEditAffiliates') ? lazyLoad(UserEditAffiliates) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userOurOrganisation"
                    component={this.haveAccess(userRoleId, '/userOurOrganisation') ? lazyLoad(UserOurOrganization) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/venuesList"
                    component={this.haveAccess(userRoleId, '/venuesList') ? lazyLoad(VenuesList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/appRegistrationForm"
                    component={this.haveAccess(userRoleId, '/appRegistrationForm') ? lazyLoad(AppRegistrationForm) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationMembershipList"
                    component={this.haveAccess(userRoleId, '/registrationMembershipList') ? lazyLoad(RegistrationMembershipList) : lazyLoad(NotFound)}
                />
                 <PrivateRoute
                    path="/registrationMembershipCap"
                    component={this.haveAccess(userRoleId, '/registrationMembershipCap') ? lazyLoad(RegistrationMembershipCap) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationCompetitionList"
                    component={this.haveAccess(userRoleId, '/registrationCompetitionList')
                        ? lazyLoad(RegistrationCompetitionList)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayDashboard"
                    component={this.haveAccess(userRoleId, '/matchDayDashboard') ? lazyLoad(LiveScoreDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayMatches"
                    component={this.haveAccess(userRoleId, '/matchDayMatches') ? lazyLoad(LiveScoreMatches) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayMatchDetails"
                    component={this.haveAccess(userRoleId, '/matchDayMatchDetails') ? lazyLoad(LiveScoreMatchDetails) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddMatch"
                    component={this.haveAccess(userRoleId, '/matchDayAddMatch') ? lazyLoad(LiveScoreAddMatch) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayScorerList"
                    component={this.haveAccess(userRoleId, '/matchDayScorerList') ? lazyLoad(LiveScorerList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddScorer"
                    component={this.haveAccess(userRoleId, '/matchDayAddScorer') ? lazyLoad(LiveScoreAddScorer) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayTeam"
                    component={this.haveAccess(userRoleId, '/matchDayTeam') ? lazyLoad(LiveScoreTeam) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddTeam"
                    component={this.haveAccess(userRoleId, '/matchDayAddTeam') ? lazyLoad(LiveScoreAddTeam) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayManagerList"
                    component={this.haveAccess(userRoleId, '/matchDayManagerList') ? lazyLoad(LiveScoreManagerList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddManagers"
                    component={this.haveAccess(userRoleId, '/matchDayAddManagers') ? lazyLoad(LiveScoreAddManager) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayManagerImport"
                    component={this.haveAccess(userRoleId, '/matchDayManagerImport') ? lazyLoad(LiveScoreManagerImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayManagerView"
                    component={this.haveAccess(userRoleId, '/matchDayManagerView') ? lazyLoad(LiveScoreManagerView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayTeamView"
                    component={this.haveAccess(userRoleId, '/matchDayTeamView') ? lazyLoad(LiveScoreTeamView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayScorerView"
                    component={this.haveAccess(userRoleId, '/matchDayScorerView') ? lazyLoad(LiveScorerView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayMatchImport"
                    component={this.haveAccess(userRoleId, '/matchDayMatchImport') ? lazyLoad(LiveScoreMatchImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayTeamImport"
                    component={this.haveAccess(userRoleId, '/matchDayTeamImport') ? lazyLoad(LiveScoreTeamImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayUmpireList"
                    component={this.haveAccess(userRoleId, '/matchDayUmpireList') ? lazyLoad(LiveScoreUmpireList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayLadderList"
                    component={this.haveAccess(userRoleId, '/matchDayLadderList') ? lazyLoad(LiveScoreLadderList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayPlayerList"
                    component={this.haveAccess(userRoleId, '/matchDayPlayerList') ? lazyLoad(LiveScorePlayerList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayPlayerImport"
                    component={this.haveAccess(userRoleId, '/matchDayPlayerImport') ? lazyLoad(LiveScorerPlayerImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddPlayer"
                    component={this.haveAccess(userRoleId, '/matchDayAddPlayer') ? lazyLoad(LiveScoreAddPlayer) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayPlayerView"
                    component={this.haveAccess(userRoleId, '/matchDayPlayerView') ? lazyLoad(LiveScorePlayerView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayIncidentView"
                    component={this.haveAccess(userRoleId, '/matchDayIncidentView') ? lazyLoad(LiveScoreIncidentView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayIncidentList"
                    component={this.haveAccess(userRoleId, '/matchDayIncidentList') ? lazyLoad(LiveScoreIncidentList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayNewsList"
                    component={this.haveAccess(userRoleId, '/matchDayNewsList') ? lazyLoad(LiveScoreNewsList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddNews"
                    component={this.haveAccess(userRoleId, '/matchDayAddNews') ? lazyLoad(LiveScoreAddNews) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayNewsView"
                    component={this.haveAccess(userRoleId, '/matchDayNewsView') ? lazyLoad(LiveScoreNewsView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDaySettingsView"
                    component={this.haveAccess(userRoleId, '/matchDaySettingsView') ? lazyLoad(LiveScoreSettingsView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayBanners"
                    component={this.haveAccess(userRoleId, '/matchDayBanners') ? lazyLoad(LiveScoreBanners) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayTeamAttendance"
                    component={this.haveAccess(userRoleId, '/matchDayTeamAttendance') ? lazyLoad(LiveScoreTeamAttendance) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayGameTimeList"
                    component={this.haveAccess(userRoleId, '/matchDayGameTimeList') ? lazyLoad(LiveScoreGameTimeList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayGoalsList"
                    component={this.haveAccess(userRoleId, '/matchDayGoalsList') ? lazyLoad(LiveScoreGoalsList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayCompetitions"
                    component={this.haveAccess(userRoleId, '/matchDayCompetitions') ? lazyLoad(LiveScoreCompetitions) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayBulkChange"
                    component={this.haveAccess(userRoleId, '/matchDayBulkChange') ? lazyLoad(LiveScoreBulkChange) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayEditBanners"
                    component={this.haveAccess(userRoleId, '/matchDayEditBanners') ? lazyLoad(LiveScoreEditBanners) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayDivisionList"
                    component={this.haveAccess(userRoleId, '/matchDayDivisionList') ? lazyLoad(LiveScoreDivisionList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddDivision"
                    component={this.haveAccess(userRoleId, '/matchDayAddDivision') ? lazyLoad(LiveScoreAddDivision) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddIncident"
                    component={this.haveAccess(userRoleId, '/matchDayAddIncident') ? lazyLoad(LiveScoreAddIncident) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayLadderSettings"
                    component={this.haveAccess(userRoleId, '/matchDayLadderSettings') ? lazyLoad(LiveScoreLadderSettings) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayDivisionImport"
                    component={this.haveAccess(userRoleId, '/matchDayDivisionImport') ? lazyLoad(LiveScoreDivisionImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAssignMatch"
                    component={this.haveAccess(userRoleId, '/matchDayAssignMatch') ? lazyLoad(LiveScoreAssignMatch) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayVenueChange"
                    component={this.haveAccess(userRoleId, '/matchDayVenueChange') ? lazyLoad(LiveScoreVenueChange) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationFormList"
                    component={this.haveAccess(userRoleId, '/registrationFormList') ? lazyLoad(RegistrationFormList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayIncidentImport"
                    component={this.haveAccess(userRoleId, '/matchDayIncidentImport') ? lazyLoad(LiveScoreIncidentImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayPublicLadder"
                    component={this.haveAccess(userRoleId, '/matchDayPublicLadder') ? lazyLoad(LiveScorePublicLadder) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDaySeasonFixture"
                    component={this.haveAccess(userRoleId, '/matchDaySeasonFixture') ? lazyLoad(LiveScoreSeasonFixture) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/netSetGo"
                    component={this.haveAccess(userRoleId, '/netSetGo') ? lazyLoad(NetSetGo) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/playWithFriend"
                    component={this.haveAccess(userRoleId, '/playWithFriend') ? lazyLoad(PlayWithFriend) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/referFriend"
                    component={this.haveAccess(userRoleId, '/referFriend') ? lazyLoad(ReferFriend) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/spectator"
                    component={this.haveAccess(userRoleId, '/spectator') ? lazyLoad(Spectator) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/invoice"
                    component={this.haveAccess(userRoleId, '/invoice') ? lazyLoad(RegistrationInvoiceNew) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/checkoutPayment"
                    component={this.haveAccess(userRoleId, '/checkoutPayment') ? lazyLoad(Stripe) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationSettlements"
                    component={this.haveAccess(userRoleId, '/registrationSettlements') ? lazyLoad(RegistrationSettlements) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationRefunds"
                    component={this.haveAccess(userRoleId, '/registrationSettlements') ? lazyLoad(RegistrationRefunds) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationPayoutTransaction"
                    component={this.haveAccess(userRoleId, '/registrationPayoutTransaction')
                        ? lazyLoad(RegistrationPayoutTransaction)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayCoaches"
                    component={this.haveAccess(userRoleId, '/matchDayCoaches') ? lazyLoad(LiveScoreCoaches) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayAddEditCoach"
                    component={this.haveAccess(userRoleId, '/matchDayAddEditCoach') ? lazyLoad(LiveScoreAddEditCoach) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayCoachImport"
                    component={this.haveAccess(userRoleId, '/matchDayCoachImport') ? lazyLoad(LiveScorerCoachImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDaySocialSheet"
                    component={this.haveAccess(userRoleId, '/matchDaySocialSheet') ? lazyLoad(LiveScoreSocialSheet) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireDashboard"
                    component={this.haveAccess(userRoleId, '/umpireDashboard') ? lazyLoad(UmpireDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/addUmpire"
                    component={this.haveAccess(userRoleId, '/addUmpire') ? lazyLoad(AddUmpire) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/shopDashboard"
                    component={this.haveAccess(userRoleId, '/shopDashboard') ? lazyLoad(ShopDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireRoster"
                    component={this.haveAccess(userRoleId, '/umpireRoster') ? lazyLoad(UmpireRoster) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireImport"
                    component={this.haveAccess(userRoleId, '/umpireImport') ? lazyLoad(UmpireImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpire"
                    component={this.haveAccess(userRoleId, '/umpire') ? lazyLoad(Umpire) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/listProducts"
                    component={this.haveAccess(userRoleId, '/listProducts') ? lazyLoad(ListProducts) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/addProduct"
                    component={this.haveAccess(userRoleId, '/addProduct') ? lazyLoad(AddProduct) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/paymentDashboard"
                    component={this.haveAccess(userRoleId, '/paymentDashboard') ? lazyLoad(PaymentDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/orderSummary"
                    component={this.haveAccess(userRoleId, '/orderSummary') ? lazyLoad(OrderSummary) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/orderStatus"
                    component={this.haveAccess(userRoleId, '/orderStatus') ? lazyLoad(ShopOrderStatus) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/shopSettings"
                    component={this.haveAccess(userRoleId, '/shopSettings') ? lazyLoad(ShopSettings) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/userProfileEdit"
                    component={this.haveAccess(userRoleId, '/userProfileEdit') ? lazyLoad(UserProfileEdit) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/assignUmpire"
                    component={this.haveAccess(userRoleId, '/assignUmpire') ? lazyLoad(AssignUmpire) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireSetting"
                    component={this.haveAccess(userRoleId, '/umpireSetting') ? lazyLoad(UmpireSetting) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireDivisions"
                    component={this.haveAccess(userRoleId, '/umpireDivisions') ? lazyLoad(UmpireDivisions) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePoolAllocation"
                    component={this.haveAccess(userRoleId, '/umpirePoolAllocation') ? lazyLoad(UmpirePoolAllocation) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayUmpireImport"
                    component={this.haveAccess(userRoleId, '/matchDayUmpireImport') ? lazyLoad(LiveScoreUmpireImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationDashboard"
                    component={this.haveAccess(userRoleId, '/registrationDashboard') ? lazyLoad(RegistrationMainDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayLadderAdjustment"
                    component={this.haveAccess(userRoleId, '/matchDayLadderAdjustment') ? lazyLoad(LiveScoreLadderAdjustment) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDayPositionTrackReport"
                    component={this.haveAccess(userRoleId, '/matchDayPositionTrackReport')
                        ? lazyLoad(LiveScorePositionTrackReport)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationChange"
                    component={this.haveAccess(userRoleId, '/registrationChange') ? lazyLoad(RegistrationChange) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/account"
                    component={this.haveAccess(userRoleId, '/account') ? lazyLoad(Account) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/support"
                    component={this.haveAccess(userRoleId, '/support') ? lazyLoad(HelpAndSupport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationChangeReview"
                    component={this.haveAccess(userRoleId, '/registrationChangeReview') ? lazyLoad(RegistrationChangeReview) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/teamRegistrations"
                    component={this.haveAccess(userRoleId, '/teamRegistrations') ? lazyLoad(TeamRegistrations) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePayment"
                    component={this.haveAccess(userRoleId, '/umpirePayment') ? lazyLoad(UmpirePayment) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePaymentSetting"
                    component={this.haveAccess(userRoleId, '/umpirePaymentSetting') ? lazyLoad(UmpirePaymentSetting) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePayout"
                    component={this.haveAccess(userRoleId, '/umpirePayout') ? lazyLoad(UmpirePayout) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/orderDetails"
                    component={this.haveAccess(userRoleId, '/orderDetails') ? lazyLoad(OrderDetails) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/deregistration"
                    component={this.haveAccess(userRoleId, '/multifieldDraws') ? lazyLoad(deRegistration) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/matchDaySingleGameFee"
                    component={this.haveAccess(userRoleId, '/matchDaySingleGameFee') ? lazyLoad(LiveScoreSingleGameFee) : lazyLoad(NotFound)}
                />

                <PrivateRoute path="/communication" component={lazyLoad(CommunicationBanner)} />

                <PrivateRoute
                    path="/communicationEditBanners"
                    component={lazyLoad(CommunicationEditBanners)}
                />

                <PrivateRoute path="/communicationList" component={lazyLoad(CommunicationList)} />

                <PrivateRoute path="/addCommunication" component={lazyLoad(AddCommunication)} />

                <PrivateRoute path="/communicationView" component={lazyLoad(CommunicationView)} />

                <PrivateRoute
                    path="/addTeamMember"
                    component={this.haveAccess(userRoleId, '/addTeamMember')
                        ? lazyLoad(AddTeamMember)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute path="/teamMemberRegPayment"
                    component={this.haveAccess(userRoleId, '/teamMemberRegPayment')
                    ? lazyLoad(TeamMemberRegPayment)
                    : lazyLoad(NotFound)}
                />

                <Route path="/" component={lazyLoad(NotFound)} />

               

                <Redirect from="*" to="/404" />
            </Switch>
        );
    }
}

export default Routes;
