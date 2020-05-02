import React, { Component } from "react";
import { Layout, Breadcrumb, Select, DatePicker, Button } from 'antd';
import './product.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    accountBalanceAction
} from "../../store/actions/stripeAction/stripeAction";
import { getOrganisationData } from "../../util/sessionStorage";

const { Header, Content } = Layout;
const { Option } = Select;


class RegistrationPayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2017",
            competition: "all",
            paymentFor: "all",

        }
    }

    componentDidMount() {
        if (this.stripeConnected()) {
            this.props.accountBalanceAction()
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
        console.log(orgData)
        if (stripeAccountID !== null) {
            return true
        }
        else {
            return false
        }
    }

    stripeView = () => {
        let stripeConnected = this.stripeConnected()
        let accountBalance = this.props.stripeState.accountBalance ? this.props.stripeState.accountBalance : "N/A"
        let stripeConnectURL = "https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth/test&client_id=ca_GoE4DQeJGNAvRzAq6MJOmZ8xmFTeLgan&state={STATE_VALUE}&stripe_user[email]=samir@deftsoft.com&redirect_uri=https://netball-comp-admin-dev.worldsportaction.com/registrationPayments"
        return (
            <div className="pb-5">
                <div className="row">
                    <div className="col-sm">
                        <span className="reg-payment-price-text">{stripeConnected ? accountBalance : null}</span>
                    </div>
                    <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                        {stripeConnected ?
                            <Button
                                className="open-reg-button"
                                type="primary"
                            >
                                {AppConstants.goToStripeDashboard}
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
                    </Content>
                </Layout>
            </div>

        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        accountBalanceAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        stripeState: state.StripeState,

    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationPayments));
