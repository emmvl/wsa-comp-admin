import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination, Button, Input, DatePicker, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import history from "util/history";
import { getOrganisationData, getPrevUrl } from "util/sessionStorage";
import { getOnlyYearListAction } from "store/actions/appAction";
import { getGenderAction } from "store/actions/commonAction/commonAction";
import {
    getUserDashboardTextualAction,
    exportOrgRegQuestionAction,
    userDeleteAction,
} from "store/actions/userAction/userAction";
import InputWithHead from "customComponents/InputWithHead";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./user.css";

const { Header, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
const { confirm } = Modal;

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
    this_Obj.props.getUserDashboardTextualAction(this_Obj.state.filter, sortBy, sortOrder);
}

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (name, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{name}</span>
            </NavLink>
        ),
    },
    {
        title: "Role",
        dataIndex: "role",
        key: "role",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (role) => (
            <div>
                {(role || []).map((item) => (
                    <div key={item.roleId}>{item.role}</div>
                ))}
            </div>
        ),
    },
    {
        title: "Linked",
        dataIndex: "linked",
        key: "linked",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (linked) => (
            <div>
                {(linked || []).map((item) => (
                    <div key={item.linkedEntityId}>{item.linked}</div>
                ))}
            </div>
        ),
    },
    {
        title: "Competition",
        dataIndex: "competition",
        key: "competition",
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (competition) => (
            <div>
                {(competition || []).map((item) => (
                    <div key={item.competitionId}>{item.competitionName}</div>
                ))}
            </div>
        ),
    },
    {
        title: "Team",
        dataIndex: "team",
        key: "team",
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team) => (
            <div>
                {(team || []).map((item) => (
                    <div key={item.teamId}>{item.team}</div>
                ))}
            </div>
        ),
    },
    {
        title: "DOB",
        dataIndex: "dateOfBirth",
        key: "dateOfBirth",
        sorter: true,
        onHeaderCell: () => listeners("dob"),
        render: (dateOfBirth) => (
            <div>
                {dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e) => (
            isUsed === false && (
                <Menu
                    className="action-triple-dot-submenu"
                    theme="light"
                    mode="horizontal"
                    style={{ lineHeight: "25px" }}
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <img
                                className="dot-image"
                                src={AppImages.moreTripleDot}
                                width="16"
                                height="16"
                                alt=""
                            />
                        }
                    >
                        <Menu.Item key="1">
                            <NavLink to={{ pathname: "/userPersonal", state: { userId: e.userId } }}>
                                <span>Edit</span>
                            </NavLink>
                        </Menu.Item>
                        {!e.role.find(x => x.role === "Admin") && (
                            <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e)}>
                                <span>Delete</span>
                            </Menu.Item>
                        )}
                    </SubMenu>
                </Menu>
            )
        ),
    },
];

class UserTextualDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: "-1",
            roleId: -1,
            genderRefId: -1,
            linkedEntityId: "-1",
            postalCode: "",
            searchText: "",
            deleteLoading: false,
            dobFrom: "-1",
            dobTo: "-1",
            sortBy: null,
            sortOrder: null,
            offsetData: 0,
            postCode: null
        };

        this_Obj = this;
    }

    async  componentDidMount() {
        const prevUrl = getPrevUrl();

        const { userTextualDasboardListAction } = this.props.userState
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (userTextualDasboardListAction) {
            let offsetData = userTextualDasboardListAction.payload.paging.offset
            sortBy = userTextualDasboardListAction.sortBy
            sortOrder = userTextualDasboardListAction.sortOrder
            let dobFrom = userTextualDasboardListAction.payload.dobFrom !== "-1" ? moment(userTextualDasboardListAction.payload.dobFrom).format("YYYY-MM-DD") : this.state.dobFrom
            let dobTo = userTextualDasboardListAction.payload.dobTo !== "-1" ? moment(userTextualDasboardListAction.payload.dobTo).format("YYYY-MM-DD") : this.state.dobTo
            let genderRefId = userTextualDasboardListAction.payload.genderRefId
            let linkedEntityId = userTextualDasboardListAction.payload.linkedEntityId
            let postalCode = userTextualDasboardListAction.payload.postCode == "-1" ? "" : userTextualDasboardListAction.payload.postCode
            let roleId = userTextualDasboardListAction.payload.roleId
            let searchText = userTextualDasboardListAction.payload.searchText
            let yearRefId = userTextualDasboardListAction.payload.yearRefId
            await this.setState({ offsetData, sortBy, sortOrder, dobFrom, dobTo, genderRefId, linkedEntityId, postalCode, roleId, searchText, yearRefId })
            page = Math.floor(offsetData / 10) + 1;
        }

        if (!prevUrl || !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)) {
            this.referenceCalls();
            this.handleTextualTableList(page);
        } else {
            history.push("/");
        }
    }

    componentDidUpdate(nextProps) {
        let userState = this.props.userState;

        if (userState.onLoad === false && this.state.deleteLoading === true) {
            this.setState({
                deleteLoading: false,
                searchText: "",
            });

            this.handleTextualTableList(1);
        }

        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({ loading: false });
            }
        }
    }

    referenceCalls = () => {
        this.props.getGenderAction();
        this.props.getOnlyYearListAction();
    };

    showDeleteConfirm = (user) => {
        let this_ = this
        let name = user.name
        confirm({
            title: `Do you really want to delete the user "${name}"?`,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            className: "user-delete-text",
            onOk() {
                this_.deleteUserId(user);
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    deleteUserId = (user) => {
        let linkedList = user.linked;
        let organisations = [];
        linkedList.forEach((item) => {
            organisations.push({
                linkedEntityId: item.linkedEntityId,
            });
        });

        this.props.userDeleteAction({
            userId: user.userId,
            organisations,
        });

        this.setState({ deleteLoading: true });
    };

    onChangeDropDownValue = async (value, key) => {
        if (key === "postalCode") {
            // const regex = /,/gi;
            let canCall = false;
            let newVal = value.toString().split(",");
            newVal.forEach((x) => {
                canCall = Number(x.length) % 4 === 0 && x.length > 0;
            });

            await this.setState({ postalCode: value });

            if (canCall) {
                this.handleTextualTableList(1);
            } else if (value.length === 0) {
                this.handleTextualTableList(1);
            }
        } else {
            let newValue;
            if (key === "dobFrom" || key === "dobTo") {
                newValue = value == null ? "-1" : moment(value, "YYYY-mm-dd");
            } else {
                newValue = value;
            }

            await this.setState({
                [key]: newValue,
            });

            this.handleTextualTableList(1);
        }
    };

    onKeyEnterSearchText = async (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) {
            this.handleTextualTableList(1);
        }
    };

    onChangeSearchText = async (e) => {
        const value = e.target.value;

        await this.setState({ searchText: value });

        if (!value) {
            this.handleTextualTableList(1);
        }
    };

    onClickSearchIcon = async () => {
        this.handleTextualTableList(1);
    };

    handleTextualTableList = (page) => {
        const {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            roleId,
            genderRefId,
            linkedEntityId,
            dobFrom,
            dobTo,
            postalCode,
            searchText,
        } = this.state;

        const filter = {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            roleId,
            genderRefId,
            linkedEntityId,
            // dobFrom: (dobFrom !== "-1" && !isNaN(dobFrom)) ? moment(dobFrom).format("YYYY-MM-DD") : "-1",
            dobFrom: (dobFrom !== "-1") ? moment(dobFrom).format("YYYY-MM-DD") : "-1",
            // dobTo: (dobTo !== "-1" && !isNaN(dobTo)) ? moment(dobTo).format("YYYY-MM-DD") : "-1",
            dobTo: (dobTo !== "-1") ? moment(dobTo).format("YYYY-MM-DD") : "-1",
            postCode: (postalCode !== "" && postalCode !== null) ? postalCode.toString() : "-1",
            searchText,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : this.state.offsetData),
            },
        };

        this.props.getUserDashboardTextualAction(filter, this.state.sortBy, this.state.sortOrder);

        this.setState({ filter });
    };

    exportOrgRegistrationQuestions = () => {
        const {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            roleId,
            genderRefId,
            linkedEntityId,
            postalCode,
            searchText,
        } = this.state;

        const filter = {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            roleId,
            genderRefId,
            linkedEntityId,
            postCode: (postalCode !== "" && postalCode !== null) ? postalCode.toString() : "-1",
            searchText,
        };

        this.props.exportOrgRegQuestionAction(filter);
    };

    headerView = () => (
        <Header className="comp-player-grades-header-view" style={{ padding: "0px 50px 0 45px" }}>
            <div className="row">
                <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.userProfile}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="col-sm search-flex">
                    <div className="row">
                        <div style={{ marginRight: 25, marginTop: -12 }}>
                            <div className="reg-product-search-inp-width">
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

                        <div>
                            <div className="comp-dashboard-botton-view-mobile">
                                <Button
                                    type="primary"
                                    className="primary-add-comp-form"
                                    onClick={this.exportOrgRegistrationQuestions}
                                >
                                    <div className="row">
                                        <div className="col-sm">
                                            <img
                                                className="export-image"
                                                src={AppImages.export}
                                                alt=""
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
        </Header>
    );

    dropdownView = () => {
        const { genderData } = this.props.commonReducerState;
        const { competitions, organisations, roles } = this.props.userState;

        let competitionList;
        if (this.state.yearRefId !== -1) {
            competitionList = competitions.filter(x => x.yearRefId === this.state.yearRefId);
        } else {
            competitionList = competitions;
        }

        return (
            <div style={{ paddingLeft: "3.0%" }}>
                <div className="fluid-width" style={{ marginRight: 35 }}>
                    <div className="row user-filter-row">
                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.year}</div>
                                <Select
                                    name="yearRefId"
                                    className="year-select user-filter-select-drop"
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

                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.competition}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select user-filter-select-drop"
                                    onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionUniqueKey")}
                                    value={this.state.competitionUniqueKey}
                                >
                                    <Option key="-1" value="-1">{AppConstants.all}</Option>
                                    {(competitionList || []).map((item) => (
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

                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.roles}</div>
                                <Select
                                    className="year-select user-filter-select-drop"
                                    onChange={(e) => this.onChangeDropDownValue(e, "roleId")}
                                    value={this.state.roleId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(roles || []).map((role) => (
                                        <Option key={'role_' + role.id} value={role.id}>{role.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.gender}</div>
                                <Select
                                    className="year-select user-filter-select-drop"
                                    onChange={(e) => this.onChangeDropDownValue(e, "genderRefId")}
                                    value={this.state.genderRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(genderData || []).map((g) => (
                                        <Option key={'gender_' + g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="row user-filter-row">
                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.linked}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select user-filter-select-drop"
                                    style={{ minWidth: 100 }}
                                    onChange={(e) => this.onChangeDropDownValue(e, "linkedEntityId")}
                                    value={this.state.linkedEntityId}
                                >
                                    <Option key="-1" value="-1">{AppConstants.all}</Option>
                                    {(organisations || []).map((g) => (
                                        <Option
                                            key={'organisation_' + g.organisationUniqueKey}
                                            value={g.organisationUniqueKey}
                                        >
                                            {g.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-postal">
                                <div className="year-select-heading select-heading-wid">{AppConstants.postCode}</div>
                                <div style={{ width: '100%' }}>
                                    <InputWithHead
                                        placeholder={AppConstants.postCode}
                                        onChange={(e) => this.onChangeDropDownValue(e.target.value, "postalCode")}
                                        value={this.state.postalCode}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.dobFrom}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select user-filter-select-cal"
                                    onChange={e => this.onChangeDropDownValue(e, "dobFrom")}
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    name="dobFrom"
                                    placeholder="dd-mm-yyyy"
                                    value={this.state.dobFrom !== "-1" && moment(this.state.dobFrom, "YYYY-MM-DD")}
                                />
                            </div>
                        </div>

                        <div className="user-col col-lg-3 col-md-6">
                            <div className="user-filter-col-cont">
                                <div className="year-select-heading select-heading-wid">{AppConstants.dobTo}</div>
                                <DatePicker
                                    placeholder="dd-mm-yyyy"
                                    size="large"
                                    className="year-select user-filter-select-cal"
                                    onChange={e => this.onChangeDropDownValue(e, "dobTo")}
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    name="dobTo"
                                    value={this.state.dobTo !== "-1" && moment(this.state.dobTo, "YYYY-MM-DD")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    countView = () => {
        const { userDashboardCounts } = this.props.userState;
        let noOfRegisteredUsers = userDashboardCounts !== null ? userDashboardCounts.noOfRegisteredUsers : 0;
        let noOfUsers = userDashboardCounts !== null ? userDashboardCounts.noOfUsers : 0;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of Users</div>
                                <div className="reg-payment-price-text">{noOfUsers}</div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of Registered Users</div>
                                <div className="reg-payment-price-text">{noOfRegisteredUsers}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        let userState = this.props.userState;
        let userDashboardTextualList = userState.userDashboardTextualList;
        let total = userState.userDashboardTextualTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={userDashboardTextualList}
                        pagination={false}
                        loading={this.props.userState.onTextualLoad === true}
                    />
                </div>

                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.userDashboardTextualPage}
                        total={total}
                        onChange={this.handleTextualTableList}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />

                <InnerHorizontalMenu menu="user" userSelectedKey="1" />

                <Layout>
                    {this.headerView()}

                    <Form autoComplete="off">
                        <Content>
                            {this.dropdownView()}
                            {this.countView()}
                            {this.contentView()}
                        </Content>
                    </Form>

                    <Loader visible={this.props.userState.onExpOrgRegQuesLoad} />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserDashboardTextualAction,
        getOnlyYearListAction,
        getGenderAction,
        exportOrgRegQuestionAction,
        userDeleteAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTextualDashboard);
