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
import { getOrganisationData } from "../../util/sessionStorage";
import {endUserRegDashboardListAction} from
    "../../store/actions/registrationAction/endUserRegistrationAction";
import { getCommonRefData, getGenderAction } from 
        '../../store/actions/commonAction/commonAction';
import { getAffiliateToOrganisationAction} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { isEmptyArray } from "formik";

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
                   {registrationDate!= null ? moment(registrationDate).format("DD/MM/YYYY") : ""}
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
                   {dateOfBirth!= null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
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
            paymentId: -1
        }
        // this.props.getOnlyYearListAction(this.props.appState.yearList)
    }

    componentDidMount(){
        this.referenceCalls(this.state.organisationId);
        this.handleRegTableList(1);
    }
    componentDidUpdate(nextProps){

    }

    handleRegTableList = (page) => {
        let filter =
        {
            organisationUniqueKey: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.competitionUniqueKey,
            dobFrom: this.state.dobFrom!= '-1' ? moment(this.state.dobFrom).format('YYYY-MM-DD') : '-1',
            dobTo: this.state.dobTo!= '-1' ? moment(this.state.dobTo).format('YYYY-MM-DD') : '-1',
            membershipProductTypeId: this.state.membershipProductTypeId,
            genderRefId: this.state.genderRefId,
            postalCode: (this.state.postalCode!= '' && this.state.postalCode!= null) ? this.state.postalCode.toString() : '-1',
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
        if(key == "yearRefId")
          await this.setState({yearRefId: value});
        else if (key == "competitionId")
            await   this.setState({competitionUniqueKey: value});
        else if (key == "dobFrom"){
            let d = moment(value, 'YYYY-mm-dd');
            console.log("DDDD" + d);
            await this.setState({dobFrom: d});
        }
        else if (key == "dobTo"){
            let d = moment(value, 'YYYY-mm-dd');
            await this.setState({dobTo: d});
        }
        else if (key == "membershipProductTypeId")
            await this.setState({membershipProductTypeId: value});
        else if (key == "genderRefId")
            await this.setState({genderRefId: value});
        else if (key == "affiliate")
            await  this.setState({affiliate: value});
        else if (key == "membershipProductId")
            await  this.setState({membershipProductId: value});
        else if (key == "paymentId")
            await  this.setState({paymentId: value});
        else if(key == "postalCode"){
            console.log("*************" + value);
            await this.setState({postalCode: value});
        }

        this.handleRegTableList(1);
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.dashboard}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
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
            let arr  = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
            if(isEmptyArray){
                uniqueValues = [...uniqueValues, ...arr];
            }
        }
        const {genderData} = this.props.commonReducerState;
        const {competitions, membershipProductTypes, membershipProducts, postalCodes} = this.props.userRegistrationState;
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
                                <div className='year-select-heading'>{AppConstants.competition}:</div>
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
                            <div className="reg-filter-col-cont">
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
                                <div className='year-select-heading' style={{marginLeft: '25px'}}>{AppConstants.dobTo}</div>
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
                        <div className="reg-col" >
                            <div  className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.types}</div>
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
                        <div className="reg-col1" >
                            <div  className="reg-filter-col-cont" >
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
                            <div  className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.affiliates}</div>
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
                            <div  className="reg-filter-col-cont" >
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
                        <div className="reg-col" >
                            <div  className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.postCode}</div>
                                <Select
                                    showSearch
                                     optionFilterProp="children"
                                     mode="multiple"
                                     className="year-select reg-filter-select1"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'postalCode')}
                                    value={this.state.postalCode}>
                                    {(postalCodes || []).map((post, index) => (
                                        <Option key={post} value={post}>{post}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    countView = () =>{
        let userRegistrationState = this.props.userRegistrationState;
        let userRegDashboardList = userRegistrationState.userRegDashboardListData;
        let total = userRegistrationState.userRegDashboardListTotalCount;
        return(
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
        getOnlyYearListAction
    }, dispatch);
}

function mapStatetoProps(state) {
    return {
        userRegistrationState: state.EndUserRegistrationState,
        userState: state.UserState,
        commonReducerState: state.CommonReducerState,
        appState: state.AppState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Registration));
