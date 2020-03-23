import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { liveScoreUmpiresListAction } from '../../store/actions/LiveScoreAction/livescoreUmpiresAction'
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getTime, formateTime, liveScore_formateDate } from '../../themes/dateformate'
const { Content } = Layout;

////columens data
const columns = [
    {
        title: 'hgjh',
        dataIndex: 'match',
        key: 'match',
        sorter: (a, b) => a.match.length - b.match.length,
        render: (match) =>
            <span  >{match ? liveScore_formateDate(match.startTime) : ""}</span>
    },
    {
        title: 'Time',
        dataIndex: 'match',
        key: 'match',
        sorter: (a, b) => a.match.length - b.match.length,
        render: (match) =>
            <span  >{match ? getTime(match.startTime) : ""}</span>
    },
    {
        title: 'Match',
        dataIndex: 'match',
        key: 'match',
        sorter: (a, b) => a.match.length - b.match.length,
        render: (match, record) =>
            <NavLink to={{
                pathname: "/liveScoreMatchDetails",
                state: { matchId: record.matchId }
            }}>
                <span className="input-heading-add-another pt-0" >{match.team1.name} vs {match.team2.name}</span>
            </NavLink>
    },
    {
        title: 'First Umpire Name',
        dataIndex: 'umpire1FullName',
        key: 'umpire1FullName',
        sorter: (a, b) => a.umpire1FullName.length - b.umpire1FullName.length,
        key: 'umpire1FullName',
        render: (umpire1FullName) => <NavLink to={{
            // pathname: "/liveScoreMatchDetails",
            // state: { tableRecord: record }
        }}>
            <span className="input-heading-add-another pt-0">{umpire1FullName}</span>
        </NavLink>
    },

    {
        title: 'First Umpire Club',
        dataIndex: 'umpire1Club',
        key: 'umpire1Club',
        sorter: (a, b) => a.umpire1Club.length - b.umpire1Club.length,
        render: (umpire1Club) =>
            <span>{umpire1Club.name}</span>
    },
    {
        title: 'Second Umpire Name',
        dataIndex: 'umpire1FullName',
        key: 'umpire1FullName',
        sorter: (a, b) => a.umpire2FullName.length - b.umpire2FullName.length,
        render: (umpire2FullName) => <NavLink to={{
            // pathname: "/liveScoreMatchDetails",
            // state: { tableRecord: record }
        }}>
            <span className="input-heading-add-another pt-0">{umpire2FullName ? umpire2FullName : ""}</span>
        </NavLink>
    },
    {
        title: 'Second Umpire Club',
        dataIndex: 'umpire1Club',
        key: 'umpire1Club',
        sorter: (a, b) => a.umpire1Club.length - b.umpire1Club.length,
        render: (umpire1Club) =>
            <span>{umpire1Club.name}</span>
    },
];


class LiveScoreUmpireList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.handleUmpireTableList(1, id)
        } else {
            history.push("/")
        }
    }

    handleUmpireTableList(page, competitionId) {

        let offset = page ? 10 * (page - 1) : 0
        this.props.liveScoreUmpiresListAction(competitionId, offset)

    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.umpireList}</Breadcrumb.Item>
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
                        </div>
                    </div>
                </div>

            </div>
        )
    }


    ////////tableView view for Umpire list
    tableView = () => {
        const { umpiresListResult } = this.props.liveScoreUmpiresState
        console.log(umpiresListResult, "umpiresListResult")
        const { id } = JSON.parse(getLiveScoreCompetiton())

        let dataSource = umpiresListResult ? umpiresListResult.matchUmpires : []
        // let total = this.props.umpiresListResult.umpirescount
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreUmpiresState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
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
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            // current={this.props.liveScoreUmpiresState.page.currentPage}
                            current={1}
                            total={10}
                            onChange={(page) => this.handleUmpireTableList(page, id)}
                            defaultPageSize={10}
                        />
                    </div>
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"6"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreUmpiresListAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreUmpiresState: state.LiveScoreUmpiresState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreUmpireList));

