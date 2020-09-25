import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Button, Table, Breadcrumb, Pagination, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { gameTimeStatisticsListAction } from '../../store/actions/LiveScoreAction/liveScoregameTimeStatisticsAction'
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { exportFilesAction } from "../../store/actions/appAction"
import { teamListData } from "../../util/helpers";

const { Content } = Layout;
const { Option } = Select;

var this_obj = null

/// Check play percentage value
function checkPlay(record) {
    let playTimeTeamMatches = JSON.parse(record.playTimeTeamMatches)
    let playTime = record.playTime ? JSON.parse(record.playTime) : 0

    if (playTimeTeamMatches === 0 || playTimeTeamMatches === null) {
        return ""
    } else {
        let result = 100 * (playTime / playTimeTeamMatches)
        return result.toFixed(2) + "%"
    }
}

//// Check play time
function checkPlayTime(record) {
    if (record.playTime !== null) {
        if (this_obj.state.filter === "MATCH") {
            if (record.playTime === 0) {
                return record.playTime + " Games"
            } else if (record.playTime === 1) {
                return record.playTime + " Game"
            } else {
                return record.playTime + " Games"
            }
        } else if (this_obj.state.filter === AppConstants.minute) {
            let d = Number(record.playTime);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
            var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
            var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
            let time_value = hDisplay + mDisplay + sDisplay;

            return time_value
        } else {
            if (record.playTime === 0) {
                return record.playTime + " Periods"
            } else if (record.playTime === 1) {
                return record.playTime + " Period"
            } else {
                return record.playTime + " Periods"
            }
        }
    }
}

function checkPlayerId(player) {
    if (player.mnbPlayerId == "undefined" || player.mnbPlayerId == "") {
        return player.id
    } else {
        return player.mnbPlayerId
    }
}

//listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    this_obj.setState({ sortBy, sortOrder });

    this_obj.props.gameTimeStatisticsListAction(this_obj.state.competitionId, this_obj.state.filter === 'All' ? "" : this_obj.state.filter, this_obj.state.offset, this_obj.state.searchText, sortBy, sortOrder)
}

const columns = [
    {
        title: 'Player Id',
        dataIndex: 'player',
        key: 'player',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('playerId'),
        render: (player, record) => <NavLink to={{
            pathname: '/liveScorePlayerView',
            state: { tableRecord: record }
        }} >
            <span className="input-heading-add-another pt-0" >{checkPlayerId(player)}</span>
        </NavLink>
    },
    {
        title: 'First name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('firstName'),
        render: (firstName, player) => <NavLink to={{
            pathname: '/liveScorePlayerView',
            state: { tableRecord: player }
        }} >
            <span className="input-heading-add-another pt-0" >{firstName}</span>
        </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: true,
        onHeaderCell: () => listeners('lastName'),
        render: (lastName, player) => <NavLink to={{
            pathname: '/liveScorePlayerView',
            state: { tableRecord: player }
        }} >
            <span className="input-heading-add-another pt-0" >{lastName}</span>
        </NavLink>
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: true,
        onHeaderCell: () => listeners('team'),
        render: (team) => teamListData(team.id) ?
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team, screenName: 'fromGameTimeList' }
            }} >
                <span className="input-heading-add-another pt-0" >{team.name}</span>
            </NavLink> : <span>{team.name}</span>
    },
    {
        title: 'DIV',
        dataIndex: 'division',
        key: 'division',
        sorter: true,
        onHeaderCell: () => listeners('div'),
        render: (division) =>
            <span>{division ? division.name : ""}</span>
    },
    {
        title: 'Play Time',
        dataIndex: 'playTime',
        key: 'playTime',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (playTime, record) =>
            <span>{checkPlayTime(record)}</span>
    },
    {
        title: 'Play %',
        dataIndex: 'playPercent',
        key: 'playPercent',
        sorter: true,
        onHeaderCell: () => listeners('playPercent'),
        render: (playTime, record) =>
            <span>{checkPlay(record)}</span>
    },
    // {
    //     title: 'Playing Up %',
    //     dataIndex: 'playingUp',
    //     key: 'playingUp',
    //     sorter: (a, b) => a.playingUp.length - b.playingUp.length,
    //     render: (playingUp) =>
    //         <span class="input-heading-add-another pt-0" style={{ color: playingUp < '25%' ? 'red' : 'green' }} >{playingUp}</span>
    // },
];

class LiveScoreGameTimeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectStatus: "Select Status",
            filter: '',
            competitionId: null,
            searchText: '',
            offset: 0
        };
        this_obj = this
    }

    componentDidMount() {
        const { id, attendanceRecordingPeriod } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id, filter: attendanceRecordingPeriod })
        if (id !== null) {
            this.props.gameTimeStatisticsListAction(id, attendanceRecordingPeriod, 0, this.state.searchText)
        } else {
            history.push("/")
        }
    }

    handleGameTimeTableList = (page, competitionId, aggregate) => {
        let offset = page ? 10 * (page - 1) : 0
        this.setState({ offset: offset })

        this.props.gameTimeStatisticsListAction(competitionId, aggregate === 'All' ? "" : aggregate, offset, this.state.searchText, this.state.sortBy, this.state.sortOrder)
    }

    setFilterValue = (data) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let offset = 1 ? 10 * (1 - 1) : 0
        this.setState({ filter: data.filter })
        this.props.gameTimeStatisticsListAction(id, data.filter === 'All' ? "" : data.filter, offset, this.state.searchText, this.state.sortBy, this.state.sortOrder)
    }

    onExport = () => {
        let url = AppConstants.gameTimeExport + this.state.competitionId + `&aggregate=${this.state.filter}`
        this.props.exportFilesAction(url)
    }

    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        if (e.target.value === null || e.target.value === "") {
            this.props.gameTimeStatisticsListAction(id, this.state.filter === 'All' ? "" : this.state.filter, 0, e.target.value, this.state.sortBy, this.state.sortOrder)
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        // this.setState({ searchText: e.target.value })
        if (code === 13) { //13 is the enter keycode
            this.props.gameTimeStatisticsListAction(id, this.state.filter === 'All' ? "" : this.state.filter, 0, this.state.searchText, this.state.sortBy, this.state.sortOrder)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText === null || this.state.searchText === "") {
        }
        else {
            this.props.gameTimeStatisticsListAction(id, this.state.filter === 'All' ? "" : this.state.filter, 0, this.state.searchText, this.state.sortBy, this.state.sortOrder)
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row">
                    <div className="col-sm" style={{ alignSelf: 'center' }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.gameTimeStatistics}</Breadcrumb.Item>
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
                                    className="year-select reg-filter-select1"
                                    style={{ display: "flex", justifyContent: "flex-end", minWidth: 140 }}
                                    // onChange={(selectStatus) => this.setState({ selectStatus })}
                                    onChange={(filter) => this.setFilterValue({ filter })}
                                    value={this.state.filter}
                                >
                                    {/* <Option value={'All'}>{'All'}</Option> */}
                                    <Option value={AppConstants.period}>{AppConstants.periods}</Option>
                                    <Option value={AppConstants.minute}>{AppConstants.minutes}</Option>
                                    <Option value={AppConstants.matches}>{AppConstants.totalGames}</Option>
                                </Select>
                            </div>
                            <div className="col-sm" style={{ display: "flex" }}>
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignSelf: 'center',
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button onClick={this.onExport} className="primary-add-comp-form" type="primary">
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
                    </div>
                </div>
                {/* search box */}
                <div className="col-sm pt-3 ml-3 " style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <div className="comp-product-search-inp-width">
                        <Input
                            className="product-reg-search-input"
                            onChange={this.onChangeSearchText}
                            placeholder="Search..."
                            onKeyPress={this.onKeyEnterSearchText}
                            prefix={
                                <SearchOutlined
                                    style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    onClick={this.onClickSearchIcon}
                                />
                            }
                            allowClear
                        />
                    </div>
                </div>
            </div>
        )
    }

    ////////tableView view for Game Time list
    tableView = () => {
        const { gameTimeStatisticsListResult } = this.props.liveScoreGameTimeStatisticsState
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let dataSource = gameTimeStatisticsListResult ? gameTimeStatisticsListResult.stats : []
        let total = this.props.liveScoreGameTimeStatisticsState.gameTimeStatisticstotalCount

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreGameTimeStatisticsState.onLoad === true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        rowKey={(record, index) => 'gameTime' + index}
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
                        }}
                    />
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            current={this.props.liveScoreGameTimeStatisticsState.gameTimeStatisticsPage}
                            total={total}
                            onChange={(page) => this.handleGameTimeTableList(page, id, this.state.filter)}
                            // defaultPageSize={10}
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
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"15"} />
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
// export default LiveScoreGameTimeList;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ gameTimeStatisticsListAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreGameTimeStatisticsState: state.LiveScoreGameTimeStatisticsState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreGameTimeList);
