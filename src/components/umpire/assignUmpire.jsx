import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Layout, Table, Pagination, Modal } from 'antd';

import AppConstants from 'themes/appConstants';
import AppColor from 'themes/appColor';
import { liveScore_MatchFormate } from 'themes/dateformate';
import { getUmpireCompetiton, getUmpireCompetitonData } from 'util/sessionStorage';
import history from 'util/history';
import { isArrayNotEmpty } from 'util/helpers';
import { umpireCompetitionListAction } from 'store/actions/umpireAction/umpireCompetetionAction';
import {
    getAssignUmpireListAction,
    assignUmpireAction,
    unassignUmpireAction,
    setAssignUmpireListPageSizeAction,
    setAssignUmpireListPageNumberAction,
} from 'store/actions/umpireAction/assignUmpireAction';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';

const { Content } = Layout;
// const { Option } = Select;
const { confirm } = Modal;

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
            return 'Unassign'
        } else {
            return 'Assign'
        }
    } else {
        return 'Assign'
    }
}

////check for roster status so that bass the color of the umpire name
function checkUmpireRosterStatus(data) {
    let rosterStatus = data ? data.rosterStatus : 'N/A'
    if (rosterStatus === 'Yes') {
        return AppColor.umpireTextGreen;
    }
    if (rosterStatus === 'No') {
        return AppColor.umpireTextRed;
    } else {
        return AppColor.standardTxtColor
    }
}

const column = [
    {
        title: AppConstants.tableMatchID,
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, 'id'),
        render: (id) => <NavLink to={{
            pathname: '/matchDayMatchDetails',
            state: { matchId: id, umpireKey: 'umpire', screenName: 'umpire' }
        }} >
            <span className="input-heading-add-another pt-0">{id}</span>
        </NavLink>
    },
    {
        title: AppConstants.startDate,
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, 'startTime'),
        render: (startTime) =>
            <span>{startTime ? liveScore_MatchFormate(startTime) : ''}</span>
    },
    {
        title: AppConstants.home,
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, 'team1'),
        render: (team1, record, index) => {
            return (
                <span>{team1.name}</span>
            )
        }
    },
    {
        title: AppConstants.away,
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, 'team2'),
        render: (team2, record, index) => {
            return (
                <span>{team2.name}</span>
            )
        }
    },
    {
        title: AppConstants.umpire1,
        dataIndex: 'user1',
        key: 'user1',
        width: '25%',
        render: (user1, record, index) => {
            let statusText = checkUmpireAssignStatus(user1)
            return (
                <div className="row d-flex justify-content-center">
                    <div className="col-sm d-flex justify-content-start">
                        <span className="pt-0" style={{ color: checkUmpireRosterStatus(user1) }}>
                            {user1 && (`${user1.firstName} ${user1.lastName}`)}
                        </span>
                    </div>
                    <div className="col-sm d-flex justify-content-end">
                        <span
                            style={{ textDecoration: 'underline' }}
                            onClick={() => this_obj.onChangeStatus(index, record, 'user1', statusText, user1)}
                            className="input-heading-add-another pt-0"
                        >
                            {statusText}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        title: AppConstants.umpire2,
        dataIndex: 'user2',
        key: 'user2',
        width: "25%",
        render: (user2, record, index) => {
            let statusText = checkUmpireAssignStatus(user2);
            return (
                <div className="row d-flex justify-content-center">
                    <div className="col-sm d-flex justify-content-start">
                        <span style={{ color: checkUmpireRosterStatus(user2) }} className="pt-0">
                            {user2 && (`${user2.firstName} ${user2.lastName}`)}
                        </span>
                    </div>
                    <div className="col-sm d-flex justify-content-end">
                        <span
                            style={{ textDecoration: 'underline' }}
                            onClick={() => this_obj.onChangeStatus(index, record, 'user2', statusText, user2)}
                            className="input-heading-add-another pt-0"
                        >
                            {statusText}
                        </span>
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
            userId : null
        };
        this_obj = this
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        
        let userId = this.props.location.state ? this.props.location.state.record ? this.props.location.state.record.id : 0 : 0;
        // let userId = localStorage.getItem("userId");
        this.setState({userId})
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                if (getUmpireCompetiton()) {
                    let compId = JSON.parse(getUmpireCompetiton())
                    firstComp = compId
                }
                let { assignUmpireListPageSize } = this.props.assignUmpireState;
                assignUmpireListPageSize = assignUmpireListPageSize ? assignUmpireListPageSize : 10;
                const body = {
                    paging: {
                        limit: assignUmpireListPageSize,
                        offset: 0
                    }
                }
                this.props.getAssignUmpireListAction(firstComp, body , this.state.userId)
                this.setState({ selectedComp: firstComp, loading: false })
            }
        }
    }

    ///on status change assign/unassign
    onChangeStatus(index, record, umpireKey, statusText, userData) {
        // let umpireRecord = this_obj.props.location.state && this_obj.props.location.state.record

        let umpireUserId = this_obj.props.location.state ? this_obj.props.location.state.record.id : 0
        let umpireName = this_obj.props.location.state ? this_obj.props.location.state.record.firstName + " " + this_obj.props.location.state.record.lastName : null
        let userId = localStorage.getItem("userId");
        const competition = JSON.parse(getUmpireCompetitonData());
        let rosterLocked = competition.recordUmpireType === "USERS" ? true : false
        let orgId = this.props.location.state ? this.props.location.state.record ? this.props.location.state.record.linkedEntity[0].entityId : null : null

        let assignBody = [{
            createdBy: parseInt(userId),
            id: null,
            matchId: record.id,
            organisationId: orgId,
            sequence: umpireKey == 'user1' ? 1 : 2,
            umpireName,
            umpireType: 'USERS',
            userId: umpireUserId,
        }];

        if (statusText === 'Assign') {
            if (umpireUserId == record?.user1?.id || umpireUserId == record?.user2?.id) {
                this.openModel(assignBody, index, umpireKey, rosterLocked)
            } else {
                this.props.assignUmpireAction(assignBody, index, umpireKey, rosterLocked)
            }
        }
        if (statusText === 'Unassign') {
            this.props.unassignUmpireAction(userData.rosterId, index, umpireKey, rosterLocked)
        }
    }

    openModel = (assignBody, index, umpireKey, rosterLocked) => {
        let this_ = this;
        confirm({
            title: AppConstants.umpireProceedConfirm,
            okText: AppConstants.ok,
            okType: AppConstants.primary,
            cancelText: AppConstants.cancel,
            onOk() {
                this_.props.assignUmpireAction(assignBody, index, umpireKey, rosterLocked, 'sameUmpire');
            },
            onCancel() {
                console.log('cancel');
            },
        });
    };

    onChangeComp(compID) {
        let { assignUmpireListPageSize } = this.props.assignUmpireState;
        assignUmpireListPageSize = assignUmpireListPageSize ? assignUmpireListPageSize : 10;
        const body = {
            paging: {
                limit: assignUmpireListPageSize,
                offset: 0,
            },
        };
        this.setState({ selectedComp: compID });
        this.props.getAssignUmpireListAction(compID, body , this.state.userId);
    }

    headerView = () => {
        // let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1 d-flex align-content-center">
                            <span className="form-heading">
                                {AppConstants.assignMatch}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        {/* <div className="mt-5"> */}
                        {/* <div className="w-100 d-flex flex-row align-items-center"
                        }}> */}
                        {/* <span className="year-select-heading">{AppConstants.competition}:</span>
                        <Select
                            className="year-select"
                            style={{ minWidth: 160 }}
                            onChange={(comp) => this.onChangeComp(comp)}
                            value={this.state.selectedComp}
                        >
                            {competition.map((item) => (
                                <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                            ))}
                        </Select> */}

                        {/* <div className="col-sm"> */}
                        <div className="reg-add-save-button">
                            <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => history.push('/umpire')}
                                className="input-heading-add-another"
                            >
                                {AppConstants.backToUmpire}
                            </span>
                        </div>
                        {/* </div> */}

                        {/* </div> */}
                    </div>
                </div>
            </div>
        );
    };

    handleShowSizeChange = async (page, pageSize) => {
        await this.props.setAssignUmpireListPageSizeAction(pageSize);
        this.handlePageChange(page);
    }

    /// Handle Page change
    handlePageChange = async (page) => {
        await this.props.setAssignUmpireListPageNumberAction(page);
        let { assignUmpireListPageSize } = this.props.assignUmpireState;
        assignUmpireListPageSize = assignUmpireListPageSize ? assignUmpireListPageSize : 10;
        let offset = page ? assignUmpireListPageSize * (page - 1) : 0;
        const body = {
            paging: {
                limit: assignUmpireListPageSize,
                offset,
            },
        };
        this.props.getAssignUmpireListAction(this.state.selectedComp, body , this.state.userId)
    }

    ////////tableView view for all the umpire assigned matches list
    tableView = () => {
        const { assignUmpireList, totalAssignUmpireCount, assignUmpireListCurrentPage, assignUmpireListPageSize, onLoad } = this.props.assignUmpireState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad && true}
                        className="home-dashboard-table"
                        columns={this.state.columns}
                        dataSource={assignUmpireList}
                        pagination={false}
                        rowKey={(record) => "assignUmpire" + record.id}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div className="comp-dashboard-botton-view-mobile d-flex justify-content-end w-100">
                        {/* <div className="col-sm">
                            <div className="reg-add-save-button">
                                <span onClick={() => history.push('/umpire')} className="input-heading-add-another pointer">
                                    {AppConstants.backToUmpire}
                                </span>
                            </div>
                        </div> */}
                        <div className="d-flex justify-content-end">
                            <Pagination
                                className="antd-pagination"
                                showSizeChanger
                                current={assignUmpireListCurrentPage}
                                defaultCurrent={assignUmpireListCurrentPage}
                                defaultPageSize={assignUmpireListPageSize}
                                total={totalAssignUmpireCount}
                                onChange={(page) => this.handlePageChange(page)}
                                onShowSizeChange={this.handleShowSizeChange}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="2" />
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
        setAssignUmpireListPageSizeAction,
        setAssignUmpireListPageNumberAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        assignUmpireState: state.AssignUmpireState,
        umpireCompetitionState: state.UmpireCompetitionState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignUmpire);
