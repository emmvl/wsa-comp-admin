import React, { Component } from "react";
import { Layout, Breadcrumb, Input, Button, Table, Select, Tag, Form, Tooltip, message, Menu, Modal } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getYearAndCompetitionParticipateAction } from "../../store/actions/appAction";
import { getDivisionsListAction, clearReducerDataAction } from "../../store/actions/registrationAction/registration";
import {
    getCompPartProposedTeamGradingAction,
    savePartProposedTeamGradingDataAction,
    clearTeamGradingReducerDataAction,
    onchangeCompPartProposedTeamGradingData,
    partProposedSummaryComment,
    changeProposedHistoryHover,
    exportProposedTeamsAction,
    exportProposedPlayersAction,
    changeDivisionTeamAction
} from "../../store/actions/competitionModuleAction/competitionTeamGradingAction";
import { NavLink } from 'react-router-dom';
import { gradesReferenceListAction } from "../../store/actions/commonAction/commonAction";
import {
    setParticipatingYear,
    getParticipatingYear,
    setParticipating_competition,
    getParticipating_competition,
} from "../../util/sessionStorage"
import CommentModal from "../../customComponents/commentModal"
import moment from "moment"
import ValidationConstants from "../../themes/validationConstant";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_obj = null;
const { SubMenu } = Menu;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: 'Team',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        sorter: (a, b) => tableSort(a, b, "sortOrder")

    },
    {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName',
        render: (teamName, record, index) => <Input className="input-inside-team-grades-table"
            onChange={e => this_obj.props.onchangeCompPartProposedTeamGradingData(e.target.value, index, "teamName")}
            placeholder={"Team Name"}
            value={teamName}
        />,
        sorter: (a, b) => tableSort(a, b, "teamName")

    },

    {
        title: 'History',
        dataIndex: 'playerHistory',
        key: 'playerHistory',
        render: (playerHistory, record, key) => (
            <span>
                {playerHistory.map((item, index) => (
                    <Tooltip
                        className="comp-player-table-tag2"
                        style={{ height: "100%" }}
                        onMouseEnter={() => this_obj.changeHover(item, key, index, true)}
                        onMouseLeave={() => this_obj.changeHover(item, key, index, false)}
                        visible={item.hoverVisible}

                        title={item.playerName}>
                        <NavLink to={{ pathname: `/userPersonal`, state: { userId: item.userId } }}
                        >
                            <Tag className="comp-player-table-tag" style={{ cursor: "pointer" }} key={item}>
                                {item.teamText}
                            </Tag>
                        </NavLink>
                    </Tooltip>
                ))}
            </span>
        ),
        sorter: (a, b) => tableSort(a, b, "playerHistory")

    },
    {
        title: 'Proposed Grade',
        dataIndex: 'proposedGradeRefId',
        key: 'proposedGradeRefId',
        render: (proposedGradeRefId, record, index) =>
            <Select className="select-inside-team-grades-table"
                onChange={proposedGradeRefId => this_obj.props.onchangeCompPartProposedTeamGradingData(proposedGradeRefId, index, "proposedGradeRefId")}
                value={proposedGradeRefId}
            >
                {this_obj.props.commonReducerState.gradesReferenceData.map(item => {
                    return (
                        <Option key={"proposedGradeRefId" + item.id} value={item.id}>
                            {item.description}
                        </Option>
                    );
                })}
            </Select>,
        sorter: (a, b) => tableSort(a, b, "proposedGradeRefId")


    },
    {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        width: 110,
        render: (comments, record) =>
            <div style={{ display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={() => this_obj.onClickComment(record)}>
                <img src={comments !== null && comments.length > 0 ? AppImages.commentFilled : AppImages.commentEmpty} alt="" height="25" width="25" />
            </div>,
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e, index) => (
            <Menu  className="action-triple-dot-submenu" theme="light" mode="horizontal"
                style={{ lineHeight: "25px" }}>
                <SubMenu key="sub1"
                    title={ <img className="dot-image" src={AppImages.moreTripleDot}
                            alt="" width="16" height="16"
                        />
                    }>
                     <Menu.Item key="1" onClick={() => this_obj.onClickChangeDivision(e)}>
                          <span>Change Division</span>
                     </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }


];


class CompetitionPartProposedTeamGrading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            divisionId: null,
            firstTimeCompId: "",
            saveLoad: false,
            visible: false,
            comment: null,
            teamId: null,
            responseCommentsCreatedBy: null,
            responseCommentsCreatedOn: null,
            responseComments: null,
            comments: null,
            commentsCreatedOn: null,
            commentsCreatedBy: null,
            finalGradeId: 0,
            proposedGradeID: 0,
            changeDivisionModalVisible: false,
            competitionDivisionId: null
        }
        this_obj = this;
        this.props.clearTeamGradingReducerDataAction("getPartProposedTeamGradingData")
    }


    componentDidUpdate(nextProps) {
        let competitionList = this.props.appState.participate_CompetitionArr
        let allDivisionsData = this.props.registrationState.allDivisionsData
        if (nextProps.appState !== this.props.appState) {
            if (nextProps.appState.participate_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId
                    setParticipating_competition(competitionId)
                    this.props.getDivisionsListAction(this.state.yearRefId, competitionId)
                    this.setState({ firstTimeCompId: competitionId })
                }
            }
        }
        if (nextProps.registrationState.allDivisionsData !== allDivisionsData) {
            if (allDivisionsData.length > 0) {
                let divisionId = allDivisionsData[0].competitionMembershipProductDivisionId
                this.props.getCompPartProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId)
                this.setState({ divisionId })
            }
        }
        if (this.props.ownTeamGradingState.onLoad === false && this.state.saveLoad === true) {
            this.props.getCompPartProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId)
            this.setState({ saveLoad: false })
        }

        if (nextProps.ownTeamGradingState != this.props.ownTeamGradingState) {
            if (this.props.ownTeamGradingState.onDivisionChangeLoad == false && this.state.loading === true) {
                this.setState({ loading: false });
                this.props.getCompPartProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId)
            }
        }

    }

    onClickChangeDivision = (record) =>{
        this.setState({
            changeDivisionModalVisible: true, teamId: record.teamId
        })
    }

    handleChangeDivision = (key) =>{
        if(key == "ok"){
            let payload = {
                competitionDivisionId: this.state.competitionDivisionId,
                teamId: this.state.teamId,
                competitionUniqueKey: this.state.firstTimeCompId,
                organisationUniqueKey: null
            }
            this.props.changeDivisionTeamAction(payload);
            this.setState({ loading: true })
            console.log("payload::" + JSON.stringify(payload));
        }
        this.setState({
            changeDivisionModalVisible: false, teamId: null,
            divisionId: this.state.competitionDivisionId
        })
    }


    changeHover(record, index, historyIndex, key) {
        this.props.changeProposedHistoryHover(record, index, historyIndex, key)

    }

    componentDidMount() {
        this.props.gradesReferenceListAction()
        let yearId = getParticipatingYear()
        let storedCompetitionId = getParticipating_competition()
        let propsData = this.props.appState.participate_YearArr.length > 0 ? this.props.appState.participate_YearArr : undefined
        let compData = this.props.appState.participate_CompetitionArr.length > 0 ? this.props.appState.participate_CompetitionArr : undefined
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                getDataLoading: true
            })
            this.props.getDivisionsListAction(yearId, storedCompetitionId)
        }
        else {
            if (yearId) {
                this.props.getYearAndCompetitionParticipateAction(this.props.appState.participate_YearArr, yearId, 'participate_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                })
            }
            else {
                this.props.getYearAndCompetitionParticipateAction(this.props.appState.participate_YearArr, yearId, 'participate_competition')
                setParticipatingYear(1)
            }
        }

    }


    onClickComment(record) {
        this.setState({
            visible: true, comment: record.comments,
            teamId: record.teamId,
            responseComments: record.responseComments, responseCommentsCreatedBy: record.responseCommentsCreatedBy,
            responseCommentsCreatedOn: moment(record.responseCommentsCreatedOn).format("DD-MM-YYYY HH:mm"),
            comments: record.comments, commentsCreatedOn: moment(record.commentsCreatedOn).format("DD-MM-YYYY HH:mm"), commentsCreatedBy: record.commentsCreatedBy,
            finalGradeId: record.proposedGradeRefId,
            proposedGradeID: record.proposedGradeRefId
        })
    }

    handleOk = e => {
        if (this.state.finalGradeId == null) {
            this.props.partProposedSummaryComment(this.state.firstTimeCompId, this.state.divisionId, this.state.teamId, this.state.comment)
        }
        this.setState({
            visible: false,
            comment: "",
            teamId: null,
            responseComments: null,
            responseCommentsCreatedBy: null,
            responseCommentsCreatedOn: null,
            comments: null,
            commentsCreatedOn: null,
            commentsCreatedBy: null,
            finalGradeId: null,
        });
    };
    // model cancel for dissapear a model
    handleCancel = e => {
        this.setState({
            visible: false,
            responseComments: null,
            responseCommentsCreatedBy: null,
            responseCommentsCreatedOn: null,
            comments: null,
            commentsCreatedOn: null,
            commentsCreatedBy: null,
            finalGradeId: null,
            teamId: null,
        });
    };


    ////save the final team grading data
    submitApiCall = (buttonClicked) => {
        let proposedTeamGradingData = this.props.ownTeamGradingState.getPartProposedTeamGradingData
        let isError = false;
        if(buttonClicked == "submit"){
            proposedTeamGradingData.map((item) => {
                if ((item.proposedGradeRefId == 0 || item.proposedGradeRefId == null || item.proposedGradeRefId == "" ||
                    item.proposedGradeRefId == undefined)) {
                    isError = true
                }
            })
        }

        if(!isError){
            let payload = {
                "competitionUniqueKey": this.state.firstTimeCompId,
                "competitionMembershipProductDivisionId": this.state.divisionId,
                "gradeRefId": this.state.gradeRefId,
                "teams": proposedTeamGradingData
            }
            this.props.savePartProposedTeamGradingDataAction(payload)
            this.setState({ saveLoad: true })
        }
        else{
            message.error(ValidationConstants.proposedGrading[0])
        }
       
    }

    exportTeams = () =>{
        let payload = {
            competitionId: this.state.firstTimeCompId,
            yearRefId: this.state.yearRefId
        }
        this.props.exportProposedTeamsAction(payload);
    }

    exportPlayers = () =>{
        let payload = {
            competitionId: this.state.firstTimeCompId,
            yearRefId: this.state.yearRefId
        }
        this.props.exportProposedPlayersAction(payload);
    }



    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.proposedTeamGrading}</Breadcrumb.Item>
                        </Breadcrumb>
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
                            <div  className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button className="primary-add-comp-form" type="primary"  onClick={() => this.exportPlayers()}>
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
        setParticipatingYear(yearId)
        setParticipating_competition(undefined)
        this.props.clearTeamGradingReducerDataAction("getPartProposedTeamGradingData")
        this.props.clearReducerDataAction("allDivisionsData")
        this.props.getYearAndCompetitionParticipateAction(this.props.appState.participate_YearArr, yearId, 'participate_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId, divisionId: null })
    }

    // on Competition change
    onCompetitionChange = (competitionId) => {
        setParticipating_competition(competitionId)
        this.props.clearTeamGradingReducerDataAction("getPartProposedTeamGradingData")
        this.props.clearReducerDataAction("allDivisionsData")
        this.setState({ firstTimeCompId: competitionId, divisionId: null })
        this.props.getDivisionsListAction(this.state.yearRefId, competitionId)
    }


    /////on division change
    onDivisionChange = (divisionId) => {
        this.props.getCompPartProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId)
        this.setState({ divisionId })
    }


    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select"
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {this.props.appState.participate_YearArr.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    style={{ minWidth: 160 }}
                                    name={"competition"}
                                    className="year-select"
                                    onChange={competitionId => this.onCompetitionChange(competitionId)}
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {this.props.appState.participate_CompetitionArr.map(item => {
                                        return (
                                            <Option key={"competition" + item.competitionId} value={item.competitionId}>
                                                {item.competitionName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div className="row" >
                                <div className="col-sm" >
                                    <div className="com-year-select-heading-view" >
                                        <span className='year-select-heading'>{AppConstants.division}:</span>
                                        <Select
                                            style={{ minWidth: 120 }}
                                            className="year-select"
                                            onChange={(divisionId) => this.onDivisionChange(divisionId)}
                                            value={JSON.parse(JSON.stringify(this.state.divisionId))}
                                        >
                                            {this.props.registrationState.allDivisionsData.map(item => {
                                                return (
                                                    <Option key={"division" + item.competitionMembershipProductDivisionId}
                                                        value={item.competitionMembershipProductDivisionId}>
                                                        {item.divisionName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-sm" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} >
                                    <span className='comp-grading-final-text ml-1' >{AppConstants.open}</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        )
    }


    ////////form content view
    contentView = () => {
        let getPartProposedTeamGradingData = this.props.ownTeamGradingState.getPartProposedTeamGradingData
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={getPartProposedTeamGradingData}
                        pagination={false}
                        loading={this.props.ownTeamGradingState.onLoad == true && true}
                    />
                </div>
                <CommentModal
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
                    affilate={this.state.responseCommentsCreatedBy}
                    affilateCreatedComment={this.state.responseCommentsCreatedOn}
                    affilateComment={this.state.responseComments}
                    finalGradeId={this.state.finalGradeId}
                    proposedGradeID={this.state.proposedGradeID}
                />

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.changeDivision}
                    visible={this.state.changeDivisionModalVisible}
                    onOk={ () => this.handleChangeDivision("ok")}
                    onCancel={() => this.handleChangeDivision("cancel")}>
                        <div className="change-division-modal">
                            <div className='year-select-heading'>{AppConstants.division}</div>
                            <Select
                                style={{ minWidth: 120 }}
                                className="year-select change-division-select"
                                onChange={(divisionId) => this.setState({competitionDivisionId: divisionId})}
                                value={JSON.parse(JSON.stringify(this.state.competitionDivisionId))}>
                                {this.props.registrationState.allDivisionsData.map(item => {
                                return (
                                    <Option key={"division" + item.competitionMembershipProductDivisionId}
                                        value={item.competitionMembershipProductDivisionId}>
                                        {item.divisionName}
                                    </Option>
                                )
                            })}
                            </Select>
                        </div>
                     
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
                            {this.state.divisionId!= null &&
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                {/* <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button> */}
                                <Button className="open-reg-button" style={{marginRight: '20px'}}
                                    onClick={() => this.submitApiCall("save")}
                                    type="primary">{AppConstants.save}
                                </Button>
                                <Button
                                    className="open-reg-button"
                                    type="primary"
                                    onClick={() => this.submitApiCall("submit")}>
                                    {AppConstants.submit}</Button>
                            </div>}
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
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"15"} />
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
        getYearAndCompetitionParticipateAction,
        getCompPartProposedTeamGradingAction,
        getDivisionsListAction,
        gradesReferenceListAction,
        savePartProposedTeamGradingDataAction,
        clearTeamGradingReducerDataAction,
        clearReducerDataAction,
        onchangeCompPartProposedTeamGradingData,
        partProposedSummaryComment,
        changeProposedHistoryHover,
        exportProposedTeamsAction,
        exportProposedPlayersAction,
        changeDivisionTeamAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        ownTeamGradingState: state.CompetitionOwnTeamGradingState,
        registrationState: state.RegistrationState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionPartProposedTeamGrading));
