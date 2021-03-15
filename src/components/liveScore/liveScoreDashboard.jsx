import React, { Component } from "react";
import { Layout, Button, Table, message, Pagination, Menu } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    liveScoreDashboardListAction,
    liveScorePlayersToPayListAction,
    liveScorePlayersToPayRetryPaymentAction,
    liveScorePlayersToCashReceivedAction,
    setPageSizeAction,
    setPageNumberAction,
} from '../../store/actions/LiveScoreAction/liveScoreDashboardAction'
import history from "../../util/history";
import {
    // getCompetitonId,
    getLiveScoreCompetiton,
    getOrganisationData,
    // getLiveScoreUmpireCompition
} from '../../util/sessionStorage'
import { liveScore_formateDate } from '../../themes/dateformate'
import { liveScore_formateDateTime, liveScore_MatchFormate } from '../../themes/dateformate'
import { NavLink } from 'react-router-dom';
import moment from "moment";
import { isArrayNotEmpty, teamListDataCheck } from "../../util/helpers";
import Tooltip from 'react-png-tooltip'
import ValidationConstants from "../../themes/validationConstant";
import { initializeCompData } from '../../store/actions/LiveScoreAction/liveScoreInnerHorizontalAction'
import { checkLivScoreCompIsParent } from 'util/permissions';
import Loader from '../../customComponents/loader';
import {registrationFailedStatusUpdate } from "store/actions/registrationAction/registrationDashboardAction";

const { Content } = Layout;
let this_obj = null;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}

// function getFirstName(incidentPlayers) {
//     return incidentPlayers ? incidentPlayers[0].player.firstName : ""
// }

// function getLastName(incidentPlayers) {
//     return incidentPlayers ? incidentPlayers[0].player.lastName : ""
// }

function setMatchResult(record) {
    if (record.team1ResultId !== null) {
        if (record.team1ResultId === 4 || record.team1ResultId === 6 || record.team1ResultId === 6) {
            return "Forfeit"
        } else if (record.team1ResultId === 8 || record.team1ResultId === 9) {
            return "Abandoned"
        } else {
            return record.team1Score + " : " + record.team2Score
        }
    } else {
        return record.team1Score + " : " + record.team2Score
    }
}

function getVenueName(data) {
    let venue_name = ""
    if (data.venue.shortName) {
        venue_name = data.venue.shortName + " - " + data.name
    } else {
        venue_name = data.venue.name + " - " + data.name
    }

    return venue_name
}

function getTeamName(data) {
    if (data.player) {
        if (data.player.team) {
            return data.player.team.name
        } else {
            return ''
        }
    } else {
        return ''
    }
}

function getAssociationName(data) {
    if (data.player) {
        if (data.player.team) {
            if (data.player.team.competitionOrganisation) {
                return data.player.team.competitionOrganisation.name
            } else {
                return ''
            }
        } else {
            return ''
        }
    } else {
        return ''
    }
}

const columnActiveNews = [
    {
        title: AppConstants.title,
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => tableSort(a, b, "title")
    },
    {
        title: AppConstants.author,
        dataIndex: 'author',
        key: 'author',
        sorter: (a, b) => tableSort(a, b, "author")
    },
    {
        title: AppConstants.expiry,
        dataIndex: 'news_expire_date',
        key: 'news_expire_date',
        sorter: (a, b) => tableSort(a, b, "news_expire_date"),
        render: (news_expire_date) =>
            <span>{news_expire_date && liveScore_formateDate(news_expire_date)}</span>
    },
    {
        title: AppConstants.recipients,
        dataIndex: 'recipients',
        key: 'recipients',
        sorter: (a, b) => tableSort(a, b, 'recipients'),
    },
    {
        title: AppConstants.published,
        dataIndex: 'isActive',
        key: 'isActive',
        sorter: (a, b) => tableSort(a, b, 'isActive'),
        render: isActive => <span>{isActive == 1 ? "Yes" : "NO"}</span>
    },
    {
        title: AppConstants.publishedDate,
        dataIndex: 'published_at',
        key: 'published_at',
        sorter: (a, b) => tableSort(a, b, 'published_at'),
        render: (published_at) => <span>{published_at && liveScore_formateDate(published_at)}</span>
    },
    {
        title: AppConstants.notification,
        dataIndex: 'isNotification',
        key: 'isNotification',
        sorter: (a, b) => tableSort(a, b, 'isNotification'),
        render: (isNotification) => <span>{isNotification == 0 ? 'No' : 'Yes'}</span>
    }
];

const columnsTodaysMatch = [
    {
        title: AppConstants.tableMatchID,
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, 'id'),
        render: (id) => <NavLink to={{
            pathname: '/matchDayMatchDetails',
            state: { matchId: id, key: 'dashboard' }
        }}>
            <span className="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: AppConstants.startTime,
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, 'startTime'),
        render: (startTime) => <span>{liveScore_formateDateTime(startTime)}</span>
    },
    {
        title: AppConstants.home,
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, 'team1'),
        render: (team1, record) => teamListDataCheck(team1.id, this_obj.state.liveScoreCompIsParent, record, this_obj.state.compOrgId) ? (
            <NavLink to={{
                pathname: '/matchDayTeamView',
                state: { tableRecord: team1, key: 'dashboard' }
            }}>
                <span className="input-heading-add-another pt-0" >{team1.name}</span>
            </NavLink>
        )
            : (
                <span  >{team1.name}</span>
            )
    },
    {
        title: AppConstants.away,
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, 'team2'),
        render: (team2, record) => teamListDataCheck(team2.id, this_obj.state.liveScoreCompIsParent, record, this_obj.state.compOrgId) ?
            (<NavLink to={{
                pathname: '/matchDayTeamView',
                state: { tableRecord: team2, key: 'dashboard' }
            }}>
                <span className="input-heading-add-another pt-0" >{team2.name}</span>
            </NavLink>)
            : (
                <span  >{team2.name}</span>
            )
    },
    {
        title: AppConstants.venue,
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: (a, b, venueCourt) => checkSorting(a, b, venueCourt.name),
        render: (venueCourt) => <span>{getVenueName(venueCourt)}</span>
    },
    {
        title: AppConstants.div,
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b, division) => checkSorting(a, b, division.name),
        render: (division) => <span>{division.name}</span>
    },
    {
        title: AppConstants.score,
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b, score) => checkSorting(a, b, score),
        render: (score, records) =>
            <NavLink to={{
                pathname: '/matchDayMatchDetails',
                state: { matchId: records.id, key: 'dashboard' }
            }}><span className="input-heading-add-another pt-0" >{setMatchResult(records)} </span></NavLink>
    }, {
        title: AppConstants.umpire,
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: (a, b, umpires) => checkSorting(a, b, umpires),
        render: (umpires) =>
            isArrayNotEmpty(umpires) && umpires.map((item) => (
                <span style={{ color: '#ff8237', cursor: 'pointer' }} onClick={() => this_obj.umpireName(item)}
                    // className="desc-text-style side-bar-profile-data"
                    className='multi-column-text-aligned'
                >{item.umpireName}</span>
            ))
    }, {
        title: AppConstants.scorer1,
        dataIndex: 'scorer1Status',
        key: 'scorer1Status',
        sorter: (a, b, scorer1Status) => checkSorting(a, b, scorer1Status),
        render: (scorer1Status) =>
            <span>{scorer1Status ? scorer1Status.status === "YES" ? "Accepted" : "Not Accepted" : "Not Set"}</span>

    }, {
        title: AppConstants.scorer2,
        dataIndex: 'scorer2Status',
        key: 'scorer2Status',
        sorter: (a, b, scorer2Status) => checkSorting(a, b, scorer2Status),
        render: (scorer2Status, record) =>
            <span>{record.competition.scoringType == 'SINGLE' ? "" : scorer2Status ? scorer2Status.status === "YES" ? "Accepted" : "Not Accepted" : "Not Set"}</span>
    },
    {
        title: AppConstants.playerAttTeamA,
        dataIndex: 'teamAttendanceCountA',
        key: 'teamAttendanceCountA',
        sorter: (a, b) => tableSort(a, b, "teamAttendanceCountA"),
        render: (teamAttendanceCountA) =>
            <span>{teamAttendanceCountA > 0 ? "Complete" : "Not Complete"}</span>
    },
    {
        title: AppConstants.playerAttTeamB,
        dataIndex: 'teamAttendanceCountB',
        key: 'teamAttendanceCountB',
        sorter: (a, b) => tableSort(a, b, "teamAttendanceCountB"),
        render: (teamAttendanceCountB) =>
            <span>{teamAttendanceCountB > 0 ? "Complete" : "Not Complete"}</span>
    },
    {
        title: AppConstants.status,
        dataIndex: 'matchStatus',
        key: 'matchStatus',
        sorter: (a, b) => tableSort(a, b, "matchStatus"),
        render: (matchStatus, record) =>
            <span>{(matchStatus == "0" || matchStatus == null) ? "Not Started" : matchStatus}</span>
    },
];

const columnsTodaysMatch_1 = [
    {
        title: <span className="column-width-style" >{"Match ID"} </span>,
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, 'id'),
        render: (id) => <NavLink to={{
            pathname: '/matchDayMatchDetails',
            state: { matchId: id, key: 'dashboard' }
        }}>
            <span className="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: AppConstants.startTime,
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, 'startTime'),
        render: (startTime) =>
            <span className="column-width-style">{liveScore_formateDateTime(startTime)}</span>
    },
    {
        title: AppConstants.home,
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, 'team1'),
        render: (team1, record) => teamListDataCheck(team1.id, this_obj.state.liveScoreCompIsParent, record, this_obj.state.compOrgId) ? (
            <NavLink to={{
                pathname: '/matchDayTeamView',
                state: { tableRecord: team1, key: 'dashboard' }
            }}>
                <span className="input-heading-add-another pt-0" >{team1.name}</span>
            </NavLink>
        )
            : (
                <span  >{team1.name}</span>
            )
    },
    {
        title: AppConstants.away,
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, 'team2'),
        render: (team2, record) => teamListDataCheck(team2.id, this_obj.state.liveScoreCompIsParent, record, this_obj.state.compOrgId) ?
            (<NavLink to={{
                pathname: '/matchDayTeamView',
                state: { tableRecord: team2, key: 'dashboard' }
            }}>
                <span className="input-heading-add-another pt-0" >{team2.name}</span>
            </NavLink>
            )
            : (
                <span  >{team2.name}</span>
            )
    },
    {
        title: AppConstants.venue,
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: (a, b, venueCourt) => checkSorting(a, b, venueCourt.name),
        render: (venueCourt) => <span className="column-width-style">{getVenueName(venueCourt)}</span>

    },
    {
        title: AppConstants.div,
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b, division) => checkSorting(a, b, division.name),
        render: (division) => <span>{division.name}</span>
    },
    {
        title: AppConstants.score,
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b, score) => checkSorting(a, b, score),
        render: (score, records) =>
            <NavLink to={{
                pathname: '/matchDayMatchDetails',
                state: { matchId: records.id, key: 'dashboard' }
            }}>
                <span className="input-heading-add-another pt-0">{setMatchResult(records)}</span>
            </NavLink>
    }, {
        title: AppConstants.umpire,
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: (a, b, umpires) => checkSorting(a, b, umpires),
        render: (umpires, record) =>
            isArrayNotEmpty(umpires) && umpires.map((item, index) => (
                <span
                    key={record.id + index}
                    style={{ color: '#ff8237', cursor: 'pointer' }}
                    onClick={() => this_obj.umpireName(item)}
                    // className="desc-text-style side-bar-profile-data"
                    className="multi-column-text-aligned"
                >
                    {item.umpireName}
                </span>
            ))
    }, {
        title: <span className="column-width-style">Scorer 1</span>,
        dataIndex: 'scorer1Status',
        key: 'scorer1Status',
        sorter: (a, b) => tableSort(a, b, "scorer1Status"),
        render: (scorer1Status) =>
            <span>{scorer1Status ? scorer1Status.status === "YES" ? "Accepted" : "Not Accepted" : "Not Set"}</span>
    },
    {
        title: <span className="column-width-style">Player Att. Team A</span>,
        dataIndex: 'teamAttendanceCountA',
        key: 'teamAttendanceCountA',
        sorter: (a, b) => tableSort(a, b, "teamAttendanceCountA"),
        render: (teamAttendanceCountA) => <span>{teamAttendanceCountA > 0 ? "Complete" : "Not Complete"}</span>
    },
    {
        title: <span className="column-width-style">Player Att. Team B</span>,
        dataIndex: 'teamAttendanceCountB',
        key: 'teamAttendanceCountB',
        sorter: (a, b) => tableSort(a, b, "teamAttendanceCountB"),
        render: (teamAttendanceCountB) => <span>{teamAttendanceCountB > 0 ? "Complete" : "Not Complete"}</span>
    },
    {
        title: AppConstants.status,
        dataIndex: 'matchStatus',
        key: 'matchStatus',
        sorter: (a, b) => tableSort(a, b, "matchStatus"),
        render: (matchStatus, record) =>
            <span>{(matchStatus == "0" || matchStatus == null) ? "Not Started" : matchStatus}</span>
    },
];

const columnsTodaysIncient = [
    {
        title: AppConstants.date,
        dataIndex: 'incidentTime',
        key: 'incidentTime',
        sorter: (a, b) => tableSort(a, b, 'incidentTime'),
        render: (incidentTime, record) =>
            <NavLink to={{
                pathname: "/matchDayIncidentView",
                state: { item: record, screenName: 'dashboard' }
            }}>
                <span className="input-heading-add-another pt-0">{liveScore_MatchFormate(incidentTime)}</span>
            </NavLink>
    },
    {
        title: AppConstants.tableMatchID,
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => tableSort(a, b, 'matchId'),
    },
    {
        title: AppConstants.firstName,
        dataIndex: 'incidentPlayers',
        key: 'First Name',
        sorter: (a, b) => tableSort(a, b, "incidentPlayers"),
        render: (incidentPlayers, record) =>
            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item) => (
                <span style={{ color: '#ff8237', cursor: 'pointer' }} onClick={() => this_obj.checkUserId(item)} className="desc-text-style side-bar-profile-data" >{item.player.firstName}</span>
            ))
    },
    {
        title: AppConstants.lastName,
        dataIndex: 'incidentPlayers',
        key: 'Last Name',
        sorter: (a, b) => tableSort(a, b, "incidentPlayers"),
        render: (incidentPlayers, record) =>
            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item) => (
                <span style={{ color: '#ff8237', cursor: 'pointer' }} onClick={() => this_obj.checkUserId(item)} className="desc-text-style side-bar-profile-data" >{item.player.lastName}</span>
            ))
    },
    {
        title: AppConstants.organisation,
        dataIndex: 'incidentPlayers',
        key: 'Organisation',
        sorter: (a, b) => tableSort(a, b, "incidentPlayers"),
        render: (incidentPlayers, record) =>
            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item) => (
                // <NavLink to={{
                //     pathname: '/matchDayPlayerView',
                //     state: { tableRecord: incidentPlayers ? incidentPlayers[0].player : null, screenName: 'dashboard' }
                // }}>
                <span className="desc-text-style side-bar-profile-data" >{getAssociationName(item)}</span>
                // </NavLink>
            )),
    },
    // {
    //     title: "Club",
    //     dataIndex: 'club',
    //     key: 'club',
    //     sorter: (a, b) => checkSorting(a, b, "club"),
    // },
    {
        title: AppConstants.team,
        dataIndex: 'incidentPlayers',
        key: 'team',
        sorter: (a, b) => tableSort(a, b, "incidentPlayers"),
        render: (incidentPlayers, record) => {
            return (
                <>
                    {
                        isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item) => (
                            item.player ? item.player.team ? item.player.team.deleted_at ?
                                < span className="desc-text-style side-bar-profile-data" > {getTeamName(item)}</span>
                                :
                                teamListDataCheck(item.player.team.id, this_obj.state.liveScoreCompIsParent, item.player.team, this_obj.state.compOrgId) ?
                                    <NavLink to={{
                                        pathname: '/matchDayTeamView',
                                        state: { tableRecord: record, screenName: 'liveScoreDashboard' }
                                    }}>
                                        <span style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{getTeamName(item)}</span>
                                    </NavLink>
                                    :
                                    < span className="desc-text-style side-bar-profile-data" > {getTeamName(item)}</span>
                                :
                                null
                                :
                                null
                        ))
                    }
                </>
            )
        }
    },
    {
        title: AppConstants.description,
        dataIndex: 'description',
        key: 'description',
        sorter: (a, b, description) => tableSort(a, b, "description"),
    },
];

const columnsPlayersToPay = [
    {
        title: AppConstants.firstName,
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
    },
    {
        title: AppConstants.lastName,
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => checkSorting(a, b, "lastName"),
    },
    {
        title: AppConstants.linked,
        dataIndex: 'linked',
        key: 'linked',
        sorter: (a, b) => checkSorting(a, b, "linked"),
    },
    {
        title: AppConstants.division,
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => checkSorting(a, b, "division"),
    },
    {
        title: AppConstants.grade,
        dataIndex: 'gradeName',
        key: 'gradeName',
        sorter: (a, b) => checkSorting(a, b, "grade"),
    },
    {
        title: AppConstants.team,
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => checkSorting(a, b, "team"),
    },
    {
        title: AppConstants.status,
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b, payReq) => checkSorting(a, b, payReq),
    },
    {
        title: AppConstants.paymentMethod,
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        sorter: (a, b, payMethod) => checkSorting(a, b, payMethod),
    },
    {
        title: AppConstants.action,
        dataIndex: 'action',
        key: 'action',
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}
            >
                <Menu.SubMenu key="sub1" style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                    title={<img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />}
                >
                    <Menu.Item key="1" onClick={() => this_obj.cashReceived(record)}>
                        <span>{AppConstants.cashReceived}</span>
                    </Menu.Item>
                    {(record.processType == "Instalment" || record.processType == "Per Match") &&
                        <Menu.Item key="2" onClick={() => this_obj.retryPayment(record)}>
                            <span>{AppConstants.retryPayment}</span>
                        </Menu.Item>
                    }
                     {(record.processTypeName == "school_invoice") &&
                        <Menu.Item key="3" onClick={() => this_obj.invoiceFailed(record)}>
                            <span>{AppConstants.failed}</span>
                        </Menu.Item>
                    }
                </Menu.SubMenu>

            </Menu>
        )
    }
];

// const playerTopay = [
//     {
//         firstName: "Sam",
//         lastName: "Ham",
//         linked: "Cromer Netball Club",
//         division: "11B",
//         team: "WSA 1",
//         grade: "A",
//         payReq: "Voucher redemption"
//     }
// ]

class LiveScoreDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incidents: "incidents",
            liveScoreCompIsParent: false,
            compOrgId: 0,
            onload: false,
            page: 1,
            retryPaymentLoad: false,
            invoiceFailedLoad: false
        }
        this_obj = this
        this.props.initializeCompData()
    }

    componentDidMount() {
        // let competitionID = getCompetitonId()
        let startDay = this.getStartofDay()
        let currentTime = moment.utc().format()

        if (getLiveScoreCompetiton()) {
            const { id, competitionOrganisation } = JSON.parse(getLiveScoreCompetiton())
            let compOrgId = competitionOrganisation ? competitionOrganisation.id : 0
            checkLivScoreCompIsParent().then((value) => {
                this.getPlayersToPayList(1);
                this.props.liveScoreDashboardListAction(id, startDay, currentTime, compOrgId, value)
                this.setState({
                    liveScoreCompIsParent: value,
                    compOrgId: compOrgId
                })
            })


        } else {
            history.push('/matchDayCompetitions')
        }
    }

    componentDidUpdate() {
        if(this.state.onload == true && this.props.liveScoreDashboardState.onPlayersToPayLoad == false){
            this.getPlayersToPayList(this.state.page)
            this.setState({ onload : false})
        }
        if(this.state.retryPaymentLoad == true && this.props.liveScoreDashboardState.onRetryPaymentLoad == false){
            if(this.props.liveScoreDashboardState.retryPaymentSuccess){
                message.success(this.props.liveScoreDashboardState.retryPaymentMessage);
            }
            this.getPlayersToPayList(this.state.page);
            this.setState({ retryPaymentLoad: false })
        }
        if(this.state.invoiceFailedLoad == true && this.props.registrationDashboardState.onRegStatusUpdateLoad == false){
            this.getPlayersToPayList(this.state.page);
            this.setState({ invoiceFailedLoad: false })
        }
    }

    getPlayersToPayList = (page) => {
        const { organisationUniqueKey } = getOrganisationData();
        const { uniqueKey } = JSON.parse(getLiveScoreCompetiton());
        let { liveScorePlayerstoPayListPageSize } = this.props.liveScoreDashboardState;
        liveScorePlayerstoPayListPageSize = liveScorePlayerstoPayListPageSize ? liveScorePlayerstoPayListPageSize : 10;
        let payload = {
            competitionId: uniqueKey,
            organisationId: organisationUniqueKey,
            paging: {
                limit: liveScorePlayerstoPayListPageSize,
                offset: (page ? (liveScorePlayerstoPayListPageSize * (page - 1)) : 0),
            },
        }
        this.props.liveScorePlayersToPayListAction(payload);
    }

    handleShowSizeChange = (key) => async (page, pageSize) => {
        if(key == "playerToPay"){
            await this.props.setPageSizeAction(pageSize);
            this.handleTablePage(page, key);
        }
    }

    handleTablePage = async (page, key) => {
        if(key == "playerToPay") {
            await this.props.setPageNumberAction(page);
            this.setState({onload: true, page: page})
        }
    }

    checkUserId(record) {
        if (record.player.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        }
        else {
            history.push("/userPersonal", { userId: record.player.userId, screenKey: "livescore", screen: "/matchDayDashboard" })
        }
    }

    umpireName(item) {
        if (item.userId) {
            history.push("/userPersonal", { userId: item.userId, screenKey: "livescore", screen: "/matchDayDashboard" })
        } else {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        }
    }

    getStartofDay() {
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        let a = moment.utc(start).format()
        return a
    }

    retryPayment = (record) => {
        const { uniqueKey } = JSON.parse(getLiveScoreCompetiton())
        let payload = {
            processTypeName: record.processTypeName,
            registrationUniqueKey: record.registrationUniqueKey,
            userId: record.userId,
            divisionId: record.divisionId,
            competitionId: uniqueKey
        }


        this.setState({ retryPaymentLoad: true })
        this.props.liveScorePlayersToPayRetryPaymentAction(payload);
    }

    cashReceived = (record) => {
        const { uniqueKey } = JSON.parse(getLiveScoreCompetiton())
        let payload = {
            processTypeName: record.processTypeName,
            registrationUniqueKey: record.registrationUniqueKey,
            userId: record.userId,
            divisionId: record.divisionId,
            competitionId: uniqueKey
        }

        this.setState({ retryPaymentLoad: true })
        this.props.liveScorePlayersToCashReceivedAction(payload);
    }

    invoiceFailed = (record) =>{
        let payload = {
            registrationUniqueKey: record.registrationUniqueKey
        }
        this.setState({ invoiceFailedLoad: true })
        this.props.registrationFailedStatusUpdate(payload);
    }

    ////////participatedView view for competition
    incidenceView = () => {
        const { dashboardIncidentList } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.incidentHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreDashboardState.onLoad}
                        className="home-dashboard-table" columns={columnsTodaysIncient}
                        dataSource={dashboardIncidentList}
                        pagination={false}
                        rowKey={(record) => "dashboardIncidentList" + record.id}
                    />
                </div>
            </div>
        )
    }

    // matchHeading = () => {
    //     return (
    //         <div className="row text-view">
    //             <div className="col-sm">
    //                 <span className="home-dash-left-text">{AppConstants.todaysMatch}</span>
    //             </div>
    //             <div className="col-sm text-right">
    //                 <NavLink to={{
    //                     pathname: '/matchDayAddMatch',
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
                <div className="col-sm d-flex align-items-center">
                    <span className="home-dash-left-text">{AppConstants.todaysMatch}</span>
                    <div className="mt-n10">
                        <Tooltip>
                            <span>{AppConstants.todayMatchMsg}</span>
                        </Tooltip>
                    </div>
                </div>

                {this.state.liveScoreCompIsParent && <div className="col-sm text-right">
                    <div className="row">
                        <div className="col-sm">
                            <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                <NavLink to="/matchDayBulkChange">
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.bulkMatchChange}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                <NavLink to={{
                                    pathname: '/matchDayVenueChange',
                                    state: { key: 'dashboard' }
                                }}>
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.courtChange}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                <NavLink to={{
                                    pathname: '/matchDayAddMatch',
                                    state: { key: 'dashboard' }
                                }}>
                                    <Button className="primary-add-comp-form" type="primary">+ {AppConstants.addNew}</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }

    ////////ownedView view for competition
    matchView = () => {
        const { dashboardMatchList } = this.props.liveScoreDashboardState
        let compDetails = getLiveScoreCompetiton() ? JSON.parse(getLiveScoreCompetiton()) : null
        let scoringType = compDetails ? compDetails.scoringType : ""

        return (
            <div className="comp-dash-table-view mt-4">
                {this.matchHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreDashboardState.onLoad}
                        className="home-dashboard-table"
                        columns={scoringType === "SINGLE" ? columnsTodaysMatch_1 : columnsTodaysMatch}
                        dataSource={dashboardMatchList}
                        pagination={false}
                        rowKey={(record) => "dashboardMatchList" + record.id}
                    />
                </div>
            </div>
        )
    }

    incidentHeading = () => {
        return (
            <div className="row text-view">
                <div className="col-sm mb-3 d-flex align-items-center">
                    <span className="home-dash-left-text">{AppConstants.todaysIncidents}</span>
                    <div className="mt-n10">
                        <Tooltip>
                            <span>{AppConstants.todayIncidentMsg}</span>
                        </Tooltip>
                    </div>
                </div>

                {/* <div className="col-sm text-right">
                    <NavLink to={{
                        pathname: './matchDayAddIncident',
                        state: { key: 'dashboard' }
                    }}>
                        <Button className='primary-add-comp-form' type='primary'>
                            + {AppConstants.addNew}
                        </Button>
                    </NavLink>
                </div> */}
            </div>
        )
    }

    addNewsHeading = () => {
        return (
            <div className="row text-view">
                <div className="col-sm d-flex align-items-center">
                    <span className="home-dash-left-text">{AppConstants.activeNews}</span>
                    <div className="mt-n10">
                        <Tooltip>
                            <span>{AppConstants.activeNewsMsg}</span>
                        </Tooltip>
                    </div>
                </div>
                {this.state.liveScoreCompIsParent &&
                    <div className="col-sm text-right">
                        <NavLink
                            to={{
                                pathname: '/matchDayAddNews',
                                state: { key: 'dashboard', item: null }
                            }}
                            className="text-decoration-none"
                        >
                            <Button className="primary-add-comp-form" type="primary">
                                + {AppConstants.addNew}
                            </Button>
                        </NavLink>
                    </div>
                }
            </div>

        )
    }

    addNewsView = () => {
        const { dashboardNewsList } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.addNewsHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreDashboardState.onLoad}
                        className="home-dashboard-table"
                        columns={columnActiveNews}
                        dataSource={dashboardNewsList}
                        pagination={false}
                        rowKey={(record) => "dashboardNewsList" + record.id}
                    />
                </div>
            </div>
        )
    }

    playersToPayHeading = () => {
        return (
            <div className="row text-view">
               <div className="col-sm d-flex align-items-center">
                    <span className="home-dash-left-text">{AppConstants.playersToPay}</span>
                    <div className="mt-n10">
                        <Tooltip>
                            <span>{AppConstants.playersToPayMsg}</span>
                        </Tooltip>
                    </div>
                </div>
                {/* {this.state.liveScoreCompIsParent &&
                    <div className="col-sm text-right">
                        <NavLink
                            to={{
                                pathname: '/matchDaySingleGameFee',
                                state: { key: 'dashboard', item: null }
                            }}
                            className="text-decoration-none"
                        >
                            <Button className="primary-add-comp-form" type="primary">
                                {AppConstants.singleGameFees}
                            </Button>
                        </NavLink>
                    </div>
                } */}
            </div>
        )
    }

    ////////ownedView view for competition
    playersToPayView = () => {
        const { playersToPayList, onLoad, liveScorePlayerstoPayListTotalCount, liveScorePlayerstoPayListPage, liveScorePlayerstoPayListPageSize } = this.props.liveScoreDashboardState
        return (
            <div className="comp-dash-table-view mt-4">
                {this.playersToPayHeading()}
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad}
                        className="home-dashboard-table"
                        columns={columnsPlayersToPay}
                        dataSource={playersToPayList}
                        pagination={false}
                        rowKey={(record) => "playerTopay" + record.id}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-5"
                        showSizeChanger
                        current={liveScorePlayerstoPayListPage}
                        defaultCurrent={liveScorePlayerstoPayListPage}
                        defaultPageSize={liveScorePlayerstoPayListPageSize}
                        total={liveScorePlayerstoPayListTotalCount}
                        onChange={(page) => this.handleTablePage(page, "playerToPay")}
                        onShowSizeChange={this.handleShowSizeChange("playerToPay")}
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
                <div className="row">
                    <div className=" live-score-edit-match-buttons">
                        <Button className="primary-add-comp-form" type="primary">{AppConstants.publish}</Button>
                    </div>
                    <div className=" live-score-edit-match-buttons ml-3">
                        <Button className="primary-add-comp-form" type="primary">{AppConstants.publish_notify}</Button>
                    </div>
                    <div className=" live-score-edit-match-buttons ml-3">
                        <Button className="primary-add-comp-form" type="primary">{AppConstants.saveAsDraft}</Button>
                    </div>
                </div>
            </div>
            // </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg" style={{ paddingBottom: 10 }}>
                <Loader visible={this.props.liveScoreDashboardState.onPlayersToPayLoad || this.props.liveScoreDashboardState.onRetryPaymentLoad} />
                <DashboardLayout menuHeading={AppConstants.matchDay} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="1" />
                <Layout>
                    <Content>
                        {this.addNewsView()}
                        {this.matchView()}
                        {this.playersToPayView()}
                        {this.incidenceView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreDashboardListAction,
        initializeCompData,
        liveScorePlayersToPayListAction,
        liveScorePlayersToPayRetryPaymentAction,
        liveScorePlayersToCashReceivedAction,
        setPageSizeAction,
        setPageNumberAction,
        registrationFailedStatusUpdate
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreDashboardState: state.LiveScoreDashboardState,
        registrationDashboardState: state.RegistrationDashboardState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreDashboard);
