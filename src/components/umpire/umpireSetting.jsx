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
    Checkbox
} from "antd";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { updateUmpireDataAction } from '../../store/actions/umpireAction/umpireSettingAction'
import history from "util/history";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class UmpireSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        };
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
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
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
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
        let selectedComp = compID.comp
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
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
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
                <span className='text-heading-large pt-4 pb-2' >{AppConstants.howUmpiresAllocated}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
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

    ////////form content view
    contentView = () => {
        const { compOrganiser, defaultChecked } = this.props.umpireSettingState
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

    ////////top or say first view
    topView = () => {
        const { compOrganiser, affiliateOrg, compOrgDivisionSelected, selectAllDiv, compOrgDiv } = this.props.umpireSettingState
        return (
            <div className="content-view pt-4 mt-5">
                <span className='text-heading-large pt-2 pb-2'>{AppConstants.whoAssignsUmpires}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Checkbox
                        onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "compOrganiser" })}
                        checked={compOrganiser}
                    >
                        {AppConstants.competitionOrganiser}
                    </Checkbox>
                    {compOrganiser && (
                        <div className="inside-container-view mb-4 mt-4">
                            <Checkbox
                                onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: 'selectAllDiv' })}
                                checked={selectAllDiv}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            {selectAllDiv === false && (
                                <Select
                                    mode='multiple'
                                    placeholder="Select"
                                    style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                    onChange={(divisionId) => this.props.updateUmpireDataAction({ data: divisionId, key: 'compOrgDivisionSelected' })}
                                    value={compOrgDivisionSelected}
                                >
                                    {compOrgDiv.map((item) => (
                                        <Option
                                            key={'compOrgDivision_' + item.id}
                                            disabled={item.disabled}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                            {this.contentView()}
                        </div>
                    )}
                    <Checkbox
                        className="pt-3 ml-0"
                        onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "affiliateOrg" })}
                        checked={affiliateOrg}
                    >
                        {AppConstants.affiliateOrganisations}
                    </Checkbox>
                </div>
            </div>
        );
    };

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
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
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
        updateUmpireDataAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpireSettingState: state.UmpireSettingState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireSetting);
