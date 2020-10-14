import React, { Component } from "react";
import { Layout, Breadcrumb, Input, Button, Table, Select, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getYearAndCompetitionOwnAction } from "../../store/actions/appAction";
import {
    getCompPartPlayerGradingSummaryAction,
    onchangeCompPartPlayerGradingSummaryData,
    saveCompPartPlayerGradingSummaryAction,
    playerSummaryCommentAction
} from "../../store/actions/competitionModuleAction/competitionPartPlayerGradingAction";
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    getOwn_competitionStatus,
    setOwn_competitionStatus
} from "../../util/sessionStorage"
// import PlayerCommentModal from "../../customComponents/playerCommentModal";
// import moment from "moment"



const { Footer, Content } = Layout;
const { Option } = Select;
let this_Obj = null;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: 'Divisions',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => tableSort(a, b, "divisionName")
    },
    {
        title: 'Players',
        dataIndex: 'playerCount',
        key: 'playerCount',
        render: playerCount => <Input disabled className="input-inside-player-grades-table-for-grade" value={playerCount} />,
        sorter: (a, b) => tableSort(a, b, "playerCount")
    },
    {
        title: 'Min. players/Team',
        dataIndex: 'minimumPlayers',
        key: 'minimumPlayers',
        render: (minimumPlayers, record, index) => <Input
            className="input-inside-player-grades-table-for-grade"
            value={minimumPlayers}
            disabled={this_Obj.state.competitionStatus == 1 ? true : false}
            onChange={(e) => this_Obj.props.onchangeCompPartPlayerGradingSummaryData(e.target.value, index, "minimumPlayers")} />,
        width: '20%',
        sorter: (a, b) => tableSort(a, b, "minimumPlayers")
    },
    {
        title: '# Teams',
        dataIndex: 'noOfTeams',
        key: 'noOfTeams',
        render: noOfTeams => <Input disabled className="input-inside-player-grades-table-for-grade" value={noOfTeams} />,
        sorter: (a, b) => tableSort(a, b, "noOfTeams")
    },
    {
        title: 'Extra Players',
        dataIndex: 'extraPlayers',
        key: 'extraPlayers',
        render: extraPlayers => <Input disabled className="input-inside-player-grades-table-for-grade" value={extraPlayers} />,
        sorter: (a, b) => tableSort(a, b, "extraPlayers")
    },
    // {
    //     title: 'Comments',
    //     dataIndex: 'comments',
    //     key: 'comments',
    //     width: 110,
    //     render: (comments, record) =>
    //         <div style={{ display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={() => this_Obj.onClickComment(record)}>
    //             <img src={comments !== null && comments.length > 0 ? AppImages.commentFilled : AppImages.commentEmpty} alt="" height="25" width="25" />
    //         </div>
    // },

];



class CompetitionPlayerGradeCalculate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            value: "playingMember",
            competition: "2019winters",
            division: "12years",
            firstTimeCompId: "",
            getDataLoading: false,
            saveLoad: false,
            visible: false,
            comment: null,
            divisionId: null,
            playerGradingorgId: null,
            commentCreatedBy: null,
            commentsCreatedOn: null,
            comments: null,
            competitionStatus: 0,
            tooltipVisibleDelete: false


        }
        this_Obj = this;
    }

    componentDidUpdate(nextProps) {
        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId
                    let statusRefId = competitionList[0].statusRefId
                    setOwn_competition(competitionId)
                    setOwn_competitionStatus(statusRefId)
                    this.props.getCompPartPlayerGradingSummaryAction(this.state.yearRefId, competitionId)
                    this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
                }
            }
        }
        if (this.props.partPlayerGradingState.onLoad === false && this.state.saveLoad === true) {
            this.props.getCompPartPlayerGradingSummaryAction(this.state.yearRefId, this.state.firstTimeCompId)
            this.setState({ saveLoad: false })
        }
    }

    componentDidMount() {
        this.apiCalls()

    }

    apiCalls = () => {
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let storedCompetitionStatus = getOwn_competitionStatus()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                competitionStatus: storedCompetitionStatus,
                getDataLoading: true
            })
            this.props.getCompPartPlayerGradingSummaryAction(yearId, storedCompetitionId)
        }
        else {
            if (yearId) {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                })
            }
            else {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
                setOwnCompetitionYear(1)
            }
        }

    }

    ////save the final team grading data
    submitApiCall = () => {
        let playerGradingTableData = this.props.partPlayerGradingState.getCompPartPlayerGradingSummaryData
        let payload = {
            "organisationId": 1,
            "yearRefId": this.state.yearRefId,
            "competitionUniqueKey": this.state.firstTimeCompId,
            "playerSummary": playerGradingTableData
        }
        this.props.saveCompPartPlayerGradingSummaryAction(payload)
        this.setState({ saveLoad: true })
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.playerGradingToggle}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    //////year change onchange
    onYearChange = (yearId) => {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        setOwn_competitionStatus(undefined)
        this.props.getYearAndCompetitionOwnAction(this.props.appState.yearList, yearId, "own_competition")
        this.setState({ firstTimeCompId: null, yearRefId: yearId, competitionStatus: 0 })
        // this.setDetailsFieldValue()
    }

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        setOwn_competition(competitionId)
        setOwn_competitionStatus(statusRefId)
        this.props.getCompPartPlayerGradingSummaryAction(this.state.yearRefId, competitionId)
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="com-year-select-heading-view pb-3">
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name="yearRefId"
                                    style={{ width: 90 }}
                                    className="year-select reg-filter-select-year ml-2"
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {this.props.appState.own_YearArr.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-6 pb-3">
                            <div style={{
                                width: "fit-content", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50
                            }}>
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    // style={{ minWidth: 200 }}
                                    name="competition"
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={(competitionId, e) => this.onCompetitionChange(competitionId, e.key)}
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {this.props.appState.own_CompetitionArr.map(item => {
                                        return (
                                            <Option key={item.statusRefId} value={item.competitionId}>
                                                {item.competitionName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm pb-3" style={{ display: "flex", justifyContent: "flex-end", alignItems: 'center' }}>
                            <NavLink to="/competitionPlayerGrades">
                                <span className='input-heading-add-another pt-0'>{AppConstants.playerGradingToggle}</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // onClickComment(record) {
    //     this.setState({
    //         visible: true, comment: record.comments,
    //         divisionId: record.competitionMembershipProductDivisionId,
    //         playerGradingorgId: record.playerGradingOrganisationId,
    //         commentsCreatedBy: record.comments == "" ? null : record.commentsCreatedBy,
    //         commentsCreatedOn: record.comments == "" ? null : moment(record.commentsCreatedOn).format("DD-MM-YYYY HH:mm"),
    //         comments: record.comments
    //     })
    // }

    // handleOk = e => {
    //     this.props.playerSummaryCommentAction(this.state.yearRefId, this.state.firstTimeCompId,
    //         this.state.divisionId, this.state.playerGradingorgId, this.state.comment)
    //     this.setState({
    //         visible: false,
    //         comment: "",
    //         divisionId: null,
    //         playerGradingorgId: null,
    //         commentCreatedBy: null,
    //         commentsCreatedOn: null,
    //         comments: null
    //     });
    // };
    // // model cancel for dissapear a model
    // handleCancel = e => {
    //     this.setState({
    //         visible: false,
    //         comment: "",
    //         divisionId: null,
    //         playerGradingorgId: null,
    //         commentCreatedBy: null,
    //         commentsCreatedOn: null,
    //         comments: null
    //     });
    // };


    ////////form content view
    contentView = () => {
        let playerGradingTableData = this.props.partPlayerGradingState.getCompPartPlayerGradingSummaryData
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={playerGradingTableData}
                        pagination={false}
                        loading={this.props.partPlayerGradingState.onLoad == true && true}
                    />
                </div>
                {/* <PlayerCommentModal
                    visible={this.state.visible}
                    modalTitle={AppConstants.add_edit_comment}
                    onOK={this.handleOk}
                    onCancel={this.handleCancel}
                    placeholder={AppConstants.addYourComment}
                    onChange={(e) => this.setState({ comment: e.target.value })}
                    value={this.state.comment}
                    owner={this.state.commentsCreatedBy}
                    OwnCreatedComment={this.state.commentsCreatedOn}
                    ownnerComment={this.state.comments}
                /> */}
            </div>
        )
    }



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let isPublished = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="fluid-width">
                <div className="comp-player-grades-footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                {/* <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button> */}

                                <Tooltip
                                    style={{ height: '100%' }}
                                    onMouseEnter={() =>
                                        this.setState({
                                            tooltipVisibleDelete: isPublished ? true : false,
                                        })
                                    }
                                    onMouseLeave={() =>
                                        this.setState({ tooltipVisibleDelete: false })
                                    }
                                    visible={this.state.tooltipVisibleDelete}
                                    title={AppConstants.statusPublishHover}
                                >
                                    <Button
                                        disabled={this.state.competitionStatus == 1 ? true : false}
                                        className="publish-button"
                                        style={{ height: isPublished && "100%", borderRadius: isPublished && 6, width: isPublished && "inherit" }}
                                        type="primary"
                                        onClick={() => this.submitApiCall()}>
                                        {AppConstants.save}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey="4" />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getYearAndCompetitionOwnAction,
        getCompPartPlayerGradingSummaryAction,
        onchangeCompPartPlayerGradingSummaryData,
        saveCompPartPlayerGradingSummaryAction,
        playerSummaryCommentAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        partPlayerGradingState: state.CompetitionPartPlayerGradingState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPlayerGradeCalculate);
