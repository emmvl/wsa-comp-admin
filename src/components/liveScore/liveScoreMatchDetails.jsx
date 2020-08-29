import React, { Component } from "react";
import { Layout, Button, Table, Modal, Checkbox, Tooltip, Popover, Select, Input } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { liveScoreDeleteMatch, liveScoreGetMatchDetailInitiate, changePlayerLineUpAction, liveScoreAddLiveStreamAction } from "../../store/actions/LiveScoreAction/liveScoreMatchAction";
import Loader from '../../customComponents/loader'
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreCompetiton, getUmpireCompetitonData } from '../../util/sessionStorage';
import history from "../../util/history";
import ValidationConstants from '../../themes/validationConstant';
import InputWithHead from "../../customComponents/InputWithHead";

const { Content } = Layout;
const { confirm } = Modal;


/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}
var this_ = null


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
        // render: (record, name) => console.log(record, 'record')
        // <NavLink to={{
        //     pathname: '/liveScorePlayerProfile',
        //     state: { playerName: name }
        // }}>
        //     {/* <span class="input-heading-add-another pt-0" >{record.firstName + " " + record.lastName}</span> */}
        //     </NavLink>

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
                    src={attendance ? attendance.isPlaying === true ? AppImages.greenDot : AppImages.greyDot : AppImages.greyDot}
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
                    className={record.lineup ? record.lineup.playing ? "checkbox-green-color-outline mt-1" : 'single-checkbox mt-1' : 'single-checkbox mt-1'}
                    checked={record.attendance && record.attendance.isPlaying}
                    onChange={(e) => this_.playingView(record, e.target.checked, index, 'team1Players')}
                ></Checkbox>

                //     <span style={{ display: 'flex', justifyContent: 'center', width: '50%',cursor:'pointer' }}>
                //     <img className="dot-image"
                //         src={ AppImages.greyDot}
                //         alt="" width="12" height="12" />
                // </span>
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
                    className={record.lineup ? record.lineup.playing ? "checkbox-green-color-outline mt-1" : 'single-checkbox mt-1' : 'single-checkbox mt-1'}
                    checked={record.attendance && record.attendance.isPlaying}
                    onChange={(e) => this_.playingView(record, e.target.checked, index, 'team2Players')}
                ></Checkbox>

                //     <span style={{ display: 'flex', justifyContent: 'center', width: '50%',cursor:'pointer' }}>
                //     <img className="dot-image"
                //         src={ AppImages.greyDot}
                //         alt="" width="12" height="12" />
                // </span>
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
            liveStreamLink: null
        }
        this.umpireScore_View = this.umpireScore_View.bind(this)
        this.team_View = this.team_View.bind(this)
        this_ = this
    }

    componentDidMount() {
        let isLineUpEnable = null
        let match_status = null

        if (this.state.umpireKey == 'umpire') {
            const { lineupSelectionEnabled, status, id } = JSON.parse(getUmpireCompetitonData())
            isLineUpEnable = lineupSelectionEnabled
            match_status = status

            this.setState({ competitionId: id })
        } else {
            const { lineupSelectionEnabled, status, id } = JSON.parse(getLiveScoreCompetiton())
            isLineUpEnable = lineupSelectionEnabled
            match_status = status
            this.setState({ competitionId: id })

        }

        if (isLineUpEnable == 1) {
            this.setState({ isLineUp: 1 })
            this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId, 1)
        } else {
            this.setState({ isLineUp: 0 })
            this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId, 0)
        }


    }
    playingView(record, value, index, key) {
        this.props.changePlayerLineUpAction({ record: record, value: value, matchId: this.state.matchId, competitionId: this.state.competitionId, teamId: record.teamId, index: index, key: key })
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    deleteMatch = (matchId) => {
        this.props.liveScoreDeleteMatch(matchId)
        // this.setState({ deleteLoading: true })
    }

    showDeleteConfirm = (matchId) => {
        this_ = this
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
    }

    ////method to show modal view after click
    showModal = (data, isVideo) => {
        this.setState({
            visible: true,
            liveStreamLink:null
        });
    };

    ////method to hide modal view after ok click
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    ////method to hide modal view after click on cancle button
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };


    ///////view for breadcrumb
    headerView = () => {
        // const { match } = this.props.liveScoreMatchState.matchDetails
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match : []

        const matchDetails = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails : []

        const length = match ? match.length : 0
        let isMatchStatus = length > 0 ? match[0].matchStatus === "ENDED" ? true : false : false

        return (
            <div className="comp-player-grades-header-drop-down-view mb-5">
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <span className="form-heading pb-0" >{length >= 1 ? match ? match[0].team1.name : '' : ''}</span>
                            <span class="input-heading-add-another pt-2 pl-1 pr-1" > vs </span>
                            <span className="form-heading pb-0" > {length >= 1 ? match ? match[0].team2.name : '' : ''}</span>
                        </div>
                        <div className="col-sm-2" >
                            <span className='year-select-heading' >{'#' + this.state.matchId}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
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

                                    <Button onClick={() => this.showModal()} className="primary-add-comp-form" type="primary">
                                        + {AppConstants.addliveStream}
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
                                    <NavLink to={{
                                        pathname: "/liveScoreAddMatch",
                                        state: { isEdit: true, matchId: this.state.matchId, key: this.state.key, umpireKey: this.state.umpireKey }

                                    }}>
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.edit}
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
                                    {/* <Button onClick={() => this.showDeleteConfirm(this.state.matchId)} className="primary-add-comp-form" type="primary">
                                        {AppConstants.delete}
                                    </Button> */}

                                    <Tooltip
                                        style={{ height: '100%' }}
                                        onMouseEnter={() =>
                                            this.setState({
                                                toolTipVisible: isMatchStatus ? true : false,
                                            })
                                        }
                                        onMouseLeave={() =>
                                            this.setState({ toolTipVisible: false })
                                        }
                                        visible={this.state.toolTipVisible}
                                        title={ValidationConstants.matchDeleteMsg}
                                    >
                                        <Button
                                            // className="save-draft-text"
                                            // type="save-draft-text"
                                            className={isMatchStatus ? "disable-button-style" : "primary-add-comp-form"}
                                            type="primary"
                                            disabled={isMatchStatus}
                                            htmlType="submit"
                                            onClick={() => this.showDeleteConfirm(this.state.matchId)}
                                        //   onClick={() =>
                                        //     this.setState({ statusRefId: 1, buttonPressed: 'save' })
                                        //   }
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
    }


    //// Umpire & Score details

    umpireScore_View = () => {
        // const { match, umpires } = this.props.liveScoreMatchState.matchDetails
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match : []
        const umpires = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.umpires : []
        const length = match ? match.length : 0
        let UmpireData = isArrayNotEmpty(umpires) ? umpires : []

        let scoreType = ''
        if (this.state.umpireKey == 'umpire') {
            const { scoringType } = JSON.parse(getUmpireCompetitonData())
            scoreType = scoringType
        } else {
            const { scoringType } = JSON.parse(getLiveScoreCompetiton())
            scoreType = scoringType

        }

        return (

            <div className="comp-dash-table-view row mt-4">
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.umpireName}</span>
                    </div>
                    <div style={{ display:  "flex", alignContent: "center", flexDirection: 'column' }} >
                        {UmpireData.map((item, index) => (
                            <span className="desc-text-style side-bar-profile-data pt-2" >{`U${index + 1}`}: {item.umpireName}</span>
                        ))}
                    </div>

                    {/* <div style={{ display: "flex", alignContent: "center" }} >
                        {UmpireData.map((item) => (
                            <span className="inbox-name-text pt-2" >U2: {item.umpire2FullName}</span>
                        ))
                        }
                    </div> */}

                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.umpireClubName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center", flexDirection: 'column' }} >
                        {UmpireData.map((item) => (
                            // <span className="inbox-name-text pt-2" >{item.name}</span>
                            <>
                                {isArrayNotEmpty(item.competitionOrganisations) && item.competitionOrganisations.map((item) => (
                                    <span className="inbox-name-text pt-2" >{item.name}</span>
                                ))
                                }
                            </>
                        ))
                        }
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {UmpireData.map((item) => (
                            <span className="inbox-name-text pt-2" >{item.umpire2Club && item.umpire2Club.name}</span>
                        ))
                        }
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.scorerName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >S1: {length >= 1 ? match ? match[0].scorer1 ? match[0].scorer1.firstName + ' ' + match[0].scorer1.lastName : '' : '' : ''}</span>
                    </div>
                    {scoreType !== 'SINGLE' && <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >S2: {length >= 1 ? match ? match[0].scorer2 ? match[0].scorer2.firstName + ' ' + match[0].scorer2.lastName : '' : '' : ''}</span>
                    </div>}
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 mt-3">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.score}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {/* <span className="inbox-name-text pt-2" >{length >= 1 ? match ? match[0] ? match[0].team1Score + ' : ' + match[0].team2Score : '' : '' : ''}</span> */}
                        <span className="inbox-name-text pt-2" >{length >= 1 ? this.setMatchStatus(match) : ""}</span>
                    </div>
                </div>
            </div >

        )
    }

    teamPlayersStatus = (data) => {
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
                        width: 80,
                        render: () => (
                          <Select className="table-cell-select" size="small" style={{width: '100%'}}>
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
                        title: 'Secs',
                        key: 'sec1',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number" />
                        )
                    },
                ],
            },
            {
                title: 'Period 2',
                children: [
                    {
                        title: 'Position',
                        key: 'position2',
                        width: 80,
                        render: () => (
                          <Select className="table-cell-select" size="small" style={{width: '100%'}}>
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
                        title: 'Secs',
                        key: 'sec2',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number" />
                        )
                    },
                ],
            },
            {
                title: 'Period 3',
                children: [
                    {
                        title: 'Position',
                        key: 'position3',
                        width: 80,
                        render: () => (
                          <Select className="table-cell-select" size="small" style={{width: '100%', minHeight: 0}}>
                          </Select>
                        )
                    },
                    {
                        title: 'Goals',
                        key: 'goals3',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number"/>
                        )
                    },
                    {
                        title: 'Miss',
                        key: 'miss3',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number"/>
                        )
                    },
                    {
                        title: 'P Miss',
                        key: 'pmiss3',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number"/>
                        )
                    },
                    {
                        title: 'Secs',
                        key: 'sec3',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number"/>
                        )
                    },
                ],
            },
            {
                title: 'Period 4',
                children: [
                    {
                        title: 'Position',
                        key: 'position4',
                        width: 80,
                        render: () => (
                          <Select className="table-cell-select" size="small" style={{width: '100%'}}>
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
                        title: 'Secs',
                        key: 'sec4',
                        width: 60,
                        render: () => (
                          <Input size="small" type="number" />
                        )
                    },
                ],
            },
        ];

        return (
          <Table
            className="home-dashboard-table"
            columns={columns}
            dataSource={data}
            size="small"
            scroll={{x: '100%'}}
            pagination={false}
            rowKey={(record) => record.id}
          />
        )
    }

    //// Team details
    team_View = () => {
        // const { match, umpires } = this.props.liveScoreMatchState.matchDetails
        const match = this.props.liveScoreMatchState.matchDetails ? this.props.liveScoreMatchState.matchDetails.match : []
        const { team1Players, team2Players } = this.props.liveScoreMatchState
        console.log('team1Players', team1Players)
        console.log('team2Players', team2Players)
        const length = match ? match.length : 0
        return (
            <div className="match-details-rl-padding row mt-5">
                <div className="col-12" style={{ flexDirection: "column", display: "flex", alignContent: "center" }} >
                    <div className="" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
                        <img className="user-image" src={length >= 1 ? match ? match[0].team1.logoUrl : '' : ''} alt="" height="80" width="80" />
                        <span className="live-score-profile-user-name match-details-team-name">
                            {length >= 1 ? match ? match[0].team1.name : '' : ''}
                        </span>
                        <span className='year-select-heading' >{AppConstants.homeTeam}</span>
                    </div>

                    <div className="comp-dash-table-view mt-2">
                        <span className="live-score-profile-user-name ml-4">{AppConstants.players}</span>
                        <div>
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                {this.teamPlayersStatus(team1Players)}
                            </div>
                            {/* <Table className="home-dashboard-table pt-2" columns={columns} dataSource={team1players ? team1players : data} pagination={false}/> */}
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <Table
                                  className="home-dashboard-table pt-2"
                                  columns={this.state.isLineUp === 1 ? columnsTeam1 : columns}
                                  dataSource={team1Players}
                                  pagination={false}
                                  scroll={{x: '100%'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12" style={{ flexDirection: "column", display: "flex", alignContent: "center" }} >
                    <div className="" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
                        <img className="user-image" src={length >= 1 ? match ? match[0].team2.logoUrl : '' : ''} alt="" height="80" width="80" />
                        <span className="live-score-profile-user-name match-details-team-name">
                            {length >= 1 ? match ? match[0].team2.name : '' : ''}
                        </span>
                        <span className='year-select-heading' >{AppConstants.awayTeam}</span>
                    </div>

                    <div className="comp-dash-table-view mt-2">
                        <span className="live-score-profile-user-name ml-4">{AppConstants.players}</span>
                        <div>
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                {this.teamPlayersStatus(team2Players)}
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <Table
                                  className="home-dashboard-table pt-2"
                                  columns={this.state.isLineUp === 1 ? columnsTeam2 : columns}
                                  dataSource={team2Players}
                                  pagination={false}
                                  scroll={{x: '100%'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    setMatchStatus(match) {
        if (match[0].team1ResultId !== null) {
            if (match[0].team1ResultId === 4 || match[0].team1ResultId === 6 || match[0].team1ResultId === 6) {
                return "Forfeit"
            } else if (match[0].team1ResultId === 8 || match[0].team1ResultId === 9) {
                return "Abandoned"
            } else {
                return match[0].team1Score + ' : ' + match[0].team2Score
            }
        } else {
            return match[0].team1Score + ' : ' + match[0].team2Score
        }

        //    return record ?  record.team1ResultId == null ?   "abc" : record.team1ResultId === 4 || 5 || 6 ? "def" : record.matchStatus : record.matchStatus
    }

    onClickFunc() {

        if (this.state.liveStreamLink) {

            let body = {
                "id": this.state.matchId,

                "competitionId": this.state.competitionId,

                "livestreamURL": this.state.liveStreamLink
            }

            this.props.liveScoreAddLiveStreamAction({ body: body })
        }

        this.setState({ visible: false, liveStreamLink: '' })
    }

    ////modal view
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
                        paddingTop:24
                    }}
                >

                    <Button onClick={() => this.onClickFunc()} className="primary-add-comp-form" type="primary">
                        {AppConstants.save}
                    </Button>

                </div>
            </Modal>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>

                {
                    this.state.umpireKey ?
                        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                        :
                        <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                }

                {
                    this.state.umpireKey ?
                        <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"1"} />
                        :
                        <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={this.state.screenName == 'incident' ? '17' : "2"} />
                }
                <Loader visible={this.props.liveScoreMatchState.onLoad} />
                <Layout>
                    {this.headerView()}

                    <Content>
                        {this.umpireScore_View()}
                        {this.team_View()}
                        {this.ModalView()}
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
        liveScoreAddLiveStreamAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchState: state.LiveScoreMatchState,

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreMatchDetails);


