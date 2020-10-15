import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination, DatePicker, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { isEmptyArray } from "formik";
import moment from "moment";

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import { currencyFormat } from "util/currencyFormat";
import history from "util/history";
import { getOrganisationData, getPrevUrl } from "util/sessionStorage";
import {
    getCommonRefData,
    getGenderAction,
    registrationPaymentStatusAction,
} from "store/actions/commonAction/commonAction";
import { endUserRegDashboardListAction } from "store/actions/registrationAction/endUserRegistrationAction";
import { getAllCompetitionAction } from "store/actions/registrationAction/registrationDashboardAction";
import { getAffiliateToOrganisationAction } from "store/actions/userAction/userAction";
import { getOnlyYearListAction, } from "store/actions/appAction";
import InputWithHead from "customComponents/InputWithHead";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./product.scss";

const { Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

let this_Obj = null;

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
    this_Obj.props.endUserRegDashboardListAction(this_Obj.state.filter, sortBy, sortOrder);
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const payments = [
    {
        paymentType: "Credit Card",
        paymentTypeId: 1,
    },
    {
        paymentType: "Direct Debit",
        paymentTypeId: 2,
    },
];

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (name, record) => (
            <NavLink
                to={{
                    pathname: "/userPersonal",
                    state: {
                        userId: record.userId,
                        screenKey: "registration",
                        screen: "/registration",
                    },
                }}
            >
                <span className="input-heading-add-another pt-0">{name}</span>
            </NavLink>
        ),
    },
    {
        title: "Registration date",
        dataIndex: "registrationDate",
        key: "registrationDate",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (registrationDate) => (
            <div>
                {registrationDate != null ? moment(registrationDate).format("DD/MM/YYYY") : ""}
            </div>
        ),
    },
    {
        title: "Affiliate",
        dataIndex: "affiliate",
        key: "affiliate",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Registration Divisions",
        dataIndex: "divisionName",
        key: "divisionName",
        sorter: true,
        onHeaderCell: () => listeners("registrationDivisions"),
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
        title: "Paid By",
        dataIndex: "paidBy",
        key: "paidBy",
        render: (paidBy, record, index) => {
            return (
                <div>
                    {record.userId == record.paidByUserId ? 'Self' :
                        <NavLink
                            to={{
                                pathname: `/userPersonal`,
                                state: {
                                    userId: record.paidByUserId,
                                    tabKey: "registration"
                                },
                            }}
                        >
                            <span className="input-heading-add-another pt-0">{paidBy}</span>
                        </NavLink>}
                </div>
            )
        },
    },
    {
        title: "Fee (incl. GST)",
        dataIndex: "fee",
        key: "fee",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (fee) => (
            <div>
                {fee != null ? currencyFormat(fee) : ""}
            </div>
        ),
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: () => (
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
                            alt=""
                            width="16"
                            height="16"
                        />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: "/" }}>
                            <span>View</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <span>Refund</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: "2020",
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: "-1",
            dobFrom: "-1",
            dobTo: "-1",
            membershipProductTypeId: -1,
            genderRefId: -1,
            postalCode: "",
            affiliate: -1,
            membershipProductId: -1,
            paymentId: -1,
            visible: false,
            competitionId: "",
            paymentStatusRefId: -1,
            searchText: "",
            regFrom: "-1",
            regTo: "-1",
        }

        this_Obj = this;

        // this.props.getOnlyYearListAction(this.props.appState.yearList);
    }

    async componentDidMount() {
        const { registrationListAction } = this.props.userRegistrationState
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        const prevUrl = getPrevUrl();
        if (!prevUrl || !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)) {
            this.referenceCalls(this.state.organisationId);

            if (registrationListAction) {
                let offset = registrationListAction.payload.paging.offset
                sortBy = registrationListAction.sortBy
                sortOrder = registrationListAction.sortOrder
                let affiliate = registrationListAction.payload.affiliate
                let competitionUniqueKey = registrationListAction.payload.competitionUniqueKey
                let dobFrom = registrationListAction.payload.dobFrom !== "-1" ? moment(registrationListAction.payload.dobFrom).format("YYYY-MM-DD") : this.state.dobFrom
                let dobTo = registrationListAction.payload.dobTo !== "-1" ? moment(registrationListAction.payload.dobTo).format("YYYY-MM-DD") : this.state.dobTo
                let genderRefId = registrationListAction.payload.genderRefId
                let membershipProductId = registrationListAction.payload.membershipProductId
                let membershipProductTypeId = registrationListAction.payload.membershipProductTypeId
                let paymentId = registrationListAction.payload.paymentId
                let paymentStatusRefId = registrationListAction.payload.paymentStatusRefId
                let postalCode = registrationListAction.payload.postalCode == "-1" ? "" : registrationListAction.payload.postalCode
                let regFrom = registrationListAction.payload.regFrom !== "-1" ? moment(registrationListAction.payload.regFrom).format("YYYY-MM-DD") : this.state.regFrom
                let regTo = registrationListAction.payload.regTo !== "-1" ? moment(registrationListAction.payload.regTo).format("YYYY-MM-DD") : this.state.regTo
                let searchText = registrationListAction.payload.searchText
                let yearRefId = registrationListAction.payload.yearRefId

                await this.setState({
                    offset,
                    sortBy,
                    sortOrder,
                    affiliate,
                    competitionUniqueKey,
                    dobFrom,
                    dobTo,
                    genderRefId,
                    membershipProductId,
                    membershipProductTypeId,
                    paymentId,
                    paymentStatusRefId,
                    postalCode,
                    regFrom,
                    regTo,
                    searchText,
                    yearRefId
                })
                page = Math.floor(offset / 10) + 1;

                this.handleRegTableList(page);
            } else {
                this.handleRegTableList(1);
            }
        } else {
            history.push("/");
        }
    }

    handleRegTableList = (page) => {
        const {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            dobFrom,
            dobTo,
            membershipProductTypeId,
            genderRefId,
            postalCode,
            affiliate,
            membershipProductId,
            paymentId,
            paymentStatusRefId,
            searchText,
            regFrom,
            regTo,
            sortBy,
            sortOrder
        } = this.state;

        let filter = {
            organisationUniqueKey: organisationId,
            yearRefId,
            competitionUniqueKey,
            // dobFrom: (dobFrom !== "-1" && !isNaN(dobFrom)) ? moment(dobFrom).format("YYYY-MM-DD") : "-1",
            dobFrom: (dobFrom !== "-1") ? moment(dobFrom).format("YYYY-MM-DD") : "-1",
            // dobTo: (dobTo !== "-1" && !isNaN(dobTo)) ? moment(dobTo).format("YYYY-MM-DD") : "-1",
            dobTo: (dobTo !== "-1") ? moment(dobTo).format("YYYY-MM-DD") : "-1",
            membershipProductTypeId,
            genderRefId,
            postalCode: (postalCode !== "" && postalCode !== null) ? postalCode.toString() : "-1",
            affiliate,
            membershipProductId,
            paymentId,
            paymentStatusRefId,
            searchText,
            // regFrom: (regFrom !== "-1" && !isNaN(regFrom)) ? moment(regFrom).format("YYYY-MM-DD") : "-1",
            regFrom: (regFrom !== "-1") ? moment(regFrom).format("YYYY-MM-DD") : "-1",
            // regTo: (regTo !== "-1" && !isNaN(regTo)) ? moment(regTo).format("YYYY-MM-DD") : "-1",
            regTo: (regTo !== "-1") ? moment(regTo).format("YYYY-MM-DD") : "-1",
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        };

        this.props.endUserRegDashboardListAction(filter, sortBy, sortOrder);

        this.setState({ filter });
    }

    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getGenderAction();
        this.props.getOnlyYearListAction();
        this.props.registrationPaymentStatusAction();
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
                this.handleRegTableList(1);
            } else if (value.length === 0) {
                this.handleRegTableList(1);
            }
        } else {
            let newValue;
            if (key === "dobFrom" || key === "dobTo" || key === "regFrom" || key === "regTo") {
                newValue = value == null ? "-1" : moment(value, "YYYY-mm-dd");
            } else {
                newValue = value;
            }

            await this.setState({
                [key]: newValue,
            });

            this.handleRegTableList(1);
        }
    };

    onKeyEnterSearchText = async (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) {
            this.handleRegTableList(1);
        }
    };

    onChangeSearchText = async (e) => {
        const value = e.target.value;

        await this.setState({ searchText: value });

        if (!value) {
            this.handleRegTableList(1);
        }
    };

    onClickSearchIcon = async () => {
        this.handleRegTableList(1);
    };

    headerView = () => (
        <div className="comp-player-grades-header-view-design" style={{ marginBottom: -10 }}>
            <div className="row" style={{ marginRight: 42 }}>
                <div className="col-lg-4 col-md-12 d-flex align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.Registrations}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="col-sm d-flex align-items-center justify-content-end">
                    <Button className="primary-add-comp-form" type="primary">
                        <div className="row">
                            <div className="col-sm">
                                <img
                                    src={AppImages.export}
                                    className="export-image"
                                    alt=""
                                />
                                {AppConstants.export}
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );

    statusView = () => {
        const { paymentStatus } = this.props.commonReducerState;
        return (
            <div className="comp-player-grades-header-view-design" style={{ marginBottom: -10 }}>
                <div className="row" style={{ marginRight: 42 }}>
                    <div className="col-sm-9 padding-right-reg-dropdown-zero">
                        <div className="reg-filter-col-cont status-dropdown d-flex align-items-center justify-content-end pr-2">
                            <div className="year-select-heading" style={{ width: 90 }}>
                                {AppConstants.status}
                            </div>
                            <Select
                                className="year-select reg-filter-select"
                                style={{ maxWidth: 200 }}
                                onChange={(e) => this.onChangeDropDownValue(e, "paymentStatusRefId")}
                                value={this.state.paymentStatusRefId}
                            >
                                <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                {(paymentStatus || []).map((g) => (
                                    <Option key={g.id} value={g.id}>{g.description}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="col-sm-3 d-flex align-items-center justify-content-end margin-top-24-mobile">
                        <div className="comp-product-search-inp-width">
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
                </div>
            </div>
        );
    };

    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
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

        const { genderData } = this.props.commonReducerState;
        const { competitions, membershipProductTypes, membershipProducts } = this.props.userRegistrationState;
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
                                        <Option key={"yearRefId" + item.id} value={item.id}>
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
                                    onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionUniqueKey")}
                                    value={this.state.competitionUniqueKey}
                                >
                                    <Option key={-1} value={"-1"}>{AppConstants.all}</Option>
                                    {(competitions || []).map(item => (
                                        <Option
                                            key={"competition" + item.competitionUniqueKey}
                                            value={item.competitionUniqueKey}
                                        >
                                            {item.competitionName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont" style={{ marginRight: "30px" }}>
                                <div className="year-select-heading">{AppConstants.dobFrom}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={e => this.onChangeDropDownValue(e, "dobFrom")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    name="dobFrom"
                                    value={this.state.dobFrom !== "-1" && moment(this.state.dobFrom, "YYYY-MM-DD")}
                                />
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.dobTo}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={e => this.onChangeDropDownValue(e, "dobTo")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    name="dobTo"
                                    value={this.state.dobTo !== "-1" && moment(this.state.dobTo, "YYYY-MM-DD")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row reg-filter-row">
                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.product}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "membershipProductId")}
                                    value={this.state.membershipProductId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(membershipProducts || []).map((g, index) => (
                                        <Option
                                            key={g.membershipProductUniqueKey}
                                            value={g.membershipProductUniqueKey}
                                        >
                                            {g.productName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col1 col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.gender}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(e) => this.onChangeDropDownValue(e, "genderRefId")}
                                    value={this.state.genderRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(genderData || []).map((g, index) => (
                                        <Option key={g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.affiliate}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "affiliate")}
                                    value={this.state.affiliate}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(uniqueValues || []).map((org, index) => (
                                        <Option key={org.organisationId} value={org.organisationId}>{org.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.payment}</div>
                                <Select
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "paymentId")}
                                    value={this.state.paymentId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(payments || []).map((payment) => (
                                        <Option
                                            key={payment.paymentTypeId}
                                            value={payment.paymentTypeId}
                                        >
                                            {payment.paymentType}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="row reg-filter-row">
                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.type}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    style={{ minWidth: 100 }}
                                    onChange={(e) => this.onChangeDropDownValue(e, "membershipProductTypeId")}
                                    value={this.state.membershipProductTypeId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(membershipProductTypes || []).map((g, index) => (
                                        <Option
                                            key={g.membershipProductTypeId}
                                            value={g.membershipProductTypeId}
                                        >
                                            {g.membershipProductTypeName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading" style={{ width: 95 }}>{AppConstants.postCode}</div>
                                <div style={{ width: "76%" }}>
                                    <InputWithHead
                                        auto_complete="off"
                                        placeholder={AppConstants.postCode}
                                        onChange={(e) => this.onChangeDropDownValue(e.target.value, "postalCode")}
                                        value={this.state.postalCode}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont" style={{ marginRight: "30px" }}>
                                <div className="year-select-heading">{AppConstants.Regfrom}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={e => this.onChangeDropDownValue(e, "regFrom")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    name="regFrom"
                                    value={this.state.regFrom !== "-1" && moment(this.state.regFrom, "YYYY-MM-DD")}
                                />
                            </div>
                        </div>

                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont">
                                <div className="year-select-heading">{AppConstants.Regto}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={e => this.onChangeDropDownValue(e, "regTo")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    name="regTo"
                                    value={this.state.regTo !== "-1" && moment(this.state.regTo, "YYYY-MM-DD")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    countView = () => {
        let userRegistrationState = this.props.userRegistrationState;
        let total = userRegistrationState.userRegDashboardListTotalCount;
        let feesPaid = userRegistrationState.feesPaid;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of Registrations</div>
                                <div className="reg-payment-price-text">{total}</div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">Value of Registrations</div>
                                {feesPaid != null
                                    ? <div className="reg-payment-price-text">${feesPaid}</div>
                                    : <div className="reg-payment-price-text">0</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        let userRegistrationState = this.props.userRegistrationState;
        let userRegDashboardList = userRegistrationState.userRegDashboardListData;
        let total = userRegistrationState.userRegDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={userRegDashboardList}
                        pagination={false}
                        loading={userRegistrationState.onUserRegDashboardLoad === true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userRegistrationState.userRegDashboardListPage}
                        total={total}
                        onChange={this.handleRegTableList}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />

                <InnerHorizontalMenu menu="registration" regSelectedKey="2" />

                <Layout>
                    {this.headerView()}
                    {this.statusView()}

                    <Content>
                        {this.dropdownView()}
                        {this.countView()}
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
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userRegistrationState: state.EndUserRegistrationState,
        userState: state.UserState,
        commonReducerState: state.CommonReducerState,
        appState: state.AppState,
        registrationDashboardState: state.RegistrationDashboardState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
