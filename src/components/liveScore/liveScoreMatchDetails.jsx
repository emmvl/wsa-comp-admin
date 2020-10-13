import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Layout, Button, Table, Modal, InputNumber, Checkbox, Tooltip, Select, Input, Spin, AutoComplete, Switch, message,
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
    liveScorePlayerMinuteTrackingListAction, liveScorePlayerMinuteRecordAction
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

import './liveScore.css';
import liveScorePlayerMinuteTrackingState
    from "../../store/reducer/liveScoreReducer/liveScorePlayerMinuteTrackingReducer";

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
        render: attendance =>
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img className="dot-image"
                    src={attendance && attendance.isPlaying === true ? AppImages.greenDot : AppImages.greyDot}
                    alt="" width="12" height="12" />
            </span>,
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
                    className={record.lineup && record.lineup.playing ? 'checkbox-green-color-outline mt-1' : 'single-checkbox mt-1'}
                    checked={record.attendance && record.attendance.isPlaying}
                    onChange={(e) => this_.playingView(record, e.target.checked, index, 'team1Players')}
                />
            )
        },
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
        render: (attended, record, index) => {
            return (
                <Checkbox
                    className={record.lineup && record.lineup.playing ? "checkbox-green-color-outline mt-1" : 'single-checkbox mt-1'}
                    checked={record.attendance && record.attendance.isPlaying}
                    onChange={(e) => this_.playingView(record, e.target.checked, index, 'team2Players')}
                />
            )
        },
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
        };
        this.umpireScore_View = this.umpireScore_View.bind(this);
        this.team_View = this.team_View.bind(this);
        this_ = this;
    }

    componentDidMount() {
        let isLineUpEnable = null;
        this.props.getLiveScoreGamePositionsList();

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
            if (isLineUpEnable === 1) {
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


        if (this.props.liveScorePlayerMinuteTrackingState.recordLoad
            !== nextProps.liveScorePlayerMinuteTrackingState.recordLoad) {
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
                teamId: player?.teamId,
                matchId: this.state.matchId,
                playerId: player?.playerId,
                positionId: player?.lineup?.positionId,
                isBorrowed: borrowed,
                isPlaying: true,
                verifiedBy: null,
                mnbPushed: false,
                period: index + 1,
            }));
        }

        return attendance;
    };

    setAttendance = (team, playerId, period, field, value) => {
        const teamAttendance = team === 'team1' ? this.state.team1Attendance : this.state.team2Attendance;
        const attendanceIndex = teamAttendance
            .findIndex((att) => att.playerId === playerId && att.period === period);
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
        const attendance = this.state.gameAttendanceList
            .find((att) => att.playerId === playerId && att.period === period);
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

        return trackingData?.duration || 0;
    };

    exportAttendance = (team, teamId) => {
        const teamAttendance = team === 'team1' ? this.state.team1Attendance : this.state.team2Attendance;
        const filteredAttendance = teamAttendance.filter((att) => !!att?.positionId);

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
        this.props.changePlayerLineUpAction(
            {
                record: record,
                value: value,
                matchId: this.state.matchId,
                competitionId: this.state.competitionId,
                teamId: record.teamId,
                index: index,
                key: key
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
    showModal = (livestreamURL,) => {
        console.log(livestreamURL);
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
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <span className="form-heading pb-0" >
                                {length >= 1 ? match ? match[0].team1.name : '' : ''}
                            </span>
                            <span className="input-heading-add-another pt-2 pl-1 pr-1" > vs </span>
                            <span className="form-heading pb-0" >
                                {length >= 1 ? match ? match[0].team2.name : '' : ''}
                            </span>
                        </div>
                        <div className="col-sm-2" >
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
                                    />
                                    {AppConstants.attendance}
                                </div>
                            </div>

                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to={{
                                        pathname: '/liveScoreAddIncident',
                                        state: { matchId: this.state.matchId, matchDetails: matchDetails }
                                    }}>
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addIncident}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>

                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button onClick={() => this.showModal(match[0].livestreamURL)}
                                        className="primary-add-comp-form" type="primary">
                                        + {AppConstants.addliveStream}
                                    </Button>
                                </div>
                            </div>

                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: "100%",
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
                                            umpireKey: this.state.umpireKey
                                        }
                                    }}>
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.edit}
                                        </Button>
                                    </NavLink>

                                </div>
                            </div>
                            <div className="col-sm pt-2">
                                <div
                                    style={{
                                        width: "100%",
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
                                            disabled={isMatchStatus}
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
                        <span className="event-time-start-text" >{AppConstants.umpireName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center", flexDirection: 'column' }} >
                        {UmpireData.map((item, index) => (
                            <span key={`umpire_${index}`} className="desc-text-style side-bar-profile-data pt-2" >
                                {`U${index + 1}`}: {item.umpireName}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.umpireClubName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center", flexDirection: 'column' }} >
                        {UmpireData.map((item, index) => (
                            <div key={`umpire_club_data_${index}`}>
                                {isArrayNotEmpty(item.competitionOrganisations)
                                    && item.competitionOrganisations.map((item, index) => (
                                        <span key={`umpire_club_${index}`} className="inbox-name-text pt-2" >
                                            {item.name}
                                        </span>
                                    ))}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {UmpireData.map((item, index) => (
                            <span key={`umpire_data_${index}`} className="inbox-name-text pt-2" >
                                {item.umpire2Club && item.umpire2Club.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.scorerName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >
                            S1: {length >= 1 && match && match[0].scorer1 ? match[0].scorer1.firstName + ' ' + match[0].scorer1.lastName : ''}
                        </span>
                    </div>
                    {scoreType !== 'SINGLE' && <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >
                            S2: {length >= 1 && match && match[0].scorer2 ? match[0].scorer2.firstName + ' ' + match[0].scorer2.lastName : ''}
                        </span>
                    </div>}
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.score}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >{length >= 1 ? this.setMatchStatus(match) : ""}</span>
                    </div>
                </div>
            </div >
        )
    };

    teamPlayersStatus = (data, team, teamId) => {
        const competition = JSON.parse(getLiveScoreCompetiton());
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match[0] : [];

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 120,
            },
            {
                title: 'Period 1',
                children: competition?.positionTracking ?
                    [{
                        title: 'Position',
                        key: 'position1',
                        width: 150,
                        render: (p, row) => (
                            <Select
                                className="year-select reg-filter-select1 table-cell-select"
                                size="small"
                                style={{ width: '100%' }}
                                defaultValue={this.getAttendanceValue(row.playerId, 1, 'positionId')}
                                onChange={(value) => this.setAttendance(team, row.playerId, 1, 'positionId', value)}
                            >
                                {this.props.liveScoreGamePositionState.positionList.map((position) => (
                                    <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                ))}
                            </Select>
                        )
                    },
                    {
                        title: 'Goals',
                        key: 'goals1',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'Miss',
                        key: 'miss1',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'P Miss',
                        key: 'pmiss1',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                        key: 'sec1',
                        width: 60,
                        render: (p, row) =>
                            competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                <InputNumber
                                    size="small"
                                    type="number"
                                    defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 1)}
                                    onChange={(value) =>
                                        this.setMinuteTrackingData(teamId, row.playerId, 1, value)}
                                />
                            ) : (
                                    <Checkbox
                                        defaultChecked={this.getAttendanceValue(row.playerId, 1, 'isPlaying')}
                                        onChange={
                                            (e) =>
                                                this.setAttendance(team, row.playerId, 1, 'isPlaying', e.target.checked)
                                        }
                                    />
                                )
                    },
                    ] :
                    [
                        //     {
                        //     title: 'Position',
                        //     key: 'position1',
                        //     width: 150,
                        //     render: (p, row) => (
                        //         <Select
                        //             className="year-select reg-filter-select1 table-cell-select"
                        //             size="small"
                        //             style={{ width: '100%' }}
                        //             defaultValue={this.getAttendanceValue(row.playerId, 1, 'positionId')}
                        //             onChange={(value) => this.setAttendance(team, row.playerId, 1, 'positionId', value)}
                        //         >
                        //             {this.props.liveScoreGamePositionState.positionList.map((position) => (
                        //                 <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                        //             ))}
                        //         </Select>
                        //     )
                        // },
                        {
                            title: 'Goals',
                            key: 'goals1',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss1',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss1',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec1',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 1)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 1, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 1, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 1, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ]
            },
            {
                title: 'Period 2',
                children: competition?.positionTracking ?
                    [
                        {
                            title: 'Position',
                            key: 'position2',
                            width: 150,
                            render: (p, row) => (
                                <Select
                                    className="year-select reg-filter-select1 table-cell-select"
                                    size="small"
                                    style={{ width: '100%' }}
                                    defaultValue={this.getAttendanceValue(row.playerId, 2, 'positionId')}
                                    onChange={
                                        (value) =>
                                            this.setAttendance(team, row.playerId, 2, 'positionId', value)
                                    }
                                >
                                    {this.props.liveScoreGamePositionState.positionList.map((position) => (
                                        <Option key={`position2_${position.id}`} value={position.id}>{position.name}</Option>
                                    ))}
                                </Select>
                            )
                        },
                        {
                            title: 'Goals',
                            key: 'goals2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec2',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 2)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 2, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 2, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 2, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ] : [
                        {
                            title: 'Goals',
                            key: 'goals2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec2',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        min={0}
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 2)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 2, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 2, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 2, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ],
            },
            {
                title: 'Period 3',
                children: competition?.positionTracking ? [
                    {
                        title: 'Position',
                        key: 'position3',
                        width: 150,
                        render: (p, row) => (
                            <Select
                                className="year-select reg-filter-select1 table-cell-select"
                                size="small"
                                style={{ width: '100%' }}
                                defaultValue={this.getAttendanceValue(row.playerId, 3, 'positionId')}
                                onChange={
                                    (value) =>
                                        this.setAttendance(team, row.playerId, 3, 'positionId', value)
                                }
                            >
                                {this.props.liveScoreGamePositionState.positionList.map((position) => (
                                    <Option key={`position3_${position.id}`} value={position.id}>{position.name}</Option>
                                ))}
                            </Select>
                        )
                    },
                    {
                        title: 'Goals',
                        key: 'goals3',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'Miss',
                        key: 'miss3',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'P Miss',
                        key: 'pmiss3',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                        key: 'sec3',
                        width: 60,
                        render: (p, row) =>
                            competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                <InputNumber
                                    size="small"
                                    type="number"
                                    min={0}
                                    defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 3)}
                                    onChange={(value) =>
                                        this.setMinuteTrackingData(teamId, row.playerId, 3, value)}
                                />
                            ) : (
                                    <Checkbox
                                        defaultChecked={this.getAttendanceValue(row.playerId, 3, 'isPlaying')}
                                        onChange={
                                            (e) =>
                                                this.setAttendance(team, row.playerId, 3, 'isPlaying', e.target.checked)
                                        }
                                    />
                                )
                    },
                ] : [

                        {
                            title: 'Goals',
                            key: 'goals3',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss3',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss3',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec3',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 3)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 3, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 3, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 3, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ],
            },
            {
                title: 'Period 4',
                children: competition?.positionTracking ? [
                    {
                        title: 'Position',
                        key: 'position4',
                        width: 150,
                        render: (p, row) => (
                            <Select
                                className="year-select reg-filter-select1 table-cell-select"
                                size="small"
                                style={{ width: '100%' }}
                                defaultValue={this.getAttendanceValue(row.playerId, 4, 'positionId')}
                                onChange={
                                    (value) =>
                                        this.setAttendance(team, row.playerId, 4, 'positionId', value)
                                }
                            >
                                {this.props.liveScoreGamePositionState.positionList.map((position) => (
                                    <Option key={`position4_${position.id}`} value={position.id}>{position.name}</Option>
                                ))}
                            </Select>
                        )
                    },
                    {
                        title: 'Goals',
                        key: 'goals4',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'Miss',
                        key: 'miss4',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'P Miss',
                        key: 'pmiss4',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                        key: 'sec4',
                        width: 60,
                        render: (p, row) =>
                            competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                <InputNumber
                                    size="small"
                                    type="number"
                                    defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 4)}
                                    onChange={(value) =>
                                        this.setMinuteTrackingData(teamId, row.playerId, 4, value)}
                                />
                            ) : (
                                    <Checkbox
                                        defaultChecked={this.getAttendanceValue(row.playerId, 4, 'isPlaying')}
                                        onChange={
                                            (e) =>
                                                this.setAttendance(team, row.playerId, 4, 'isPlaying', e.target.checked)
                                        }
                                    />
                                )
                    },
                    {
                        title: 'Miss',
                        key: 'miss2',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'P Miss',
                        key: 'pmiss2',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                        key: 'sec2',
                        width: 60,
                        render: (p, row) =>
                            competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                <Input
                                    size="small"
                                    type="number"
                                />
                            ) : (
                                    <Checkbox
                                        onChange={
                                            (e) =>
                                                this.setAttendance(team, row.playerId, 2, 'isPlaying', e.target.checked)
                                        }
                                    />
                                )
                    },
                ] : [
                        {
                            title: 'Goals',
                            key: 'goals4',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss4',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss4',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec4',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 4)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 4, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 4, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 4, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                        // {
                        //     title: 'Miss',
                        //     key: 'miss2',
                        //     width: 60,
                        //     render: () => (
                        //         <Input size="small" type="number" />
                        //     )
                        // },
                        // {
                        //     title: 'P Miss',
                        //     key: 'pmiss2',
                        //     width: 60,
                        //     render: () => (
                        //         <Input size="small" type="number" />
                        //     )
                        // },
                        // {
                        //     title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                        //     key: 'sec2',
                        //     width: 60,
                        //     render: (p, row) =>
                        //         competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                        //             <Input
                        //                 size="small"
                        //                 type="number"
                        //             />
                        //         ) : (
                        //                 <Checkbox
                        //                     onChange={
                        //                         (e) =>
                        //                             this.setAttendance(team, row.playerId, 2, 'isPlaying', e.target.checked)
                        //                     }
                        //                 />
                        //             )
                        // },
                    ],
            },
            // {
            //     title: 'Period 3',
            //     children: [
            //         {
            //             title: 'Position',
            //             key: 'position3',
            //             width: 150,
            //             render: (p, row) => (
            //                 <Select
            //                     className="year-select reg-filter-select1 table-cell-select"
            //                     size="small"
            //                     style={{ width: '100%' }}
            //                     defaultValue={row?.lineup?.positionId}
            //                     onChange={
            //                         (value) =>
            //                             this.setAttendance(team, row.playerId, 3, 'positionId', value)
            //                     }
            //                 >
            //                     {this.props.liveScoreGamePositionState.positionList.map((position) => (
            //                         <Option key={`position3_${position.id}`} value={position.id}>{position.name}</Option>
            //                     ))}
            //                 </Select>
            //             )
            //         },
            //         {
            //             title: 'Goals',
            //             key: 'goals3',
            //             width: 60,
            //             render: () => (
            //                 <Input size="small" type="number" />
            //             )
            //         },
            //         {
            //             title: 'Miss',
            //             key: 'miss3',
            //             width: 60,
            //             render: () => (
            //                 <Input size="small" type="number" />
            //             )
            //         },
            //         {
            //             title: 'P Miss',
            //             key: 'pmiss3',
            //             width: 60,
            //             render: () => (
            //                 <Input size="small" type="number" />
            //             )
            //         },
            //         {
            //             title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
            //             key: 'sec3',
            //             width: 60,
            //             render: (p, row) =>
            //                 competition?.attendanceRecordingPeriod === 'MINUTE' ? (
            //                     <Input size="small" type="number" />
            //                 ) : (
            //                         <Checkbox
            //                             onChange={
            //                                 (e) =>
            //                                     this.setAttendance(team, row.playerId, 3, 'isPlaying', e.target.checked)
            //                             }
            //                         />
            //                     )
            //         },
            //     ],
            // },
            // {
            //     title: 'Period 4',
            //     children: [
            //         {
            //             title: 'Position',
            //             key: 'position4',
            //             width: 150,
            //             render: (p, row) => (
            //                 <Select
            //                     className="year-select reg-filter-select1 table-cell-select"
            //                     size="small"
            //                     style={{ width: '100%' }}
            //                     defaultValue={row?.lineup?.positionId}
            //                     onChange={
            //                         (value) =>
            //                             this.setAttendance(team, row.playerId, 4, 'positionId', value)
            //                     }
            //                 >
            //                     {this.props.liveScoreGamePositionState.positionList.map((position) => (
            //                         <Option key={`position4_${position.id}`} value={position.id}>{position.name}</Option>
            //                     ))}
            //                 </Select>
            //             )
            //         },
            //         {
            //             title: 'Goals',
            //             key: 'goals4',
            //             width: 60,
            //             render: () => (
            //                 <Input size="small" type="number" />
            //             )
            //         },
            //         {
            //             title: 'Miss',
            //             key: 'miss4',
            //             width: 60,
            //             render: () => (
            //                 <Input size="small" type="number" />
            //             )
            //         },
            //         {
            //             title: 'P Miss',
            //             key: 'pmiss4',
            //             width: 60,
            //             render: () => (
            //                 <Input size="small" type="number" />
            //             )
            //         },
            //         {
            //             title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
            //             key: 'sec4',
            //             width: 60,
            //             render: (p, row) =>
            //                 competition?.attendanceRecordingPeriod === 'MINUTE' ? (
            //                     <Input size="small" type="number" />
            //                 ) : (
            //                         <Checkbox
            //                             onChange={
            //                                 (e) =>
            //                                     this.setAttendance(team, row.playerId, 4, 'isPlaying', e.target.checked)
            //                             }
            //                         />
            //                     )
            //         },
            //     ],
            // },
        ];
        const columns2 = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 120,
            },
            {
                title: 'Period 1',
                children: competition?.positionTracking ?
                    [{
                        title: 'Position',
                        key: 'position1',
                        width: 150,
                        render: (p, row) => (
                            <Select
                                className="year-select reg-filter-select1 table-cell-select"
                                size="small"
                                style={{ width: '100%' }}
                                defaultValue={this.getAttendanceValue(row.playerId, 1, 'positionId')}
                                onChange={(value) => this.setAttendance(team, row.playerId, 1, 'positionId', value)}
                            >
                                {this.props.liveScoreGamePositionState.positionList.map((position) => (
                                    <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                                ))}
                            </Select>
                        )
                    },
                    {
                        title: 'Goals',
                        key: 'goals1',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'Miss',
                        key: 'miss1',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: 'P Miss',
                        key: 'pmiss1',
                        width: 60,
                        render: () => (
                            <Input size="small" type="number" />
                        )
                    },
                    {
                        title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                        key: 'sec1',
                        width: 60,
                        render: (p, row) =>
                            competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                <InputNumber
                                    size="small"
                                    type="number"
                                    defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 1)}
                                    onChange={(value) =>
                                        this.setMinuteTrackingData(teamId, row.playerId, 1, value)}
                                />
                            ) : (
                                    <Checkbox
                                        defaultChecked={this.getAttendanceValue(row.playerId, 1, 'isPlaying')}
                                        onChange={
                                            (e) =>
                                                this.setAttendance(team, row.playerId, 1, 'isPlaying', e.target.checked)
                                        }
                                    />
                                )
                    },
                    ] :
                    [
                        //     {
                        //     title: 'Position',
                        //     key: 'position1',
                        //     width: 150,
                        //     render: (p, row) => (
                        //         <Select
                        //             className="year-select reg-filter-select1 table-cell-select"
                        //             size="small"
                        //             style={{ width: '100%' }}
                        //             defaultValue={this.getAttendanceValue(row.playerId, 1, 'positionId')}
                        //             onChange={(value) => this.setAttendance(team, row.playerId, 1, 'positionId', value)}
                        //         >
                        //             {this.props.liveScoreGamePositionState.positionList.map((position) => (
                        //                 <Option key={`position1_${position.id}`} value={position.id}>{position.name}</Option>
                        //             ))}
                        //         </Select>
                        //     )
                        // },
                        {
                            title: 'Goals',
                            key: 'goals1',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss1',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss1',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec1',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 1)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 1, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 1, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 1, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ]
            },
            {
                title: 'Period 2',
                children: competition?.positionTracking ?
                    [
                        {
                            title: 'Position',
                            key: 'position2',
                            width: 150,
                            render: (p, row) => (
                                <Select
                                    className="year-select reg-filter-select1 table-cell-select"
                                    size="small"
                                    style={{ width: '100%' }}
                                    defaultValue={this.getAttendanceValue(row.playerId, 2, 'positionId')}
                                    onChange={
                                        (value) =>
                                            this.setAttendance(team, row.playerId, 2, 'positionId', value)
                                    }
                                >
                                    {this.props.liveScoreGamePositionState.positionList.map((position) => (
                                        <Option key={`position2_${position.id}`} value={position.id}>{position.name}</Option>
                                    ))}
                                </Select>
                            )
                        },
                        {
                            title: 'Goals',
                            key: 'goals2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec2',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 2)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 2, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 2, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 2, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ] : [
                        {
                            title: 'Goals',
                            key: 'goals2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'Miss',
                            key: 'miss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: 'P Miss',
                            key: 'pmiss2',
                            width: 60,
                            render: () => (
                                <Input size="small" type="number" />
                            )
                        },
                        {
                            title: competition?.attendanceRecordingPeriod === 'MINUTE' ? 'Secs' : 'Played',
                            key: 'sec2',
                            width: 60,
                            render: (p, row) =>
                                competition?.attendanceRecordingPeriod === 'MINUTE' ? (
                                    <InputNumber
                                        min={0}
                                        size="small"
                                        type="number"
                                        defaultValue={this.getMinuteTrackingData(teamId, row.playerId, 2)}
                                        onChange={(value) =>
                                            this.setMinuteTrackingData(teamId, row.playerId, 2, value)}
                                    />
                                ) : (
                                        <Checkbox
                                            defaultChecked={this.getAttendanceValue(row.playerId, 2, 'isPlaying')}
                                            onChange={
                                                (e) =>
                                                    this.setAttendance(team, row.playerId, 2, 'isPlaying', e.target.checked)
                                            }
                                        />
                                    )
                        },
                    ],
            },
        ];
        console.log(match)
        return (
            <Table
                className="home-dashboard-table attendance-table"
                columns={match?.type == 'TWO_HALVES' ? columns2 : columns}
                dataSource={data}
                size="small"
                scroll={{ x: '100%' }}
                pagination={false}
                loading={this.props.liveScoreGamePositionState.onLoad}
            // rowKey={(record) => record.id}
            />
        )
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
        const team1PlayersData = team1Players.concat(this.state.borrowedTeam1Players);
        const team2PlayersData = team2Players.concat(this.state.borrowedTeam2Players);

        const length = match ? match.length : 0;

        return (
            <div className="row mt-5 ml-0 mr-0 mb-5">
                <div className={this.state.teamAttendance ? 'col-12' : 'col-6 col-md-6 col-sm-12'}
                    style={{ flexDirection: "column", display: "flex", alignContent: "center" }} >
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <img className="user-image" src={length >= 1 && match ? match[0].team1.logoUrl : ''}
                            alt="" height="80" width="80" />
                        <span className="live-score-profile-user-name match-details-team-name">
                            {length >= 1 ? match ? match[0].team1.name : '' : ''}
                        </span>
                        <span className='year-select-heading' >{AppConstants.homeTeam}</span>
                    </div>

                    <div className="mt-2">
                        <div className="row text-view pl-4 pr-4">
                            <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }} >
                                <span className='home-dash-left-text'>{AppConstants.players}</span>
                            </div>
                            <div className="col-sm text-right align-items-center" >
                                {this.state.teamAttendance &&
                                    <Button
                                        className="primary-add-comp-form mr-4"
                                        type="primary"
                                        onClick={() => this.exportAttendance('team1', match[0]?.team1?.id)}
                                    >
                                        + {AppConstants.exportAttendance}
                                    </Button>
                                }
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
                            {this.state.teamAttendance && <div className="col-12">
                                {this.teamPlayersStatus(team1PlayersData, 'team1', match[0]?.team1?.id)}
                            </div>
                            }
                            {!this.state.teamAttendance &&
                                <div className="col-12">
                                    <Table
                                        className="home-dashboard-table pt-2"
                                        columns={this.state.isLineUp === 1 ? columnsTeam1 : columns}
                                        dataSource={team1PlayersData}
                                        pagination={false}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={this.state.teamAttendance ? 'col-12 mt-5' : 'col-6 col-md-6 col-sm-12'}
                    style={{ flexDirection: "column", display: "flex", alignContent: "center" }} >
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <img className="user-image" src={length >= 1 && match ? match[0].team2.logoUrl : ''}
                            alt="" height="80" width="80" />
                        <span className="live-score-profile-user-name match-details-team-name">
                            {length >= 1 && match ? match[0].team2.name : ''}
                        </span>
                        <span className='year-select-heading' >{AppConstants.awayTeam}</span>
                    </div>

                    <div className="mt-2">
                        <div className="row text-view pl-4 pr-4">
                            <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }} >
                                <span className='home-dash-left-text'>{AppConstants.players}</span>
                            </div>
                            <div className="col-sm text-right align-items-center" >
                                {this.state.teamAttendance &&
                                    <Button
                                        className="primary-add-comp-form mr-4"
                                        type="primary"
                                        onClick={() => this.exportAttendance('team2', match[0]?.team2?.id)}
                                    >
                                        + {AppConstants.exportAttendance}
                                    </Button>
                                }
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
                            {this.state.teamAttendance &&
                                <div className="col-12">
                                    {this.teamPlayersStatus(team2PlayersData, 'team2', match[0]?.team2?.id)}
                                </div>
                            }
                            {!this.state.teamAttendance &&
                                <div className="col-12">
                                    <Table
                                        className="home-dashboard-table pt-2"
                                        columns={this.state.isLineUp === 1 ? columnsTeam2 : columns}
                                        dataSource={team2PlayersData}
                                        pagination={false}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            }
                        </div>
                    </div>
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

            this.props.liveScoreAddLiveStreamAction({ body: body });
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
                centered={true}
                footer={null}
            >
                <InputWithHead
                    auto_complete='off'
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
                name: `${borrowedPlayer?.firstName || ''} ${borrowedPlayer?.lastName || ''}`,
                photoUrl: borrowedPlayer?.profilePicture,
                playerId: borrowedPlayer?.playerId,
                team: borrowedPlayer?.team?.name,
                teamId: borrowedPlayer?.team?.id,
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
                    centered={true}
                    footer={null}
                >
                    <AutoComplete
                        loading={true}
                        style={{ width: "100%", height: '56px' }}
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
                        {searchResultData.length > 0 && searchResultData.map((item) => {
                            return <Option key={item.playerId} value={item.playerId.toString()}>
                                {item.firstName + " " + item.lastName}
                            </Option>
                        })}
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

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <Loader
                    visible={
                        this.props.liveScorePlayerMinuteTrackingState.onLoad
                        || this.props.liveScorePlayerMinuteTrackingState.recordLoad
                    }
                />
                {
                    this.state.umpireKey ?
                        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                        :
                        <DashboardLayout
                            menuHeading={AppConstants.liveScores}
                            menuName={AppConstants.liveScores}
                            onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                        />
                }

                {
                    this.state.umpireKey ?
                        <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"1"} />
                        :
                        <InnerHorizontalMenu
                            menu={"liveScore"}
                            liveScoreSelectedKey={this.state.screenName === 'incident' ? '17' : "2"}
                        />
                }
                <Loader visible={this.props.liveScoreMatchState.onLoad} />
                <Layout>
                    {this.headerView()}

                    <Content>
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && this.state.umpireKey === 'umpire')) && this.umpireScore_View()}
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && this.state.umpireKey === 'umpire')) && this.team_View()}
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && this.state.umpireKey === 'umpire')) && this.ModalView()}
                        {(getLiveScoreCompetiton() || (getUmpireCompetitonData() && this.state.umpireKey === 'umpire')) && this.AddPlayerModalView()}
                    </Content>
                </Layout>
            </div >
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
