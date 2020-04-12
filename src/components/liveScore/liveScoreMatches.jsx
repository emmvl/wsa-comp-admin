import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Pagination, } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import matchList from "../../mocks/liveScoreMatchesList.mock"
import { NavLink } from "react-router-dom";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreMatchListAction } from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { liveScore_formateDateTime, formatDateTime, liveScore_MatchFormate } from '../../themes/dateformate'

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}


const { Content } = Layout;

const columns = [
    {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
        render: (id) => <NavLink to={{
            pathname: '/liveScoreMatchDetails',
            state: { matchId: id }
        }} >
            <span class="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime) =>
            <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        // render: (team1) => <span class="input-heading-add-another pt-0">{team1.name}</span>
        render: (team1, record) =>
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team1, screenName: 'fromMatchList' }
            }} >
                <span class="input-heading-add-another pt-0" >{team1.name}</span>
            </NavLink>
    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, "team2"),

        render: (team2, record) =>
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team2, screenName: 'fromMatchList' }
            }} >
                <span class="input-heading-add-another pt-0" >{team2.name}</span>
            </NavLink>
    },
    {
        title: 'Venue',
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: (a, b) => tableSort(a, b, "venueCourt"),
        render: (venueCourt) => <span>{venueCourt.venue.name}</span>
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => tableSort(a, b, "division"),
        render: (division) => <span>{division.name}</span>
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b) => tableSort(a, b, "score"),
        render: (score) => <span nowrap>{score}</span>
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        sorter: (a, b) => tableSort(a, b, "type"),
    },
    {
        title: 'Match Duration',
        dataIndex: 'matchDuration',
        key: 'matchDuration',
        sorter: (a, b) => tableSort(a, b, "matchDuration"),
    },
    {
        title: 'Main Break',
        dataIndex: 'mainBreakDuration',
        key: 'mainBreakDuration',
        sorter: (a, b) => tableSort(a, b, "mainBreakDuration"),
    },
    {
        title: 'Quater Break',
        dataIndex: 'qtrBreak',
        key: 'qtrBreak',
        sorter: (a, b) => tableSort(a, b, "qtrBreak"),
    },
];

class LiveScoreMatchesList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        // let competitionID = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.handleMatchTableList(1, id)
        } else {
            history.push('/')
        }
    }

    handleMatchTableList(page, competitionID) {
        let offset = page ? 10 * (page - 1) : 0;
        let start = 1
        this.props.liveScoreMatchListAction(competitionID, start, offset)

    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.matchList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">
                            <div className="col-sm">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to="/liveScoreAddMatch">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addMatches}
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
                                    <NavLink to="/liveScoreMatchImport">
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
        )
    }

    //////// tableView
    tableView = () => {
        const { liveScoreMatchListState } = this.props;
        let DATA = liveScoreMatchListState ? liveScoreMatchListState.liveScoreMatchListData : []
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let total = liveScoreMatchListState.liveScoreMatchListTotalCount;

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreMatchListState.onLoad == true && true}
                        className="home-dashboard-table" columns={columns}
                        dataSource={DATA}
                        pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={liveScoreMatchListState.liveScoreMatchListPage}
                        total={total}
                        onChange={(page) => this.handleMatchTableList(page, id)}
                        defaultPageSize={10}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick ={()=>history.push("./liveScoreCompetitions")}/>
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreMatchListAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchListState: state.LiveScoreMatchState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreMatchesList));

