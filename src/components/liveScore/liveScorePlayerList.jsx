import React, { Component } from "react";
import { Layout, Button, Table, Pagination, Spin, Alert } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { liveScorePlayerListAction } from "../../store/actions/LiveScoreAction/liveScorePlayerAction"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import { liveScore_formateDate } from '../../themes/dateformate'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'

const { Content } = Layout;

const columns = [

    {
        title: 'Profile Picture',
        dataIndex: 'profilePicture',
        key: 'profilePicture',
        sorter: (a, b) => a.profilePicture.length - b.profilePicture.length,
        render: (profilePicture) => {
            return (
                profilePicture ? <img className="live-score-user-image" src={profilePicture} alt="" height="70" width="70" /> : <span>{AppConstants.noImage}</span>
            )
        }

    },
    {
        title: 'Player Id',
        dataIndex: 'playerId',
        key: 'playerId',
        sorter: (a, b) => a.playerId.length - b.playerId.length,

    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstsName',
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: record }
            }}>
                <span class="input-heading-add-another pt-0" >{firstName}</span>
            </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.length - b.lastName.length,
        render: (lastName, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: record }
            }}>
                <span class="input-heading-add-another pt-0" >{lastName}</span>
            </NavLink>
    },
    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
        // sorter: (a, b) => a.dob.length - b.dob.length,
        render: (dob) =>
            <span  >{dob ? liveScore_formateDate(dob) : ""}</span>
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => a.division.length - b.division.length,
        render: (division) =>
            <span  >{division.name}</span>
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.length - b.team.length,
        render: (team, record) =>
        <NavLink to={{
            pathname: "/liveScoreTeamView",
            state: { tableRecord: record, screenName: 'fromPlayerList' }
        }} > 
            <span class="input-heading-add-another pt-0" >{team.name}</span>
            </NavLink>
    },
    {
        title: 'Contact No',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        // sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
    },

];


class LiveScorePlayerList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // let competitionId = 
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScorePlayerListAction(id)
        } else {
            history.push('/')
        }

    }

    ////////form content view
    contentView = () => {
        let { result } = this.props.liveScorePlayerState

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScorePlayerState.onLoad == true && true} className="home-dashboard-table" columns={columns} dataSource={result} pagination={false} />
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
                            defaultCurrent={3}
                            total={8}
                        // onChange={this.handleTableChange}
                        />
                    </div>
                </div>
            </div>
        )
    }

    ///////view for breadcrumb
    headerView = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <span className="form-heading">
                                {AppConstants.palyerList}
                            </span>
                        </div>
                        <div className="col-sm"
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-end"
                            }}>
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
                                        <NavLink to={`/liveScoreAddPlayer`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addPlayer}
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
                                        <Button href={AppConstants.exportUrl + id} className="primary-add-comp-form" type="primary">
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
                                        <NavLink to={`/liveScorerPlayerImport`} className="text-decoration-none">
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
            </div >
        );
    };

    loaderView() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="small" tip="Loading..." />
                {/* <Spin size="small" />
                <Spin />
                <Spin size="large" /> */}
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick ={()=>history.push("./liveScoreCompetitions")}/>
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"7"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {/* {this.props.liveScorePlayerState.onLoad == true ? this.loaderView() : this.contentView()} */}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScorePlayerListAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScorePlayerState: state.LiveScorePlayerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((LiveScorePlayerList));

