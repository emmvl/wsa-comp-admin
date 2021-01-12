import React, { Component } from "react";
import { Layout, Select, DatePicker, Button, Table, Menu } from 'antd';
import './product.scss';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    accountBalanceAction, saveStripeAccountAction,
    getStripeLoginLinkAction, getStripeTransferListAction, exportPaymentApi
} from "../../store/actions/stripeAction/stripeAction";
import { getOrganisationData, getImpersonation } from "../../util/sessionStorage";
import { currencyFormat } from "../../util/currencyFormat";
import Loader from '../../customComponents/loader';
import { liveScore_formateDate } from "../../themes/dateformate";
import StripeKeys from "../stripe/stripeKeys";
import moment from "moment";
import history from 'util/history'
const { Header, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

let this_obj = null;

const columns = [
    {
        title: AppConstants.transferId,
        dataIndex: 'id',
        key: 'id',
        sorter: false,
    },
    {
        title: AppConstants.transactionId,
        dataIndex: 'balance_transaction',
        key: 'balance_transaction',
        sorter: false,
    },
    {
        title: AppConstants.description,
        dataIndex: 'description',
        key: 'description',
        sorter: false,
        render: description => (
            <span>{description ? description : "N/A"}</span>
        )
    },
    {
        title: AppConstants.date,
        dataIndex: 'created',
        key: 'created',
        sorter: false,
        render: created => {
            var date = new Date(created * 1000);
            let finalDate = liveScore_formateDate(date)
            return (
                <span>{finalDate}</span>
            )
        },
    },
    {
        title: AppConstants.amount,
        dataIndex: 'amount',
        key: 'amount',
        sorter: false,
        render: amount => (
            <span>{currencyFormat(amount)}</span>
        ),
    },
    // {
    //     title: 'Action',
    //     dataIndex: 'refund',
    //     key: 'refund',
    //     render: () =>
    //         <Menu
    //             className="action-triple-dot-submenu"
    //             theme="light"
    //             mode="horizontal"
    //             style={{ lineHeight: '25px' }}
    //         >
    //             <SubMenu
    //                 key="sub1"
    //                 title={
    //                     <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
    //                 }
    //             >
    //                 <Menu.Item key="1">
    //                     <span>Full Refund</span>
    //                 </Menu.Item>
    //                 <Menu.Item key="2">
    //                     <span>Partial Refund</span>
    //                 </Menu.Item>
    //             </SubMenu>
    //         </Menu>
    // },
];

class RegistrationPayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: null,
            dateFrom: null,
            dateTo: null,
            competition: "all",
            paymentFor: "all",
            loadingSave: false,
            stripeDashBoardLoad: false,
            isImpersonation: localStorage.getItem('Impersonation') == "true" ? true : false
        }
    }

    componentDidUpdate() {
        if (this.state.isImpersonation) {
            history.push("/paymentDashboard")

        } else {
            if (this.props.stripeState.onLoad === false && this.state.loadingSave === true) {
                this.setState({ loadingSave: false })
                this.props.accountBalanceAction()
            }
            if (this.props.stripeState.onLoad === false && this.state.stripeDashBoardLoad === true) {
                this.setState({ stripeDashBoardLoad: false })
                let stripeDashboardUrl = this.props.stripeState.stripeLoginLink
                if (stripeDashboardUrl) {
                    window.open(stripeDashboardUrl, '_newtab');
                }
            }
        }
    }

    componentDidMount() {

        let urlSplit = this.props.location.search.split("?code=")
        if (this.stripeConnected()) {
            this.props.getStripeTransferListAction(1, null, null)
            this.props.accountBalanceAction()
        } else if (urlSplit[1]) {
            let codeSplit = urlSplit[1].split("&state=")
            let code = codeSplit[0]
            this.props.saveStripeAccountAction(code)
            this.setState({ loadingSave: true })
        }
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    //on export button click
    onExport() {
        this.props.exportPaymentApi("transfer")
    }

    headerView = () => {
        const stripeConnected = this.stripeConnected()
        const isBecsSetupDone = this.isBecsSetupDone();
        return (
            // <Header className="reg-payment-header-view mt-5">
            //     <div className="row">
            //         <div className="col-sm d-flex align-content-center">
            //             <Breadcrumb separator=" > ">
            //                 {/* <Breadcrumb.Item className="breadcrumb-product">{AppConstants.registration}</Breadcrumb.Item> */}
            //                 <Breadcrumb.Item className="breadcrumb-add"> {AppConstants.registrationAccountSummary}</Breadcrumb.Item>
            //             </Breadcrumb>
            //         </div>
            //     </div>
            // </Header>
            // <div className="comp-player-grades-header-drop-down-view">
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm d-flex align-content-center">
                            <span className="form-heading">
                                {AppConstants.dashboard}
                            </span>
                        </div>
                        <div className="col-sm-8 d-flex justify-content-end w-100 flex-row align-items-center">
                            <div className="row">
                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <div className="comp-buttons-view">
                                            {stripeConnected ? (
                                                <Button type="primary mx-4" onClick={() => this.onExport()}>
                                                    <img
                                                        src={AppImages.export}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.exportPayments}
                                                </Button>
                                            ) : ('')}
                                            {isBecsSetupDone ? (
                                                <Button type="primary">
                                                    <img
                                                        src={AppImages.export}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.exportWithdrawals}
                                                </Button>
                                            ) : ('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // </div>
        )
    }

    getYearsForDropdown = () => {
        const currentYear = moment().format('YYYY')
        return [
            currentYear,
            currentYear -1,
            currentYear -2,
        ]
    }

    dropdownView = () => {
        return (
            <div className="row">
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.year} />
                    <Select
                        className="reg-payment-select w-100"
                        style={{ paddingRight: 1, minWidth: 160, maxHeight: 60, minHeight: 44 }}
                        onChange={(year) => this.onYearChange(year)}
                        value={this.state.year}
                        placeholder={AppConstants.selectAYear}
                        allowClear={true}
                    >
                        {this.getYearsForDropdown().map((year) => <option value={year} key={year}>{year}</option>)}
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.dateFrom} />
                    <DatePicker
                        className="reg-payment-datepicker w-100"
                        style={{ minWidth: 160 }}
                        onChange={date => this.dateOnChangeFrom(date)}
                        format="DD-MM-YYYY"
                        showTime={false}
                        placeholder="dd-mm-yyyy"
                        value={this.state.dateFrom ? moment(this.state.dateFrom) : null}
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.dateTo} />
                    <DatePicker
                        className="reg-payment-datepicker w-100"
                        // size="large"
                        style={{ minWidth: 160 }}
                        onChange={date => this.dateOnChangeTo(date)}
                        format="DD-MM-YYYY"
                        showTime={false}
                        placeholder="dd-mm-yyyy"
                        value={this.state.dateTo ? moment(this.state.dateTo) : null}
                    />
                </div>
            </div>
        )
    }

    ///setting the available from date
    dateOnChangeFrom = date => {
        const dateFrom = moment(date).utc().toISOString()
        this.setState({
            dateFrom: dateFrom,
            year: null
        })
        this.handleStripeTransferList(null, {
            year: null,
            startDate: dateFrom,
            endDate: this.state.dateTo
        })
    }

    ////setting the available to date
    dateOnChangeTo = date => {
        const dateTo = moment(date).utc().toISOString()
        this.setState({
            dateTo: dateTo,
            year: null
        })

        this.handleStripeTransferList(null, {
            year: null,
            startDate: this.state.dateFrom,
            endDate: dateTo
        })
    }

    onYearChange = year => {
        this.setState({
            year,
            dateFrom: null,
            dateTo: null
        })
        this.handleStripeTransferList(null, {
            year,
            startDate: null,
            endDate: null
        })
    }

    stripeConnected = () => {
        let orgData = getOrganisationData() ? getOrganisationData() : null
        let stripeAccountID = orgData ? orgData.stripeAccountID : null
        return stripeAccountID
    }

    isBecsSetupDone = () => {
        const orgData = getOrganisationData();
        const becsMandateId = orgData ? orgData.stripeBecsMandateId : null;
        return becsMandateId;
    }

    userEmail = () => {
        let orgData = getOrganisationData() ? getOrganisationData() : null
        let email = orgData && orgData.email ? encodeURIComponent(orgData.email) : ""
        return email
    }

    stripeDashboardLoginUrl = () => {
        this.setState({ stripeDashBoardLoad: true })
        this.props.getStripeLoginLinkAction()
    }

    stripeView = () => {
        let stripeConnected = this.stripeConnected()
        const isBecsSetupDone = this.isBecsSetupDone();
        let accountBalance = this.props.stripeState.accountBalance ? this.props.stripeState.accountBalance.pending : "N/A"
        let userEmail = this.userEmail()
        let stripeConnectURL = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth/test&client_id=${StripeKeys.clientId}&state={STATE_VALUE}&stripe_user[email]=${userEmail}&redirect_uri=${StripeKeys.url}/registrationPayments`
        // let stripeDashboardUrl = `https://dashboard.stripe.com/${stripeConnected}/test/dashboard`
        let isImpersonation = getImpersonation()
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="pb-5 pt-5">
                    <div className="row">
                        <div className="col-sm">
                            <span className="reg-payment-price-text">{stripeConnected ? currencyFormat(accountBalance) : null}</span>
                        </div>
                        <div className="comp-buttons-view">
                            {isImpersonation !== "true" && (
                                <div className="col-sm d-flex justify-content-end">
                                    {stripeConnected ? (
                                        <Button
                                            className="open-reg-button mx-4"
                                            type="primary"
                                            onClick={() => this.stripeDashboardLoginUrl()}
                                        >
                                            {/* <a href={stripeDashboardUrl} className="stripe-connect"> */}
                                            {AppConstants.stripePaymentDashboard}
                                            {/* </a> */}
                                        </Button>
                                    ) : (
                                            <Button
                                                className="open-reg-button"
                                                type="primary"
                                            >
                                                <a href={stripeConnectURL} className="stripe-connect">
                                                    <span>
                                                        {AppConstants.connectToStripe}
                                                    </span>
                                                </a>
                                            </Button>
                                        )}
                                    {isBecsSetupDone ? (
                                    <Button
                                        className="open-reg-button mx-1"
                                        type="primary"
                                        onClick={() => this.stripeDashboardLoginUrl()}
                                    >
                                        {AppConstants.stripeWithdrawalsDashboard}
                                    </Button>
                                ) : (
                                    <Button
                                        className="open-reg-button mx-1"
                                        type="primary"
                                        onClick={() => this.props.history.push('/orgBecsSetup')}
                                    >
                                        {AppConstants.setupStripeForWithdrawals}
                                    </Button>
                                )}
                                </div>
                            )}
                        </div>
                    </div>
                </div >
            </div>
        )
    }

    handleStripeTransferList = (key, params) => {
        let page = this.props.stripeState.stripeTransferListPage
        let stripeTransferList = this.props.stripeState.stripeTransferList
        let starting_after = null
        let ending_before = null
        if (key === "next") {
            ///move forward
            page = parseInt(page) + 1
            let id = (stripeTransferList[stripeTransferList.length - 1]['id']);
            starting_after = id
            ending_before = null
        } else if (key == "Previous") {
            //////move backward
            page = parseInt(page) - 1
            let id = (stripeTransferList[0]['id']);
            starting_after = null
            ending_before = id
        } else {
            // Next or previous button didn't trigger it, change page no to 1 for new data
            page = 1
        }
        if (!params) {
            params = {}
            if (this.state.year)
                params.year = this.state.year
            else if (this.state.dateFrom || this.state.dateTo) {
                if (this.state.dateFrom)
                    params.startDate = this.state.dateFrom
                if (this.state.dateTo)
                    params.endDate = this.state.dateTo
            }
        }
        this.props.getStripeTransferListAction(page, starting_after, ending_before, params)
    }

    ////checking for enabling click on next button or not
    checkNextEnabled = () => {
        let currentPage = this.props.stripeState.stripeTransferListPage
        let totalCount = this.props.stripeState.stripeTransferListTotalCount ? this.props.stripeState.stripeTransferListTotalCount : 1
        let lastPage = Math.ceil(parseInt(totalCount) / 10)
        if (lastPage == currentPage) {
            return false
        } else {
            return true
        }
    }

    transferListView = () => {
        let stripeTransferList = this.props.stripeState.stripeTransferList
        let previousEnabled = this.props.stripeState.stripeTransferListPage == 1 ? false : true
        let nextEnabled = this.checkNextEnabled()
        let currentPage = this.props.stripeState.stripeTransferListPage
        let totalCount = this.props.stripeState.stripeTransferListTotalCount ? this.props.stripeState.stripeTransferListTotalCount : 1
        let totalPageCount = Math.ceil(parseInt(totalCount) / 10)
        return (
            <div>
                <div className="table-responsive home-dash-table-view mt-5 mb-5">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={stripeTransferList}
                        pagination={false}
                    // loading={this.props.stripeState.onLoad && true}
                    />
                </div>
                <div className="reg-payment-pages-div mb-5">
                    <span className="reg-payment-paid-reg-text">{AppConstants.currentPage + " - " + currentPage}</span>
                    <span className="reg-payment-paid-reg-text pt-2">{AppConstants.totalPages + " - " + totalPageCount}</span>
                </div>
                <div className="d-flex justify-content-end paddingBottom80px">
                    <div className="pagination-button-div" onClick={() => previousEnabled && this.handleStripeTransferList("Previous")}>
                        <span
                            style={!previousEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text"
                        >
                            {AppConstants.previous}
                        </span>
                    </div>
                    <div className="pagination-button-div" onClick={() => nextEnabled && this.handleStripeTransferList("next")}>
                        <span
                            style={!nextEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text"
                        >
                            {AppConstants.next}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        return (
            <div className="comp-dash-table-view mt-2">
                {this.dropdownView()}
                {/*
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-payment-white-box-view">
                            <div className="row">
                                <div className="col-sm-2 d-flex align-items-center">
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-price-text">$422,500</span>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-paid-reg-text">Paid Registrations 100</span>
                                </div>
                                <div className="col-sm-2 d-flex justify-content-end align-items-center">
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true" /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className="reg-payment-white-box-view">
                            <div className="row">
                                <div className="col-sm-2 d-flex align-items-center">
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-price-text">$4,732</span>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-paid-reg-text">Outstanding Payments 50</span>
                                </div>
                                <div className="col-sm-2 d-flex justify-content-end align-items-center">
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <div className="reg-payment-white-box-view">
                            <div className="row">
                                <div className="col-sm-2 d-flex align-items-center">
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-price-text">$2,450</span>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-paid-reg-text">Cash Payments 30</span>
                                </div>
                                <div className="col-sm-2 d-flex justify-content-end align-items-center">
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true" /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className="reg-payment-white-box-view">
                            <div className="row">
                                <div className="col-sm-2 d-flex align-items-center">
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-price-text">$16,900</span>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-paid-reg-text">Pending Payments 30</span>
                                </div>
                                <div className="col-sm-2 d-flex justify-content-end align-items-center">
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ marginBottom: "5%" }}>
                    <div className="col-sm">
                        <div className="reg-payment-white-box-view">
                            <div className="row">
                                <div className="col-sm-2 d-flex align-items-center">
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-price-text">$7,605</span>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center align-items-center">
                                    <span className="reg-payment-paid-reg-text">Refunds / Reimbursements 100</span>
                                </div>
                                <div className="col-sm-2 d-flex justify-content-end align-items-center">
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                    </div>
                </div> */}

                {this.transferListView()}
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.finance} menuName={AppConstants.finance} />
                <InnerHorizontalMenu menu="finance" finSelectedKey="2" />
                <Layout >
                    {this.headerView()}
                    {this.stripeView()}
                    <Content>
                        {this.contentView()}
                        <Loader visible={this.props.stripeState.onLoad || this.state.loadingSave} />
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        accountBalanceAction,
        saveStripeAccountAction,
        getStripeLoginLinkAction,
        getStripeTransferListAction,
        exportPaymentApi
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        stripeState: state.StripeState,
        userState: state.UserState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPayments);
