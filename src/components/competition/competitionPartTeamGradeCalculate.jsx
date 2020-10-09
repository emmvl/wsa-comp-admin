import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Tag, Modal, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getYearAndCompetitionOwnAction, clearYearCompetitionAction } from "../../store/actions/appAction";
import history from "../../util/history";
import {
    getTeamGradingSummaryAction,
    saveUpdatedGradeTeamSummaryAction,
    publishGradeTeamSummaryAction,
    onchangeTeamGradingSummaryData,
    clearTeamGradingReducerDataAction,
    exportFinalTeamsAction,
    exportFinalPlayersAction
} from "../../store/actions/competitionModuleAction/competitionTeamGradingAction";
import InputWithHead from "../../customComponents/InputWithHead";
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    getOwn_competitionStatus, setOwn_competitionStatus
} from "../../util/sessionStorage";
import AppImages from "../../themes/appImages";
import CustomTooltip from 'react-png-tooltip'
import AppUniqueId from "../../themes/appUniqueId";

const { Footer, Content } = Layout;
const { Option } = Select;
let this_Obj = null;
const default_coloumns = [
    {
        title: 'Divisions',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => tableSort(a, b, "divisionName")
    },
    {
        title: 'Status',
        dataIndex: 'statusData',
        key: 'statusData',
        // sorter: (a, b) => tableSort(a, b, "finalGradeOrganisationCount"),
        render: (statusData, record) => {
            return (
                <div>
                    <span>{statusData}</span>
                </div>
            )
        },
    }
];

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

class CompetitionPartTeamGradeCalculate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            count: 1,
            firstTimeCompId: "",
            getDataLoading: false,
            addGradeVisible: false,
            competitionDivisionGradeId: null,
            competitionMembershipProductDivisionId: null,
            updateGradeOnLoad: false,
            competitionStatus: 0,
            tooltipVisibleDelete: false,
            showPublishToLivescore : false,
            showButton: null,
            columns: [
                {
                    title: 'Divisions',
                    dataIndex: 'divisionName',
                    key: 'divisionName',
                    sorter: (a, b) => tableSort(a, b, "divisionName")
                },
                {
                    title: 'Status',
                    dataIndex: 'statusData',
                    key: 'statusData',
                    render: (statusData, record) => <span>{statusData}</span>,
                    // sorter: (a, b) => tableSort(a, b, "finalGradeOrganisationCount")
                },
            ],
            nextButtonClicked: false
        };
        // this.props.clearYearCompetitionAction()
        this.props.clearTeamGradingReducerDataAction("ownTeamGradingSummaryGetData")
        this_Obj = this
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
                    this.props.getTeamGradingSummaryAction(this.state.yearRefId, competitionId)
                    this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
                }
            }
        }
        if (this.props.ownTeamGradingState.onLoad == false && this.state.getDataLoading == true) {
            this.setState({ getDataLoading: false })
            let arr = this.props.ownTeamGradingState.finalsortOrderArray
            this.addNewGrade(arr)
        }

        if (this.props.ownTeamGradingState.updateGradeOnLoad == false && this.state.updateGradeOnLoad == true) {
            this.props.onchangeTeamGradingSummaryData(this.state.updateGradeName, this.state.competitionDivisionGradeId, "ownTeamGradingSummaryGetData")
            this.setState({
                updateGradeOnLoad: false,
                updateGradeName: "",
                competitionMembershipProductDivisionId: null,
                competitionDivisionGradeId: null,
            })
        }
        if (this.props.ownTeamGradingState.onLoad === false && this.state.nextButtonClicked === true) {
            this.setState({
                nextButtonClicked: false
            })
            history.push('/competitionCourtAndTimesAssign')
        }
    }

    componentDidMount() {
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
            this.props.getTeamGradingSummaryAction(yearId, storedCompetitionId)
        } else {
            if (yearId) {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                })
            } else {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
                setOwnCompetitionYear(1)
            }
        }
    }

    ////publish the team grading summmary data
    publishtApiCall = (key) => {
        if (key == "next") {
            this.setState({
                showPublishToLivescore:true,
                showButton:key
            })
        } else {
            this.setState({
                showPublishToLivescore:true,
                showButton:key
            })
        }
    }

    //////addd new column in the table for grades
    addNewGrade = (arr) => {
        const columns1 = this.state.columns
        let disabledStatus = this.state.competitionStatus == 1 ? true : false
        for (let i in arr) {
            let newColumn = {
                title: null,
                dataIndex: `grades${i}`,
                render: (grades, record) =>
                    <div style={{ width: "fit-content", display: "flex", flexDirection: 'column', justifyContent: 'center', height: "100%" }}>
                        <a className="pb-3" style={{ marginBottom: "auto", marginTop: "auto" }}>
                            <span
                                style={{ color: "var(--app-color)" }}
                                onClick={() => disabledStatus == false && this.updateGradeName(grades.competitionDivisionGradeId, record.competitionMembershipProductDivisionId)}
                                className="year-select-heading"
                            >
                                {grades.gradeName}
                            </span>
                        </a>
                        {disabledStatus == false ?
                            <NavLink
                                to={{ pathname: `/competitionProposedTeamGrading`, state: { id: record.competitionMembershipProductDivisionId, gradeRefId: grades.gradeRefId } }}
                            >
                                {grades.teamCount !== null ?
                                    <Tag className="comp-dashboard-table-tag  text-center tag-col" key={grades}>
                                        {grades.teamCount}
                                    </Tag>
                                    : null}
                            </NavLink >
                            :
                            grades.teamCount !== null ?
                                <Tag className="comp-dashboard-table-tag  text-center tag-col" key={grades}>
                                    {grades.teamCount}
                                </Tag>
                                : null
                        }
                    </div>
            };
            columns1.push(newColumn)
        }

        this.setState({
            columns: columns1
        })
    }

    exportTeams = () => {
        let payload = {
            competitionId: this.state.firstTimeCompId,
            yearRefId: this.state.yearRefId
        }
        this.props.exportFinalTeamsAction(payload);
    }

    exportPlayers = () => {
        let payload = {
            competitionId: this.state.firstTimeCompId,
            yearRefId: this.state.yearRefId
        }
        this.props.exportFinalPlayersAction(payload);
    }

    ///////view for breadcrumb
    headerView = () => {
        let disabledStatus = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.teamGradingSummary}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ marginTop: 10 }}>
                            <CustomTooltip placement="top" background='#ff8237'>
                                <span>{AppConstants.teamGradingSummaryMsg}</span>
                            </CustomTooltip>
                        </div>
                    </div>
                    <div className="col-sm" style={{
                        display: "flex", flexDirection: 'row', alignItems: "center",
                        justifyContent: "flex-end", width: "100%", marginRight: '2.8%'
                    }}>
                        <div className="row">
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button id={AppUniqueId.teamGrading_ExportBtn} disabled={disabledStatus} className="primary-add-comp-form" type="primary" onClick={() => this.exportTeams()}>
                                        <div className="row">
                                            <div className="col-sm">
                                                <img
                                                    src={AppImages.export}
                                                    alt=""
                                                    className="export-image"
                                                />
                                                {AppConstants.exportTeams}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button id={AppUniqueId.teamGrading_ExportPlayer} disabled={disabledStatus} className="primary-add-comp-form" type="primary" onClick={() => this.exportPlayers()}>
                                        <div className="row">
                                            <div className="col-sm">
                                                <img
                                                    src={AppImages.export}
                                                    alt=""
                                                    className="export-image"
                                                />
                                                {AppConstants.exportPlayers}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    //////year change onchange
    onYearChange = (yearId) => {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        setOwn_competitionStatus(undefined)
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId, competitionStatus: 0 })
        // this.setDetailsFieldValue()
    }

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        this.props.clearTeamGradingReducerDataAction("ownTeamGradingSummaryGetData")
        setOwn_competition(competitionId)
        setOwn_competitionStatus(statusRefId)
        this.props.getTeamGradingSummaryAction(this.state.yearRefId, competitionId)
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, columns: JSON.parse(JSON.stringify(default_coloumns)), competitionStatus: statusRefId })
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-3" >
                            <div className="com-year-select-heading-view pb-3" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    id={AppUniqueId.teamGradingYear_dpdn}
                                    name={"yearRefId"}
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
                        <div className="col-sm-3 pb-3" >
                            <div style={{
                                width: "fit-content", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    id={AppUniqueId.teamGradingYCompetition_dpdn}
                                    name={"competition"}
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={(competitionId, e) => this.onCompetitionChange(competitionId, e.key)
                                    }
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
                        {/* <div className="col-sm-5" style={{ display: "flex", justifyContent: "flex-end" }} >
                            <Button className="primary-add-comp-form" type="primary"
                            // onClick={this.addNewGrade}
                            >
                                + {AppConstants.addgrade}
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div >
        )
    }

    handleOk = e => {
        let payload = {
            "organisationId": 1,
            "yearRefId": this.state.yearRefId,
            "competitionUniqueKey": this.state.firstTimeCompId,
            "grades": [
                {
                    "competitionMembershipProductDivisionId": this.state.competitionMembershipProductDivisionId,
                    "competitionDivisionGradeId": this.state.competitionDivisionGradeId,
                    "name": this.state.updateGradeName
                }
            ]
        }
        this.props.saveUpdatedGradeTeamSummaryAction(payload)
        this.setState({
            addGradeVisible: false,
            updateGradeOnLoad: true
        });
    };

    handleCancel = e => {
        this.setState({
            addGradeVisible: false,
            updateGradeName: "",
            competitionMembershipProductDivisionId: null,
            competitionDivisionGradeId: null
        });
    };

    updateGradeName = (competitionDivisionGradeId, competitionMembershipProductDivisionId) => {
        this.setState({ addGradeVisible: true, competitionDivisionGradeId, competitionMembershipProductDivisionId })
    }

    ////////form content view
    contentView = () => {
        let ownTeamGradingSummaryGetData = this.props.ownTeamGradingState.ownTeamGradingSummaryGetData
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={this.state.columns}
                        // dataSource={this.state.data}
                        dataSource={ownTeamGradingSummaryGetData}
                        pagination={false}
                        loading={this.props.ownTeamGradingState.onLoad == true && true}
                    />
                </div>

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.updateGradeName}
                    visible={this.state.addGradeVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputWithHead
                        required={"pt-0 mt-0"}
                        heading={AppConstants.gradeName}
                        placeholder={AppConstants.pleaseEnterGradeName}
                        onChange={(e) => this.setState({ updateGradeName: e.target.value })}
                        value={this.state.updateGradeName}
                    />
                </Modal>
            </div>
        )
    }

    handlePublishToLivescore = (key) => {
        if (key == "yes") {
            if (this.state.showButton == "next") {
                this.setState({
                    nextButtonClicked: true
                })
            }
            this.setState({
                showPublishToLivescore: false
            })
            let publishToLivescore = 1
            this.props.publishGradeTeamSummaryAction(this.state.yearRefId, this.state.firstTimeCompId, publishToLivescore)
        } else {
            let publishToLivescore = 0
            this.props.publishGradeTeamSummaryAction(this.state.yearRefId, this.state.firstTimeCompId, publishToLivescore)
            this.setState({ showPublishToLivescore: false });
            if (this.state.showButton == "next") {
                this.setState({
                    nextButtonClicked: true
                })
            }
        }
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let isPublished = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="fluid-width paddingBottom56px">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <NavLink to="/competitionPlayerGrades">
                                <Button disabled={isPublished} className="cancelBtnWidth" type="cancel-button"  >{AppConstants.back}</Button>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
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
                                    id={AppUniqueId.teamGrading_PublishBtn}
                                    className="publish-button save-draft-text"
                                    disabled={isPublished}
                                    style={{ height: isPublished && "100%", borderRadius: isPublished && 6, width: isPublished && "inherit" }}
                                    type="primary"
                                    onClick={() => this.publishtApiCall("submit")}
                                >
                                    {AppConstants.save}
                                </Button>
                            </Tooltip>
                            {/* <NavLink id={AppUniqueId.teamGrading_NextBtn} to="/competitionCourtAndTimesAssign"> */}
                            <Button
                                id={AppUniqueId.teamGrading_NextBtn}
                                onClick={() => this.publishtApiCall("next")}
                                disabled={isPublished} className="publish-button margin-top-disabled-button" type="primary"
                            >
                                {AppConstants.next}
                            </Button>
                            {/* </NavLink> */}
                        </div>
						            <Modal
                            title={AppConstants.finalGrading}
                            className="add-membership-type-modal"
                            visible={this.state.showPublishToLivescore}
                            onOk={() => this.handlePublishToLivescore("yes")}
                            onCancel={() => this.handlePublishToLivescore("no")}
                            okText={AppConstants.yes}
                            cancelText={AppConstants.no}
                        >
                            <div>{AppConstants.publishToLivescore}</div>
                        </Modal>
                    </div>
                    {/* <div className="col-sm-1">
                        <div className="comp-buttons-view">
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"5"} />
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
        getTeamGradingSummaryAction,
        saveUpdatedGradeTeamSummaryAction,
        publishGradeTeamSummaryAction,
        onchangeTeamGradingSummaryData,
        clearYearCompetitionAction,
        clearTeamGradingReducerDataAction,
        exportFinalTeamsAction,
        exportFinalPlayersAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        ownTeamGradingState: state.CompetitionOwnTeamGradingState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPartTeamGradeCalculate);
