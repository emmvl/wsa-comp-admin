import React, { Component } from "react";
import { Layout, Breadcrumb, Select, DatePicker, Button, Table } from 'antd';
import './product.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    accountBalanceAction, saveStripeAccountAction,
    getStripeLoginLinkAction, getStripeTransferListAction,
} from "../../store/actions/stripeAction/stripeAction";
import { getOrganisationData } from "../../util/sessionStorage";
import { currencyFormat } from "../../util/currencyFormat";
import Loader from '../../customComponents/loader';
import { liveScore_formateDate } from './../../themes/dateformate';
import moment from 'moment'

const { Header, Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: "Transaction Id",
        dataIndex: 'balance_transaction',
        key: 'balance_transaction',
        sorter: (a, b) => tableSort(a, b, "balance_transaction")
    },
    {
        title: "Description",
        dataIndex: 'description',
        key: 'description',
        sorter: (a, b) => tableSort(a, b, "description")
    },
    {
        title: "Date",
        dataIndex: 'created',
        key: 'created',
        sorter: (a, b) => tableSort(a, b, "created"),
        render: created => {
            var date = new Date(created * 1000);
            let finalDate = liveScore_formateDate(date)
            return (
                <span>{finalDate}</span>
            )
        },
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: amount => (
            <span>{currencyFormat(amount)}</span>
        ),
        sorter: (a, b) => tableSort(a, b, "amount")
    },

];


class RegistrationPayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2017",
            competition: "all",
            paymentFor: "all",
            loadingSave: false,
            stripeDashBoardLoad: false,
        }
    }


    componentDidUpdate() {
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


    componentDidMount() {
        let urlSplit = this.props.location.search.split("?code=")
        this.props.getStripeTransferListAction()
        if (this.stripeConnected()) {
            this.props.accountBalanceAction()
        }
        else if (urlSplit[1]) {
            let codeSplit = urlSplit[1].split("&state=")
            let code = codeSplit[0]
            this.props.saveStripeAccountAction(code)
            this.setState({ loadingSave: true })
        }
    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };


    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="reg-payment-header-view mt-5" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            {/* <Breadcrumb.Item className="breadcrumb-product">{AppConstants.registration}</Breadcrumb.Item> */}
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.registrationAccountSummary}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="fluid-width" >
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.year} />
                        <Select
                            className="reg-payment-select"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(year) => this.setState({ year })}
                            value={this.state.year}
                        >
                            <Option value={"2019"}>{AppConstants.year2019}</Option>
                            <Option value={"2018"}>{AppConstants.year2018}</Option>
                            <Option value={"2017"}>{AppConstants.year2017}</Option>
                            <Option value={"2016"}>{AppConstants.year2016}</Option>
                        </Select>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.competition} />

                        <Select
                            className="reg-payment-select"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(competition) => this.setState({ competition })}
                            value={this.state.competition}
                        >
                            <Option value={"all"}>{AppConstants.all}</Option>
                            <Option value={"2018"}>{AppConstants.year2018}</Option>
                            <Option value={"2017"}>{AppConstants.year2017}</Option>
                            <Option value={"2016"}>{AppConstants.year2016}</Option>
                        </Select>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.paymentFor} />
                        <Select
                            className="reg-payment-select"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(paymentFor) => this.setState({ paymentFor })}
                            value={this.state.paymentFor}
                        >
                            <Option value={"all"}>{AppConstants.all}</Option>
                            <Option value={"2018"}>{AppConstants.year2018}</Option>
                            <Option value={"2017"}>{AppConstants.year2017}</Option>
                            <Option value={"2016"}>{AppConstants.year2016}</Option>
                        </Select>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.dateFrom} />
                        <DatePicker
                            className="reg-payment-datepicker"
                            size="large"
                            style={{ width: "100%" }}
                            onChange={date => this.dateOnChangeFrom(date)}
                            format={'DD-MM-YYYY'}
                            showTime={false}
                            placeholder="dd/mm/yyyy"
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.dateTo} />
                        <DatePicker
                            className="reg-payment-datepicker"
                            size="large"
                            style={{ width: "100%" }}
                            onChange={date => this.dateOnChangeTo(date)}
                            format={'DD-MM-YYYY'}
                            showTime={false}
                            placeholder="dd/mm/yyyy"

                        />
                    </div>
                </div>
            </div>
        )
    }

    ///setting the available from date
    dateOnChangeFrom = date => {
        // this.setState({ endDate: moment(date).utc().toISOString() })
        console.log(date)
    }

    ////setting the available to date
    dateOnChangeTo = date => {
        console.log(date)
    }

    stripeConnected = () => {
        let orgData = getOrganisationData()
        let stripeAccountID = orgData ? orgData.stripeAccountID : null
        return stripeAccountID
    }

    userEmail = () => {
        let orgData = getOrganisationData()
        let email = orgData ? orgData.email : ""
        return email
    }

    stripeDashboardLoginUrl = () => {
        this.setState({ stripeDashBoardLoad: true })
        this.props.getStripeLoginLinkAction()
    }

    stripeView = () => {
        let stripeConnected = this.stripeConnected()
        let accountBalance = this.props.stripeState.accountBalance ? this.props.stripeState.accountBalance.pending : "N/A"
        let userEmail = this.userEmail()
        let stripeConnectURL = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth/test&client_id=ca_GoE4DQeJGNAvRzAq6MJOmZ8xmFTeLgan&state={STATE_VALUE}&stripe_user[email]=${userEmail}&redirect_uri=https://netball-comp-admin-dev.worldsportaction.com/registrationPayments`
        let stripeDashboardUrl = `https://dashboard.stripe.com/${stripeConnected}/test/dashboard`
        return (
            <div className="pb-5">
                <div className="row">
                    <div className="col-sm">
                        <span className="reg-payment-price-text">{stripeConnected ? currencyFormat(accountBalance) : null}</span>
                    </div>
                    <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                        {stripeConnected ?
                            <Button
                                className="open-reg-button"
                                type="primary"
                                onClick={() => this.stripeDashboardLoginUrl()}
                            >
                                {/* <a href={stripeDashboardUrl} class="stripe-connect"> */}
                                {AppConstants.goToStripeDashboard}
                                {/* </a> */}
                            </Button>
                            :
                            <Button
                                className="open-reg-button"
                                type="primary"
                            >
                                <a href={stripeConnectURL} class="stripe-connect">
                                    <span>
                                        {AppConstants.connectToStripe}
                                    </span>
                                </a>
                            </Button>
                        }
                    </div>
                </div>
            </div>
        )
    }


    ////////form content view
    contentView = () => {
        console.log("stripeState", this.props.stripeState)
        let stripeTransferList = this.props.stripeState.stripeTransferList
        return (
            <div >
                {this.dropdownView()}

                <div className="row" >
                    <div className="col-sm">
                        <div className="reg-payment-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-price-text">$422,500</span>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">Paid Registrations 100</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >
                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-sm" >
                        <div className="reg-payment-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-price-text">$4,732</span>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">Outstanding Payments 50</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >
                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row" >
                    <div className="col-sm" >
                        <div className="reg-payment-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-price-text">$2,450</span>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">Cash Payments 30</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >
                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-sm" >
                        <div className="reg-payment-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-price-text">$16,900</span>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">Pending Payments 30</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >
                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="row" style={{ marginBottom: "5%" }} >
                    <div className="col-sm" >
                        <div className="reg-payment-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-price-text">$7,605</span>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">Refunds / Reimbursements 100</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >
                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm" >
                    </div>
                </div>

                <div className="table-responsive home-dash-table-view mt-5 mb-5">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={stripeTransferList}
                        pagination={false}
                        loading={this.props.stripeState.onLoad == true && true}
                    />
                </div>
            </div>
        )
    }





    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"4"} />
                <Layout className="reg-payment-layuot-view">
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
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        stripeState: state.StripeState,

    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationPayments));
