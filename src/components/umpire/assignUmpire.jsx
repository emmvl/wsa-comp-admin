import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Select } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { liveScore_MatchFormate } from '../../themes/dateformate'
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from '../../util/helpers';
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import {
    getAssignUmpireListAction,
    assignUmpireAction,
    unassignUmpireAction,
} from "../../store/actions/umpireAction/assignUmpireAction";



const { Content } = Layout;
const { Option } = Select;

var this_obj = null

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

////check for the umpire assigned or not according to previous page umpire id
function checkUmpireAssignStatus(data) {
    let umpireUserId = this_obj.props.location.state ? this_obj.props.location.state.record.id : 0
    if (data) {
        if (data.id == umpireUserId) {
            return "Unassign"
        }
        else {
            return "Assign"
        }
    }
    else {
        return "Assign"
    }
}

////check for roster status so that bass the color of the umpire name
function checkUmpireRosterStatus(data) {
    let rosterStatus = data ? data.rosterStatus : "N/A"
    if (rosterStatus == "Yes") {
        return "green"
    }
    if (rosterStatus == "No") {
        return "red"
    }
    else {
        return "grey"
    }
}


const column = [

    {
        title: 'Match ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
        render: (id) => <NavLink to={{
            pathname: '/liveScoreMatchDetails',
            state: { matchId: id, umpireKey: 'umpire' }
        }} >
            <span class="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: 'Start Date',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime) =>
            <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        render: (team1, record, index) => {
            return (
                <span>{team1.name}</span>
            )
        }
    },

    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, "team2"),
        render: (team2, record, index) => {
            return (
                <span>{team2.name}</span>
            )
        }
    },
    {
        title: 'Umpire 1',
        dataIndex: 'user1',
        key: 'user1',
        width: "25%",
        render: (user1, record, index) => {
            let statusText = checkUmpireAssignStatus(user1)
            return (
                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
                        <span class="pt-0 "
                            style={{ color: checkUmpireRosterStatus(user1) }}
                        >{user1 && (user1.firstName + " " + user1.lastName)}</span>
                    </div>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ textDecoration: "underline" }}
                            onClick={() => this_obj.onChangeStatus(index, record, "user1", statusText, user1)}
                            class="input-heading-add-another pt-0" >{statusText}</span>
                    </div>
                </div>
            )
        }
    },
    {
        title: 'Umpire 2',
        dataIndex: 'user2',
        key: 'user2',
        width: "25%",
        render: (user2, record, index) => {
            let statusText = checkUmpireAssignStatus(user2)
            return (
                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
                        <span style={{ color: checkUmpireRosterStatus(user2) }}
                            class="pt-0 " >{user2 && (user2.firstName + " " + user2.lastName)}</span>
                    </div>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ textDecoration: "underline" }}
                            onClick={() => this_obj.onChangeStatus(index, record, "user2", statusText, user2)}
                            class="input-heading-add-another pt-0" >{statusText}</span>
                    </div>
                </div>
            )
        }
    }
]



class AssignUmpire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId: 0,
            columns: column,
            loading: false,
            selectedComp: null,
        };
        this_obj = this

    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }


    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                }
                const body = {
                    "paging": {
                        "limit": 10,
                        "offset": 0
                    }
                }
                this.props.getAssignUmpireListAction(firstComp, body)
                this.setState({ selectedComp: firstComp, loading: false })
            }
        }
    }

    ///on status change assign/unassign
    onChangeStatus(index, record, umpireKey, statusText, userData) {
        let umpireUserId = this_obj.props.location.state ? this_obj.props.location.state.record.id : 0
        let assignBody = {
            "matchId": record.id,
            "roleId": 15,
            "userId": umpireUserId,
            "rosterId": userData ? userData : null
        }
        if (statusText == "Assign") {
            this.props.assignUmpireAction(assignBody, index, umpireKey)
        }
        if (statusText == "Unassign") {
            this.props.unassignUmpireAction(userData.rosterId, index, umpireKey)
        }

    }
    onChangeComp(compID) {
        const body = {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.setState({ selectedComp: compID })
        this.props.getAssignUmpireListAction(compID, body)
    }

    ///////view for breadcrumb
    headerView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.assignMatch}
                            </span>
                        </div>
                    </div>
                    <div className="mt-5" style={{ display: "flex", justifyContent: 'space-between', }} >
                        {/* <div className="mt-5" > */}
                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50,
                        }} >
                            <span className='year-select-heading'>{AppConstants.competition}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(comp) => this.onChangeComp(comp)}
                                value={this.state.selectedComp}
                            >
                                {
                                    competition.map((item) => {
                                        return <Option value={item.id}>{item.longName}</Option>
                                    })
                                }

                            </Select>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        const body = {
            "paging": {
                "limit": 10,
                "offset": offset
            }
        }
        this.props.getAssignUmpireListAction(this.state.selectedComp, body)
    }

    ////////tableView view for all the umpire assigned matches list
    tableView = () => {
        const { assignUmpireList, totalAssignUmpireCount, onLoad } = this.props.assignUmpireState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad == true && true}
                        className="home-dashboard-table"
                        columns={this.state.columns}
                        dataSource={assignUmpireList}
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
                            justifyContent: "center"
                        }} >
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <span style={{ cursor: "pointer" }}
                                    onClick={() => history.push('/umpire')}
                                    className="input-heading-add-another">
                                    {AppConstants.backToUmpire}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Pagination
                                className="antd-pagination"
                                // current={1}
                                total={totalAssignUmpireCount}
                                onChange={(page) => this.handlePageChnage(page)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"2"} />
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


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAssignUmpireListAction,
        umpireCompetitionListAction,
        assignUmpireAction,
        unassignUmpireAction,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        assignUmpireState: state.AssignUmpireState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((AssignUmpire));

