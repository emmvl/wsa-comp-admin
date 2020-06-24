import React, { Component } from "react";
import { Layout, Breadcrumb, Checkbox, Button, Menu, Select, Tag, Form, Modal, Dropdown } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader';
import ColorsArray from "../../util/colorsArray";
import PlayerCommentModal from "../../customComponents/playerCommentModal";
import Tooltip from 'react-png-tooltip'
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";


const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_obj = null;

class UmpirePoolAllocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTeam: "",
            visible: false,
            modalVisible: false,
            comment: null,
            teamID: null,
            comments: null,
            deleteModalVisible: false,
            loading: false,
            selectedComp: null,

            assignedData: [
            {
                teamId: 112, teamName: "a", playerCount: 0, isChecked: false, gradeRefId: null, players: [
                    { playerId: 1, playerName: "Jhon", playerHistory: [], position1: 2, position2: null, isCommentsAvailable: 1 },
                    { playerId: 2, playerName: "Mike Martin", playerHistory: [], position1: 1, position2: null, isCommentsAvailable: 0 },
                ]
            },
            {
                teamId: 114, teamName: "b", playerCount: 0, isChecked: false, gradeRefId: null, position1: null, position2: null, isCommentsAvailable: 0, players: [
                    { playerId: 3, playerName: "Test", isChecked: true, playerHistory: [{ teamId: 22, teamText: 'ABC' }] },
                    { playerId: 4, playerName: "Johny", isChecked: false, playerHistory: [], position1: 1, position2: 3, isCommentsAvailable: 1 },
                ]
            },
            ],

            unassignedData: [
                { playerId: 5, playerName: "Kristn", isChecked: true, playerHistory: [], position1: null, isCommentsAvailable: 0 },
                { playerId: 6, playerName: "Adom Crish", isChecked: false, playerHistory: [], position1: 55, isCommentsAvailable: 1 },
            ]

        }
        this_obj = this;
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')

    }


    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id


                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.umpirePools}
                            </span>
                        </div>

                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                            <div className="row">

                                <div className="col-sm pt-1">
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
                                                        src={AppImages.import}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.import}
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-sm pt-1">
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
                                        {/* <NavLink to={{
                                            pathname: `/umpireImport`,
                                            state: { screenName: 'umpireRoaster' }
                                        }} className="text-decoration-none"> */}
                                        <Button className="primary-add-comp-form" type="primary">
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
                                        {/* </NavLink> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="mt-5" style={{ display: "flex", width: 'fit-content' }} >
                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50,
                        }} >
                            <span className='year-select-heading'>{AppConstants.competition}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >
                                {
                                    competition.map((item) => {
                                        return <Option value={item.id}>{item.longName}</Option>
                                    })
                                }

                            </Select>
                        </div>
                    </div> */}
                </div>
            </div >
        );
    };

    onChangeComp(compID) {
        let selectedComp = compID.comp
        setUmpireCompId(selectedComp)
        let compKey = compID.competitionUniqueKey

        this.setState({ selectedComp, competitionUniqueKey: compKey })

    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width" >
                    <div className="row" >

                        <div className="col-sm" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    style={{ minWidth: 160 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item) => {
                                            return <Option value={item.id}>{item.longName}</Option>
                                        })
                                    }

                                </Select>
                            </div>
                        </div>

                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end", alignSelf: "center" }} >
                            {/* <NavLink to="/competitionPartPlayerGradeCalculate" > */}
                            <span className='input-heading-add-another pt-0'>{AppConstants.playerGradingToggle}</span>
                            {/* </NavLink> */}
                            <div style={{ marginTop: 4 }}>
                                <Tooltip placement="top" background='#ff8237'>
                                    <span>{AppConstants.playerGradingToggleMsg}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    onDragEnd = result => {

        const { source, destination } = result;
        let assignedPlayerData = this.state.assignedData
        let unassignedPlayerData = this.state.unassignedData
        console.log(result, 'onDragEnd_1', assignedPlayerData)
        let playerId
        // dropped outside the list
        if (!destination) {
            return;
        }
        else if (source.droppableId !== destination.droppableId) {
            let teamId = destination !== null && destination.droppableId == 0 ? null : JSON.parse(destination.droppableId)
            let sourceTeamID = source !== null && source.droppableId == 0 ? null : JSON.parse(source.droppableId)
            console.log(sourceTeamID, 'onDragEnd_3')
            if (teamId !== null) {
                console.log(teamId, 'onDragEnd_2')
                if (sourceTeamID == null) {
                    console.log(sourceTeamID, 'onDragEnd_4')
                    playerId = unassignedPlayerData[source.index].playerId
                }
                else {
                    for (let i in assignedPlayerData) {
                        console.log(source, 'onDragEnd_5')
                        if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                            playerId = assignedPlayerData[i].players[source.index].playerId
                        }
                    }
                }
            }
            else {
                for (let i in assignedPlayerData) {
                    if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                        playerId = assignedPlayerData[i].players[source.index].playerId
                    }
                }
            }
            // this.props.onDragPlayerAction(this.state.firstTimeCompId, teamId, playerId, source, destination)
        }
        else {
            // this.props.onSameTeamDragAction(source, destination)
        }
    };

    onClickComment(player, teamID) {
        this.setState({
            modalVisible: true, comment: "", playerId: player.playerId,
            teamID
        })
    }

    handleDeleteTeamCancel = () => {
        this.setState({ deleteModalVisible: false });
    }

    onClickDeleteTeam = async (teamItem, teamIndex) => {
        await this.setState({ teamID: teamItem.teamId, deleteModalVisible: true });
    }
    // model cancel for dissapear a model
    handleModalCancel = e => {
        this.setState({
            modalVisible: false,
            comment: "",
            playerId: null,
            teamID: null,

        });
    };




    //////for the assigned teams on the left side of the view port
    assignedView = () => {
        let commentList = []
        let assignedData = this.state.assignedData

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
                                            <Checkbox
                                                className="single-checkbox mt-1 check-box-player"
                                                checked={teamItem.isChecked}
                                            >
                                            </Checkbox>
                                            <div className="col-sm d-flex align-items-center">
                                                <span className="player-grading-haeding-team-name-text">{teamItem.teamName}</span>
                                                <span className="player-grading-haeding-player-count-text ml-2">
                                                    {teamItem.players.length > 1 ? teamItem.players.length + " Players" : teamItem.players.length + " Player"} </span>
                                            </div>
                                            <div className="col-sm d-flex justify-content-end ">
                                                <img className="comp-player-table-img team-delete-link" src={AppImages.deleteImage}
                                                    alt="" height="20" width="20"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => this.onClickDeleteTeam(teamItem, teamIndex)}
                                                />
                                                <a className="view-more-btn collapsed" data-toggle="collapse" href={`#${teamIndex}`} role="button" aria-expanded="false" aria-controls={teamIndex}>
                                                    <i class="fa fa-angle-down" style={{ color: "#ff8237", }} aria-hidden="true" ></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="collapse" id={teamIndex}>
                                        {teamItem.players.length > 0 && teamItem.players.map((playerItem, playerIndex) => {

                                            return (
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
                                                                <Checkbox
                                                                    checked={playerItem.isChecked}
                                                                    className="single-checkbox mt-1 check-box-player"
                                                                // onChange={e => this.onChangeChildDivCheckbox(e.target.checked, teamIndex, playerIndex, "assigned")}
                                                                >
                                                                </Checkbox>
                                                                <div className="col-sm d-flex align-items-center"  >
                                                                    {/* <NavLink to={{ pathname: `/userPersonal`, state: { userId: playerItem.userId } }}
                                                                    > */}
                                                                    <span style={{ cursor: "pointer" }}
                                                                        className="player-grading-haeding-player-name-text">{playerItem.playerName}</span>
                                                                    {/* </NavLink> */}
                                                                </div>
                                                                <div
                                                                    className="col-sm d-flex justify-content-end "
                                                                    style={{ flexFlow: 'wrap' }}>
                                                                    <div className="col-sm">
                                                                        {playerItem.playerHistory.map((item, index) => {

                                                                            return (
                                                                                <Tag className="comp-player-table-tag" key={item.teamId}>
                                                                                    {item.teamText}
                                                                                </Tag>

                                                                            )
                                                                        })}
                                                                    </div>
                                                                    <div>
                                                                        {playerItem.position1 &&
                                                                            <Tag className="comp-player-table-tag" style={{ background: playerIndex < 38 ? ColorsArray[playerIndex] : '#ee3346', color: "#ffffff" }} key={playerItem.position1}>
                                                                                {playerItem.position1}
                                                                            </Tag>
                                                                        }
                                                                        {playerItem.position2 &&
                                                                            <Tag className="comp-player-table-tag" style={{ background: playerIndex < 36 ? ColorsArray[(playerIndex + 2)] : '#1658ef', color: "#ffffff" }} key={playerItem.position2}>
                                                                                {playerItem.position2}
                                                                            </Tag>
                                                                        }
                                                                        <img className="comp-player-table-img" src={
                                                                            playerItem.isCommentsAvailable == 1 ? AppImages.commentFilled :
                                                                                AppImages.commentEmpty} alt="" height="20" width="20"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => this.onClickComment(playerItem, teamIndex)}
                                                                        />
                                                                        {/* </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                </Draggable>


                                            )
                                        })}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )
                            }
                        </Droppable>
                    ))
                }
                <PlayerCommentModal
                    visible={this.state.modalVisible}
                    modalTitle={AppConstants.add_edit_comment}
                    // onOK={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    placeholder={AppConstants.addYourComment}
                    // onChange={(e) => this.setState({ comment: e.target.value })}
                    value={this.state.comment}
                    commentList={commentList}
                    commentLoad={false}
                />

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.deleteTeam}
                    visible={this.state.deleteModalVisible}
                    // onOk={this.handleDeleteTeamOk}
                    onCancel={this.handleDeleteTeamCancel}
                >
                    <p>Are you sure you want to delete?</p>
                </Modal>
            </div>

        )
    }

    ////////for the unassigned teams on the right side of the view port
    unassignedView = () => {

        let commentList = []
        let unassignedData = this.state.unassignedData
        return (
            <div>
                <Droppable droppableId={'1'}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className="player-grading-droppable-view">
                            <div className="player-grading-droppable-heading-view">
                                <div className="row" >
                                    <Checkbox
                                        className="single-checkbox mt-1 check-box-player"
                                        checked={unassignedData.isChecked}>
                                    </Checkbox>
                                    <div className="col-sm d-flex align-items-center"  >
                                        <span className="player-grading-haeding-team-name-text">{AppConstants.unassigned}</span>
                                        <span className="player-grading-haeding-player-count-text ml-2">
                                            {unassignedData.length > 1 ? unassignedData.length + " Players" : unassignedData.length + " Player"}
                                        </span>
                                    </div>

                                    <div className="col-sm d-flex justify-content-end">
                                        <Button className="primary-add-comp-form" type="primary" >
                                            + {AppConstants.umpirePools}
                                        </Button>

                                    </div>

                                </div>
                            </div>
                            {unassignedData && unassignedData.map((playerItem, playerIndex) => (
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

                                            <div className="row" >
                                                <Checkbox
                                                    checked={playerItem.isChecked}
                                                    className="single-checkbox mt-1 check-box-player" >
                                                </Checkbox>
                                                <div className="col-sm d-flex align-items-center"  >
                                                    {/* <NavLink to={{ pathname: `/userPersonal`, state: { userId: playerItem.userId } }}
                                                    > */}
                                                    <span style={{ cursor: "pointer" }}
                                                        className="player-grading-haeding-player-name-text">{playerItem.playerName}</span>
                                                    {/* </NavLink> */}
                                                </div>
                                                <div
                                                    className="col-sm d-flex justify-content-end "
                                                    style={{ flexFlow: 'wrap' }}>
                                                    <div className="col-sm">
                                                        {playerItem.playerHistory.map((item, index) => {
                                                            return (
                                                                <Tag className="comp-player-table-tag" key={item.teamId}>
                                                                    {item.teamText}
                                                                </Tag>

                                                            )
                                                        })}
                                                    </div>
                                                    <div>
                                                        {playerItem.position1 &&
                                                            <Tag className="comp-player-table-tag" style={{ background: playerIndex <= 38 ? ColorsArray[playerIndex] : '#ee3346', color: "#ffffff" }} key={playerItem.position1}>
                                                                {playerItem.position1}
                                                            </Tag>
                                                        }
                                                        {playerItem.position2 &&
                                                            <Tag className="comp-player-table-tag" style={{ background: playerIndex <= 37 ? ColorsArray[(playerIndex + 1)] : '#1658ef', color: "#ffffff" }} key={playerItem.position2}>
                                                                {playerItem.position2}
                                                            </Tag>
                                                        }
                                                        <img className="comp-player-table-img" src={
                                                            playerItem.isCommentsAvailable == 1 ? AppImages.commentFilled :
                                                                AppImages.commentEmpty} alt="" height="20" width="20"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => this.onClickComment(playerItem, null)}
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
                <PlayerCommentModal
                    visible={this.state.modalVisible}
                    modalTitle={AppConstants.add_edit_comment}
                    // onOK={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    placeholder={AppConstants.addYourComment}
                    // onChange={(e) => this.setState({ comment: e.target.value })}
                    value={this.state.comment}
                    commentList={commentList}
                    commentLoad={false}
                />

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

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}

                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>

        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(UmpirePoolAllocation));
