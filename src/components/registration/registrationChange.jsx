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
import AppImages from "../../themes/appImages";
import { getOnlyYearListAction, CLEAR_OWN_COMPETITION_DATA } from "../../store/actions/appAction";

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
                dataIndex: 'currentAffiliate_1',
                key: 'currentAffiliate_1',
                sorter: (a, b) => tableSort(a, b, "currentAffiliate_1")
            },
            {
                title: '2nd Affiliate',
                dataIndex: 'currentAffiliate_2',
                key: 'currentAffiliate_2',
                sorter: (a, b) => tableSort(a, b, "currentAffiliate_2")
            },
            {
                title: 'Competition',
                dataIndex: 'currentCompetition',
                key: 'currentCompetition',
                sorter: (a, b) => tableSort(a, b, "currentCompetition")
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
                dataIndex: 'membershipType',
                key: 'membershipType',
                sorter: (a, b) => tableSort(a, b, "membershipType")
            },
            {
                title: 'Paid',
                dataIndex: 'paid',
                key: 'paid',
                sorter: (a, b) => tableSort(a, b, "paid")
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                sorter: (a, b) => tableSort(a, b, "type")
            },
            {
                title: '1st Affiliate',
                dataIndex: 'approvalAffiliate_1',
                key: 'approvalAffiliate_1',
                sorter: (a, b) => tableSort(a, b, "approvalAffiliate_1")
            },
            {
                title: '2nd Affiliate',
                dataIndex: 'approvalAffiliate_2',
                key: 'approvalAffiliate_2',
                sorter: (a, b) => tableSort(a, b, "approvalAffiliate_2")
            },
            {
                title: 'State',
                dataIndex: 'state',
                key: 'state',
                sorter: (a, b) => tableSort(a, b, "state")
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                sorter: (a, b) => tableSort(a, b, "status")
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
                    {/* <Menu.SubMenu
                key="sub1"
                style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key={'1'}>
                    <NavLink to={{
                        pathname: '/liveScoreAddIncident',
                        state: { isEdit: true, tableRecord: record }
                    }}><span >Edit</span></NavLink>
                </Menu.Item>
            </Menu.SubMenu> */}
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
        "status": 'Approved'
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
        "status": 'Partially Approved'
    },
]

class RegistrationChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            deleteLoading: false,
            userRole: "",
            searchText: '',
            competition: 'All',
            type: 'All'
        };
        this_Obj = this;
        this.props.getOnlyYearListAction(this.props.appState.yearList)
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

    //////year change onchange
    yearChange = (yearRefId) => {
        this.setState({ yearRefId })
        this.handleCompetitionTableList(1, yearRefId, this.state.searchText)
    }
    // on change search text

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    value={this.state.yearRefId}
                                    onChange={(e) => this.yearChange(e)}
                                >
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

                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    value={this.state.competition}
                                // onChange={(e) => this.yearChange(e)}
                                >
                                    <Option value={'All'}>{'All'}</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.type}:</span>
                                <Select
                                    className="year-select"
                                    value={this.state.type}
                                // onChange={(e) => this.yearChange(e)}
                                >
                                    <Option value={'All'}>{'All'}</Option>
                                </Select>
                            </div>
                        </div>

                        <div style={{ marginRight: '1%', display: "flex", alignItems: 'center' }}>
                            <div className="d-flex flex-row-reverse button-with-search"
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
                            <div className="d-flex flex-row-reverse button-with-search">
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

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={Data}
                        pagination={false}
                    // loading={this.props.competitionFeesState.onLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                    // current={competitionFeesState.regCompetitonFeeListPage}
                    // total={total}
                    // onChange={(page) => this.handleCompetitionTableList(page, this.state.yearRefId, this.state.searchText)}
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
        CLEAR_OWN_COMPETITION_DATA
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationChange));
