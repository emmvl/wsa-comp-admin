import React, { Component } from "react";
import {
    Layout, Breadcrumb, Checkbox, Button, Menu, Select, Tag, Modal, Dropdown,
} from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tooltip from 'react-png-tooltip';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { getYearAndCompetitionParticipateAction } from "../../store/actions/appAction";
import { getDivisionsListAction, clearReducerDataAction } from "../../store/actions/registrationAction/registration";
import {
    getCompPartPlayerGradingAction, clearReducerCompPartPlayerGradingAction,
    addNewTeamAction, onDragPlayerAction, onSameTeamDragAction,
    playerGradingComment, deleteTeamAction, addOrRemovePlayerForChangeDivisionAction,
    changeDivisionPlayerAction, commentListingAction, exportPlayerGrades,
} from "../../store/actions/competitionModuleAction/competitionPartPlayerGradingAction";
import {
    setGlobalYear, getGlobalYear,
    setParticipating_competition,
    getParticipating_competition,
    getParticipating_competitionStatus,
    setParticipating_competitionStatus,
} from "../../util/sessionStorage";
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader';
import InputWithHead from "../../customComponents/InputWithHead";
// import ColorsArray from "../../util/colorsArray";
import PlayerCommentModal from "../../customComponents/playerCommentModal";

const {
    // Header,
    Footer,
    Content
} = Layout;
const { Option } = Select;
let this_obj = null;

// const colors = JSON.parse(JSON.stringify(ColorsArray));
// const reverseColors = colors.reverse();

const menu = (
    <Menu>
        <Menu.Item onClick={() => this_obj.changeDivisionModal()}>
            Change Division
        </Menu.Item>
    </Menu>
);

class CompetitionPartPlayerGrades extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: null,
            divisionId: null,
            firstTimeCompId: "",
            getDataLoading: false,
            newTeam: "",
            visible: false,
            modalVisible: false,
            comment: null,
            playerId: null,
            teamID: null,
            commentsCreatedBy: null,
            commentsCreatedOn: null,
            comments: null,
            deleteModalVisible: false,
            loading: false,
            changeDivisionModalVisible: false,
            competitionDivisionId: null,
            divisionLoad: false,
            competitionStatus: 0,
        };
        this_obj = this;
        this.onDragEnd = this.onDragEnd.bind(this);
        this.props.clearReducerCompPartPlayerGradingAction("partPlayerGradingListData");
    }

    componentDidUpdate(nextProps) {
        const competitionList = this.props.appState.participate_CompetitionArr;
        const { allDivisionsData } = this.props.registrationState;
        if (nextProps.appState !== this.props.appState) {
            if (nextProps.appState.participate_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    const { competitionId } = competitionList[0];
                    const { statusRefId } = competitionList[0];
                    setParticipating_competition(competitionId);
                    setParticipating_competitionStatus(statusRefId);
                    const yearId = this.state.yearRefId ? this.state.yearRefId : getGlobalYear();
                    this.props.getDivisionsListAction(yearId, competitionId);
                    this.setState({ firstTimeCompId: competitionId, competitionStatus: statusRefId, yearRefId: JSON.parse(yearId) });
                }
            }
        }
        if (nextProps.registrationState.allDivisionsData !== allDivisionsData) {
            if (allDivisionsData.length > 0) {
                const divisionId = allDivisionsData[0].competitionMembershipProductDivisionId;
                this.props.getCompPartPlayerGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId);
                this.setState({ divisionId, getDataLoading: true });
            }
        }

        if (nextProps.partPlayerGradingState != this.props.partPlayerGradingState) {
            if (this.props.partPlayerGradingState.onTeamDeleteLoad == false && this.state.loading === true) {
                this.setState({ loading: false });
                this.props.getCompPartPlayerGradingAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId);
            }
        }

        if (nextProps.partPlayerGradingState != this.props.partPlayerGradingState) {
            if (this.props.partPlayerGradingState.onDivisionChangeLoad == false && this.state.divisionLoad === true) {
                this.setState({ divisionLoad: false });
                this.props.getCompPartPlayerGradingAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId);
            }
        }
    }

    componentDidMount() {
        const yearId = getGlobalYear();
        const storedCompetitionId = getParticipating_competition();
        const storedCompetitionStatus = getParticipating_competitionStatus();
        const propsData = this.props.appState.participate_YearArr.length > 0 ? this.props.appState.participate_YearArr : undefined;
        const compData = this.props.appState.participate_CompetitionArr.length > 0 ? this.props.appState.participate_CompetitionArr : undefined;
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                competitionStatus: storedCompetitionStatus,
                // getDataLoading: true
            });
            this.props.getDivisionsListAction(yearId, storedCompetitionId);
        } else if (yearId) {
            this.props.getYearAndCompetitionParticipateAction(this.props.appState.participate_YearArr, yearId, 'participate_competition');
            this.setState({
                yearRefId: JSON.parse(yearId),
            });
        } else {
            this.props.getYearAndCompetitionParticipateAction(this.props.appState.participate_YearArr, yearId, 'participate_competition');
        }
    }

    exportPlayerData = () => {
        this.props.exportPlayerGrades(this.state.divisionId, this.state.firstTimeCompId)
    }

    ///////view for breadcrumb
    headerView = () => (
        <div className="comp-player-grades-header-view-design">
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.playerGrading}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Tooltip placement="top">
                        <span>{AppConstants.playerGradingMsg}</span>
                    </Tooltip>
                </div>
                <div className="col-sm d-flex flex-row align-items-center justify-content-end w-100 mr-22">
                    <div className="row">
                        <div className="col-sm">
                            <div className="comp-dashboard-botton-view-mobile">
                                <Dropdown disabled={this.state.competitionStatus == 1} overlay={menu} placement="bottomLeft">
                                    <Button className="primary-add-comp-form" type="primary">
                                        <div className="row">
                                            <div className="col-sm">
                                                <img src={AppImages.import} alt="" className="export-image" />
                                                {AppConstants.action}
                                            </div>
                                        </div>
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        {this.state.divisionId != null && (
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <NavLink
                                        to={{
                                            pathname: `/competitionPlayerImport`,
                                            state: { divisionId: this.state.divisionId, competitionId: this.state.firstTimeCompId, screenNavigationKey: 'ProposedPlayerGrading' },
                                        }}
                                    >
                                        <Button disabled={this.state.competitionStatus == 1} className="primary-add-comp-form" type="primary">
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.import}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.playerImport}
                                                </div>
                                            </div>
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                        )}
                        {this.state.divisionId != null && (
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <NavLink
                                        to={{
                                            pathname: `/competitionTeamsImport`,
                                            state: { competitionId: this.state.firstTimeCompId, screenNavigationKey: 'ProposedPlayerGrading' },
                                        }}
                                    >
                                        <Button disabled={this.state.competitionStatus == 1} className="primary-add-comp-form" type="primary">
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.import}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.importTeams}
                                                </div>
                                            </div>
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                        )}

                        {this.state.divisionId != null && (
                            <div className="col-sm">
                                <div className="comp-dashboard-botton-view-mobile">
                                    <Button onClick={() => this.exportPlayerData()} disabled={this.state.competitionStatus == 1} className="primary-add-comp-form" type="primary">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    onYearChange = (yearId) => {
        setGlobalYear(yearId);
        setParticipating_competition(undefined);
        setParticipating_competitionStatus(undefined);
        this.props.clearReducerCompPartPlayerGradingAction("partPlayerGradingListData");
        this.props.clearReducerDataAction("allDivisionsData");
        this.props.getYearAndCompetitionParticipateAction(this.props.appState.participate_YearArr, yearId, 'participate_competition');
        this.setState({
            firstTimeCompId: null, yearRefId: yearId, divisionId: null, competitionStatus: 0,
        });
    }

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        setParticipating_competition(competitionId);
        setParticipating_competitionStatus(statusRefId);
        this.props.clearReducerCompPartPlayerGradingAction("partPlayerGradingListData");
        this.props.clearReducerDataAction("allDivisionsData");
        this.setState({ firstTimeCompId: competitionId, divisionId: null, competitionStatus: statusRefId });
        this.props.getDivisionsListAction(this.state.yearRefId, competitionId);
    }

    //on division change
    onDivisionChange = (divisionId) => {
        this.props.getCompPartPlayerGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId);
        this.setState({ divisionId });
    }

    // model visible
    addNewTeam = () => {
        this.setState({ visible: true });
    }

    // model ok button
    handleOk = (e) => {
        this.props.addNewTeamAction(this.state.firstTimeCompId, this.state.divisionId, this.state.newTeam);
        this.setState({
            visible: false,
            newNameMembershipType: "",
            newTeam: "",
        });
    };

    // model cancel for disappear a model
    handleCancel = (e) => {
        this.setState({
            visible: false,
            newTeam: "",
        });
    };

    onChangeParentDivCheckbox = (checked, teamIndex, key) => {
        if (key === "assigned") {
            const assignedData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData;
            const teamItem = assignedData[teamIndex];
            teamItem.isChecked = checked;

            (teamItem.players || []).forEach(item => {
                item.isChecked = checked;
            });
            this.props.addOrRemovePlayerForChangeDivisionAction(assignedData, key);
        } else if (key === "unAssigned") {
            const unassignedData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData;
            unassignedData.isChecked = checked;

            (unassignedData.players || []).forEach(item => {
                item.isChecked = checked;
            });
            this.props.addOrRemovePlayerForChangeDivisionAction(unassignedData, key);
        }
    }

    onChangeChildDivCheckbox = (checked, teamIndex, playerIndex, key) => {
        if (key === "assigned") {
            const assignedData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData;
            const teamItem = assignedData[teamIndex];
            // teamItem["isChecked"] = checked;
            teamItem.players[playerIndex].isChecked = checked;

            let flag = true;
            (teamItem.players || []).forEach(item => {
                if (!item.isChecked) {
                    flag = false;
                }
            });
            if (flag) {
                teamItem.isChecked = true;
            } else {
                teamItem.isChecked = false;
            }
            this.props.addOrRemovePlayerForChangeDivisionAction(assignedData, key);
        } else if (key === "unAssigned") {
            const unassignedData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData;
            // teamItem["isChecked"] = checked;
            unassignedData.players[playerIndex].isChecked = checked;

            let flag = true;
            (unassignedData.players || []).forEach(item => {
                if (!item.isChecked) {
                    flag = false;
                }
            });
            if (flag) {
                unassignedData.isChecked = true;
            } else {
                unassignedData.isChecked = false;
            }
            this.props.addOrRemovePlayerForChangeDivisionAction(unassignedData, key);
        }
    }

    changePlayerDivision = (key) => {
        if (key === "ok") {
            const res = {
                competitionUniqueKey: this.state.firstTimeCompId,
                organisationUniqueKey: null,
                competitionDivisionId: this.state.competitionDivisionId,
                players: [],
                teams: [],
            };

            const assignedData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData;

            if (assignedData != null && assignedData.length > 0) {
                (assignedData || []).forEach(team => {
                    if (team.isChecked) {
                        const obj = {
                            teamId: team.teamId,
                        };
                        res.teams.push(obj);
                    }
                    (team.players || []).forEach(item => {
                        if (item.isChecked) {
                            const obj = {
                                playerId: item.playerId,
                                teamId: team.teamId,
                            };
                            res.players.push(obj);
                        }
                    });
                });
            }
            const unassignedData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData;

            if (unassignedData != null && unassignedData.players.length > 0) {
                (unassignedData.players || []).map(item => {
                    if (item.isChecked) {
                        const obj = {
                            playerId: item.playerId,
                        };
                        res.players.push(obj);
                    }
                });
            }

            this.setState({ divisionId: this.state.competitionDivisionId });
            this.props.changeDivisionPlayerAction(res);
            this.setState({ divisionLoad: true });
        }

        this.setState({ changeDivisionModalVisible: false });
    }

    changeDivisionModal = () => {
        this.setState({ changeDivisionModalVisible: true });
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="com-year-select-heading-view pb-3">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    name="yearRefId"
                                    style={{ width: 90 }}
                                    className="year-select reg-filter-select-year ml-2"
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {this.props.appState.participate_YearArr.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm pb-3">
                            <div className="w-ft d-flex flex-row align-items-center">
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    name="competition"
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={(competitionId, e) => this.onCompetitionChange(competitionId, e.key)}
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {this.props.appState.participate_CompetitionArr.map(item => (
                                        <Option key={'competition_' + item.competitionId} value={item.competitionId}>
                                            {item.competitionName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm pb-3">
                                <div className="col-sm w-100 d-flex flex-row align-items-center">
                                    <span className="year-select-heading">{AppConstants.division}:</span>
                                    <Select
                                        disabled={this.state.competitionStatus == 1}
                                        style={{ minWidth: 120 }}
                                        className="year-select reg-filter-select1 ml-2"
                                        onChange={(divisionId) => this.onDivisionChange(divisionId)}
                                        value={JSON.parse(JSON.stringify(this.state.divisionId))}
                                    >
                                        {this.props.registrationState.allDivisionsData.map(item => (
                                            <Option
                                                key={'compMemProdDiv_' + item.competitionMembershipProductDivisionId}
                                                value={item.competitionMembershipProductDivisionId}
                                            >
                                                {item.divisionName}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-sm-2 pb-3 d-flex justify-content-start align-items-center">
                                <span className="comp-grading-final-text">{AppConstants.open}</span>
                            </div>
                        </div>
                        <div className="col-sm pb-3 d-flex justify-content-end align-self-center">
                            <NavLink to="/competitionPartPlayerGradeCalculate">
                                <span className="input-heading-add-another pt-0">{AppConstants.playerGradingToggle}</span>
                            </NavLink>
                            <div style={{ marginTop: -5 }}>
                                <Tooltip placement="top">
                                    <span>{AppConstants.playerGradingToggleMsg}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onDragEnd = (result) => {
        const { source, destination } = result;
        const assignedPlayerData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData;
        const unassignedPlayerData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData;
        let playerId;
        // dropped outside the list
        if (!destination) {

        } else if (source.droppableId !== destination.droppableId) {
            const teamId = destination !== null && destination.droppableId == 0 ? null : JSON.parse(destination.droppableId);
            const sourceTeamID = source !== null && source.droppableId == 0 ? null : JSON.parse(source.droppableId);
            if (teamId !== null) {
                if (sourceTeamID == null) {
                    playerId = unassignedPlayerData.players[source.index].playerId;
                } else {
                    for (const i in assignedPlayerData) {
                        if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                            playerId = assignedPlayerData[i].players[source.index].playerId;
                        }
                    }
                }
            } else {
                for (const i in assignedPlayerData) {
                    if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                        playerId = assignedPlayerData[i].players[source.index].playerId;
                    }
                }
            }
            this.props.onDragPlayerAction(this.state.firstTimeCompId, teamId, playerId, source, destination);
        } else {
            this.props.onSameTeamDragAction(source, destination);
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
        const disableStatus = this.state.competitionStatus == 1;
        const assignedData = this.props.partPlayerGradingState.assignedPartPlayerGradingListData;
        const commentList = this.props.partPlayerGradingState.playerCommentList;
        const { commentLoad } = this.props.partPlayerGradingState;
        return (
            <div className="d-flex flex-column">
                {assignedData.map((teamItem, teamIndex) => (
                    <Droppable
                        isDropDisabled={disableStatus}
                        droppableId={`${teamItem.teamId}`}
                    >
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                className="player-grading-droppable-view"
                            >
                                <div className="player-grading-droppable-heading-view">
                                    <div className="row">
                                        <Checkbox
                                            disabled={disableStatus}
                                            className="single-checkbox mt-1 check-box-player"
                                            checked={teamItem.isChecked}
                                            onChange={e => this.onChangeParentDivCheckbox(e.target.checked, teamIndex, "assigned")}
                                        />
                                        <div className="col-sm d-flex align-items-center">
                                            <span className="player-grading-haeding-team-name-text">{teamItem.teamName}</span>
                                            <span className="player-grading-haeding-player-count-text ml-2">
                                                {teamItem.players.length > 1 ? `${teamItem.players.length} Players` : `${teamItem.players.length} Player`}
                                            </span>
                                        </div>
                                        <div className="col-sm d-flex justify-content-end">
                                            <img
                                                className="comp-player-table-img team-delete-link pointer"
                                                src={AppImages.deleteImage}
                                                alt=""
                                                height="20"
                                                width="20"
                                                onClick={() => disableStatus == false && this.onClickDeleteTeam(teamItem, teamIndex)}
                                            />
                                            <a className="view-more-btn collapsed" data-toggle="collapse" href={`#${teamIndex}`} role="button" aria-expanded="false" aria-controls={teamIndex}>
                                                <i className="fa fa-angle-down" style={{ color: "#ff8237", }} aria-hidden="true" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="collapse" id={teamIndex}>
                                    {teamItem.players.map((playerItem, playerIndex) => (
                                        <Draggable
                                            isDragDisabled={disableStatus}
                                            key={JSON.stringify(playerItem.playerId)}
                                            draggableId={JSON.stringify(playerItem.playerId)}
                                            index={playerIndex}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="player-grading-draggable-view"
                                                >
                                                    <div className="row">
                                                        <Checkbox
                                                            disabled={disableStatus}
                                                            checked={playerItem.isChecked}
                                                            className="single-checkbox mt-1 check-box-player"
                                                            onChange={e => this.onChangeChildDivCheckbox(e.target.checked, teamIndex, playerIndex, "assigned")}>
                                                        </Checkbox>
                                                        <div className="col-sm d-flex align-items-center">
                                                            {disableStatus == false ? (
                                                                <NavLink
                                                                    to={{
                                                                        pathname: `/userPersonal`,
                                                                        state: { userId: playerItem.userId, screenKey: 'competitionPartPlayerGrades', screen: "/competitionPartPlayerGrades" },
                                                                    }}
                                                                >
                                                                    <span className="player-grading-player-name-text pointer">
                                                                        {playerItem.playerName}
                                                                    </span>
                                                                </NavLink>
                                                            ) : (
                                                                    <span className="player-grading-player-name-text pointer">
                                                                        {playerItem.playerName}
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <div className="col-sm d-flex justify-content-end flex-wrap">
                                                            {/* <div className="col-sm">
                                                                {playerItem.playerHistory.map((item, index) => (
                                                                    <Tag className="comp-player-table-tag" key={item.teamId}>
                                                                        {item.teamText}
                                                                    </Tag>
                                                                ))}
                                                            </div> */}
                                                            <div className="d-flex">
                                                                {playerItem.position1 && (
                                                                    <Tag className="comp-player-table-tag text-white" style={{ background: playerItem.position1Color }} key={playerItem.position1}>
                                                                        {playerItem.position1}
                                                                    </Tag>
                                                                )}
                                                                {playerItem.position2 && (
                                                                    <Tag className="comp-player-table-tag text-white" style={{ background: playerItem.position2Color }} key={playerItem.position2}>
                                                                        {playerItem.position2}
                                                                    </Tag>
                                                                )}
                                                                <div className="col-sm d-flex">
                                                                    {playerItem.playerHistory.map((item, index) => (
                                                                        item.divisionGrade != null && item.divisionGrade != "" && (
                                                                            <Tag className="comp-player-table-tag" key={item.divisionGrade + index}>
                                                                                {`${item.divisionGrade}(${item.ladderResult})`}
                                                                            </Tag>
                                                                        )
                                                                    ))}
                                                                </div>
                                                                <img
                                                                    className="comp-player-table-img pointer"
                                                                    src={playerItem.isCommentsAvailable == 1
                                                                        ? AppImages.commentFilled
                                                                        : AppImages.commentEmpty}
                                                                    alt=""
                                                                    height="20"
                                                                    width="20"
                                                                    onClick={() => disableStatus == false && this.onClickComment(playerItem, teamIndex)}
                                                                />
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
                        )}
                    </Droppable>
                ))}

                <PlayerCommentModal
                    visible={this.state.modalVisible}
                    modalTitle={AppConstants.add_edit_comment}
                    onOK={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    placeholder={AppConstants.addYourComment}
                    onChange={(e) => this.setState({ comment: e.target.value })}
                    value={this.state.comment}
                    commentList={commentList}
                    commentLoad={commentLoad}
                />

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.deleteTeam}
                    visible={this.state.deleteModalVisible}
                    onOk={this.handleDeleteTeamOk}
                    onCancel={this.handleDeleteTeamCancel}
                >
                    <p>Are you sure you want to delete?</p>
                </Modal>
            </div>
        );
    }

    onClickComment(player, teamID) {
        this.props.commentListingAction(this.state.firstTimeCompId, player.playerId, "1");
        this.setState({
            modalVisible: true,
            comment: "",
            playerId: player.playerId,
            teamID,
        });
    }

    handleDeleteTeamOk = () => {
        this.setState({ deleteModalVisible: false });
        const payload = {
            competitionUniqueKey: this.state.firstTimeCompId,
            organisationId: '',
            teamId: this.state.teamID,
            competitionMembershipProductDivisionId: this.state.divisionId,
        };
        this.props.deleteTeamAction(payload);
        this.setState({ loading: true });
    }

    handleDeleteTeamCancel = () => {
        this.setState({ deleteModalVisible: false });
    }

    onClickDeleteTeam = async (teamItem, teamIndex) => {
        await this.setState({ teamID: teamItem.teamId, deleteModalVisible: true });
    }

    ///modal ok for hitting Api and close modal
    handleModalOk = (e) => {
        this.props.clearReducerCompPartPlayerGradingAction("commentList");
        if (this.state.comment.length > 0) {
            this.props.playerGradingComment(this.state.firstTimeCompId, this.state.divisionId, this.state.comment, this.state.playerId, this.state.teamID);
        }
        this.setState({
            modalVisible: false,
            comment: "",
            playerId: null,
            teamID: null,
        });
    };

    // model cancel for disappear a model
    handleModalCancel = (e) => {
        this.props.clearReducerCompPartPlayerGradingAction("commentList");
        this.setState({
            modalVisible: false,
            comment: "",
            playerId: null,
            teamID: null,
        });
    };

    ////////for the unassigned teams on the right side of the view port
    unassignedView = () => {
        const unassignedData = this.props.partPlayerGradingState.unassignedPartPlayerGradingListData;
        const divisionData = this.props.registrationState.allDivisionsData.filter((x) => x.competitionMembershipProductDivisionId != null);
        const commentList = this.props.partPlayerGradingState.playerCommentList;
        const { commentLoad } = this.props.partPlayerGradingState;
        const disableStatus = this.state.competitionStatus == 1;
        return (
            <div>
                <Droppable isDropDisabled={disableStatus} droppableId="0">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className="player-grading-droppable-view"
                        >
                            <div className="player-grading-droppable-heading-view">
                                <div className="row">
                                    <Checkbox
                                        disabled={disableStatus}
                                        className="single-checkbox mt-1 check-box-player"
                                        checked={unassignedData.isChecked}
                                        onChange={(e) => this.onChangeParentDivCheckbox(e.target.checked, 0, "unAssigned")}
                                    />
                                    <div className="col-sm d-flex align-items-center">
                                        <span className="player-grading-haeding-team-name-text">{AppConstants.unassigned}</span>
                                        <span className="player-grading-haeding-player-count-text ml-2">
                                            {unassignedData.players.length > 1 ? `${unassignedData.players.length} Players` : `${unassignedData.players.length} Player`}
                                        </span>
                                    </div>
                                    {this.state.divisionId != null && (
                                        <div className="col-sm d-flex justify-content-end">
                                            <Button disabled={disableStatus} className="primary-add-comp-form" type="primary" onClick={this.addNewTeam}>
                                                + {AppConstants.createTeam}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {unassignedData.players && unassignedData.players.map((playerItem, playerIndex) => (
                                <Draggable
                                    isDragDisabled={disableStatus}
                                    key={JSON.stringify(playerItem.playerId)}
                                    draggableId={JSON.stringify(playerItem.playerId)}
                                    index={playerIndex}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="player-grading-draggable-view"
                                        >
                                            <div className="row">
                                                <Checkbox
                                                    disabled={disableStatus}
                                                    checked={playerItem.isChecked}
                                                    className="single-checkbox mt-1 check-box-player"
                                                    onChange={(e) => this.onChangeChildDivCheckbox(e.target.checked, 0, playerIndex, "unAssigned")}
                                                />
                                                <div className="col-sm d-flex align-items-center">
                                                    {disableStatus == false ? (
                                                        <NavLink
                                                            to={{
                                                                pathname: `/userPersonal`,
                                                                state: { userId: playerItem.userId, screen: "/competitionPartPlayerGrades", screenKey: 'competitionPartPlayerGrades' }
                                                            }}
                                                        >
                                                            <span className="player-grading-player-name-text pointer">
                                                                {playerItem.playerName}
                                                            </span>
                                                        </NavLink>
                                                    ) : (
                                                            <span className="player-grading-player-name-text pointer">
                                                                {playerItem.playerName}
                                                            </span>
                                                        )}
                                                </div>
                                                <div className="col-sm d-flex justify-content-end flex-wrap">
                                                    {/* <div className="col-sm">
                                                        {playerItem.playerHistory.map((item, index) => (
                                                            <Tag className="comp-player-table-tag" key={item.teamId}>
                                                                {item.teamText}
                                                            </Tag>
                                                        ))}
                                                    </div> */}
                                                    <div className="d-flex">
                                                        {playerItem.position1 && (
                                                            <Tag className="comp-player-table-tag text-white" style={{ background: playerItem.position1Color }} key={playerItem.position1}>
                                                                {playerItem.position1}
                                                            </Tag>
                                                        )}
                                                        {playerItem.position2 && (
                                                            <Tag className="comp-player-table-tag text-white" style={{ background: playerItem.position2Color }} key={playerItem.position2}>
                                                                {playerItem.position2}
                                                            </Tag>
                                                        )}
                                                        <div className="col-sm d-flex">
                                                            {playerItem.playerHistory.map((item, index) => (
                                                                item.divisionGrade != null && item.divisionGrade != "" && (
                                                                    <Tag className="comp-player-table-tag" key={item.divisionGrade + index}>
                                                                        {`${item.divisionGrade}(${item.ladderResult})`}
                                                                    </Tag>
                                                                )
                                                            ))}
                                                        </div>
                                                        <img
                                                            className="comp-player-table-img pointer"
                                                            src={playerItem.isCommentsAvailable == 1
                                                                ? AppImages.commentFilled
                                                                : AppImages.commentEmpty}
                                                            alt=""
                                                            height="20"
                                                            width="20"
                                                            onClick={() => disableStatus == false && this.onClickComment(playerItem, null)}
                                                        />
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {/* </Draggable> */}
                            {/* ))} */}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.addTeam}
                    visible={this.state.visible}
                    onOk={() => this.handleOk()}
                    onCancel={() => this.handleCancel()}
                >
                    <InputWithHead
                        auto_complete="off"
                        required="pt-0 mt-0"
                        heading={AppConstants.addTeam}
                        placeholder={AppConstants.pleaseEnterTeamName}
                        onChange={(e) => this.setState({ newTeam: e.target.value })}
                        value={this.state.newTeam}
                    />
                </Modal>
                <PlayerCommentModal
                    visible={this.state.modalVisible}
                    modalTitle={AppConstants.add_edit_comment}
                    onOk={() => this.handleModalOk()}
                    // onOK={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    placeholder={AppConstants.addYourComment}
                    onChange={(e) => this.setState({ comment: e.target.value })}
                    value={this.state.comment}
                    commentList={commentList}
                    commentLoad={commentLoad}
                />

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.changeDivision}
                    visible={this.state.changeDivisionModalVisible}
                    onOk={() => this.changePlayerDivision("ok")}
                    onCancel={() => this.changePlayerDivision("cancel")}
                >
                    <div className="change-division-modal">
                        <div className="year-select-heading">{AppConstants.division}</div>
                        <Select
                            style={{ minWidth: 120 }}
                            className="year-select change-division-select"
                            onChange={(divisionId) => this.setState({ competitionDivisionId: divisionId })}
                            value={JSON.parse(JSON.stringify(this.state.competitionDivisionId))}
                        >
                            {divisionData.map((item) => (
                                <Option
                                    key={`compMemProdDiv_${item.competitionMembershipProductDivisionId}`}
                                    value={item.competitionMembershipProductDivisionId}
                                >
                                    {item.divisionName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Modal>
            </div>
        );
    }

    contentView = () => (
        <div className="comp-dash-table-view mt-2">
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="d-flex flex-row justify-content-between">
                    {this.assignedView()}
                    {this.unassignedView()}
                </div>
            </DragDropContext>
        </div>
    )

    /// ///footer view containing all the buttons like submit and cancel
    footerView = () => (
        <div className="fluid-width paddingBottom56px">
            <div className="row">
                <div className="col-sm-3 mt-3">
                    <div className="reg-add-save-button">
                        <NavLink to="/competitionDashboard">
                            <Button disabled={this.state.competitionStatus == 1} className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm mt-3">
                    <div className="comp-finals-button-view">
                        <NavLink to="/competitionPartProposedTeamGrading">
                            <Button disabled={this.state.competitionStatus == 1} className="publish-button margin-top-disabled-button" type="primary">{AppConstants.next}</Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey="14" />
                <Layout>
                    {this.headerView()}

                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                        <Loader visible={this.props.partPlayerGradingState.onLoad || this.props.appState.onLoad} />
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
        getDivisionsListAction,
        clearReducerDataAction,
        getCompPartPlayerGradingAction,
        clearReducerCompPartPlayerGradingAction,
        addNewTeamAction,
        onDragPlayerAction,
        onSameTeamDragAction,
        playerGradingComment,
        deleteTeamAction,
        addOrRemovePlayerForChangeDivisionAction,
        changeDivisionPlayerAction,
        commentListingAction,
        exportPlayerGrades,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        partPlayerGradingState: state.CompetitionPartPlayerGradingState,
        registrationState: state.RegistrationState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPartPlayerGrades);
