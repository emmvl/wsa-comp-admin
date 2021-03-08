import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Layout, Breadcrumb, Table, Select, Menu, Pagination, DatePicker, Input, Button, Radio, message, Modal, Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { isEmptyArray } from "formik";
import moment from "moment";
import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import { currencyFormat } from "util/currencyFormat";
import history from "util/history";
import {
    getOrganisationData, getPrevUrl, getGlobalYear, setGlobalYear, getLiveScoreCompetiton
} from "util/sessionStorage";
import {
    getCommonRefData,
    getGenderAction,
    registrationPaymentStatusAction,
} from "store/actions/commonAction/commonAction";
import {
    endUserRegDashboardListAction,
    regTransactionUpdateAction,
    exportRegistrationAction,
    setRegistrationListPageSize,
    setRegistrationListPageNumber
} from "store/actions/registrationAction/endUserRegistrationAction";
import { getAllCompetitionAction, registrationFailedStatusUpdate,registrationRetryPaymentAction } from "store/actions/registrationAction/registrationDashboardAction";
import { getAffiliateToOrganisationAction } from "store/actions/userAction/userAction";
import { getOnlyYearListAction } from "store/actions/appAction";
import { liveScorePlayersToCashReceivedAction, liveScorePlayersToPayRetryPaymentAction } from '../../store/actions/LiveScoreAction/liveScoreDashboardAction'

import InputWithHead from "customComponents/InputWithHead";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";
import Loader from '../../customComponents/loader';
import CustomTooltip from 'react-png-tooltip';

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
    {
        paymentType: "Voucher",
        paymentTypeId: 3,
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
                <span className={record.deRegistered ? "input-heading-add-another-strike pt-0" : "input-heading-add-another pt-0"}>{name}</span>
                  
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
        dataIndex: "paidByUsers",
        key: "paidByUsers",
        render: (paidBy, record, index) => (
            <div>
                {(record.paidByUsers || []).map((item, pbu_index) => (

                    record.userId == item.paidByUserId ? <div key={'user_' + pbu_index}>Self</div>
                        : (
                            <div key={'user_' + pbu_index}>
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
    {
        title: "Paid Fee (incl. GST)",
        dataIndex: "paidFee",
        key: "paidFee",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (fee) => (
            <div>
                {fee != null ? currencyFormat(fee) : "$0.00"}
            </div>
        ),
    },
    {
        title: "Pending Fee (incl. GST)",
        dataIndex: "pendingFee",
        key: "pendingFee",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (pendingFee) => (
            <div>
                {pendingFee != null ? currencyFormat(pendingFee) : "$0.00"}
            </div>
        ),
    },
    {
        title: "Due per Match",
        dataIndex: "duePenMatch",
        key: "duePenMatch",
    },
    {
        title: "Due per Instalment",
        dataIndex: "duePerInstalment",
        key: "duePerInstalment",
        render: new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format,
    },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, record, index) => (
           (record.actionView && (record.actionView == 3 ? (record.paymentStatus != "De-Registered" && record.paymentStatus != "Pending De-Registration") : true) ||
           (record.actionView == 0 && (record.paymentStatus == "Registered" || record.paymentStatus == "Pending Registration Fee" ||
           record.paymentStatus == "Pending Competition Fee" || record.paymentStatus == "Pending Membership Fee")))
                ? (
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
                            {/* <Menu.Item key="1">
                                <NavLink to={{ pathname: "/" }}>
                                    <span>View</span>
                                </NavLink>
                            </Menu.Item> */}
                            {
                                record.actionView == 1
                            && (
                                <Menu.Item key="2" onClick={() => this_Obj.setCashPayment(record)}>
                                    <span>Receive Cash Payment</span>
                                </Menu.Item>
                            )

                            }
                            {
                                record.actionView == 2
                            && (
                                <Menu.Item key="2">
                                    <span>Refund</span>
                                </Menu.Item>
                            )
                            }
                            {
                                (record.actionView == 3 && (record.paymentStatus != "De-Registered" && record.paymentStatus != "Pending De-Registration"))
                            && (
                                <Menu.Item key="3" onClick={() => this_Obj.setVoucherPayment(record)}>
                                    <span>Voucher Payment Received</span>
                                </Menu.Item>
                            )
                            }
                            {
                                record.actionView == 4
                                && (
                                    <Menu.Item key="4" onClick={() => this_Obj.setSchoolInvoiceFailed(record)}>
                                        <span>{AppConstants.markAsFailedReg}</span>
                                    </Menu.Item>
                                )
                            }
                            {
                                record.actionView == 5
                                && (
                                    <Menu.Item key="5" onClick={() => this_Obj.setFailedInstalmentRetry(record)}>
                                        <span>{AppConstants.retryPayment}</span>
                                    </Menu.Item>
                                )
                            }
                            {
                                record.actionView == 6
                                && (
                                    <Menu.Item key="6" onClick={() => this_Obj.setFailedRegistrationRetry(record)}>
                                        <span>{AppConstants.retryPayment}</span>
                                    </Menu.Item>
                                )
                            }
                            {
                                record.actionView == 0 && (record.paymentStatus == "Registered" || record.paymentStatus == "Pending Registration Fee" ||
                                record.paymentStatus == "Pending Competition Fee" || record.paymentStatus == "Pending Membership Fee") && (
                                    <Menu.Item key="7" 
                                    onClick={() =>  
                                        history.push("/deregistration", { 
                                            regData: record, 
                                            personal: record,
                                            sourceFrom: AppConstants.ownRegistration,
                                            subSourceFrom: "RegistrationListPage" 
                                        })}
                                    >
                                        <span>{AppConstants.registrationChange}</span>
                                    </Menu.Item>
                                )
                            }

                        </SubMenu>

                    </Menu>
                ) : ""
        ),
    },
];

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: "2020",
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId: "-1",
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
            cashTranferType: 1,
            amount: null,
            selectedRow: null,
            loading: false,
            teamName: null,
            teamId: -1,
            isVoucherPaymentVisible: false,
            otherModalVisible: false,
            modalTitle: null,
            modalMessage: null,
            actionView: 0
        };

        this_Obj = this;

        // this.props.getOnlyYearListAction(this.props.appState.yearList);
    }

    async componentDidMount() {
        const yearId = getGlobalYear() ? getGlobalYear() : -1;
        const { registrationListAction } = this.props.userRegistrationState;
        let page = 1;
        let { sortBy } = this.state;
        let { sortOrder } = this.state;
        const prevUrl = getPrevUrl();
        if (!prevUrl || !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)) {
            this.referenceCalls(this.state.organisationId);

            if (registrationListAction) {
                const { offset } = registrationListAction.payload.paging;
                sortBy = registrationListAction.sortBy;
                sortOrder = registrationListAction.sortOrder;
                const { affiliate } = registrationListAction.payload;
                const { competitionUniqueKey } = registrationListAction.payload;
                const dobFrom = registrationListAction.payload.dobFrom !== "-1" ? moment(registrationListAction.payload.dobFrom).format("YYYY-MM-DD") : this.state.dobFrom;
                const dobTo = registrationListAction.payload.dobTo !== "-1" ? moment(registrationListAction.payload.dobTo).format("YYYY-MM-DD") : this.state.dobTo;
                const { genderRefId } = registrationListAction.payload;
                const { membershipProductId } = registrationListAction.payload;
                const { membershipProductTypeId } = registrationListAction.payload;
                const { paymentId } = registrationListAction.payload;
                const { paymentStatusRefId } = registrationListAction.payload;
                const postalCode = registrationListAction.payload.postalCode == "-1" ? "" : registrationListAction.payload.postalCode;
                const regFrom = registrationListAction.payload.regFrom !== "-1" ? moment(registrationListAction.payload.regFrom).format("YYYY-MM-DD") : this.state.regFrom;
                const regTo = registrationListAction.payload.regTo !== "-1" ? moment(registrationListAction.payload.regTo).format("YYYY-MM-DD") : this.state.regTo;
                const { searchText } = registrationListAction.payload;
                const yearRefId = JSON.parse(yearId);
                const teamName = this.props.location.state ? this.props.location.state.teamName : null;
                const teamId = this.props.location.state ? this.props.location.state.teamId : -1;

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
                    yearRefId,
                    teamName,
                    teamId
                });
                let { userRegDashboardListPageSize } = this.props.userRegistrationState;
                userRegDashboardListPageSize = userRegDashboardListPageSize ? userRegDashboardListPageSize : 10;
                page = Math.floor(offset / userRegDashboardListPageSize) + 1;

                this.handleRegTableList(page);
            } else {
                const teamName = this.props.location.state ? this.props.location.state.teamName : null;
                const teamId = this.props.location.state ? this.props.location.state.teamId : -1;
                this.setState({ teamName, teamId, yearRefId: JSON.parse(yearId) });
                setTimeout(() => {
                    this.handleRegTableList(1);
                }, 300);
            }
        } else {
            history.push("/");
        }
    }

    componentDidUpdate(nextProps) {
        const { userRegistrationState } = this.props;
        if(nextProps.userRegistrationState != userRegistrationState){
            if (this.state.loading == true && userRegistrationState.onTranSaveLoad == false) {
                this.setState({ loading: false });
                this.handleRegTableList(1);
            }
        }
        if(nextProps.liveScoreDashboardState != this.props.liveScoreDashboardState){
            if(this.state.loading == true && this.props.liveScoreDashboardState.onRetryPaymentLoad == false){
                if(this.props.liveScoreDashboardState.retryPaymentSuccess){
                    message.success(this.props.liveScoreDashboardState.retryPaymentMessage);
                }
                this.setState({ loading: false });
                this.handleRegTableList(1);
            }
        }

        if(nextProps.registrationDashboardState!= this.props.registrationDashboardState){
            if(this.state.loading == true && this.props.registrationDashboardState.onRegStatusUpdateLoad == false){
                this.setState({ loading: false });
                this.handleRegTableList(1);
            }
        }
    }

    handleShowSizeChange = async (page, pageSize) => {
        await this.props.setRegistrationListPageSize(pageSize);
        this.handleRegTableList(page);
    }

    handleRegTableList = async (page) => {
        await this.props.setRegistrationListPageNumber(page);
        const {
            organisationId,
            // yearRefId,
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
            sortOrder,
            teamId,
        } = this.state;
        const yearRefId = getGlobalYear() && this.state.yearRefId != -1 ? JSON.parse(getGlobalYear()) : this.state.yearRefId;
        let { userRegDashboardListPageSize } = this.props.userRegistrationState;
        userRegDashboardListPageSize = userRegDashboardListPageSize ? userRegDashboardListPageSize : 10;
        const filter = {
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
            teamId,
            // regFrom: (regFrom !== "-1" && !isNaN(regFrom)) ? moment(regFrom).format("YYYY-MM-DD") : "-1",
            regFrom: (regFrom !== "-1") ? moment(regFrom).format("YYYY-MM-DD") : "-1",
            // regTo: (regTo !== "-1" && !isNaN(regTo)) ? moment(regTo).format("YYYY-MM-DD") : "-1",
            regTo: (regTo !== "-1") ? moment(regTo).format("YYYY-MM-DD") : "-1",
            paging: {
                limit: userRegDashboardListPageSize,
                offset: (page ? (userRegDashboardListPageSize * (page - 1)) : 0),
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
            const newVal = value.toString().split(",");
            newVal.forEach((x) => {
                canCall = Number(x.length) % 4 === 0 && x.length > 0;
            });

            await this.setState({ postalCode: value });

            if (canCall) {
                this.handleRegTableList(1);
            } else if (value.length === 0) {
                this.handleRegTableList(1);
            }
        } else if (key === 'yearRefId') {
            await this.setState({
                yearRefId: value,
            });
            if (value != -1) {
                setGlobalYear(value);
            }
            this.handleRegTableList(1);
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
        const { value } = e.target;

        await this.setState({ searchText: value });

        if (!value) {
            this.handleRegTableList(1);
        }
    };

    onClickSearchIcon = async () => {
        this.handleRegTableList(1);
    };

    updateTransaction = () => {
        const { selectedRow } = this.state;
        let amount = 0;
        if (this.state.cashTranferType == 1) {
            amount = selectedRow.amountToTransfer;
        } else {
            amount = this.state.amount;
        }
        const payload = {
            amount,
            feeType: selectedRow.feeType,
            transactionId: selectedRow.transactionId,
            pendingFee: selectedRow.pendingFee,
        };
        this.props.regTransactionUpdateAction(payload);
        this.setState({ loading: true });
    }

    setCashPayment = (record) => {
        this.setState({
            selectedRow: record, visible: true, amount: 0, cashTranferType: 1,
        });
    }

    setVoucherPayment = (record) => {
        this.setState({
            selectedRow: record, isVoucherPaymentVisible: true,
        });
    }

    setSchoolInvoiceFailed = (record) =>{
        this.setState({
            selectedRow: record, otherModalVisible: true,
            actionView: 4, modalMessage : AppConstants.regFailedModalMsg,
            modalTitle: "Invoice Fail"
        });
    }

    setFailedInstalmentRetry = (record) =>{
        this.setState({
            selectedRow: record, otherModalVisible: true,
            actionView: 5, modalMessage : AppConstants.regRetryInstalmentModalMsg,
            modalTitle: "Failed Instalment Retry"
        });
    }
    setFailedRegistrationRetry = (record) =>{
        this.setState({
            selectedRow: record, otherModalVisible: true,
            actionView: 6, modalMessage : AppConstants.regRetryModalMsg,
            modalTitle: "Failed Registration Retry"
        });
    }


    handleOtherModal = (key) =>{
        const {selectedRow, actionView} = this.state;
        if(actionView == 4){
            if(key == "ok"){
                let payload = {
                    registrationId: selectedRow.registrationUniqueKey
                }
                this.props.registrationFailedStatusUpdate(payload);
                this.setState({loading: true})
            }
        }
        else if(actionView == 5){
            if(key == "ok"){
                let payload = {
                    processTypeName: "instalment",
                    registrationUniqueKey: selectedRow.registrationUniqueKey,
                    userId: selectedRow.userId,
                    divisionId: selectedRow.divisionId,
                    competitionId: selectedRow.competitionUniqueKey
                }
                this.props.liveScorePlayersToPayRetryPaymentAction(payload);
                this.setState({ loading: true });
            }
        }
        else if(actionView == 6){
            if(key == "ok"){
                let payload = {
                    registrationId: selectedRow.registrationUniqueKey,
                }
                this.props.registrationRetryPaymentAction(payload);
                this.setState({ loading: true });
            }
        }
        this.setState({otherModalVisible: false});
    }
    
    receiveCashPayment = (key) => {
        if (key == "cancel") {
            this.setState({ visible: false });
        } else if (key == "ok") {
            const { selectedRow } = this.state;
            // const { pendingFee } = selectedRow;
            const { amountToTransfer } = selectedRow;
            const { amount } = this.state;
            const totalAmt = Number(amountToTransfer) - Number(amount);
            if (totalAmt >= 0) {
                this.setState({ visible: false });
                this.updateTransaction();
            } else {
                message.config({ duration: 0.9, maxCount: 1 });
                message.error("Amount exceeded");
            }
        }
    }

    receiveVoucherPayment = (key) => {
        const { selectedRow } = this.state;
        if (key == "cancel") {
            this.setState({ isVoucherPaymentVisible: false });
        } else if (key == "ok") {
            let payload = {
                processTypeName: selectedRow.processType,
                registrationUniqueKey: selectedRow.registrationUniqueKey,
                userId: selectedRow.userId,
                divisionId: selectedRow.divisionId,
                competitionId: selectedRow.competitionUniqueKey
            }
            this.props.liveScorePlayersToCashReceivedAction(payload);
            this.setState({ isVoucherPaymentVisible: false, loading: true });
        }
    }

    clearFilterByTeamId = () => {
        this.setState({ teamName: null, teamId: -1 });
        setTimeout(() => {
            this.handleRegTableList(1);
        }, 300);
    }

    headerView = () => (
        <div className="comp-player-grades-header-view-design" style={{ marginBottom: -10 }}>
            <div className="row" style={{ marginRight: 42 }}>
                <div className="col-lg-4 col-md-12 d-flex align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.Registrations}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="col-sm d-flex align-items-center justify-content-end">
                    <Button className="primary-add-comp-form" type="primary" onClick={() => this.onExport()}>
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

    onExport = () => {
        const {
            filter, sortBy, sortOrder, searchText,
        } = this.state;
        const params = {
            ...filter,
            paging: {
                limit: 5000,
                offset: filter.paging.offset,
            },
            sortBy,
            sortOrder,
            searchText,
        };

        console.log('params for export', params);
        this.props.exportRegistrationAction(params);
    }

    statusView = () => {
        let paymentStatus = [
            { id: 1, description: "Pending Competition Fee" },
            { id: 2, description: "Pending Membership Fee" },
            { id: 3, description: "Pending Registration Fee" },
            { id: 4, description: "Registered" },
        ];
        return (
            <div className="comp-player-grades-header-view-design" style={{ marginBottom: -10 }}>
                <div className="row" style={{ marginRight: 42 }}>
                    <div className="col-sm-9 padding-right-reg-dropdown-zero">
                        <div className="reg-filter-col-cont status-dropdown d-flex align-items-center justify-content-end pr-2">
                            {this.state.teamName
                                && (
                                    <div className="col-sm pt-1 align-self-center">
                                        <Tag
                                            closable
                                            color="volcano"
                                            style={{ paddingTop: 3, height: 30 }}
                                            onClose={() => { this.clearFilterByTeamId(); }}
                                        >
                                            {this.state.teamName}
                                        </Tag>
                                    </div>
                                )}
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
                                    <Option key={`paymentStatus_${g.id}`} value={g.id}>{g.description}</Option>
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
                                prefix={(
                                    <SearchOutlined
                                        style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={this.onClickSearchIcon}
                                    />
                                )}
                                allowClear
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    dropdownView = () => {
        const affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        if (affiliateToData.affiliatedTo !== undefined) {
            const obj = {
                organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
                name: getOrganisationData() ? getOrganisationData().name : null,
            };

            uniqueValues.push(obj);

            const arr = [...new Map(affiliateToData.affiliatedTo.map((obj) => [obj.organisationId, obj])).values()];
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
                                    onChange={(yearRefId) => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map((item) => (
                                        <Option key={`year_${item.id}`} value={item.id}>
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
                                    onChange={(competitionId) => this.onChangeDropDownValue(competitionId, "competitionUniqueKey")}
                                    value={this.state.competitionUniqueKey}
                                >
                                    <Option key={-1} value="-1">{AppConstants.all}</Option>
                                    {(competitions || []).map((item) => (
                                        <Option
                                            key={`competition_${item.competitionUniqueKey}`}
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
                                    onChange={(e) => this.onChangeDropDownValue(e, "dobFrom")}
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
                                    onChange={(e) => this.onChangeDropDownValue(e, "dobTo")}
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
                                    {(membershipProducts || []).map((g) => (
                                        <Option
                                            key={`membershipProduct_${g.membershipProductUniqueKey}`}
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
                                    {(genderData || []).map((g) => (
                                        <Option key={`gender_${g.id}`} value={g.id}>{g.description}</Option>
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
                                    {(uniqueValues || []).map((org) => (
                                        <Option key={`organisation_${org.organisationId}`} value={org.organisationId}>
                                            {org.name}
                                        </Option>
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
                                            key={`paymentType_${payment.paymentTypeId}`}
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
                                    {(membershipProductTypes || []).map((g) => (
                                        <Option
                                            key={`membershipProductType_${g.membershipProductTypeId}`}
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
                                <div className="year-select-heading">{AppConstants.RegFrom}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "regFrom")}
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
                                <div className="year-select-heading">{AppConstants.RegTo}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, "regTo")}
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
        const { userRegistrationState } = this.props;
        const total = userRegistrationState.userRegDashboardListTotalCount;
        const { feesPaid } = userRegistrationState;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">
                                    No. of Registrations
                                    <CustomTooltip>
                                        <span>{AppConstants.noOfRegistrationsInfo}</span>
                                    </CustomTooltip>
                                </div>
                                <div className="reg-payment-price-text">{total}</div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">Value of Registrations</div>
                                {feesPaid != null
                                    ? <div className="reg-payment-price-text">{currencyFormat(feesPaid)}</div>
                                    : <div className="reg-payment-price-text">0</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        const {
            userRegDashboardListTotalCount,
            userRegDashboardListData,
            userRegDashboardListPage,
            onUserRegDashboardLoad,
            userRegDashboardListPageSize
        } = this.props.userRegistrationState;

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        rowKey={(record, index) => record.orgRegistrationId + index}
                        dataSource={userRegDashboardListData}
                        pagination={false}
                        loading={onUserRegDashboardLoad === true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        showSizeChanger
                        current={userRegDashboardListPage}
                        defaultCurrent={userRegDashboardListPage}
                        defaultPageSize={userRegDashboardListPageSize}
                        total={userRegDashboardListTotalCount}
                        onChange={this.handleRegTableList}
                        onShowSizeChange={this.handleShowSizeChange}
                    />
                </div>
            </div>
        );
    };

    transferModalView() {
        const { selectedRow } = this.state;

        return (
            <Modal
                title="Cash"
                visible={this.state.visible}
                onCancel={() => this.receiveCashPayment("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                onOk={() => this.receiveCashPayment("ok")}
                centered
            >
                <div>
                    {' '}
                    {AppConstants.amount}
                    {' '}
:
                    {' '}
                    {selectedRow ? selectedRow.amountToTransfer : 0}
                </div>
                <Radio.Group
                    className="reg-competition-radio"
                    value={this.state.cashTranferType}
                    onChange={(e) => { this.setState({ cashTranferType: e.target.value }); }}
                >
                    <Radio value={1}>{AppConstants.fullCashAmount}</Radio>
                    {/* <Radio value={2}>{AppConstants.partialCashAmount}</Radio> */}

                    {/* {this.state.cashTranferType == 2 && (
                        <InputWithHead
                            placeholder={AppConstants.amount}
                            value={this.state.amount}
                            onChange={(e) => this.setState({ amount: e.target.value })}
                        />
                    )} */}
                </Radio.Group>
            </Modal>
        );
    }

    voucherReceivedModalView = () => {
        const { selectedRow } = this.state;
        return(
            <Modal
                title="Confirm Qld Fair Play Payment Received"
                visible={this.state.isVoucherPaymentVisible}
                onCancel={() => this.receiveVoucherPayment("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                onOk={() => this.receiveVoucherPayment("ok")}
                centered
            >
                <div>
                    <div>
                    {' '}
                    <span className="popup-head">{AppConstants.name}</span>
:
                    {' '}
                    {selectedRow ? selectedRow.name : 0}
                    </div>
                    <div className="mt-2">
                    {' '}
                    <span className="popup-head">{AppConstants.dob}</span>
:
                    {' '}
                    {selectedRow ? moment(selectedRow.dateOfBirth).format("DD/MM/YYYY") : 0}
                    </div>
                    <div className="mt-2">
                    {' '}
                    <span className="popup-head">{AppConstants.code}</span>
:
                    {' '}
                    {selectedRow ? selectedRow.voucherCode : 0}
                    </div>
                    <div className="mt-2">
                    {' '}
                    <span className="popup-head">{AppConstants.amount}</span>
:
                    {' '}
                    {selectedRow ? currencyFormat(selectedRow.governmentVoucherAmount) : "$0.00"}
                    </div>
                    
                </div>
            </Modal>
        )
    }

    otherModalView = () => {
        const { modalTitle, modalMessage } = this.state;
        return(
            <Modal
                title= {modalTitle}
                visible={this.state.otherModalVisible}
                onCancel={() => this.handleOtherModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Update"
                onOk={() => this.handleOtherModal("ok")}
                centered
            >
               <p style = {{marginLeft: '20px'}}>{modalMessage}</p>
            </Modal>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />

                <InnerHorizontalMenu menu="registration" regSelectedKey="2" />

                <Layout>
                    {this.headerView()}
                    {this.statusView()}

                    <Content>
                        <Loader visible={this.props.userRegistrationState.onTranSaveLoad || this.props.userRegistrationState.onLoad || this.props.liveScoreDashboardState.onRetryPaymentLoad} />
                        {this.dropdownView()}
                        {this.countView()}
                        {this.contentView()}
                        {this.transferModalView()}
                        {this.voucherReceivedModalView()}
                        {this.otherModalView()}
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
        regTransactionUpdateAction,
        exportRegistrationAction,
        liveScorePlayersToCashReceivedAction,
        setRegistrationListPageSize,
        setRegistrationListPageNumber,
        registrationFailedStatusUpdate,
        liveScorePlayersToPayRetryPaymentAction,
        registrationRetryPaymentAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userRegistrationState: state.EndUserRegistrationState,
        userState: state.UserState,
        commonReducerState: state.CommonReducerState,
        appState: state.AppState,
        registrationDashboardState: state.RegistrationDashboardState,
        liveScoreDashboardState: state.LiveScoreDashboardState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
