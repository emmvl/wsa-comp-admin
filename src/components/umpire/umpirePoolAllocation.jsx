import React, { Component } from "react";
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
import {
    getUmpirePoolData,
    saveUmpirePoolData,
    updateUmpirePoolData,
    updateUmpirePoolManyData,
    deleteUmpirePoolData
 } from "../../store/actions/umpireAction/umpirePoolAllocationAction";
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
            savePoolModalVisible: false,
            updatePoolModalVisible: false,
            addUmpireToPoolModalVisible: false,
            modalVisible: false,
            comment: null,
            teamID: null,
            comments: null,
            deleteModalVisible: false,
            loading: false,
            selectedComp: null,
            // assignedData: [
            //     {
            //         teamId: 112, teamName: "a", playerCount: 0, isChecked: false, gradeRefId: null, players: [
            //             { playerId: 1, playerName: "Jhon", Badge: "Badge A", years: "2 Years", matches: "3005", rank: 1 },
            //         ]
            //     },
                // {
                //     teamId: 114, teamName: "b", playerCount: 0, isChecked: false, gradeRefId: null, position1: null, position2: null, isCommentsAvailable: 0, players: [
                //     ]
                // },
            // ],
            // unassignedData: [
            //     { playerId: 5, playerName: "Kristn", Badge: "Badge F", years: "1 Years", matches: "905", rank: 2 },
            // ],
            assignedData: [],
            unassignedData: [],
            compOrgId: 0,
            compIsParent: false,
            orgId: null,
            umpirePoolIdToDelete: '',
            umpireToUpdate: null,
            umpirePoolIdToUpdate: '',
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
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let competitionList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = competitionList.length > 0 && competitionList[0].id
                let orgId = competitionList.length > 0 && competitionList[0].competitionOrganisation.orgId

                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (JSON.parse(getUmpireCompetitonData())) {
                    this.props.getUmpirePoolData({ orgId: orgId, compId: firstComp })
                }

                const compKey = competitionList.length > 0 && competitionList[0].competitionUniqueKey;

                const competitionListCopy = JSON.parse(JSON.stringify(competitionList));

                competitionListCopy.forEach(item => {
                    if (item.organisationId === organisationId) {
                        item.isOrganiser = true;
                    } else {
                        item.isOrganiser = false;
                    }
                });

                const isOrganiser = competitionListCopy.find(competition => competition.id === firstComp)?.isOrganiser;

                this.setState({ 
                    competitionList: competitionListCopy,
                    selectedComp: firstComp,
                    isOrganiserView: isOrganiser,
                    loading: false, 
                    competitionUniqueKey: compKey 
                })
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpireList(this.state.selectedComp);
        }

        if ((this.props.umpireState.onLoad !== prevProps.umpireState.onLoad
            || this.props.umpirePoolAllocationState.onLoad !== prevProps.umpirePoolAllocationState.onLoad) && 
            !this.props.umpireState.onLoad && !this.props.umpirePoolAllocationState.onLoad
        ) {
            const { umpireListDataNew } = this.props.umpireState;
            const { umpirePoolData } = this.props.umpirePoolAllocationState;

            const assignedUmpiresIdSet = new Set();

            umpirePoolData.forEach(umpirePoolItem => {
                umpirePoolItem.umpires.forEach(umpireItem => {
                    assignedUmpiresIdSet.add(umpireItem.id);
                })
            });

            const unassignedUmpires = umpireListDataNew.filter(umpireItem => !assignedUmpiresIdSet.has(umpireItem.id));

            this.setState({unassignedData: unassignedUmpires, assignedData: umpirePoolData });
        }
    }

    onChangeComp = compId => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { competitionList } = this.state;

        const { isOrganiser } = competitionList.find(competition => competition.id === compId);

        setUmpireCompId(compId);

        checkUmpireCompIsParent().then((value) => {
            this.setState({
                compIsParent: value
            })
        });

        this.props.getUmpirePoolData({ orgId: organisationId ? organisationId : 0, compId })
        this.setState({ selectedComp: compId, isOrganiserView: isOrganiser });
    }

    onDragEnd = result => {
        const { source, destination } = result;

        const assignedDataCopy = JSON.parse(JSON.stringify(this.state.assignedData));
        const unassignedDataCopy = JSON.parse(JSON.stringify(this.state.unassignedData));

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === '1') {
            const assignedUmpire = unassignedDataCopy[source.index];
            unassignedDataCopy.splice(source.index, 1);

            const poolToAdd = assignedDataCopy.find(pool => +pool.id === +destination.droppableId);
            poolToAdd.umpires.splice(destination.index, 0, assignedUmpire);
        }

        this.setState({ 
            unassignedData: unassignedDataCopy,
            assignedData: assignedDataCopy,
         });
    };


    // onDragEnd = result => {
    //     const { source, destination } = result;

    //     const assignedPlayerData = this.state.assignedData;
    //     const unassignedPlayerData = this.state.unassignedData;

    //     let umpireId;

    //     // dropped outside the list
    //     if (!destination) {
    //         return;
    //     }

    //     console.log('source', source);
    //     console.log('destination', destination);

        // if (source.droppableId !== destination.droppableId) {
            // let poolId = !destination.droppableId ? null : destination.droppableId;
            // let sourcePoolID = !source.droppableId ? null : source.droppableId;

            // console.log('poolId, sourcePoolID', poolId, sourcePoolID);

            // if (poolId) {
            //     console.log('poolId, sourcePoolID', poolId, sourcePoolID);
            //     if (!sourcePoolID) {
            //         umpireId = unassignedPlayerData[source.index].id;
            //     } else {
            //         for (let i in assignedPlayerData) {
            //             if (source.droppableId === assignedPlayerData[i].id) {
            //                 umpireId = assignedPlayerData[i].umpires[source.index].id
            //             }
            //         }
            //     }
            // } else {
            //     for (let i in assignedPlayerData) {
            //         if (source.droppableId === assignedPlayerData[i].teamId) {
            //             umpireId = assignedPlayerData[i].umpires[source.index].id
            //         }
            //     }
            // }

            // this.props.onDragPlayerAction(this.state.firstTimeCompId, teamId, playerId, source, destination)
        // } else {
            // this.props.onSameTeamDragAction(source, destination)
        // }
    // };

    onClickComment = (player, teamID) => {
        this.setState({
            modalVisible: true, comment: "", playerId: player.playerId,
            teamID
        })
    }

    // delete pool handling

    handleClickDeletePool = umpirePoolIdToDelete => {
        this.setState({ umpirePoolIdToDelete, deleteModalVisible: true });
    }

    handleDeletePoolOk = () => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { selectedComp, umpirePoolIdToDelete } = this.state;
        
        this.props.deleteUmpirePoolData({ 
            orgId: organisationId, 
            compId: selectedComp,
            umpirePoolId: umpirePoolIdToDelete
        })

        this.setState({ 
            deleteModalVisible: false,
            umpirePoolIdToDelete: '',
            loading: true,
        });
    }

    handleDeletePoolCancel = () => {
        this.setState({ deleteModalVisible: false });
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

    // save pool handling

    handleAddUmpirePool = () => {
        this.setState({ savePoolModalVisible: true });
    }

    handleOkSavePool = (e) => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        if (this.state.newPool.length > 0) {

            let poolObj = {
                name: this.state.newPool,
                umpires: []
            }

            this.props.saveUmpirePoolData({
                compId: this.state.selectedComp,
                orgId: organisationId,
                poolObj: poolObj

            });
        }
        this.setState({
            savePoolModalVisible: false,
            newPool: "",
        });
    };

    handleCancelSavePool = (e) => {
        this.setState({
            savePoolModalVisible: false,
            newPool: "",
        });
    };

    // update pool handling

    handleUpdateUmpirePool = umpireToUpdate => {
        this.setState({ umpireToUpdate, updatePoolModalVisible: true });
    }

    handleOkUpdatePool = (e) => {
        const { umpirePoolIdToUpdate, umpireToUpdate, selectedComp } = this.state;
        const umpireId = umpireToUpdate.id;

        this.props.updateUmpirePoolData({
            compId: selectedComp,
            umpirePoolId: umpirePoolIdToUpdate,
            umpires: [umpireId]
        });

        this.setState({
            updatePoolModalVisible: false,
            umpireToUpdate: null,
            umpirePoolIdToUpdate: '',
        });
    };

    handleCancelUpdatePool = (e) => {
        this.setState({
            updatePoolModalVisible: false,
            umpireToUpdate: null,
            umpirePoolIdToUpdate: '',
        });
    };

    handleChangePoolToUpdate = umpirePoolIdToUpdate => {
        this.setState({ umpirePoolIdToUpdate });
    }

    handleSave = () => {
        const { selectedComp, assignedData } = this.state;
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        const body = assignedData.map(dataItem => ({
            id: dataItem.id,
            umpires: dataItem.umpires.map(umpire => umpire.id)
        }))

        this.props.updateUmpirePoolManyData({
            compId: selectedComp,
            orgId: organisationId,
            body,
        });
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

    dropdownView = () => {
        const { competitionList } = this.state;
        
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
                                    {!!competitionList && competitionList.map((item) => (
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

    //////for the assigned teams on the left side of the view port
    assignedView = () => {
        let commentList = [];
        const { isOrganiserView, assignedData } = this.state;

        return (
            <div className="d-flex flex-column">
                {assignedData.map((umpirePoolItem, umpirePoolItemIndex) => (
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
                                            {isOrganiserView && 
                                                <img
                                                    className="comp-player-table-img team-delete-link pointer"
                                                    src={AppImages.deleteImage}
                                                    alt=""
                                                    height="20"
                                                    width="20"
                                                    onClick={() => this.handleClickDeletePool(umpirePoolItem.id)}
                                                />
                                            }
                                            <a 
                                                className="view-more-btn collapsed" 
                                                data-toggle="collapse" 
                                                href={`#${umpirePoolItemIndex}`} 
                                                role="button" 
                                                aria-expanded="false" 
                                                aria-controls={umpirePoolItemIndex}
                                            >
                                                <i className="fa fa-angle-up" style={{ color: "#ff8237" }} aria-hidden="true" />
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
                                                                    <Menu.Item
                                                                        key="1"
                                                                        onClick={() => this.handleUpdateUmpirePool(umpireItem)}
                                                                    >
                                                                        <span>{AppConstants.addToAnotherPool}</span>
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
                    title={AppConstants.deletePool}
                    visible={this.state.deleteModalVisible}
                    onOk={this.handleDeletePoolOk}
                    onCancel={this.handleDeletePoolCancel}
                >
                    <p>{AppConstants.removePoolMsg}</p>
                </Modal>
            </div>
        )
    }

    poolModalView = () => {
        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.addPool}
                visible={this.state.savePoolModalVisible}
                onOk={() => this.handleOkSavePool()}
                onCancel={() => this.handleCancelSavePool()}
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

    updatePoolModalView = () => {
        const { umpireToUpdate, umpirePoolIdToUpdate, assignedData } = this.state;

        const umpirePoolDataToAdd = assignedData.filter(poolDataItem => {
            const hasUmpire = poolDataItem.umpires.some(umpireItem => umpireItem.id === umpireToUpdate?.id);

            if (hasUmpire) {
                return false;
            } else {
                return true;
            }
        });

        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.addUmpireToPool}
                visible={this.state.updatePoolModalVisible}
                onOk={() => this.handleOkUpdatePool()}
                onCancel={() => this.handleCancelUpdatePool()}
                okButtonProps={{ disabled: !umpirePoolIdToUpdate }}
            >
                {umpireToUpdate && 
                    <div>
                        <p>{`${AppConstants.add} ${umpireToUpdate.firstName} ${umpireToUpdate.lastName} ${AppConstants.toPool}:`}</p>
                        <Select
                            className="year-select reg-filter-select1 ml-2"
                            style={{ minWidth: 200, maxWidth: 250 }}
                            onChange={this.handleChangePoolToUpdate}
                            value={umpirePoolIdToUpdate}
                        >
                            {umpirePoolDataToAdd.map((item) => (
                                <Option key={'pool' + item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </div>
                }
            </Modal>
        )
    }

    ////////for the unassigned teams on the right side of the view port
    unassignedView = () => {
        let commentList = [];
        const { unassignedData, isOrganiserView } = this.state;

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
                                            {unassignedData.length > 1 ? unassignedData.length + " Umpires" : unassignedData.length + " Umpire"}
                                        </span>
                                    </div>
                                    { isOrganiserView &&
                                        <div className="col-sm d-flex justify-content-end">
                                            <Button
                                                className="primary-add-comp-form"
                                                type="primary"
                                                disabled={!this.state.compIsParent}
                                                onClick={this.handleAddUmpirePool}
                                            >
                                                + {AppConstants.umpirePools}
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </div>
                            {!!unassignedData.length && unassignedData.map((umpireItem, umpireIndex) => (
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
                    onDragEnd={this.onDragEnd}
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
                                onClick={this.handleSave}
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
                        {this.updatePoolModalView()}
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
        deleteUmpirePoolData,
        saveUmpirePoolData,
        updateUmpirePoolData,
        updateUmpirePoolManyData,
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
