import React, { Component } from "react";
import {
    Layout, Radio, Select, Descriptions, Input, Divider, Button,
} from 'antd';
import Chart from "chart.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import { getInvoice } from "../../store/actions/stripeAction/stripeAction";
import Loader from '../../customComponents/loader';
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../util/helpers";
import history from "../../util/history";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const totalArray = [];

class RegistrationInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019winter",
            value: "playingMember",
            competition: "all",
        };
    }

    componentDidMount() {
        // let competitionId = localStorage.getItem("competitionId")
        // let organisationId = localStorage.getItem('organisationId')
        this.props.getInvoice("584");
    }

    /// ////view for breadcrumb
    headerView = () => (
        <Header className="comp-player-grades-header-view container mb-n3">
            <div className="row">
                <div className="col-sm d-flex align-content-center" />
            </div>
        </Header>
    )

    /// top header view
    topView = (result) => {
        const userDetail = result.length > 0 ? result[0].billTo : [];
        return (
            <div className="content-view pt-4 pb-0">
                <div className="drop-reverse">
                    <div className="col-sm">
                        <label className="invoice-description">
                            <img
                                src={AppImages.squareImage}
                                // alt="animated"
                                height="120"
                                width="120"
                                // style={{ borderRadius: 60 }}
                                name="image"
                                onError={(ev) => {
                                    ev.target.src = AppImages.squareImage;
                                }}
                            />
                        </label>
                        <InputWithHead
                            heading="Receipt No.1234497"
                        />
                        {userDetail && userDetail.firstName && (
                            <Descriptions>
                                <Descriptions.Item className="pb-0" label="Bill To">
                                    {userDetail.firstName}
                                    {' '}
                                    {userDetail.middleName}
                                    {' '}
                                    {userDetail.lastName}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                        {userDetail && (userDetail.suburb || userDetail.street1) && (
                            <Descriptions>
                                <Descriptions.Item className="pb-0">
                                    {userDetail.suburb}
                                    {' '}
                                    {" "}
                                    {userDetail.street1}
                                    {' '}
                                    {' '}
                                    {userDetail.street2}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                        {userDetail && userDetail.postalCode && (
                            <Descriptions>
                                <Descriptions.Item>
                                    {userDetail.postalCode}
                                    {' '}
                                    {" "}
                                </Descriptions.Item>
                            </Descriptions>
                        )}

                        {/* </div> */}
                    </div>
                    <div className="col-sm pt-5">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                </div>
            </div>
        );
    }

    membershipProductView = (membershipDetail) => (
        <div className="row">
            <div className="invoice-col-View pb-0 pr-0 pl-0">
                <InputWithHead
                    heading={`${membershipDetail.mOrganisationName}-${membershipDetail.membershipProductName} Membership Fees`}
                />
            </div>

            <div className="invoice-col-view-30 pb-0 pl-0 pr-0">
                <div>
                    <div className="row">
                        <div className="col-sm invoice-description">
                            <InputWithHead
                                // required='justify-content-center'
                                heading="1.00"
                            />
                        </div>
                        <div className="col-sm invoice-description">
                            <InputWithHead
                                heading={(Number(membershipDetail.mCasualFee) + Number(membershipDetail.mSeasonalFee)).toFixed(2)}
                            />
                        </div>
                        <div className="col-sm invoice-description">
                            <InputWithHead
                                heading="N/A"
                            />
                        </div>
                        <div className="col-sm invoice-description">
                            <InputWithHead
                                heading={(Number(membershipDetail.mCasualGst) + Number(membershipDetail.mSeasonalGst)).toFixed(2)}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                required="invoice"
                                heading={(Number(membershipDetail.mCasualFee) + Number(membershipDetail.mSeasonalFee) + Number(membershipDetail.mCasualGst) + Number(membershipDetail.mSeasonalGst)).toFixed(2)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Divider className="mt-0 mb-0" />
        </div>
    )

    competitionOrganiserView = (competitionDetails) => (
        <div className="row">
            {/* < Divider className="mt-0 mb-0" /> */}
            <div className="invoice-col-View pr-0 pl-0">
                {competitionDetails && competitionDetails.cOrganisationName && (
                    <InputWithHead
                        heading={`${competitionDetails.cOrganisationName} Competition Fees`}
                    />
                )}
            </div>
            <div className="invoice-col-view-30 pb-0 pl-0 pr-0">
                <div>
                    <div className="row">
                        <div className="col-sm invoice-description">
                            <InputWithHead heading="1.00" />
                        </div>
                        <div className="col-sm invoice-description">
                            <InputWithHead
                                heading={(Number(competitionDetails.cCasualFee) + Number(competitionDetails.cSeasonalFee)).toFixed(2)}
                            />
                        </div>
                        <div className="col-sm invoice-description">
                            <InputWithHead heading="N/A" />
                        </div>
                        <div className="col-sm invoice-description">
                            <InputWithHead
                                heading={(Number(competitionDetails.cCasualGst) + Number(competitionDetails.cSeasonalGst)).toFixed(2)}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                required="invoice"
                                heading={((Number(competitionDetails.cCasualFee) + Number(competitionDetails.cSeasonalFee)) + (Number(competitionDetails.cCasualGst) + Number(competitionDetails.cSeasonalGst))).toFixed(2)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Divider className="mt-0 mb-0" />
        </div>
    )

    competitionAffiliateView = (affiliateDetail) => (
        <div className="row">
            <div className="invoice-col-View pb-0 pr-0 pl-0">
                {affiliateDetail && affiliateDetail.aOrganisationName && (
                    <InputWithHead
                        heading={`${affiliateDetail.aOrganisationName} Competition Fees`}
                    />
                )}
            </div>
            <div className="invoice-col-view-30 pb-0 pl-0 pr-0">
                <div>
                    <div className="row">
                        <div className="col-sm invoice-description">
                            {affiliateDetail && <InputWithHead heading="1.00" />}
                        </div>
                        <div className="col-sm invoice-description">
                            {affiliateDetail && (
                                <InputWithHead
                                    heading={(Number(affiliateDetail.aCasualFee) + Number(affiliateDetail.aSeasonalFee)).toFixed(2)}
                                />
                            )}
                        </div>
                        <div className="col-sm invoice-description">
                            {affiliateDetail && <InputWithHead heading="N/A" />}
                        </div>
                        <div className="col-sm invoice-description">
                            {affiliateDetail && (
                                <InputWithHead
                                    heading={(Number(affiliateDetail.aCasualGst) + Number(affiliateDetail.aSeasonalGst)).toFixed(2)}
                                />
                            )}
                        </div>
                        <div className="col-sm">
                            {affiliateDetail && (
                                <InputWithHead
                                    required="invoice"
                                    heading={((Number(affiliateDetail.aCasualFee) + Number(affiliateDetail.aSeasonalFee)) + (Number(affiliateDetail.aCasualGst) + Number(affiliateDetail.aSeasonalGst))).toFixed(2)}
                                />
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* {data.length - 1 !== participantIndex && */}
            <Divider className="mt-0 mb-0" />
            {/* } */}
        </div>
    )

    contentView = (result) => {
        const data = result.length > 0 ? result[0].fees : [];
        return (
            <div className="content-view pt-0 pb-0">
                <div className="invoice-row-view">
                    <div className="invoice-col-View pb-0 pr-0 pl-0">
                        <InputWithHead heading="Description" />
                    </div>
                    <div className="invoice-col-view-30 pb-0 pl-0 pr-0">
                        <div className="invoice-row-view">
                            <div className="col-sm invoice-description">
                                <InputWithHead heading="Quantity" />
                            </div>
                            <div className="col-sm invoice-description">
                                <InputWithHead heading="Unit Price" />
                            </div>
                            <div className="col-sm invoice-description">
                                <InputWithHead heading="Discount" />
                            </div>
                            <div className="col-sm invoice-description">
                                <InputWithHead heading="GST" />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading="Amount AUD" />
                            </div>
                        </div>
                    </div>
                    <Divider className="mt-0 mb-0" />
                </div>

                {/* {data.membership && data.membership.map((membershipItem, membershipIndex) => {
                    return ( */}
                {data && data.map((participantItem, participantIndex) => {
                    const competitionDetails = participantItem && participantItem.competitionDetail;
                    const userDetail = participantItem.userDetail && participantItem.userDetail;
                    const membershipDetail = participantItem && participantItem.membershipDetail;
                    const affiliateDetail = participantItem && participantItem.affiliateDetail;
                    const totalAmount = participantItem && participantItem.totalAmount;
                    return (
                        <div>
                            <div className="invoice-row-view">
                                <div className="invoice-col-View pb-0 pl-0">
                                    <div className="invoice-col-View pb-0 pl-0 pr-0">
                                        {userDetail && userDetail.firstName && (
                                            <InputWithHead
                                                heading={competitionDetails.competitionDivisionName
                                                    ? `Registration - ${membershipDetail.mTypeName} ${userDetail.firstName} ${userDetail.lastName
                                                    }, ${competitionDetails.competitionName}, ${competitionDetails.competitionDivisionName}`
                                                    : `Registration - ${membershipDetail.mTypeName} ${userDetail.firstName} ${userDetail.lastName
                                                    }, ${competitionDetails.competitionName}`}
                                            />
                                        )}
                                    </div>

                                    {/* {userDetail && userDetail.suburb && (
                                        <Descriptions>
                                            <Descriptions.Item className="pb-0 pt-0">
                                                {userDetail.suburb}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    )}

                                    {userDetail && userDetail.street1 && (
                                        <Descriptions>
                                            <Descriptions.Item className="pb-0">
                                                {userDetail.street1} {" "}{userDetail.street2}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    )}

                                    {userDetail && userDetail.PhoneNo && (
                                        <Descriptions>
                                            <Descriptions.Item className="pb-0">
                                                {userDetail.PhoneNo}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    )}

                                    {userDetail && userDetail.postalCode && (
                                        <Descriptions>
                                            <Descriptions.Item>
                                                {userDetail.postalCode}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    )} */}
                                </div>
                                <Divider className="mt-0 mb-0" />
                            </div>
                            {affiliateDetail && this.competitionAffiliateView(affiliateDetail)}
                            {this.competitionOrganiserView(competitionDetails)}
                            {this.membershipProductView(membershipDetail)}

                            <div className="d-flex row d-flex justify-content-end">
                                <div className="invoice-total justify-content-end">
                                    <InputWithHead heading="Total" />
                                </div>
                                <div className="invoice-total-amount">
                                    <InputWithHead
                                        required="invoice"
                                        heading={`$${totalAmount}` ? (totalAmount.totalSum).toFixed(2) : "N/A"}
                                    />
                                </div>
                                {data.length - 1 !== participantIndex && <Divider className="mt-0 mb-0" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    charityRoundUpView = () => {
        const charityRoundUpData = this.props.stripeState.charityRoundUpFilter;
        return (
            <div className="d-flex justify-content-start mb-5">
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                        // value={index == 0 && item.competitionId}
                        defaultValue={0}
                    >
                        {charityRoundUpData.map((item) => (
                            <div key={item.competitionId}>
                                <Radio key={`competition_${item.competitionId}`} value={item.competitionId}>
                                    {item.competitionId == 0 ? (item.charityTitle) : (`Support ${item.charityTitle}`)}
                                </Radio>
                                <div className="d-flex justify-content-start pl-5">
                                    <span className="roundUpDescription-text">{item.roundUpDescription}</span>
                                </div>
                                <div className="ml-5">
                                    <Radio.Group
                                        className="reg-competition-radio"
                                        // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                                        // value={charityRoundUpIndex == 0 && charityRoundUpItem.charitySelectedId}
                                    >
                                        {item.charityDetail.map((charityRoundUpItem) => (
                                            <Radio
                                                key={`charity_${charityRoundUpItem.charitySelectedId}`}
                                                value={charityRoundUpItem.charitySelectedId}
                                            >
                                                {charityRoundUpItem.charitySelectedDescription}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            </div>
        );
    }

    totalInvoiceView = (result) => {
        const { subTotalFees } = this.props.stripeState;
        const { subTotalGst } = this.props.stripeState;
        return (
            <div className="content-view">
                <div className="charity-invoice-div">
                    <span className="charity-invoice-heading">Charity Support</span>
                </div>
                {this.charityRoundUpView(result)}
                <div className="charity-invoice-div mb-5">
                    <span className="charity-invoice-heading">Total Charity Amount: $0</span>
                </div>
                <div className="drop-reverse">
                    <div className="col-sm">
                        <TextArea placeholder="Text Area" />
                    </div>
                    <div className="col-sm pl-0 pr-0">
                        <div className="col-sm d-flex justify-content-end">
                            <div className="col-sm-8 d-flex justify-content-end">
                                <InputWithHead
                                    required="pr-4"
                                    heading="Subtotal"
                                />
                            </div>
                            <InputWithHead
                                className="d-flex justify-content-start"
                                heading={subTotalFees !== 0 ? subTotalFees.toFixed(2) : '0'}
                            />
                        </div>
                        <div className="col-sm d-flex justify-content-end">
                            <div className="col-sm-8 d-flex justify-content-end">
                                <InputWithHead
                                    required="pr-4 pt-0"
                                    heading="GST"
                                />
                            </div>
                            <InputWithHead
                                required="pt-0"
                                className="d-flex justify-content-start"
                                heading={subTotalGst !== 0 ? subTotalGst.toFixed(2) : '0'}
                            />

                        </div>
                        <div className="row">
                            <div className="col-sm" />
                            <div className="col-sm">
                                <div
                                    className="d-flex justify-content-end"
                                    style={{ height: 1, backgroundColor: "rgba(0, 0, 0, 0.65)" }}
                                />
                            </div>
                        </div>
                        <div className="col-sm d-flex justify-content-end">
                            <InputWithHead
                                required="pr-4 pt-0"
                                heading="Amount Due"
                            />
                            <InputWithHead
                                required="pt-0"
                                className="d-flex justify-content-start"
                                heading={`${"AUD" + " "}${Number(subTotalFees + subTotalGst).toFixed(2)}`}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm pt-5 invoice-image">
                        <label>
                            <img
                                src={AppImages.netballImages}
                                // alt="animated"
                                height="100%"
                                width="100%"
                                // style={{ borderRadius: 60 }}
                                name="image"
                                onError={(ev) => {
                                    ev.target.src = AppImages.netballImages;
                                }}
                            />
                        </label>
                    </div>
                    <div className="col-sm pt-5 invoice-image-main ">
                        <label>
                            <img
                                src={AppImages.netballLogoMain}
                                height="100%"
                                width="100%"
                                name="image"
                                onError={(ev) => {
                                    ev.target.src = AppImages.netballLogoMain;
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    /// /navigate to stripe payment screen
    navigatePaymentScreen = () => {
        history.push("/checkoutPayment", {
            registrationId: this.props.location.state ? this.props.location.state.registrationId : null,
        });
    }

    /// ///footer view containing all the buttons like submit and cancel
    footerView = () => (
        <div className="container">
            <div className="footer-view">
                <div className="comp-buttons-view pt-5 pr-5">
                    <Button
                        className="open-reg-button"
                        htmlType="submit"
                        type="primary"
                        onClick={() => this.navigatePaymentScreen()}
                    >
                        Pay
                    </Button>
                </div>
            </div>
        </div>
    )

    render() {
        const result = this.props.stripeState.getInvoicedata;
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading=""
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />

                <Layout>
                    {this.headerView()}
                    <Content className="container">
                        <div className="formView">
                            {this.topView(result)}
                            {this.contentView(result)}
                            {this.totalInvoiceView(result)}
                        </div>
                        <Loader visible={this.props.stripeState.onLoad} />
                    </Content>
                    {this.footerView()}
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInvoice,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        stripeState: state.StripeState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationInvoice);
