import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

import AppConstants from "../themes/appConstants";
import { checkOrganisationLevel } from "../util/permissions";
import AccountMenu from "./InnerHorizontalMenu/AccountMenu";
import "./layout.css";

const { SubMenu } = Menu;

class InnerHorizontalMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            organisationLevel: "",
        };
    }

    componentDidMount() {
        checkOrganisationLevel().then((value) => (
            this.setState({ organisationLevel: value })
        ));

        if (this.props) {
            if (this.props.compSelectedKey !== "18") {
                localStorage.removeItem("draws_roundTime");
                localStorage.removeItem("draws_round");
                localStorage.removeItem("draws_venue");
            }
        }
    }

    render() {
        let orgLevel = this.state.organisationLevel;
        const { menu, selectedKey } = this.props;

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
                            <span>Own Competitions</span>
                        }
                    >
                        <Menu.Item key="2">
                            {/* <a href="https://comp-management-test.firebaseapp.com/quick-competitions.html">Quick Competition</a> */}
                            <NavLink to="/quickCompetition">
                                <span>Quick Competition</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <NavLink to="/competitionOpenRegForm">
                                <span> Competition Details</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <NavLink to="/competitionPlayerGrades">
                                <span>Player Grading</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <NavLink to="/competitionPartTeamGradeCalculate">
                                <span>Team Grading</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <NavLink to="/competitionCourtAndTimesAssign">
                                <span>Time Slots</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <NavLink to="/competitionVenueTimesPrioritisation">
                                <span>Venues</span>
                            </NavLink>
                        </Menu.Item>
                        {/* <Menu.Item key="8">
                            <NavLink to="/competitionLadder">
                                <span>Ladder</span>
                            </NavLink>
                        </Menu.Item> */}
                        <Menu.Item key="9">
                            <NavLink to="/competitionFormat">
                                <span>Competition Format</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="10">
                            <NavLink to="/competitionFinals">
                                <span>Finals</span>
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
                                <span>Draws</span>
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
                            <span>Participating-In Competitions</span>
                        }
                    >
                        <Menu.Item key="14">
                            <NavLink to="/competitionPartPlayerGrades">
                                <span>Player Grading</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="15">
                            <NavLink to="/competitionPartProposedTeamGrading">
                                <span>Team Grading</span>
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

                {menu === "liveScore" && <Menu
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
                            <NavLink to="/liveScoreSettingsView">
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
                        {/* <NavLink to="/liveScoreAddEditCoach"> */}
                            <span>News & Messages</span>
                        </NavLink>
                    </Menu.Item>
                </Menu>
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
                                <span>{AppConstants.home}</span>
                            </NavLink>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={<span>{AppConstants.maintain}</span>}
                        >
                            <Menu.Item key="2">
                                <NavLink to="/venuesList">
                                    <span>{AppConstants.venueAndCourts}</span>
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
            </div>
        );
    }
}

export default InnerHorizontalMenu;
