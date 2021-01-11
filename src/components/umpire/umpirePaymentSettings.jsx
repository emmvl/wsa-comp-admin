import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Form,
    Checkbox,
    Radio,
    Modal,
} from "antd";

import InputWithHead from "../../customComponents/InputWithHead";
import InputNumberWithHead from "../../customComponents/InputNumberWithHead";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";

import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

import { isArrayNotEmpty } from "../../util/helpers";
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage';

import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import { 
    umpirePaymentSettingUpdate,
    getUmpirePaymentSettings,
} from '../../store/actions/umpireAction/umpirePaymentSettingAction';
import { liveScoreGetDivision } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";
import { getUmpirePoolData } from "../../store/actions/umpireAction/umpirePoolAllocationAction";
import { getRefBadgeData } from '../../store/actions/appAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class UmpirePaymentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            paymentSettingsData: null,
            selectedDivisions: null,
            allCompetition: null,
            isCompetitionOrganiser: false,
            isAffiliateOrganisations: false,
            allDivisionVisible: false,
            deleteModalVisible: false,
        };
    }

    componentDidMount() {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        // this.props.umpirePaymentSettingUpdate({ value: null, key: 'refreshPage' })
        this.props.getRefBadgeData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                const compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = !!compList.length && compList[0].id;
                
                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (!!compList.length) {
                    const orgId = compList[0].competitionOrganisation.orgId;

                    this.props.liveScoreGetDivision(firstComp);
                    this.props.getUmpirePoolData({ orgId, compId: firstComp })
                }

                const compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, allCompetition: compList })
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpirePaymentSettings(this.state.selectedComp);
        }

        if (this.props.umpirePaymentSettingState !== prevProps.umpirePaymentSettingState && !!this.props.umpirePaymentSettingState.paymentSettingsData
            && !this.props.umpirePaymentSettingState.onLoad) {

            const { paymentSettingsData } = this.props.umpirePaymentSettingState;
            const { divisionList } = this.props.liveScoreTeamState;
            const { umpirePaymentSettings } = this.props.umpirePaymentSettingState.paymentSettingsData;

            const isCompetitionOrganiser = !!paymentSettingsData.umpirePaymentSettings.length;
            const isAffiliateOrganisations = !!paymentSettingsData.allowedDivisionsSetting;

            const selectedDivisionsOrganiser = isCompetitionOrganiser ? JSON.parse(JSON.stringify(umpirePaymentSettings[0].divisions)) : [];
            const selectedDivisionsAffiliate = isAffiliateOrganisations ? JSON.parse(JSON.stringify(paymentSettingsData.allowedDivisionsSetting.divisions)) : [];

            const selectedDivisions = [ ...selectedDivisionsOrganiser, ...selectedDivisionsAffiliate ];

            const paymentSettingsDataObj = {
                umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
                umpirePaymentSettings: !!paymentSettingsData.umpirePaymentSettings.length ? 
                    paymentSettingsData.umpirePaymentSettings.map(settingsItem => ({
                        allDivisions: settingsItem.allDivisions,
                        divisions: settingsItem.divisions.map(item => item.id),
                        UmpirePaymentFeeType: settingsItem.UmpirePaymentFeeType,
                        byBadge: !!settingsItem.byBadge.length ? 
                                settingsItem.byBadge.map(byBadgeSetting => ({
                                    accreditationUmpireRefId: byBadgeSetting.accreditationUmpireRefId,
                                    rates: byBadgeSetting.rates.map(rate => ({
                                        roleId: rate.roleId,
                                        rate: rate.rate,
                                    }))
                                })) : [],
                        byPool: !!settingsItem.byPool.length ? 
                                settingsItem.byPool.map(byPoolSetting => ({
                                    umpirePoolId: byPoolSetting.umpirePoolId,
                                    rates: byPoolSetting.rates.map(rate => ({
                                        roleId: rate.roleId,
                                        rate: rate.rate,
                                    }))
                                })) : [],
                })) : [],
                allowedDivisionsSetting: !!paymentSettingsData.allowedDivisionsSetting ? { 
                    allDivisions: paymentSettingsData.allowedDivisionsSetting.allDivisions,
                    divisions: paymentSettingsData.allowedDivisionsSetting.divisions.map(item => item.id),
                } : null,
            }

            this.setState({ paymentSettingsData: paymentSettingsDataObj, selectedDivisions, isCompetitionOrganiser, isAffiliateOrganisations });

            // console.log('this.props.umpirePaymentSettingState.paymentSettingsData', paymentSettingsDataObj);
        }

        // console.log('this.props.umpirePoolAllocationState.umpirePoolData', this.props.umpirePoolAllocationState.umpirePoolData);
    }

    handleDeleteModal = key => {
        if (key === "ok") {
            // const { allocationSettingsData, sectionDataSelected, sectionDataToDeleteIndex } = this.state;
            // const allocationSettingsDataCopy = [ ...allocationSettingsData ];;
            // const sectionDataSelectedCopy = [ ...sectionDataSelected ];

            // const { umpireAllocatorTypeRefId = null } = sectionDataSelected[0];

            // const otherUmpireData = allocationSettingsDataCopy.filter(item => item.umpireAllocatorTypeRefId !== umpireAllocatorTypeRefId);
            // sectionDataSelectedCopy.splice(sectionDataToDeleteIndex, 1);

            // const newAllocationSettingsData = [...otherUmpireData, ...sectionDataSelectedCopy ];

            // const newSelectedDivisions = [];

            // newAllocationSettingsData.forEach(item => {
            //     newSelectedDivisions.push(...item.divisions);
            // });

            // this.setState({ allocationSettingsData: newAllocationSettingsData, selectedDivisions: newSelectedDivisions });
        }

        this.setState({ deleteModalVisible: false, sectionDataSelected: null, sectionDataToDeleteIndex: null });
    }

    handleAllDivisionModal = key => {
        if (key === "ok") {
            this.setState({ 
                // allocationSettingsData: this.state.tempAllocationSettingsData,
                // selectedDivisions: this.state.tempSelectedDivisions,
            });
        }

        this.setState({ 
            // allDivisionVisible: false, 
            // tempAllocationSettingsData: null,
            // tempSelectedDivisions: null,
        });
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex align-items-center bg-transparent">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpirePaymentSetting}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    onChangeComp = compID => {
        const compeList = this.state.allCompetition;
        let orgId = null;

        for (let i in compeList) {
            if (compeList[i].id === compID) {
                orgId = compeList[i].competitionOrganisation.orgId;
            }
        }

        this.props.liveScoreGetDivision(compID);
        this.props.getUmpirePoolData({ orgId, compID });

        setUmpireCompId(compID);

        this.setState({ selectedComp: compID });
    }

    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                className="d-flex align-items-center"
                                style={{ width: "fit-content" }}
                            >
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
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
        );
    };

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit">
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        const { isCompetitionOrganiser, isAffiliateOrganisations } = this.state;

        return (
            <div className='pt-4 mt-5' style={{ padding: '3%', minWidth: 240 }}>
                <span className='text-heading-large pt-2'>{AppConstants.whoPayUmpire}</span>

                <div className="d-flex flex-column">
                    <Checkbox
                        className="single-checkbox"
                        onChange={e => this.setState({ isCompetitionOrganiser: e.target.checked })}
                        checked={isCompetitionOrganiser}
                    >
                        {AppConstants.competitionOrganiser}
                    </Checkbox>

                    {isCompetitionOrganiser && (
                        <div className="inside-container-view">
                            {this.divisionsSelectView('umpirePaymentSettings')}
                            {this.feesView()}
                        </div>
                    )}

                    <Checkbox
                        className="single-checkbox ml-0"
                        onChange={e => this.setState({ isAffiliateOrganisations: e.target.checked })}
                        checked={isAffiliateOrganisations}
                    >
                        {AppConstants.affiliateOrganisations}
                    </Checkbox>

                    {isAffiliateOrganisations && (
                        <div className="inside-container-view">
                            {this.divisionsSelectView('allowedDivisionsSetting')}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    contentView2 = () => {
        return (
            <div className="content-view pt-4 mt-5">
                <span className='text-heading-large pt-2 pb-2'>{AppConstants.whoPayUmpire}</span>
                <div className="d-flex flex-column">
                    {this.umpireSettingsSectionView(AppConstants.competitionOrganiser, 246)}
                    {this.umpireSettingsSectionView(AppConstants.affiliateOrganisations, 247)}
                </div>

                {this.deleteConfirmModalView()}
                {this.allDivisionModalView()}
            </div>
        );
    };

    umpireSettingsSectionView = (sectionTitle, umpireAllocatorTypeRefId) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { allocationSettingsData, selectedDivisions } = this.state;

        const sectionData = allocationSettingsData && umpireAllocatorTypeRefId ?
            allocationSettingsData.filter(item => item.umpireAllocatorTypeRefId === umpireAllocatorTypeRefId)
            : allocationSettingsData ? allocationSettingsData.filter(item => !item.hasUmpires)
            : null;

        return (
            <>
                <Checkbox
                    onChange={(e) => this.handleChangeWhoAssignsUmpires(e, umpireAllocatorTypeRefId)}
                    checked={!!sectionData?.length}
                    className="mx-0 mb-2"
                >
                    {sectionTitle}
                </Checkbox>
                {sectionData && !!sectionData.length && (
                    <div className="position-relative" style={{ paddingBottom: 35 }}>
                        {sectionData.map((boxData, sectionDataIndex) => (
                        <div key={'settingsBox_' + sectionDataIndex} className="inside-container-view mb-2 mt-4">
                            {sectionData.length > 1 && (
                                <div className="d-flex float-right">
                                    <div
                                        className="transfer-image-view pt-0 pointer ml-auto"
                                            onClick={() => this.handleClickDeleteModal(sectionDataIndex, sectionData)}
                                    >
                                        <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                        <span className="user-remove-text">{AppConstants.remove}</span>
                                    </div>
                                </div>
                            )}
                            <Checkbox
                                onChange={(e) => this.handleChangeSettings(sectionDataIndex, 'allDivisions', e.target.checked, sectionData)}
                                checked={boxData.allDivisions}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            
                            <Select
                                mode="multiple"
                                placeholder="Select"
                                style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                onChange={divisions => this.handleChangeSettings(sectionDataIndex, 'divisions', divisions, sectionData)}
                                value={(boxData.allDivisions ? divisionList : boxData.divisions).map(division => division.id)}
                            >
                                {(divisionList || []).map((item) => (
                                    <Option
                                        key={'compOrgDivision_' + item.id}
                                        disabled={
                                            (selectedDivisions.some(selectedDivision => selectedDivision.id === item.id 
                                            && !boxData.allDivisions && !boxData.divisions.find(division => division.id === item.id)))
                                        }
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            {umpireAllocatorTypeRefId && this.boxSettingsView(boxData, sectionDataIndex, sectionData)}
                        </div>
                        ))}
                        {selectedDivisions.length < this.props.liveScoreTeamState.divisionList.length
                            && umpireAllocatorTypeRefId 
                            && (
                                <div className="row mb-5 position-absolute">
                                    <div 
                                        className="col-sm"
                                        onClick={() => this.handleAddBox(umpireAllocatorTypeRefId)}
                                    >
                                        <span className="input-heading-add-another pointer pt-0">+ {AppConstants.addDivision}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </>
        )
    }

    divisionsSelectView = () => {

        const { divisionList } = this.props.liveScoreTeamState;
        const { selectedDivisions, paymentSettingsData } = this.state;

        return (
            <div className="d-flex flex-column">

                <Checkbox
                    // onChange={(e) => this.handleChangeSettings(sectionDataIndex, 'allDivisions', e.target.checked, sectionData)}
                    // checked={boxData.allDivisions}
                >
                    {AppConstants.allDivisions}
                </Checkbox>
                            
                <Select
                    mode="multiple"
                    placeholder="Select"
                    style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                    // onChange={divisions => this.handleChangeSettings(sectionDataIndex, 'divisions', divisions, sectionData)}
                    // value={(boxData.allDivisions ? divisionList : boxData.divisions).map(division => division.id)}
                >
                    {(divisionList || []).map((item) => (
                        <Option
                            key={'compDivision_' + item.id}
                            // disabled={
                            //     (selectedDivisions.some(selectedDivision => selectedDivision.id === item.id 
                            //         && !boxData.allDivisions && !boxData.divisions.find(division => division.id === item.id)
                            //         ))
                            //     }
                            value={item.id}
                        >
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </div>
        )
    }

    feesView = () => {
        const { byBadgeBtn, byPoolBtn, inputFieldForByPool } = this.props.umpirePaymentSettingState;
        const { umpirePoolData } = this.props.umpirePoolAllocationState;

        return (
            <div>
                <span className='text-heading-large pt-3'>{AppConstants.fees}</span>
                <div className="d-flex flex-column">
                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byBadge'
                        })}
                        checked={byBadgeBtn}
                        className="p-0"
                    >
                        {AppConstants.byBadge}
                    </Radio>
                    {byBadgeBtn && (
                        <div>
                            {this.byBadgeView()}
                        </div>
                    )}

                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byPool'
                        })}
                        checked={byPoolBtn}
                        className="p-0 mt-4"
                    >
                        {AppConstants.byPool}
                    </Radio>
                    {byPoolBtn && (
                        <div>
                            {inputFieldForByPool.map((item, index) => (
                                <div key={"inputFieldForByPool" + index}>
                                    {this.inputFieldsForByPool(item, index)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    inputFieldsForByPool = (item, index) => {
        const { inputFieldForByPool } = this.props.umpirePaymentSettingState;

        return (
            <div>
                <div className="row">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'name',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].name}
                        />
                    </div>
                    
                    <div className='col-sm input-width'>
                        <InputNumberWithHead
                            prefixValue="$"
                            defaultValue={0}
                            min={0}
                            precision={2}
                            step={0.01}
                            heading={AppConstants.umpireRate}
                            // value={inputFieldForByPool[index].umpireRate}
                            // onChange={e => console.log('changed', e)}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputNumberWithHead
                            prefixValue="$"
                            defaultValue={0}
                            min={0}
                            precision={2}
                            step={0.01}
                            heading={AppConstants.umpireResRate}
                            // value={inputFieldForByPool[index].umpReserveRate}
                            // onChange={e => console.log('changed', e)}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputNumberWithHead
                            prefixValue="$"
                            defaultValue={0}
                            min={0}
                            precision={2}
                            step={0.01}
                            heading={AppConstants.umpireCoachRate}
                            // value={inputFieldForByPool[index].umpCoachRate}
                            // onChange={e => console.log('changed', e)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    byBadgeView = () => {
        const { badgeDataCompOrg } = this.props.umpirePaymentSettingState;
        const badge = isArrayNotEmpty(badgeDataCompOrg) ? badgeDataCompOrg : [];

        return (
            <div className="mb-4">
                {badge.map((item, index) => (
                    <div key={"inputFieldArray" + index}>
                        {this.inputFields(item, index)}
                    </div>
                ))}
            </div>
        )
    }

    inputFields = (badgeData, index) => {
        return (
            <div>
                <div className="row">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'name'
                            })}
                            value={badgeData.description}
                            disabled
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputNumberWithHead
                            prefixValue="$"
                            defaultValue={0}
                            min={0}
                            precision={2}
                            step={0.01}
                            heading={AppConstants.umpireRate}
                            // value={badgeData.umpireRate}
                            // onChange={e => console.log('changed', e)}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputNumberWithHead
                            prefixValue="$"
                            defaultValue={0}
                            min={0}
                            precision={2}
                            step={0.01}
                            heading={AppConstants.umpireResRate}
                            // value={badgeData.umpReserveRate}
                            // onChange={e => console.log('changed', e)}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputNumberWithHead
                            prefixValue="$"
                            defaultValue={0}
                            min={0}
                            precision={2}
                            step={0.01}
                            heading={AppConstants.umpireCoachRate}
                            // value={badgeData.umpCoachRate}
                            // onChange={e => console.log('changed', e)}
                        />
                    </div>
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
                    title={AppConstants.divisionSettings}
                    visible={this.state.allDivisionVisible}
                    onOk={() => this.handleAllDivisionModal("ok")}
                    onCancel={() => this.handleAllDivisionModal("cancel")}
                >
                    <p>{AppConstants.divisionAllDivisionMsg}</p>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="9" />
                <Layout>
                    <Form
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            <div className="formView umpire-form-view">{this.contentView()}</div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                    <Loader visible={this.props.umpireCompetitionState.onLoad || this.props.umpirePaymentSettingState.onLoad
                            || this.props.liveScoreTeamState.onLoad || this.props.umpirePoolAllocationState.onLoad} 
                    />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        umpirePaymentSettingUpdate,
        getRefBadgeData,
        getUmpirePaymentSettings,
        liveScoreGetDivision,
        getUmpirePoolData,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState,
        umpirePoolAllocationState: state.UmpirePoolAllocationState,
        liveScoreTeamState: state.LiveScoreTeamState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePaymentSetting);
