import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Layout, Button, Table, Modal, InputNumber, Checkbox, Tooltip, Select, Spin, AutoComplete, Switch,
} from 'antd';

import {
    liveScoreDeleteMatch,
    liveScoreGetMatchDetailInitiate,
    changePlayerLineUpAction,
    liveScoreAddLiveStreamAction,
} from "../../store/actions/LiveScoreAction/liveScoreMatchAction";
import {
    liveScorePlayerListSearchAction
} from "../../store/actions/LiveScoreAction/liveScorePlayerAction"
import {
    liveScoreExportGameAttendanceAction, liveScoreGameAttendanceListAction
} from "../../store/actions/LiveScoreAction/liveScoreGameAttendanceAction"
import {
    liveScorePlayerMinuteTrackingListAction, liveScorePlayerMinuteRecordAction, liveScoreUpdatePlayerMinuteRecordAction
} from "../../store/actions/LiveScoreAction/liveScorePlayerMinuteTrackingAction";
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreCompetiton, getUmpireCompetitonData } from '../../util/sessionStorage';
import {
    getLiveScoreGamePositionsList,
} from "../../store/actions/LiveScoreAction/liveScoreGamePositionAction";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader'
import history from "../../util/history";
import ValidationConstants from '../../themes/validationConstant';
import InputWithHead from "../../customComponents/InputWithHead";
import { showRoleLevelPermission, getUserRoleId } from 'util/permissions';

import './liveScore.css';

const { Content } = Layout;
const { confirm } = Modal;
const { Option } = Select;

// function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key]);
    let stringB = JSON.stringify(b[key]);

    return stringA.localeCompare(stringB);
}

let this_ = null;

const columns = [
    {
        title: 'Profile Picture',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        sorter: (a, b) => tableSort(a, b, "photoUrl"),
        render: (photoUrl) =>
            photoUrl ?
                <img className="user-image" src={photoUrl} alt="" height="70" width="70" />
                :
                <span>{'No Image'}</span>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => tableSort(a, b, "team"),
    },
    {
        title: 'Played?',
        dataIndex: 'attendance',
        key: 'attendance',
        sorter: (a, b) => tableSort(a, b, "attendance"),
        render: (attendance, record) => (
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img
                    className="dot-image"
                    // src={attendance && attendance.isPlaying === true ? AppImages.greenDot : AppImages.greyDot}
                    src={record.played === "1" ? AppImages.greenDot : AppImages.greyDot}
                    alt=""
                    width="12"
                    height="12"
                />
            </span>
        ),
    },
];

const columnsTeam1 = [
    {
        title: 'Profile Picture',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        sorter: (a, b) => tableSort(a, b, "photoUrl"),
        render: (photoUrl) =>
            photoUrl ?
                <img className="user-image" src={photoUrl} alt="" height="70" width="70" />
                :
                <span>{'No Image'}</span>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => tableSort(a, b, "team"),
    },
    {
        title: 'Playing?',
        dataIndex: 'attended',
        key: 'attended',
        sorter: (a, b) => tableSort(a, b, "attended"),
        render: (team, record, index) => {
            return (
                <Checkbox
                    // className={record.lineup && record.lineup.playing ? 'checkbox-green-color-outline mt-1' : 'single-checkbox mt-1'}
                    className={record.lineup && record.lineup[0].playing ? 'checkbox-green-color-outline mt-1' : 'single-checkbox mt-1'}
                    // checked={record.attendance && record.attendance.isPlaying}
                    checked={record.played == "1" ? true : false}
                    onChange={(e) => this_.playingView(record, e.target.checked, index, 'team1Players')}
                />
            )
        }
    },
];

const columnsTeam2 = [
    {
        title: 'Profile Picture',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        sorter: (a, b) => tableSort(a, b, "photoUrl"),
        render: (photoUrl) =>
            photoUrl ?
                <img className="user-image" src={photoUrl} alt="" height="70" width="70" />
                :
                <span>{'No Image'}</span>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => tableSort(a, b, "team"),
    },
    {
        title: 'Playing?',
        dataIndex: 'attended',
        key: 'attended',
        sorter: (a, b) => tableSort(a, b, "attended"),
        render: (attended, record, index) => (
            // <Checkbox
            //     className={record.lineup && record.lineup.playing ? "checkbox-green-color-outline mt-1" : 'single-checkbox mt-1'}
            //     checked={record.attendance && record.attendance.isPlaying}
            //     onChange={(e) => this_.playingView(record, e.target.checked, index, 'team2Players')}
            // />

            <Checkbox
                className={record.lineup && record.lineup[0].playing ? 'checkbox-green-color-outline mt-1' : 'single-checkbox mt-1'}
                checked={record.played == "1" ? true : false}
                onChange={(e) => this_.playingView(record, e.target.checked, index, 'team2Players')}
            />
        ),
    },
];

class LiveScoreMatchDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team1: "WSA 1",
            team2: "WSA 2",
            matchId: this.props.location.state ? this.props.location.state.matchId : null,
            key: this.props.location.state ? this.props.location.state.key ? this.props.location.state.key : null : null,
            umpireKey: this.props.location ? this.props.location.state ? this.props.location.state.umpireKey : null : null,
            scoringType: null,
            isLineUp: 0,
            toolTipVisible: false,
            screenName: props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null,
            competitionId: null,
            visible: false,
            liveStreamLink: null,
            addPlayerModal: '',
            teamAttendance: false,
            loadAttendanceData: true,
            gameAttendanceList: [],
            team1Attendance: [],
            team2Attendance: [],
            borrowedTeam1Players: [],
            borrowedTeam2Players: [],
            loadTrackingData: true,
            minutesTrackingData: [],
            periodDuration: null,
            positionDuration: null,
            playedCheckBox: false,
            userRoleId: getUserRoleId()
        };
        this.umpireScore_View = this.umpireScore_View.bind(this);
        this.team_View = this.team_View.bind(this);
        this_ = this;
    }

    componentDidMount() {
        let isLineUpEnable = null;
        this.props.getLiveScoreGamePositionsList();
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match[0] : [];
        let periodDuration = null
        if (isArrayNotEmpty(match)) {
            if (match.type === 'FOUR_QUARTERS') {
                periodDuration = (match.matchDuration * 60) / 4
                this.setState({ periodDuration })
            } else {
                periodDuration = (match.matchDuration * 60) / 2
                this.setState({ periodDuration })
            }
        }

        if (this.state.matchId) {
            this.props.liveScoreGameAttendanceListAction(this.state.matchId);
            this.props.liveScorePlayerMinuteTrackingListAction(this.state.matchId);
        }

        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                isLineUpEnable = getUmpireCompetitonData().lineupSelectionEnabled;
                this.setState({ competitionId: getUmpireCompetitonData().id })
            } else {
                history.push('/liveScoreCompetitions')
            }
        } else {
            if (getLiveScoreCompetiton()) {
                const { lineupSelectionEnabled, status, id } = JSON.parse(getLiveScoreCompetiton());
                isLineUpEnable = lineupSelectionEnabled;
                this.setState({ competitionId: id })
            } else {
                history.push('/liveScoreCompetitions')
            }
        }

        if (this.props.location.state) {
            if (isLineUpEnable === 1 || isLineUpEnable === true) {
                this.setState({ isLineUp: 1 });
                this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId, 1)
            } else {
                this.setState({ isLineUp: 0 });
                this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId, 0)
            }
        }
    }

    componentDidUpdate(nextProps) {
        if (this.props.liveScoreMatchState !== nextProps.liveScoreMatchState) {
            const { team1Players, team2Players } = this.props.liveScoreMatchState;
            const team1Attendance = this.getAttendance(team1Players);
            const team2Attendance = this.getAttendance(team2Players);

            if (this.state.team1Attendance.length === 0 && this.state.team2Attendance.length === 0) {
                this.setState({ team1Attendance });
                this.setState({ team2Attendance });
            }
        }

        if (this.props.liveScoreGameAttendanceState !== nextProps.liveScoreGameAttendanceState) {
            const gameAttendanceList = this.props.liveScoreGameAttendanceState.gameAttendanceList;
            if (gameAttendanceList && this.state.loadAttendanceData) {
                this.setState({ gameAttendanceList });
                this.setState({ loadAttendanceData: false });
            }
        }

        if (this.props.liveScorePlayerMinuteTrackingState.trackingList
            !== nextProps.liveScorePlayerMinuteTrackingState.trackingList) {
            const trackingList = this.props.liveScorePlayerMinuteTrackingState.trackingList || [];
            if (trackingList.length > 0 && this.state.loadTrackingData) {
                this.setState({ minutesTrackingData: trackingList });
                this.setState({ loadTrackingData: false });
            }
        }

        if (this.props.liveScorePlayerMinuteTrackingState.recordLoad !== nextProps.liveScorePlayerMinuteTrackingState.recordLoad) {
            if (!this.props.liveScorePlayerMinuteTrackingState.recordLoad) {
                this.setState({ loadTrackingData: true });
                this.props.liveScorePlayerMinuteTrackingListAction(this.state.matchId);
            }
        }
    }

    getPlayerAttendance = (player, borrowed = false) => {
        let attendance = [];

        if (player) {
            attendance = Array(4).fill(null).map((_, index) => ({
                teamId: player ?.teamId,
                matchId: this.state.matchId,
                playerId: player ?.playerId,
                positionId: player ?.lineup ?.positionId,
                isBorrowed: borrowed,
                isPlaying: true,
                verifiedBy: null,
                mnbPushed: false,
                period: index + 1,
            }));
        }

        return attendance;
    };

    setAttendance = (team, playerId, period, field, value, row, positionDuration, periodDuration) => {
        this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: value, playerdata: row, playerId: playerId, period: period, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId })

        const teamAttendance = team === 'team1' ? this.state.team1Attendance : this.state.team2Attendance;
        const attendanceIndex = teamAttendance.findIndex((att) => att.playerId === playerId && att.period === period);
        teamAttendance[attendanceIndex] = {
            ...teamAttendance[attendanceIndex],
            [field]: value,
        };
        if (team === 'team1') {
            this.setState({
                team1Attendance: teamAttendance,
            })
        } else if (team === 'team2') {
            this.setState({
                team2Attendance: teamAttendance,
            })
        }
    };

    getAttendanceValue = (playerId, period, field) => {
        const attendance = this.state.gameAttendanceList.find((att) => att.playerId === playerId && att.period === period);
        if (attendance && attendance[field]) {
            return attendance[field];
        }
        return null;
    };

    getAttendance = (players) => {
        let attendance = [];

        if (players && players.length > 0) {
            players.forEach((player) => {
                attendance = attendance.concat(this.getPlayerAttendance(player))
            });
        }

        return attendance;
    };

    setMinuteTrackingData = (teamId, playerId, period, value) => {
        const trackingData = this.state.minutesTrackingData || [];

        const trackingDataIndex = trackingData.length > 0
            ? trackingData.findIndex((data) => data.playerId === playerId && data.period === period)
            : -1;
        if (trackingDataIndex > -1) {
            trackingData[trackingDataIndex] = {
                ...trackingData[trackingDataIndex],
                duration: value,
            };
        } else {
            trackingData.push({
                matchId: this.state.matchId,
                teamId,
                playerId,
                period,
                duration: value,
            });
        }

        this.setState({
            minutesTrackingData: trackingData,
        })
    };

    getMinuteTrackingData = (teamId, playerId, period) => {
        const trackingList = this.props.liveScorePlayerMinuteTrackingState.trackingList;
        const trackingData = trackingList.length > 0
            ? trackingList.find((data) => data.playerId === playerId && data.period === period)
            : null;

        return trackingData ?.duration || 0;
    };

    exportAttendance = (team, teamId) => {
        const teamAttendance = team === 'team1' ? this.state.team1Attendance : this.state.team2Attendance;
        const filteredAttendance = teamAttendance.filter((att) => !!att ?.positionId);

        if (this.state.minutesTrackingData.length > 0) {
            this.props.liveScorePlayerMinuteRecordAction(this.state.minutesTrackingData);
        }

        if (filteredAttendance.length === 0) {
            return;
        }

        this.props.liveScoreExportGameAttendanceAction(
            this.state.matchId,
            teamId,
            filteredAttendance,
        );
    };

    playingView(record, value, index, key) {
        this.props.changePlayerLineUpAction({
            record,
            value,
            matchId: this.state.matchId,
            competitionId: this.state.competitionId,
            teamId: record.teamId,
            index,
            key
        })
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    deleteMatch = (matchId) => {
        this.props.liveScoreDeleteMatch(matchId)
        // this.setState({ deleteLoading: true })
    };

    showDeleteConfirm = (matchId) => {
        this_ = this;
        confirm({
            title: 'Are you sure you want to delete this match?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteMatch(matchId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // method to show modal view after click
    showModal = (livestreamURL) => {
        this.setState({
            visible: true,
            liveStreamLink: livestreamURL
        });
    };

    // method to hide modal view after ok click
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    // method to hide modal view after click on cancel button
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    // view for breadcrumb
    headerView = () => {
        const match = this.props.liveScoreMatchState.matchDetails
            ? this.props.liveScoreMatchState.matchDetails.match
            : [];
        const matchDetails = this.props.liveScoreMatchState.matchDetails
            ? this.props.liveScoreMatchState.matchDetails : [];

        const length = match ? match.length : 0;
        let isMatchStatus = length > 0 && match[0].matchStatus === "ENDED";

        return (
            <div className="p-4">
                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading pb-0">
                                {length >= 1 ? match ? match[0].team1.name : '' : ''}
                            </span>
                            <span className="input-heading-add-another pt-2 pl-1 pr-1"> vs </span>
                            <span className="form-heading pb-0">
                                {length >= 1 ? match ? match[0].team2.name : '' : ''}
                            </span>
                        </div>
                        <div className="col-sm-2">
                            <span className='year-select-heading' >{'#' + this.state.matchId}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 col-lg-8 pr-5 pl-5 d-flex flex-row justify-content-end w-100">
                        <div className="row align-items-center">
                            <div className="col-sm">
                                <div className="d-flex align-items-center year-select-heading">
                                    <Switch
                                        className="mr-3"
                                        onChange={(checked) => this.handleAttendanceView(checked)}
                                        disabled={this.state.userRoleId === 11 ? true : false}
                                    />
                                    {AppConstants.attendance}
                                </div>
                            </div>

                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: '100%',
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to={{
                                        pathname: '/liveScoreAddIncident',
                                        state: {
                                            matchId: this.state.matchId,
                                            matchDetails: matchDetails,
                                            umpireKey: this.state.umpireKey,
                                            screenName: this.state.screenName
                                        }
                                    }}>
                                        <Button
                                            disabled={this.state.userRoleId === 11 ? true : false}
                                            className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addIncident}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>

                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: '100%',
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button
                                        onClick={() => this.showModal(match[0].livestreamURL)}
                                        className="primary-add-comp-form"
                                        type="primary"
                                        disabled={this.state.userRoleId === 11 ? true : false}
                                    >
                                        + {AppConstants.addLiveStream}
                                    </Button>
                                </div>
                            </div>

                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: '100%',
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <NavLink to={{
                                        pathname: "/liveScoreAddMatch",
                                        state: {
                                            isEdit: true,
                                            matchId: this.state.matchId,
                                            key: this.state.key,
                                            umpireKey: this.state.umpireKey,
                                            screenName: this.state.screenName
                                        }
                                    }}>
                                        <Button
                                            disabled={this.state.userRoleId === 11 ? true : false}
                                            className="primary-add-comp-form" type="primary">
                                            + {AppConstants.edit}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: '100%',
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Tooltip
                                        style={{ height: '100%' }}
                                        onMouseEnter={() =>
                                            this.setState({
                                                toolTipVisible: !!isMatchStatus,
                                            })
                                        }
                                        onMouseLeave={() =>
                                            this.setState({ toolTipVisible: false })
                                        }
                                        visible={this.state.toolTipVisible}
                                        title={ValidationConstants.matchDeleteMsg}
                                    >
                                        <Button
                                            className={isMatchStatus ? "disable-button-style" : "primary-add-comp-form"}
                                            type="primary"
                                            disabled={(isMatchStatus || this.state.userRoleId === 11 ? true : false)}
                                            htmlType="submit"
                                            onClick={() => this.showDeleteConfirm(this.state.matchId)}
                                        >
                                            {AppConstants.delete}
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    //  Umpire & Score details
    umpireScore_View = () => {
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match : [];
        const umpires = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.umpires : [];
        const length = match ? match.length : 0;
        let UmpireData = isArrayNotEmpty(umpires) ? umpires : [];

        let scoreType = '';
        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                scoreType = getUmpireCompetitonData().scoringType;
            } else {
                history.push("/liveScoreCompetitions")
            }
        } else {
            const { scoringType } = JSON.parse(getLiveScoreCompetiton());
            scoreType = scoringType;
        }

        return (
            <div className="row mt-4 mr-0 ml-0 pr-4 pl-4">
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text">{AppConstants.umpireName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center", flexDirection: 'column' }}>
                        {UmpireData.map((item, index) => (
                            <span key={`umpire_${index}`} className="desc-text-style side-bar-profile-data pt-2">
                                {`U${index + 1}`}: {item.umpireName}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text">{AppConstants.umpireClubName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center", flexDirection: 'column' }}>
                        {UmpireData.map((item, index) => (
                            <div key={`umpire_club_data_${index}`}>
                                {isArrayNotEmpty(item.competitionOrganisations) && item.competitionOrganisations.map((item, index) => (
                                    <span key={`umpire_club_${index}`} className="inbox-name-text pt-2">
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }}>
                        {UmpireData.map((item, index) => (
                            <span key={`umpire_data_${index}`} className="inbox-name-text pt-2">
                                {item.umpire2Club && item.umpire2Club.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text">{AppConstants.scorerName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }}>
                        <span className="inbox-name-text pt-2">
                            S1: {length >= 1 && match && match[0].scorer1 ? match[0].scorer1.firstName + ' ' + match[0].scorer1.lastName : ''}
                        </span>
                    </div>
                    {scoreType !== 'SINGLE' && (
                        <div style={{ display: "flex", alignContent: "center" }}>
                            <span className="inbox-name-text pt-2">
                                S2: {length >= 1 && match && match[0].scorer2 ? match[0].scorer2.firstName + ' ' + match[0].scorer2.lastName : ''}
                            </span>
                        </div>
                    )}
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text">{AppConstants.score}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }}>
                        <span className="inbox-name-text pt-2">{length >= 1 ? this.setMatchStatus(match) : ""}</span>
                    </div>
                </div>
            </div>
        )
    };

    teamPlayersStatus = (data, team, teamId) => {
        return (
            <Table
                className="home-dashboard-table attendance-table"
                columns={this.getTeamPlayerStatusColumn(data, team, teamId)}
                dataSource={data}
                size="small"
                scroll={{ x: '100%' }}
                pagination={false}
                loading={this.props.liveScoreGamePositionState.onLoad}
            // rowKey={(record) => record.id}
            />
        )
    }

    setAttendanceValue = (playerId, period, field, key) => {


        let competition = null
        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                competition = JSON.parse(getUmpireCompetitonData());
            } else {
                history.push('/liveScoreCompetitions')
            }
        } else {
            if (getLiveScoreCompetiton()) {
                competition = JSON.parse(getLiveScoreCompetiton());
            } else {
                history.push('/liveScoreCompetitions')
            }
        }

        let { trackResultData } = this.props.liveScorePlayerMinuteTrackingState
        let gtt = (competition.gameTimeTracking || competition.gameTimeTracking == 1) ? true : false //// Game Time Tracking
        let attendance = trackResultData.find((att) => att.playerId === playerId && att.period === period);
        if (key === 'flow1') {
            if (field === "positionId") {

                return attendance ? attendance.positionId : null
            }
            if (field === "isPlaying") {
                return gtt ? attendance ? (attendance.playedEndPeriod) : attendance ? (attendance.playedFullPeriod) : false : false
            }
            if (field === "disabled" && attendance && attendance.isPlaying === false) {

                return true
            }


        } else if (key === 'flow2') {
            if (field === "isPlaying") {
                return gtt ? attendance ? (attendance.playedEndPeriod) : attendance ? (attendance.playedFullPeriod) : false : false
            }
        } else if (key === 'flow3') {
            if (field === "positionId") {
                return attendance ? attendance.positionId : null
            }
            if (field === "duration") {
                return attendance ? attendance.duration : 0
            }
        } else if (key === "flow4") {
            if (field === "isPlaying") {
                return attendance ? attendance.playedFullPeriod : false
            }
            if (field === "seconds") {
                return attendance ? attendance.duration : 0
            }
        } else if (key === "flow5") {
            if (field === "isPlaying") {
                return attendance ? attendance.playedFullPeriod : false
            }
        } else if (key === "flow6") {
            if (field === "positionId") {
                return attendance ? attendance.positionId : null
            }
        }
    };

    getPositionArray(playerId, period) {
        let { trackResultData } = this.props.liveScorePlayerMinuteTrackingState
        return trackResultData.filter(x => x.playerId === playerId && x.period === period).map(x => x.positionId);
    }

    getPositionIndex(playerId, period) {
        let { trackResultData } = this.props.liveScorePlayerMinuteTrackingState
        return trackResultData.filter(x => x.playerId === playerId && x.period === period).map(x => ({ "positionId": x.positionId, "id": x.id }));
    }

    getTeamPlayerStatusColumn = (data, team, teamId) => {
        let competition = null
        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                competition = JSON.parse(getUmpireCompetitonData());
            } else {
                history.push('/liveScoreCompetitions')
            }
        } else {
            if (getLiveScoreCompetiton()) {
                competition = JSON.parse(getLiveScoreCompetiton());
            } else {
                history.push('/liveScoreCompetitions')
            }
        }
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match[0] : [];
        const { noOfPosition, trackResultData } = this.props.liveScorePlayerMinuteTrackingState

        let pt = (competition.positionTracking || competition.positionTracking == 1) ? true : false //// Position Tracking
        let gtt = (competition.gameTimeTracking || competition.gameTimeTracking == 1) ? true : false //// Game Time Tracking
        let art = competition.attendanceRecordingPeriod //// Attendance Recording Period

        let periodDuration = null
        let positionDuration = null
        if (match.type === 'FOUR_QUARTERS') {
            periodDuration = (match.matchDuration * 60) / 4
            positionDuration = periodDuration / noOfPosition
        } else {
            periodDuration = (match.matchDuration * 60) / 2
            positionDuration = periodDuration / noOfPosition
        }

        if (match.type === 'TWO_HALVES') {
            if (pt && gtt && art !== 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Position',
                                key: 'position1',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 1)
                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 1, 'positionId', "flow1")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Played',
                                key: 'played1',
                                width: 60,
                                render: (p, row) => {
                                    let disable = this.setAttendanceValue(row.playerId, 1, 'disabled', "flow1")
                                    let value = disable ? true : false
                                    return (
                                        <Checkbox
                                            defaultChecked={value ? false : this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow1")}
                                            disabled={value}
                                            onChange={
                                                (e) =>
                                                    this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                            }
                                        />
                                    )
                                }
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Position',
                                key: 'position2',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 2)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 2, 'positionId', "flow1")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Played',
                                key: 'played2',
                                width: 60,
                                render: (p, row) => {
                                    let disable = this.setAttendanceValue(row.playerId, 2, 'disabled', "flow1")
                                    let value = disable ? true : false
                                    return (
                                        <Checkbox
                                            defaultChecked={value ? false : this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow1")}
                                            disabled={value}
                                            onChange={
                                                (e) =>
                                                    this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                            }
                                        />
                                    )
                                }
                            },
                        ]
                    },
                ];

                return columns
            } else if (!pt && gtt && art != 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Played',
                                key: 'played1',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow2")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Played',
                                key: 'played2',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow2")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ]
                    },
                ];

                return columns
            } else if (pt && !gtt && art === 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Position',
                                key: 'position1',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 1)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >

                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>

                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 1, 'positionId', "flow3")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec1',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.setAttendanceValue(row.playerId, 1, 'duration', "flow3")}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Position',
                                key: 'position2',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 2)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 2, 'positionId', "flow3")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec2',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.setAttendanceValue(row.playerId, 2, 'duration', "flow3")}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ]
                    },
                ];

                return columns
            } else if (!pt && !gtt && art === 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Played Full Period',
                                key: 'playedFullPeriod1',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow4")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedFullPeriod', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'playedFullPeriod', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                            {
                                title: 'Secs',
                                key: 'sec1',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        value={this.setAttendanceValue(row.playerId, 1, 'seconds', 'flow4')}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Played Full Period',
                                key: 'playedFullPeriod2',
                                width: 60,
                                render: (p, row) => {
                                    return (
                                        <Checkbox
                                            defaultChecked={this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow4")}
                                            onChange={
                                                (e) =>
                                                    this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedFullPeriod', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'playedFullPeriod', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                            }
                                        />
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec2',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        value={this.setAttendanceValue(row.playerId, 2, 'seconds', 'flow4')}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ]
                    },
                ];

                return columns
            } else if (!pt && !gtt && art != "MINUTE") {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Played',
                                key: 'played1',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow5")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Played',
                                key: 'played2',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow5")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ]
                    },
                ];
                return columns
            } else if (pt && !gtt && art !== 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Position',
                                key: 'position1',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 1)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 1, 'positionId', "flow6")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Position',
                                key: 'position2',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 2)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 2, 'positionId', "flow6")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                        ]
                    },
                ];
                return columns
            }
        } else {
            if (pt && gtt && art !== 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Position',
                                key: 'position1',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 1)
                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 1, 'positionId', "flow1")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Played',
                                key: 'played1',
                                width: 60,
                                render: (p, row) => {
                                    let disable = this.setAttendanceValue(row.playerId, 1, 'disabled', "flow1")
                                    let value = disable ? true : false
                                    return (
                                        <Checkbox
                                            defaultChecked={value ? false : this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow1")}
                                            disabled={value}
                                            onChange={
                                                (e) =>
                                                    this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                            }
                                        />
                                    )
                                }
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Position',
                                key: 'position2',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 2)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 2, 'positionId', "flow1")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Played',
                                key: 'played2',
                                width: 60,
                                render: (p, row) => {
                                    let disable = this.setAttendanceValue(row.playerId, 2, 'disabled', "flow1")
                                    let value = disable ? true : false
                                    return (
                                        <>
                                            <Checkbox
                                                defaultChecked={value ? false : this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow1")}
                                                disabled={value}
                                                onChange={
                                                    (e) =>
                                                        this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                                }
                                            />
                                        </>
                                    )
                                }
                            },
                        ]
                    },
                    {
                        title: 'Period 3',
                        children: [
                            {
                                title: 'Position',
                                key: 'position3',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 3)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 3, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 3, 'positionId', "flow1")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 3, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Played',
                                key: 'played3',
                                width: 60,
                                render: (p, row) => {
                                    let disable = this.setAttendanceValue(row.playerId, 3, 'disabled', "flow1")
                                    let value = disable ? true : false
                                    return (
                                        <Checkbox
                                            defaultChecked={value ? false : this.setAttendanceValue(row.playerId, 3, 'isPlaying', "flow1")}
                                            disabled={value}
                                            onChange={
                                                (e) =>
                                                    this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 3, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                            }
                                        />
                                    )
                                }
                            },
                        ],
                    },
                    {
                        title: 'Period 4',
                        children: [
                            {
                                title: 'Position',
                                key: 'position4',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 4)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 4, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 4, 'positionId', "flow1")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 4, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Played',
                                key: 'played4',
                                width: 60,
                                render: (p, row) => {
                                    let disable = this.setAttendanceValue(row.playerId, 4, 'disabled', "flow1")
                                    let value = disable ? true : false
                                    return (
                                        <Checkbox
                                            defaultChecked={value ? false : this.setAttendanceValue(row.playerId, 4, 'isPlaying', "flow1")}
                                            disabled={value}
                                            onChange={
                                                (e) =>
                                                    this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 4, team: team, extraKey: 'checkBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                            }
                                        />
                                    )
                                }
                            },
                        ],
                    },
                ];

                return columns
            } else if (!pt && gtt && art !== 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Played',
                                key: 'played1',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow2")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Played',
                                key: 'played2',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow2")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ]
                    }, {
                        title: 'Period 3',
                        children: [
                            {
                                title: 'Played',
                                key: 'played3',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 3, 'isPlaying', "flow2")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 3, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ]
                    }, {
                        title: 'Period 4',
                        children: [
                            {
                                title: 'Played',
                                key: 'played4',
                                width: 60,
                                render: (p, row) =>
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 4, 'isPlaying', "flow2")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 4, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                            },
                        ]
                    },
                ];

                return columns
            } else if (pt && !gtt && art === 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Position',
                                key: 'position1',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 1)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 1, 'positionId', "flow3")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec1',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.setAttendanceValue(row.playerId, 1, 'duration', "flow3")}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Position',
                                key: 'position2',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 2)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 2, 'positionId', "flow3")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec2',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.setAttendanceValue(row.playerId, 2, 'duration', "flow3")}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ]
                    }, {
                        title: 'Period 3',
                        children: [
                            {
                                title: 'Position',
                                key: 'position3',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 3)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 3, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 3, 'positionId', "flow3")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 3, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec3',
                                width: 60,
                                render: (p, row) =>
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.setAttendanceValue(row.playerId, 3, 'duration', "flow3")}
                                        onChange={(value) =>
                                            this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 3, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                            },
                        ]
                    },
                    {
                        title: 'Period 4',
                        children: [
                            {
                                title: 'Position',
                                key: 'position4',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 4)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 4, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 4, 'positionId', "flow3")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 4, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                            {
                                title: 'Secs',
                                key: 'sec4',
                                width: 60,
                                render: (p, row) => (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.setAttendanceValue(row.playerId, 4, 'duration', "flow3")}
                                        onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 4, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                                )
                            },
                        ]
                    },
                ];

                return columns
            } else if (!pt && !gtt && art === 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Played Full Period',
                                key: 'playedFullPeriod1',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow4")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedFullPeriod', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'playedFullPeriod', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                            {
                                title: 'Secs',
                                key: 'sec1',
                                width: 60,
                                render: (p, row) => (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        value={this.setAttendanceValue(row.playerId, 1, 'seconds', 'flow4')}
                                        onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                                )
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Played Full Period',
                                key: 'playedFullPeriod2',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow4")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedFullPeriod', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'playedFullPeriod', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                            {
                                title: 'Secs',
                                key: 'sec2',
                                width: 60,
                                render: (p, row) => (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        value={this.setAttendanceValue(row.playerId, 2, 'seconds', 'flow4')}
                                        onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                                )
                            },
                        ]
                    }, {
                        title: 'Period 3',
                        children: [
                            {
                                title: 'Played Full Period',
                                key: 'playedFullPeriod3',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 3, 'isPlaying', "flow4")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedFullPeriod', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 3, team: team, extraKey: 'playedFullPeriod', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                            {
                                title: 'Secs',
                                key: 'sec3',
                                width: 60,
                                render: (p, row) => (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        value={this.setAttendanceValue(row.playerId, 3, 'seconds', 'flow4')}
                                        onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 3, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                                )
                            },
                        ]
                    }, {
                        title: 'Period 4',
                        children: [
                            {
                                title: 'Played Full Period',
                                key: 'playedFullPeriod4',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 4, 'isPlaying', "flow4")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedFullPeriod', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 4, team: team, extraKey: 'playedFullPeriod', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                            {
                                title: 'Secs',
                                key: 'sec4',
                                width: 60,
                                render: (p, row) => (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        value={this.setAttendanceValue(row.playerId, 4, 'seconds', 'flow4')}
                                        onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'duration', selectedData: value, playerdata: row, playerId: row.playerId, period: 4, team: team, extraKey: 'seconds', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                    />
                                )
                            },
                        ]
                    },
                ];

                return columns
            } else if (!pt && !gtt && art != "MINUTE") {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Played',
                                key: 'played1',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 1, 'isPlaying', "flow5")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 1, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Played',
                                key: 'played2',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 2, 'isPlaying', "flow5")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 2, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                        ]
                    }, {
                        title: 'Period 3',
                        children: [
                            {
                                title: 'Played',
                                key: 'played3',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 3, 'isPlaying', "flow5")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 3, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                        ]
                    }, {
                        title: 'Period 4',
                        children: [
                            {
                                title: 'Played',
                                key: 'played4',
                                width: 60,
                                render: (p, row) => (
                                    <Checkbox
                                        defaultChecked={this.setAttendanceValue(row.playerId, 4, 'isPlaying', "flow5")}
                                        onChange={
                                            (e) =>
                                                this.props.liveScoreUpdatePlayerMinuteRecordAction({ key: 'playedCheckBox', selectedData: e.target.checked, playerdata: row, playerId: row.playerId, period: 4, team: team, extraKey: 'onlySibgleCheckBox', positionDuration: positionDuration, periodDuration: periodDuration, matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })
                                        }
                                    />
                                )
                            },
                        ]
                    },
                ];
                return columns
            } if (pt && !gtt && art !== 'MINUTE') {
                const columns = [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                    },
                    {
                        title: 'Period 1',
                        children: [
                            {
                                title: 'Position',
                                key: 'position1',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 1)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 1, 'positionId', "flow6")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 1, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                        ],
                    },
                    {
                        title: 'Period 2',
                        children: [
                            {
                                title: 'Position',
                                key: 'position2',
                                width: 150,
                                render: (p, row, index) => {
                                    let positionArray = this.getPositionIndex(row.playerId, 2)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )
                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 2, 'positionId', "flow6")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 2, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                        ]
                    },
                    {
                        title: 'Period 3',
                        children: [
                            {
                                title: 'Position',
                                key: 'position3',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 3)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 3, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 3, 'positionId', "flow6")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 3, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                        ],
                    },
                    {
                        title: 'Period 4',
                        children: [
                            {
                                title: 'Position',
                                key: 'position4',
                                width: 150,
                                render: (p, row, index) => {
                                    // let positionArray = this.getPositionArray(row.playerId, 1)
                                    let positionArray = this.getPositionIndex(row.playerId, 4)

                                    return (
                                        <>
                                            {positionArray.length > 0 ?
                                                positionArray.map((position) => {
                                                    let arrayIndex = trackResultData.findIndex(x => x.id === position.id)
                                                    return (
                                                        <Select
                                                            className="year-select reg-filter-select1 table-cell-select"
                                                            size="small"
                                                            style={{ width: '100%', marginTop: positionArray.length > 1 ? 10 : 0 }}
                                                            defaultValue={position.positionId > 0 && position.positionId}
                                                            onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 4, key: 'positionId', selectedData: value ? value : 0, index: arrayIndex, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art, id: position.id })}
                                                        >
                                                            {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                                <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                            ))}
                                                        </Select>
                                                    )

                                                })

                                                :
                                                <Select
                                                    className="year-select reg-filter-select1 table-cell-select"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    defaultValue={this.setAttendanceValue(row.playerId, 4, 'positionId', "flow6")}
                                                    onChange={(value) => this.props.liveScoreUpdatePlayerMinuteRecordAction({ team: team, playerId: row.playerId, period: 4, key: 'positionId', selectedData: value, index: index, playerdata: row, positionDuration: positionDuration, periodDuration: periodDuration, extraKey: 'positionId', matchId: this.state.matchId, positionTrack: pt, gameTimeTrack: gtt, attndceRecrd: art })}
                                                >
                                                    {this.props.liveScorePlayerMinuteTrackingState.positionList.map((position) => (
                                                        <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                                    ))}
                                                </Select>
                                            }
                                        </>
                                    )
                                }
                            },
                        ],
                    },
                ];

                return columns
            }
        }
    }

    handleAttendanceView = (visible, team) => {
        this.setState({
            teamAttendance: visible,
        })
    };

    // Team details
    team_View = () => {
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match : [];
        const { team1Players, team2Players } = this.props.liveScoreMatchState;
        const { trackingList } = this.props.liveScorePlayerMinuteTrackingState
        const team1PlayersData = team1Players.concat(this.state.borrowedTeam1Players);
        const team2PlayersData = team2Players.concat(this.state.borrowedTeam2Players);
        const length = match ? match.length : 0;

        return (
            <div className="row mt-5 ml-0 mr-0 mb-5">
                <div
                    className={this.state.teamAttendance ? 'col-12' : 'col-6 col-md-6 col-sm-12'}
                    style={{ flexDirection: "column", display: "flex", alignContent: "center" }}
                >
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <img
                            className="user-image"
                            src={length >= 1 && match ? match[0].team1.logoUrl : ''}
                            alt=""
                            height="80"
                            width="80"
                        />
                        <span className="live-score-profile-user-name match-details-team-name">
                            {length >= 1 ? match ? match[0].team1.name : '' : ''}
                        </span>
                        <span className='year-select-heading'>{AppConstants.homeTeam}</span>
                    </div>

                    <div className="mt-2">
                        <div className="row text-view pl-4 pr-4">
                            <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="home-dash-left-text">{AppConstants.players}</span>
                            </div>
                            <div className="col-sm text-right align-items-center">
                                {this.state.teamAttendance && (
                                    <Button
                                        className="primary-add-comp-form mr-4"
                                        type="primary"
                                    // onClick={() => this.exportAttendance('team1', match[0] ?.team1 ?.id)}
                                    >
                                        + {AppConstants.exportAttendance}
                                    </Button>
                                )}
                                <Button
                                    className="primary-add-comp-form"
                                    type="primary"
                                    onClick={() => this.handleAddPlayerModal('team1')}
                                >
                                    + {AppConstants.borrowPlayer}
                                </Button>
                            </div>
                        </div>
                        <div>
                            {this.state.teamAttendance && (
                                <div className="col-12">
                                    {this.teamPlayersStatus(team1PlayersData, 'team1', match[0] ?.team1 ?.id)}
                                </div>
                            )}
                            {!this.state.teamAttendance && (
                                <div className="col-12">
                                    <Table
                                        className="home-dashboard-table pt-2"
                                        columns={this.state.isLineUp === 1 ? columnsTeam1 : columns}
                                        dataSource={team1PlayersData}
                                        pagination={false}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* {this.footerView('team1', match[0]?.team1?.id)} */}
                </div>
                <div
                    className={this.state.teamAttendance ? 'col-12 mt-5' : 'col-6 col-md-6 col-sm-12'}
                    style={{ flexDirection: "column", display: "flex", alignContent: "center" }}
                >
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <img
                            className="user-image"
                            src={length >= 1 && match ? match[0].team2.logoUrl : ''}
                            alt=""
                            height="80"
                            width="80"
                        />
                        <span className="live-score-profile-user-name match-details-team-name">
                            {length >= 1 && match ? match[0].team2.name : ''}
                        </span>
                        <span className='year-select-heading' >{AppConstants.awayTeam}</span>
                    </div>

                    <div className="mt-2">
                        <div className="row text-view pl-4 pr-4">
                            <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="home-dash-left-text">{AppConstants.players}</span>
                            </div>
                            <div className="col-sm text-right align-items-center">
                                {this.state.teamAttendance && (
                                    <Button
                                        className="primary-add-comp-form mr-4"
                                        type="primary"
                                    // onClick={() => this.exportAttendance('team2', match[0] ?.team2 ?.id)}
                                    >
                                        + {AppConstants.exportAttendance}
                                    </Button>
                                )}
                                <Button
                                    className="primary-add-comp-form"
                                    type="primary"
                                    onClick={() => this.handleAddPlayerModal('team2')}
                                >
                                    + {AppConstants.borrowPlayer}
                                </Button>
                            </div>
                        </div>
                        <div>
                            {this.state.teamAttendance ? (
                                <div className="col-12">
                                    {this.teamPlayersStatus(team2PlayersData, 'team2', match[0] ?.team2 ?.id)}
                                </div>
                            ) : (
                                    <div className="col-12">
                                        <Table
                                            className="home-dashboard-table pt-2"
                                            columns={this.state.isLineUp === 1 ? columnsTeam2 : columns}
                                            dataSource={team2PlayersData}
                                            pagination={false}
                                            scroll={{ x: '100%' }}
                                        />
                                    </div>
                                )}
                        </div>
                    </div>
                    {this.footerView('team2', match[0] ?.team2 ?.id)}
                </div>
            </div>
        )
    };

    setMatchStatus(match) {
        if (match[0].team1ResultId !== null) {
            if (match[0].team1ResultId === 4 || match[0].team1ResultId === 6 || match[0].team1ResultId === 6) {
                return "Forfeit";
            } else if (match[0].team1ResultId === 8 || match[0].team1ResultId === 9) {
                return "Abandoned";
            } else {
                return match[0].team1Score + ' : ' + match[0].team2Score;
            }
        } else {
            return match[0].team1Score + ' : ' + match[0].team2Score;
        }
    }

    onClickFunc() {
        if (this.state.liveStreamLink) {
            let body = {
                id: this.state.matchId,
                competitionId: this.state.competitionId,
                livestreamURL: this.state.liveStreamLink
            };

            this.props.liveScoreAddLiveStreamAction({ body });
        }

        this.setState({ visible: false, liveStreamLink: '' });
    }

    // modal view
    ModalView() {
        return (
            <Modal
                title={AppConstants.liveStreamlink}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered
                footer={null}
            >
                <InputWithHead
                    auto_complete="off"
                    // heading={AppConstants.liveStreamlink}
                    placeholder={AppConstants.liveStreamlink}
                    value={this.state.liveStreamLink}
                    onChange={(e) => this.setState({ liveStreamLink: e.target.value })}
                />
                <div
                    className="comp-dashboard-botton-view-mobile"
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingTop: 24
                    }}
                >
                    <Button onClick={() => this.onClickFunc()} className="primary-add-comp-form" type="primary">
                        {AppConstants.save}
                    </Button>
                </div>
            </Modal>
        )
    }

    handleAddPlayerModal = (team) => {
        this.setState({ addPlayerModal: team });
    };

    handleAddPlayerCancel = () => {
        this.setState({ addPlayerModal: '' });
    };

    handleAddPlayerOk = () => {
        this.setState({ addPlayerModal: '' });
    };

    handleAddPlayer = (playerId) => {
        if (playerId) {
            const borrowedPlayer = (this.props.liveScorePlayerState.searchResult || [])
                .find((player) => player.playerId === playerId);
            const borrowedPlayerAttendance = this.getPlayerAttendance(borrowedPlayer, true);
            const borrowedPlayerData = {
                attendance: null,
                attended: false,
                lineup: null,
                name: `${borrowedPlayer ?.firstName || ''} ${borrowedPlayer ?.lastName || ''}`,
                photoUrl: borrowedPlayer ?.profilePicture,
                playerId: borrowedPlayer ?.playerId,
                team: borrowedPlayer ?.team ?.name,
                teamId: borrowedPlayer ?.team ?.id,
            };

            if (this.state.addPlayerModal === 'team1') {
                const borrowedTeam1Players = this.state.borrowedTeam1Players;
                const team1Attendance = this.state.team1Attendance;
                borrowedTeam1Players.push(borrowedPlayerData);
                team1Attendance.push(borrowedPlayerAttendance);

                this.setState({
                    borrowedTeam1Players,
                    team1Attendance,
                });
            } else {
                const borrowedTeam2Players = this.state.borrowedTeam2Players;
                borrowedTeam2Players.push(borrowedPlayerData);
                const team2Attendance = this.state.team2Attendance;
                team2Attendance.push(borrowedPlayerAttendance);

                this.setState({
                    borrowedTeam2Players,
                    team2Attendance,
                });
            }
        }

        this.setState({ addPlayerModal: '' });
    };

    AddPlayerModalView() {
        let playerId = null;
        if (getUmpireCompetitonData() || getLiveScoreCompetiton()) {
            const { id: competitionId, organisationId } = this.state.umpireKey ? JSON.parse(getUmpireCompetitonData()) : JSON.parse(getLiveScoreCompetiton())
            const { onLoadSearch, searchResult } = this.props.liveScorePlayerState;
            const { team1Players, team2Players } = this.props.liveScoreMatchState;
            const team1PlayersData = team1Players.concat(this.state.borrowedTeam1Players);
            const team2PlayersData = team2Players.concat(this.state.borrowedTeam2Players);

            const team1PlayerIds = team1PlayersData.length > 0
                ? team1PlayersData.map((player) => player.playerId)
                : [];
            const team2PlayerIds = team2PlayersData.length > 0
                ? team2PlayersData.map((player) => player.playerId)
                : [];

            const searchResultData = searchResult.length > 0
                ? searchResult.filter((player) =>
                    team1PlayerIds.indexOf(player.playerId) < 0 && team2PlayerIds.indexOf(player.playerId) < 0
                )
                : [];

            return (
                <Modal
                    title={AppConstants.addPlayer}
                    visible={!!this.state.addPlayerModal}
                    onOk={this.handleAddPlayerOk}
                    onCancel={this.handleAddPlayerCancel}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    centered
                    footer={null}
                >
                    <AutoComplete
                        loading
                        style={{ width: '100%', height: '56px' }}
                        placeholder="Add Player"
                        onSelect={(item, option) => {
                            playerId = JSON.parse(option.key);
                        }}
                        notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}
                        onSearch={(value) => {
                            if (value) {
                                this.props.liveScorePlayerListSearchAction(competitionId, organisationId, value)
                            }
                        }}
                    >
                        {searchResultData.length > 0 && searchResultData.map((item) => (
                            <Option key={item.playerId} value={item.playerId.toString()}>
                                {item.firstName + " " + item.lastName}
                            </Option>
                        ))}
                    </AutoComplete>
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingTop: 24
                        }}
                    >
                        <Button onClick={() => this.handleAddPlayer(playerId)} className="primary-add-comp-form" type="primary">
                            {AppConstants.save}
                        </Button>
                    </div>
                </Modal>
            )
        } else {
            history.push("/liveScoreCompetitions")
        }
    }

    getDurationArray(playerId, period) {
        let { trackResultData } = this.props.liveScorePlayerMinuteTrackingState
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match[0] : [];
        let periodDuration = null
        if (match.type === 'FOUR_QUARTERS') {
            periodDuration = (match.matchDuration * 60) / 4
        } else {
            periodDuration = (match.matchDuration * 60) / 2
        }
        let duration = trackResultData.filter(x => x.playerId === playerId && x.period === period).map(x => x.duration);
        let sum = duration.reduce(function (a, b) {

            return a + b;
        }, 0);
        return (sum === periodDuration);
    }

    onSavePlayerTrack(trackResultData) {
        let competition = null
        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                competition = JSON.parse(getUmpireCompetitonData());
            } else {
                history.push('/liveScoreCompetitions')
            }
        } else {
            if (getLiveScoreCompetiton()) {
                competition = JSON.parse(getLiveScoreCompetiton());
            } else {
                history.push('/liveScoreCompetitions')
            }
        }
        let pt = (competition.positionTracking || competition.positionTracking == 1) ? true : false //// Position Tracking
        let gtt = (competition.gameTimeTracking || competition.gameTimeTracking == 1) ? true : false //// Game Time Tracking
        let art = competition.attendanceRecordingPeriod //// Attendance Recording Period

        let filteredData = []
        let finalArray = []
        for (let i in trackResultData) {
            if (trackResultData[i].duration > 0 || trackResultData[i].positionId > 0) {
                filteredData.push(trackResultData[i])
            }
        }

        if ((pt && !gtt && art === 'MINUTE') || (!pt && !gtt && art === 'MINUTE')) {

            if (filteredData.length > 0) {
                filteredData.map((item) => {
                    item.playedFullPeriod = this.getDurationArray(item.playerId, item.period)
                    return item;
                });
                for (let i in filteredData) {
                    if (filteredData[i].duration > 0 || filteredData[i].positionId > 0) {
                        finalArray.push(filteredData[i])
                    }
                }
                this.props.liveScorePlayerMinuteRecordAction(finalArray, this.state.matchId)
            }

        } else {

            for (let i in filteredData) {
                if (filteredData[i].duration > 0 || filteredData[i].positionId > 0) {
                    finalArray.push(filteredData[i])
                }
            }
            this.props.liveScorePlayerMinuteRecordAction(finalArray, this.state.matchId)
        }

    }

    footerView = (team, teamId) => {
        const { trackResultData } = this.props.liveScorePlayerMinuteTrackingState

        return (
            <div className="fluid-width paddingBottom56px mt-4">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button ml-3">
                            {this.state.teamAttendance && (
                                <Button className="cancelBtnWidth" type="cancel-button">
                                    {AppConstants.cancel}
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view mr-3">
                            {this.state.teamAttendance && (
                                <Button
                                    onClick={() => trackResultData.length > 0 && this.onSavePlayerTrack(trackResultData)}
                                    // onClick={() => trackResultData.length > 0 && this.onSavePlayerTrack(trackResultData, this.state.matchId)}
                                    className="publish-button save-draft-text mr-0"
                                    htmlType="submit"
                                    type="primary"
                                >
                                    {AppConstants.save}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { umpireKey } = this.state;
        let screen = (this.props.location.state && this.props.location.state.screenName) ? this.props.location.state.screenName : null;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <Loader
                    visible={
                        // this.props.liveScorePlayerMinuteTrackingState.onLoad ||
                        this.props.liveScorePlayerMinuteTrackingState.recordLoad
                    }
                />

                {umpireKey ? (
                    <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                ) : (
                        <DashboardLayout
                            menuHeading={AppConstants.liveScores}
                            menuName={AppConstants.liveScores}
                            onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                        />
                    )}

                {umpireKey ? (
                    <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={screen === 'umpireList' ? "2" : "1"} />
                ) : (
                        <InnerHorizontalMenu
                            menu="liveScore"
                            liveScoreSelectedKey={this.state.screenName === 'incident' ? '17' : "2"}
                        />
                    )}

                <Loader visible={this.props.liveScoreMatchState.onLoad} />

                <Layout>
                    {this.headerView()}

                    <Content>
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && umpireKey === 'umpire')) && this.umpireScore_View()}
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && umpireKey === 'umpire')) && this.team_View()}
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && umpireKey === 'umpire')) && this.ModalView()}
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && umpireKey === 'umpire')) && this.AddPlayerModalView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreDeleteMatch,
        liveScoreGetMatchDetailInitiate,
        changePlayerLineUpAction,
        liveScoreAddLiveStreamAction,
        getLiveScoreGamePositionsList,
        liveScorePlayerListSearchAction,
        liveScoreExportGameAttendanceAction,
        liveScoreGameAttendanceListAction,
        liveScorePlayerMinuteTrackingListAction,
        liveScorePlayerMinuteRecordAction,
        liveScoreUpdatePlayerMinuteRecordAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchState: state.LiveScoreMatchState,
        liveScoreGamePositionState: state.liveScoreGamePositionState,
        liveScorePlayerState: state.LiveScorePlayerState,
        liveScoreGameAttendanceState: state.liveScoreGameAttendanceState,
        liveScorePlayerMinuteTrackingState: state.liveScorePlayerMinuteTrackingState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreMatchDetails);
