import React, { Component } from "react";
import { Layout, Breadcrumb, Input, Button, Table, Select, Tag, Form, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getYearAndCompetitionAction } from "../../store/actions/appAction";
import { getDivisionsListAction, clearReducerDataAction } from "../../store/actions/registrationAction/registration";
import {
    getCompPartPlayerGradingAction, clearReducerCompPartPlayerGradingAction,
    addNewTeamAction, onDragPlayerAction, onSameTeamDragAction
} from "../../store/actions/competitionModuleAction/competitionPartPlayerGradingAction";
import {
    setParticipatingYear,
    getParticipatingYear,
    setParticipating_competition,
    getParticipating_competition,
} from "../../util/sessionStorage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader';
import InputWithHead from "../../customComponents/InputWithHead";

const { Header, Footer, Content } = Layout;
const { Option } = Select;



class CompetitionPartPlayerGrades extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            divisionId: null,
            firstTimeCompId: "",
            getDataLoading: false,
            newTeam: "",
            visible: false,
        }
        this.onDragEnd = this.onDragEnd.bind(this);
        this.props.clearReducerCompPartPlayerGradingAction("partPlayerGradingListData")
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
                this.props.getCompPartPlayerGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId)
                this.setState({ divisionId, getDataLoading: true })
            }
        }

    }


    componentDidMount() {
        let yearId = getParticipatingYear()
        let storedCompetitionId = getParticipating_competition()
        let propsData = this.props.appState.participate_YearArr.length > 0 ? this.props.appState.participate_YearArr : undefined
        let compData = this.props.appState.participate_CompetitionArr.length > 0 ? this.props.appState.participate_CompetitionArr : undefined
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                // getDataLoading: true
            })
            this.props.getDivisionsListAction(yearId, storedCompetitionId)
        }
        else {
            if (yearId) {
                this.props.getYearAndCompetitionAction(this.props.appState.participate_YearArr, yearId, 'participate_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                })
            }
            else {
                this.props.getYearAndCompetitionAction(this.props.appState.participate_YearArr, yearId, 'participate_competition')
                setParticipatingYear(1)
            }
        }

    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.playerGrading}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }


    //////year change onchange
    onYearChange = (yearId) => {
        setParticipatingYear(yearId)
        setParticipating_competition(undefined)
        this.props.clearReducerCompPartPlayerGradingAction("partPlayerGradingListData")
        this.props.clearReducerDataAction("allDivisionsData")
        this.props.getYearAndCompetitionAction(this.props.appState.participate_YearArr, yearId, 'participate_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId, divisionId: null })

    }

    // on Competition change
    onCompetitionChange = (competitionId) => {
        setParticipating_competition(competitionId)
        this.props.clearReducerCompPartPlayerGradingAction("partPlayerGradingListData")
        this.props.clearReducerDataAction("allDivisionsData")
        this.setState({ firstTimeCompId: competitionId, divisionId: null })
        this.props.getDivisionsListAction(this.state.yearRefId, competitionId)
    }


    /////on division change
    onDivisionChange = (divisionId) => {
        this.props.getCompPartPlayerGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId)
        this.setState({ divisionId })
    }

    // model visible
    addNewTeam = () => {
        this.setState({ visible: true })
    }
    // model ok button
    handleOk = e => {
        this.props.addNewTeamAction(this.state.firstTimeCompId, this.state.divisionId, this.state.newTeam)
        this.setState({
            visible: false,
            newNameMembershipType: ""
        });
    };

    // model cancel for dissapear a model
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };


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
                                alignItems: "center",
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
                        <div className="row" >
                            <div className="col-sm" >
                                <div className="col-sm" style={{
                                    width: "100%", display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }} >
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
                                <span className='comp-grading-final-text'>{AppConstants.open}</span>
                            </div>
                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end", alignSelf: "center" }} >
                            <NavLink to="/competitionPartPlayerGradeCalculate" >
                                <span className='year-select-heading'>{AppConstants.playerGradingToggle}</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    onDragEnd = result => {
        const { source, destination } = result;
        console.log(source, destination)
        let assignedPlayerData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData
        let unassignedPlayerData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData
        let playerId
        // dropped outside the list
        if (!destination) {
            return;
        }
        else if (source.droppableId !== destination.droppableId) {
            let teamId = destination !== null && destination.droppableId == 0 ? null : JSON.parse(destination.droppableId)
            if (teamId !== null) {
                playerId = unassignedPlayerData.players[source.index].playerId
            }
            else {
                for (let i in assignedPlayerData) {
                    if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                        console.log(assignedPlayerData[i].players[source.index])
                        playerId = assignedPlayerData[i].players[source.index].playerId
                    }
                }
            }
            this.props.onDragPlayerAction(this.state.firstTimeCompId, teamId, playerId, source, destination)
        }
        else {
            this.props.onSameTeamDragAction(source, destination)
        }


        // if (source.droppableId === destination.droppableId) {
        //     const items = reorder(
        //         this.getList(source.droppableId),
        //         source.index,
        //         destination.index
        //     );

        //     let state = { items };

        //     if (source.droppableId === 'droppable2') {
        //         state = { selected: items };
        //     }

        //     this.setState(state);
        // } else {
        //     const result = move(
        //         this.getList(source.droppableId),
        //         this.getList(destination.droppableId),
        //         source,
        //         destination
        //     );

        //     this.setState({
        //         items: result.droppable,
        //         selected: result.droppable2
        //     });
        // }
    };



    //////for the assigned teams on the left side of the view port
    assignedView = () => {
        let assignedData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData
        console.log(assignedData)
        return (
            <div className="d-flex flex-column">
                {assignedData.map((teamItem, teamIndex) =>
                    (
                        <Droppable droppableId={`${teamItem.teamId}`} >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className="player-grading-droppable-view"
                                >
                                    <div className="player-grading-droppable-heading-view" >
                                        <div className="row" >
                                            <div className="col-sm d-flex align-items-center">
                                                <span className="player-grading-haeding-team-name-text">{teamItem.teamName}</span>
                                                <span className="player-grading-haeding-player-count-text ml-2">
                                                    {teamItem.players.length > 1 ? teamItem.players.length + " Players" : teamItem.players.length + " Player"} </span>
                                            </div>
                                            <div
                                                className="col-sm d-flex justify-content-end "
                                            >
                                                <a className="view-more-btn collapsed" data-toggle="collapse" href={`#${teamIndex}`} role="button" aria-expanded="false" aria-controls={teamIndex}>
                                                    <i class="fa fa-angle-down" style={{ color: "#ff8237", }} aria-hidden="true" ></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse" id={teamIndex}>
                                        {teamItem.players.length > 0 && teamItem.players.map((playerItem, playerIndex) => (
                                            <Draggable
                                                key={JSON.stringify(playerItem.playerId)}
                                                draggableId={JSON.stringify(playerItem.playerId)}
                                                index={playerIndex}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="player-grading-draggable-view"
                                                    >
                                                        <div className="row" >
                                                            <div className="col-sm d-flex align-items-center"  >
                                                                <span className="player-grading-haeding-player-name-text">{playerItem.playerName}</span>
                                                            </div>
                                                            <div
                                                                className="col-sm d-flex justify-content-end "
                                                                style={{ flexFlow: 'wrap' }}>
                                                                <div className="col-sm">
                                                                    {playerItem.playerHistory.map(item => {
                                                                        return (
                                                                            <Tag className="comp-player-table-tag" key={item.teamId}>
                                                                                {item.teamText}
                                                                            </Tag>

                                                                        )
                                                                    })}
                                                                </div>
                                                                <div>
                                                                    <Tag className="comp-player-table-tag" style={{ background: '#ee3346', color: "#ffffff" }} key={playerItem.position1}>
                                                                        {playerItem.position1}
                                                                    </Tag>
                                                                    <Tag className="comp-player-table-tag" style={{ background: "#1658ef", color: "#ffffff" }} key={playerItem.position2}>
                                                                        {playerItem.position2}
                                                                    </Tag>

                                                                    <img className="comp-player-table-img" src={playerItem.comments !== null ? AppImages.commentFilled : AppImages.commentEmpty} alt="" height="20" width="20" />
                                                                    {/* </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </Draggable>


                                        ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )
                            }
                        </Droppable>
                    ))
                }
            </div>

        )
    }

    ////////for the unassigned teams on the right side of the view port
    unassignedView = () => {
        let unassignedData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData;
        return (
            <div>
                <Droppable droppableId={'0'}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className="player-grading-droppable-view">
                            <div className="player-grading-droppable-heading-view">
                                <div className="row" >
                                    <div className="col-sm d-flex align-items-center"  >
                                        <span className="player-grading-haeding-team-name-text">{AppConstants.unassigned}</span>
                                        <span className="player-grading-haeding-player-count-text ml-2">
                                            {unassignedData.players.length > 1 ? unassignedData.players.length + " Players" : unassignedData.players.length + " Player"}
                                        </span>
                                    </div>
                                    <div className="col-sm d-flex justify-content-end">
                                        <Button className="primary-add-comp-form" type="primary" onClick={this.addNewTeam}  >
                                            + {AppConstants.createTeam}
                                        </Button>

                                    </div>

                                </div>
                            </div>
                            {unassignedData.players && unassignedData.players.map((playerItem, playerIndex) => (
                                <Draggable
                                    key={JSON.stringify(playerItem.playerId)}
                                    draggableId={JSON.stringify(playerItem.playerId)}
                                    index={playerIndex}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="player-grading-draggable-view">

                                            <span className="player-grading-haeding-player-name-text">{playerItem.playerName}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                        </div>
                    )}
                </Droppable>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.addTeam}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputWithHead
                        required={"pt-0 mt-0"}
                        heading={AppConstants.addTeam}
                        placeholder={AppConstants.pleaseEnterteamName}
                        onChange={(e) => this.setState({ newTeam: e.target.value })}
                        value={this.state.newTeam}
                    />

                </Modal>
            </div>
        )
    }



    ////////form content view
    contentView = () => {
        return (
            <div className="comp-dash-table-view mt-2">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="d-flex flex-row justify-content-between">
                        {this.assignedView()}
                        {this.unassignedView()}
                    </div>
                </DragDropContext>
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
                            <div className="comp-finals-button-view">
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.save}</Button>
                                <NavLink to="/competitionPartProposedTeamGrading">
                                    <Button className="open-reg-button" type="primary">{AppConstants.gradeAndNameTeams}</Button>
                                </NavLink>
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
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"14"} />
                <Layout>
                    {this.headerView()}

                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                        <Loader

                            visible={
                                this.props.partPlayerGradingState.onLoad || this.props.appState.onLoad
                            } />
                    </Content>

                    <Footer>
                        {/* {this.footerView()} */}
                    </Footer>
                </Layout>
            </div>

        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getYearAndCompetitionAction,
        getDivisionsListAction,
        clearReducerDataAction,
        getCompPartPlayerGradingAction,
        clearReducerCompPartPlayerGradingAction,
        addNewTeamAction,
        onDragPlayerAction,
        onSameTeamDragAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        partPlayerGradingState: state.CompetitionPartPlayerGradingState,
        registrationState: state.RegistrationState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionPartPlayerGrades));
