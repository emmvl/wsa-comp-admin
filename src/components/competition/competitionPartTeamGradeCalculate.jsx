import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Table, Select, Tag, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getYearAndCompetitionOwnAction, clearYearCompetitionAction } from "../../store/actions/appAction";
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
    getOwn_competition
} from "../../util/sessionStorage";
import AppImages from "../../themes/appImages";
import Tooltip from 'react-png-tooltip'

const { Footer, Content } = Layout;
const { Option } = Select;
let this_Obj = null;
const default_coloumns =
    [
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
    ]


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
                    render: (statusData, record) =>
                        <span>{statusData}</span>,
                    // sorter: (a, b) => tableSort(a, b, "finalGradeOrganisationCount")

                },
            ]
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
                    setOwn_competition(competitionId)
                    this.props.getTeamGradingSummaryAction(this.state.yearRefId, competitionId)
                    this.setState({ getDataLoading: true, firstTimeCompId: competitionId })
                }
            }
        }
        if (this.props.ownTeamGradingState.onLoad == false && this.state.getDataLoading == true) {
            console.log('called' + JSON.stringify(this.props.ownTeamGradingState.finalsortOrderArray));
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
                competitionDivisionGradeId: null
            })

        }
    }

    componentDidMount() {
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                getDataLoading: true
            })
            this.props.getTeamGradingSummaryAction(yearId, storedCompetitionId)
        }
        else {
            if (yearId) {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                })
            }
            else {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
                setOwnCompetitionYear(1)
            }
        }

    }

    ////publish the team grading summmary data
    publishtApiCall = () => {
        this.props.publishGradeTeamSummaryAction(this.state.yearRefId, this.state.firstTimeCompId)
    }


    //////addd new column in the table for grades
    addNewGrade = (arr) => {
        const columns1 = this.state.columns
        for (let i in arr) {
            let newColumn = {
                title: null,
                dataIndex: `grades${i}`,
                render: (grades, record) =>
                    < div style={{ width: "fit-content", display: "flex", flexDirection: 'column', justifyContent: 'center', height: "100%" }}>
                        <a className="pb-3" style={{ marginBottom: "auto", marginTop: "auto" }}>
                            <span style={{ color: "var(--app-color)" }}
                                onClick={() => this.updateGradeName(grades.competitionDivisionGradeId, record.competitionMembershipProductDivisionId)} className="year-select-heading ">
                                {grades.gradeName}
                            </span>
                        </a>
                        <NavLink
                            to={{ pathname: `/competitionProposedTeamGrading`, state: { id: record.competitionMembershipProductDivisionId, gradeRefId: grades.gradeRefId } }}>
                            {grades.teamCount !== null ?
                                <Tag className="comp-dashboard-table-tag  text-center tag-col" key={grades}
                                >{grades.teamCount}
                                </Tag>
                                : null}
                        </NavLink >
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
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.teamGradingSummary}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ marginTop: 10 }}>
                            <Tooltip placement="top" background='#ff8237'>
                                <span>{AppConstants.teamGradingSummaryMsg}</span>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="col-sm" style={{
                        display: "flex", flexDirection: 'row', alignItems: "center",
                        justifyContent: "flex-end", width: "100%", marginRight: '2.8%'
                    }}>
                        <div className="row">
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button className="primary-add-comp-form" type="primary" onClick={() => this.exportTeams()}>
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
                                    <Button className="primary-add-comp-form" type="primary" onClick={() => this.exportPlayers()}>
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
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId })
        // this.setDetailsFieldValue()
    }

    // on Competition change
    onCompetitionChange(competitionId) {
        this.props.clearTeamGradingReducerDataAction("ownTeamGradingSummaryGetData")
        setOwn_competition(competitionId)
        this.props.getTeamGradingSummaryAction(this.state.yearRefId, competitionId)
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, columns: JSON.parse(JSON.stringify(default_coloumns)) })
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
                                    name={"yearRefId"}
                                    // style={{ width: 90 }}
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
                                    // style={{ minWidth: 200 }}
                                    name={"competition"}
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={competitionId => this.onCompetitionChange(competitionId)
                                    }
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {this.props.appState.own_CompetitionArr.map(item => {
                                        return (
                                            <Option key={"competition" + item.competitionId} value={item.competitionId}>
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
            </div>
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
        console.log("ownTeamGradingSummaryGetData", ownTeamGradingSummaryGetData)
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



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="comp-player-grades-footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                {/* <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button> */}
                                <Button
                                    className="open-reg-button"
                                    type="primary"
                                    onClick={() => this.publishtApiCall()}
                                >{AppConstants.publish}</Button>
                            </div>
                        </div>
                    </div>
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

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        ownTeamGradingState: state.CompetitionOwnTeamGradingState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionPartTeamGradeCalculate));