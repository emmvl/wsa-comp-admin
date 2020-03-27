import React, { Component } from "react";
import { Layout, Button, Table, Modal } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { liveScoreDeleteMatch, liveScoreGetMatchDetailInitiate } from "../../store/actions/LiveScoreAction/liveScoreMatchAction";
import Loader from '../../customComponents/loader'
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreCompetiton } from '../../util/sessionStorage';

const { Content } = Layout;
const { confirm } = Modal;
const columns = [
    {
        title: 'Profile Picture',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        sorter: (a, b) => a.photoUrl.length - b.photoUrl.length,
        render: (photoUrl) =>
            // <img className="live-score-user-image" src={AppImages.playerDp} alt="" height="70" width="70" />
            photoUrl ?
                <img className="live-score-user-image" src={photoUrl} alt="" height="70" width="70" />
                :
                <span>{'No Image'}</span>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
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
        sorter: (a, b) => a.team.length - b.team.length,
        // render: (record) => <span class="input-heading-add-another pt-0" >{record.team.name}</span>
    },
    {
        title: 'Attended?',
        dataIndex: 'attended',
        key: 'attended',
        sorter: (a, b) => a.attended.length - b.attended.length,
        render: attended =>
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img className="dot-image"
                    src={attended ? AppImages.greenDot : AppImages.greyDot}
                    alt="" width="12" height="12" />
            </span>,
    },
];


class LiveScoreMatchDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team1: "WSA 1",
            team2: "WSA 2",
            matchId: this.props.location.state ? this.props.location.state.matchId : null
        }
        this.umpireScore_View = this.umpireScore_View.bind(this)
        this.team_View = this.team_View.bind(this)
    }

    componentDidMount() {
        // console.log(this.props.location.state.matchId)
        this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId)

    }
    componentDidUpdate(nextProps) {
        if (nextProps != this.props.liveScoreMatchState.matchDetails) {
        }
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
        let this_ = this
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

    ///////view for breadcrumb
    headerView = () => {
        const { match } = this.props.liveScoreMatchState.matchDetails
        const length = match ? match.length : 0
       
        return (
            <div className="comp-player-grades-header-drop-down-view mb-5">
                <div className="row">
                    <div>
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <span className="form-heading pb-0" >{length >= 1 ? match ? match[0].team1.name : '' : ''}</span>
                            <span class="input-heading-add-another pt-2 pl-1 pr-1" > vs </span>
                            <span className="form-heading pb-0" > {length >= 1 ? match ? match[0].team2.name : '' : ''}</span>
                        </div>
                        <div className="col-sm-2" >
                            <span className='year-select-heading' >{'#' + this.state.matchId}</span>
                        </div>
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
                                    <NavLink to={{
                                        pathname: "/liveScoreAddMatch",
                                        state: { isEdit: true, matchId: this.state.matchId }

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
                                    <Button onClick={() => this.showDeleteConfirm(this.state.matchId)} className="primary-add-comp-form" type="primary">
                                        {AppConstants.delete}
                                    </Button>

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
        const { match, umpires } = this.props.liveScoreMatchState.matchDetails
        const length = match ? match.length : 0
        let UmpireData = isArrayNotEmpty(umpires) ? umpires : []
        const { scoringType } = JSON.parse(getLiveScoreCompetiton())
     
        return (

            <div className="comp-dash-table-view row mt-5">
                <div className="col-sm">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.umpireName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {/* <span className="inbox-name-text pt-2" >{'U1: '}</span> */}
                        {UmpireData.map((item) => (
                            <span className="inbox-name-text pt-2" >U1: {item.umpire1FullName}</span>
                        ))
                        }

                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {/* <span className="inbox-name-text pt-2" >{'U2: '}</span> */}
                        {UmpireData.map((item) => (
                            <span className="inbox-name-text pt-2" >U2: {item.umpire2FullName}</span>
                        ))
                        }
                    </div>
                </div>
                <div className="col-sm">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.umpireClubName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {UmpireData.map((item) => (
                            <span className="inbox-name-text pt-2" >{item.umpire1Club.name}</span>
                        ))
                        }
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        {UmpireData.map((item) => (
                            <span className="inbox-name-text pt-2" >{item.umpire2Club.name}</span>
                        ))
                        }
                    </div>
                </div>
                <div className="col-sm">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.scorerName}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >S1: {length >= 1 ? match ? match[0].scorer1 ? match[0].scorer1.firstName + ' ' + match[0].scorer1.lastName : '' : '' : ''}</span>
                    </div>
                 {  scoringType !== 'SINGLE' &&   <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >S2: {length >= 1 ? match ? match[0].scorer2 ? match[0].scorer2.firstName + ' ' + match[0].scorer2.lastName : '' : '' : ''}</span>
                    </div>}
                </div>
                <div className="col-sm">
                    <div className="match-score-detail">
                        <span className="event-time-start-text" >{AppConstants.score}</span>
                    </div>
                    <div style={{ display: "flex", alignContent: "center" }} >
                        <span className="inbox-name-text pt-2" >{length >= 1 ? match ? match[0] ? match[0].team1Score + ' : ' + match[0].team2Score : '' : '' : ''}</span>
                    </div>
                </div>
            </div >

        )
    }


    //// Team details 
    team_View = () => {
        const { match, umpires } = this.props.liveScoreMatchState.matchDetails
        const { team1Players, team2Players } = this.props.liveScoreMatchState
        const length = match ? match.length : 0
        console.log(this.props.liveScoreMatchState, 'team1players')

        return (
            <div className="match-details-rl-padding row mt-5">
                <div className="col-sm" style={{ flexDirection: "column", display: "flex", alignContent: "center" }} >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
                        <img className="live-score-user-image" src={length >= 1 ? match ? match[0].team1.logoUrl : '' : ''} alt="" height="80" width="80" />
                        <span className="live-score-profile-user-name">{length >= 1 ? match ? match[0].team1.name : '' : ''}</span>
                        <span className='year-select-heading' >{AppConstants.homeTeam}</span>
                    </div>

                    <div className="comp-dash-table-view mt-2">
                        <span className="live-score-profile-user-name">{AppConstants.players}</span>
                        <div>
                            {/* <Table className="home-dashboard-table pt-2" columns={columns} dataSource={team1players ? team1players : data} pagination={false}/> */}
                            <Table className="home-dashboard-table pt-2" columns={columns} dataSource={team1Players} pagination={false} />
                        </div>
                    </div>
                </div>
                <div className="col-sm" style={{ flexDirection: "column", display: "flex", alignContent: "center" }} >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
                        <img className="live-score-user-image" src={length >= 1 ? match ? match[0].team2.logoUrl : '' : ''} alt="" height="80" width="80" />
                        <span className="live-score-profile-user-name">{length >= 1 ? match ? match[0].team2.name : '' : ''}</span>
                        <span className='year-select-heading' >{AppConstants.awayTeam}</span>
                    </div>

                    <div className="comp-dash-table-view mt-2">
                        <span className="live-score-profile-user-name">{AppConstants.players}</span>
                        <div>
                            <Table className="home-dashboard-table pt-2" columns={columns} dataSource={team2Players} pagination={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"2"} />
                <Loader visible={this.props.liveScoreMatchState.onLoad} />
                <Layout>
                    {this.headerView()}

                    <Content>
                        {this.umpireScore_View()}
                        {this.team_View()}
                    </Content>
                </Layout>
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreDeleteMatch,
        liveScoreGetMatchDetailInitiate
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchState: state.LiveScoreMatchState,

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreMatchDetails);


