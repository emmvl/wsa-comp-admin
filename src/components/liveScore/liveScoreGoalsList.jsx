import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Breadcrumb, Table, Pagination, Select, Button, Input } from 'antd';
import { SearchOutlined } from "@ant-design/icons";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { liveScoreGoalListAction } from '../../store/actions/LiveScoreAction/liveScoreGoalsAction'
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { liveScore_formateDateTime } from '../../themes/dateformate'
import { exportFilesAction } from "../../store/actions/appAction"
import { isArrayNotEmpty } from '../../util/helpers'

const { Content } = Layout;
const { Option } = Select;

var this_obj = null

//listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    this_obj.setState({ sortBy, sortOrder });

    let offset = 0
    this_obj.props.liveScoreGoalListAction(this_obj.state.competitionId, this_obj.state.filter, this_obj.state.searchText, offset, sortBy, sortOrder)
}

const columns1 = [
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Date',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('date'),
        // render: (startTime) => <span  >{liveScore_formateDateTime(startTime)}</span>
    },
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('team'),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: record }
            }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: record }
            }}>
                <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
    },
    {
        title: 'Position',
        dataIndex: 'gamePositionName',
        key: 'gamePositionName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('position'),
    },
    {
        title: 'Misses',
        dataIndex: 'miss',
        key: 'miss',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('misses'),
    },
    {
        title: 'Goals',
        dataIndex: 'goal',
        key: 'goal',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('goals'),
    },
    {
        title: 'Attempts',
        dataIndex: 'attempts',
        key: 'attempts',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Goals%',
        dataIndex: 'goal_percent',
        key: 'goal_percent',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('goalPercent'),
    },
]

const columns2 = [
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('team'),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => {
            return (
                <NavLink to={{
                    pathname: '/liveScorePlayerView',
                    state: { tableRecord: record }
                }}>
                    <span className="input-heading-add-another pt-0">{firstName}</span>
                </NavLink>
            )
        }
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) =>
            <NavLink to={{
                pathname: '/liveScorePlayerView',
                state: { tableRecord: record }
            }}>
                <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
    },
    {
        title: 'Position',
        dataIndex: 'gamePositionName',
        key: 'gamePositionName1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('position'),
    },
    {
        title: 'Misses',
        dataIndex: 'miss',
        key: 'miss1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('misses'),
    },
    {
        title: 'Goals',
        dataIndex: 'goal',
        key: 'goal1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('goals'),
    },
    {
        title: 'Attempts',
        dataIndex: 'attempts',
        key: 'attempts1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('attempts'),
    },
    {
        title: 'Goals%',
        dataIndex: 'goal_percent',
        key: 'goal_percent1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('goalPercent'),
    },
]

class LiveScoreGoalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            teamSelection: "WSA 1",
            selectStatus: "Select Status",
            filter: "By Match",
            competitionId: null,
            searchText: "",
            sortBy: null,
            sortOrder: null,
        }
        this_obj = this
    }

    async componentDidMount() {
        let { livescoreGoalActionObject } = this.props.liveScoreGoalState
        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.setState({ competitionId: id })
            if (id !== null) {
                let offset = 0
                if (livescoreGoalActionObject) {
                    offset = livescoreGoalActionObject.offset
                    let searchText = livescoreGoalActionObject.search
                    let sortBy = livescoreGoalActionObject.sortBy
                    let sortOrder = livescoreGoalActionObject.sortOrder
                    let goalType = livescoreGoalActionObject.goalType
                    await this.setState({ offset, searchText, sortBy, sortOrder, filter: goalType })
                    this.props.liveScoreGoalListAction(id, goalType, searchText, offset, sortBy, sortOrder)
                }
                else {
                    this.props.liveScoreGoalListAction(id, this.state.filter, this.state.searchText, offset)
                }
            } else {
                history.push('/liveScoreCompetitions')
            }
        } else {
            history.push('/liveScoreCompetitions')
        }
    }

    onExport = () => {
        let url = AppConstants.goalExport + this.state.competitionId + `&aggregate=${this.state.filter}`
        this.props.exportFilesAction(url)
    }

    // on change search text
    onChangeSearchText = (e) => {
        let { sortBy, sortOrder } = this.state
        this.setState({ searchText: e.target.value, offset: 0 })
        if (e.target.value === null || e.target.value === "") {
            let offset = 0
            this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, e.target.value, offset, sortBy, sortOrder)
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {
        this.setState({ offset: 0 })
        var code = e.keyCode || e.which;
        let { sortBy, sortOrder } = this.state
        if (code === 13) { //13 is the enter keycode
            let offset = 0
            this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, e.target.value, offset, sortBy, sortOrder)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        this.setState({ offset: 0 })
        let { sortBy, sortOrder } = this.state
        if (this.state.searchText === null || this.state.searchText === "") {
        }
        else {
            let offset = 0
            this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, this.state.searchText, offset, sortBy, sortOrder)
        }
    }

    onChangeFilter = (filter) => {
        let { sortBy, sortOrder } = this.state
        let offset = 0
        this.props.liveScoreGoalListAction(this.state.competitionId, filter, this.state.searchText, offset, sortBy, sortOrder)
        this.setState({ filter })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ alignSelf: 'center' }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.goalState}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm" style={{
                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}>
                        <div className="row">

                            <div className="col-sm">
                                <Select
                                    className="year-select reg-filter-select1"
                                    style={{ display: "flex", justifyContent: "flex-end", minWidth: 100 }}
                                    onChange={(filter) => this.onChangeFilter(filter)}
                                    value={this.state.filter}
                                >
                                    <Option value={AppConstants.ByMatch}>{AppConstants.ByMatch}</Option>
                                    <Option value={AppConstants.total}>{AppConstants.total}</Option>
                                </Select>
                            </div>
                            <div className="col-sm" style={{ display: "flex" }}>
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: '100%',
                                        display: "flex",
                                        flexDirection: "row",
                                        alignSelf: 'center',
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
                                        <div className="row">
                                            <div className="col-sm">
                                                <img
                                                    src={AppImages.export}
                                                    alt=""
                                                    height="12"
                                                    width="12"
                                                    style={{ marginRight: 5 }}
                                                />
                                                {AppConstants.export}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* search box */}
                <div className="col-sm pt-3 ml-3 " style={{ display: "flex", justifyContent: 'flex-end', }}>
                    <div className="comp-product-search-inp-width">
                        <Input
                            className="product-reg-search-input"
                            onChange={this.onChangeSearchText}
                            placeholder="Search..."
                            onKeyPress={this.onKeyEnterSearchText}
                            value={this.state.searchText}
                            prefix={
                                <SearchOutlined
                                    style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    onClick={this.onClickSearchIcon}
                                />
                            }
                            allowClear
                        />
                    </div>
                </div>
            </div>
        )
    }

    onPageChange(page) {
        let offset = page ? 10 * (page - 1) : 0;
        let { sortBy, sortOrder } = this.state
        this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, this.state.searchText, offset, sortBy, sortOrder)
    }

    ////////form content view
    contentView = () => {
        const { result, totalCount, currentPage } = this.props.liveScoreGoalState;
        let goalList = isArrayNotEmpty(result) ? result : [];

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreGoalState.onLoad === true && true}
                        className="home-dashboard-table"
                        columns={this.state.filter === "By Match" ? columns1 : columns2}
                        dataSource={goalList}
                        pagination={false}
                        rowKey={(record, index) => 'goalList' + index}
                    />
                </div>

                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: '100%',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }}>
                        <Pagination
                            className="antd-pagination"
                            defaultCurrent={currentPage}
                            total={totalCount}
                            onChange={(page) => this.onPageChange(page)} />
                    </div>
                </div>
            </div>
        )
    }

    /////// render function
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.shootingStats} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={"16"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreGoalListAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreGoalState: state.LiveScoreGoalState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreGoalList);


