import React, { Component } from "react";
import { Layout, Input, Button, Table, Breadcrumb } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreDashboardListAction } from '../../store/actions/LiveScoreAction/liveScoreDashboardAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { liveScore_formateDate } from '../../themes/dateformate'
import { liveScore_formateDateTime } from '../../themes/dateformate'
import { NavLink } from 'react-router-dom';
import AppImages from "../../themes/appImages";
import moment from "moment";
import { isArrayNotEmpty } from "../../util/helpers";
import Tooltip from 'react-png-tooltip'

const { Content } = Layout;
let this_obj = null;

/////function to sort table column
function tableSort(a, b, key) {
    //if (a[key] && b[key]) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
    //}

}

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}

function getFirstName(incidentPlayers) {
    let firstName = incidentPlayers.length > 0 ? incidentPlayers[0].player.firstName : ""
    return firstName
}

function getLastName(incidentPlayers) {
    let lastName = incidentPlayers.length > 0 ? incidentPlayers[0].player.lastName : ""
    return lastName
}

const columnActiveNews = [
    {
        title: "Title",
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => tableSort(a, b, "title")

    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        sorter: (a, b) => tableSort(a, b, "author")

    },
    {
        title: 'Expiry',
        dataIndex: 'news_expire_date',
        key: 'news_expire_date',
        sorter: (a, b) => tableSort(a, b, "news_expire_date"),
        render: (news_expire_date) =>
            <span>{news_expire_date && liveScore_formateDate(news_expire_date)}</span>

    },
    {
        title: 'Recipients',
        dataIndex: 'recipients',
        key: 'recipients',
        sorter: (a, b) => tableSort(a, b, 'recipients'),

    },
    {
        title: "Published",
        dataIndex: 'isActive',
        key: 'isActive',
        sorter: (a, b) => tableSort(a, b, 'isActive'),

        render: isActive =>
            <span>{isActive == 1 ? "Yes" : "NO"}</span>
        // <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
        //     <img className="dot-image"
        //         src={isActive == 1 ? AppImages.greenDot : AppImages.redDot}
        //         alt="" width="12" height="12" />
        // </span>,
    },
    {
        title: "Published Date",
        dataIndex: 'published_at',
        key: 'published_at',
        sorter: (a, b) => tableSort(a, b, 'published_at'),
        render: (published_at) =>
            <span>{published_at && liveScore_formateDate(published_at)}</span>



    },
    {
        title: "Notification",
        dataIndex: 'isNotification',
        key: 'isNotification',
        sorter: (a, b) => tableSort(a, b, 'isNotification'),
        render: (isNotification) =>
            <span>
                {isNotification == 0 ? 'No' : 'Yes'}
            </span>
    }
];


const columnsTodaysMatch = [
    {
        title: "Match Id",
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, 'id'),
        render: (id) => <NavLink to={{
            pathname: '/liveScoreMatchDetails',
            state: { matchId: id, key: 'dashboard' }
        }} >
            <span class="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, 'startTime'),
        render: (startTime) =>
            <span >{liveScore_formateDateTime(startTime)}</span>

    },

    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, 'team1'),
        render: (team1, record) =>
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team1, key: 'dashboard' }
            }} >
                <span class="input-heading-add-another pt-0" >{team1.name}</span>
            </NavLink>

    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, 'team2'),
        render: (team2, record) =>
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team2, key: 'dashboard' }
            }} >
                <span class="input-heading-add-another pt-0" >{team2.name}</span>
            </NavLink>
    },
    {
        title: 'Venue',
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        //  sorter: (a, b) => a.venueCourt.name.length - b.venueCourt.name.length,
        sorter: (a, b, venueCourt) => checkSorting(a, b, venueCourt.name),
        render: (venueCourt) =>
            <span >{venueCourt.name}</span>

    },
    {
        title: "Div",
        dataIndex: 'division',
        key: 'division',
        //sorter: (a, b) => a.division.name.length - b.division.name.length,
        // sorter: (a, b, division) => tableSort(a, b, division.name),
        render: (division) =>
            <span >{division.name}</span>
    },
    {
        title: "Score",
        dataIndex: 'score',
        key: 'score',
        // sorter: (a, b, records) => tableSort(a, b, records.team1Score, records.team2Score),
        render: (score, records) =>
            <NavLink to={{
                pathname: '/liveScoreMatchDetails',
                state: { matchId: records.id, key: 'dashboard' }
            }} ><span nowrap class="input-heading-add-another pt-0" >{records.team1Score + " : " + records.team2Score} </span></NavLink>
    }, {
        title: "Umpire",
        dataIndex: 'competition',
        key: 'competition',
        //sorter: (a, b) => a.competition.recordUmpire.length - b.competition.recordUmpire.length,
        // sorter: (a, b, competition) => tableSort(a, b, competition.recordUmpire),
        render: (competition) =>
            <span class="input-heading-add-another pt-0" onClick={() => { console.log('hello clcicked ') }} >{competition.recordUmpire}</span>
    }, {
        title: "Scorer 1",
        dataIndex: 'scorer1Status',
        key: 'scorer1Status',
        sorter: (a, b) => tableSort(a, b, "scorer1Status"),
        render: (scorer1Status) =>
            <span>{isArrayNotEmpty(scorer1Status) ? scorer1Status[0].r_status == "YES" ? "Accepted" : "Not Accepted" : "Not SET"}</span>

    }, {
        title: "Scorer 2",
        dataIndex: 'scorer2Status',
        key: 'scorer2Status',
        sorter: (a, b) => tableSort(a, b, "scorer2Status"),
        render: (scorer2Status, record) =>
            <span >{record.competition.scoringType == 'SINGLE' ? "" : isArrayNotEmpty(scorer2Status) ? scorer2Status[0].r_status == "YES" ? "Accepted" : "Not Accepted" : "  Not SET"}</span>



    },
    {
        title: "Player Attendance Team A",
        dataIndex: 'teamAttendanceCountA',
        key: 'teamAttendanceCountA',
        sorter: (a, b) => tableSort(a, b, "teamAttendanceCountA"),
        render: (teamAttendanceCountA, record) =>
            <span >{teamAttendanceCountA > 0 ? "Complete" : "Not Complete"}</span>

    },
    {
        title: "Player Attendance Team B",
        dataIndex: 'teamAttendanceCountB',
        key: 'teamAttendanceCountB',
        sorter: (a, b) => tableSort(a, b, "teamAttendanceCountB"),
        render: (teamAttendanceCountB, record) =>
            <span >{teamAttendanceCountB > 0 ? "Complete" : "Not Complete"}</span>

    },
    {
        title: "Status",
        dataIndex: 'matchStatus',
        key: 'matchStatus',
        sorter: (a, b) => tableSort(a, b, "matchStatus"),
    },


];


const columnsTodaysIncient = [
    {
        title: "Date",
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => checkSorting(a, b, 'matchId'),
        render: (date, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record }
            }}>
                <span className="input-heading-add-another pt-0">{liveScore_formateDate(date.startTime)}</span>
            </NavLink>
    },
    {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.length - b.matchId.length,
    },
    {
        title: 'First Name',
        dataIndex: 'incidentPlayers',
        key: 'incidentPlayers',
        // sorter: (a, b) => a.incidentPlayers.player.firstName.length - b.incidentPlayers.player.firstName.length,
        render: (incidentPlayers, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: incidentPlayers[0].player }
            }}>
                <span className="input-heading-add-another pt-0">{getFirstName(incidentPlayers)}</span>
            </NavLink>
        ,
        sorter: (a, b) => tableSort(a, b, "incidentPlayers")

    },
    {
        title: 'Last Name',
        dataIndex: 'incidentPlayers',
        key: 'incidentPlayers',
        //   sorter: (a, b) => a.lastName.length - b.lastName.length,
        //sorter: (a, b,incidentPlayers) => checkSorting(a, b, incidentPlayers.),
        render: (incidentPlayers, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: incidentPlayers[0].player }
            }}>
                <span className="input-heading-add-another pt-0">{getLastName(incidentPlayers)}</span>
            </NavLink>
    },
    {
        title: "Association",
        dataIndex: 'association',
        key: 'association',
        sorter: (a, b) => checkSorting(a, b, "association"),
    },
    {
        title: "Club",
        dataIndex: 'club',
        key: 'club',
        sorter: (a, b) => checkSorting(a, b, "club"),
    },
    {
        title: "Team",
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => checkSorting(a, b, "team"),
        render: (team) =>
            <span class="input-heading-add-another pt-0">{team}</span>
    },
    // {
    //     title: "Clam",
    //     dataIndex: 'clam',
    //     key: 'clam',
    //     sorter: (a, b) => checkSorting(a, b, "clam"),
    // },
    {
        title: "Description",
        dataIndex: 'description',
        key: 'description',
        //sorter: (a, b) => a.description.length - b.description.length,
        sorter: (a, b, description) => checkSorting(a, b, description),
    },
];

const columnsPlayersToPay = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
        // render: (firstName, record) =>
        //     <span class="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{firstName}</span>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => checkSorting(a, b, "lastName"),
        // render: (lastName, record) =>
        //     <span class="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{lastName}</span>
    },
    {
        title: "Linked",
        dataIndex: 'linked',
        key: 'linked',
        sorter: (a, b) => checkSorting(a, b, "linked"),
    },
    {
        title: "Division",
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => checkSorting(a, b, "division"),
    },
    {
        title: "Grade",
        dataIndex: 'grade',
        key: 'grade',
        sorter: (a, b) => checkSorting(a, b, "grade"),
    },
    {
        title: "Team",
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => checkSorting(a, b, "team"),
    },
    {
        title: "Payment Required",
        dataIndex: 'payReq',
        key: 'payReq',
        sorter: (a, b, payReq) => checkSorting(a, b, payReq),
    },
];

const playerTopay = [
    {
        "firstName": "Sam",
        "lastName": "Ham",
        "linked": "Cromer Netball Club",
        "division": "11B",
        "team": "WSA 1",
        "grade": "A",
        "payReq": "Voucher redemption"
    }
]


class LiveScoreDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incidents: "incidents"
        }
    }

    componentDidMount() {
        let competitionID = getCompetitonId()
        let startDay = this.getStartofDay()

        let currentTime = moment.utc().format()

        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScoreDashboardListAction(id, startDay, currentTime)
        } else {
            history.push('/')
        }
    }

    checkUserId(record) {
        console.log(record, 'checkUserId')
        // if (record.userId == null) {
        //     message.config({ duration: 1.5, maxCount: 1 })
        //     message.warn(ValidationConstants.playerMessage)
        // }
        // else {
        //     history.push("/userPersonal", { userId: record.userId, screenKey: "livescore", screen: "/liveScorePlayerList" })
        // }
    }


    getStartofDay() {
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        let a = moment.utc(start).format()
        return a
    }

    ////////participatedView view for competition
    incidenceView = () => {
        const { dashboardIncidentList } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.incidentHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreDashboardState.onLoad == true && true}
                        className="home-dashboard-table" columns={columnsTodaysIncient}
                        dataSource={dashboardIncidentList}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }

    // matchHeading = () => {
    //     return (
    //         <div className="row text-view">
    //             <div className="col-sm" >
    //                 <span className='home-dash-left-text'>{AppConstants.todaysMatch}</span>
    //             </div>

    //             <div className="col-sm text-right" >
    //                 <NavLink to={{
    //                     pathname: '/liveScoreAddMatch',
    //                     state: { key: 'dashboard' }
    //                 }}>
    //                     <Button className='primary-add-comp-form' type='primary'>+ {AppConstants.addNew}</Button>
    //                 </NavLink>
    //             </div>
    //         </div>
    //     )
    // }


    matchHeading = () => {
        return (
            <div className="row text-view">

                <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }} >
                    <span className='home-dash-left-text'>{AppConstants.todaysMatch}</span>
                    <Tooltip background='#ff8237'>
                        <span>{AppConstants.todayMatchMsg}</span>
                    </Tooltip>
                </div>

                <div className="col-sm text-right" >
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
                                <NavLink to="/liveScoreBulkChange">
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.bulkMatchChange}
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
                                <NavLink to={{
                                    pathname: '/liveScoreVenueChange',
                                    state: { key: 'dashboard' }
                                }}>
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.courtChange}
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
                                <NavLink to={{
                                    pathname: '/liveScoreAddMatch',
                                    state: { key: 'dashboard' }
                                }}>
                                    <Button className='primary-add-comp-form' type='primary'>+ {AppConstants.addNew}</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    ////////ownedView view for competition
    matchView = () => {
        const { dashboardMatchList } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.matchHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreDashboardState.onLoad == true && true}
                        className="home-dashboard-table" columns={columnsTodaysMatch}
                        dataSource={dashboardMatchList}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }

    incidentHeading = () => {
        return (
            <div className="row text-view">
                <div className="col-sm mb-3" style={{ display: 'flex', alignItems: 'center' }} >
                    <span className='home-dash-left-text'>{AppConstants.todaysIncidents}</span>
                    <Tooltip background='#ff8237'>
                        <span>{AppConstants.todayIncidentMsg}</span>
                    </Tooltip>
                </div>

                <div className="col-sm text-right" >
                    {/* <NavLink to={{
                        pathname: './liveScoreAddIncident',
                        state: { key: 'dashboard' }
                    }}>
                        <Button className='primary-add-comp-form' type='primary'>
                            + {AppConstants.addNew}
                        </Button>
                    </NavLink> */}
                </div>
            </div>
        )
    }

    addNewsHeading = () => {
        return (
            <div className="row text-view">
                <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }} >
                    <span className='home-dash-left-text'>{AppConstants.activeNews}</span>
                    <Tooltip background='#ff8237'>
                        <span>{AppConstants.activeNewsMsg}</span>
                    </Tooltip>
                </div>
                <div className="col-sm text-right" >
                    <NavLink to={{
                        pathname: '/liveScoreAddNews',
                        state: { key: 'dashboard', item: null }
                    }} className="text-decoration-none">
                        <Button className="primary-add-comp-form" type="primary">
                            + {AppConstants.addNew}
                        </Button>
                    </NavLink>
                </div>
            </div>

        )
    }

    addNewsView = () => {
        const { dashboardNewsList } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.addNewsHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreDashboardState.onLoad == true && true} className="home-dashboard-table" columns={columnActiveNews} dataSource={dashboardNewsList} pagination={false}
                    />
                </div>
            </div>
        )
    }

    playersToPayHeading = () => {
        return (
            <div className="row text-view">
                <div className="col-sm mb-3" style={{ display: 'flex', alignItems: 'center' }} >
                    <span className='home-dash-left-text'>{AppConstants.playersToPay}</span>
                    <Tooltip background='#ff8237'>
                        <span>{AppConstants.playersToPayMsg}</span>
                    </Tooltip>
                </div>
            </div>
        )
    }

    ////////ownedView view for competition
    playersToPayView = () => {
        const { dashboardMatchList } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.playersToPayHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreDashboardState.onLoad == true && true}
                        className="home-dashboard-table" columns={columnsPlayersToPay}
                        dataSource={playerTopay}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }

    // buttons
    btnView = () => {
        return (

            // <div className="footer-view">


            <div className="col-sm pt-4">
                <div className="row " >
                    <div className=" live-score-edit-match-buttons">
                        <Button className='primary-add-comp-form' type='primary'>{AppConstants.publish}</Button>
                    </div>


                    <div className=" live-score-edit-match-buttons ml-3">
                        <Button className='primary-add-comp-form' type='primary'>{AppConstants.publish_notify}</Button>
                    </div>
                    <div className=" live-score-edit-match-buttons ml-3">
                        <Button className='primary-add-comp-form' type='primary'>{AppConstants.saveAsDraft}</Button>
                    </div>
                </div>

            </div>

            // </div>

        )
    }
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc", paddingBottom: 10 }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"1"} />
                <Layout>
                    <Content >
                        {this.addNewsView()}
                        {this.matchView()}
                        {this.playersToPayView()}
                        {this.incidenceView()}
                    </Content>
                </Layout>
            </div >
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreDashboardListAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreDashboardState: state.LiveScoreDashboardState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreDashboard));

