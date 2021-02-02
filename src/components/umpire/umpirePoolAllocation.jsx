import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
    Layout, 
    Button, 
    Select, 
    Modal,
    Menu,
    message
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
import { getRefBadgeData } from '../../store/actions/appAction';

import { getUmpireCompetitonData, getUmpireCompId, setUmpireCompId, setUmpireCompitionData } from '../../util/sessionStorage';
import { isArrayNotEmpty } from "../../util/helpers";

const { 
    // Header, 
    Footer, 
    Content 
} = Layout;
const { Option } = Select;

class UmpirePoolAllocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPoolName: "",
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
            totalUnassigned: 0,
        }
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        this.setState({ loading: true });
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
        this.props.getRefBadgeData();
    }

    componentDidUpdate(prevProps, prevState) {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        const { deletedUmpirePoolId, newUmpirePool } = this.props.umpirePoolAllocationState;

        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let competitionList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = competitionList.length > 0 && competitionList[0].id;

                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (JSON.parse(getUmpireCompetitonData())) {
                    this.props.getUmpirePoolData({ orgId: organisationId, compId: firstComp })
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

        const { unassignedData, selectedComp } = this.state;
        const { umpireListDataNew } = this.props.umpireState;

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpireList({ organisationId, competitionId: this.state.selectedComp, offset: 0 });
        }

        // handle state after pool delete

        else if (!!deletedUmpirePoolId && deletedUmpirePoolId !== prevProps.umpirePoolAllocationState.deletedUmpirePoolId) {
            this.handleUpdatePoolAfterDelete();
        }

        // handle state after pool add

        else if (!!newUmpirePool && newUmpirePool !== prevProps.umpirePoolAllocationState.newUmpirePool) {
            this.handleUpdatePoolAfterAdd();
        }

        else if ((this.props.umpireState.onLoad !== prevProps.umpireState.onLoad
            || this.props.umpirePoolAllocationState.onLoad !== prevProps.umpirePoolAllocationState.onLoad) && 
            !this.props.umpireState.onLoad && !this.props.umpirePoolAllocationState.onLoad
        ) {
            this.handleSetPoolDataAfterUpdate();

            // handle state after load more
            if ((umpireListDataNew !== prevProps.umpireState.umpireListDataNew || !unassignedData.length) 
                && selectedComp === prevState.selectedComp 
            ) {
                this.handleUpdateUnassignedAfterLoadMore();
            }
        }
    }

    handleSetPoolDataAfterUpdate = () => {
        const { assignedData, unassignedData, totalUnassigned } = this.state;
        const { currentPage_Data, totalCount_Data } = this.props.umpireState;
        const { umpirePoolData } = this.props.umpirePoolAllocationState;

        const assignedUmpiresIdSet = new Set();
        const umpirePoolDataCurrentState = currentPage_Data > 1 ? assignedData : umpirePoolData;

        umpirePoolDataCurrentState.forEach(umpirePoolItem => {
            umpirePoolItem.umpires.forEach(umpireItem => {
                assignedUmpiresIdSet.add(umpireItem.id);
            })
        });

        this.setState({
            assignedData: umpirePoolDataCurrentState,
            // totalUnassigned: !!totalUnassigned ? totalUnassigned : !!unassignedData.length ? totalCount_Data : 0,
            totalUnassigned: !totalUnassigned ? totalCount_Data : totalUnassigned,
        });
    }

    handleUpdatePoolAfterAdd = () => {
        const { assignedData } = this.state;
        const { newUmpirePool } = this.props.umpirePoolAllocationState;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));
        assignedDataCopy.push(newUmpirePool);

        this.setState({ 
            assignedData: assignedDataCopy,
        });
    }

    handleUpdatePoolAfterDelete = () => {
        const { assignedData, unassignedData, totalUnassigned } = this.state;
        const { deletedUmpirePoolId } = this.props.umpirePoolAllocationState;

        const assignedDataFiltered = assignedData.filter(dataItem => dataItem.id !== deletedUmpirePoolId);

        const deletedPoolData = assignedData.find(dataItem => dataItem.id === deletedUmpirePoolId);

        const assignedUmpiresIdSet = new Set();

        assignedDataFiltered.forEach(umpirePoolItem => {
            umpirePoolItem.umpires.forEach(umpireItem => {
                assignedUmpiresIdSet.add(umpireItem.id);
            })
        });

        const unassignedDataToAddToUnassign = deletedPoolData.umpires.filter(umpireItem => !assignedUmpiresIdSet.has(umpireItem.id));
        const unassignedDataNew = [ ...unassignedDataToAddToUnassign, ...unassignedData];

        const totalUnassignedNew = totalUnassigned + unassignedDataToAddToUnassign.length;

        this.setState({ 
            assignedData: assignedDataFiltered, 
            unassignedData: unassignedDataNew,
            totalUnassigned: totalUnassignedNew,
        });
    }

    handleUpdateUnassignedAfterLoadMore = () => {
        const { unassignedData } = this.state;
        const { umpireListDataNew } = this.props.umpireState;

        const unassignedDataCopy = JSON.parse(JSON.stringify(unassignedData));
        unassignedDataCopy.push(...umpireListDataNew);
                 
        this.setState({
            unassignedData: unassignedDataCopy, 
        });
    }

    onChangeComp = compId => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { competitionList } = this.state;

        const { isOrganiser } = competitionList.find(competition => competition.id === compId);

        setUmpireCompId(compId);

        this.props.getUmpirePoolData({ orgId: organisationId ? organisationId : 0, compId })
        this.setState({ selectedComp: compId, isOrganiserView: isOrganiser, unassignedData: [] });
    }

    onDragEnd = result => {
        const { source, destination } = result;

        let newData;

        // dropped outside the list
        if (!destination) {
            return;
        }

        // handle drop changes
        if (source.droppableId === '1' && destination.droppableId !== '1') {
            newData = this.unassignedToAssignedMove(source, destination);
        } else if (source.droppableId !== '1' && destination.droppableId === '1') {
            newData = this.moveToUnassigned(source, destination);
        } else if (source.droppableId !== '1') {
            newData = this.moveToAnotherPool(source, destination);
        } else {
            newData = this.moveInsideUnassigned(source, destination);
        }

        this.setState({ 
            ...newData
        });
    };

    unassignedToAssignedMove = (source, destination) => {
        const { assignedData, unassignedData, totalUnassigned } = this.state;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));
        const unassignedDataCopy = JSON.parse(JSON.stringify(unassignedData));

        const assignedUmpire = unassignedDataCopy[source.index];
        unassignedDataCopy.splice(source.index, 1);

        const poolToAdd = assignedDataCopy.find(pool => +pool.id === +destination.droppableId);     
        poolToAdd.umpires.splice(destination.index, 0, assignedUmpire);

        return { 
            unassignedData: unassignedDataCopy,
            assignedData: assignedDataCopy,
            totalUnassigned: totalUnassigned - 1,
        }
    }

    moveToUnassigned = (source, destination) => {
        const { assignedData, unassignedData, totalUnassigned } = this.state;
        const { assignedUmpire, sourceAssignedData, assignedDataCopy, unassignedDataCopy } = this.getDataForDnD(source, destination);

        sourceAssignedData.umpires.splice(source.index, 1);

        let isMultipleAssigned;
        assignedDataCopy.forEach(dataItem => {
            if (!isMultipleAssigned) {
                isMultipleAssigned = dataItem.umpires.some(umpire => umpire.id === assignedUmpire.id);
            }
        });

        unassignedDataCopy.splice(destination.index, 0, assignedUmpire);

        return { 
            unassignedData: unassignedDataCopy,
            assignedData: assignedDataCopy,
            unassignedDataTemp: unassignedData,
            assignedDataTemp: assignedData,
            moveToUnassignModalVisible: isMultipleAssigned,
            umpireForAction: isMultipleAssigned ? assignedUmpire : null,
            totalUnassigned: isMultipleAssigned ? totalUnassigned: totalUnassigned + 1,
        }
    }

    moveToAnotherPool = (source, destination) => {
        const { assignedUmpire, sourceAssignedData, destinationAssignedData, assignedDataCopy, unassignedDataCopy } = this.getDataForDnD(source, destination);

        const hasUmpire = destinationAssignedData.umpires.some(umpire => umpire.id === assignedUmpire.id);

        if (hasUmpire && source.droppableId !== destination.droppableId) {
            message.error(AppConstants.umpireAlreadyInPool);
        } else {
            sourceAssignedData.umpires.splice(source.index, 1);
            destinationAssignedData.umpires.splice(destination.index, 0, assignedUmpire);
        }

        return { 
            unassignedData: unassignedDataCopy,
            assignedData: assignedDataCopy,
        }
    }

    moveInsideUnassigned = (source, destination) => {
        const { assignedData, unassignedData } = this.state;

        const unassignedDataCopy = JSON.parse(JSON.stringify(unassignedData));

        const assignedUmpire = unassignedDataCopy[source.index];

        unassignedDataCopy.splice(source.index, 1);
        unassignedDataCopy.splice(destination.index, 0, assignedUmpire);

        return { 
            unassignedData: unassignedDataCopy,
            assignedData: assignedData,
        }
    }

    getDataForDnD = (source, destination) => {
        const { assignedData, unassignedData } = this.state;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));
        const unassignedDataCopy = JSON.parse(JSON.stringify(unassignedData));

        const assignedUmpire = assignedDataCopy
            .find(dataItem => +dataItem.id === +source.droppableId)
            .umpires[source.index];

        const sourceAssignedData = assignedDataCopy
            .find(dataItem => +dataItem.id === +source.droppableId);

        const destinationAssignedData = assignedDataCopy
            .find(dataItem => +dataItem.id === +destination.droppableId);

        return {
            assignedUmpire,
            sourceAssignedData,
            destinationAssignedData,
            assignedDataCopy,
            unassignedDataCopy,
        }
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

    // save pool handling

    handleAddUmpirePool = () => {
        this.setState({ savePoolModalVisible: true });
    }

    handleOkSavePool = (e) => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        if (!!this.state.newPoolName.length) {

            let poolObj = {
                name: this.state.newPoolName,
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
            newPoolName: "",
        });
    };

    handleCancelSavePool = (e) => {
        this.setState({
            savePoolModalVisible: false,
            newPoolName: "",
        });
    };

    // update pool handling

    handleUpdateUmpirePool = umpireForAction => {
        this.setState({ umpireForAction, updatePoolModalVisible: true });
    }

    handleOkUpdatePool = () => {
        const { umpirePoolIdToUpdate, umpireForAction, assignedData } = this.state;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));

        assignedDataCopy.forEach(poolDataItem => {
            if (poolDataItem.id === umpirePoolIdToUpdate) {
                poolDataItem.umpires.push(umpireForAction);
            }
        })

        this.setState({
            updatePoolModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: '',
            assignedData: assignedDataCopy,
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
        const { assignedData, umpirePoolIdToUpdate, umpireForAction } = this.state;

        const assignedDataCopy = JSON.parse(JSON.stringify(assignedData));

        assignedDataCopy.forEach(poolDataItem => {
            if (poolDataItem.id === umpirePoolIdToUpdate) {
                const indexToRemove = poolDataItem.umpires.findIndex(umpire => umpire.id === umpireForAction.id);
                poolDataItem.umpires.splice(indexToRemove, 1);
            }
        });

        this.setState({
            removeUmpireFromPoolModalVisible: false,
            umpireForAction: null,
            umpirePoolIdToUpdate: '',
            assignedData: assignedDataCopy,
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
        const { umpireForAction, assignedData, totalUnassigned } = this.state;

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
            totalUnassigned: totalUnassigned + 1,
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

    handleLoadMore = () => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const compId = JSON.parse(getUmpireCompId());
        const { currentPage_Data } = this.props.umpireState;

        const offset = 10 * currentPage_Data;

        this.props.getUmpireList({ organisationId, competitionId: compId, offset: offset });
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
                                        <div className="col-sm-9 d-flex align-items-center">
                                            <span className="player-grading-haeding-team-name-text">{umpirePoolItem.name}</span>
                                            <span className="player-grading-haeding-player-count-text ml-4 flex-shrink-0">
                                                {umpirePoolItem.umpires.length > 1 ? umpirePoolItem.umpires.length + " Umpires" : umpirePoolItem.umpires.length + " Umpire"}
                                            </span>
                                        </div>
                                        <div className="col-sm-3 d-flex justify-content-end align-items-center">
                                            {isOrganiserView && 
                                                <img
                                                    className="comp-player-table-img pointer mr-4"
                                                    src={AppImages.deleteImage}
                                                    alt=""
                                                    height="20"
                                                    width="20"
                                                    onClick={() => this.handleClickDeletePool(umpirePoolItem.id)}
                                                />
                                            }
                                            <a 
                                                className="view-more-btn position-static collapsed" 
                                                data-toggle="collapse" 
                                                href={`#${umpirePoolItemIndex}`} 
                                                role="button" 
                                                aria-expanded="false" 
                                                aria-controls={umpirePoolItemIndex}
                                                style={{ transform: 'none'}}
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
                                                    <div className="row flex-nowrap">
                                                        {this.umpireLineView(umpireItem, umpireIndex)}
                                                        <div className="col-sm d-flex justify-content-center align-items-center pl-2 pr-4 flex-grow-0">
                                                            <Menu
                                                                className="action-triple-dot-submenu"
                                                                theme="light"
                                                                mode="horizontal"
                                                                style={{ lineHeight: "25px" }}
                                                            >
                                                                <Menu.SubMenu
                                                                    key="sub1"
                                                                    className="border-bottom-0 m-0"
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
            </div>
        )
    }

    umpireLineView = (umpireItem, umpireIndex) => {
        const { accreditationLevelUmpireRefId, firstName, lastName, yearsUmpired, matchesCount, rank } = umpireItem;

        const { badgeData } = this.props.appState;
        const umpireBadgesData = isArrayNotEmpty(badgeData) ? badgeData : [];

        const umpireBadge = umpireBadgesData.find(badgeItem => badgeItem.id === accreditationLevelUmpireRefId)?.description;
                                            
        return (
            <>
                {this.umpireLineCellView(umpireIndex + 1, 'flex-shrink-1 flex-grow-0 pl-4')}
                {this.umpireLineCellView(`${firstName} ${lastName}`)}
                {this.umpireLineCellView(rank ? rank : 'No rank')}
                {this.umpireLineCellView(umpireBadge ? umpireBadge : 'No Accreditation')}
                {this.umpireLineCellView(yearsUmpired && yearsUmpired > 1 ? yearsUmpired + ' Years' : 0 + ' Year')}
                {this.umpireLineCellView(`${matchesCount ? matchesCount : 0} ${AppConstants.games}`)}
            </>
        )
    }

    umpireLineCellView = (data, additionalClass) => (
        <div className={`col-sm d-flex justify-content-flex-start align-items-center px-3 ${additionalClass ? additionalClass : ''}`}>
            <span className="player-grading-haeding-player-name-text pointer">
                {data}
            </span>
        </div>
    )

    poolModalView = () => {
        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.addPool}
                visible={this.state.savePoolModalVisible}
                onOk={this.handleOkSavePool}
                onCancel={this.handleCancelSavePool}
            >
                <div>
                    <InputWithHead
                        auto_complete="off"
                        required="pt-0 mt-0"
                        heading={AppConstants.addPool}
                        placeholder={AppConstants.pleaseEnterPoolName}
                        onChange={(e) => this.setState({ newPoolName: e.target.value })}
                        value={this.state.newPoolName}
                    />
                </div>
            </Modal>
        )
    }

    deletePoolModalView = () => {
        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.deletePool}
                visible={this.state.deleteModalVisible}
                onOk={this.handleDeletePoolOk}
                onCancel={this.handleDeletePoolCancel}
            >
                <p>{AppConstants.removePoolMsg}</p>
            </Modal>
        )
    }

    updatePoolModalView = () => {
        const { umpireForAction, umpirePoolIdToUpdate, assignedData, updatePoolModalVisible } = this.state;

        const umpirePoolDataToAdd = assignedData.filter(poolDataItem => {
            const hasUmpire = poolDataItem.umpires.some(umpireItem => umpireItem.id === umpireForAction?.id);
            return !hasUmpire;
        });

        return (
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.addUmpireToPool}
                visible={updatePoolModalVisible}
                onOk={this.handleOkUpdatePool}
                onCancel={this.handleCancelUpdatePool}
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
                onOk={this.handleOkRemoveUmpireFromPool}
                onCancel={this.handleCancelRemoveUmpireFromPool}
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
                onOk={this.handleOkMoveToUnassigned}
                onCancel={this.handleCancelMoveToUnassigned}
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
        const { unassignedData, isOrganiserView, totalUnassigned } = this.state;
        const { currentPage_Data, totalCount_Data } = this.props.umpireState;

        return (
            <div>
                <Droppable droppableId="1">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} className="player-grading-droppable-view">
                            <div className="player-grading-droppable-heading-view">
                                <div className="row">
                                    <div className="col-sm d-flex align-items-center">
                                        <span className="player-grading-haeding-team-name-text">{AppConstants.unassigned}</span>
                                        <span className="player-grading-haeding-player-count-text ml-4 flex-shrink-0">
                                            {totalUnassigned > 1 ? totalUnassigned + " Umpires" : totalUnassigned + " Umpire"}
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
                                            <div className="row flex-nowrap">
                                                {this.umpireLineView(umpireItem, umpireIndex)}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <div className="comp-dashboard-botton-view-mobile">
                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end" />

                    <div className="d-flex justify-content-center">
                        {totalCount_Data > currentPage_Data * 10 &&
                            <Button
                                onClick={this.handleLoadMore}
                            >
                                {AppConstants.loadMore}
                            </Button>
                        }
                    </div>
                </div>
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
            <div className="fluid-width pool-space">
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
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="5" />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}

                    <Content>
                        {this.contentView()}
                        {this.poolModalView()}
                        {this.confirmUnassignModalView()}
                        {this.updatePoolModalView()}
                        {this.removeUmpireFromPoolModalView()}
                        {this.deletePoolModalView()}
                    </Content>
                    <Footer 
                        style={{ padding: '0 22px 100px' }}
                    >
                        {this.footerView()}
                    </Footer>
                </Layout>

                <Loader 
                    visible={
                        this.props.umpirePoolAllocationState.onLoad || 
                        this.props.appState.onLoad || 
                        this.props.umpireState.onLoad
                    } 
                />
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
        getRefBadgeData,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePoolAllocationState: state.UmpirePoolAllocationState,
        umpireState: state.UmpireState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePoolAllocation);
