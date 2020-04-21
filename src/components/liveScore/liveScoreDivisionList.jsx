import React, { Component } from "react";
import { Layout, Button, Table, Pagination, Menu, Modal } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { getLiveScoreDivisionList, liveScoreDeleteDivision } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from '../../util/helpers'
import history from "../../util/history";
const { Content } = Layout;
const { SubMenu } = Menu;
const { confirm } = Modal;
let this_Obj = null;
//// table columns
/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}




const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a,b, "name")
    },

    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => tableSort(a,b, "divisionName")
    },
    {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
        sorter: (a, b) => tableSort(a,b, "grade")
    },
    {
        title: 'Action',
        dataIndex: 'isUsed',
        key: 'isUsed',
        // width: 20,
        render: (isUsed, record) =>
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}
            >
                <SubMenu
                    key="sub1"
                    title={
                        <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink to={{
                            pathname: "/liveScoreAddDivision",
                            state: { isEdit: true, tableRecord: record }
                        }}>
                            <span >Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(record.id)}>
                        <span >Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
    },
];

class LiveScoreDivisionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
        }

        this_Obj = this;
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.getLiveScoreDivisionList(id)
    }

    ////////form content view
    contentView = () => {
        let divisionList = isArrayNotEmpty(this.props.liveScoreDivisionState.liveScoreDivisionList) ? this.props.liveScoreDivisionState.liveScoreDivisionList : []

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns} dataSource={divisionList}
                        pagination={false}
                        loading={this.props.liveScoreDivisionState.onLoad === true && true}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }} >
                        <Pagination
                            className="auto-pagination"
                            defaultCurrent={1}
                            total={8} />
                    </div>
                </div>
            </div>
        )
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <span className="form-heading">
                                {AppConstants.divisionList}
                            </span>
                        </div>
                        <div className="col-sm"
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-end"
                            }}>
                            <div className="row">
                                <div className="col-sm">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to={`/liveScoreAddDivision`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addDivision}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to={`/liveScoreDivisionImport`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                <div className="row">
                                                    <div className="col-sm">
                                                        <img
                                                            src={AppImages.import}
                                                            alt=""
                                                            className="export-image"
                                                        />
                                                        {AppConstants.import}
                                                    </div>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    deleteTeam = (divisionId) => {
        this.props.liveScoreDeleteDivision(divisionId)
    }

    showDeleteConfirm = (divisionId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this division?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteTeam(divisionId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"9"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchtoprops(dispatch) {
    return bindActionCreators({
        getLiveScoreDivisionList,
        liveScoreDeleteDivision
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreDivisionState: state.LiveScoreDivisionState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreDivisionList));
