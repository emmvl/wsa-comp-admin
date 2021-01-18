import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import {
    Layout,
    Breadcrumb,
    Table,
    Select,
    Pagination,
    Button,
    Tabs,
    Menu,
    Dropdown,
    Modal,
} from "antd";
import { DownOutlined } from '@ant-design/icons';
import moment from "moment";

import "./user.css";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import {
    getUserModulePersonalDetailsAction,
    getUserModulePersonalByCompetitionAction,
    getUserModuleRegistrationAction,
    getUserModuleTeamMembersAction,
    getUserModuleTeamRegistrationAction,
    getUserModuleOtherRegistrationAction,
    getUserModuleMedicalInfoAction,
    getUserModuleActivityPlayerAction,
    getUserModuleActivityParentAction,
    getUserModuleActivityScorerAction,
    getUserModuleActivityManagerAction,
    getUserHistoryAction,
    getUserModuleIncidentListAction,
    getUserRole,
    getScorerData,
    getUmpireData,
    getCoachData,
    getUmpireActivityListAction,
    registrationResendEmailAction,
    userProfileUpdateAction,
    resetTfaAction,
    teamMemberUpdateAction,
} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from "../../store/actions/appAction";
import { getOrganisationData, getGlobalYear, setGlobalYear } from "../../util/sessionStorage";
import history from "../../util/history";
import { liveScore_MatchFormate, liveScore_formateDate, getTime } from "../../themes/dateformate";
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from "../../customComponents/loader";
import { getPurchasesListingAction, getReferenceOrderStatus } from '../../store/actions/shopAction/orderStatusAction';
import { getAge, isArrayNotEmpty } from "../../util/helpers";

function tableSort(a, b, key) {
    const stringA = JSON.stringify(a[key]);
    const stringB = JSON.stringify(b[key]);
    return stringA.localeCompare(stringB);
}

function umpireActivityTableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.UmpireActivityListSortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.UmpireActivityListSortBy === key && this_Obj.state.UmpireActivityListSortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.UmpireActivityListSortBy === key && this_Obj.state.UmpireActivityListSortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    const payload = {
        paging: {
            limit: 10,
            offset: this_Obj.state.umpireActivityOffset,
        },
    };
    this_Obj.setState({ UmpireActivityListSortBy: sortBy, UmpireActivityListSortOrder: sortOrder });

    this_Obj.props.getUmpireActivityListAction(payload, JSON.stringify([15]), this_Obj.state.userId, sortBy, sortOrder);
}

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { SubMenu } = Menu;
let this_Obj = null;
const section = null;

const columns = [
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
    },
    {
        title: "Membership Valid Until",
        dataIndex: "expiryDate",
        key: "expiryDate",
        render: (expiryDate, record) => (
            <span>
                {expiryDate != null ? (expiryDate !== 'Single Use' && expiryDate !== 'Single Game' && expiryDate !== 'Pay each Match' ? moment(expiryDate, "YYYY-MM-DD").format("DD/MM/YYYY") : expiryDate) : moment(record.competitionEndDate, "YYYY-MM-DD").format("DD/MM/YYYY")}
            </span>
        ),
    },
    {
        title: "Comp Fees Paid",
        dataIndex: "compFeesPaid",
        key: "compFeesPaid",
    },
    {
        title: "Membership Product",
        dataIndex: "membershipProduct",
        key: "membershipProduct",
    },
    {
        title: "Membership Type",
        dataIndex: "membershipType",
        key: "membershipType",
    },
    {
        title: "Division",
        dataIndex: "divisionName",
        key: "divisionName",
        render: (divisionName) => (
            <div>{divisionName != null ? divisionName : ""}</div>
        ),
    },
    {
        title: "Paid By",
        dataIndex: "paidByUsers",
        key: "paidByUsers",
        render: (paidByUsers, record) => (
            <div>
                {(record.paidByUsers || []).map((item) => (
                    this_Obj.state.userId == item.paidByUserId ? (
                        <div>Self</div>
                    ) : (
                        <div>
                            <NavLink
                                to={{
                                    pathname: `/userPersonal`,
                                    state: {
                                        userId: item.paidByUserId,
                                        tabKey: "registration",
                                    },
                                }}
                            >
                                <span className="input-heading-add-another pt-0">{item.paidBy}</span>
                            </NavLink>
                        </div>
                    )
                ))}
            </div>
        ),
    },
    // {
    //   title: "Shop Purchases",
    //   dataIndex: "shopPurchases",
    //   key: "shopPurchases",
    // },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (paymentStatus) => (
            <span style={{ textTransform: "capitalize" }}>{paymentStatus}</span>
        ),
    },
    {
        title: "Action",
        dataIndex: "regForm",
        key: "regForm",
        render: (regForm, e) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={(
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    )}
                >
                    <Menu.Item key="1" onClick={() => this_Obj.viewRegForm(e)}>
                        <span>View</span>
                    </Menu.Item>
                    {e.alreadyDeRegistered == 0 && (
                        <Menu.Item key="2" onClick={() => history.push("\deregistration", { regData: e, personal: this_Obj.props.userState.personalData })}>
                            <span>{AppConstants.registrationChange}</span>
                        </Menu.Item>
                    )}
                    <Menu.Item key="3" onClick={() => history.push("\paymentDashboard", { personal: this_Obj.props.userState.personalData, registrationId: e.registrationId })}>
                        <span>Payment</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

const cloumnsRegistration = [
    {
        title: "Name",
        dataIndex: "userName",
        key: "userName",
    },
    {
        title: "DOB",
        dataIndex: "DOB",
        key: "DOB",
        render: (DOB, record) => (
            liveScore_formateDate(DOB)
        ),
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Phone",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
    },
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
    },
    {
        title: "Comp Fees Paid",
        dataIndex: "compFeesPaid",
        key: "compFeesPaid",
    },
    {
        title: "Membership Product",
        dataIndex: "productName",
        key: "productName",
    },
    {
        title: "Division",
        dataIndex: "divisionName",
        key: "divisionName",
    },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
    },
    {
        title: "Action",
    },

];

const teamRegistrationColumns = [
    {
        title: "Team Name",
        dataIndex: "teamName",
        key: "teamName",
        render: (teamName, record) => (
            <span className="input-heading-add-another pt-0" onClick={() => this_Obj.showTeamMembers(record, 1)}>{teamName}</span>
        ),
    },

    {
        title: "Organisation",
        dataIndex: "organisationName",
        key: "organisationName",
    },

    {
        title: "Division",
        key: "divisionName",
        dataIndex: "divisionName",
    },

    {
        title: "Product",
        key: "productName",
        dataIndex: "productName",
    },

    {
        title: "Registered By",
        dataIndex: "registeredBy",
        key: "registeredBy",
        render: (registeredBy, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{registeredBy}</span>
            </NavLink>
        ),
    },

    {
        title: "Registration Date",
        key: "registrationDate",
        dataIndex: "registrationDate",
        render: (registrationDate) => (
            <div>{registrationDate != null ? moment(registrationDate).format("DD/MM/YYYY") : ""}</div>
        ),
    },

    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },

    {
        title: "Action",
        key: "action",
        dataIndex: "teamName",
        render: (action, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={(
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    )}
                >
                    <Menu.Item key="1">
                        <span onClick={() => this_Obj.showTeamMembers(record, 1)}>View</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

const childOtherRegistrationColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },

    {
        title: "DOB",
        dataIndex: "dateOfBirth",
        key: "dateOfBirth",
        render: (dateOfBirth) => (
            <div>{dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}</div>
        ),
    },

    {
        title: "Email",
        key: "email",
        dataIndex: "email",
    },

    {
        title: "Phone",
        key: "mobileNumber",
        dataIndex: "mobileNumber",
    },
    {
        title: "Fee Paid",
        key: "feePaid",
        dataIndex: "feePaid",
    },
];

const teamMembersColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
    },
    {
        title: "Paid Fee",
        dataIndex: "paidFee",
        key: "paidFee",
        render: (r) => new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        }).format(r),
    },
    {
        title: "Pending Fee",
        dataIndex: "pendingFee",
        key: "pendingFee",
        render: (r) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(r),
    },
    {
        title: "Action",
        key: "action",
        dataIndex: "isActive",
        render: (data, record) => {
            let organistaionId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
            let compOrgId = this_Obj.state.registrationTeam.organisationUniqueKey
            return (
                <div>
                    {compOrgId == organistaionId && record.isRemove == 1 &&
                        <Menu
                            className="action-triple-dot-submenu"
                            theme="light"
                            mode="horizontal"
                            style={{ lineHeight: "25px" }}
                        >
                            <SubMenu
                                key="sub1"
                                title={(
                                    <img
                                        className="dot-image"
                                        src={AppImages.moreTripleDot}
                                        alt=""
                                        width="16"
                                        height="16"
                                    />
                                )}
                            >
                                <Menu.Item key="1">
                                    <span onClick={() => this_Obj.removeTeamMember(record)}>{record.isActive ? AppConstants.removeFromTeam : AppConstants.addToTeam}</span>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    }
                </div>
            )

        },

    },
];

const columnsPlayer = [
    {
        title: "Match Id",
        dataIndex: "matchId",
        key: "matchId",
        sorter: (a, b) => tableSort(a, b, "matchId"),
    },
    {
        title: "Date",
        dataIndex: "stateDate",
        key: "stateDate",
        sorter: (a, b) => tableSort(a, b, "stateDate"),
        render: (stateDate, record, index) => (
            <div>
                {stateDate != null ? moment(stateDate).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: "Home",
        dataIndex: "home",
        key: "home",
        sorter: (a, b) => tableSort(a, b, "home"),
    },
    {
        title: "Away",
        dataIndex: "away",
        key: "away",
        sorter: (a, b) => tableSort(a, b, "away"),
    },
    {
        title: "Borrowed Player",
        dataIndex: "borrowedPlayerStatus",
        key: "borrowedPlayerStatus",
        sorter: (a, b) => tableSort(a, b, "borrowedPlayerStatus"),
        render: (borrowedPlayerStatus, record, index) => (
            <div>
                {borrowedPlayerStatus === "Borrowed" ? "Yes" : "No"}
            </div>
        ),
    },
    {
        title: "Result",
        dataIndex: "teamScore",
        key: "teamScore",
        sorter: (a, b) => tableSort(a, b, "teamScore"),
    },
    {
        title: "Game time",
        dataIndex: "gameTime",
        key: "gameTime",
        sorter: (a, b) => tableSort(a, b, "gameTime"),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => tableSort(a, b, "status"),
    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => tableSort(a, b, "competitionName"),
    },
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
        sorter: (a, b) => tableSort(a, b, "affiliate"),
    },
];

const columnsParent = [
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
        title: "DOB",
        dataIndex: "dateOfBirth",
        key: "dateOfBirth",
        sorter: (a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth),
        render: (dateOfBirth, record, index) => (
            <div>
                {dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: "Team",
        dataIndex: "team",
        key: "team",
        sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
        title: "Div",
        dataIndex: "divisionName",
        key: "divisionName",
        sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
    },
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    },
];

const columnsScorer = [
    {
        title: "Start",
        dataIndex: "startTime",
        key: "startTime",
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => (
            <div>
                {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: "Match ID",
        dataIndex: "matchId",
        key: "matchId",
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: "Team",
        dataIndex: "teamName",
        key: "teamName",
        sorter: (a, b) => a.teamName.localeCompare(b.teamName),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    },
];

const columnsManager = [
    {
        title: "Match ID",
        dataIndex: "matchId",
        key: "matchId",
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: "Date",
        dataIndex: "startTime",
        key: "startTime",
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => (
            <div>
                {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: "Home",
        dataIndex: "home",
        key: "home",
        sorter: (a, b) => a.home.localeCompare(b.home),
    },
    {
        title: "Away",
        dataIndex: "away",
        key: "away",
        sorter: (a, b) => a.away.localeCompare(b.away),
    },
    {
        title: "Results",
        dataIndex: "teamScore",
        key: "teamScore",
        sorter: (a, b) => a.teamScore.localeCompare(b.teamScore),
    },
    {
        title: "Competition",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    },
];

const columnsPersonalAddress = [
    {
        title: "Street",
        dataIndex: "street",
        key: "street",
    },
    {
        title: "Suburb",
        dataIndex: "suburb",
        key: "suburb",
    },
    {
        title: "State",
        dataIndex: "state",
        key: "state",
    },
    {
        title: "Postcode",
        dataIndex: "postalCode",
        key: "postalCode",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        width: 80,
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={(
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    )}
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: `/userProfileEdit`,
                                state: { userData: record, moduleFrom: "1" },
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

const columnsPersonalPrimaryContacts = [
    {
        title: "Name",
        dataIndex: "parentName",
        key: "parentName",
        render: (parentName, record) => (
            record.status == "Linked"
                ? (
                    <NavLink
                        to={{
                            pathname: `/userPersonal`,
                            state: { userId: record.parentUserId },
                        }}
                    >
                        <span className="input-heading-add-another pt-0">{parentName}</span>
                    </NavLink>
                )
                : <span>{parentName}</span>

        ),
    },
    {
        title: "Street",
        dataIndex: "street",
        key: "street",
    },
    {
        title: "Suburb",
        dataIndex: "suburb",
        key: "suburb",
    },
    {
        title: "State",
        dataIndex: "state",
        key: "state",
    },
    {
        title: "Postcode",
        dataIndex: "postalCode",
        key: "postalCode",
    },
    {
        title: "Phone Number",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Action",
        dataIndex: "isUser",
        key: "isUser",
        width: 80,
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={(
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    )}
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: `/userProfileEdit`,
                                state: { userData: record, moduleFrom: "2" },
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>

                    <Menu.Item key="2">
                        <span onClick={() => this_Obj.unlinkCheckParent(record)}>{record.status == "Linked" ? "Unlink" : "Link"}</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

const columnsPersonalChildContacts = [
    {
        title: "Name",
        dataIndex: "childName",
        key: "childName",
        render: (childName, record) => (
            record.status == "Linked"
                ? (
                    <NavLink

                        to={{
                            pathname: `/userPersonal`,
                            state: { userId: record.childUserId },
                        }}
                    >
                        <span className="input-heading-add-another pt-0">{childName}</span>
                    </NavLink>
                )
                : <span>{childName}</span>
        ),
    },
    {
        title: "Street",
        dataIndex: "street",
        key: "street",
    },
    {
        title: "Suburb",
        dataIndex: "suburb",
        key: "suburb",
    },
    {
        title: "State",
        dataIndex: "state",
        key: "state",
    },
    {
        title: "Postcode",
        dataIndex: "postalCode",
        key: "postalCode",
    },
    {
        title: "Phone Number",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Action",
        dataIndex: "isUser",
        key: "isUser",
        width: 80,
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={(
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    )}
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: `/userProfileEdit`,
                                state: { userData: record, moduleFrom: "6" },
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>

                    <Menu.Item key="2">
                        <span onClick={() => this_Obj.unlinkCheckChild(record)}>{record.status == "Linked" ? "Unlink" : "Link"}</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

const columnsPersonalEmergency = [
    {
        title: "First Name",
        dataIndex: "emergencyFirstName",
        key: "emergencyFirstName",
    },
    {
        title: "Last Name",
        dataIndex: "emergencyLastName",
        key: "emergencyLastName",
    },
    {
        title: "Phone Number",
        dataIndex: "emergencyContactNumber",
        key: "emergencyContactNumber",
    },
    {
        title: "Action",
        dataIndex: "isUser",
        key: "isUser",
        width: 80,
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={(
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    )}
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: `/userProfileEdit`,
                                state: { userData: record, moduleFrom: "3" },
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

const columnsFriends = [
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Phone Number",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
    },
];

const columnsPlayedBefore = [
    {
        title: "Played Before",
        dataIndex: "playedBefore",
        key: "playedBefore",
    },
    {
        title: "Played Club",
        dataIndex: "playedClub",
        key: "playedClub",
    },
    {
        title: "Played Grade",
        dataIndex: "playedGrade",
        key: "playedGrade",
    },
    {
        title: "Played Year",
        dataIndex: "playedYear",
        key: "playedYear",
    },
    {
        title: "Last Captain",
        dataIndex: "lastCaptainName",
        key: "lastCaptainName",
    },
];

const columnsFav = [
    {
        title: "Favourite Netball Team",
        dataIndex: "favouriteTeam",
        key: "favouriteTeam",
    },
    {
        title: "Who is your favourite Firebird?",
        dataIndex: "favouriteFireBird",
        key: "favouriteFireBird",
    },
];

const columnsVol = [
    {
        title: "Volunteers",
        dataIndex: "description",
        key: "description",
    },
];

const columnsMedical = [
    {
        title: "Disability Type",
        dataIndex: "disabilityType",
        key: "disabilityType",
    },
    {
        title: "Disability Care Number",
        dataIndex: "disabilityCareNumber",
        key: "disabilityCareNumber",
    },
];

const columnsHistory = [
    // {
    //     title: 'Competition Name',
    //     dataIndex: 'competitionName',
    //     key: 'competitionName'
    // },
    // {
    //     title: 'Team Name',
    //     dataIndex: 'teamName',
    //     key: 'teamName'
    // },
    {
        title: "Division Grade",
        dataIndex: "divisionGrade",
        key: "divisionGrade",
    },
    {
        title: "Ladder Position",
        dataIndex: "ladderResult",
        key: "ladderResult",
    },
];

const columnsIncident = [
    {
        title: 'Date',
        dataIndex: 'incidentTime',
        key: 'incidentTime',
        sorter: (a, b) => tableSort(a, b, "incidentTime"),
        render: (incidentTime) => <span>{liveScore_MatchFormate(incidentTime)}</span>,
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => tableSort(a, b, "matchId"),
    },
    {
        title: 'Player ID',
        dataIndex: 'playerId',
        key: 'incident Players',
        sorter: (a, b) => tableSort(a, b, "playerId"),

    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'Incident Players First Name',
        sorter: (a, b) => tableSort(a, b, "firstName"),

    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'Incident Players Last Name',
        sorter: (a, b) => tableSort(a, b, "lastName"),

    },
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => tableSort(a, b, "teamName"),
        render: (teamName, record) => (
            <>
                {
                    record.teamDeletedAt
                        ? <span className="desc-text-style side-bar-profile-data">{teamName}</span>
                        : (
                            <NavLink to={{
                                pathname: '/matchDayTeamView',
                                state: { tableRecord: record, screenName: 'userPersonal', screenKey: this_Obj.state.screenKey },
                            }}
                            >
                                <span style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data">{teamName}</span>
                            </NavLink>
                        )
                }
            </>
        ),
    },
    {
        title: 'Type',
        dataIndex: 'incidentTypeName',
        key: 'incidentTypeName',
        sorter: (a, b) => a.incidentTypeName.localeCompare(b.incidentTypeName),
    },
];

// listeners for sorting
const listeners = (key) => ({
    onClick: () => umpireActivityTableSort(key),
});

const umpireActivityColumn = [
    {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (date, record) => <span>{record?.match?.startTime ? liveScore_formateDate(record.match.startTime) : ""}</span>,
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        // sorter: true,
        render: (time, record) => <span>{record?.match?.startTime ? getTime(record.match.startTime) : ""}</span>,
    },
    {
        title: 'Competition',
        dataIndex: 'competition',
        key: 'competition',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (date, record) => <span>{record?.match?.competition ? record.match.competition.longName : ""}</span>,
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (affiliate, record) => {
            const organisationArray = record.user.userRoleEntities.length > 0 && this_Obj.getOrganisationArray(record.user.userRoleEntities, record.roleId);
            return (
                <div>
                    {organisationArray.map((item, index) => (
                        <span key={`organisationName${index}`} className="multi-column-text-aligned">
                            {item.competitionOrganisation && item.competitionOrganisation.name}
                        </span>
                    ))}
                </div>
            );
        },
    },
    {
        title: 'Home',
        dataIndex: 'home',
        key: 'home',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (home, record) => <span>{record?.match?.team1 ? record.match.team1.name : ""}</span>,
    },
    {
        title: 'Away',
        dataIndex: 'away',
        key: 'away',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (away, record) => <span>{record?.match?.team2 ? record.match.team2.name : ""}</span>,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        // sorter: true,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (amount, record) => <span>N/A</span>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        // sorter: true,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (status, record) => <span>N/A</span>,
    },
];

const coachColumn = [
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'coach matchId',
        sorter: true,

    },
    {
        title: 'Date',
        dataIndex: 'startTime',
        key: 'coach date',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => (
            <div>
                {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: 'Home Team',
        dataIndex: 'homeTeam',
        key: 'coach homeTeam',
        sorter: (a, b) => a.homeTeam.localeCompare(b.homeTeam),

    },
    {
        title: 'Away Team',
        dataIndex: 'awayTeam',
        key: 'coach awayTeam',
        sorter: (a, b) => a.awayTeam.localeCompare(b.awayTeam),

    },
    {
        title: 'Result',
        dataIndex: 'resultStatus',
        key: 'coach result',
        sorter: (a, b) => a.resultStatus.localeCompare(b.resultStatus),

    },
];

const umpireColumn = [
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'Umpire matchId',
        sorter: true,

    },
    {
        title: 'Date',
        dataIndex: 'startTime',
        key: 'Umpire date',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => (
            <div>
                {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: 'Home Team',
        dataIndex: 'homeTeam',
        key: 'Umpire homeTeam',
        sorter: (a, b) => a.homeTeam.localeCompare(b.homeTeam),

    },
    {
        title: 'Away Team',
        dataIndex: 'awayTeam',
        key: 'Umpire awayTeam',
        sorter: (a, b) => a.awayTeam.localeCompare(b.awayTeam),

    },
    {
        title: 'Result',
        dataIndex: 'resultStatus',
        key: 'Umpire result',
        sorter: (a, b) => a.resultStatus.localeCompare(b.resultStatus),
    },
];

function purchasesTableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.purchasesListSortBy !== key) {
        sortOrder = 'asc';
    } else if (this_Obj.state.purchasesListSortBy === key && this_Obj.state.purchasesListSortOrder === 'asc') {
        sortOrder = 'desc';
    } else if (this_Obj.state.purchasesListSortBy === key && this_Obj.state.purchasesListSortOrder === 'desc') {
        sortBy = sortOrder = null;
    }
    const params = {
        limit: 10,
        offset: this_Obj.state.purchasesOffset,
        order: sortOrder || "",
        sorterBy: sortBy || "",
        userId: this_Obj.state.userId,
    };
    this_Obj.props.getPurchasesListingAction(params);
    this_Obj.setState({ purchasesListSortBy: sortBy, purchasesListSortOrder: sortOrder });
}

// listeners for sorting
const purchaseListeners = (key) => ({
    onClick: () => purchasesTableSort(key),
});

const purchaseActivityColumn = [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners("id"),
        render: (orderId) => (
            <NavLink to={{
                pathname: `/orderDetails`,
                state: { orderId },
            }}
            >
                <span className="input-heading-add-another pt-0">{orderId}</span>
            </NavLink>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners("createdOn"),
        render: (date) => <span>{date ? liveScore_formateDate(date) : ""}</span>,
    },
    // {
    //   title: 'Transaction ID',
    //   dataIndex: 'transactionId',
    //   key: 'transactionId',
    //   sorter: true,
    //   onHeaderCell: ({ dataIndex }) => purchaseListeners("id"),
    //   render: (transactionId) =>
    //       <span className="input-heading-add-another pt-0">{transactionId}</span>
    // },
    {
        title: 'Products',
        dataIndex: 'orderDetails',
        key: 'orderDetails',
        // sorter: true,
        // onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
        render: (orderDetails) => (
            <div>
                {orderDetails.length > 0 && orderDetails.map((item, i) => (
                    <span key={`orderDetails${i}`} className="desc-text-style side-bar-profile-data">{item}</span>
                ))}
            </div>
        ),
    },
    {
        title: 'Organisation',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners("organisationId"),
    },
    {
        title: 'Payment Status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
        render: (paymentStatus) => (
            <span>{this_Obj.getOrderStatus(paymentStatus, "ShopPaymentStatus")}</span>
        ),
    },
    {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
    },
    {
        title: 'Fulfillment Status',
        dataIndex: 'fulfilmentStatus',
        key: 'fulfilmentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
        render: (fulfilmentStatus) => (
            <span>{this_Obj.getOrderStatus(fulfilmentStatus, "ShopFulfilmentStatusArr")}</span>
        ),
    },
];

class UserModulePersonalDetail extends Component {
    constructor(props) {
        super(props);
        this_Obj = this;
        this.state = {
            userId: 0,
            tabKey: "1",
            competition: null,
            screenKey: null,
            loading: false,
            registrationForm: null,
            isRegistrationForm: false,
            screen: null,
            yearRefId: null,
            competitions: [],
            teams: [],
            divisions: [],
            stripeDashBoardLoad: false,
            umpireActivityOffset: 0,
            UmpireActivityListSortBy: null,
            UmpireActivityListSortOrder: null,
            purchasesOffset: 0,
            purchasesListSortBy: null,
            purchasesListSortOrder: null,
            unlinkOnLoad: false,
            unlinkRecord: null,
            showChildUnlinkConfirmPopup: false,
            showParentUnlinkConfirmPopup: false,
            showCannotUnlinkPopup: false,
            isAdmin: false,
            myRegCurrentPage: 1,
            otherRegCurrentPage: 1,
            childRegCurrentPage: 1,
            teamRegCurrentPage: 1,
            isShowRegistrationTeamMembers: false,
            registrationTeam: null,
            removeTeamMemberLoad: false,
            showRemoveTeamMemberConfirmPopup: false,
            removeTeamMemberRecord: null,
        };
    }

    componentWillMount() {
        const competition = this.getEmptyCompObj();
        this.setState({ competition });
        this.props.getOnlyYearListAction();
    }

    async componentDidMount() {
        const yearRefId = getGlobalYear() ? JSON.parse(getGlobalYear()) : -1;
        this.setState({ yearRefId });
        const isAdmin = getOrganisationData() ? getOrganisationData().userRole == 'admin' : false;
        this.props.getReferenceOrderStatus();
        if (
            this.props.location.state != null
            && this.props.location.state != undefined
        ) {
            const { userId } = this.props.location.state;
            const { screenKey } = this.props.location.state;
            const { screen } = this.props.location.state;
            const tabKey = this.props.location.state.tabKey != undefined
                ? this.props.location.state.tabKey
                : "1";
            await this.setState({
                userId,
                screenKey,
                screen,
                tabKey,
            });
            this.tabApiCalls(
                tabKey,
                this.state.competition,
                userId,
                yearRefId,
            );
            this.apiCalls(userId);
            if (this.state.tabKey == "1") {
                this.handleActivityTableList(
                    1,
                    userId,
                    this.state.competition,
                    "parent",
                );
            }
        }

        this.setState({
            isAdmin,
        });
    }

    componentDidUpdate(nextProps) {
        const { userState } = this.props;
        const personal = userState.personalData;
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                });
            }
        }

        if (
            (this.state.competition.competitionUniqueKey == null || this.state.competition.competitionUniqueKey == "-1")
            && personal.competitions != undefined
            && personal.competitions.length > 0
            && this.props.userState.personalData != nextProps.userState.personalData
        ) {
            // let years = [];
            // let competitions = [];
            // (personal.competitions || []).map((item, index) => {
            //     let obj = {
            //         id: item.yearRefId
            //     }
            //     years.push(obj);
            // });
            const yearRefId = -1;
            this.setState({ yearRefId: -1 });
            if (
                personal.competitions != null
                && personal.competitions.length > 0
                && yearRefId != null
            ) {
                const { competitions } = personal;
                this.generateCompInfo(competitions, yearRefId);
                // this.setState({competitions: competitions, competition: this.getEmptyCompObj()});
                // this.tabApiCalls(this.state.tabKey, this.getEmptyCompObj(), this.state.userId);
            }
        }

        if (this.props.stripeState.onLoad === false && this.state.stripeDashBoardLoad === true) {
            this.setState({ stripeDashBoardLoad: false });
            const stripeDashboardUrl = this.props.stripeState.stripeLoginLink;
            if (stripeDashboardUrl) {
                window.open(stripeDashboardUrl, '_newtab');
            }
        }

        if (this.props.userState.onUpUpdateLoad == false && this.state.unlinkOnLoad == true) {
            const personal = this.props.userState.personalData;
            const organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
            const payload = {
                userId: personal.userId,
                organisationId,
            };
            this.props.getUserModulePersonalByCompetitionAction(payload);
            this.setState({ unlinkOnLoad: false });
        }

        if (this.props.userState.onTeamUpdateLoad == false && this.state.removeTeamMemberLoad == true) {
            const record = this.state.registrationTeam;
            const page = 1;
            const payload = {
                userId: record.userId,
                teamId: record.teamId,
                teamMemberPaging: {
                    limit: 10,
                    offset: page ? 10 * (page - 1) : 0,
                },
            };
            this.props.getUserModuleTeamMembersAction(payload);
            this.setState({ removeTeamMemberLoad: false });
        }
    }

    apiCalls = (userId) => {
        const payload = {
            userId,
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
        };
        this.props.getUserRole(userId);
        this.props.getUserModulePersonalDetailsAction(payload);
        this.props.getUserModulePersonalByCompetitionAction(payload);
    };

    getOrganisationArray(data, roleId) {
        const orgArray = [];
        if (data.length > 0) {
            for (const i in data) {
                if (data[i].roleId == roleId == 19 ? 15 : roleId) {
                    orgArray.push(data[i]);
                    return orgArray;
                }
            }
        }
        return orgArray;
    }

    // getOrderStatus
    getOrderStatus = (value, state) => {
        let statusValue = '';
        const statusArr = this.props.shopOrderStatusState[state];
        const getIndexValue = statusArr.findIndex((x) => x.id == value);
        if (getIndexValue > -1) {
            statusValue = statusArr[getIndexValue].description;
            return statusValue;
        }
        return statusValue;
    }

    parentUnLinkView = (data) => {
        const { userState } = this.props;
        const personal = userState.personalData;
        const organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
        data.section = data.status == "Linked" ? "unlink" : "link";
        data.childUserId = personal.userId;
        data.organisationId = organisationId;
        this.props.userProfileUpdateAction(data);
        this.setState({ unlinkOnLoad: true });
    }

    childUnLinkView = (data) => {
        const { userState } = this.props;
        const personal = userState.personalData;
        const organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
        data.section = data.status == "Linked" ? "unlink" : "link";
        data.parentUserId = personal.userId;
        data.organisationId = organisationId;
        this.props.userProfileUpdateAction(data);
        this.setState({ unlinkOnLoad: true });
    }

    removeTeamMemberView = (data) => {
        data.processType = data.isActive ? "deactivate" : "activate";
        this.props.teamMemberUpdateAction(data);
        this.setState({ removeTeamMemberLoad: true });
    }

    onChangeYear = (value) => {
        const { userState } = this.props;
        const personal = userState.personalData;
        let competitions = [];

        if (value != -1) {
            competitions = personal.competitions.filter((x) => x.yearRefId === value);
            setGlobalYear(value);
        } else {
            competitions = personal.competitions;
        }

        this.generateCompInfo(competitions, value);
    };

    generateCompInfo = (competitions, yearRefId) => {
        const teams = [];
        const divisions = [];
        (competitions || []).map((item, index) => {
            if (item.teams != null && item.teams.length > 0) {
                (item.teams || []).map((i, ind) => {
                    const obj = {
                        teamId: i.teamId,
                        teamName: i.teamName,
                    };
                    if (i.teamId != null) teams.push(obj);
                });
            }

            if (item.divisions != null && item.divisions.length > 0) {
                (item.divisions || []).map((j, ind) => {
                    const div = {
                        divisionId: j.divisionId,
                        divisionName: j.divisionName,
                    };
                    if (j.divisionId != null) {
                        divisions.push(div);
                    }
                });
            }
        });

        let competition = this.getEmptyCompObj();
        if (competitions != null && competitions.length > 0) {
            competition = this.getEmptyCompObj();
        }

        this.setState({
            competitions,
            competition,
            yearRefId,
            teams,
            divisions,
        });

        this.tabApiCalls(
            this.state.tabKey,
            competition,
            this.state.userId,
            yearRefId,
        );
    };

    getEmptyCompObj = () => {
        const competition = {
            team: { teamId: 0, teamName: "" },
            divisionName: "",
            competitionUniqueKey: "-1",
            competitionName: "All",
            year: 0,
        };

        return competition;
    };

    onChangeSetValue = (value) => {
        const { userState } = this.props;
        const personal = userState.personalData;
        if (value != -1) {
            const teams = [];
            const divisions = [];

            const competition = personal.competitions.find(
                (x) => x.competitionUniqueKey === value,
            );

            if (competition.teams != null && competition.teams.length > 0) {
                (competition.teams || []).map((i, ind) => {
                    const obj = {
                        teamId: i.teamId,
                        teamName: i.teamName,
                    };
                    if (i.teamId != null) teams.push(obj);
                });
            }

            if (competition.divisions != null && competition.divisions.length > 0) {
                (competition.divisions || []).map((j, ind) => {
                    const div = {
                        divisionId: j.divisionId,
                        divisionName: j.divisionName,
                    };
                    if (j.divisionId != null) {
                        divisions.push(div);
                    }
                });
            }

            this.setState({
                competition,
                divisions,
                teams,
            });
            this.tabApiCalls(
                this.state.tabKey,
                competition,
                this.state.userId,
                this.state.yearRefId,
            );
        } else {
            this.generateCompInfo(personal.competitions, this.state.yearRefId);
        }
    };

    onChangeTab = (key) => {
        this.setState({ tabKey: key, isRegistrationForm: false, isShowRegistrationTeamMembers: false });
        this.tabApiCalls(
            key,
            this.state.competition,
            this.state.userId,
            this.state.yearRefId,
        );
    };

    tabApiCalls = (tabKey, competition, userId, yearRefId) => {
        const payload = {
            userId,
            competitionId: competition.competitionUniqueKey,
            yearRefId,
        };
        if (tabKey == "1") {
            this.handleActivityTableList(1, userId, competition, "player", yearRefId);
            // this.handleActivityTableList(1, userId, competition, "parent", yearRefId);
            this.handleActivityTableList(1, userId, competition, "scorer", yearRefId);
            this.handleActivityTableList(1, userId, competition, "manager", yearRefId);
            this.handleActivityTableList(1, userId, competition, "umpire", yearRefId);
            this.handleActivityTableList(1, userId, competition, "umpireCoach", yearRefId);
        }
        if (tabKey === "3") {
            this.props.getUserModulePersonalByCompetitionAction(payload);
        } else if (tabKey === "4") {
            this.props.getUserModuleMedicalInfoAction(payload);
        } else if (tabKey === "5") {
            this.handleRegistrationTableList(1, userId, competition, yearRefId);
            // this.handleTeamRegistrationTableList(1, userId, competition, yearRefId);
            // this.handleOtherRegistrationTableList(1, userId, competition, yearRefId);
        } else if (tabKey === "6") {
            this.handleHistoryTableList(1, userId);
        } else if (tabKey === "7") {
            this.handleIncidentableList(1, userId, competition, yearRefId);
        } else if (tabKey === "8") {
            const payload = {
                paging: {
                    limit: 10,
                    offset: 0,
                },
            };
            this.props.getUmpireActivityListAction(payload, JSON.stringify([15]), userId, this.state.UmpireActivityListSortBy, this.state.UmpireActivityListSortOrder);
        } else if (tabKey === "9") {
            this.handlePurchasetableList(1, userId, competition, yearRefId);
        }
    };

    handlePurchasetableList = (page, userId) => {
        const params = {
            limit: 10,
            offset: (page ? (10 * (page - 1)) : 0),
            order: "",
            sorterBy: "",
            userId,
        };
        this.props.getPurchasesListingAction(params);
    }

    handleIncidentableList = (page, userId, competition, yearRefId) => {
        const filter = {
            competitionId: competition.competitionUniqueKey,
            userId,
            yearId: yearRefId,
            limit: 10,
            offset: page ? 10 * (page - 1) : 0,
        };
        this.props.getUserModuleIncidentListAction(filter);
    };

    handleActivityTableList = (page, userId, competition, key, yearRefId) => {
        const filter = {
            competitionId: competition.competitionUniqueKey,
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            userId: this.state.userId,
            yearRefId,
            paging: {
                limit: 10,
                offset: page ? 10 * (page - 1) : 0,
            },
        };
        if (key === "player") this.props.getUserModuleActivityPlayerAction(filter);
        if (key === "parent") this.props.getUserModuleActivityParentAction(filter);
        if (key === "manager") this.props.getUserModuleActivityManagerAction(filter);
        if (key === "scorer") this.props.getScorerData(filter, 4, "ENDED");
        if (key === "umpire") this.props.getUmpireData(filter, 15, "ENDED");
        if (key === "umpireCoach") this.props.getCoachData(filter, 20, "ENDED");
    };

    handleRegistrationTableList = (page, userId, competition, yearRefId, key) => {
        if (key === 'myRegistrations') {
            this.setState({ myRegCurrentPage: page });
        } else if (key === 'otherRegistrations') {
            this.setState({ otherRegCurrentPage: page });
        } else if (key === 'teamRegistrations') {
            this.setState({ teamRegCurrentPage: page });
        } else if (key === 'childRegistrations') {
            this.setState({ childRegCurrentPage: page });
        }
        setTimeout(() => {
            const filter = {
                competitionId: competition.competitionUniqueKey,
                userId,
                organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
                yearRefId,
                myRegPaging: {
                    limit: 10,
                    offset: this.state.myRegCurrentPage ? 10 * (this.state.myRegCurrentPage - 1) : 0,
                },
                otherRegPaging: {
                    limit: 10,
                    offset: this.state.otherRegCurrentPage ? 10 * (this.state.otherRegCurrentPage - 1) : 0,
                },
                teamRegPaging: {
                    limit: 10,
                    offset: this.state.teamRegCurrentPage ? 10 * (this.state.teamRegCurrentPage - 1) : 0,
                },
                childRegPaging: {
                    limit: 10,
                    offset: this.state.childRegCurrentPage ? 10 * (this.state.childRegCurrentPage - 1) : 0,
                },
            };
            this.props.getUserModuleRegistrationAction(filter);
        }, 300);
    };

    showTeamMembers = (record, page) => {
        try {
            this.setState({ isShowRegistrationTeamMembers: true, registrationTeam: record });
            const payload = {
                userId: record.userId,
                teamId: record.teamId,
                teamMemberPaging: {
                    limit: 10,
                    offset: page ? 10 * (page - 1) : 0,
                },
            };
            this.props.getUserModuleTeamMembersAction(payload);
        } catch (ex) {
            console.log(`Error in showTeamMember::${ex}`);
        }
    }

    handleTeamRegistrationTableList = (page, userId, competition, yearRefId) => {
        const filter = {
            competitionId: competition.competitionUniqueKey,
            userId,
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId,
            paging: {
                limit: 10,
                offset: page ? 10 * (page - 1) : 0,
            },
        };
        this.props.getUserModuleTeamRegistrationAction(filter);
    };

    handleOtherRegistrationTableList = (page, userId, competition, yearRefId) => {
        const filter = {
            competitionId: competition.competitionUniqueKey,
            userId,
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId,
            paging: {
                limit: 10,
                offset: page ? 10 * (page - 1) : 0,
            },
        };
        this.props.getUserModuleOtherRegistrationAction(filter);
    };

    handleHistoryTableList = (page, userId) => {
        const filter = {
            userId,
            paging: {
                limit: 10,
                offset: page ? 10 * (page - 1) : 0,
            },
        };
        this.props.getUserHistoryAction(filter);
    };

    /// /pagination handling for umpire activity table list
    handleUmpireActivityTableList = (page, userId) => {
        const offset = page ? 10 * (page - 1) : 0;
        this.setState({ umpireActivityOffset: offset });
        const payload = {
            paging: {
                limit: 10,
                offset,
            },
        };
        this.props.getUmpireActivityListAction(payload, JSON.stringify([15]), userId, this.state.UmpireActivityListSortBy, this.state.UmpireActivityListSortOrder);
    };

    viewRegForm = async (item) => {
        await this.setState({
            isRegistrationForm: true,
            registrationForm: item.registrationForm,
        });
    };

    headerView = () => (
        <Header className="comp-player-grades-header-view container mb-n3">
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.personalDetails}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </Header>
    );

    leftHandSideView = () => {
        const { userState } = this.props;
        const personal = userState.personalData;
        const compititionId = this.state.competition != null
            ? this.state.competition.competitionUniqueKey
            : null;

        return (
            <div className="fluid-width mt-2">
                <div className="profile-image-view mr-5" style={{ marginTop: 20 }}>
                    {/* <span className="user-contact-heading">{AppConstants.playerProfile}</span> */}
                    <div className="circular--landscape">
                        {personal.photoUrl ? (
                            <img src={personal.photoUrl} alt="" />
                        ) : (
                            <span className="user-contact-heading">
                                {AppConstants.noImage}
                            </span>
                        )}
                    </div>
                    <span className="user-contact-heading">
                        {`${personal.firstName} ${personal.lastName}`}
                    </span>

                    <span className="year-select-heading pt-0">
                        {`#${personal.userId}`}
                    </span>
                </div>

                <div className="profile-img-view-style">
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.calendar} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.dateOfBirth}
                            </span>
                        </div>
                        <span className="desc-text-style side-bar-profile-data">
                            {liveScore_formateDate(personal.dateOfBirth) === "Invalid date"
                                ? ""
                                : liveScore_formateDate(personal.dateOfBirth)}
                        </span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.contactNumber}
                            </span>
                        </div>
                        <span className="desc-text-style side-bar-profile-data">
                            {personal.mobileNumber}
                        </span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img
                                    src={AppImages.circleOutline}
                                    alt=""
                                    height="16"
                                    width="16"
                                />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.competition}
                            </span>
                        </div>
                        <Select
                            name="yearRefId"
                            className="user-prof-filter-select w-100"
                            style={{ paddingRight: 1, paddingTop: 15 }}
                            onChange={(yearRefId) => this.onChangeYear(yearRefId)}
                            value={this.state.yearRefId}
                        >
                            <Option key={-1} value={-1}>{AppConstants.all}</Option>
                            {this.props.appState.yearList.map((item) => (
                                <Option key={`year_${item.id}`} value={item.id}>
                                    {item.description}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            className="user-prof-filter-select w-100"
                            style={{ paddingRight: 1, paddingTop: 15 }}
                            onChange={(e) => this.onChangeSetValue(e)}
                            value={compititionId}
                        >
                            <Option key="-1" value="-1">{AppConstants.all}</Option>
                            {(this.state.competitions || []).map((comp) => (
                                <Option
                                    key={`competition_${comp.competitionUniqueKey}`}
                                    value={comp.competitionUniqueKey}
                                >
                                    {comp.competitionName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.team}
                            </span>
                        </div>
                        {((this.state.teams != null && this.state.teams) || []).map(
                            (item) => (
                                <div
                                    key={item.teamId}
                                    className="desc-text-style side-bar-profile-data"
                                >
                                    {item.teamName}
                                </div>
                            ),
                        )}
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img
                                    src={AppImages.circleOutline}
                                    alt=""
                                    height="16"
                                    width="16"
                                />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.division}
                            </span>
                        </div>
                        {((this.state.divisions != null && this.state.divisions) || []).map(
                            (item) => (
                                <div
                                    key={item.divisionId}
                                    className="desc-text-style side-bar-profile-data"
                                >
                                    {item.divisionName}
                                </div>
                            ),
                        )}
                        {/* <span className="desc-text-style side-bar-profile-data">{this.state.competition!= null ? this.state.competition.divisionName : null}</span> */}
                    </div>
                    {/* Umpire Accrediation */}
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.whistleIcon} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.umpireAccreditation}
                            </span>
                            <div className="col-sm d-flex justify-content-end">
                                <span className="year-select-heading  ml-3">
                                    {AppConstants.expiry}
                                </span>
                            </div>
                        </div>
                        <div className="live-score-title-icon-view ml-5">
                            <span className="desc-text-style  side-bar-profile-data">
                                {personal.umpireAccreditationLevel}
                            </span>

                            <div className="col-sm d-flex justify-content-end">
                                <span className="desc-text-style  side-bar-profile-data">
                                    {personal.accreditationUmpireExpiryDate && moment(personal.accreditationUmpireExpiryDate).format("DD-MM-YYYY")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Coach Accrediation */}
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.whistleIcon} alt="" height="16" width="16" />
                            </div>
                            <span className="year-select-heading ml-3">
                                {AppConstants.coachAccreditation}
                            </span>
                            <div className="col-sm d-flex justify-content-end">
                                <span className="year-select-heading  ml-3">
                                    {AppConstants.expiry}
                                </span>
                            </div>
                        </div>
                        <div className="live-score-title-icon-view ml-5">
                            <span className="desc-text-style  side-bar-profile-data">
                                {personal.coachAccreditationLevel}
                            </span>

                            <div className="col-sm d-flex justify-content-end">
                                <span className="desc-text-style  side-bar-profile-data">
                                    {personal.accreditationCoachExpiryDate && moment(personal.accreditationCoachExpiryDate).format("DD-MM-YYYY")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    playerActivityView = () => {
        const { userState } = this.props;
        const { activityPlayerList } = userState;
        const total = userState.activityPlayerTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.playerHeading}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsPlayer}
                        dataSource={activityPlayerList}
                        pagination={false}
                        loading={userState.activityPlayerOnLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end ">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.activityPlayerPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            "player",
                            this.state.yearRefId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    parentActivityView = () => {
        const { userState } = this.props;
        const { activityParentList } = userState;
        const total = userState.activityParentTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.parentHeading}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsParent}
                        dataSource={activityParentList}
                        pagination={false}
                        loading={userState.activityParentOnLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.activityParentPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            "parent",
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    scorerActivityView = () => {
        const { userState } = this.props;
        const activityScorerList = userState.scorerActivityRoster;
        const total = userState.scorerTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.scorerHeading}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsScorer}
                        dataSource={activityScorerList}
                        pagination={false}
                        loading={userState.activityScorerOnLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.scorerCurrentPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            "scorer",
                            this.state.yearRefId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    managerActivityView = () => {
        const { userState } = this.props;
        const { activityManagerList } = userState;
        const total = userState.activityScorerTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.managerHeading}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsManager}
                        dataSource={activityManagerList}
                        pagination={false}
                        loading={userState.activityManagerOnLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.activityManagerPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            "manager",
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    statisticsView = () => (
        <div>
            <h4>Statistics</h4>
        </div>
    );

    personalView = () => {
        const { userState } = this.props;
        const personal = userState.personalData;
        const personalByCompData = userState.personalByCompData != null ? userState.personalByCompData : [];
        const primaryContacts = personalByCompData.length > 0
            ? personalByCompData[0].primaryContacts
            : [];
        const childContacts = personalByCompData.length > 0 ? personalByCompData[0].childContacts : [];
        let countryName = "";
        // let nationalityName = "";
        // let languages = "";
        let childrenCheckNumber = "";
        let childrenCheckExpiryDate = "";
        let userRegId = null;

        if (personalByCompData != null && personalByCompData.length > 0) {
            countryName = personalByCompData[0].countryName;
            // nationalityName = personalByCompData[0].nationalityName;
            // languages = personalByCompData[0].languages;
            userRegId = personalByCompData[0].userRegistrationId;
            childrenCheckNumber = personalByCompData[0].childrenCheckNumber;
            childrenCheckExpiryDate = personalByCompData[0].childrenCheckExpiryDate;
        }

        return (
            <div className="comp-dash-table-view pt-0">

                <div className=" user-module-row-heading d-flex align-items-center mb-0">{AppConstants.address}</div>
                {/* <div className="col-sm justify-content-end d-flex align-items-center">
                        <NavLink to={{ pathname: `https://netball-registration-dev.worldsportaction.com/` }} target="_blank">
                            <Button type="primary">
                                {AppConstants.yourProfile}
                            </Button>
                        </NavLink>
                    </div> */}

                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsPersonalAddress}
                        dataSource={personalByCompData}
                        pagination={false}
                        loading={userState.onPersonLoad && true}
                    />
                </div>
                {/* {primaryContacts != null && primaryContacts.length > 0 && ( */}
                <div>
                    <div
                        className="user-module-row-heading"
                        style={{ marginTop: 30 }}
                    >
                        {AppConstants.parentOrGuardianDetail}
                    </div>
                    <NavLink
                        to={{
                            pathname: `/userProfileEdit`,
                            state: { moduleFrom: "8", userData: personal },
                        }}
                    >
                        <span className="input-heading-add-another" style={{ paddingTop: "unset", marginBottom: "15px" }}>
                            {`+ ${AppConstants.addParent_guardian}`}
                        </span>
                    </NavLink>
                    <div className="table-responsive home-dash-table-view">
                        <Table
                            className="home-dashboard-table"
                            columns={columnsPersonalPrimaryContacts}
                            dataSource={primaryContacts}
                            pagination={false}
                            loading={userState.onPersonLoad && true}
                        />
                    </div>
                </div>
                {/* )} */}
                {(!personal.dateOfBirth || getAge(personal.dateOfBirth) > 18) && (
                    <div>
                        <div
                            className="user-module-row-heading"
                            style={{ marginTop: 30 }}
                        >
                            {AppConstants.childDetails}
                        </div>
                        <NavLink
                            to={{
                                pathname: `/userProfileEdit`,
                                state: { moduleFrom: "7", userData: personal },
                            }}
                        >
                            <span className="input-heading-add-another" style={{ paddingTop: "unset", marginBottom: "15px" }}>
                                {`+ ${AppConstants.addChild}`}
                            </span>
                        </NavLink>
                        <div className="table-responsive home-dash-table-view">
                            <Table
                                className="home-dashboard-table"
                                columns={columnsPersonalChildContacts}
                                dataSource={childContacts}
                                pagination={false}
                                loading={userState.onPersonLoad && true}
                            />
                        </div>
                    </div>
                )}
                <div className="user-module-row-heading" style={{ marginTop: 30 }}>
                    {AppConstants.emergencyContacts}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsPersonalEmergency}
                        dataSource={userState.personalEmergency}
                        pagination={false}
                        loading={userState.onPersonLoad && true}
                    />
                </div>
                <div className="row">
                    <div
                        className="col-sm user-module-row-heading"
                        style={{ marginTop: 30 }}
                    >
                        {AppConstants.otherInformation}
                    </div>
                    <div
                        className="col-sm"
                        style={{ marginTop: 7, marginRight: 15 }}
                    >
                        <div className="comp-buttons-view">
                            <NavLink
                                to={{
                                    pathname: `/userProfileEdit`,
                                    state: { userData: personalByCompData[0], moduleFrom: "4", personalData: personal },
                                }}
                            >
                                <Button className="other-info-edit-btn" type="primary">
                                    {AppConstants.edit}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="table-responsive home-dash-table-view">
                    <div
                        style={{
                            marginTop: 7,
                            marginRight: 15,
                            marginBottom: 15,
                        }}
                    >
                        <div className="other-info-row" style={{ paddingTop: 10 }}>
                            <div className="year-select-heading other-info-label">
                                {AppConstants.gender}
                            </div>
                            <div className="desc-text-style side-bar-profile-data other-info-font">
                                {personalByCompData != null && personalByCompData.length > 0
                                    ? personalByCompData[0].gender
                                    : null}
                            </div>
                        </div>
                        {userRegId != null && (
                            <div>
                                <div className="other-info-row">
                                    <div className="year-select-heading other-info-label">
                                        {AppConstants.countryOfBirth}
                                    </div>
                                    <div className="desc-text-style side-bar-profile-data other-info-font">
                                        {countryName}
                                    </div>
                                </div>
                                {/* <div className="other-info-row">
                                    <div className="year-select-heading other-info-label">
                                        {AppConstants.nationalityReference}
                                    </div>
                                    <div className="desc-text-style side-bar-profile-data other-info-font">
                                        {nationalityName}
                                    </div>
                                </div>
                                <div className="other-info-row">
                                    <div className="year-select-heading other-info-label">
                                        {AppConstants.childLangSpoken}
                                    </div>
                                    <div className="desc-text-style side-bar-profile-data other-info-font">
                                        {languages}
                                    </div>
                                </div> */}
                            </div>
                        )}
                        <div className="other-info-row">
                            <div className="year-select-heading other-info-label">
                                {AppConstants.childrenNumber}
                            </div>
                            <div className="desc-text-style side-bar-profile-data other-info-font">
                                {childrenCheckNumber}
                            </div>
                        </div>
                        <div className="other-info-row">
                            <div
                                className="year-select-heading other-info-label"
                                style={{ paddingBottom: 20 }}
                            >
                                {AppConstants.checkExpiryDate}
                            </div>
                            <div className="desc-text-style side-bar-profile-data other-info-font">
                                {childrenCheckExpiryDate != null
                                    ? moment(childrenCheckExpiryDate).format("DD/MM/YYYY")
                                    : ""}
                            </div>
                        </div>

                        {/* <div className="other-info-row">
                            <div className="year-select-heading other-info-label" style={{ paddingBottom: 20 }}>{AppConstants.disability}</div>
                            <div className="desc-text-style side-bar-profile-data other-info-font">{personal.isDisability == 0 ? "No" : "Yes"}</div>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    };

    medicalView = () => {
        const { userState } = this.props;
        const medical = userState.medicalData;
        // let medical = [];
        // if(medData != null && medData.length > 0){
        //     medData[0]["userId"] = this.state.userId;
        //     medical = medData;
        // }

        return (
            <div>
                {(medical || []).map((item, index) => (
                    <div
                        key={item.userRegistrationId}
                        className="table-responsive home-dash-table-view"
                    >
                        <div
                            className="col-sm"
                            style={{ marginTop: 7, marginRight: 15 }}
                        >
                            <div className="comp-buttons-view">
                                <NavLink
                                    to={{
                                        pathname: `/userProfileEdit`,
                                        state: { userData: item, moduleFrom: "5" },
                                    }}
                                >
                                    <Button className="other-info-edit-btn" type="primary">
                                        {AppConstants.edit}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="d-flex" style={{ marginBottom: "1%" }}>
                            <div className="year-select-heading other-info-label col-sm-2">
                                {AppConstants.existingMedConditions}
                            </div>
                            <div
                                className="desc-text-style side-bar-profile-data other-info-font"
                                style={{ textAlign: "left" }}
                            >
                                {item.existingMedicalCondition}
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="year-select-heading other-info-label col-sm-2">
                                {AppConstants.regularMedicalConditions}
                            </div>
                            <div
                                className="desc-text-style side-bar-profile-data other-info-font"
                                style={{ textAlign: "left" }}
                            >
                                {item.regularMedication}
                            </div>
                        </div>
                        <div className="d-flex" style={{ marginBottom: "3%" }}>
                            <div className="year-select-heading other-info-label col-sm-2">
                                {AppConstants.disability}
                            </div>
                            <div
                                className="desc-text-style side-bar-profile-data other-info-font"
                                style={{ textAlign: "left" }}
                            >
                                {item.isDisability}
                            </div>
                        </div>
                        {item.isDisability === "Yes" && (
                            <div className="comp-dash-table-view mt-2 pl-0">
                                <div className="table-responsive home-dash-table-view">
                                    <Table
                                        className="home-dashboard-table"
                                        columns={columnsMedical}
                                        dataSource={item.disability}
                                        pagination={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    gotoAddTeamMember = () => {
        const { registrationTeam } = this.state;
        history.push("/addTeamMember", { registrationTeam });
    }

    registrationView = () => {
        const { userState } = this.props;
        const { userRegistrationList } = userState;
        // let registrationTotal = userState.userRegistrationDataTotalCount;
        // let userTeamRegistrationList = userState.userTeamRegistrationList;
        // let teamRegistrationTotal = userState.userTeamRegistrationDataTotalCount;
        // let userOtherRegistrationList = userState.userOtherRegistrationList;
        // let OtherRegistrationTotal = userState.userOtherRegistrationDataTotalCount;
        const myRegistrations = userRegistrationList?.myRegistrations.registrationDetails ? userRegistrationList?.myRegistrations.registrationDetails : [];
        const myRegistrationsCurrentPage = userRegistrationList?.myRegistrations.page ? userRegistrationList?.myRegistrations.page.currentPage : 1;
        const myRegistrationsTotalCount = userRegistrationList?.myRegistrations.page.totalCount;
        const otherRegistrations = userRegistrationList?.otherRegistrations.registrationYourDetails ? userRegistrationList?.otherRegistrations.registrationYourDetails : [];
        const otherRegistrationsCurrentPage = userRegistrationList?.otherRegistrations.page ? userRegistrationList?.otherRegistrations.page.currentPage : 1;
        const otherRegistrationsTotalCount = userRegistrationList?.otherRegistrations.page.totalCount;
        const teamRegistrations = userRegistrationList?.teamRegistrations.registrationTeamDetails ? userRegistrationList?.teamRegistrations.registrationTeamDetails : [];
        const teamRegistrationsCurrentPage = userRegistrationList?.teamRegistrations.page ? userRegistrationList?.teamRegistrations.page.currentPage : 1;
        const teamRegistrationsTotalCount = userRegistrationList?.teamRegistrations.page.totalCount;
        const childRegistrations = userRegistrationList?.childRegistrations.childRegistrationDetails ? userRegistrationList?.childRegistrations.childRegistrationDetails : [];
        const childRegistrationsCurrentPage = userRegistrationList?.childRegistrations.page ? userRegistrationList?.childRegistrations.page.currentPage : 1;
        const childRegistrationsTotalCount = userRegistrationList?.childRegistrations.page.totalCount;
        const teamMembers = userState.teamMembersDetails ? userState.teamMembersDetails.teamMembers : [];
        const teamMembersCurrentPage = userState.teamMembersDetails?.page ? userState.teamMembersDetails?.page.currentPage : 1;
        const teamMembersTotalCount = userState.teamMembersDetails?.page.totalCount;
        let organistaionId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
        return (
            <div>
                {this.state.isShowRegistrationTeamMembers == false ? (
                    <div className="comp-dash-table-view mt-2">
                        {isArrayNotEmpty(myRegistrations) && (
                            <div>
                                <div className="user-module-row-heading">
                                    {AppConstants.ownRegistration}
                                </div>
                                <div className="table-responsive home-dash-table-view">
                                    <Table
                                        className="home-dashboard-table"
                                        columns={columns}
                                        dataSource={myRegistrations}
                                        pagination={false}
                                        loading={
                                            this.props.userState.userRegistrationOnLoad
                                        }
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination pb-3"
                                        current={myRegistrationsCurrentPage}
                                        total={myRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(
                                            page,
                                            this.state.userId,
                                            this.state.competition,
                                            this.state.yearRefId,
                                            "myRegistrations",
                                        )}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </div>
                        )}
                        {isArrayNotEmpty(otherRegistrations) && (
                            <div>
                                <div className="user-module-row-heading">
                                    {AppConstants.otherRegistration}
                                </div>
                                <div className="table-responsive home-dash-table-view">
                                    <Table
                                        className="home-dashboard-table"
                                        columns={childOtherRegistrationColumns}
                                        dataSource={otherRegistrations}
                                        pagination={false}
                                        loading={
                                            this.props.userState.userRegistrationOnLoad
                                        }
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination pb-3"
                                        current={otherRegistrationsCurrentPage}
                                        total={otherRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(
                                            page,
                                            this.state.userId,
                                            this.state.competition,
                                            this.state.yearRefId,
                                            "otherRegistrations",
                                        )}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </div>
                        )}
                        {isArrayNotEmpty(childRegistrations) && (
                            <div>
                                <div className="user-module-row-heading">
                                    {AppConstants.childRegistration}
                                </div>
                                <div className="table-responsive home-dash-table-view">
                                    <Table
                                        className="home-dashboard-table"
                                        columns={childOtherRegistrationColumns}
                                        dataSource={childRegistrations}
                                        pagination={false}
                                        loading={
                                            this.props.userState.userRegistrationOnLoad
                                        }
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination pb-3"
                                        current={childRegistrationsCurrentPage}
                                        total={childRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(
                                            page,
                                            this.state.userId,
                                            this.state.competition,
                                            this.state.yearRefId,
                                            "childRegistrations",
                                        )}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </div>
                        )}
                        {isArrayNotEmpty(teamRegistrations) && (
                            <div>
                                <div className="user-module-row-heading">
                                    {AppConstants.teamRegistration}
                                </div>
                                <div className="table-responsive home-dash-table-view">
                                    <Table
                                        className="home-dashboard-table"
                                        columns={teamRegistrationColumns}
                                        dataSource={teamRegistrations}
                                        pagination={false}
                                        loading={
                                            this.props.userState.userRegistrationOnLoad
                                        }
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination pb-3"
                                        current={teamRegistrationsCurrentPage}
                                        total={teamRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(
                                            page,
                                            this.state.userId,
                                            this.state.competition,
                                            this.state.yearRefId,
                                            "teamRegistrations",
                                        )}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="comp-dash-table-view mt-2">
                        <div className="row">
                            <div className="col-sm d-flex align-content-center">
                                <Breadcrumb separator=" > ">
                                    <Breadcrumb.Item
                                        className="breadcrumb-add font-18 pointer"
                                        onClick={() => this.setState({ isShowRegistrationTeamMembers: false })}
                                        style={{ color: "var(--app-color)" }}
                                    >
                                        {AppConstants.Registrations}
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item className="breadcrumb-add font-18">
                                        {AppConstants.teamMembers}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                            {this.state.registrationTeam.organisationUniqueKey == organistaionId && 
                                <div className="add-team-member-action-txt" onClick={() => this.gotoAddTeamMember()}>
                                    +
                                    {' '}
                                    {AppConstants.addTeamMembers}
                                </div>
                            }
                        </div>
                        <div className="user-module-row-heading font-18 mt-2">
                            {`${AppConstants.team}: ${this.state.registrationTeam.teamName}`}
                        </div>
                        <div className="table-responsive home-dash-table-view">
                            <Table
                                className="home-dashboard-table"
                                columns={teamMembersColumns}
                                dataSource={teamMembers}
                                pagination={false}
                                loading={
                                    this.props.userState.getTeamMembersOnLoad
                                }
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <Pagination
                                className="antd-pagination pb-3"
                                current={teamMembersCurrentPage}
                                total={teamMembersTotalCount}
                                onChange={(page) => this.showTeamMembers(
                                    this.state.registrationTeam,
                                    page,
                                )}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    registrationFormView = () => {
        const registrationForm = this.state.registrationForm == null ? [] : this.state.registrationForm;

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="user-module-row-heading">
                    {AppConstants.registrationFormQuestions}
                </div>
                {(registrationForm || []).map((item, index) => (
                    <div key={index} style={{ marginBottom: 15 }}>
                        <InputWithHead heading={item.description} />
                        {(item.registrationSettingsRefId == 6 || item.registrationSettingsRefId == 11) && (
                            <div className="applicable-to-text">
                                {item.contentValue == null
                                    ? AppConstants.noInformationProvided
                                    : item.contentValue}
                            </div>
                        )}
                        {item.registrationSettingsRefId == 7 && (
                            <div>
                                {item.contentValue === "No" ? (
                                    <div className="applicable-to-text">{item.contentValue}</div>
                                ) : (
                                    <div className="table-responsive home-dash-table-view">
                                        <Table
                                            className="home-dashboard-table"
                                            columns={columnsPlayedBefore}
                                            dataSource={item.playedBefore}
                                            pagination={false}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {item.registrationSettingsRefId == 8 && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsFriends}
                                    dataSource={item.friends}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {item.registrationSettingsRefId == 9 && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsFriends}
                                    dataSource={item.referFriends}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {item.registrationSettingsRefId == 10 && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsFav}
                                    dataSource={item.favourites}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {item.registrationSettingsRefId == 12 && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsVol}
                                    dataSource={item.volunteers}
                                    pagination={false}
                                />
                            </div>
                        )}
                    </div>
                ))}
                {registrationForm.length === 0 && (
                    <div>{AppConstants.noInformationProvided}</div>
                )}
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button
                                type="cancel-button"
                                onClick={() => this.setState({ isRegistrationForm: false })}
                            >
                                {AppConstants.back}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    noDataAvailable = () => (
        <div className="d-flex">
            <span className="inside-table-view mt-4">
                {AppConstants.noDataAvailable}
            </span>
        </div>
    );

    resetTfaAction = () => {
        this.props.resetTfaAction(this.state.userId);
    };

    headerView = () => {
        function handleMenuClick(e) {
            history.push("/mergeUserMatches");
        }

        const menu = (
            <Menu>
                <Menu.Item onClick={handleMenuClick} key="merge">
                    {AppConstants.merge}
                </Menu.Item>
                {this.state.isAdmin && (
                    <Menu.Item onClick={this.resetTfaAction} key={AppConstants.resetTFA}>
                        {AppConstants.resetTFA}
                    </Menu.Item>
                )}
            </Menu>
        );

        return (
            <div className="row">
                <div className="col-sm">
                    <Header className="form-header-view bg-transparent d-flex pl-0 justify-content-between mt-5">
                        <Breadcrumb separator=" > ">
                            <NavLink to="/userTextualDashboard">
                                <div className="breadcrumb-add">{AppConstants.userProfile}</div>
                            </NavLink>
                        </Breadcrumb>
                        <Dropdown overlay={menu}>
                            <Button type="primary">
                                {AppConstants.actions}
                                {' '}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Header>
                </div>
                {this.state.screenKey && (
                    <div className="col-sm">
                        <div className="comp-buttons-view mt-4 d-flex align-items-center justify-content-end">
                            <Button
                                onClick={() => history.push(this.state.screen)}
                                className="primary-add-comp-form"
                                type="primary"
                            >
                                {/* {this.state.screenKey === "umpire" ? AppConstants.backToUmpire : AppConstants.backToLiveScore} */}
                                {AppConstants.back}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    historyView = () => {
        const {
            userHistoryList,
            userHistoryPage,
            userHistoryTotalCount,
            userHistoryLoad,
        } = this.props.userState;

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsHistory}
                        dataSource={userHistoryList}
                        pagination={false}
                        loading={userHistoryLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userHistoryPage}
                        total={userHistoryTotalCount}
                        onChange={(page) => this.handleHistoryTableList(page, this.state.userId)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    handleIncidentTableList = (page, userId, competition, yearRefId) => {
        const filter = {
            competitionId: competition.competitionUniqueKey,
            userId,
            yearId: yearRefId,
            limit: 10,
            offset: page ? 10 * (page - 1) : 0,
        };
        this.props.getUserModuleIncidentListAction(filter);
    };

    incidentView = () => {
        const { userState } = this.props;
        const incidentData = userState.userIncidentData;
        const total = userState.incidentTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.playerHeading}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsIncident}
                        dataSource={incidentData}
                        pagination={false}
                        loading={userState.incidentDataLoad}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.incidentCurrentPage}
                        total={total}
                        onChange={(page) => this.handleIncidentTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            this.state.yearRefId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    coachActivityView() {
        const { userState } = this.props;
        const activityCoachList = userState.coachActivityRoster;
        const total = userState.coachTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.coach}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={coachColumn}
                        dataSource={activityCoachList}
                        pagination={false}
                        loading={userState.coachDataLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.coachCurrentPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            "umpireCoach",
                            this.state.yearRefId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    }

    umpireActivityTable() {
        const { userState } = this.props;
        const activityUmpireList = userState.umpireActivityRoster;
        const total = userState.umpireTotalCount;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="user-module-row-heading">
                    {AppConstants.umpire}
                </div>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={umpireColumn}
                        dataSource={activityUmpireList}
                        pagination={false}
                        loading={userState.umpireDataLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userState.umpireCurrentPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(
                            page,
                            this.state.userId,
                            this.state.competition,
                            "umpire",
                            this.state.yearRefId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    }

    umpireActivityView = () => {
        const {
            umpireActivityOnLoad, umpireActivityList, umpireActivityCurrentPage, umpireActivityTotalCount,
        } = this.props.userState;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="transfer-image-view mb-3">
                    <Button className="primary-add-comp-form" type="primary">
                        <div className="row">
                            <div className="col-sm">
                                <img
                                    src={AppImages.export}
                                    alt=""
                                    className="export-image"
                                />
                                {AppConstants.export}
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={umpireActivityColumn}
                        dataSource={umpireActivityList}
                        pagination={false}
                        loading={umpireActivityOnLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end ">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={umpireActivityCurrentPage}
                        total={umpireActivityTotalCount}
                        onChange={(page) => this.handleUmpireActivityTableList(
                            page,
                            this.state.userId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    purchaseActivityView = () => {
        const {
            onLoad, purchasesListingData, purchasesTotalCount, purchasesCurrentPage,
        } = this.props.shopOrderStatusState;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={purchaseActivityColumn}
                        dataSource={purchasesListingData}
                        pagination={false}
                        loading={onLoad}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={purchasesCurrentPage}
                        total={purchasesTotalCount}
                        onChange={(page) => this.handlePurchasetableList(
                            page,
                            this.state.userId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    unlinkCheckParent = (record) => {
        if (record.unlinkedBy && record.status === "Unlinked") {
            if (record.unlinkedBy == record.userId) {
                this.setState({ unlinkRecord: record, showParentUnlinkConfirmPopup: true });
            } else {
                this.setState({ unlinkRecord: record, showCannotUnlinkPopup: true });
            }
        } else {
            this.setState({ unlinkRecord: record, showParentUnlinkConfirmPopup: true });
        }
    }

    unlinkCheckChild = (record) => {
        if (record.unlinkedBy && record.status === "Unlinked") {
            if (record.unlinkedBy == record.userId) {
                this.setState({ unlinkRecord: record, showChildUnlinkConfirmPopup: true });
            } else {
                this.setState({ unlinkRecord: record, showCannotUnlinkPopup: true });
            }
        } else {
            this.setState({ unlinkRecord: record, showChildUnlinkConfirmPopup: true });
        }
    }

    removeTeamMember = (record) => {
        if (record.isActive) {
            this.setState({ removeTeamMemberRecord: record, showRemoveTeamMemberConfirmPopup: true });
        } else {
            this.removeTeamMemberView(record);
        }
    }

    cannotUninkPopup = () => {
        const data = this.state.unlinkRecord;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title="Warning"
                    visible={this.state.showCannotUnlinkPopup}
                    onCancel={() => this.setState({ showCannotUnlinkPopup: false })}
                    footer={[
                        <Button onClick={() => this.setState({ showCannotUnlinkPopup: false })}>
                            {AppConstants.ok}
                        </Button>,
                    ]}
                >
                    {data?.childName
                        ? (
                            <p>
                                {' '}
                                {AppConstants.parentUnlinkMessage}
                            </p>
                        )
                        : <p>{AppConstants.childUnlinkMessage}</p>}
                </Modal>
            </div>
        );
    }

    unlinkChildConfirmPopup = () => {
        const status = this.state.unlinkRecord?.status === "Linked" ? "de-link" : "link";
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.confirm}
                    visible={this.state.showChildUnlinkConfirmPopup}
                    onCancel={() => this.setState({ showChildUnlinkConfirmPopup: false })}
                    footer={[
                        <Button onClick={() => this.setState({ showChildUnlinkConfirmPopup: false })}>
                            {AppConstants.cancel}
                        </Button>,
                        <Button onClick={() => {
                            this.childUnLinkView(this.state.unlinkRecord);
                            this.setState({ showChildUnlinkConfirmPopup: false });
                        }}
                        >
                            {AppConstants.confirm}
                        </Button>,
                    ]}
                >
                    <p>
                        {' '}
                        {`Are you sure you want to ${status} your account?`}
                    </p>
                </Modal>
            </div>
        );
    }

    unlinkParentConfirmPopup = () => {
        const status = this.state.unlinkRecord?.status === "Linked" ? "de-link" : "link";
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.confirm}
                    visible={this.state.showParentUnlinkConfirmPopup}
                    onCancel={() => this.setState({ showParentUnlinkConfirmPopup: false })}
                    footer={[
                        <Button onClick={() => this.setState({ showParentUnlinkConfirmPopup: false })}>
                            {AppConstants.cancel}
                        </Button>,
                        <Button
                            onClick={() => {
                                this.parentUnLinkView(this.state.unlinkRecord);
                                this.setState({ showParentUnlinkConfirmPopup: false });
                            }}
                        >
                            {AppConstants.confirm}
                        </Button>,
                    ]}
                >
                    <p>{`Are you sure you want to ${status} your account?`}</p>
                </Modal>
            </div>
        );
    }

    removeTeamMemberConfirmPopup = () => (
        <div>
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.confirm}
                visible={this.state.showRemoveTeamMemberConfirmPopup}
                onCancel={() => this.setState({ showRemoveTeamMemberConfirmPopup: false })}
                footer={[
                    <Button onClick={() => this.setState({ showRemoveTeamMemberConfirmPopup: false })}>
                        {AppConstants.no}
                    </Button>,
                    <Button
                        onClick={() => {
                            this.removeTeamMemberView(this.state.removeTeamMemberRecord);
                            this.setState({ showRemoveTeamMemberConfirmPopup: false });
                        }}
                    >
                        {AppConstants.yes}
                    </Button>,
                ]}
            >
                <p>{AppConstants.removeFromTeamPopUpMsg}</p>
            </Modal>
        </div>
    )

    render() {
        const {
            activityPlayerList,
            activityManagerList,
            // activityScorerList,
            // activityParentList,
            personalByCompData,
            userRole,
            coachActivityRoster,
            umpireActivityRoster,
            scorerActivityRoster,
        } = this.props.userState;
        const personalDetails = personalByCompData != null ? personalByCompData : [];
        let userRegistrationId = null;
        if (personalDetails != null && personalDetails.length > 0) {
            userRegistrationId = personalByCompData[0].userRegistrationId;
        }

        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.user}
                    menuName={AppConstants.user}
                />
                <InnerHorizontalMenu menu="user" userSelectedKey="1" />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm-3 " style={{ marginBottom: "7%" }}>
                                    {this.leftHandSideView()}
                                </div>

                                <div className="col-sm-9 default-bg">
                                    <div>{this.headerView()}</div>
                                    <div className="inside-table-view mt-4">
                                        <Tabs
                                            activeKey={this.state.tabKey}
                                            onChange={(e) => this.onChangeTab(e)}
                                        >
                                            <TabPane tab={AppConstants.activity} key="1">
                                                {activityPlayerList != null && activityPlayerList.length > 0 && this.playerActivityView()}
                                                {activityManagerList != null && activityManagerList.length > 0 && this.managerActivityView()}

                                                {coachActivityRoster != null && coachActivityRoster.length > 0 && this.coachActivityView()}

                                                {umpireActivityRoster != null && umpireActivityRoster.length > 0 && this.umpireActivityTable()}

                                                {scorerActivityRoster != null && scorerActivityRoster.length > 0 && this.scorerActivityView()}
                                                {/* {activityParentList != null && activityParentList.length > 0 && this.parentActivityView()} */}
                                                {activityPlayerList.length === 0
                                                && activityManagerList.length === 0
                                                && scorerActivityRoster.length === 0
                                                && coachActivityRoster.length === 0
                                                && umpireActivityRoster.length === 0
                                                && this.noDataAvailable()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.statistics} key="2">
                                                {this.statisticsView()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.personalDetails} key="3">
                                                {this.personalView()}
                                            </TabPane>
                                            {userRegistrationId != null && (
                                                <TabPane tab={AppConstants.medical} key="4">
                                                    {this.medicalView()}
                                                </TabPane>
                                            )}
                                            <TabPane tab={AppConstants.registration} key="5">
                                                {!this.state.isRegistrationForm ? this.registrationView() : this.registrationFormView()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.history} key="6">
                                                {this.historyView()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.incident} key="7">
                                                {this.incidentView()}
                                            </TabPane>
                                            {userRole && (
                                                <TabPane tab={AppConstants.umpireActivity} key="8">
                                                    {this.umpireActivityView()}
                                                </TabPane>
                                            )}

                                            <TabPane tab={AppConstants.purchase} key="9">
                                                {this.purchaseActivityView()}
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Loader visible={this.props.userState.onMedicalLoad} />
                        {this.unlinkChildConfirmPopup()}
                        {this.unlinkParentConfirmPopup()}
                        {this.cannotUninkPopup()}
                        {this.removeTeamMemberConfirmPopup()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getUserModulePersonalDetailsAction,
            getUserModuleMedicalInfoAction,
            getUserModuleRegistrationAction,
            getUserModuleTeamMembersAction,
            getUserModuleTeamRegistrationAction,
            getUserModuleOtherRegistrationAction,
            getUserModulePersonalByCompetitionAction,
            getUserModuleActivityPlayerAction,
            getUserModuleActivityParentAction,
            getUserModuleActivityScorerAction,
            getUserModuleActivityManagerAction,
            getOnlyYearListAction,
            getUserHistoryAction,
            getUserModuleIncidentListAction,
            getUserRole,
            getScorerData,
            getUmpireData,
            getCoachData,
            getUmpireActivityListAction,
            getPurchasesListingAction,
            getReferenceOrderStatus,
            registrationResendEmailAction,
            userProfileUpdateAction,
            resetTfaAction,
            teamMemberUpdateAction,
        },
        dispatch,
    );
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState,
        stripeState: state.StripeState,
        shopOrderStatusState: state.ShopOrderStatusState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserModulePersonalDetail);
