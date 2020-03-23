import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Select } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { gameTimeStatisticsListAction } from '../../store/actions/LiveScoreAction/liveScoregameTimeStatisticsAction'
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { parseTwoDigitYear } from "moment";

const { Content } = Layout;
const { Option } = Select;

var this_obj = null

/// Check play percentage value
function checkPlay(record) {

    let playTimeTeamMatches = JSON.parse(record.playTimeTeamMatches)
    let playTime = JSON.parse(record.playTime)


    let result = 100 * (playTime / playTimeTeamMatches)

    return result.toFixed(2) + "%"

}

// /// Check play time
// function checkPlayTime(record) {
//     console.log(this_obj.state.filter)
//     if (this_obj.state.filter == "MINUTE") {
//         let playTimeValue = JSON.parse(record.playTime)

//         return (playTimeValue % 60) + " mins"

//     } else {
//         let playTimeValue = JSON.parse(record.playTime)

//         return playTimeValue + " hrs"
//     }

// }


//// Check play time
function checkPlayTime(record) {
    if (record.playTime !== null) {
        if (this_obj.state.filter == AppConstants.totalGame) {
            if (record.playTime == 0) {
                return record.playTime + " Games"
            } else if (record.playTime == 1) {
                return record.playTime + " Game"
            } else {
                return record.playTime + " Games"
            }
        } else if (this_obj.state.filter == AppConstants.minute) {
            var num = record.playTime;
            var hours = (num / 60);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            if (record.playTime == 1) {
                return rminutes + " Minute";
            } else if (record.playTime > 60) {
                // if (rhours == 1 || rminutes == 1) {
                //     return rhours + " Hour " + rminutes + " Minute";
                // } else {
                {
                    return rhours + " Hours " + rminutes + " Minutes";
                }

            } else {
                return rminutes + " Minutes";
            }
        } else {
            if (record.playTime == 0) {
                return record.playTime + " Periods"
            } else if (record.playTime == 1) {
                return record.playTime + " Period"
            } else {
                return record.playTime + " Periods"
            }
        }
    }
}

////columens data
const columns = [

    {
        title: 'Player Id',
        dataIndex: 'player',
        key: 'player',
        sorter: (a, b) => a.player.length - b.player.length,
        render: (player) =>
            <span class="input-heading-add-another pt-0" >{player.mnbPlayerId ? player.mnbPlayerId : player.id}</span>
    },
    {
        title: 'First name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        render: (firstName) =>
            <span class="input-heading-add-another pt-0" >{firstName}</span>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.length - b.lastName.length,
        render: (lastName) =>
            <span class="input-heading-add-another pt-0" >{lastName}</span>
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.length - b.team.length,
        render: (team) =>
            <span class="input-heading-add-another pt-0" >{team.name}</span>
    },
    {
        title: 'DIV',
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => a.division.length - b.division.length,
        render: (division) =>
            <span >{division ? division.name : ""}</span>
    },
    {
        title: 'Play Time',
        dataIndex: 'playTime',
        key: 'playTime',
        sorter: (a, b) => a.playTime.length - b.playTime.length,
        render: (playTime, record) =>
            <span >{checkPlayTime(record)}</span>
    },
    {
        title: 'Play %',
        dataIndex: 'playPercent',
        key: 'playPercent',
        // sorter: (a, b) => a.playPercent.length - b.playPercent.length,
        render: (playTime, record) =>
            <span  >{checkPlay(record)}</span>
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
            filter: "Periods"
        };
        this_obj = this
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.handleGameTimeTableList(1, id, this.state.filter)
        } else {
            history.push("/")
        }
    }

    handleGameTimeTableList(page, competitionId, aggergate) {
        console.log(page, competitionId, aggergate, "headers")
        let offset = page ? 10 * (page - 1) : 0

        this.props.gameTimeStatisticsListAction(competitionId, aggergate, offset)

    }

    setFilterValue = (data) => {
        var dataFilter = data.filter
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let offset = 1 ? 10 * (1 - 1) : 0
        this.setState({ filter: data.filter })
        this.props.gameTimeStatisticsListAction(id, data.filter, offset)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row" >
                    <div className="col-sm" style={{ alignSelf: 'center' }} >
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
                            <Select
                                className="year-select"
                                style={{ display: "flex", alignItems: "flex-start" }}
                                // onChange={(selectStatus) => this.setState({ selectStatus })}
                                onChange={(filter) => this.setFilterValue({ filter })}
                                value={this.state.filter} >
                                <Option value={AppConstants.period}>{AppConstants.periods}</Option>
                                <Option value={AppConstants.minute}>{AppConstants.minutes}</Option>
                                <Option value={AppConstants.totalGame}>{AppConstants.totalGames}</Option>
                            </Select>

                            <div className="col-sm"
                                style={{ display: "flex" }}>
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        alignSelf: 'center',
                                    }}>
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
                    </div>
                </div >
            </div >
        )
    }

    ////////tableView view for Game Time list
    tableView = () => {
        const { gameTimeStatisticsListResult } = this.props.liveScoreGameTimeStatisticsState
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let dataSource = gameTimeStatisticsListResult ? gameTimeStatisticsListResult.stats : []
        let total = this.props.liveScoreGameTimeStatisticsState.gameTimeStatisticstotalCount
        console.log(dataSource, 'dataSource')

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreGameTimeStatisticsState.onLoad == true && true}
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
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
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
    return bindActionCreators({ gameTimeStatisticsListAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreGameTimeStatisticsState: state.LiveScoreGameTimeStatisticsState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreGameTimeList));

