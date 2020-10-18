import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Layout,
    Input,
    DatePicker,
    Button,
    Breadcrumb,
    Form,
    Radio,
    Modal,
    Table,
    message
} from "antd";
import moment from "moment";

import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { getYearAndCompetitionAction } from "../../store/actions/appAction";
import ValidationConstants from "../../themes/validationConstant";
import { isArrayNotEmpty, isNotNullOrEmptyString } from '../../util/helpers';
import { updateRegistrationReviewAction, getRegistrationChangeReview, saveRegistrationChangeReview } from '../../store/actions/registrationAction/registrationChangeAction'
import { getOrganisationData } from "util/sessionStorage";
import history from '../../util/history'
import Loader from '../../customComponents/loader';

const { Header, Footer, Content } = Layout;

let this_Obj = null;

const refundFullAmountColumns = [
    {
        title: 'Paid Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, record, index) => {
            return (
                <div>${amount}</div>
            );
        }
    },
    {
        title: 'Fee Type',
        dataIndex: 'feeType',
        key: 'feeType',
        render: (feeType) => (
            <span style={{ textTransform: "capitalize" }}>{feeType}</span>
        ),
    },
    {
        title: 'Payment Type',
        dataIndex: 'paymentType',
        key: 'paymentType'
    },
    {
        title: 'Date',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        render: (invoiceDate) => (
            <div>{moment(invoiceDate).format('DD/MM/YYYY')}</div>
        ),
    },
    {
        title: 'Refund Amount',
        dataIndex: 'amount',
        key: 'Refund Amount'
    }
];

const refundPartialAmountColumns = [
    {
        title: 'Paid Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => (
            <div>${amount}</div>
        ),
    },
    {
        title: 'Fee Type',
        dataIndex: 'feeType',
        key: 'feeType'
    },
    {
        title: 'Payment Type',
        dataIndex: 'paymentType',
        key: 'paymentType'
    },
    {
        title: 'Date',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        render: (invoiceDate) => (
            <div>{moment(invoiceDate).format('DD/MM/YYYY')}</div>
        ),
    },
    {
        title: 'Refund Amount',
        dataIndex: 'amount',
        key: 'Refund Amount',
        render: (amount, record, index) => {
            return (
                <div>
                    <Input
                        style={{ height: "25px", width: "100px", fontSize: "10px" }} type="number"
                        onChange={(e) => this_Obj.updateInvoices(e.target.value, index)}
                    />
                </div>
            );
        }
    }
]

class RegistrationChangeReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acceptVisible: false,
            declineVisible: false,
            deRegisterId: null,
            organisationId: getOrganisationData().organisationUniqueKey,
            organisationTypeRefId: getOrganisationData().organisationTypeRefId,
            loading: false,
            deRegData: null
        };
        this_Obj = this;
    }

    componentDidMount() {
        let deRegisterId = this.props.location.state ? this.props.location.state.deRegisterId : null;
        let deRegData = this.props.location.state ? this.props.location.state.deRegData : null;
        this.setState({ deRegisterId, deRegData });
        this.apiCall(deRegisterId);
    }

    componentDidUpdate(nextProps) {
        let regChangeState = this.props.registrationChangeState;
        if (this.state.loading && regChangeState.onSaveLoad == false) {
            this.goBack();
        }
    }

    apiCall = (deRegisterId) => {
        let payload = {
            deRegisterId: deRegisterId,
            organisationId: this.state.organisationId
        }

        this.props.getRegistrationChangeReview(payload);
    }

    acceptModal = (key) => {
        if (key === "show") {
            this.setState({ acceptVisible: true });
        } else if (key === "ok") {
            const { reviewSaveData } = this.props.registrationChangeState;
            let err = false;
            let msg = "";
            if (reviewSaveData.refundTypeRefId == 2) {
                if (isArrayNotEmpty(reviewSaveData.invoices)) {
                    for (let item of reviewSaveData.invoices) {
                        if (!isNotNullOrEmptyString(item.refundAmount)) {
                            err = true;
                            msg = ValidationConstants.refundAmtRequired;
                            break;
                        } else if (item.refundAmount > item.amount) {
                            err = true;
                            msg = ValidationConstants.refundAmtCheck;
                            break;
                        }
                    }
                }
            }

            if (err) {
                message.config({ duration: 0.9, maxCount: 1 })
                message.error(msg);
            } else {
                this.setState({ acceptVisible: false });
                this.saveReview(reviewSaveData.invoices);
            }
        } else {
            this.setState({ acceptVisible: false });
        }
    };

    declineModal = (key) => {
        if (key === "show") {
            this.setState({ declineVisible: true });
        } else if (key === "ok") {
            const { regChangeReviewData, reviewSaveData } = this.props.registrationChangeState;
            if (reviewSaveData.declineReasonRefId != 0 && reviewSaveData.declineReasonRefId != null) {
                this.setState({ declineVisible: false });
                let invoicesTemp = regChangeReviewData.invoices.map(e => ({ ...e }));
                for (let invoice of invoicesTemp) {
                    invoice.refundAmount = 0;
                }
                this.saveReview(invoicesTemp);
            } else {
                message.config({ duration: 0.9, maxCount: 1 });
                message.error(ValidationConstants.declineReasonRequired)
            }
        } else {
            this.setState({ declineVisible: false });
        }
    };

    goBack = () => {
        history.push({ pathname: '/registrationChange' });
    }

    updateRegistrationReview = (value, key) => {
        this.props.updateRegistrationReviewAction(value, key);

        //For update invoices list
        if (key == "refundTypeRefId") {
            const { regChangeReviewData } = this.props.registrationChangeState;
            let invoicesTemp = regChangeReviewData.invoices.map(e => ({ ...e }));
            if (value == 1) {
                for (let invoice of invoicesTemp) {
                    invoice.refundAmount = invoice.amount;
                }
            }
            this.props.updateRegistrationReviewAction(invoicesTemp, "invoices");
        }
    }

    updateInvoices = (refundAmount, index) => {
        const { reviewSaveData } = this.props.registrationChangeState;
        reviewSaveData.invoices[index].refundAmount = refundAmount;
        this.updateRegistrationReview(reviewSaveData.invoices, "invoices")
    }

    getApprovalsIconColor = (item) => {
        let color = item.refundTypeRefId == 1 ? "green" : "orange";
        return color;
    }

    getOrgRefName = (orgRefTypeId) => {
        let orgTypeRefName;
        if (orgRefTypeId == 1) {
            orgTypeRefName = "Competition";
        } else if (orgRefTypeId == 2) {
            orgTypeRefName = "Affliate";
        } else if (orgRefTypeId == 3) {
            orgTypeRefName = "Membership";
        }
        return orgTypeRefName;
    }

    saveReview = (invoices) => {
        let reviewSaveData = this.props.registrationChangeState.reviewSaveData;
        let regChangeReviewData = this.props.registrationChangeState.regChangeReviewData;
        if (reviewSaveData.refundTypeRefId != null) {
            if (reviewSaveData.refundTypeRefId == 1) {
                reviewSaveData.refundAmount = regChangeReviewData.fullAmount;
            }
        } else {
            reviewSaveData.refundAmount = regChangeReviewData.fullAmount;
        }
        reviewSaveData["organisationId"] = this.state.organisationId;
        reviewSaveData["deRegisterId"] = this.state.deRegisterId;
        reviewSaveData["affOrgId"] = regChangeReviewData.affOrgId;
        reviewSaveData["compOrgId"] = regChangeReviewData.compOrgId;
        reviewSaveData["isDirect"] = regChangeReviewData.isDirect;
        reviewSaveData["organisationTypeRefId"] = this.state.organisationTypeRefId;
        reviewSaveData["membershipMappingId"] = regChangeReviewData.membershipMappingId;
        reviewSaveData["competitionId"] = regChangeReviewData.competitionId;
        reviewSaveData["userId"] = regChangeReviewData.userId;
        reviewSaveData["invoices"] = invoices;
        let obj = {
            stateApproved: this.state.deRegData.stateApproved,
            compOrganiserApproved: this.state.deRegData.compOrganiserApproved,
            affiliateApproved: this.state.deRegData.affiliateApproved
        }
        // reviewSaveData["approvals"] = obj;
        let isFromOrg = 1;
        if (regChangeReviewData.regChangeTypeRefId == 2) {
            if (regChangeReviewData.isShowButton == 2) {
                isFromOrg = 2;
            }
        }
        reviewSaveData["isFromOrg"] = isFromOrg;
        reviewSaveData["orgRefTypeId"] = regChangeReviewData.orgRefTypeId;

        this.props.saveRegistrationChangeReview(reviewSaveData);
        this.setState({ loading: true });
    }

    ////modal view
    acceptModalView() {
        const { reviewSaveData, regChangeReviewData } = this.props.registrationChangeState;
        return (
            <Modal
                title="Refund"
                visible={this.state.acceptVisible}
                onCancel={() => this.acceptModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                onOk={() => this.acceptModal("ok")}
                centered
            >
                {regChangeReviewData.isShowButton == 1
                    ? this.deRegisterApprove(reviewSaveData, regChangeReviewData)
                    : this.transferApprove()
                }
            </Modal>
        )
    }

    declineModalView() {
        const { reviewSaveData, regChangeReviewData } = this.props.registrationChangeState;
        return (
            <Modal
                title="Decline"
                visible={this.state.declineVisible}
                onCancel={() => this.declineModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                onOk={() => this.declineModal("ok")}
                centered
            >
                {regChangeReviewData.regChangeTypeRefId == 1
                    ? this.deRegisterDecline(reviewSaveData)
                    : (regChangeReviewData.isShowButton == 1
                        ? this.transferFromDecline(reviewSaveData)
                        : this.transferToDecline(reviewSaveData))
                }
            </Modal>
        )
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <div className="row">
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignContent: "center" }}
                        >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {AppConstants.registrationChange}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        );
    }

    ////////form content view
    contentView = () => {
        const { regChangeReviewData, deRegistionOption, transferOption } = this.props.registrationChangeState

        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            disabled
                            heading={AppConstants.username}
                            placeholder={AppConstants.username}
                            value={regChangeReviewData ? regChangeReviewData.userName : null}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            disabled
                            heading={AppConstants.userIsRegisteredTo}
                            placeholder={AppConstants.userIsRegisteredTo}
                            value={regChangeReviewData ? regChangeReviewData.userRegisteredTo : null}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead
                            disabled
                            heading={AppConstants.competition_name}
                            placeholder={AppConstants.competition_name}
                            value={regChangeReviewData ? regChangeReviewData.competitionName : null}
                        />
                    </div>

                    <div className="col-sm">
                        <InputWithHead
                            disabled
                            heading={AppConstants.competitionAdministrator}
                            placeholder={AppConstants.competitionAdministrator}
                            value={regChangeReviewData ? regChangeReviewData.competitionOrgName : null}
                        />
                    </div>
                </div>

                <span className='text-heading-large pt-5'>{AppConstants.regChangeDetail}</span>
                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead heading={AppConstants.dateRegChange} />
                        <DatePicker
                            disabled
                            size="large"
                            style={{ width: "100%" }}
                            format="DD-MM-YYYY"
                            showTime={false}
                            name={'createdOn'}
                            placeholder="dd-mm-yyyy"
                            value={regChangeReviewData.createdOn != null && moment(regChangeReviewData.createdOn)}
                        />
                    </div>

                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dateCompStart} />
                        <DatePicker
                            disabled
                            size="large"
                            style={{ width: "100%" }}
                            format="DD-MM-YYYY"
                            showTime={false}
                            name={'startDate'}
                            placeholder="dd-mm-yyyy"
                            value={regChangeReviewData.startDate !== null && moment(regChangeReviewData.startDate)}
                        />
                    </div>
                </div>

                <div>
                    <InputWithHead
                        disabled
                        heading={AppConstants.regChangeType}
                        placeholder={AppConstants.regChangeType}
                        value={regChangeReviewData ? regChangeReviewData.regChangeType : null}
                    />
                </div>
                {regChangeReviewData.regChangeTypeRefId == 1 ? (
                    <div>
                        <div>
                            <InputWithHead heading={AppConstants.doTheySayForGame} />
                            <Radio.Group
                                disabled
                                className="reg-competition-radio"
                                value={regChangeReviewData ? ((regChangeReviewData.reasonTypeRefId!= null && regChangeReviewData.reasonTypeRefId!= 0) ? 2 : 1) : null}
                            >
                                <Radio value={1}>Yes</Radio>
                                <Radio value={2}>No</Radio>
                            </Radio.Group>
                        </div>
                        {regChangeReviewData.reasonTypeRefId != null && regChangeReviewData.reasonTypeRefId != 0 && (
                            <div>
                                <InputWithHead heading={AppConstants.reasonToDeRegister} />
                                <Radio.Group
                                    disabled
                                    className="reg-competition-radio"
                                    value={regChangeReviewData ? regChangeReviewData.reasonTypeRefId : null}
                                >
                                    {isArrayNotEmpty(deRegistionOption) && deRegistionOption.map((item) => (
                                        <Radio key={'deRegistionOption_' + item.id} value={item.id}>{item.value}</Radio>
                                    ))}
                                    {(regChangeReviewData.reasonTypeRefId == 5) && (
                                        <div>
                                            <InputWithHead
                                                disabled
                                                className="ml-5"
                                                placeholder="Other"
                                                value={regChangeReviewData ? regChangeReviewData.otherInfo : null}
                                                style={{ maxWidth: '50%', minHeight: 60 }}
                                            />
                                        </div>
                                    )}
                                </Radio.Group>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <InputWithHead
                            heading={AppConstants.organisationName}
                            placeholder={AppConstants.organisationName}
                            value={regChangeReviewData.transferOrgName}
                            disabled
                        />

                        <InputWithHead
                            heading={AppConstants.competition_name}
                            placeholder={AppConstants.competition_name}
                            value={regChangeReviewData.transferCompName}
                            disabled
                        />

                        {regChangeReviewData.reasonTypeRefId!= null && regChangeReviewData.reasonTypeRefId != 0 && (
                            <div>
                                <InputWithHead heading={AppConstants.reasonForTransfer} />
                                <Radio.Group
                                    disabled
                                    className="reg-competition-radio"
                                    value={regChangeReviewData ? regChangeReviewData.reasonTypeRefId : null}
                                >
                                    {isArrayNotEmpty(transferOption) && transferOption.map((item) => (
                                        <Radio key={'transferOption_' + item.id} value={item.id}>{item.value}</Radio>
                                    ))}
                                    {(regChangeReviewData.reasonTypeRefId == 3) && (
                                        <div>
                                            <InputWithHead
                                                disabled
                                                className="ml-5"
                                                placeholder="Other"
                                                value={regChangeReviewData ? regChangeReviewData.otherInfo : null}
                                                style={{ maxWidth: '50%', minHeight: 60 }}
                                            />
                                        </div>
                                    )}
                                </Radio.Group>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <InputWithHead heading={AppConstants.approvals} />
                    {(regChangeReviewData.approvals || []).map((item, index) => (
                        <div key={item.orgRefTypeId + "approval" + index}>
                            <div style={{ display: 'flex' }}>
                                <div>{item.payingOrgName} - {this.getOrgRefName(item.orgRefTypeId)}</div>
                                {item.refundTypeRefId != null && (
                                    <div>
                                        {item.refundTypeRefId != 3 ? (
                                            <div style={{ color: this.getApprovalsIconColor(item), paddingLeft: "10px" }}>&#x2714;</div>
                                        ) : (
                                            <div style={{ color: "red", paddingLeft: "10px" }}>&#x2718;</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    deRegisterApprove = (reviewSaveData, regChangeReviewData) => (
        <Radio.Group
            className="reg-competition-radio"
            value={reviewSaveData.refundTypeRefId}
            onChange={(e) => this.updateRegistrationReview(e.target.value, "refundTypeRefId")}
        >
            <Radio value={1}>Refund full amount</Radio>
            {reviewSaveData.refundTypeRefId == 1 && (
                <Table
                    className="refund-table"
                    columns={refundFullAmountColumns}
                    dataSource={regChangeReviewData.invoices}
                    pagination={false}
                />
            )}
            <Radio value={2}>Refund partial payment</Radio>
            {reviewSaveData.refundTypeRefId == 2 && (
                <Table
                    className="refund-table"
                    columns={refundPartialAmountColumns}
                    dataSource={regChangeReviewData.invoices}
                    pagination={false}
                />
            )}
            {/* {reviewSaveData.refundTypeRefId == 2 && (
                <InputWithHead
                    placeholder={AppConstants.refundAmount}
                    value={reviewSaveData.refundAmount}
                    onChange={(e) => this.updateRegistrationReview(e.target.value, "refundAmount")}
                />
            )} */}
        </Radio.Group>
    );

    transferApprove = () => (
        <div>
            <p>Are you approve to transfer?</p>
        </div>
    );

    deRegisterDecline = (reviewSaveData) =>{
        return (
            <div>
                <InputWithHead heading={AppConstants.reasonWhyYourAreDecline} />
                <Radio.Group
                    className="reg-competition-radio"
                    value={reviewSaveData.declineReasonRefId}
                    onChange={(e) => this.updateRegistrationReview(e.target.value, "declineReasonRefId")}
                >
                    <Radio value={1}>
                        <span style={{ whiteSpace: 'pre-wrap', display: 'inline-flex' }}>
                            {AppConstants.theyAlreadyTakenCourt}
                        </span>
                    </Radio>
                    <Radio value={2}>{AppConstants.theyOweMonies}</Radio>
                    <Radio value={3}>{AppConstants.other}</Radio>
                    {reviewSaveData.declineReasonRefId == 3 && (
                        <InputWithHead
                            placeholder={AppConstants.other}
                            value={reviewSaveData.otherInfo}
                            onChange={(e) => this.updateRegistrationReview(e.target.value, "otherInfo")}
                        />
                    )}
                </Radio.Group>
            </div>
        )
    }

    transferFromDecline = (reviewSaveData) =>{
        return (
            <div>
                <InputWithHead heading={AppConstants.reasonWhyYourAreDeclineFromTransfer} />
                <Radio.Group
                    className="reg-competition-radio"
                    value={reviewSaveData.declineReasonRefId}
                    onChange={(e) => this.updateRegistrationReview(e.target.value, "declineReasonRefId")}
                >
                    <Radio value={1}>
                        <span style={{ whiteSpace: 'pre-wrap', display: 'inline-flex' }}>
                            {AppConstants.theyAlreadyTakenCourt}
                        </span>
                    </Radio>
                    <Radio value={2}>{AppConstants.theyOweMonies}</Radio>
                    <Radio value={3}>{AppConstants.suspended}</Radio>
                    <Radio value={4}>{AppConstants.other}</Radio>
                    {reviewSaveData.declineReasonRefId == 4 && (
                        <InputWithHead
                            placeholder={AppConstants.other}
                            value={reviewSaveData.otherInfo}
                            onChange={(e) => this.updateRegistrationReview(e.target.value, "otherInfo")}
                        />
                    )}
                </Radio.Group>
            </div>
        )
    }

    transferToDecline = (reviewSaveData) =>{
        return (
            <div>
                <InputWithHead heading={AppConstants.reasonWhyYourAreDeclineToTransfer} />
                <Radio.Group
                    className="reg-competition-radio"
                    value={reviewSaveData.declineReasonRefId}
                    onChange={(e) => this.updateRegistrationReview(e.target.value, "declineReasonRefId")}
                >
                    <Radio value={1}>{AppConstants.noTeamAvailable}</Radio>
                    <Radio value={2}>{AppConstants.other}</Radio>
                    {reviewSaveData.declineReasonRefId == 2 && (
                        <InputWithHead
                            placeholder={AppConstants.other}
                            value={reviewSaveData.otherInfo}
                            onChange={(e) => this.updateRegistrationReview(e.target.value, "otherInfo")}
                        />
                    )}
                </Radio.Group>
            </div>
        )
    }

    //////footer view containing all the buttons
    footerView = () => {
        let { regChangeReviewData } = this.props.registrationChangeState;
        let isShowButton = regChangeReviewData.isShowButton;
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" onClick={() => this.goBack()}>
                                    {isShowButton >= 1 ? AppConstants.cancel : AppConstants.back}
                                </Button>
                            </div>
                        </div>
                        {isShowButton >= 1 && (
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button
                                        onClick={() => this.acceptModal("show")}
                                        className="user-approval-button mr-3"
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {AppConstants.approve}
                                    </Button>

                                    <Button
                                        onClick={() => this.declineModal("show")}
                                        className="user-approval-button"
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {AppConstants.decline}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu="registration" regSelectedKey="9" />
                <Layout>
                    {this.headerView()}
                    <Form noValidate="noValidate">
                        <Content>
                            <Loader
                                visible={this.props.registrationChangeState.onChangeReviewLoad || this.props.registrationChangeState.onSaveLoad}
                            />
                            <div className="formView">
                                {this.contentView()}
                                {this.acceptModalView()}
                                {this.declineModalView()}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getYearAndCompetitionAction,
            updateRegistrationReviewAction,
            getRegistrationChangeReview,
            saveRegistrationChangeReview
        },
        dispatch
    );
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        registrationChangeState: state.RegistrationChangeState
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationChangeReview);
