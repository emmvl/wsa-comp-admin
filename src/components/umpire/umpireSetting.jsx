import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Radio,
    Form,
    Checkbox,
    Modal
} from "antd";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { 
    updateUmpireDataAction, 
    getUmpireAllocationSettings 
} from '../../store/actions/umpireAction/umpireSettingAction'
import { liveScoreGetDivision } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import history from "util/history";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class UmpireSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            deleteModalVisible: false,
            allocationSettingsData: null,

            isAllDivisionChecked: false,

            selectedDivisionList: [],
            compOrgDivisionSelected: [],
            affiliateOrgDivisionSelected: [],

            compOrgBoxNumber: 1,
            affiliateOrgBoxNumber: 1,

            selectAllDivCompOrg: false,
            selectAllDivAffiliate: false,
            selectAllDivNoUmpire: false,
        };
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        this.setState({ loading: true });
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id

                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (!!compList.length) {
                    this.props.liveScoreGetDivision(firstComp);
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpireAllocationSettings(this.state.selectedComp);
        }

        if (this.props.umpireSettingState !== prevProps.umpireSettingState) {
            const { allocationSettingsData } = this.props.umpireSettingState;
            this.setState({ allocationSettingsData });
        }

        // if (this.state.allocationSettingsData !== prevProps.allocationSettingsData) {
        //     const { allocationSettingsData } = this.props.umpireSettingState;
        //     this.setState({ allocationSettingsData });
        // }
    }

    deleteModal = (index) => {
        this.setState({ deleteModalVisible: true, ladderIndex: index });
    }

    handleDeleteModal = (key) => {
        if (key === "ok") {
            // this.props.updateLadderSetting(null, this.state.ladderIndex, "deleteLadder");
        }
        this.setState({ deleteModalVisible: false, ladderIndex: null });
    }

    // handleAllDivisionModal = (key) => {
    //     if (key === "ok") {
    //         this.props.updateLadderSetting(true, this.state.ladderIndex, "isAllDivision");
    //     }
    //     this.setState({ allDivisionVisible: false, ladderIndex: null });
    // }


    divisionSelect = (divisions, selectedDivisionsKey) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { selectedDivisionList } = this.state;

        const filteredDivisionList = divisionList.filter(divisionItem => 
            divisions.some(division => division === divisionItem.id) ||
            selectedDivisionList.some(division => division.id === divisionItem.id)
        );

        this.setState({ 
            selectedDivisionList: filteredDivisionList,
            [selectedDivisionsKey]: divisions,
         });
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex bg-transparent align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpireAllocationSettings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    onChangeComp = (compID) => {
        let selectedComp = compID.comp;
        this.props.liveScoreGetDivision(selectedComp);
        setUmpireCompId(selectedComp)
        let compKey = compID.competitionUniqueKey
        this.setState({ selectedComp, competitionUniqueKey: compKey })
    }

    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-ft d-flex flex-row align-items-center">
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
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
        );
    };

    umpireAllocationRadioView = () => {
        const { allocateViaPool, manuallyAllocate } = this.props.umpireSettingState

        const allocateViaPoolArr = [
            { id: 1, name: 'Random Allocation' },
            { id: 2, name: 'Link to same Team each Round' },
        ]

        return (
            <div>
                <span className='text-heading-large pt-4 pb-2'>{AppConstants.howUmpiresAllocated}</span>
                <div className="d-flex flex-column">
                    <Radio
                        onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "manuallyAllocate" })}
                        checked={manuallyAllocate}
                    >
                        Manually Allocate
                    </Radio>

                    <Radio
                        onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "allocateViaPool" })}
                        checked={allocateViaPool}
                    >
                        Allocate via pools
                    </Radio>

                    {allocateViaPool && (
                        <Radio.Group className="reg-competition-radio ml-5">
                            {allocateViaPoolArr.map((item) => (
                                <Radio key={'allocateViaPool_' + item.id} value={item.id}>{item.name}</Radio>
                            ))}
                        </Radio.Group>
                    )}
                </div>
            </div>
        )
    }

    contentView = () => {
        const { compOrganiser, defaultChecked } = this.props.umpireSettingState;

        return (
            <div className="pt-0 mt-4">
                {this.umpireAllocationRadioView()}

                <span className='text-heading-large pt-5'>{AppConstants.umpireReservePref}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={defaultChecked.reserveChecked}
                    onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "reserveChecked" })}
                >
                    {AppConstants.activeUmpireReserves}
                </Checkbox>

                <span className='text-heading-large pt-5'>{AppConstants.umpireCoach}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={defaultChecked.coachChecked}
                    onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "coachChecked" })}
                >
                    {AppConstants.activeUmpireCoach}
                </Checkbox>
            </div>
        );
    };

    boxSettingsView = boxData => {
        return (
            <div className="pt-0 mt-4">
                {this.boxSettingsRadioView(boxData)}

                <span className='text-heading-large pt-5'>{AppConstants.umpireReservePref}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={boxData.activateReserves}
                    // onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "reserveChecked" })}
                >
                    {AppConstants.activeUmpireReserves}
                </Checkbox>

                <span className='text-heading-large pt-5'>{AppConstants.umpireCoach}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={boxData.activateCoaches}
                    // onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "coachChecked" })}
                >
                    {AppConstants.activeUmpireCoach}
                </Checkbox>
            </div>
        );
    };

    boxSettingsRadioView = boxData => {
        return (
            <div>
                <span className='text-heading-large pt-4 pb-2'>{AppConstants.howUmpiresAllocated}</span>
                <div className="d-flex flex-column">
                    <Radio
                        // onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "manuallyAllocate" })}
                        checked={boxData.umpireAllocationTypeRefId === 242}
                    >
                        {AppConstants.manuallyAllocate}
                    </Radio>

                    <Radio
                        // onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "allocateViaPool" })}
                        checked={boxData.umpireAllocationTypeRefId === 243}
                    >
                        {AppConstants.allocateViaPools}
                    </Radio>
                    <Radio
                        // onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "allocateViaPool" })}
                        checked={boxData.umpireAllocationTypeRefId === 244}
                    >
                        {AppConstants.umpireYourOwnTeam}
                    </Radio>
                    <Radio
                        // onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "allocateViaPool" })}
                        checked={boxData.umpireAllocationTypeRefId === 245}
                    >
                        {AppConstants.umpireYourOwnOrganisation}
                    </Radio>
                </div>
            </div>
        )
    }

    deleteConfirmModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.divisionSettings}
                    visible={this.state.deleteModalVisible}
                    onOk={() => this.handleDeleteModal("ok")}
                    onCancel={() => this.handleDeleteModal("cancel")}
                >
                    <p>{AppConstants.divisionRemoveMsg}</p>
                </Modal>
            </div>
        );
    }

    allDivisionModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal add-membership-type-modalLadder"
                    title={AppConstants.ladderFormat}
                    visible={this.state.allDivisionVisible}
                    // onOk={() => this.handleAllDivisionModal("ok")}
                    // onCancel={() => this.handleAllDivisionModal("cancel")}
                >
                    <p>{AppConstants.ladderAllDivisionRmvMsg}</p>
                </Modal>
            </div>
        );
    }

    ////////top or say first view
    topView = () => {
        const { compOrganiser, affiliateOrg, noUmpire } = this.props.umpireSettingState;

        return (
            <div className="content-view pt-4 mt-5">
                <span className='text-heading-large pt-2 pb-2'>{AppConstants.whoAssignsUmpires}</span>
                <div className="d-flex flex-column">
                    {this.umpireSettingsSectionView(AppConstants.competitionOrganiser, 246)}
                    {this.umpireSettingsSectionView(AppConstants.affiliateOrganisations, 247)}
                    {this.umpireSettingsSectionView(AppConstants.noUmpires)}
                    {/* {this.umpireSettingsContentView(compOrganiser, 'selectAllDivCompOrg', "compOrganiser", "compOrgDivisionSelected", "compOrgBoxNumber", AppConstants.competitionOrganiser, true)}
                    {this.umpireSettingsContentView(affiliateOrg, 'selectAllDivAffiliate', "affiliateOrg", "affiliateOrgDivisionSelected", "affiliateOrgBoxNumber", AppConstants.affiliateOrganisations, true)}
                    {this.umpireSettingsContentView(noUmpire, 'selectAllDivNoUmpire', "noUmpire", '', '', AppConstants.noUmpires, false)} */}
                </div>

                {this.deleteConfirmModalView()}
                {this.allDivisionModalView()}
            </div>
        );
    };

    umpireSettingsSectionView = (sectionTitle, umpireAllocatorTypeRefId) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { allocationSettingsData } = this.state;

        console.log('allocationSettingsData', allocationSettingsData);

        const sectionData = allocationSettingsData && umpireAllocatorTypeRefId ?
            allocationSettingsData.umpireAllocationSettings.filter(item => item.umpireAllocatorTypeRefId === umpireAllocatorTypeRefId)
            : allocationSettingsData ? [allocationSettingsData.noUmpiresUmpireAllocationSetting] : null;

        return (
            <>
                <Checkbox
                    // onChange={(e) => this.setState({ allocationSettingsData: e.target.checked })}
                    checked={!!sectionData}
                    className="mx-0 mb-2"
                >
                    {sectionTitle}
                </Checkbox>
                {sectionData && !!sectionData.length && (
                    <>
                        {sectionData.map((boxData, index) => (
                        <div className="inside-container-view mb-4 mt-4">

                            {sectionData.length > 1 && (
                                <div className="d-flex float-right">
                                    <div
                                        className="transfer-image-view pt-0 pointer ml-auto"
                                            onClick={() => this.deleteModal(index)}
                                    >
                                        <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                        <span className="user-remove-text">{AppConstants.remove}</span>
                                    </div>
                                </div>
                            )}
                            <Checkbox
                                // onChange={(e) => {
                                //     this.setState({ 
                                //         [selectedAllKey]: e.target.checked,
                                //         selectedDivisionList: e.target.checked ? [ ...divisionList ] : [],
                                //         [selectedDivisionsKey]: e.target.checked ? divisionList.map(division => division.id) : [],
                                //     })
                                // }}
                                checked={boxData.allDivisions}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            
                            <Select
                                mode="multiple"
                                placeholder="Select"
                                style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                // onChange={divisions => this.divisionSelect(divisions, selectedDivisionsKey)}
                                // value={this.state[selectedDivisionsKey]}
                            >
                                {(boxData.divisions || []).map((item) => (
                                    <Option
                                        key={'compOrgDivision_' + item.id}
                                        disabled={item.disabled}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            {umpireAllocatorTypeRefId && this.boxSettingsView(boxData)}
                        </div>
                        ))}
                        {/* {this.state.selectedDivisionList.length !==  this.props.liveScoreTeamState.divisionList.length && (
                            <div className="row mb-5">
                                <div 
                                    className="col-sm"
                                    // onClick={() => this.setState({ [boxNumberKey]: this.state[boxNumberKey] + 1 })}
                                >
                                    <span className="input-heading-add-another pointer pt-0">+ {AppConstants.addDivision}</span>
                                </div>
                            </div>
                        )} */}
                    </>
                )}
            </>
        )
    }

    umpireSettingsContentView = (organiser, selectedAllKey, key, selectedDivisionsKey, boxNumberKey, title, isAdditionalSettings) => {
        const { divisionList } = this.props.liveScoreTeamState;

        const organiserBoxMapper = new Array(!!boxNumberKey ? this.state[boxNumberKey] : 1).fill(null);

        return (
            <>
                <Checkbox
                    onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key })}
                    checked={organiser}
                    className="mx-0 mb-2"
                >
                    {title}
                </Checkbox>
                {organiser && (
                    <>
                        {organiserBoxMapper.map((item, index) => (
                        <div className="inside-container-view mb-4 mt-4">

                            {organiserBoxMapper.length > 1 && (
                                <div className="d-flex float-right">
                                    <div
                                        className="transfer-image-view pt-0 pointer ml-auto"
                                            onClick={() => this.deleteModal(index)}
                                    >
                                        <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                        <span className="user-remove-text">{AppConstants.remove}</span>
                                    </div>
                                </div>
                            )}
                            <Checkbox
                                onChange={(e) => {
                                    this.setState({ 
                                        [selectedAllKey]: e.target.checked,
                                        selectedDivisionList: e.target.checked ? [ ...divisionList ] : [],
                                        [selectedDivisionsKey]: e.target.checked ? divisionList.map(division => division.id) : [],
                                    })
                                }}
                                checked={this.state[selectedAllKey]}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            
                            <Select
                                mode="multiple"
                                placeholder="Select"
                                style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                onChange={divisions => this.divisionSelect(divisions, selectedDivisionsKey)}
                                value={this.state[selectedDivisionsKey]}
                            >
                                {(divisionList || []).map((item) => (
                                    <Option
                                        key={'compOrgDivision_' + item.id}
                                        disabled={item.disabled}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            {isAdditionalSettings && this.contentView()}
                        </div>
                        ))}
                        {this.state.selectedDivisionList.length !==  this.props.liveScoreTeamState.divisionList.length && (
                            <div className="row mb-5">
                                <div 
                                    className="col-sm"
                                    onClick={() => this.setState({ [boxNumberKey]: this.state[boxNumberKey] + 1 })}
                                >
                                    <span className="input-heading-add-another pointer pt-0">+ {AppConstants.addDivision}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </>
        )
    }

    checkScreenNavigation = (key) => {
        const { allocateViaPool, manuallyAllocate, affiliateOrg } = this.props.umpireSettingState
        if (affiliateOrg === true && key === "next") {
            history.push("/umpirePayment");
        } else if (allocateViaPool === true && key === "next") {
            history.push("/umpirePoolAllocation");
        } else if (manuallyAllocate === true) {
            history.push("/umpireDashboard");
        }
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            {/* <div className="reg-add-save-button">
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                            </div> */}
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button
                                    className="publish-button save-draft-text"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => this.checkScreenNavigation("save")}
                                >
                                    {AppConstants.save}
                                </Button>
                                <Button
                                    className="publish-button save-draft-text"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => this.checkScreenNavigation("next")}
                                >
                                    {AppConstants.next}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="6" />
                <Layout>
                    <Form
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            <div className="formView">{this.topView()}</div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        updateUmpireDataAction,
        getUmpireAllocationSettings,
        liveScoreGetDivision,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpireSettingState: state.UmpireSettingState,
        liveScoreTeamState: state.LiveScoreTeamState,
        ladderSettingState: state.LadderSettingState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireSetting);
