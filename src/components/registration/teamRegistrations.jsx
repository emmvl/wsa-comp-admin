import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Table, Select, Pagination, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { isEmptyArray } from "formik";
import Tooltip from "react-png-tooltip";

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import { getOrganisationData } from "util/sessionStorage";
import { getOnlyYearListAction } from "store/actions/appAction";
import { getCommonRefData, getGenderAction, registrationPaymentStatusAction } from "store/actions/commonAction/commonAction";
import { getAffiliateToOrganisationAction } from "store/actions/userAction/userAction";
import { getTeamRegistrationsAction, exportTeamRegistrationAction } from "store/actions/registrationAction/registration";
import { getAllCompetitionAction } from "store/actions/registrationAction/registrationDashboardAction";
import { endUserRegDashboardListAction } from "store/actions/registrationAction/endUserRegistrationAction";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./product.scss";

const { Content } = Layout;
const { Option } = Select;

let this_Obj = null;

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = "ASC";
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === "ASC") {
        sortOrder = "DESC";
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === "DESC") {
        sortBy = sortOrder = null;
    }

    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.getTeamRegistrationsAction(this_Obj.state.filter, sortBy, sortOrder);
}

const columns = [
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
        ),
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
        ),
    },
    {
        title: "Organisation",
        dataIndex: "organisationName",
        key: "organisationName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Team",
        dataIndex: "teamName",
        key: "teamName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "User Reg.Team",
        dataIndex: "userRegTeam",
        key: "userRegTeam",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (userRegTeam, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{userRegTeam}</span>
            </NavLink>
        ),
    },
    {
        title: "User Role",
        dataIndex: "roles",
        key: "roles",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (roles) => (
            <div>
                {(roles || []).map((item) => (
                    <div key={item.roleDesc}>{item.roleDesc}</div>
                ))}
            </div>
        ),
    },
    {
        title: "Team Reg. Type",
        dataIndex: "teamRegType",
        key: "teamRegType",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filterDropdown: true,
        filterIcon: () => (
            <div className="mt-10">
                <Tooltip>
                    <span>{AppConstants.statusContextMsg}</span>
                </Tooltip>
            </div>
        ),
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
];

class TeamRegistrations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organisationUniqueKey: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: "-1",
            filterOrganisation: -1,
            competitionId: "",
            statusRefId: -1,
            searchText: '',
            sortBy: null,
            sortOrder: null,
            roleId: -1
        }

        this_Obj = this;
    }

    async componentDidMount() {
        const { teamRegListAction } = this.props.registrationState

        this.referenceCalls(this.state.organisationUniqueKey);

        this.setState({
            searchText: ''
        })
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (teamRegListAction) {
            let offset = teamRegListAction.payload.paging.offset
            sortBy = teamRegListAction.sortBy
            sortOrder = teamRegListAction.sortOrder
            let competitionUniqueKey = teamRegListAction.payload.competitionUniqueKey
            let filterOrganisation = teamRegListAction.payload.filterOrganisation
            let searchText = teamRegListAction.payload.searchText
            let statusRefId = teamRegListAction.payload.statusRefId
            let yearRefId = teamRegListAction.payload.yearRefId
            let roleId = teamRegListAction.payload.roleId
            await this.setState({ sortBy, sortOrder, competitionUniqueKey, filterOrganisation, searchText, statusRefId, yearRefId, roleId })
            page = Math.floor(offset / 10) + 1;

            this.handleRegTableList(page);
        } else {
            this.handleRegTableList(1);
        }
    }

    handleRegTableList = (page) => {
        const {
            organisationUniqueKey,
            yearRefId,
            competitionUniqueKey,
            filterOrganisation,
            searchText,
            statusRefId,
            sortBy,
            sortOrder,
            roleId
        } = this.state;

        const filter = {
            organisationUniqueKey,
            yearRefId,
            competitionUniqueKey,
            filterOrganisation,
            searchText,
            statusRefId,
            roleId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        };

        this.props.getTeamRegistrationsAction(filter, sortBy, sortOrder);

        this.setState({ filter });
    };

    exportTeamRegistration = () => {
        const obj = {
            organisationUniqueKey: this.state.organisationUniqueKey,
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.competitionUniqueKey,
            filterOrganisation: this.state.filterOrganisation,
            searchText: this.state.searchText,
            statusRefId: this.state.statusRefId,
            roleId: this.state.roleId
        };
        this.props.exportTeamRegistrationAction(obj);

        this.setState({
            load: true,
        });

        this.handleRegTableList(1);
    };

    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getOnlyYearListAction();
    };

    onChangeDropDownValue = async (value, key) => {
        if (key === "yearRefId") {
            await this.setState({ yearRefId: value });
            this.handleRegTableList(1);
        } else if (key === "competitionId") {
            await this.setState({ competitionUniqueKey: value });
            this.handleRegTableList(1);
        } else if (key === "filterOrganisation") {
            await this.setState({ filterOrganisation: value });
            this.handleRegTableList(1);
        } else if (key === "statusRefId") {
            await this.setState({ statusRefId: value });
            this.handleRegTableList(1);
        } else if (key === "roleId") {
            await this.setState({ roleId: value });
            this.handleRegTableList(1);
        }
    };

    onKeyEnterSearchText = async (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.handleRegTableList(1);
        }
    };

    onChangeSearchText = async (e) => {
        const value = e.target.value;

        await this.setState({ searchText: e.target.value });

        if (!value) {
            this.handleRegTableList(1);
        }
    };

    onClickSearchIcon = async () => {
        this.handleRegTableList(1);
    };

    headerView = () => (
        // <div className="comp-player-grades-header-view-design">
        //     <div className="row">
        //         <div className="col-lg-4 col-md-12 d-flex align-items-center">
        //             <Breadcrumb separator=" > ">
        //                 <Breadcrumb.Item className="breadcrumb-add">
        //                     {AppConstants.teamRegistrations}
        //                 </Breadcrumb.Item>
        //             </Breadcrumb>
        //         </div>
        //         <div className="col-sm d-flex align-items-center justify-content-end margin-top-24-mobile">
        //             <div className="comp-product-search-inp-width">
        //                 <Input
        //                     className="product-reg-search-input"
        //                     onChange={this.onChangeSearchText}
        //                     placeholder="Search..."
        //                     onKeyPress={this.onKeyEnterSearchText}
        //                     prefix={
        //                         <SearchOutlined
        //                             style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
        //                             onClick={this.onClickSearchIcon}
        //                         />
        //                     }
        //                     allowClear
        //                 />
        //             </div>
        //         </div>
        //         <div className="col-sm-1 d-flex align-items-center justify-content-end mr-3">
        //             <Button className="primary-add-comp-form" type="primary">
        //                 <div className="row">
        //                     <div className="col-sm">
        //                         <img
        //                             src={AppImages.export}
        //                             alt=""
        //                             className="export-image"
        //                         />
        //                         {AppConstants.export}
        //                     </div>
        //                 </div>
        //             </Button>
        //         </div>
        //     </div>
        // </div>
        <div className="comp-player-grades-header-drop-down-view">
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="com-year-select-heading-view pb-3">
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {AppConstants.teamRegistrations}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                    <div className="col-sm" />
                    <div className="d-flex align-items-center" style={{ marginRight: 25 }}>
                        <div className="comp-product-search-inp-width pb-3">
                            <Input
                                className="product-reg-search-input"
                                onChange={this.onChangeSearchText}
                                placeholder="Search..."
                                onKeyPress={this.onKeyEnterSearchText}
                                value={this.state.searchText}
                                prefix={
                                    <SearchOutlined
                                        style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={this.onClickSearchIcon}
                                    />
                                }
                                allowClear
                            />
                        </div>
                    </div>
                    <div className="d-flex align-items-center" style={{ marginRight: "1%" }}>
                        <div className="d-flex flex-row-reverse button-with-search pb-3">
                            <Button
                                type="primary"
                                className="primary-add-comp-form"
                                onClick={this.exportTeamRegistration}
                                style={{ marginRight: 20 }}
                            >
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
                    </div>
                </div>
            </div>
        </div>
    );

    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        let paymentStatus = [
            { id: 1, description: "Pending Membership" },
            { id: 2, description: "Pending Registration Fee" },
            { id: 3, description: "Registered" },
        ];

        if (affiliateToData.affiliatedTo !== undefined) {
            let obj = {
                organisationId: getOrganisationData().organisationUniqueKey,
                name: getOrganisationData().name,
            };
            uniqueValues.push(obj);
            let arr = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
            if (isEmptyArray) {
                uniqueValues = [...uniqueValues, ...arr];
            }
        }

        const competitions = this.props.registrationState.teamRegistrationTableData.competitionList;
        const roles = this.props.registrationState.teamRegistrationTableData.roles;
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="fluid-width" style={{ marginRight: 55 }}>
                    <div className="row reg-filter-row">
                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.year}</div>
                                <Select
                                    name="yearRefId"
                                    className="year-select reg-filter-select"
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.competition}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select1"
                                    onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionId")}
                                    value={this.state.competitionUniqueKey}
                                >
                                    <Option key={-1} value="-1">{AppConstants.all}</Option>
                                    {(competitions || []).map(item => (
                                        <Option
                                            key={'competition_' + item.competitionUniqueKey}
                                            value={item.competitionUniqueKey}
                                        >
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont" style={{ marginRight: "30px" }}>
                                <div className="year-select-heading">{AppConstants.organisation}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "filterOrganisation")}
                                    value={this.state.filterOrganisation}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(uniqueValues || []).map((org) => (
                                        <Option key={'organisation_' + org.organisationId} value={org.organisationId}>
                                            {org.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont" style={{ marginRight: "30px" }}>
                                <div className="year-select-heading">{AppConstants.status}</div>
                                <Select
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "statusRefId")}
                                    value={this.state.statusRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(paymentStatus || []).map((g) => (
                                        <Option key={'status_' + g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont" style={{ marginRight: "30px" }}>
                                <div className="year-select-heading">{AppConstants.role}</div>
                                <Select
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "roleId")}
                                    value={this.state.roleId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(roles || []).map((g) => (
                                        <Option key={'status_' + g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        const teamRegDashboardList = this.props.registrationState.teamRegistrationTableData;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view table-competition">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={teamRegDashboardList.teamRegistrations}
                        pagination={false}
                        loading={this.props.registrationState.onLoad === true && true}
                    />
                </div>

                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={teamRegDashboardList.page.currentPage}
                        total={teamRegDashboardList.page.totalCount}
                        onChange={this.handleRegTableList}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />

                <InnerHorizontalMenu menu="registration" regSelectedKey="10" />

                <Layout>
                    {this.headerView()}

                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        endUserRegDashboardListAction,
        getAffiliateToOrganisationAction,
        getCommonRefData,
        getGenderAction,
        getOnlyYearListAction,
        getAllCompetitionAction,
        registrationPaymentStatusAction,
        getTeamRegistrationsAction,
        exportTeamRegistrationAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userRegistrationState: state.EndUserRegistrationState,
        userState: state.UserState,
        commonReducerState: state.CommonReducerState,
        appState: state.AppState,
        registrationDashboardState: state.RegistrationDashboardState,
        registrationState: state.RegistrationState
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamRegistrations);
