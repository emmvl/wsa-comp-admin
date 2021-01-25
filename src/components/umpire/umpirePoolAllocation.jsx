import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
    Layout, 
    Button, 
    Select, 
    Modal,
    Menu,
    message,
 } from 'antd';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";

import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';

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

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class UmpirePoolAllocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPool: "",
            savePoolModalVisible: false,
            updatePoolModalVisible: false,
            addUmpireToPoolModalVisible: false,
            removeUmpireFromPoolModalVisible: false,
            moveToUnassignModalVisible: false,
            deleteModalVisible: false,
            loading: false,
            selectedComp: null,
            assignedData: [],
            unassignedData: [],
            compOrgId: 0,
            orgId: null,
            umpirePoolIdToDelete: '',
            umpireForAction: null,
            umpirePoolIdToUpdate: '',
            unassignedDataTemp: [],
            assignedDataTemp: [],
        }
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

        this.props.getUmpirePoolData({ orgId: organisationId ? organisationId : 0, compId })
        this.setState({ selectedComp: compId, isOrganiserView: isOrganiser });
    }

    onDragEnd = result => {
        const { source, destination } = result;

        const { assignedData, unassignedData } = this.state;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));
        const unassignedDataCopy = JSON.parse(JSON.stringify(unassignedData));

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === '1') {
            const assignedUmpire = unassignedDataCopy[source.index];
            unassignedDataCopy.splice(source.index, 1);

            const poolToAdd = assignedDataCopy.find(pool => +pool.id === +destination.droppableId);
            poolToAdd.umpires.splice(destination.index, 0, assignedUmpire);
        } else if (destination.droppableId === '1') {
            const assignedUmpire = assignedDataCopy
                .find(dataItem => +dataItem.id === +source.droppableId)
                .umpires[source.index];

            const sourceAssignedData = assignedDataCopy
                .find(dataItem => +dataItem.id === +source.droppableId);

            sourceAssignedData.umpires.splice(source.index, 1);

            let isMultipleAssigned;
            assignedDataCopy.forEach(dataItem => {
                if (!isMultipleAssigned) {
                    isMultipleAssigned = dataItem.umpires.some(umpire => umpire.id === assignedUmpire.id);
                }
            });

            unassignedDataCopy.splice(destination.index, 0, assignedUmpire);

            this.setState({ 
                unassignedDataTemp: unassignedData,
                assignedDataTemp: assignedData,
                moveToUnassignModalVisible: isMultipleAssigned,
                umpireForAction: isMultipleAssigned ? assignedUmpire : null,
            });

            // message.error(AppConstants.somethingWentWrong);
        } else {
            const assignedUmpire = assignedDataCopy
                .find(dataItem => +dataItem.id === +source.droppableId)
                .umpires[source.index];

            const sourceAssignedData = assignedDataCopy
                .find(dataItem => +dataItem.id === +source.droppableId);

            const destinationAssignedData = assignedDataCopy
                .find(dataItem => +dataItem.id === +destination.droppableId);

            const hasUmpire = destinationAssignedData.umpires.some(umpire => umpire.id === assignedUmpire.id);

            if (hasUmpire && source.droppableId !== destination.droppableId) {
                message.error(AppConstants.umpireAlreadyInPool);
            } else {
                sourceAssignedData.umpires.splice(source.index, 1);
                destinationAssignedData.umpires.splice(destination.index, 0, assignedUmpire);
            }
        }

        this.setState({ 
            unassignedData: unassignedDataCopy,
            assignedData: assignedDataCopy,
        });
    };

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

    handleUpdateUmpirePool = umpireForAction => {
        this.setState({ umpireForAction, updatePoolModalVisible: true });
    }

    handleOkUpdatePool = () => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { umpirePoolIdToUpdate, umpireForAction, selectedComp } = this.state;
        const umpireId = umpireForAction.id;

        this.props.updateUmpirePoolData({
            compId: selectedComp,
            orgId: organisationId,
            umpirePoolId: umpirePoolIdToUpdate,
            umpires: [umpireId]
        });

        this.setState({
            updatePoolModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: '',
        });
    };

    handleCancelUpdatePool = (e) => {
        this.setState({
            updatePoolModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: '',
        });
    };

    handleChangePoolToUpdate = umpirePoolIdToUpdate => {
        this.setState({ umpirePoolIdToUpdate });
    }

    // remove umpire from pool handling

    handleRemoveUmpireFromPool = (umpireForAction, umpirePoolIdToUpdate) => {
        this.setState({ 
            umpireForAction,
            umpirePoolIdToUpdate,
            removeUmpireFromPoolModalVisible: true 
        });
    }
    
    handleOkRemoveUmpireFromPool = (e) => {
        const { selectedComp, assignedData, umpirePoolIdToUpdate, umpireForAction } = this.state;
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));

        assignedDataCopy.forEach(poolDataItem => {
            if (poolDataItem.id === umpirePoolIdToUpdate) {
                const indexToRemove = poolDataItem.umpires.findIndex(umpire => umpire.id === umpireForAction.id);
                poolDataItem.umpires.splice(indexToRemove, 1);
            }
        })

        const body = assignedDataCopy.map(dataItem => ({
            id: dataItem.id,
            umpires: dataItem.umpires.map(umpire => umpire.id)
        }))

        this.props.updateUmpirePoolManyData({
            compId: selectedComp,
            orgId: organisationId,
            body,
        });

        this.setState({
            removeUmpireFromPoolModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: ''
        });
    }
    
    handleCancelRemoveUmpireFromPool = () => {
        this.setState({
            removeUmpireFromPoolModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: ''
        });
    };

    // move umpire to unassigned section if he has multiple pools

    handleOkMoveToUnassigned = () => {
        const { umpireForAction, assignedData } = this.state;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));

        assignedDataCopy.forEach(dataItem => {
            const umpireIdxToRemove = dataItem.umpires.findIndex(umpire => umpire.id === umpireForAction.id);

            if (umpireIdxToRemove >= 0) {
                dataItem.umpires.splice(umpireIdxToRemove, 1);
            }
        })

        this.setState({
            assignedData: assignedDataCopy,
            moveToUnassignModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: '',
        });
    };

    handleCancelMoveToUnassigned = (e) => {
        const { unassignedDataTemp, assignedDataTemp } = this.state;

        this.setState({
            moveToUnassignModalVisible: false,
            umpireForAction: null,
            unassignedData: unassignedDataTemp,
            assignedData: assignedDataTemp,
            unassignedDataTemp: [],
            assignedDataTemp: [],
        });
    };


    // save new data
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

                                                                    <Menu.Item
                                                                        key="2"
                                                                        onClick={() => this.handleRemoveUmpireFromPool(umpireItem, umpirePoolItem.id)}
                                                                    >
                                                                        <span>{AppConstants.removeFromPool}</span>
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
        const { umpireForAction, umpirePoolIdToUpdate, assignedData, updatePoolModalVisible } = this.state;

        const umpirePoolDataToAdd = assignedData.filter(poolDataItem => {
            const hasUmpire = poolDataItem.umpires.some(umpireItem => umpireItem.id === umpireForAction?.id);

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
                visible={updatePoolModalVisible}
                onOk={() => this.handleOkUpdatePool()}
                onCancel={() => this.handleCancelUpdatePool()}
                okButtonProps={{ disabled: !umpirePoolIdToUpdate }}
            >
                {umpireForAction && 
                    <div>
                        <p>{`${AppConstants.add} ${umpireForAction.firstName} ${umpireForAction.lastName} ${AppConstants.toPool}:`}</p>
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

    removeUmpireFromPoolModalView = () => {
        const { umpireForAction, removeUmpireFromPoolModalVisible } = this.state;

        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.removeFromPool}
                visible={removeUmpireFromPoolModalVisible}
                onOk={() => this.handleOkRemoveUmpireFromPool()}
                onCancel={() => this.handleCancelRemoveUmpireFromPool()}
            >
                {umpireForAction && 
                    <div>
                        <p>{`${AppConstants.removeMsg} ${umpireForAction.firstName} ${umpireForAction.lastName}?`}</p>
                    </div>
                }
            </Modal>
        )
    }

    confirmUnassignModalView = () => {
        const { moveToUnassignModalVisible, umpireForAction } = this.state;

        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.removeFromAllPools}
                visible={moveToUnassignModalVisible}
                onOk={() => this.handleOkMoveToUnassigned()}
                onCancel={() => this.handleCancelMoveToUnassigned()}
            >
                {umpireForAction && 
                    <div>
                        <p>{AppConstants.confirmUnassignMsg}</p>
                    </div>
                }
            </Modal>
        )
    }

    ////////for the unassigned teams on the right side of the view port
    unassignedView = () => {
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
                        {this.confirmUnassignModalView()}
                        {this.updatePoolModalView()}
                        {this.removeUmpireFromPoolModalView()}
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
