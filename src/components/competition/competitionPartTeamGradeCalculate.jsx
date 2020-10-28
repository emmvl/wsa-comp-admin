import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Breadcrumb, Button, Table, Select, Tag, Modal, Tooltip } from 'antd';
import CustomTooltip from 'react-png-tooltip';

import AppConstants from 'themes/appConstants';
import AppImages from 'themes/appImages';
import AppUniqueId from 'themes/appUniqueId';
import history from 'util/history';
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    getOwn_competitionStatus, setOwn_competitionStatus,
    getOwn_CompetitionFinalRefId, setOwn_CompetitionFinalRefId
} from 'util/sessionStorage';
import { getYearAndCompetitionOwnAction, clearYearCompetitionAction } from 'store/actions/appAction';
import {
    getTeamGradingSummaryAction,
    saveUpdatedGradeTeamSummaryAction,
    publishGradeTeamSummaryAction,
    onchangeTeamGradingSummaryData,
    clearTeamGradingReducerDataAction,
    exportFinalTeamsAction,
    exportFinalPlayersAction
} from 'store/actions/competitionModuleAction/competitionTeamGradingAction';
import InputWithHead from 'customComponents/InputWithHead';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';

import './competition.css';

const { Footer, Content } = Layout;
const { Option } = Select;

const columns = [
    {
        title: 'Divisions',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => tableSort(a, b, 'divisionName')
    },
    {
        title: 'Status',
        dataIndex: 'statusData',
        key: 'statusData',
        // sorter: (a, b) => tableSort(a, b, 'finalGradeOrganisationCount'),
        render: (statusData) => (
            <div>
                <span>{statusData}</span>
            </div>
        ),
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
            showPublishToLivescore: false,
            showButton: null,
            columns: [
                {
                    title: 'Divisions',
                    dataIndex: 'divisionName',
                    key: 'divisionName',
                    sorter: (a, b) => tableSort(a, b, 'divisionName')
                },
                {
                    title: 'Status',
                    dataIndex: 'statusData',
                    key: 'statusData',
                    render: (statusData) => <span>{statusData}</span>,
                    // sorter: (a, b) => tableSort(a, b, 'finalGradeOrganisationCount')
                },
            ],
            nextButtonClicked: false
        };
        // this.props.clearYearCompetitionAction()
        this.props.clearTeamGradingReducerDataAction('ownTeamGradingSummaryGetData')
    }

    componentDidUpdate(nextProps) {
        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId
                    let statusRefId = competitionList[0].statusRefId
                    let finalTypeRefId = competitionList[0].finalTypeRefId
                    setOwn_competition(competitionId)
                    setOwn_competitionStatus(statusRefId)
                    setOwn_CompetitionFinalRefId(finalTypeRefId)
                    this.props.getTeamGradingSummaryAction(this.state.yearRefId, competitionId)
                    this.setState({
                        getDataLoading: true,
                        firstTimeCompId: competitionId,
                        competitionStatus: statusRefId
                    })
                }
            }
        }
        if (this.props.ownTeamGradingState.onLoad == false && this.state.getDataLoading) {
            let arr = this.props.ownTeamGradingState.finalsortOrderArray
            this.addNewGrade(arr)
            this.setState({ getDataLoading: false });
        }

        if (this.props.ownTeamGradingState.updateGradeOnLoad == false && this.state.updateGradeOnLoad) {
            this.props.onchangeTeamGradingSummaryData(this.state.updateGradeName, this.state.competitionDivisionGradeId, 'ownTeamGradingSummaryGetData')
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
        let storedfinalTypeRefId = getOwn_CompetitionFinalRefId()
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
                // setOwnCompetitionYear(1)
            }
        }
    }

    ////publish the team grading summary data
    publishToApiCall = (key) => {
        this.setState({
            showPublishToLivescore: true,
            showButton: key
        });
    }

    //////add new column in the table for grades
    addNewGrade = (arr) => {
        let columns1 = [...this.state.columns];
        let disabledStatus = this.state.competitionStatus == 1;

        for (let i in arr) {
            let newColumn = {
                title: null,
                dataIndex: `grades${i}`,
                key: `grades${i}`,
                render: (grades, record) => (
                    <div
                        style={{
                            width: 'fit-content',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <a className="pb-3" style={{ marginBottom: 'auto', marginTop: 'auto' }}>
                            <span
                                className="year-select-heading"
                                style={{ color: 'var(--app-color)' }}
                                onClick={() => !disabledStatus && this.updateGradeName(grades.competitionDivisionGradeId, record.competitionMembershipProductDivisionId)}
                            >
                                {grades.gradeName}
                            </span>
                        </a>
                        {!disabledStatus ? (
                            <NavLink
                                to={{
                                    pathname: '/competitionProposedTeamGrading',
                                    state: {
                                        id: record.competitionMembershipProductDivisionId,
                                        gradeRefId: grades.gradeRefId
                                    },
                                }}
                            >
                                {grades.teamCount !== null && (
                                    <Tag className="comp-dashboard-table-tag  text-center tag-col" key={grades}>
                                        {grades.teamCount}
                                    </Tag>
                                )}
                            </NavLink>
                        ) : (
                                grades.teamCount !== null && (
                                    <Tag className="comp-dashboard-table-tag  text-center tag-col" key={grades}>
                                        {grades.teamCount}
                                    </Tag>
                                )
                            )}
                    </div>
                )
            };
            columns1.push(newColumn)
        }

        this.setState({
            columns: columns1
        })
    };

    exportTeams = () => {
        this.props.exportFinalTeamsAction({
            competitionId: this.state.firstTimeCompId,
            yearRefId: this.state.yearRefId
        });
    };

    exportPlayers = () => {
        this.props.exportFinalPlayersAction({
            competitionId: this.state.firstTimeCompId,
            yearRefId: this.state.yearRefId
        });
    };

    ///////view for breadcrumb
    headerView = () => {
        const disabledStatus = this.state.competitionStatus == 1;
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm" style={{ display: 'flex', alignContent: 'center' }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.teamGradingSummary}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ marginTop: 10 }}>
                            <CustomTooltip placement="top" background="#ff8237">
                                <span>{AppConstants.teamGradingSummaryMsg}</span>
                            </CustomTooltip>
                        </div>
                    </div>
                    <div
                        className="col-sm"
                        style={{
                            width: '100%',
                            marginRight: '2.8%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <div className="row">
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button
                                        id={AppUniqueId.teamGrading_ExportBtn}
                                        type="primary"
                                        className="primary-add-comp-form"
                                        disabled={disabledStatus}
                                        onClick={this.exportTeams}
                                    >
                                        <div className="row">
                                            <div className="col-sm">
                                                <img className="export-image" src={AppImages.export} alt="" />
                                                {AppConstants.exportTeams}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button
                                        id={AppUniqueId.teamGrading_ExportPlayer}
                                        type="primary"
                                        className="primary-add-comp-form"
                                        disabled={disabledStatus}
                                        onClick={this.exportPlayers}
                                    >
                                        <div className="row">
                                            <div className="col-sm">
                                                <img className="export-image" src={AppImages.export} alt="" />
                                                {AppConstants.exportPlayers}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //////year change onchange
    onYearChange = (yearId) => {
        setOwnCompetitionYear(yearId);
        setOwn_competition(undefined);
        setOwn_competitionStatus(undefined);
        setOwn_CompetitionFinalRefId(undefined)
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition');
        this.setState({ firstTimeCompId: null, yearRefId: yearId, competitionStatus: 0 });
        // this.setDetailsFieldValue();
    }

    // on Competition change
    onCompetitionChange(competitionId) {
        this.props.clearTeamGradingReducerDataAction('ownTeamGradingSummaryGetData');
        let own_CompetitionArr = this.props.appState.own_CompetitionArr
        let statusIndex = own_CompetitionArr.findIndex((x) => x.competitionId == competitionId)
        let statusRefId = own_CompetitionArr[statusIndex].statusRefId
        let finalTypeRefId = own_CompetitionArr[statusIndex].finalTypeRefId
        setOwn_competition(competitionId);
        setOwn_competitionStatus(statusRefId);
        setOwn_CompetitionFinalRefId(finalTypeRefId)
        this.props.getTeamGradingSummaryAction(this.state.yearRefId, competitionId);
        this.setState({
            getDataLoading: true,
            firstTimeCompId: competitionId,
            columns: JSON.parse(JSON.stringify(columns)),
            competitionStatus: statusRefId,
        });
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { yearRefId, firstTimeCompId } = this.state;
        const { own_YearArr, own_CompetitionArr } = this.props.appState;
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="com-year-select-heading-view pb-3">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    id={AppUniqueId.teamGradingYear_dpdn}
                                    name="yearRefId"
                                    style={{ width: 90 }}
                                    className="year-select reg-filter-select-year ml-2"
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={yearRefId}
                                >
                                    {own_YearArr.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3">
                            <div
                                style={{
                                    width: 'fit-content',
                                    marginRight: 50,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    id={AppUniqueId.teamGradingYCompetition_dpdn}
                                    name="competition"
                                    className="year-select reg-filter-select-competition ml-2"
                                    value={JSON.parse(JSON.stringify(firstTimeCompId))}
                                    onChange={(competitionId, e) => this.onCompetitionChange(competitionId, e.key)}
                                >
                                    {own_CompetitionArr.map(item => (
                                        <Option key={'competition_' + item.competitionId} value={item.competitionId}>
                                            {item.competitionName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {/* <div className="col-sm-5" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button className="primary-add-comp-form" type="primary" onClick={this.addNewGrade}>
                                + {AppConstants.addgrade}
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    };

    handleOk = () => {
        let payload = {
            organisationId: 1,
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.firstTimeCompId,
            grades: [
                {
                    competitionMembershipProductDivisionId: this.state.competitionMembershipProductDivisionId,
                    competitionDivisionGradeId: this.state.competitionDivisionGradeId,
                    name: this.state.updateGradeName
                }
            ]
        }
        this.props.saveUpdatedGradeTeamSummaryAction(payload)
        this.setState({
            addGradeVisible: false,
            updateGradeOnLoad: true
        });
    };

    handleCancel = () => {
        this.setState({
            addGradeVisible: false,
            updateGradeName: "",
            competitionMembershipProductDivisionId: null,
            competitionDivisionGradeId: null
        });
    };

    updateGradeName = (competitionDivisionGradeId, competitionMembershipProductDivisionId) => {
        this.setState({ addGradeVisible: true, competitionDivisionGradeId, competitionMembershipProductDivisionId })
    };

    ////////form content view
    contentView = () => {
        const { columns, data, addGradeVisible, updateGradeName, getDataLoading } = this.state;
        const { ownTeamGradingSummaryGetData, onLoad } = this.props.ownTeamGradingState;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        // dataSource={data}
                        dataSource={ownTeamGradingSummaryGetData}
                        pagination={false}
                        loading={getDataLoading && true}
                    />
                </div>

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.updateGradeName}
                    visible={addGradeVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputWithHead
                        required="pt-0 mt-0"
                        heading={AppConstants.gradeName}
                        placeholder={AppConstants.pleaseEnterGradeName}
                        onChange={(e) => this.setState({ updateGradeName: e.target.value })}
                        value={updateGradeName}
                    />
                </Modal>
            </div>
        );
    };

    handlePublishToLivescore = (key) => {
        if (key === "yes") {
            if (this.state.showButton === "next") {
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
            if (this.state.showButton === "next") {
                this.setState({
                    nextButtonClicked: true
                })
            }
        }
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        const { tooltipVisibleDelete, showPublishToLivescore } = this.state;
        const isPublished = this.state.competitionStatus == 1;
        return (
            <div className="fluid-width paddingBottom56px">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <NavLink to="/competitionPlayerGrades">
                                <Button disabled={isPublished} className="cancelBtnWidth" type="cancel-button">
                                    {AppConstants.back}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Tooltip
                                style={{ height: '100%' }}
                                onMouseEnter={() =>
                                    this.setState({
                                        tooltipVisibleDelete: isPublished,
                                    })
                                }
                                onMouseLeave={() =>
                                    this.setState({ tooltipVisibleDelete: false })
                                }
                                visible={tooltipVisibleDelete}
                                title={AppConstants.statusPublishHover}
                            >
                                <Button
                                    id={AppUniqueId.teamGrading_PublishBtn}
                                    type="primary"
                                    className="publish-button save-draft-text"
                                    disabled={isPublished}
                                    onClick={() => this.publishToApiCall('submit')}
                                    style={{
                                        height: isPublished && '100%',
                                        borderRadius: isPublished && 6,
                                        width: isPublished && 'inherit'
                                    }}
                                >
                                    {AppConstants.save}
                                </Button>
                            </Tooltip>
                            {/* <NavLink id={AppUniqueId.teamGrading_NextBtn} to="/competitionCourtAndTimesAssign"> */}
                            <Button
                                id={AppUniqueId.teamGrading_NextBtn}
                                type="primary"
                                className="publish-button margin-top-disabled-button"
                                disabled={isPublished}
                                onClick={() => this.publishToApiCall('next')}
                            >
                                {AppConstants.next}
                            </Button>
                            {/* </NavLink> */}
                        </div>
                        <Modal
                            title={AppConstants.finalGrading}
                            className="add-membership-type-modal"
                            visible={showPublishToLivescore}
                            okText={AppConstants.yes}
                            onOk={() => this.handlePublishToLivescore('yes')}
                            cancelText={AppConstants.no}
                            onCancel={() => this.handlePublishToLivescore('no')}
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
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey="5" />
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
