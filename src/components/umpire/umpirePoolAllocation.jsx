import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
    Layout, 
    Button, 
    Select, 
    Modal,
    Menu,
 } from 'antd';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";

import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';
import PlayerCommentModal from "../../customComponents/playerCommentModal";

import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";

import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import { getUmpirePoolData, saveUmpirePoolData } from "../../store/actions/umpireAction/umpirePoolAllocationAction";
import {
    getUmpireList,
} from '../../store/actions/umpireAction/umpireAction';

import { getUmpireCompetitonData, getUmpireCompId, setUmpireCompId, setUmpireCompitionData } from '../../util/sessionStorage';
import { isArrayNotEmpty } from "../../util/helpers";
import { checkUmpireCompIsParent } from "util/permissions";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_obj = null;

class UmpirePoolAllocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPool: "",
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
                        { playerId: 1, playerName: "Jhon", Badge: "Badge A", years: "2 Years", matches: "3005", rank: 1 },
                    ]
                },
                // {
                //     teamId: 114, teamName: "b", playerCount: 0, isChecked: false, gradeRefId: null, position1: null, position2: null, isCommentsAvailable: 0, players: [
                //     ]
                // },
            ],
            // unassignedData: [
            //     { playerId: 5, playerName: "Kristn", Badge: "Badge F", years: "1 Years", matches: "905", rank: 2 },
            // ],
            unassignedData: [],
            compOrgId: 0,
            compIsParent: false,
            orgId: null,
            allCompetition: null
        }
        this_obj = this;
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')

        // let { competitionOrganisation } = JSON.parse(getUmpireCompetitonData());
        // if (JSON.parse(getUmpireCompetitonData())) {
        //     this.setState({
        //         compOrgId: competitionOrganisation.id,
        //     })
        // }

        checkUmpireCompIsParent().then((value) => {
            this.setState({
                compIsParent: value
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                let orgId = compList.length > 0 && compList[0].competitionOrganisation.orgId

                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (JSON.parse(getUmpireCompetitonData())) {
                    this.props.getUmpirePoolData({ orgId: orgId, compId: firstComp })
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, allCompetition: compList })
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpireList(this.state.selectedComp);
        }

        if (this.props.umpireState.umpireListDataNew !== prevProps.umpireState.umpireListDataNew) {
            console.log('this.props.umpireState.umpireListDataNew', this.props.umpireState.umpireListDataNew);
            // this.setState({unassignedData: this.props.umpireState.umpireListDataNew });
        }
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1 d-flex align-content-center">
                            <span className="form-heading">
                                {AppConstants.umpirePools}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onChangeComp = compId => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        setUmpireCompId(compId);

        checkUmpireCompIsParent().then((value) => {
            this.setState({
                compIsParent: value
            })
        });

        this.props.getUmpirePoolData({ orgId: organisationId ? organisationId : 0, compId })
        this.setState({ selectedComp: compId })
    }

    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view comp">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-100 d-flex flex-row align-items-center">
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200, maxWidth: 250 }}
                                    onChange={this.onChangeComp}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => (
                                        <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
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

        let playerId
        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId !== destination.droppableId) {
            let teamId = destination !== null && destination.droppableId == 0 ? null : JSON.parse(destination.droppableId)
            let sourceTeamID = source !== null && source.droppableId == 0 ? null : JSON.parse(source.droppableId)

            if (teamId !== null) {
                if (sourceTeamID == null) {
                    playerId = unassignedPlayerData[source.index].playerId
                } else {
                    for (let i in assignedPlayerData) {
                        if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                            playerId = assignedPlayerData[i].players[source.index].playerId
                        }
                    }
                }
            } else {
                for (let i in assignedPlayerData) {
                    if (JSON.parse(source.droppableId) == assignedPlayerData[i].teamId) {
                        playerId = assignedPlayerData[i].players[source.index].playerId
                    }
                }
            }
            // this.props.onDragPlayerAction(this.state.firstTimeCompId, teamId, playerId, source, destination)
        } else {
            // this.props.onSameTeamDragAction(source, destination)
        }
    };

    onClickComment = (player, teamID) => {
        this.setState({
            modalVisible: true, comment: "", playerId: player.playerId,
            teamID
        })
    }

    handleDeleteTeamCancel = () => {
        this.setState({ deleteModalVisible: false });
    }

    onClickDeleteTeam = async (umpireItem, umpireIndex) => {
        this.setState({ teamID: umpireItem.teamId, deleteModalVisible: true });
    }

    // model cancel for disappear a model
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
        let commentList = [];
        const { umpirePoolData } = this.props.umpirePoolAllocationState;
        console.log('umpirePoolData', umpirePoolData)

        return (
            <div className="d-flex flex-column">
                {umpirePoolData.map((umpirePoolItem, umpirePoolItemIndex) => (
                    <Droppable 
                        key={"umpirePoolData" + umpirePoolItemIndex} 
                        droppableId={`${umpirePoolItem.id}`}
                    >
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                className="player-grading-droppable-view"
                            >
                                <div className="player-grading-droppable-heading-view">
                                    <div className="row">
                                        <div className="col-sm d-flex align-items-center">
                                            <span className="player-grading-haeding-team-name-text">{umpirePoolItem.name}</span>
                                            <span className="player-grading-haeding-player-count-text ml-4">
                                                {umpirePoolItem.umpires.length > 1 ? umpirePoolItem.umpires.length + " Umpires" : umpirePoolItem.umpires.length + " Umpire"}
                                            </span>
                                        </div>
                                        <div className="col-sm d-flex justify-content-end">
                                            <img
                                                className="comp-player-table-img team-delete-link pointer"
                                                src={AppImages.deleteImage}
                                                alt=""
                                                height="20"
                                                width="20"
                                                onClick={() => this.onClickDeleteTeam(umpirePoolItem, umpirePoolItemIndex)}
                                            />
                                            <a className="view-more-btn collapsed" data-toggle="collapse" href={`#${umpirePoolItemIndex}`} role="button" aria-expanded="false" aria-controls={umpirePoolItemIndex}>
                                                <i className="fa fa-angle-down" style={{ color: "#ff8237" }} aria-hidden="true" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="collapse" id={umpirePoolItemIndex}>
                                    {umpirePoolItem.umpires.map((umpireItem, umpireIndex) => (
                                        <Draggable
                                            key={JSON.stringify(umpireItem.id)}
                                            draggableId={'assigned' + JSON.stringify(umpireItem.id) + umpirePoolItemIndex}
                                            index={umpireIndex}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="player-grading-draggable-view"
                                                >
                                                    <div className="row">
                                                        <div className="col-sm d-flex justify-content-flex-start align-items-center">
                                                            <span className="player-grading-haeding-player-name-text pointer">
                                                                {umpireIndex + 1}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm d-flex justify-content-flex-start align-items-center">
                                                            <span className="player-grading-haeding-player-name-text pointer">
                                                                {`${umpireItem.firstName} ${umpireItem.lastName}`}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm d-flex justify-content-center align-items-center">
                                                            <span className="player-grading-haeding-player-name-text pointer">
                                                                {umpireItem.Badge}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm d-flex justify-content-center align-items-center">
                                                            <span className="player-grading-haeding-player-name-text pointer">
                                                                {umpireItem.years}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm d-flex justify-content-center align-items-center">
                                                            <span className="player-grading-haeding-player-name-text pointer">
                                                                {umpireItem.matches} {AppConstants.games}
                                                            </span>
                                                        </div>
                                                        <div className="col-sm d-flex justify-content-center align-items-center">
                                                            <Menu
                                                                className="action-triple-dot-submenu"
                                                                theme="light"
                                                                mode="horizontal"
                                                                style={{ lineHeight: "25px" }}
                                                            >
                                                                <Menu.SubMenu
                                                                    key="sub1"
                                                                    style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                                                                    title={
                                                                        <img
                                                                            className="dot-image"
                                                                            src={AppImages.moreTripleDot}
                                                                            width="16"
                                                                            height="16"
                                                                            alt=""
                                                                        />
                                                                    }
                                                                >
                                                                    <Menu.Item key="1">
                                                                        <NavLink
                                                                            to={{
                                                                                // pathname: "/matchDayAddMatch",
                                                                                // state: { matchId: record.id, umpireKey: "umpire", isEdit: true, screenName: "umpireDashboard" },
                                                                            }}
                                                                        >
                                                                            <span>Edit</span>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                </Menu.SubMenu>
                                                            </Menu>
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

    // model visible
    addUmpirePool = () => {
        this.setState({ visible: true });
    }

    // model ok button
    handleOk = (e) => {
        if (this.state.newPool.length > 0) {

            let poolObj = {
                name: this.state.newPool,
                umpires: []
            }

            this.props.saveUmpirePoolData({
                compId: this.state.selectedComp,
                orgId: this.state.orgId,
                poolObj: poolObj

            });
        }
        this.setState({
            visible: false,
            newPool: "",
        });
    };

    // model cancel for disappear a model
    handleCancel = (e) => {
        this.setState({
            visible: false,
            newPool: "",
        });
    };

    poolModalView = () => {
        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.addPool}
                visible={this.state.visible}
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
            >
                <div>
                    <InputWithHead
                        auto_complete="off"
                        required="pt-0 mt-0"
                        heading={AppConstants.addPool}
                        placeholder={AppConstants.pleaseEnterPoolName}
                        onChange={(e) => this.setState({ newPool: e.target.value })}
                        value={this.state.newPool}
                    />
                </div>

            </Modal>
        )
    }

    ////////for the unassigned teams on the right side of the view port
    unassignedView = () => {
        let commentList = [];
        let unassignedData = this.state.unassignedData;
        const { umpireListDataNew } = this.props.umpireState;

        return (
            <div>
                <Droppable droppableId="1">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} className="player-grading-droppable-view">
                            <div className="player-grading-droppable-heading-view">
                                <div className="row">
                                    <div className="col-sm d-flex align-items-center">
                                        <span className="player-grading-haeding-team-name-text">{AppConstants.unassigned}</span>
                                        <span className="player-grading-haeding-player-count-text ml-4">
                                            {umpireListDataNew.length > 1 ? umpireListDataNew.length + " Umpires" : umpireListDataNew.length + " Umpire"}
                                        </span>
                                    </div>
                                    <div className="col-sm d-flex justify-content-end">
                                        <Button
                                            className="primary-add-comp-form"
                                            type="primary"
                                            disabled={!this.state.compIsParent}
                                            onClick={this.addUmpirePool}
                                        >
                                            + {AppConstants.umpirePools}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {!!umpireListDataNew.length && umpireListDataNew.map((umpireItem, umpireIndex) => (
                                <Draggable
                                    key={JSON.stringify(umpireItem.id)}
                                    draggableId={'unassigned' + JSON.stringify(umpireItem.id) + umpireIndex}
                                    index={umpireIndex}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="player-grading-draggable-view"
                                        >
                                            <div className="row">
                                                <div className="col-sm d-flex justify-content-flex-start align-items-center">
                                                    <span className="player-grading-haeding-player-name-text pointer">
                                                        {`${umpireItem.firstName} ${umpireItem.lastName}`}
                                                    </span>
                                                </div>
                                                <div className="col-sm d-flex justify-content-center align-items-center">
                                                    <span className="player-grading-haeding-player-name-text pointer">
                                                        {umpireItem.Badge}
                                                    </span>
                                                </div>
                                                <div className="col-sm d-flex justify-content-center align-items-center">
                                                    <span className="player-grading-haeding-player-name-text pointer">
                                                        {umpireItem.years}
                                                    </span>
                                                </div>
                                                <div className="col-sm d-flex justify-content-center align-items-center">
                                                    <span className="player-grading-haeding-player-name-text pointer">
                                                        {umpireItem.matches} {AppConstants.games}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
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

    contentView = () => {
        return (
            <div className="comp-dash-table-view mt-2">
                <DragDropContext
                >
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
            <div className="fluid-width paddingBottom56px pool-space">
                <div className="row">
                    <div className="col-sm mt-3 px-0">
                        <div className="d-flex justify-content-end">
                            <Button
                                className="publish-button save-draft-text mr-0" 
                                type="primary"
                                htmlType="submit"
                            >
                                {AppConstants.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        // console.log('this.props.umpirePoolAllocationState.onLoad', this.props.umpirePoolAllocationState.onLoad)
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="5" />
                <Loader visible={this.props.umpirePoolAllocationState.onLoad} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}

                    <Content>
                        {this.contentView()}
                        {this.poolModalView()}
                    </Content>
                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        getUmpirePoolData,
        saveUmpirePoolData,
        getUmpireList,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePoolAllocationState: state.UmpirePoolAllocationState,
        umpireState: state.UmpireState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePoolAllocation);
