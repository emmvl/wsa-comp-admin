import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal } from "antd";
import "./product.scss";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { regCompetitionListAction, clearCompReducerDataAction, regCompetitionListDeleteAction } from "../../store/actions/registrationAction/competitionFeeAction";
import { getRegistrationChangeDashboard } from "../../store/actions/registrationAction/registrationChangeAction";
import { registrationChangeType } from "../../store/actions/commonAction/commonAction";

import AppImages from "../../themes/appImages";
import { getOnlyYearListAction, CLEAR_OWN_COMPETITION_DATA } from "../../store/actions/appAction";
import { getOrganisationData } from "util/sessionStorage";

const { confirm } = Modal;
const { Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;


/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}


const columns = [
    {
        title: "Current",
        children: [
            {
                title: 'User Name',
                dataIndex: 'userName',
                key: 'userName',
                sorter: (a, b) => tableSort(a, b, "userName")
            },
            {
                title: '1st Affiliate',
                dataIndex: 'affiliate1Name',
                key: 'affiliate1Name',
                sorter: (a, b) => tableSort(a, b, "affiliate1Name")
            },
            {
                title: '2nd Affiliate',
                dataIndex: 'affiliate2Name',
                key: 'affiliate2Name',
                sorter: (a, b) => tableSort(a, b, "affiliate2Name")
            },
            {
                title: 'Competition',
                dataIndex: 'competitionName',
                key: 'competitionName',
                sorter: (a, b) => tableSort(a, b, "competitionName")
            },
        ]
    },
    {
        title: "Transfer",
        children: [
            {
                title: '1st Affiliate',
                dataIndex: 'transferAffiliate_1',
                key: 'transferAffiliate_1',
                sorter: (a, b) => tableSort(a, b, "transferAffiliate_1")
            },
            {
                title: '2nd Affiliate',
                dataIndex: 'transferAffiliate_2',
                key: 'transferAffiliate_2',
                sorter: (a, b) => tableSort(a, b, "transferAffiliate_2")
            },
            {
                title: 'Competition',
                dataIndex: 'transferCompetition',
                key: 'transferCompetition',
                sorter: (a, b) => tableSort(a, b, "transferCompetition")
            },
        ]
    },
    {
        title: "Approvals",
        children: [
            {
                title: 'Membership Type',
                dataIndex: 'membershipTypeName',
                key: 'membershipTypeName',
                sorter: (a, b) => tableSort(a, b, "membershipTypeName")
            },
            {
                title: 'Paid',
                dataIndex: 'paid',
                key: 'paid',
                sorter: (a, b) => tableSort(a, b, "paid")
            },
            {
                title: 'Type',
                dataIndex: 'regChangeType',
                key: 'regChangeType',
                sorter: (a, b) => tableSort(a, b, "regChangeType")
            },
            {
                title: '1st Affiliate',
                dataIndex: 'affiliate1Approved',
                key: 'affiliate1Approved',
                sorter: (a, b) => tableSort(a, b, "affiliate1Approved")
            },
            {
                title: '2nd Affiliate',
                dataIndex: 'affiliate2Approved',
                key: 'affiliate2Approved',
                sorter: (a, b) => tableSort(a, b, "affiliate2Approved")
            },
            {
                title: 'State',
                dataIndex: 'stateApproved',
                key: 'stateApproved',
                sorter: (a, b) => tableSort(a, b, "stateApproved")
            },
            {
                title: 'Status',
                dataIndex: 'approvedStatus',
                key: 'approvedStatus',
                sorter: (a, b) => tableSort(a, b, "approvedStatus")
            },
            {
                title: "Action",
                dataIndex: 'action',
                key: 'action',
                render: (data, record) => <Menu
                    className="action-triple-dot-submenu"
                    theme="light"
                    mode="horizontal"
                    style={{ lineHeight: '25px' }}
                >
                    <Menu.SubMenu
                        key="sub1"
                        style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                        title={
                            <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                        }
                    >
                        <Menu.Item key={'1'}>
                            <NavLink to={{
                                pathname: '/registrationChangeReview',
                            }}><span >Review</span></NavLink>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            }
        ]
    }
];

const Data = [
    {
        "userName": 'Jesse Jones',
        "currentAffiliate_1": 'MWNA',
        "currentAffiliate_2": 'Peninsula',
        "currentCompetition": 'Winter 2020',
        "membershipType": 'Player',
        "paid": '$100',
        "type": 'De-register',
        "approvalAffiliate_1": '$60',
        "approvalAffiliate_2": '$20',
        "state": '$20',
        "status": 'Approved',
        "transferAffiliate_1": '',
        "transferAffiliate_2": '',
        "transferCompetition": 'Winter 2020'

    },
    {
        "userName": 'Marissa Gaybo',
        "currentAffiliate_1": '1WSNA',
        "currentAffiliate_2": 'Concord',
        "currentCompetition": 'Spring 2020',
        "membershipType": 'Player',
        "paid": '$100',
        "type": 'Transfer',
        "approvalAffiliate_1": '$60',
        "approvalAffiliate_2": '$20',
        "status": 'Approved',
        "transferAffiliate_1": '1WSNA',
        "transferAffiliate_2": 'Balmain',
        "transferCompetition": 'Spring 2020'
    },
    {
        "userName": 'Darleen Geros',
        "currentAffiliate_1": 'SSNA',
        "currentAffiliate_2": 'N/A',
        "currentCompetition": 'Winter 2020',
        "membershipType": 'Coach',
        "paid": '$175',
        "type": 'De-register',
        "approvalAffiliate_1": '$45',
        "approvalAffiliate_2": 'N/A',
        "state": '$30',
        "status": 'Partially Approved',
        "transferAffiliate_1": '',
        "transferAffiliate_2": '',
        "transferCompetition": 'Winter 2020'
    },
]

class RegistrationChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteLoading: false,
            userRole: "",
            searchText: '',
            competition: 'All',
            type: 'All',
            yearRefId: -1,
            competitionId: "-1",
            organisationId: getOrganisationData().organisationUniqueKey,
            regChangeTypeRefId: -1,

        };
        this_Obj = this;
        this.props.getOnlyYearListAction(this.props.appState.yearList)
    }

    componentDidMount(){
        this.props.registrationChangeType();
        this.handleRegChangeList(1);
    }

    handleRegChangeList = (page) =>{
        const {
            yearRefId,
            competitionId,
            organisationId,
            regChangeTypeRefId
        } = this.state;

        let filter = {
            organisationId,
            yearRefId,
            competitionId,
            regChangeTypeRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        };

        this.props.getRegistrationChangeDashboard(filter);

        this.setState({ filter });

    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
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
            </div>
        );
    };

    onChangeDropDownValue = async (value, key) => {
        await this.setState({
            [key]: value,
        });

        this.handleRegChangeList(1);
    };
    

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        console.log("this.props.regChangeState", this.props.regChangeState);
        const {regChangeCompetitions} = this.props.regChangeState;
        const {regChangeTypes} = this.props.commonReducerState;
        let competitionList;
        if (this.state.yearRefId !== -1) {
            competitionList = regChangeCompetitions.filter(x => x.yearRefId === this.state.yearRefId);
        } else {
            competitionList = regChangeCompetitions;
        }

        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm pb-3">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    // style={{ width: 90 }}
                                    value={this.state.yearRefId}
                                    onChange={(e) => this.onChangeDropDownValue(e, "yearRefId")}
                                >
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

                        <div className="col-sm pb-3">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select reg-filter-select-competition ml-2"
                                    // style={{ minWidth: 200 }}
                                    value={this.state.competitionId}
                                    onChange={(e) => this.onChangeDropDownValue(e, "competitionId")}
                                >
                                   <Option key={-1} value="-1">{AppConstants.all}</Option>
                                    {(competitionList || []).map((item, cIndex) => (
                                        <Option
                                            key={"competition" + item.competitionId + cIndex}
                                            value={item.competitionId}
                                        >
                                            {item.competitionName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="col-sm pb-3">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.type}:</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    value={this.state.regChangeTypeRefId}
                                    onChange={(e) => this.onChangeDropDownValue(e, "regChangeTypeRefId")}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(regChangeTypes || []).map((g, index) => (
                                        <Option key={g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div style={{ marginRight: '1%', display: "flex", alignItems: 'center' }}>
                            <div className="d-flex flex-row-reverse button-with-search pb-3"
                            // <div className="col-sm d-flex justify-content-end"
                            // onClick={() => this.props.clearCompReducerDataAction("all")}
                            >
                                {/* <NavLink
                                    to={{ pathname: `/registrationCompetitionFee`, state: { id: null } }}
                                    className="text-decoration-none"
                                > */}
                                <Button className="primary-add-product" type="primary">
                                    + {AppConstants.add}
                                </Button>
                                {/* </NavLink> */}
                            </div>
                        </div>

                        <div style={{ marginRight: '1%', display: "flex", alignItems: 'center' }}>
                            <div className="d-flex flex-row-reverse button-with-search pb-3">
                                <Button className="primary-add-comp-form" type="primary">

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
        );
    }

    ////////form content view
    contentView = () => {
        const {regChangeDashboardListData,regChangeDashboardListPage,regChangeDashboardListTotalCount} = this.props.regChangeState;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={regChangeDashboardListData}
                        pagination={false}
                     loading={this.props.regChangeState.onLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={regChangeDashboardListPage}
                        total={regChangeDashboardListTotalCount}
                        onChange={(page) => this.handleRegChangeList(page)}
                    />
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
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"9"} />
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
        regCompetitionListAction, getOnlyYearListAction,
        clearCompReducerDataAction, regCompetitionListDeleteAction,
        CLEAR_OWN_COMPETITION_DATA,
        getRegistrationChangeDashboard,
        registrationChangeType
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        regChangeState: state.RegistrationChangeState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationChange));
