import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    Breadcrumb, Button, Layout, Select, Checkbox, Radio,
} from 'antd';

import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import {isArrayNotEmpty} from '../../util/helpers';
import {fixtureCompetitionListAction} from '../../store/actions/LiveScoreAction/LiveScoreFixtureAction';
import {getLiveScoreDivisionList} from '../../store/actions/LiveScoreAction/liveScoreDivisionAction';
import {getliveScoreTeams} from '../../store/actions/LiveScoreAction/liveScoreTeamAction';
import {getMatchPrintTemplateType} from '../../store/actions/commonAction/commonAction';
import {liveScoreMatchListAction} from '../../store/actions/LiveScoreAction/liveScoreMatchAction';
import Loader from '../../customComponents/loader';
import InputWithHead from '../../customComponents/InputWithHead';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import LiveScoreMatchSheetPreviewModal from './matchsheets/LiveScoreMatchSheetPreviewModal';

import './liveScore.css';

const {Header, Footer, Content} = Layout;
const {Option} = Select;

class LiveScoreMatchSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: '2019',
            competition: '2019winter',
            division: 'All',
            grade: 'all',
            teams: 'all',
            value: 'periods',
            gameTimeTracking: false,
            onCompLoad: false,
            selectedComp: null,
            competitionUniqueKey: null,
            onDivisionLoad: false,
            teamLoad: false,
            teamsList: [],
            showPreview: false,
            selectedTeam: 'All',
            organisation: null,
        };
    }

    componentDidMount() {
        const {organisationId} = JSON.parse(localStorage.getItem('setOrganisationData'));
        this.setState({organisation: JSON.parse(localStorage.getItem('setOrganisationData'))});
        this.setState({onCompLoad: true});
        this.props.fixtureCompetitionListAction(organisationId);
        this.props.getMatchPrintTemplateType();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreFixturCompState !== this.props.liveScoreFixturCompState) {
            if (this.state.onCompLoad === true && this.props.liveScoreFixturCompState.onLoad === false) {
                const firstComp = this.props.liveScoreFixturCompState.comptitionList
                    && this.props.liveScoreFixturCompState.comptitionList[0].id;
                const compKey = this.props.liveScoreFixturCompState.comptitionList
                    && this.props.liveScoreFixturCompState.comptitionList[0].competitionUniqueKey;
                this.props.getLiveScoreDivisionList(firstComp);
                this.setState({
                    selectedComp: firstComp,
                    onCompLoad: false,
                    onDivisionLoad: true,
                    competitionUniqueKey: compKey,
                });
                this.props.liveScoreMatchListAction(
                    firstComp,
                    undefined,
                    undefined,
                    undefined,
                    this.state.division === 'All' ? null : this.state.division,
                    undefined,
                    this.state.selectedTeam === 'All' ? null : this.state.selectedTeam
                );
            }
        }

        if (this.props.liveScoreMatchSheetState !== nextProps.liveScoreMatchSheetState) {
            if (this.props.liveScoreMatchSheetState.onLoad === false && this.state.onDivisionLoad === true) {
                if (this.props.liveScoreMatchSheetState.liveScoreDivisionList.length > 0) {
                    const division = this.props.liveScoreMatchSheetState.liveScoreDivisionList[0].id;
                    this.props.getliveScoreTeams(this.state.selectedComp, division);
                    this.setState({
                        onDivisionLoad: false,
                        division,
                        teamLoad: true
                    });
                }
            }

            if (this.props.liveScoreMatchSheetState.onLoad === false && this.state.teamLoad === true) {
                const teams = isArrayNotEmpty(this.props.liveScoreMatchSheetState.allTeamData)
                    ? this.props.liveScoreMatchSheetState.allTeamData[0].id
                    : [];
                this.setState({
                    teamLoad: false,
                    teams,
                });
            }
        }
    }

    showPreview = (show) => {
        this.setState({showPreview: show});
    };

    handleModalOk = () => {
        this.showPreview(false);
    };

    handleModalCancel = () => {
        this.showPreview(false);
    };

    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    onChangeComp(compID) {
        const selectedComp = compID.comp;
        const compKey = compID.competitionUniqueKey;
        this.props.getLiveScoreDivisionList(selectedComp);
        this.setState({
            selectedComp,
            onDivisionLoad: true,
            division: null,
            competitionUniqueKey: compKey,
        });
        this.props.liveScoreMatchListAction(
            selectedComp,
            undefined,
            undefined,
            undefined,
            this.state.division === 'All' ? null : this.state.division,
            undefined,
            this.state.selectedTeam === 'All' ? null : this.state.selectedTeam
        );
    }

    changeDivision(divisionId) {
        const {division} = divisionId;
        this.props.getliveScoreTeams(this.state.selectedComp, division);
        this.setState({
            division,
            teamLoad: true
        });
        this.props.liveScoreMatchListAction(
            this.state.selectedComp,
            undefined,
            undefined,
            undefined,
            division === 'All' ? null : division,
            undefined,
            this.state.selectedTeam === 'All' ? null : this.state.selectedTeam
        );
    }

    onChangeTeam(selectedTeam) {
        this.props.liveScoreMatchListAction(
            this.state.selectedComp,
            undefined,
            undefined,
            undefined,
            this.state.division === 'All' ? null : this.state.division,
            undefined,
            selectedTeam === 'All' ? null : selectedTeam
        );
        this.setState({selectedTeam})
    }

    /// view for breadcrumb
    headerView = () => (
        <Header className="comp-venue-courts-header-view">
            <div className="row">
                <div className="col-sm" style={{display: 'flex', alignContent: 'center'}}>
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.matchSheets}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </Header>
    );

    /// dropdown view containing all the dropdown of header
    dropdownView = () => {
        const competition = this.props.liveScoreFixturCompState.comptitionList
            ? this.props.liveScoreFixturCompState.comptitionList
            : [];
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-2">
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 50,
                                }}
                            >
                                <span className="year-select-heading">
                                  {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select"
                                    style={{minWidth: 160}}
                                    onChange={(comp) => this.onChangeComp({comp})}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => <Option value={item.id} key={item.id}>{item.longName}</Option>)}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /// form content view
    contentView = () => {
        const {liveScoreMatchSheetState} = this.props;
        const division = isArrayNotEmpty(liveScoreMatchSheetState.allDivisionData)
            ? liveScoreMatchSheetState.allDivisionData
            : [];
        const teamList = isArrayNotEmpty(liveScoreMatchSheetState.allTeamData)
            ? liveScoreMatchSheetState.allTeamData
            : [];

        return (
            <div className="content-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.division}/>

                        </div>
                        <div className="col-sm">
                            <Select
                                style={{width: '100%', paddingRight: 1, minWidth: 182}}
                                onChange={(division) => this.changeDivision({division})}
                                value={this.state.division}
                            >
                                {division.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="fluid-width" style={{marginTop: 15}}>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.teams}/>
                        </div>
                        <div className="col-sm">
                            <Select
                                style={{width: '100%', paddingRight: 1, minWidth: 182}}
                                onChange={(selectedTeam) => this.onChangeTeam(selectedTeam)}
                                value={this.state.selectedTeam}
                            >
                                {teamList.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                            </Select>
                        </div>
                    </div>
                </div>

                <Checkbox
                    className="single-checkbox pt-3"
                    defaultChecked={false}
                    onChange={(e) => this.setState({gameTimeTracking: e.target.checked})}>
                    {AppConstants.gameTimeTracking}
                </Checkbox>
                {this.state.gameTimeTracking && (
                    <div className="comp-match-sheets-game-time-track-radio-view">
                        <Radio.Group onChange={this.onChange} value={this.state.value} defaultValue="periods">
                            <Radio value="periods">{AppConstants.periods}</Radio>
                            <Radio value="minutes">{AppConstants.minutes}</Radio>
                        </Radio.Group>
                    </div>
                )}
                <div>
                    <Checkbox
                        className="single-checkbox"
                        defaultChecked
                        onChange={(e) => this.onChange(e)}
                    >
                        {AppConstants.positionTracking}
                    </Checkbox>
                </div>
                <Checkbox
                    className="single-checkbox"
                    defaultChecked
                    onChange={(e) => this.onChange(e)}
                >
                    {AppConstants.shooting}%
                </Checkbox>
            </div>
        );
    };

    /// footer view containing all the buttons like submit and cancel
    footerView = () => (
        <div className="fluid-width">
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button
                                className="save-draft-text"
                                type="save-draft-text"
                                onClick={() => this.showPreview(true)}
                            >
                                {AppConstants.preview}
                            </Button>
                            <Button
                                className="open-reg-button"
                                type="primary"
                            >
                                {AppConstants.print}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <div className="fluid-width" style={{backgroundColor: '#f7fafc'}}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores}/>
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="22"/>
                <Loader visible={this.props.liveScoreMatchSheetState.isLoaderActive}/>
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        <div className="formView">
                            {this.contentView()}
                        </div>
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
                <LiveScoreMatchSheetPreviewModal
                    visible={this.state.showPreview}
                    matchTemplateTypes={this.props.commonReducerState.matchPrintTemplateType}
                    organisation={this.state.organisation}
                    matchList={this.props.liveScoreMatchState.liveScoreMatchList}
                    modalTitle="LiveScores Match Sheet"
                    handleOK={this.handleModalOk}
                    handleCancel={this.handleModalCancel}
                />
            </div>
        );
    }
}

// export default LiveScoreMatchSheet;
function mapDispatchtoprops(dispatch) {
    return bindActionCreators({
        fixtureCompetitionListAction,
        getLiveScoreDivisionList,
        getliveScoreTeams,
        getMatchPrintTemplateType,
        liveScoreMatchListAction,
    }, dispatch);
}

function mapStatetoProps(state) {
    return {
        liveScoreFixturCompState: state.LiveScoreFixturCompState,
        liveScoreMatchSheetState: state.LiveScoreMatchSheetState,
        commonReducerState: state.CommonReducerState,
        liveScoreMatchState: state.LiveScoreMatchState,
    };
}

export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreMatchSheet));
