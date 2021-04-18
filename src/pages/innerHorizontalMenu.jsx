import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Select, message } from 'antd';

import AppConstants from '../themes/appConstants';
import {
  checkOrganisationLevel,
  checkLivScoreCompIsParent,
  getUserRoleId,
} from '../util/permissions';
import AccountMenu from './InnerHorizontalMenu/AccountMenu';
import './layout.css';
import AppUniqueId from '../themes/appUniqueId';
import { isArrayNotEmpty } from '../util/helpers';
import {
  innerHorizontalCompetitionListAction,
  updateInnerHorizontalData,
  initializeCompData,
} from '../store/actions/LiveScoreAction/liveScoreInnerHorizontalAction';
import { getLiveScoreCompetiton, getGlobalYear, setGlobalYear } from '../util/sessionStorage';
import history from '../util/history';
import { getOnlyYearListAction, CLEAR_OWN_COMPETITION_DATA } from '../store/actions/appAction';
import { clearDataOnCompChangeAction } from '../store/actions/LiveScoreAction/liveScoreMatchAction';

const { SubMenu } = Menu;
const { Option } = Select;

class InnerHorizontalMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      organisationLevel: '',
      selectedComp: null,
      loading: false,
      orgId: null,
      orgState: false,
      liveScoreCompIsParent: false,
      yearId: null,
      yearLoading: false,
      defaultYear: null,
      userAccessPermission: '',
      userRoleId: getUserRoleId(),
      count: 0,
      isImpersonation: false,
    };
  }

  async componentDidMount() {
    const impersonation = localStorage.getItem('Impersonation') === 'true';
    this.setState({
      isImpersonation: impersonation,
    });
    if (getLiveScoreCompetiton()) {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      const yearRefId = getGlobalYear() ? getGlobalYear() : localStorage.getItem('yearId');
      this.setState({ selectedComp: id, yearId: yearRefId });
    }

    if (this.props.menu === 'liveScore') {
      this.props.getOnlyYearListAction(this.props.appState.yearList);
      this.setState({ yearLoading: true });
    }

    checkOrganisationLevel().then(value =>
      this.setState({ organisationLevel: value, orgState: true }),
    );
    this.setLivScoreCompIsParent();
    if (this.props) {
      if (this.props.compSelectedKey !== '18') {
        localStorage.removeItem('draws_roundTime');
        localStorage.removeItem('draws_round');
        localStorage.removeItem('draws_venue');
      }
    }
  }

  async componentDidUpdate(nextProps) {
    if (this.props.userState.onLoad == false && this.state.orgState) {
      if (JSON.parse(localStorage.getItem('setOrganisationData'))) {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        if (this.props.menu === 'liveScore') {
          if (nextProps.appState == this.props.appState) {
            if (this.props.appState.onLoad === false && this.state.yearLoading === true) {
              const yearId =
                this.props.appState.yearList.length > 0 && this.props.appState.yearList[0].id;
              const yearRefId = getGlobalYear() ? getGlobalYear() : localStorage.getItem('yearId');
              if (yearRefId) {
                if (!this.props.innerHorizontalState.error) {
                  this.props.innerHorizontalCompetitionListAction(
                    organisationId,
                    yearRefId,
                    this.props.innerHorizontalState.competitionList,
                  );
                }

                this.setState({
                  yearLoading: false,
                  loading: true,
                  orgId: organisationId,
                  orgState: false,
                  yearId: yearRefId,
                });
              } else {
                if (!this.props.innerHorizontalState.error) {
                  this.props.innerHorizontalCompetitionListAction(
                    organisationId,
                    yearId,
                    this.props.innerHorizontalState.competitionList,
                  );
                }
                this.setState({
                  yearLoading: false,
                  loading: true,
                  orgId: organisationId,
                  orgState: false,
                  yearId,
                });
              }
            }
          }
        }
      }
    }

    if (nextProps.innerHorizontalState !== this.props.innerHorizontalState) {
      if (this.state.loading && this.props.innerHorizontalState.onLoad == false) {
        const compList = isArrayNotEmpty(this.props.innerHorizontalState.competitionList)
          ? this.props.innerHorizontalState.competitionList
          : [];
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        if (!isArrayNotEmpty(compList)) {
          message.config({
            duration: 1.5,
            maxCount: 1,
          });
          if (this.state.count < 1) {
            message.info(AppConstants.noCompetitionYear, 1.5);
          }

          const defaultYear = localStorage.getItem('defaultYearId');
          // let defaultYear = getGlobalYear()
          this.setState({ yearId: defaultYear, loading: true });
          localStorage.setItem('yearId', defaultYear);
          setGlobalYear(defaultYear);
          if (!this.props.innerHorizontalState.error && this.state.count < 1) {
            this.props.innerHorizontalCompetitionListAction(
              organisationId,
              defaultYear,
              this.props.innerHorizontalState.competitionList,
            );
            this.setState({ count: this.state.count + 1 });
          }
          return;
        }

        let firstComp = 1;
        const isCompetition = await getLiveScoreCompetiton();
        const yearValue = localStorage.getItem('yearValue');

        if (yearValue === 'true') {
          firstComp = compList.length > 0 && compList[0].id;
          localStorage.setItem('yearValue', 'false');
          localStorage.setItem('LiveScoreCompetition', JSON.stringify(compList[0]));
        } else if (isCompetition) {
          const { id } = JSON.parse(isCompetition);
          firstComp = id;
        } else {
          firstComp = compList.length > 0 && compList[0].id;
        }

        this.setState({ selectedComp: firstComp, compArray: compList, loading: false });
        this.setLivScoreCompIsParent();
      }
    }
  }

  setLivScoreCompIsParent = () => {
    checkLivScoreCompIsParent().then(value => this.setState({ liveScoreCompIsParent: value }));
  };

  setCompetitionID = compId => {
    this.setState({ selectedComp: compId });
    let compObj = null;
    for (const i in this.state.compArray) {
      if (compId == this.state.compArray[i].id) {
        compObj = this.state.compArray[i];
        break;
      }
    }
    this.props.clearDataOnCompChangeAction();
    localStorage.setItem('LiveScoreCompetition', JSON.stringify(compObj));
    history.push('/matchDayDashboard');
  };

  setYearId = yearId => {
    this.props.updateInnerHorizontalData();
    localStorage.setItem('yearValue', 'true');
    this.setState({ yearId, loading: true });
    // localStorage.setItem("LiveScoreCompetition", undefined);
    localStorage.setItem('yearId', yearId);
    setGlobalYear(yearId);
    const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
    this.props.clearDataOnCompChangeAction();
    this.props.innerHorizontalCompetitionListAction(
      organisationId,
      yearId,
      this.props.innerHorizontalState.competitionList,
    );

    history.push('/matchDayDashboard');
  };

  handleMenuClick = async () => {
    await this.props.clearDataOnCompChangeAction();
    await this.props.CLEAR_OWN_COMPETITION_DATA('all');
  };

  render() {
    const orgLevel = this.state.organisationLevel;
    const { menu, selectedKey } = this.props;
    const { competitionList } = this.props.innerHorizontalState;
    const compList = isArrayNotEmpty(competitionList) ? competitionList : [];
    const { liveScoreCompIsParent } = this.state;
    const { yearList } = this.props.appState;
    const { userRoleId } = this.state;

    return (
      <div>
        {menu === 'competition' && (
          <Menu
            // className="nav-collapse collapse"
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.compSelectedKey]}
            onClick={() => this.props.clearDataOnCompChangeAction()}
          >
            <Menu.Item key="1">
              <NavLink
                onClick={() => this.props.CLEAR_OWN_COMPETITION_DATA('all')}
                to="/competitionDashboard"
              >
                Dashboard
              </NavLink>
            </Menu.Item>

            <SubMenu key="sub1" title={<span id={AppUniqueId.own_comp_tab}>Own Competitions</span>}>
              <Menu.Item key="2">
                {/* <a href="https://comp-management-test.firebaseapp.com/quick-competitions.html">Quick Competition</a> */}
                <NavLink to="/quickCompetition">
                  <span
                    onClick={() => this.props.CLEAR_OWN_COMPETITION_DATA('all')}
                    id={AppUniqueId.quick_comp_subtab}
                  >
                    Quick Competition
                  </span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/competitionOpenRegForm">
                  <span id={AppUniqueId.comp_details_subtab}> Competition Details</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="4">
                <NavLink to="/competitionPlayerGrades">
                  <span id={AppUniqueId.player_grad_subtab}>Player Grading</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="5">
                <NavLink to="/competitionPartTeamGradeCalculate">
                  <span id={AppUniqueId.team_grad_subtab}>Team Grading</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink to="/competitionCourtAndTimesAssign">
                  <span id={AppUniqueId.timeslots_subtab}>Time Slots</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="7">
                <NavLink to="/competitionVenueTimesPrioritisation">
                  <span id={AppUniqueId.venues_subtab}>Venues</span>
                </NavLink>
              </Menu.Item>
              {/*
                            <Menu.Item key="8">
                                <NavLink to="/competitionLadder">
                                    <span>Ladder</span>
                                </NavLink>
                            </Menu.Item>
                            */}
              <Menu.Item key="9">
                <NavLink to="/competitionFormat">
                  <span id={AppUniqueId.comp_formats_subtab}>Competition Format</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="10">
                <NavLink to="/competitionFinals">
                  <span id={AppUniqueId.finals_subtab}>Finals</span>
                </NavLink>
              </Menu.Item>
              {/*
                            <Menu.Item key="11">
                                <a href="http://clixlogix.org/test/netball/fixtures.html">Fixtures</a>
                                <NavLink to="competitionFixtures">
                                    Fixtures
                                </NavLink>
                            </Menu.Item>
                            */}
              <Menu.Item key="18">
                {/* <a href="https://comp-management-test.firebaseapp.com/competitions-draws.html">Draws</a> */}
                <NavLink to="/competitionDraws">
                  {/* <span id={AppUniqueId.draws_subtab}>Draws</span> */}
                  <span>Draws</span>
                </NavLink>
              </Menu.Item>
              {/*
                            <SubMenu
                                key="sub2"
                                title={
                                    <span>Draw</span>
                                }
                            >
                                <Menu.Item key="13">
                                    <NavLink to="/competitionReGrading">
                                        <span>Re-grading</span>
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key="18">
                                    <a href="https://comp-management-test.firebaseapp.com/competitions-draws.html">Draws</a>
                                    <NavLink to="/competitionDraws">
                                        <span>Draws</span>
                                    </NavLink>
                                </Menu.Item>
                            </SubMenu> */}
            </SubMenu>

            <SubMenu
              key="sub3"
              title={
                <span id={AppUniqueId.participating_in_comp_tab}>
                  Participating-In Competitions
                </span>
              }
            >
              <Menu.Item key="14">
                <NavLink to="/competitionPartPlayerGrades">
                  <span id={AppUniqueId.playergrad_particip_tab}>Player Grading</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="15">
                <NavLink to="/competitionPartProposedTeamGrading">
                  <span id={AppUniqueId.teamgrad_particip_tab}>Team Grading</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
        )}

        {menu === 'registration' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.regSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="1">
              <NavLink to="/registrationDashboard">
                <span>Dashboard</span>
              </NavLink>
            </Menu.Item>
            <SubMenu key="sub4" title={<span>Registrations</span>}>
              <Menu.Item key="2">
                <NavLink to="/registration">
                  <span>Registrations</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="10">
                <NavLink to="/teamRegistrations">
                  <span>Team Registrations</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="9">
                <NavLink to="/registrationChange">
                  <span>Registration Change</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="8">
                <NavLink to="/netSetGo">
                  <span>{AppConstants.netSetGo}</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            {(orgLevel === AppConstants.national || orgLevel === AppConstants.state) && (
              // <Menu.Item key="6">
              //     <NavLink to="/registrationMembershipList">
              //         <span>Membership</span>
              //     </NavLink>
              // </Menu.Item>
              <SubMenu key="sub5" title={<span>Membership</span>}>
                <Menu.Item key="4">
                  <NavLink to="/registrationMembershipList">
                    <span>Membership Fees</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                  <NavLink to="/registrationMembershipCap">
                    <span>Membership Cap</span>
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            )}
            <SubMenu key="sub1" title={<span>Competition</span>}>
              <Menu.Item key="7">
                <NavLink to="/registrationCompetitionList">
                  <span>Competition</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/registrationFormList">
                  <span>Registration Form</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>

            {/* <Menu.Item key="9">De-registration forms</Menu.Item> */}
          </Menu>
        )}

        {menu === 'liveScore' && (
          <div className="row mr-0">
            <div className="col-sm pr-0">
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                selectedKeys={[this.props.liveScoreSelectedKey]}
                onClick={this.handleMenuClick}
              >
                <Menu.Item key="1">
                  <NavLink to="/matchDayDashboard">
                    <span>Dashboard</span>
                  </NavLink>
                </Menu.Item>
                <SubMenu key="sub1" title={<span>Competition Details</span>}>
                  <Menu.Item key="2">
                    <NavLink to={{ pathname: '/matchDayMatches' }}>
                      <span>Matches</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <NavLink to="/matchDayTeam">
                      <span>Teams</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <NavLink to="/matchDayManagerList">
                      <span>Managers</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="23">
                    <NavLink to="/matchDayCoaches">
                      <span>Coaches</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <NavLink to="/matchDayScorerList">
                      <span>Scorers</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="6">
                    <NavLink
                      to={{
                        pathname: '/umpireDashboard',
                        state: {
                          liveScoreUmpire: 'liveScoreUmpire',
                          isParticipate: !liveScoreCompIsParent,
                        },
                      }}
                    >
                      <span>Umpires</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="7">
                    <NavLink to="/matchDayPlayerList">
                      <span>Players</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="8">
                    <NavLink to="/userAffiliatesList">
                      <span>Affiliates</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="9">
                    <NavLink to="/matchDayDivisionList">
                      <span>Divisions</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="10">
                    <NavLink to="/venuesList">
                      <span>Venues</span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="11">
                    <NavLink to="/matchDayLadderList">
                      <span>Ladder</span>
                    </NavLink>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span>Match Day</span>}>
                  {liveScoreCompIsParent && (
                    <Menu.Item key="12">
                      <NavLink to="/matchDayBulkChange">
                        <span>Bulk Match Change</span>
                      </NavLink>
                    </Menu.Item>
                  )}
                  {liveScoreCompIsParent && (
                    <Menu.Item key="13">
                      <NavLink to="/matchDayVenueChange">
                        <span>Court Change</span>
                      </NavLink>
                    </Menu.Item>
                  )}
                  <Menu.Item key="14">
                    <NavLink to="/matchDayTeamAttendance">
                      <span>Team Attendance</span>
                    </NavLink>
                  </Menu.Item>
                  <SubMenu key="sub3" title={<span>Statistics</span>}>
                    <Menu.Item key="15">
                      <NavLink to="/matchDayGameTimeList">
                        <span>Game Time</span>
                      </NavLink>
                    </Menu.Item>
                    {/*
                                        <Menu.Item key="16">
                                            <NavLink to="/liveScoreShooting">
                                                <span>Shooting</span>
                                            </NavLink>
                                        </Menu.Item>
                                        */}
                    <Menu.Item key="16">
                      <NavLink to="/matchDayGoalsList">
                        <span>Goals</span>
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="24">
                      <NavLink to="/matchDayPositionTrackReport">
                        <span>Position Tracking</span>
                      </NavLink>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="17">
                    <NavLink to="/matchDayIncidentList">
                      <span>Incidents</span>
                    </NavLink>
                  </Menu.Item>
                </SubMenu>
                {liveScoreCompIsParent && (
                  <SubMenu key="sub4" title={<span>Settings</span>}>
                    <Menu.Item key="18">
                      <NavLink
                        to={{
                          pathname: '/matchDaySettingsView',
                          state: 'edit',
                        }}
                      >
                        <span>Settings</span>
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="19">
                      <NavLink to="/matchDayLadderSettings">
                        <span>Ladder/Draw</span>
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="20">
                      <NavLink to="/matchDayBanners">
                        <span>Banners</span>
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="22">
                      <NavLink to="/matchDayMatchSheet">
                        <span>Match Sheets</span>
                      </NavLink>
                    </Menu.Item>
                  </SubMenu>
                )}
                {liveScoreCompIsParent && (
                  <Menu.Item key="21">
                    <NavLink to="/matchDayNewsList">
                      <span>News & Messages</span>
                    </NavLink>
                  </Menu.Item>
                )}
              </Menu>
            </div>

            <div className="inner-horizontal-Comp-year-dropdown-div">
              <div className="inner-horizontal-dropdown-marginTop">
                <Select
                  style={{ width: 90 }}
                  className="year-select reg-filter-select1 ml-5"
                  // onChange={this.setYearId}
                  onChange={yearId => this.setYearId(yearId)}
                  value={JSON.parse(this.state.yearId)}
                >
                  {yearList.map(item => (
                    <Option key={`year_${item.id}`} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="col-sm-2 pr-5 inner-horizontal-dropdown-marginTop inner-horizontal-Comp-dropdown-div">
                <Select
                  style={{ width: 'fit-content', minWidth: 190, maxWidth: 220 }}
                  className="year-select reg-filter-select1 innerSelect-value"
                  onChange={this.setCompetitionID}
                  value={!!compList.length ? this.state.selectedComp : ''}
                >
                  {compList.map(item => (
                    <Option key={`competition_${item.id}`} value={item.id}>
                      {item.longName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        {menu === 'umpire' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.umpireSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="1">
              <NavLink to="/umpireDashboard">
                <span>Dashboard</span>
              </NavLink>
            </Menu.Item>
            <SubMenu key="Umpires" title={<span>Umpires</span>}>
              <Menu.Item key="2">
                <NavLink to="/umpire">
                  <span>Umpires</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/umpireRoster">
                  <span>Umpire Roster</span>
                </NavLink>
              </Menu.Item>
              <SubMenu key="umpireAllocation" title={<span>Umpire Allocation</span>}>
                <Menu.Item key="6">
                  <NavLink to="/umpireSetting">
                    <span>Settings</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                  <NavLink to="/umpirePoolAllocation">
                    <span>Pools</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                  <NavLink to="/umpireDivisions">
                    <span>Divisions</span>
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu key="payments" title={<span>Payments</span>}>
              <Menu.Item key="7">
                <NavLink to="/umpirePayment">
                  <span>Payments</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="8">
                <NavLink to="/umpirePayout">
                  <span>Payouts</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="9">
                <NavLink to="/umpirePaymentSetting">
                  <span>Settings</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
        )}

        {menu === 'user' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.userSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="1">
              {/*
                            <NavLink to="/userGraphicalDashboard">
                                <span>{AppConstants.dashboard}</span>
                            </NavLink>
                            */}
              <NavLink to="/userTextualDashboard">
                <span>{AppConstants.dashboard}</span>
              </NavLink>
            </Menu.Item>
            <SubMenu key="sub2" title={<span>{AppConstants.users}</span>}>
              {/*
                            <Menu.Item key="4">
                                <NavLink to="/userTextualDashboard">
                                    <span>{AppConstants.users}</span>
                                </NavLink>
                            </Menu.Item>
                            */}
              <Menu.Item key="5">
                <NavLink to="/playWithFriend">
                  <span>{AppConstants.playWithAFriend}</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink to="/referFriend">
                  <span>{AppConstants.referaFriend}</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            {/*
                        <SubMenu
                            key="sub2"
                            title={<span>{AppConstants.maintain}</span>}
                        >
                            <Menu.Item key="4">
                                <NavLink to="/venuesList">
                                    <span>{AppConstants.venueAndCourts}</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        */}
            <SubMenu key="sub1" title={<span>{AppConstants.administrators}</span>}>
              <Menu.Item key="2">
                <NavLink to="/userAffiliatesList">
                  <span>{AppConstants.affiliates}</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/userOurOrganisation">
                  <span>{AppConstants.ourOrganisation}</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="4">
                <NavLink to="/affiliateDirectory">
                  <span>{AppConstants.affiliateDirectory}</span>
                </NavLink>
              </Menu.Item>
              {/*
                            <Menu.Item key="3">
                                <NavLink to="/userAffiliateApproveRejectForm">
                                    <span>{AppConstants.affiliateApproveReject}</span>
                                </NavLink>
                            </Menu.Item>
                            */}
            </SubMenu>
          </Menu>
        )}

        {menu === 'home' && userRoleId == 2 && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.userSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="1">
              <NavLink to="/homeDashboard">
                <span id={AppConstants.homeTab}>{AppConstants.home}</span>
              </NavLink>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span id={AppConstants.maintain_tab}>{AppConstants.maintain}</span>}
            >
              <Menu.Item key="2">
                <NavLink to="/venuesList">
                  <span id={AppConstants.venue_courtId}>{AppConstants.venueAndCourts}</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
        )}

        {menu === 'shop' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.shopSelectedKey]}
            onClick={this.handleMenuClick}
          >
            {/* <Menu.Item key="1">
                            <NavLink to="/shopDashboard">
                                <span>{AppConstants.dashboard}</span>
                            </NavLink>
                        </Menu.Item> */}

            <SubMenu key="sub2" title={<span>{AppConstants.orders}</span>}>
              <Menu.Item key="3">
                <NavLink to="/orderSummary">
                  <span>{AppConstants.orderSummary}</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="5">
                <NavLink to="/orderStatus">
                  <span>{AppConstants.orderStatus}</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="2">
              <NavLink to="/listProducts">
                <span>{AppConstants.products}</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="4">
              <NavLink to="/shopSettings">
                <span>{AppConstants.settings}</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        )}

        {menu === 'finance' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.finSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <SubMenu key="sub2" title={<span>Dashboard</span>}>
              <Menu.Item key="1">
                <NavLink to="/paymentDashboard">
                  <span>Dashboard</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink to="/SummaryByParticipant">
                  <span>{AppConstants.summaryByParticipant}</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="2" disabled={this.state.isImpersonation}>
              <NavLink to="/registrationPayments">
                <span>Payment Gateway</span>
              </NavLink>
              {/* <a href="https://comp-management-test.firebaseapp.com/payment-dashboard.html">Payments</a> */}
            </Menu.Item>
            <Menu.Item key="3" disabled={this.state.isImpersonation}>
              <NavLink to="/registrationSettlements">
                <span>Payouts</span>
              </NavLink>
            </Menu.Item>
            {/* <Menu.Item key="4" disabled={this.state.isImpersonation}>
                            <NavLink to="/registrationRefunds">
                                <span>Refunds</span>
                            </NavLink>
                        </Menu.Item> */}
          </Menu>
        )}

        {menu === 'account' && <AccountMenu selectedKey={selectedKey} />}

        {menu === 'liveScoreNews' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.liveScoreNewsSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="21">
              <NavLink to="/matchDayNewsList">
                <span>News & Messages</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        )}

        {menu === 'communication' && (
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.props.userSelectedKey]}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="1">
              <NavLink to="/CommunicationList">
                <span>{AppConstants.dashboard}</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/communication">
                <span>{AppConstants.banners}</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      innerHorizontalCompetitionListAction,
      getOnlyYearListAction,
      updateInnerHorizontalData,
      initializeCompData,
      clearDataOnCompChangeAction,
      CLEAR_OWN_COMPETITION_DATA,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    innerHorizontalState: state.InnerHorizontalState,
    userState: state.UserState,
    appState: state.AppState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InnerHorizontalMenu);
