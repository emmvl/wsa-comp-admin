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
    Radio
} from "antd";

import InputWithHead from "../../customComponents/InputWithHead";
import InputNumberWithHead from "../../customComponents/InputNumberWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage';
import { 
    umpirePaymentSettingUpdate,
    getUmpirePaymentSettings,
} from '../../store/actions/umpireAction/umpirePaymentSettingAction';
import { liveScoreGetDivision } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";
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
        };
    }

    componentDidMount() {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        this.props.umpirePaymentSettingUpdate({ value: null, key: 'refreshPage' })
        this.props.getRefBadgeData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                const compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
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

                const compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpirePaymentSettings(this.state.selectedComp);
        }

        if (this.props.umpirePaymentSettingState !== prevProps.umpirePaymentSettingState && !!this.props.umpirePaymentSettingState.paymentSettingsData
            && !this.props.umpirePaymentSettingState.onLoad) {

            const { paymentSettingsData } = this.props.umpirePaymentSettingState;
            const { divisionList } = this.props.liveScoreTeamState;

            const selectedDivisions = [];
    
            // paymentSettingsData.divisions.forEach(item => {
            //     item.allDivisions ? selectedDivisions.push(...divisionList) : selectedDivisions.push(...item.divisions);
            // });
            
            this.setState({ paymentSettingsData, selectedDivisions });

            console.log('this.props.umpirePaymentSettingState.paymentSettingsData', this.props.umpirePaymentSettingState.paymentSettingsData)
        }
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
        this.props.liveScoreGetDivision(compID);
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
        const { paidByCompOrg, paidByAffiliate } = this.props.umpirePaymentSettingState
        return (
            <div className='pt-4 mt-5' style={{ padding: '3%', minWidth: 240 }}>
                <span className='text-heading-large pt-2'>{AppConstants.whoPayUmpire}</span>

                <div className="d-flex flex-column">
                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'paidByComp'
                        })}
                        checked={paidByCompOrg}
                    >
                        {AppConstants.competitionOrganiser}
                    </Checkbox>

                    {paidByCompOrg && (
                        <div className="inside-container-view">
                            {this.paidByCompOrgView()}
                            {this.feesView()}
                        </div>
                    )}

                    <Checkbox
                        className="single-checkbox ml-0"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'paidByAffilate'
                        })}
                        checked={paidByAffiliate}
                    >
                        {AppConstants.affiliateOrganisations}
                    </Checkbox>

                    {paidByAffiliate && (
                        <div className="inside-container-view">
                            {this.paidByAffiliateView()}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    paidByCompOrgView = () => {

        const { divisionList } = this.props.liveScoreTeamState;
        const { selectedDivisions } = this.state;

        console.log('divisionList', divisionList);

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

    paidByAffiliateView = () => {

        const { divisionList } = this.props.liveScoreTeamState;
        const { selectedDivisions } = this.state;

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
                            disabled={
                                (selectedDivisions.some(selectedDivision => selectedDivision.id === item.id 
                                    // && !boxData.allDivisions && !boxData.divisions.find(division => division.id === item.id)
                                    ))
                                }
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
        const { byBadgeBtn, byPoolBtn, inputFieldForByPool } = this.props.umpirePaymentSettingState
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
        const { inputFieldForByPool } = this.props.umpirePaymentSettingState
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
                            onChange={e => console.log('changed', e)}
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
                            onChange={e => console.log('changed', e)}
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
                            onChange={e => console.log('changed', e)}
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
                            onChange={e => console.log('changed', e)}
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
                            onChange={e => console.log('changed', e)}
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
                            onChange={e => console.log('changed', e)}
                        />
                    </div>
                </div>
            </div>
        )
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
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState,
        liveScoreTeamState: state.LiveScoreTeamState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePaymentSetting);
