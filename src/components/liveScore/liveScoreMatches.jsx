import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavLink } from "react-router-dom";
import { Input, Layout, message, Breadcrumb, Button, Table, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "./liveScore.css";
import { isArrayNotEmpty, teamListDataCheck } from "../../util/helpers";
import history from "../../util/history";
import { getLiveScoreCompetiton, getUmpireCompetitonData, setOwn_competition, setGlobalYear } from "../../util/sessionStorage";
import { liveScore_MatchFormate } from "../../themes/dateformate";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { exportFilesAction } from "../../store/actions/appAction";
import { liveScoreMatchListAction, changeMatchBulkScore, bulkScoreUpdate, onCancelBulkScoreUpdate, setPageNumberAction, setPageSizeAction } from "../../store/actions/LiveScoreAction/liveScoreMatchAction";
import { getLiveScoreDivisionList } from "../../store/actions/LiveScoreAction/liveScoreDivisionAction";
import { liveScoreRoundListAction } from "../../store/actions/LiveScoreAction/liveScoreRoundAction";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import { checkLivScoreCompIsParent } from "../../util/permissions";

const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (_this.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    _this.setState({ sortBy, sortOrder });
    let { liveScoreMatchListPageSize } = _this.props.liveScoreMatchListState;
    liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
    _this.props.liveScoreMatchListAction(_this.state.competitionId, 1, _this.state.offset, liveScoreMatchListPageSize, _this.state.searchText, _this.state.selectedDivision === 'All' ? null : _this.state.selectedDivision, _this.state.selectedRound === 'All' ? null : _this.state.selectedRound, undefined, sortBy, sortOrder, _this.state.competitionOrganisationId);
}

var _this = null
function setMatchResult(record) {
    if (record.team1ResultId !== null) {
        if (record.team1ResultId === 4 || record.team1ResultId === 6 || record.team2ResultId === 6 || record.team2ResultId === 4) {
            return "Forfeit";
        } else if (record.team1ResultId === 8 || record.team1ResultId === 9) {
            return "Abandoned";
        } else {
            return record.team1Score + " : " + record.team2Score;
        }
    } else {
        return record.team1Score + " : " + record.team2Score;
    }
}

function setMatchBulkScore(record) {
    if (record.team1ResultId !== null) {
        if (record.team1ResultId === 4 || record.team1ResultId === 6 || record.team1ResultId === 6) {
            return true;
        } else if (record.team1ResultId === 8 || record.team1ResultId === 9) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getVenueName(data) {
    let venue_name = "";
    if (data.venue.shortName) {
        venue_name = data.venue.shortName + " - " + data.name;
    } else {
        venue_name = data.venue.name + " - " + data.name;
    }

    return venue_name;
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: 'Match ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (id) => {
            return (
                _this.onMatchClick(id, '/matchDayMatchDetails')
            )
        }
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (startTime) => <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team1, record) => teamListDataCheck(team1.id, _this.state.liveScoreCompIsParent, record, _this.state.competitionOrganisationId) ?
            (
                <NavLink
                    to={{
                        pathname: '/matchDayTeamView',
                        state: { tableRecord: team1, screenName: 'fromMatchList' }
                    }}
                >
                    <span className="input-heading-add-another pt-0">{team1.name}</span>
                </NavLink>
            ) : (


                <span>{team1.name}</span>
            )
    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team2, record) => teamListDataCheck(team2.id, _this.state.liveScoreCompIsParent, record, _this.state.competitionOrganisationId) ? (
            <NavLink
                to={{
                    pathname: '/matchDayTeamView',
                    state: { tableRecord: team2, screenName: 'fromMatchList' }
                }}
            >
                <span className="input-heading-add-another pt-0">{team2.name}</span>
            </NavLink>
        ) : (
                <span>{team2.name}</span>
            )
    },
    {
        title: 'Venue',
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        // render: (venueCourt, record) => <span>{venueCourt.venue.shortName + " - " + venueCourt.name}</span>
        render: (venueCourt, record) => <span>{getVenueName(venueCourt)}</span>
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (division) => <span>{division.name}</span>
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        // render: (score, records) => <span nowrap>{setMatchResult(records)}</span>
        render: (score, records, index) => {
            return (
                _this.scoreView(score, records, index)
            )
        }
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Match Duration',
        dataIndex: 'matchDuration',
        key: 'matchDuration',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Main Break',
        dataIndex: 'mainBreakDuration',
        key: 'mainBreakDuration',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Quarter Break',
        dataIndex: 'qtrBreak',
        key: 'qtrBreak',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
];

class LiveScoreMatchesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId: null,
            searchText: "",
            umpireKey: (this.props.location && this.props.location.state) ? this.props.location.state.umpireKey : null,
            selectedDivision: 'All',
            selectedRound: 'All',
            isBulkUpload: false,
            isScoreChanged: false,
            onScoreUpdate: false,
            sortBy: null,
            sortOrder: null,
            sourceIdAvailable: false,
            liveScoreCompIsParent: false,
            competitionOrganisationId: 0
        }
        _this = this
    }

    async componentDidMount() {
        this.setLivScoreCompIsParent()
        let matchListActionObject = this.props.liveScoreMatchListState.matchListActionObject
        let selectedDivision = this.state.selectedDivision
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (matchListActionObject) {
            let offset = matchListActionObject.offset
            let searchText = matchListActionObject.search
            selectedDivision = matchListActionObject.divisionId ? matchListActionObject.divisionId : "All"
            let selectedRound = matchListActionObject.roundName ? matchListActionObject.roundName : "All"
            sortBy = matchListActionObject.sortBy
            sortOrder = matchListActionObject.sortOrder
            await this.setState({ offset, searchText, selectedDivision, selectedRound, sortBy, sortOrder })
            let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
            liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
            page = Math.floor(offset / liveScoreMatchListPageSize) + 1;
        }

        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                const { id, sourceId, competitionOrganisation } = JSON.parse(getUmpireCompetitonData())
                let compOrg = competitionOrganisation ? competitionOrganisation.id : 0;
                this.setState({ competitionId: id, sourceIdAvailable: sourceId ? true : false, competitionOrganisationId: compOrg })
                this.handleMatchTableList(page, id, compOrg)
            } else {
                history.push("/matchDayCompetitions")
            }
        } else {
            if (getLiveScoreCompetiton()) {
                const { id, sourceId, competitionOrganisation } = JSON.parse(getLiveScoreCompetiton())
                this.setState({ competitionId: id, sourceIdAvailable: sourceId ? true : false, competitionOrganisationId: competitionOrganisation ? competitionOrganisation.id : 0 })
                this.handleMatchTableList(page, id, sortBy, sortOrder, competitionOrganisation ? competitionOrganisation.id : 0)
                this.props.getLiveScoreDivisionList(id)
                this.props.liveScoreRoundListAction(id, selectedDivision === 'All' ? '' : selectedDivision)
            } else {
                history.push("/matchDayCompetitions")
            }
        }


    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreMatchListState !== this.props.liveScoreMatchListState) {
            if (nextProps.liveScoreMatchListState.onLoad === false && this.state.onScoreUpdate === true) {
                this.setState({ isBulkUpload: false, onScoreUpdate: false })
            }
        }
    }

    setLivScoreCompIsParent = () => {
        checkLivScoreCompIsParent().then((value) => (
            this.setState({ liveScoreCompIsParent: value })
        ))
    }

    onMatchClick(data, screenName) {
        return (
            <NavLink to={{
                pathname: screenName,
                state: { matchId: data, umpireKey: this.state.umpireKey }
            }}>
                <span className="input-heading-add-another pt-0">{data}</span>
            </NavLink>
        )
    }

    handleMatchTableList = (page, competitionID, sortBy, sortOrder, competitionOrganisationId) => {
        let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
        liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
        let offset = page ? liveScoreMatchListPageSize * (page - 1) : 0;
        this.setState({ offset })
        let start = 1
        this.props.liveScoreMatchListAction(competitionID, start, offset, liveScoreMatchListPageSize, this.state.searchText, this.state.selectedDivision === 'All' ? null : this.state.selectedDivision, this.state.selectedRound === 'All' ? null : this.state.selectedRound, undefined, sortBy, sortOrder, competitionOrganisationId)
    }

    onExport() {

        let competition = null
        if (this.state.umpireKey === 'umpire') {
            if (getUmpireCompetitonData()) {
                competition = JSON.parse(getUmpireCompetitonData());
            } else {
                history.push('/matchDayCompetitions')
            }
        } else {
            if (getLiveScoreCompetiton()) {
                competition = JSON.parse(getLiveScoreCompetiton());
            } else {
                history.push('/matchDayCompetitions')
            }
        }

        let competitionOrganisationId = competition.competitionOrganisation ? competition.competitionOrganisation.id : null
        let url = null
        if (competitionOrganisationId) {
            url = AppConstants.matchExport + this.state.competitionId + `&competitionOrganisationId=${competitionOrganisationId}`
        } else {
            url = AppConstants.matchExport + this.state.competitionId + `&competitionOrganisationId=${0}`
        }
        this.props.exportFilesAction(url)
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value, offset: 0 })
        if (e.target.value == null || e.target.value === "") {
            let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
            liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
            this.props.liveScoreMatchListAction(this.state.competitionId, 1, 0, liveScoreMatchListPageSize, e.target.value, this.state.selectedDivision === 'All' ? null : this.state.selectedDivision, this.state.selectedRound === 'All' ? null : this.state.selectedRound, undefined, this.state.sortBy, this.state.sortOrder, this.state.competitionOrganisationId)
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        this.setState({ offset: 0 })
        if (code === 13) { // 13 is the enter keycode
            let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
            liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
            this.props.liveScoreMatchListAction(this.state.competitionId, 1, 0, liveScoreMatchListPageSize, e.target.value, this.state.selectedDivision === 'All' ? null : this.state.selectedDivision, this.state.selectedRound === 'All' ? null : this.state.selectedRound, undefined, this.state.sortBy, this.state.sortOrder, this.state.competitionOrganisationId)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        this.setState({ offset: 0 })
        if (this.state.searchText == null || this.state.searchText === "") {
        } else {
            let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
            liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
            this.props.liveScoreMatchListAction(this.state.competitionId, 1, 0, liveScoreMatchListPageSize, this.state.searchText, this.state.selectedDivision === 'All' ? null : this.state.selectedDivision, this.state.selectedRound === 'All' ? null : this.state.selectedRound, undefined, this.state.sortBy, this.state.sortOrder, this.state.competitionOrganisationId)
        }
    }

    ///navigation to draws if sourceId is not null
    drawsNavigation = () => {
        let yearRefId = localStorage.yearId
        let compKey = null
        if (getLiveScoreCompetiton()) {
            const { uniqueKey } = JSON.parse(getLiveScoreCompetiton())
            compKey = uniqueKey
        }
        // setOwnCompetitionYear(yearRefId);
        setGlobalYear(yearRefId);
        setOwn_competition(compKey);
        history.push({ pathname: '/competitionDraws', state: { screenKey: "/matchDayMatches" } });
    }

    scoreView(score, records, index) {
        return (
            <div>
                {this.state.isBulkUpload ? (
                    <div>
                        {setMatchBulkScore(records) === false ? (
                            <div className="d-flex flex-row align-items-center justify-content-start">
                                <Input
                                    className="table-input-box-style"
                                    value={records.team1Score}
                                    type="number"
                                    onChange={(e) => this.props.changeMatchBulkScore(e.target.value, "team1Score", index)}
                                />
                                <span style={{ paddingLeft: 5, paddingRight: 5 }}>:</span>
                                <Input
                                    className="table-input-box-style"
                                    value={records.team2Score}
                                    type="number"
                                    onChange={(e) => this.props.changeMatchBulkScore(e.target.value, "team2Score", index)}
                                />
                            </div>
                        ) : setMatchResult(records)}
                    </div>
                ) : (
                        <span className="white-space-nowrap">{setMatchResult(records)}</span>
                    )}
            </div>
        )
    }

    headerView = () => {
        const { liveScoreMatchListData } = this.props.liveScoreMatchListState;
        let matchData = isArrayNotEmpty(liveScoreMatchListData) ? liveScoreMatchListData : []
        let { sourceIdAvailable, liveScoreCompIsParent } = this.state
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.matchList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
                        <div className="row">

                            {sourceIdAvailable && liveScoreCompIsParent && <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                    <Button
                                        type="primary"
                                        className="primary-add-comp-form"
                                        onClick={() => this.drawsNavigation()}
                                    >
                                        {AppConstants.draws}
                                    </Button>
                                </div>
                            </div>}

                            {
                                liveScoreCompIsParent &&
                                <div className="col-sm">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <Button
                                            type="primary"
                                            className="primary-add-comp-form"
                                            disabled={this.state.isBulkUpload || matchData.length === 0}
                                            onClick={() => this.setState({ isBulkUpload: true })}
                                        >
                                            {AppConstants.bulkScoreUpload}
                                        </Button>
                                    </div>
                                </div>
                            }

                            {
                                liveScoreCompIsParent &&
                                <div className="col-sm">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <NavLink to={{ pathname: '/matchDayAddMatch' }}>
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addMatches}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            }

                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                    <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
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
                            {
                                liveScoreCompIsParent &&
                                <div className="col-sm">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <NavLink to="/matchDayMatchImport">
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
                            }
                        </div>
                    </div>
                </div>
                {/* <div className="mt-5 d-flex justify-content-end">
                    <div className="comp-product-search-inp-width">
                        <Input
                            className="product-reg-search-input"
                            onChange={this.onChangeSearchText}
                            placeholder="Search..."
                            onKeyPress={this.onKeyEnterSearchText}
                            prefix={
                                <SearchOutlined
                                    style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    onClick={this.onClickSearchIcon}
                                />
                            }
                            allowClear
                        />
                    </div>
                </div> */}
            </div>
        )
    }

    handleShowSizeChange = async (page, pageSize) => {
        await this.props.setPageSizeAction(pageSize);
        this.onPageChange(page);
    }

    onPageChange = async (page) => {
        await this.props.setPageNumberAction(page);
        let checkScoreChanged = this.checkIsScoreChanged()
        if (checkScoreChanged === true) {
            message.info("Please save or cancel the current changes! ");
        } else {
            this.handleMatchTableList(page, this.state.competitionId, this.state.sortBy, this.state.sortOrder, this.state.competitionOrganisationId)
        }
    }

    //////// tableView
    tableView = () => {
        const { liveScoreMatchListData, liveScoreMatchListPage, liveScoreMatchListPageSize, liveScoreMatchListTotalCount, onLoadMatch } = this.props.liveScoreMatchListState;
        let DATA = isArrayNotEmpty(liveScoreMatchListData) ? liveScoreMatchListData : []

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoadMatch}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={DATA}
                        pagination={false}
                        rowKey={(record) => "matchList" + record.id}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        showSizeChanger
                        current={liveScoreMatchListPage}
                        defaultCurrent={liveScoreMatchListPage}
                        defaultPageSize={liveScoreMatchListPageSize}
                        total={liveScoreMatchListTotalCount}
                        onChange={this.onPageChange}
                        onShowSizeChange={this.handleShowSizeChange}
                    />
                </div>

                {this.state.isBulkUpload === true && (
                    <div className="d-flex justify-content-end" style={{ paddingBottom: "15vh" }}>
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    <Button className="cancelBtnWidth" onClick={() => this.onCancel()} type="cancel-button">
                                        {AppConstants.cancel}
                                    </Button>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button onClick={this.handleSubmit} className="publish-button save-draft-text" type="primary">
                                        {AppConstants.save}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    checkIsScoreChanged() {
        let { liveScoreMatchListData, liveScoreBulkScoreList } = this.props.liveScoreMatchListState

        let isChanged = false

        for (let i in liveScoreMatchListData) {
            if (liveScoreMatchListData[i].team1Score !== liveScoreBulkScoreList[i].team1Score || liveScoreMatchListData[i].team2Score !== liveScoreBulkScoreList[i].team2Score) {
                isChanged = true
                break;
            }

            if (isChanged === true) {
                break;
            }
        }

        return isChanged
    }

    createPostMatchArray() {
        let { liveScoreMatchListData, liveScoreBulkScoreList } = this.props.liveScoreMatchListState
        let array = []
        for (let i in liveScoreMatchListData) {
            if (liveScoreMatchListData[i].team1Score !== liveScoreBulkScoreList[i].team1Score || liveScoreMatchListData[i].team2Score !== liveScoreBulkScoreList[i].team2Score) {
                let requestObject = {
                    id: liveScoreMatchListData[i].id,
                    team1Score: JSON.parse(liveScoreMatchListData[i].team1Score),
                    team2Score: JSON.parse(liveScoreMatchListData[i].team2Score)
                }
                array.push(requestObject)
            }
        }
        return array
    }

    handleSubmit = () => {
        let checkScoreChanged = this.checkIsScoreChanged()
        if (checkScoreChanged === true) {
            let postArray = this.createPostMatchArray()
            this.setState({ onScoreUpdate: true })
            this.props.bulkScoreUpdate(postArray)
        } else {
            this.setState({ isBulkUpload: false })
        }
    }

    onCancel() {
        this.setState({ isBulkUpload: false })
        this.props.onCancelBulkScoreUpdate()
    }

    onChangeDivision(division) {
        this.setState({ selectedDivision: division, selectedRound: 'All' })
        let offset = 0;
        let start = 1;
        const { competitionId, searchText } = this.state;
        let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
        liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
        setTimeout(() => {
            this.props.liveScoreMatchListAction(competitionId, start, offset, liveScoreMatchListPageSize, searchText, division === 'All' ? null : division, null, undefined, this.state.sortBy, this.state.sortOrder, this.state.competitionOrganisationId)
        }, 200);
        this.props.liveScoreRoundListAction(competitionId, division === 'All' ? '' : division)

    }

    onChangeRound(roundName) {
        let offset = 0;
        let start = 1
        const { competitionId, searchText, selectedDivision } = this.state;
        let { liveScoreMatchListPageSize } = this.props.liveScoreMatchListState;
        liveScoreMatchListPageSize = liveScoreMatchListPageSize ? liveScoreMatchListPageSize : 10;
        this.props.liveScoreMatchListAction(competitionId, start, offset, liveScoreMatchListPageSize, searchText, selectedDivision === 'All' ? null : selectedDivision, roundName === 'All' ? null : roundName, undefined, this.state.sortBy, this.state.sortOrder, this.state.competitionOrganisationId)
        this.setState({ selectedRound: roundName })
    }

    dropdownView = () => {
        let { divisionList, roundList } = this.props.liveScoreMatchListState
        let divisionListArr = isArrayNotEmpty(divisionList) ? divisionList : []
        let roundListArr = isArrayNotEmpty(roundList) ? roundList : []
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-filter-col-cont pb-3">
                            <span className="year-select-heading">{AppConstants.division}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(divisionId) => this.onChangeDivision(divisionId)}
                                value={this.state.selectedDivision}
                            >
                                <Option value="All">All</Option>
                                {divisionListArr.map((item) => (
                                    <Option key={'division_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="reg-filter-col-cont pb-3">
                            <span className="year-select-heading">{AppConstants.round}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(roundName) => this.onChangeRound(roundName)}
                                value={this.state.selectedRound}
                            >
                                <Option value="All">All</Option>
                                {roundListArr.map((item) => (
                                    <Option key={'round_' + item.name} value={item.name}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="col-sm d-flex justify-content-end align-items-center">
                        <div className="comp-product-search-inp-width pb-3">
                            <Input
                                className="product-reg-search-input"
                                onChange={this.onChangeSearchText}
                                placeholder="Search..."
                                value={this.state.searchText}
                                onKeyPress={this.onKeyEnterSearchText}
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
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                {this.state.umpireKey ? (
                    <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                ) : (
                        <DashboardLayout
                            menuHeading={AppConstants.matchDay}
                            menuName={AppConstants.liveScores}
                            onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                        />
                    )}

                {this.state.umpireKey ? (
                    <InnerHorizontalMenu menu="umpire" umpireSelectedKey="1" />
                ) : (
                        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="2" />
                    )}

                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
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
        liveScoreMatchListAction,
        exportFilesAction,
        getLiveScoreDivisionList,
        liveScoreRoundListAction,
        changeMatchBulkScore,
        bulkScoreUpdate,
        onCancelBulkScoreUpdate,
        setPageSizeAction,
        setPageNumberAction,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchListState: state.LiveScoreMatchState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreMatchesList);
