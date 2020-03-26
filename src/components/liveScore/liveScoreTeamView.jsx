import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Modal } from 'antd';
import './liveScore.css';
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTeamViewPlayerList, liveScoreDeleteTeam } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import moment from "moment";
import Loader from '../../customComponents/loader'

const { Content } = Layout;
const { confirm } = Modal;

////columns data
var _this;
const columns = [

    {
        title: 'Profile Picture',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        sorter: (a, b) => a.photoUrl.length - b.photoUrl.length,
        render: photoUrl =>
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
        render: (name, record) => {
            return <span style={{ color: '#ff8237' }}>{(record.firstName && record.lastName) && record.firstName + '' + record.lastName}</span>
        }
    },
    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
        sorter: (a, b) => a.dob.length - b.dob.length,
        render: (dob, record) => <span>{record.dateOfBirth ? moment(record.dateOfBirth).format('DD/MM/YYYY') : '    '}</span>
    },
    {
        title: 'Contact No.',
        dataIndex: 'number',
        key: 'number',
        sorter: (a, b) => a.number.length - b.number.length,
        render: (dob, record) => <span>{record.phoneNumber ? record.phoneNumber : ''}</span>
    },
];


class LiveScoreTeamView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord : null : null,
            // teamId: props.location.state ? props.location.state.teamId : null,
            teamId: props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord.id : null : null,
            screenName: this.props.location.state ? this.props.location.state.screenName : null
        }
        console.log(props.location, 'props.location.state@@@@')
        _this = this
    }

    componentDidMount() {
        const { teamId } = this.props.location.state
        console.log(this.state.teamId, 'this.state.teamId')
        let teamIds = this.state.teamId ? this.state.teamId : teamId
        this.props.getTeamViewPlayerList(teamIds)
    }
    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreTeamState != this.props.liveScoreTeamState) {
            console.log('$$$$$', this.props.liveScoreTeamState)
        }
    }
    ////view for profile image
    profileImageView = () => {
        // let data = this.state.data 
        let data = this.props.location.state ? this.props.location.state.tableRecord ? this.props.location.state.tableRecord : null : null
        console.log(this.state.data, 'this.state.data')
        const { teamData, managerData, } = this.props.liveScoreTeamState
        const { name, logoUrl } = teamData ? teamData : ''
        const { mobileNumber, email } = managerData ? managerData : ''
        console.log('76', name, mobileNumber, email, logoUrl)
        if (this.props.liveScoreTeamState.onLoad) {
            return <Loader visible={true} />
        }
        return (
            <div className="fluid-width mt-2">
                {/* <img className="live-score-user-image" src={'https://www.si.com/specials/fittest50-2017/img/men/ngolo_kante.jpg'} alt="" height="80" width="80" />
                <span className="live-score-profile-user-name">WSA 1</span>
                <span className="live-score-profile-user-name">{AppConstants.teamManagers}</span> */}

                <div className='profile-image-view mr-5' >
                    {/* <span className="user-contact-heading">{AppConstants.teamManagers}</span> */}
                    {/* <img className="live-score-user-image" src={'https://www.si.com/specials/fittest50-2017/img/men/ngolo_kante.jpg'} alt="" height="80" width="80" /> */}

                    {
                        this.props.liveScoreTeamState && this.props.liveScoreTeamState.teamData ?
                            <img className="live-score-user-image" src={logoUrl ? logoUrl : ''} alt="" height="80" width="80" />
                            :
                            <span className="user-contact-heading">{'No Image'}</span>
                    }


                    <span className="user-contact-heading">{name ? name : ''}</span>
                </div>

                <div className="live-score-profile-img-view">
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.name}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{name ? name : ''}</span>
                    </div>

                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.email}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{email ? email : ""}</span>
                    </div>

                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.contactNumber}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{mobileNumber ? mobileNumber : ''}</span>
                    </div>

                </div>
            </div>
        )
    }

    addPlayerView() {
        const { teamData, managerData, } = this.props.liveScoreTeamState
        const { name, logoUrl, id } = teamData ? teamData : ''
        const { mobileNumber, email } = managerData ? managerData : ''
        return (
            <div className="row ">
                <div className="col-sm" >
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.players}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end", }}>
                    <div
                        className="comp-dashboard-botton-view-mobile"
                    >
                        <NavLink to={{
                            pathname: '/liveScoreAddPlayer',
                            state: { ...this.props.location.state, screenName: this.state.screenName }
                        }}>
                            <Button className="primary-add-comp-form" type="primary">
                                + {AppConstants.addPlayer}
                            </Button>
                        </NavLink>
                    </div>


                </div>
            </div>
        )
    }

    deleteTeam = (teamId) => {
        this.props.liveScoreDeleteTeam(teamId)
        // this.setState({ deleteLoading: true })
    }

    showDeleteConfirm = (teamId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this team?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteTeam(teamId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="row mt-5">

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
                                    justifyContent: "flex-end",
                                }}
                            >
                                <NavLink to={{
                                    pathname: "/liveScoreAddTeam",
                                    state: { isEdit: true, teamId: this.state.teamId }
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

                                <Button onClick={() => this.showDeleteConfirm(this.state.teamId)} className="primary-add-comp-form" type="primary">
                                    {AppConstants.delete}
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            // </div>
        )
    }

    //////// tableView 
    tableView = () => {
        const { playerList } = this.props.liveScoreTeamState
        console.log("playerList", playerList)
        return (
            <div >
                <div className="inside-table-view mt-4" >
                    {this.addPlayerView()}

                    <div className="table-responsive home-dash-table-view mt-3">
                        <Table
                            //  loading={this.props.liveScoreTeamState.onLoad} 
                            className="home-dashboard-table" columns={columns}
                            dataSource={playerList} pagination={false} />
                    </div>

                </div>
            </div >
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={this.state.screenName == 'fromMatchList' ? '2' : "3"} />
                <Loader visible={this.props.liveScoreTeamState.onLoad_2} />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width" >
                            <div className="row" >
                                <div className="col-sm-3" style={{ marginBottom: "6%" }} >
                                    {this.profileImageView()}
                                </div>
                                <div className="col-sm-9" style={{ backgroundColor: "#f7fafc", }}>
                                    {this.headerView()}
                                    {this.tableView()}
                                </div>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div >
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getTeamViewPlayerList, liveScoreDeleteTeam }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreTeamView));

