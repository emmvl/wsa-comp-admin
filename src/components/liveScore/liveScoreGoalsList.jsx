import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Pagination, Select, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreGoalListAction } from '../../store/actions/LiveScoreAction/liveScoreGoalsAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import ApiConstants from "../../themes/apiConstants";
import { liveScore_formateDateTime } from '../../themes/dateformate'

let this_Obj = null
function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}

// function checkSorting(a, b, key) {
//     if (a[0] === b[0]) {
//         return 0;
//     }
//     else {
//         return (a[0] < b[0]) ? -1 : 1;
//     }
// }

const { Content } = Layout;
const { Option } = Select;


class LiveScoreGoalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            teamSelection: "WSA 1",
            selectStatus: "Select Status",
            filter: "By Match",

            columns1: [

                {
                    title: 'Match Id',
                    dataIndex: 'matchId',
                    key: 'matchId',
                    sorter: (a, b) => checkSorting(a, b, "matchId"),


                },
                {
                    title: 'Date',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    sorter: (a, b) => checkSorting(a, b, "startTime"),
                    render: (startTime) => <span  >{liveScore_formateDateTime(startTime)}</span>

                },
                {
                    title: 'Team',
                    dataIndex: 'teamName',
                    key: 'teamName',
                    sorter: (a, b) => checkSorting(a, b, "teamName"),
                },
                {
                    title: 'First Name',
                    dataIndex: 'firstName',
                    key: 'firstName',
                    sorter: (a, b) => checkSorting(a, b, "firstName"),
                    render: (firstName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{firstName}</span>
                        </NavLink>
                },
                {
                    title: 'Last Name',
                    dataIndex: 'lastName',
                    key: 'lastName',
                    sorter: (a, b) => checkSorting(a, b, 'lastName'),
                    render: (lastName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{lastName}</span>
                        </NavLink>
                },
                {
                    title: 'Position',
                    dataIndex: 'gamePositionName',
                    key: 'gamePositionName',
                    sorter: (a, b) => checkSorting(a, b, "gamePositionName"),

                },
                {
                    title: 'Attempts',
                    dataIndex: 'attempts',
                    key: 'attempts',
                    sorter: (a, b) => checkSorting(a, b, "attempts"),
                },
                {
                    title: 'Goals',
                    dataIndex: 'goal',
                    key: 'goal',
                    sorter: (a, b) => checkSorting(a, b, "goal"),

                },
                {
                    title: 'Goals%',
                    dataIndex: 'goal_percent',
                    key: 'goal_percent',
                    sorter: (a, b) => checkSorting(a, b, "goal_percent"),
                },
            ],
            columns2: [
                {
                    title: 'Team',
                    dataIndex: 'teamName',
                    key: 'teamName',
                    sorter: (a, b) => checkSorting(a, b, "teamName"),
                },
                {
                    title: 'First Name',
                    dataIndex: 'firstName',
                    key: 'firstName',
                    sorter: (a, b) => checkSorting(a, b, "firstName"),
                    render: (firstName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{firstName}</span>
                        </NavLink>
                },
                {
                    title: 'Last Name',
                    dataIndex: 'lastName',
                    key: 'lastName',
                    sorter: (a, b) => checkSorting(a, b, 'lastName'),
                    render: (lastName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{lastName}</span>
                        </NavLink>
                },
                {
                    title: 'Position',
                    dataIndex: 'gamePositionName',
                    key: 'gamePositionName',
                    sorter: (a, b) => checkSorting(a, b, "gamePositionName"),
                },
                {
                    title: 'Attempts',
                    dataIndex: 'attempts',
                    key: 'attempts',
                    sorter: (a, b) => checkSorting(a, b, "attempts"),
                },
                {
                    title: 'Goals',
                    dataIndex: 'goal',
                    key: 'goal',
                    sorter: (a, b) => checkSorting(a, b, "goal"),
                },
                {
                    title: 'Goals%',
                    dataIndex: 'goal_percent',
                    key: 'goal_percent',
                    sorter: (a, b) => checkSorting(a, b, "goal_percent"),
                },
            ],
        }
        this_Obj = this
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScoreGoalListAction(1, "By Match")
        } else {
            history.push('/')
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view ">
                < div className="row" >
                    <div className="col-sm" style={{ alignSelf: 'center' }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.goalState}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm" style={{
                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}>
                        <div className="row">
                            <div className="col-sm">
                                <Select
                                    className="year-select"
                                    style={{ display: "flex", alignItems: "flex-start" }}
                                    onChange={(filter) => {
                                        this.setState({ filter })
                                        this.props.liveScoreGoalListAction(1, filter)
                                    }}
                                    value={this.state.filter} >
                                    <Option value={AppConstants.ByMatch}>{AppConstants.ByMatch}</Option>
                                    <Option value={AppConstants.total}>{AppConstants.total}</Option>
                                </Select>
                            </div>
                            <div className="col-sm"
                                style={{ display: "flex" }}>
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignSelf: 'center',
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end"
                                    }} >
                                    <Button className="primary-add-comp-form" type="primary">
                                        <div className="row">
                                            <div className="col-sm">
                                                <img
                                                    src={AppImages.export}
                                                    alt=""
                                                    height="12"
                                                    width="12"
                                                    style={{ marginRight: 5 }}
                                                />
                                                {AppConstants.export}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div>
        )
    }
    ////////form content view
    contentView = () => {
        const { liveScoreGoalState } = this.props;
        // let DATA = liveScoreMatchListState ? liveScoreMatchListState.liveScoreMatchListData : []
        let goalList = liveScoreGoalState ? liveScoreGoalState.result : [];
       
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreGoalState.onLoad == true && true} className="home-dashboard-table" columns={this.state.filter == "By Match" ? this.state.columns1 : this.state.columns2} dataSource={goalList} pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        defaultCurrent={1}
                        total={8}
                    // onChange={this.handleTableChange}
                    />
                </div>
            </div>
        )
    }

    /////// render function
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.shootingStats} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"16"} />
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
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreGoalListAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreGoalState: state.LiveScoreGoalState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreGoalList));


