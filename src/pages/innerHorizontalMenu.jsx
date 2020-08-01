import React from "react";
import { Menu, Select } from "antd";
import { NavLink } from "react-router-dom";

import AppConstants from "../themes/appConstants";
import { checkOrganisationLevel } from "../util/permissions";
import AccountMenu from "./InnerHorizontalMenu/AccountMenu";
import "./layout.css";
import AppUniqueId from "../themes/appUniqueId";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../util/helpers";
import { innerHorizontalCompetitionListAction } from '../store/actions/LiveScoreAction/liveScoreInnerHorizontalAction'
import { getLiveScoreCompetiton } from '../util/sessionStorage';
import history from "../util/history";

const { SubMenu } = Menu;
const { Option } = Select;

class InnerHorizontalMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            organisationLevel: "",
            selectedComp: null,
            loading: false,
            orgId: null,
            orgState: false
        };
    }

    componentDidMount() {
        checkOrganisationLevel().then((value) => (
            this.setState({ organisationLevel: value, orgState: true })
        ));

    
        if (this.props) {
            if (this.props.compSelectedKey !== "18") {
                localStorage.removeItem("draws_roundTime");
                localStorage.removeItem("draws_round");
                localStorage.removeItem("draws_venue");
            }
        }
    }

    componentDidUpdate(nextProps) {

        if (this.props.userState.onLoad == false && this.state.orgState == true) {
            if (JSON.parse(localStorage.getItem('setOrganisationData'))) {
                let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
                this.props.innerHorizontalCompetitionListAction(organisationId)
                this.setState({ loading: true, orgId: organisationId, orgState: false })
            }
        }

        if (nextProps.innerHorizontalState !== this.props.innerHorizontalState) {

            if (this.state.loading == true && this.props.innerHorizontalState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.innerHorizontalState.competitionList) ? this.props.innerHorizontalState.competitionList : []
                let firstComp = 1

                if (getLiveScoreCompetiton()) {
                    const { id } = JSON.parse(getLiveScoreCompetiton())
                    firstComp = id
                } else {
                    firstComp = compList.length > 0 && compList[0].id
                }
                this.setState({ selectedComp: firstComp, compArray: compList, loading: false })
            }
        }
    }


    setCompetitionID = (compId) => {
        this.setState({ selectedComp: compId })
        let compObj = null
        for (let i in this.state.compArray) {
            if (compId == this.state.compArray[i].id) {
                compObj = this.state.compArray[i]
                break;
            }
        }
        localStorage.setItem("LiveScoreCompetiton", JSON.stringify(compObj))
        history.push("/liveScoreDashboard")
    }

    render() {
        let orgLevel = this.state.organisationLevel;
        const { menu, selectedKey } = this.props;
        const { competitionList } = this.props.innerHorizontalState
        let compList = isArrayNotEmpty(competitionList) ? competitionList : []
        return (
            <div>
                {menu === "competition" && <Menu
                    // className="nav-collapse collapse"
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                    selectedKeys={[this.props.compSelectedKey]}
                >
                    <Menu.Item key="1">
                        <NavLink to="/competitionDashboard">
                            Dashboard
                        </NavLink>
                    </Menu.Item>

                    <SubMenu
                        key="sub1"
                        title={
                            <span id={AppUniqueId.own_comp_tab} >Own Competitions</span>
                        }
                    >
                        <Menu.Item key="2">
                            {/* <a href="https://comp-management-test.firebaseapp.com/quick-competitions.html">Quick Competition</a> */}
                            <NavLink to="/quickCompetition">
                                <span id={AppUniqueId.quick_comp_subtab}>Quick Competition</span>
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
                        {/* <Menu.Item key="8">
                            <NavLink to="/competitionLadder">
                                <span>Ladder</span>
                            </NavLink>
                        </Menu.Item> */}
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
                        {/* <Menu.Item key="11">
                            <a href="http://clixlogix.org/test/netball/fixtures.html">Fixtures</a>
                            <NavLink to="competitionFixtures">
                                Fixtures
                            </NavLink>
                        </Menu.Item> */}

                        <Menu.Item key="18">
                            {/* <a href="https://comp-management-test.firebaseapp.com/competitions-draws.html">Draws</a> */}
                            <NavLink to="/competitionDraws">
                                <span id={AppUniqueId.draws_subtab}>Draws</span>
                            </NavLink>
                        </Menu.Item>
                        {/* <SubMenu
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
                            <span id={AppUniqueId.participating_in_comp_tab}>Participating-In Competitions</span>
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
                }

                {menu === "registration" && <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                    selectedKeys={[this.props.regSelectedKey]}
                >
                    <Menu.Item key="1">
                        <NavLink to="/registrationDashboard">
                            <span>Dashboard</span>
                        </NavLink>
                    </Menu.Item>
                    <SubMenu
                        key="sub4"
                        title={
                            <span>Registrations</span>
                        }
                    >
                        <Menu.Item key="2">
                            <NavLink to="/registration">
                                <span>Registrations</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <NavLink to="/registrationChange">
                                <span>Registration Change</span>
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                    {orgLevel === AppConstants.national || orgLevel === AppConstants.state && (
                        <Menu.Item key="6">
                            <NavLink to="/registrationMembershipList">
                                <span>Membership</span>
                            </NavLink>
                        </Menu.Item>
                    )}
                    <SubMenu
                        key="sub1"
                        title={
                            <span>Competition</span>
                        }
                    >
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
                    <SubMenu
                        key="sub2"
                        title={
                            <span>Payments</span>
                        }
                    >
                        <Menu.Item key="8">
                            <NavLink to="/paymentDashboard">
                                <span>Payment Dashboard</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <NavLink to="/registrationPayments">
                                <span>Payment Gateway</span>
                            </NavLink>
                            {/* <a href="https://comp-management-test.firebaseapp.com/payment-dashboard.html">Payments</a> */}
                        </Menu.Item>
                        <Menu.Item key="5">
                            <NavLink to="/registrationSettlements">
                                <span>Payouts</span>
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                    {/* <Menu.Item key="9">De-registration forms</Menu.Item> */}
                </Menu>
                }

                {menu === "liveScore" &&
                    <div className="row">
                        <div className="col-sm pr-0">
                            <Menu
                                theme="light"
                                mode="horizontal"
                                defaultSelectedKeys={['1']}
                                style={{ lineHeight: '64px' }}
                                selectedKeys={[this.props.liveScoreSelectedKey]}
                            >

                                <Menu.Item key="1">
                                    <NavLink to="/liveScoreDashboard">
                                        <span>Dashboard</span>
                                    </NavLink>
                                </Menu.Item>
                                <SubMenu
                                    key="sub1"
                                    title={
                                        <span>Competition Details</span>
                                    }
                                >
                                    <Menu.Item key="2">
                                        <NavLink to={{
                                            pathname: '/liveScoreMatches',
                                        }}>
                                            <span>Matches</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                        <NavLink to="/liveScoreTeam">
                                            <span>Teams</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="23">
                                        <NavLink to="/LiveScoreCoaches">
                                            <span>Coaches </span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="4">
                                        <NavLink to="/liveScoreManagerList">
                                            <span>Managers</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="5">
                                        <NavLink to="/liveScorerList">
                                            <span>Scorers</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="6">
                                        <NavLink to={{
                                            pathname: "/umpireDashboard",
                                            state: { liveScoreUmpire: 'liveScoreUmpire' }
                                        }}>
                                            <span>Umpires</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="7">
                                        <NavLink to="/liveScorePlayerList">
                                            <span>Players</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="8">
                                        <NavLink to="/userAffiliatesList">
                                            <span>Affiliates</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="9">
                                        <NavLink to="/liveScoreDivisionList">
                                            <span>Divisions</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="10">
                                        <NavLink to="/venuesList">
                                            <span>Venues</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="11">
                                        <NavLink to="/liveScoreLadderList">
                                            <span>Ladder</span>
                                        </NavLink>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="sub2"
                                    title={
                                        <span>Match Day</span>
                                    }
                                >
                                    <Menu.Item key="12">
                                        <NavLink to="/liveScoreBulkChange">
                                            <span>Bulk Match Change</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="13">
                                        <NavLink to="liveScoreVenueChange">
                                            <span>Court Change</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="14">
                                        <NavLink to="/liveScoreTeamAttendance">
                                            <span>Team Attendance</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <SubMenu
                                        key="sub3"
                                        title={
                                            <span>Statistics</span>
                                        }
                                    >
                                        <Menu.Item key="15">
                                            <NavLink to="/liveScoreGameTimeList">
                                                <span>Game Time</span>
                                            </NavLink>
                                        </Menu.Item>
                                        {/* <Menu.Item key="16">
                                <NavLink to="/liveScoreShooting">
                                    <span>Shooting</span>
                                </NavLink>
                            </Menu.Item> */}
                                        <Menu.Item key="16">
                                            <NavLink to="/liveScoreGoalsList">
                                                <span>Goals</span>
                                            </NavLink>
                                        </Menu.Item>
                                        <Menu.Item key="24">
                                            <NavLink to="/liveScorePositionTrackReport">
                                                <span>Position Tracking</span>
                                            </NavLink>
                                        </Menu.Item>
                                    </SubMenu>
                                    <Menu.Item key="17">
                                        <NavLink to="/liveScoreIncidentList">
                                            <span>Incidents</span>
                                        </NavLink>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="sub4"
                                    title={
                                        <span>Settings</span>
                                    }
                                >
                                    <Menu.Item key="18">
                                        <NavLink to={{
                                            pathname: '/liveScoreSettingsView',
                                            state: 'edit'
                                        }}>
                                            <span>Settings</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="19">
                                        <NavLink to="/liveScoreLadderSettings">
                                            <span>Ladder/Draw</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="20">
                                        <NavLink to="/liveScoreBanners">
                                            <span>Banners</span>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="22">
                                        <NavLink to="/liveScoreMatchSheet">
                                            <span>Match Sheets</span>
                                        </NavLink>
                                    </Menu.Item>
                                </SubMenu>
                                <Menu.Item key="21">
                                    <NavLink to="/liveScoreNewsList">
                                        <span>News & Messages</span>
                                    </NavLink>
                                </Menu.Item>


                            </Menu>


                        </div>
                        <div className="col-sm-2 pr-5 inner-horizontal-dropdown-marginTop inner-horizontal-Comp-dropdown-div">
                            <Select
                                style={{ width: "fit-content", minWidth: 250 }}
                                className="year-select reg-filter-select1"
                                onChange={(comp) => this.setCompetitionID(comp)}
                                value={this.state.selectedComp}
                            >
                                {
                                    compList.map((item, index) => {
                                        return <Option key={`longName` + index} value={item.id}>{item.longName}</Option>
                                    })
                                }

                            </Select>
                        </div>
                    </div>

                }

                {menu === "umpire" && <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                    selectedKeys={[this.props.umpireSelectedKey]}
                >
                    <Menu.Item key="1">
                        <NavLink to="/umpireDashboard">
                            <span>Dashboard</span>
                        </NavLink>
                    </Menu.Item>
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
                    {/* <Menu.Item key="4">
                        <NavLink to="/umpireAllocation">
                            <span>Umpire Allocation</span>
                        </NavLink>
                    </Menu.Item> */}

                    <SubMenu
                        key="umpireAllocation"
                        title={
                            <span>Umpire Allocation</span>
                        }
                    >
                        <Menu.Item key="4">
                            <NavLink to="/umpireDivisions">
                                <span>Divisions</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <NavLink to="/umpirePoolAllocation">
                                <span>Pool</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <NavLink to="/umpireSetting">
                                <span>Settings</span>
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                }

                {menu === "user" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                        selectedKeys={[this.props.userSelectedKey]}
                    >
                        <Menu.Item key="1">
                            {/* <NavLink to="/userGraphicalDashboard">
                                <span>{AppConstants.dashboard}</span>
                            </NavLink> */}
                            <NavLink to="/userTextualDashboard">
                                <span>{AppConstants.dashboard}</span>
                            </NavLink>
                        </Menu.Item>
                        <SubMenu
                            key="sub2"
                            title={<span>{AppConstants.users}</span>}
                        >
                            {/* <Menu.Item key="4">
                                <NavLink to="/userTextualDashboard">
                                    <span>{AppConstants.users}</span>
                                </NavLink>
                            </Menu.Item> */}
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

                        {/* <SubMenu
                            key="sub2"
                            title={<span>{AppConstants.maintain}</span>}
                        >
                            <Menu.Item key="4">
                                <NavLink to="/venuesList">
                                    <span>{AppConstants.venueAndCourts}</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu> */}
                        <SubMenu
                            key="sub1"
                            title={
                                <span>{AppConstants.administrators}</span>
                            }
                        >
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
                            {/* <Menu.Item key="3">
                                <NavLink to="/userAffiliateApproveRejectForm">
                                    <span>{AppConstants.affiliateApproveReject}</span>
                                </NavLink>
                            </Menu.Item> */}
                        </SubMenu>
                    </Menu>
                )}

                {menu === "home" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                        selectedKeys={[this.props.userSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <NavLink to="/homeDashboard">
                                <span id={AppConstants.homeTab}>  {AppConstants.home}</span>
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

                {menu === "shop" && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                        selectedKeys={[this.props.shopSelectedKey]}
                    >
                        <Menu.Item key="1">
                            <NavLink to="/shopDashboard">
                                <span>{AppConstants.dashboard}</span>
                            </NavLink>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={<span>{AppConstants.products}</span>}
                        >
                            <Menu.Item key="2">
                                <NavLink to="/listProducts">
                                    <span>{AppConstants.products}</span>
                                </NavLink>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span>{AppConstants.orders}</span>}
                        >
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

                        <Menu.Item key="4">
                            <NavLink to="/shopSettings">
                                <span>{AppConstants.settings}</span>
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                )}

                {menu === "account" && (
                    <AccountMenu selectedKey={selectedKey} />
                )}

                {menu === "liveScoreNews" && <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                    selectedKeys={[this.props.liveScoreNewsSelectedKey]}
                >
                    <Menu.Item key="21">
                        <NavLink to="/liveScoreNewsList">
                            <span>News & Messages</span>
                        </NavLink>
                    </Menu.Item>
                </Menu>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        innerHorizontalCompetitionListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        innerHorizontalState: state.InnerHorizontalState,
        userState: state.UserState,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((InnerHorizontalMenu));
