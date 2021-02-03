import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Layout, Button, Select, Breadcrumb, Form, } from 'antd';

import { getRefBadgeData } from '../../store/actions/appAction';
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import {
    getUmpirePoolData,
    updateUmpirePoolToDivision
} from "../../store/actions/umpireAction/umpirePoolAllocationAction";
import { liveScoreGetDivision } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";

import { getUmpireCompId, setUmpireCompId, getUmpireCompetitonData } from '../../util/sessionStorage';
import { isArrayNotEmpty } from "../../util/helpers";
import history from "util/history";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';

import AppConstants from "../../themes/appConstants";

import './umpire.css';

const { Header, Footer, } = Layout
const { Option } = Select

class UmpireDivisions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            umpirePoolData: [],
            selectedDivisions: [],
        }
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        this.props.getRefBadgeData()
    }

    componentDidUpdate(prevProps) {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

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
                    this.props.getUmpirePoolData({ orgId: organisationId, compId: firstComp });
                    this.props.liveScoreGetDivision(firstComp);
                }

                const compKey = competitionList.length > 0 && competitionList[0].competitionUniqueKey;
                this.setState({ 
                    selectedComp: firstComp, 
                    loading: false, 
                    competitionUniqueKey: compKey 
                })
            }
        }

        const { umpirePoolData } = this.props.umpirePoolAllocationState;

        if (umpirePoolData !== prevProps.umpirePoolAllocationState.umpirePoolData) {
            const selectedDivisions = [];
            umpirePoolData.forEach(poolItem => {
                selectedDivisions.push(...poolItem.divisions.map(division => division.id));
            });

            this.setState({ umpirePoolData, selectedDivisions });
        }
    }

    onChangeComp = compId => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        
        setUmpireCompId(compId);

        this.props.liveScoreGetDivision(compId);
        this.props.getUmpirePoolData({ orgId: organisationId ? organisationId : 0, compId });

        this.setState({ 
            selectedComp: compId,
        });
    }

    handleChangeDivisions = (divisions, poolIndex) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { umpirePoolData, selectedDivisions } = this.state;

        const umpirePoolDataCopy = JSON.parse(JSON.stringify(umpirePoolData));

        const divisionsToChange = umpirePoolDataCopy[poolIndex].divisions.map(division => division.id);

        const selectedDivisionsRest = selectedDivisions
            .filter(selectedDivision => !divisionsToChange.some(divisionToChange => divisionToChange === selectedDivision));

        selectedDivisionsRest.push(...divisions);

        umpirePoolDataCopy[poolIndex].divisions = divisions.map(divisionId => divisionList.find(divisionObj => divisionObj.id === divisionId));

        this.setState({ 
            umpirePoolData: umpirePoolDataCopy,
            selectedDivisions: selectedDivisionsRest,
        });
    }

    handleSave = () => {
        const { umpirePoolData, selectedComp } = this.state;

        const data = umpirePoolData.reduce((acc, item) => {
            acc[item.id] = item.divisions;
            return acc;
        }, {});

        const body = {
            umpirePools: data
        };

        this.props.updateUmpirePoolToDivision({
            compId: selectedComp,
            body,
        });
    }

    headerView = () => {
        return (
            <div className="header-view divisions">
                <Header className="form-header-view d-flex bg-transparent align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpirePoolsDivision}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    dropdownView = () => {
        const competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        
        return (
            <div className="comp-venue-courts-dropdown-view mt-0 ">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-ft d-flex flex-row align-items-center" style={{ marginBottom: 12 }}>
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

    poolView(poolItem, index) {
        const { divisionList } = this.props.liveScoreTeamState;

        const { selectedDivisions } = this.state;

        return (
            <div className="row py-3" key={'poolItem' + index} style={{ paddingLeft: 15 }}>
                <div className="d-flex align-items-center w-25">
                    <span className="text-overflow">{poolItem.name}</span>
                </div>

                <div className="col-sm">
                    <Select
                        mode="multiple"
                        placeholder="Select"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={divisions => this.handleChangeDivisions(divisions, index)}
                        value={poolItem.divisions.map(division => division.id)}
                    >
                        {(divisionList || []).map((item) => (
                            <Option
                                key={item.id}
                                disabled={
                                    selectedDivisions.some(divisionId => divisionId === item.id)
                                    && 
                                    !poolItem.divisions.find(division => division.id === item.id)
                                }
                                value={item.id}
                            >
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        )
    }

    contentView = () => {
        const { umpirePoolData } = this.state;

        return (
            <div className="content-view pt-5">

                <span className='text-heading-large pt-3 mb-0' >{AppConstants.umpirePools}</span>

                {!!umpirePoolData && umpirePoolData.map((item, index) => (
                    this.poolView(item, index)
                ))}
            </div>
        )
    }

    footerView = () => {
        return (
            <div className="form-footer-button-wrapper">
                <Button 
                    className="publish-button save-draft-text m-0" 
                    type="primary" 
                    htmlType="submit"
                    onClick={this.handleSave}
                >
                    {AppConstants.save}
                </Button>
            </div>
        );
    }

    render = () => {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="4" />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Form autoComplete="off" onFinish={this.handleSubmit} className="login-form">
                        <div className="formView">{this.contentView()}</div>

                        {this.footerView()}
                    </Form>
                </Layout>
                <Loader 
                    visible={this.props.appState.onLoad ||
                        this.props.umpirePoolAllocationState.onLoad ||
                        this.props.liveScoreTeamState.onLoad
                    }
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        getRefBadgeData,
        getUmpirePoolData,
        liveScoreGetDivision,
        updateUmpirePoolToDivision,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        appState: state.AppState,
        umpirePoolAllocationState: state.UmpirePoolAllocationState,
        liveScoreTeamState: state.LiveScoreTeamState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireDivisions);
