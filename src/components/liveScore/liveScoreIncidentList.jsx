import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Button, Table, Breadcrumb, Pagination, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { liveScoreIncidentList } from '../../store/actions/LiveScoreAction/liveScoreIncidentAction'
import { liveScore_MatchFormate } from '../../themes/dateformate'
import history from "../../util/history";
import { getLiveScoreCompetiton, getUmpireCompetitonData } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";
import ValidationConstants from "../../themes/validationConstant";

const { Content } = Layout;
let this_Obj = null;

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = "ASC";
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === "ASC") {
        sortOrder = "DESC";
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === "DESC") {
        sortBy = sortOrder = null;
    }

    this_Obj.setState({ sortBy, sortOrder });
    const { id } = JSON.parse(getLiveScoreCompetiton())
    let { searchText, limit, offset } = this_Obj.state
    this_Obj.props.liveScoreIncidentList(id, searchText, limit, offset, sortBy, sortOrder);
}

const columns = [
    {
        title: 'Date',
        dataIndex: 'incidentTime',
        key: 'incidentTime',
        sorter: true,
        onHeaderCell: () => listeners("date"),
        render: (incidentTime, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record, screenName: 'incident', umpireKey: this_Obj.props.liveScoreIncidentState.umpireKey }
            }}>
                <span className="input-heading-add-another pt-0">{liveScore_MatchFormate(incidentTime)}</span>
            </NavLink>
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: true,
        onHeaderCell: () => listeners("matchId"),
        render: (matchId, record) =>
            <NavLink to={{
                pathname: "/liveScoreMatchDetails",
                state: { matchId: matchId, screenName: 'incident', umpireKey: this_Obj.props.liveScoreIncidentState.umpireKey }
            }}>
                <span className="input-heading-add-another pt-0">{matchId}</span>
            </NavLink>
    },
    {
        title: 'Player ID',
        dataIndex: 'incidentPlayers',
        key: 'incident Players',
        render: (incidentPlayers, record) =>
            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item, index) => (
                <span onClick={() => this_Obj.checkUserId(item)} key={`playerId${index}` + item.playerId} style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{item.playerId}</span>
            ))
    },
    {
        title: 'First Name',
        dataIndex: 'incidentPlayers',
        key: 'Incident Players First Name',
        sorter: true,
        onHeaderCell: () => listeners("firstName"),
        render: (incidentPlayers, record) =>
            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item, index) => (
                <span onClick={() => this_Obj.checkUserId(item)} key={`playerFirstName${index}` + item.playerId} style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{item.player.firstName}</span>
            ))
    },
    {
        title: 'Last Name',
        dataIndex: 'incidentPlayers',
        key: 'Incident Players Last Name',
        sorter: true,
        onHeaderCell: () => listeners("lastName"),
        render: (incidentPlayers, record) =>
            isArrayNotEmpty(incidentPlayers) && incidentPlayers.map((item, index) => (
                <span onClick={() => this_Obj.checkUserId(item)} key={`playerLastName${index}` + item.playerId} style={{ color: '#ff8237', cursor: 'pointer' }} className="desc-text-style side-bar-profile-data" >{item.player.lastName}</span>
            ))
    },
    {
        title: 'Type',
        dataIndex: 'incidentType',
        key: 'incidentType',
        render: (incidentType, record) =>
            <span >{incidentType.name}</span>,
        sorter: true,
        onHeaderCell: () => listeners("type"),
    },
];

class LiveScoreIncidentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            offset: 0,
            limit: 10,
            sortBy: null,
            sortOrder: null,
            screenName: props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null,
        };
        this_Obj = this
    }

    componentDidMount() {

        const { incidentListActionObject, umpireKey } = this.props.liveScoreIncidentState
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder

        if (umpireKey) {
            if (getUmpireCompetitonData()) {
                const { id } = JSON.parse(getUmpireCompetitonData())
                if (incidentListActionObject) {
                    let offset = incidentListActionObject.offset
                    let searchText = incidentListActionObject.search
                    sortBy = incidentListActionObject.sortBy
                    sortOrder = incidentListActionObject.sortOrder
                    this.setState({ sortBy, sortOrder, offset, searchText })
                    this.props.liveScoreIncidentList(id, searchText, 10, offset, sortBy, sortOrder);
                } else {
                    let { searchText, limit, offset, sortBy, sortOrder } = this.state
                    this.props.liveScoreIncidentList(id, searchText, limit, offset, sortBy, sortOrder);
                }
            } else {
                history.push('/umpireDashboard')
            }

        } else {
            if (getLiveScoreCompetiton()) {
                const { id } = JSON.parse(getLiveScoreCompetiton())
                if (incidentListActionObject) {
                    let offset = incidentListActionObject.offset
                    let searchText = incidentListActionObject.search
                    sortBy = incidentListActionObject.sortBy
                    sortOrder = incidentListActionObject.sortOrder
                    this.setState({ sortBy, sortOrder, offset, searchText })
                    this.props.liveScoreIncidentList(id, searchText, 10, offset, sortBy, sortOrder);
                } else {
                    let { searchText, limit, offset, sortBy, sortOrder } = this.state
                    this.props.liveScoreIncidentList(id, searchText, limit, offset, sortBy, sortOrder);
                }
            } else {
                history.push('/liveScoreCompetitions')
            }
        }
    }

    checkUserId = (record) => {
        if (record.player.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        } else {
            history.push("/userPersonal", { userId: record.player.userId, screenKey: "livescore", screen: "/liveScoreIncidentList" })
        }
    }

    // on change search text
    onChangeSearchText = (e) => {
        const { umpireKey } = this.props.liveScoreIncidentState
        let compId = null
        if (umpireKey) {
            const { id } = JSON.parse(getUmpireCompetitonData())
            compId = id
        } else {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            compId = id
        }


        let { limit, sortBy, sortOrder } = this.state
        this.setState({ searchText: e.target.value, offset: 0 })
        if (e.target.value === null || e.target.value === "") {
            this.props.liveScoreIncidentList(compId, e.target.value, limit, 0, sortBy, sortOrder);
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {

        const { umpireKey } = this.props.liveScoreIncidentState
        let compId = null
        if (umpireKey) {
            const { id } = JSON.parse(getUmpireCompetitonData())
            compId = id
        } else {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            compId = id
        }

        this.setState({ offset: 0 })
        var code = e.keyCode || e.which;
        let { limit, sortBy, sortOrder } = this.state
        if (code === 13) { //13 is the enter keycode
            this.props.liveScoreIncidentList(compId, e.target.value, limit, 0, sortBy, sortOrder);
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        this.setState({ offset: 0 })
        const { umpireKey } = this.props.liveScoreIncidentState
        let compId = null
        if (umpireKey) {
            const { id } = JSON.parse(getUmpireCompetitonData())
            compId = id
        } else {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            compId = id
        }

        let { searchText, limit, sortBy, sortOrder } = this.state
        if (searchText === null || searchText === "") {
        } else {
            this.props.liveScoreIncidentList(compId, searchText, limit, 0, sortBy, sortOrder);
        }
    }

    handleTableChange = (page) => {
        let offset = page ? 10 * (page - 1) : 0;
        let { searchText, limit, sortBy, sortOrder } = this.state
        this.setState({ offset: offset })
        const { umpireKey } = this.props.liveScoreIncidentState
        let compId = null
        if (umpireKey) {
            const { id } = JSON.parse(getUmpireCompetitonData())
            compId = id
        } else {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            compId = id
        }
        this.props.liveScoreIncidentList(compId, searchText, limit, offset, sortBy, sortOrder);
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.incidents}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">
                            {/* <div className="col-sm">
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
                                    <NavLink to="/liveScoreAddIncident">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addIncident}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div> */}
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
                                    <Button className="primary-add-comp-form" type="primary">
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
                                    <NavLink to="/liveScoreIncidentImport">
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
                {/* search box */}
                <div className="col-sm pt-4 ml-3 " style={{ display: "flex", justifyContent: 'flex-end' }}>
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

    ////////tableView view for Umpire list
    tableView = () => {
        const { onLoad, liveScoreIncidentResult, liveScoreIncidentTotalCount, liveScoreIncidentCurrentPage } = this.props.liveScoreIncidentState;
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad === true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={liveScoreIncidentResult}
                        pagination={false}
                        rowKey={(record, index) => "incident" + record.id + index}
                    />
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
                        }}
                    />
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            current={liveScoreIncidentCurrentPage}
                            total={liveScoreIncidentTotalCount}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { umpireKey } = this.props.liveScoreIncidentState
        let screen = this.props.location.state ? this.props.location.state.screenName ? this.props.location.state.screenName : null : null
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>


                {
                    umpireKey ?
                        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                        :
                        <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                }

                {
                    umpireKey ?
                        <InnerHorizontalMenu menu="umpire" umpireSelectedKey={screen == 'umpireList' ? "2" : "1"} />
                        :
                        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={"17"} />
                }


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
    return bindActionCreators({ liveScoreIncidentList }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreIncidentState: state.LiveScoreIncidentState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreIncidentList);
