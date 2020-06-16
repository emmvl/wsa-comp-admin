import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal, DatePicker } from "antd";
import './product.css';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import InputWithHead from "../../customComponents/InputWithHead";
import { getOrganisationData } from "../../util/sessionStorage";
import { endUserRegDashboardListAction } from
    "../../store/actions/registrationAction/endUserRegistrationAction";
import { getCommonRefData, getGenderAction } from
    '../../store/actions/commonAction/commonAction';
import { getAffiliateToOrganisationAction } from "../../store/actions/userAction/userAction";
import { getAllCompetitionAction } from "../../store/actions/registrationAction/registrationDashboardAction"
import { getOnlyYearListAction, } from '../../store/actions/appAction'
import { isEmptyArray } from "formik";
import WizardModel from "../../customComponents/registrationWizardModel"
import history from "../../util/history";
import StripeKeys from "../stripe/stripeKeys";


const { Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Registration date',
        dataIndex: 'registrationDate',
        key: 'registrationDate',
        sorter: (a, b) => a.registrationDate.localeCompare(b.registrationDate),
        render: (registrationDate, record, index) => {
            return (
                <div>
                    {registrationDate != null ? moment(registrationDate).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
    },
    {
        title: 'DOB',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        sorter: (a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth),
        render: (dateOfBirth, record, index) => {
            return (
                <div>
                    {dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
        sorter: (a, b) => a.fee.localeCompare(b.fee),
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e) => (
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
                        <NavLink to={{ pathname: `/` }} >
                            <span>View</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <span>Refund</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }

];

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: '-1',
            dobFrom: '-1',
            dobTo: '-1',
            membershipProductTypeId: -1,
            genderRefId: -1,
            postalCode: '',
            affiliate: -1,
            membershipProductId: -1,
            paymentId: -1,
            visible: false,
            competitionId: "",
            publishStatus: 0,
            orgRegistratinId: 0,
            registrationCloseDate: '',
            wizardYear: 1,
            isDirect: false,
            inviteeStatus: 0,
            competitionCreatorOrganisation: 0,
            compFeeStatus: 0,
            compName: "",
            regStatus: false
        }
        // this.props.getOnlyYearListAction(this.props.appState.yearList)
    }

    componentDidMount() {
        this.referenceCalls(this.state.organisationId);
        this.handleRegTableList(1);
        this.props.getAllCompetitionAction(this.state.yearRefId)
    }
    componentDidUpdate(nextProps) {
        let competitionTypeList = this.props.registrationDashboardState.competitionTypeList
        if (nextProps.registrationDashboardState !== this.props.registrationDashboardState) {
            if (nextProps.registrationDashboardState.competitionTypeList !== competitionTypeList) {
                if (competitionTypeList.length > 0) {
                    let competitionId = competitionTypeList[0].competitionId
                    let publishStatus = competitionTypeList[0].competitionStatusId
                    let orgRegistratinId = competitionTypeList[0].orgRegistratinId
                    let wizardYear = competitionTypeList[0].yearId
                    let registrationCloseDate = competitionTypeList[0].registrationCloseDate
                    let inviteeStatus = competitionTypeList[0].inviteeStatus
                    let competitionCreatorOrganisation = competitionTypeList[0].competitionCreatorOrganisation
                    let isDirect = competitionTypeList[0].isDirect
                    let compFeeStatus = competitionTypeList[0].creatorFeeStatus
                    let compName = competitionTypeList[0].competitionName
                    let regStatus = competitionTypeList[0].orgRegistrationStatusId

                    this.setState({
                        competitionId: competitionId,
                        publishStatus: publishStatus,
                        orgRegistratinId: orgRegistratinId,
                        wizardYear: wizardYear, registrationCloseDate: registrationCloseDate,
                        inviteeStatus: inviteeStatus, competitionCreatorOrganisation: competitionCreatorOrganisation,
                        isDirect: isDirect, compFeeStatus, compName, regStatus
                    })

                }
            }
        }
    }

    handleRegTableList = (page) => {
        let filter =
        {
            organisationUniqueKey: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.competitionUniqueKey,
            dobFrom: (this.state.dobFrom != '-1' && !isNaN(this.state.dobFrom)) ? moment(this.state.dobFrom).format('YYYY-MM-DD') : '-1',
            dobTo: (this.state.dobTo != '-1' && !isNaN(this.state.dobTo)) ? moment(this.state.dobTo).format('YYYY-MM-DD') : '-1',
            membershipProductTypeId: this.state.membershipProductTypeId,
            genderRefId: this.state.genderRefId,
            postalCode: (this.state.postalCode != '' && this.state.postalCode != null) ? this.state.postalCode.toString() : '-1',
            affiliate: this.state.affiliate,
            membershipProductId: this.state.membershipProductId,
            paymentId: this.state.paymentId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.endUserRegDashboardListAction(filter);
    }

    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getGenderAction();
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if (key == "yearRefId") {
            await this.setState({ yearRefId: value });
            this.props.getAllCompetitionAction(this.state.yearRefId)
            this.handleRegTableList(1);
        }
        else if (key == "competitionId") {
            await this.setState({ competitionUniqueKey: value });
            this.handleRegTableList(1);
        }
        else if (key == "dobFrom") {
            let d = moment(value, 'YYYY-mm-dd');
            console.log("DDDD" + d);
            await this.setState({ dobFrom: d });
            this.handleRegTableList(1);
        }
        else if (key == "dobTo") {
            let d = moment(value, 'YYYY-mm-dd');
            await this.setState({ dobTo: d });
            this.handleRegTableList(1);
        }
        else if (key == "membershipProductTypeId") {
            await this.setState({ membershipProductTypeId: value });
            this.handleRegTableList(1);
        }
        else if (key == "genderRefId") {
            await this.setState({ genderRefId: value });
            this.handleRegTableList(1);
        }
        else if (key == "affiliate") {
            await this.setState({ affiliate: value });
            this.handleRegTableList(1);
        }
        else if (key == "membershipProductId") {
            await this.setState({ membershipProductId: value });
            this.handleRegTableList(1);
        }
        else if (key == "paymentId") {
            await this.setState({ paymentId: value });
            this.handleRegTableList(1);
        }
        else if (key == "postalCode") {
            const regex = /,/gi;
            let canCall = false;
            let newVal = value.toString().split(',');
            newVal.map((x, index) => {
                console.log("Val::" + x + "**" + x.length);
                if (Number(x.length) % 4 == 0 && x.length > 0) {
                    canCall = true;
                }
                else {
                    canCall = false;
                }
            })


            await this.setState({ postalCode: value });
            if (canCall) {
                this.handleRegTableList(1);
            }
            else if (value.length == 0) {
                this.handleRegTableList(1);
            }
        }
    }

    openwizardmodel() {
        let competitionData = this.props.registrationDashboardState.competitionTypeList
        if (competitionData.length > 0) {
            let competitionId = competitionData[0].competitionId
            let publishStatus = competitionData[0].competitionStatusId
            let orgRegistrationId = competitionData[0].orgRegistratinId
            let wizardYear = competitionData[0].yearId
            let registrationCloseDate = competitionData[0].registrationCloseDate
            let inviteeStatus = competitionData[0].inviteeStatus
            let competitionCreatorOrganisation = competitionData[0].competitionCreatorOrganisation
            let isDirect = competitionData[0].isDirect
            let compFeeStatus = competitionData[0].creatorFeeStatus
            let compName = competitionData[0].competitionName
            let regStatus = competitionData[0].orgRegistrationStatusId
            this.setState
                ({
                    competitionId, publishStatus, orgRegistrationId,
                    wizardYear, registrationCloseDate, inviteeStatus, competitionCreatorOrganisation, isDirect,
                    visible: true, compFeeStatus, compName, regStatus
                })
        } else {
            this.setState
                ({
                    visible: true
                })
        }

    }
    userEmail = () => {
        let orgData = getOrganisationData()
        let email = orgData && orgData.email ? encodeURIComponent(orgData.email) : ""
        return email
    }
    stripeConnected = () => {
        let orgData = getOrganisationData()
        let stripeAccountID = orgData ? orgData.stripeAccountID : null
        return stripeAccountID
    }

    ///////view for breadcrumb
    headerView = () => {
        let stripeConnected = this.stripeConnected()
        let userEmail = this.userEmail()
        let stripeConnectURL = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth/test&client_id=${StripeKeys.clientId}&state={STATE_VALUE}&stripe_user[email]=${userEmail}&redirect_uri=${StripeKeys.url}/registrationPayments`
        let registrationCompetition = this.props.registrationDashboardState.competitionTypeList
        console.log(registrationCompetition, this.props.appState)
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm-8" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.dashboard}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm-4" style={{ display: "flex", alignContent: "center", justifyContent: 'center' }} >
                        <Button
                            className="open-reg-button"
                            type="primary"
                            onClick={() => this.openwizardmodel()}
                        >
                            {/* <a href={stripeDashboardUrl} class="stripe-connect"> */}
                            {AppConstants.registrationWizard}
                            {/* </a> */}
                        </Button>
                    </div>
                </div>
                <WizardModel
                    modalTitle={AppConstants.registrationWizard}
                    visible={this.state.visible}
                    onCancel={() => this.setState({ visible: false })}
                    wizardCompetition={registrationCompetition}
                    competitionChange={(competitionId) => this.changeCompetition(competitionId)}
                    competitionId={this.state.competitionId}
                    stripeConnected={stripeConnected}
                    stripeConnectURL={stripeConnectURL}
                    publishStatus={this.state.publishStatus}
                    competitionClick={() => this.clickCompetition()}
                    registrationClick={() => this.state.publishStatus == 2 && this.onClickRegistration()}
                    registrationStatus={this.regStatus()}
                />
            </div >
        )
    }


    regStatus() {
        if (this.state.regStatus == 2) {
            return true
        }
        else {
            return false
        }
    }

    //wizard  registration click
    onClickRegistration() {
        if (this.state.isDirect == true && this.state.competitionCreatorOrganisation == 1) {
            history.push("/registrationForm", {
                id: this.state.competitionId,
                year: this.state.wizardYear,
                orgRegId: this.state.orgRegistrationId, compCloseDate: this.state.registrationCloseDate,
                compName: this.state.compName
            })
        } else if (this.state.inviteeStatus == 1) {
            history.push("/registrationForm", {
                id: this.state.competitionId,
                year: this.state.wizardYear,
                orgRegId: this.state.orgRegistrationId, compCloseDate: this.state.registrationCloseDate,
                compName: this.state.compName
            })
        }
    }


    //wizard competition click
    clickCompetition() {
        if (this.state.competitionId !== 0) {
            history.push("/registrationCompetitionFee", { id: this.state.competitionId })
        }
        else {
            history.push("/registrationCompetitionFee", { id: null })
        }

    }

    changeCompetition(competitionId) {
        let competitionData = this.props.registrationDashboardState.competitionTypeList
        let competitionIndex = competitionData.findIndex((x) => x.competitionId === competitionId)
        let publishStatus = competitionData[competitionIndex].competitionStatusId
        let orgRegistrationId = competitionData[competitionIndex].orgRegistratinId
        let wizardYear = competitionData[competitionIndex].yearId
        let registrationCloseDate = competitionData[competitionIndex].registrationCloseDate
        let inviteeStatus = competitionData[competitionIndex].inviteeStatus
        let competitionCreatorOrganisation = competitionData[competitionIndex].competitionCreatorOrganisation
        let isDirect = competitionData[competitionIndex].isDirect
        let compFeeStatus = competitionData[competitionIndex].creatorFeeStatus
        let compName = competitionData[competitionIndex].competitionName
        let regStatus = competitionData[competitionIndex].orgRegistrationStatusId
        this.setState({
            competitionId, publishStatus, orgRegistrationId,
            wizardYear, registrationCloseDate, inviteeStatus, competitionCreatorOrganisation,
            isDirect, compFeeStatus, compName, regStatus
        })
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        if (affiliateToData.affiliatedTo != undefined) {
            let obj = {
                organisationId: getOrganisationData().organisationUniqueKey,
                name: getOrganisationData().name
            }
            uniqueValues.push(obj);
            let arr = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
            if (isEmptyArray) {
                uniqueValues = [...uniqueValues, ...arr];
            }
        }
        const { genderData } = this.props.commonReducerState;
        const { competitions, membershipProductTypes, membershipProducts, postalCodes } = this.props.userRegistrationState;
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.year}</div>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select reg-filter-select"
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.competition}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select1"
                                    onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionId")}
                                    value={this.state.competitionUniqueKey}>
                                    <Option key={-1} value={'-1'}>{AppConstants.all}</Option>
                                    {(competitions || []).map(item => {
                                        return (
                                            <Option key={"competition" + item.competitionUniqueKey} value={item.competitionUniqueKey}>
                                                {item.competitionName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col">
                            <div className="reg-filter-col-cont" style={{ marginRight: '30px' }}>
                                <div className='year-select-heading'>{AppConstants.dobFrom}</div>
                                <DatePicker
                                    size="default"
                                    className="year-select reg-filter-select"
                                    onChange={e => this.onChangeDropDownValue(e, 'dobFrom')}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'dobFrom'}
                                />
                            </div>
                        </div>
                        <div className="reg-col">
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.dobTo}</div>
                                <DatePicker
                                    size="large"
                                    className="year-select reg-filter-select"
                                    onChange={e => this.onChangeDropDownValue(e, 'dobTo')}
                                    //onChange={e => this.setState({dobTo: moment(e, "YYYY-MM-DD")}) }
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'dobTo'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row reg-filter-row" >
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.product}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'membershipProductId')}
                                    value={this.state.membershipProductId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(membershipProducts || []).map((g, index) => (
                                        <Option key={g.membershipProductUniqueKey} value={g.membershipProductUniqueKey}>{g.productName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col1" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.gender}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'genderRefId')}
                                    value={this.state.genderRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(genderData || []).map((g, index) => (
                                        <Option key={g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.affiliate}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'affiliate')}
                                    value={this.state.affiliate}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(uniqueValues || []).map((org, index) => (
                                        <Option key={org.organisationId} value={org.organisationId}>{org.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.payment}</div>
                                <Select
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'paymentId')}
                                    value={this.state.paymentId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="row reg-filter-row" >
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.type}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    style={{ minWidth: 100 }}
                                    onChange={(e) => this.onChangeDropDownValue(e, 'membershipProductTypeId')}
                                    value={this.state.membershipProductTypeId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(membershipProductTypes || []).map((g, index) => (
                                        <Option key={g.membershipProductTypeId} value={g.membershipProductTypeId}>{g.membershipProductTypeName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.postCode}</div>
                                <InputWithHead
                                    placeholder={AppConstants.postCode}
                                    onChange={(e) => this.onChangeDropDownValue(e.target.value, 'postalCode')}
                                    value={this.state.postalCode}
                                />
                                {/* <Select
                                    showSearch
                                     mode="multiple"
                                     className="year-select reg-filter-select1"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'postalCode')}
                                    value={this.state.postalCode}>
                                    {(postalCodes || []).map((post, index) => (
                                        <Option key={post} value={post}>{post}</Option>
                                    ))}
                                </Select> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    countView = () => {
        let userRegistrationState = this.props.userRegistrationState;
        let userRegDashboardList = userRegistrationState.userRegDashboardListData;
        let total = userRegistrationState.userRegDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of Registrations</div>
                                <div className="reg-payment-price-text">{total}</div>
                            </div>
                        </div>
                        <div className="col-sm-6" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">Value of Registrations</div>
                                <div className="reg-payment-price-text">$0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let userRegistrationState = this.props.userRegistrationState;
        let userRegDashboardList = userRegistrationState.userRegDashboardListData;
        let total = userRegistrationState.userRegDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={userRegDashboardList}
                        pagination={false}
                        loading={userRegistrationState.onUserRegDashboardLoad === true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userRegistrationState.userRegDashboardListPage}
                        total={total}
                        onChange={(page) => this.handleRegTableList(page)}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"1"} />
                <Layout>
                    {this.headerView()}
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
        getAllCompetitionAction
    }, dispatch);
}

function mapStatetoProps(state) {
    return {
        userRegistrationState: state.EndUserRegistrationState,
        userState: state.UserState,
        commonReducerState: state.CommonReducerState,
        appState: state.AppState,
        registrationDashboardState: state.RegistrationDashboardState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Registration));
