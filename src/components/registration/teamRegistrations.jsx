import React, { Component } from "react";
import { Layout, Breadcrumb, Icon, Table, Select, Menu, Pagination, Modal, DatePicker, Input, Button } from "antd"; import './product.scss';
import './product.scss';
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
import { getCommonRefData, getGenderAction, registrationPaymentStatusAction } from
    '../../store/actions/commonAction/commonAction';
import { getAffiliateToOrganisationAction } from "../../store/actions/userAction/userAction";
import { getAllCompetitionAction } from "../../store/actions/registrationAction/registrationDashboardAction"
import { getOnlyYearListAction, } from '../../store/actions/appAction'
import { isEmptyArray } from "formik";
import { currencyFormat } from "../../util/currencyFormat";

const { Footer, Content } = Layout;
const { Option } = Select;


const columns = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
        title: 'Organisation',
        dataIndex: 'organisation',
        key: 'organisation',
        sorter: (a, b) => a.organisation.localeCompare(b.organisation),
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
        title: 'User Reg.Team',
        dataIndex: 'userRegTeam',
        key: 'userRegTeam',
        sorter: (a, b) => a.userRegTeam.localeCompare(b.userRegTeam),

    },
    {
        title: 'User Role',
        dataIndex: 'userRole',
        key: 'userRole',
        sorter: (a, b) => a.userRole.localeCompare(b.userRole),
    },
    {
        title: 'Team Reg. Type',
        dataIndex: 'teamRegType',
        key: 'teamRegType',
        sorter: (a, b) => a.teamRegType.localeCompare(b.teamRegType),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
    },

];

class TeamRegistrations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: '-1',
            affiliate: -1,
            competitionId: "",
            paymentStatusRefId: -1,
            searchText: '',
        }
    }

    componentDidMount() {
        this.referenceCalls(this.state.organisationId);
        this.handleRegTableList(1);
    }

    handleRegTableList = (page) => {
        console.log(page)
    }

    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if (key == "yearRefId") {
            await this.setState({ yearRefId: value });
            this.handleRegTableList(1);
        }
        else if (key == "competitionId") {
            await this.setState({ competitionUniqueKey: value });
            this.handleRegTableList(1);
        }
        else if (key == "affiliate") {
            await this.setState({ affiliate: value });
            this.handleRegTableList(1);
        }
        else if (key == "paymentStatusRefId") {
            await this.setState({ paymentStatusRefId: value });
            this.handleRegTableList(1);
        }
    }

    onKeyEnterSearchText = async (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            //called api
        }
    }

    onChangeSearchText = async (e) => {
        console.log(e)
    }

    onClickSearchIcon = async () => {
        console.log("called")
        // this.handleRegTableList(1);
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            // <div className="comp-player-grades-header-view-design" >
            //     <div className="row">
            //         <div className="col-lg-4 col-md-12 d-flex align-items-center" >
            //             <Breadcrumb separator=" > ">
            //                 <Breadcrumb.Item className="breadcrumb-add">{AppConstants.teamRegistrations}</Breadcrumb.Item>
            //             </Breadcrumb>
            //         </div>
            //         <div className="col-sm d-flex align-items-center justify-content-end margin-top-24-mobile">
            //             <div className="comp-product-search-inp-width" >
            //                 <Input className="product-reg-search-input"
            //                     onChange={(e) => this.onChangeSearchText(e)}
            //                     placeholder="Search..."
            //                     onKeyPress={(e) => this.onKeyEnterSearchText(e)}
            //                     prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
            //                         onClick={() => this.onClickSearchIcon()}
            //                     />}
            //                     allowClear
            //                 />
            //             </div>
            //         </div>
            //         <div className="col-sm-1 d-flex align-items-center justify-content-end mr-3" >
            //             <Button className="primary-add-comp-form" type="primary">
            //                 <div className="row">
            //                     <div className="col-sm">
            //                         <img
            //                             src={AppImages.export}
            //                             alt=""
            //                             className="export-image"
            //                         />
            //                         {AppConstants.export}
            //                     </div>
            //                 </div>
            //             </Button>
            //         </div>

            //     </div>
            // </div >
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm-4">
                            <div className="com-year-select-heading-view pb-3">
                                <Breadcrumb separator=" > ">
                                    <Breadcrumb.Item className="breadcrumb-add">{AppConstants.teamRegistrations}</Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                        </div>
                        <div className="col-sm"></div>
                        <div style={{ marginRight: "25px", display: "flex", alignItems: 'center' }} >
                            <div className="comp-product-search-inp-width pb-3" >
                                <Input className="product-reg-search-input"
                                    onChange={(e) => this.onChangeSearchText(e)}
                                    placeholder="Search..."
                                    onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                    prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={() => this.onClickSearchIcon()}
                                    />}
                                    allowClear
                                />
                            </div>
                        </div>
                        <div style={{ marginRight: '1%', display: "flex", alignItems: 'center' }}>
                            <div className="d-flex flex-row-reverse button-with-search pb-3"
                            >
                                <Button className="primary-add-comp-form" style={{ marginRight: 20 }} type="primary">
                                    <div className="row">
                                        <div className="col-sm">
                                            <img
                                                src={AppImages.export}
                                                alt=""
                                                className="export-image"
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
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        let paymentStatus = [
            { id: 1, description: "Not Registered" },
            { id: 2, description: "Registered" }
        ]

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
        const { competitions } = this.props.userRegistrationState;
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="fluid-width" style={{ marginRight: 55 }} >
                    <div className="row reg-filter-row" >
                        <div className="reg-col col-lg-3 col-md-5" >
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
                        <div className="reg-col col-lg-3 col-md-7" >
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
                        <div className="reg-col col-lg-3 col-md-5">
                            <div className="reg-filter-col-cont" style={{ marginRight: '30px' }}>
                                <div className='year-select-heading'>{AppConstants.organisation}</div>
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
                        <div className="reg-col col-lg-3 col-md-7">
                            <div className="reg-filter-col-cont" style={{ marginRight: '30px' }}>
                                <div className='year-select-heading'>{AppConstants.status}</div>
                                <Select
                                    className="year-select reg-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'paymentStatusRefId')}
                                    value={this.state.paymentStatusRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(paymentStatus || []).map((g, index) => (
                                        <Option key={g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
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
        let userRegDashboardList = [{
            "firstName": "Marissa",
            "lastName": "Cooper",
            "organisation": "Netball Queensland",
            "team": "Firebirds",
            "userRegTeam": "Sam Obrien",
            "userRole": "Manager",
            teamRegType: "Individuals to Pay",
            status: "Not Registered"
        }, {
            "firstName": "Samir",
            "lastName": "singh",
            "organisation": "Netball Queensland",
            "team": "Firebirds",
            "userRegTeam": "Sam Obrien",
            "userRole": "Manager",
            teamRegType: "User Registering Paid",
            status: "Registered"
        }]
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
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"10"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
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
        registrationPaymentStatusAction
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
export default connect(mapStatetoProps, mapDispatchToProps)((TeamRegistrations));
