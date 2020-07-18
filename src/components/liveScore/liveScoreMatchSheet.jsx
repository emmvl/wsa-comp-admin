import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    Breadcrumb, Button, Layout, Select, Table, message,
} from 'antd';

import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import {isArrayNotEmpty} from '../../util/helpers';
import {fixtureCompetitionListAction} from '../../store/actions/LiveScoreAction/LiveScoreFixtureAction';
import {getLiveScoreDivisionList} from '../../store/actions/LiveScoreAction/liveScoreDivisionAction';
import {getliveScoreTeams} from '../../store/actions/LiveScoreAction/liveScoreTeamAction';
import {getMatchPrintTemplateType} from '../../store/actions/commonAction/commonAction';
import {liveScoreMatchListAction} from '../../store/actions/LiveScoreAction/liveScoreMatchAction';
import {liveScoreGetMatchDetailInitiate} from '../../store/actions/LiveScoreAction/liveScoreMatchAction';
import {liveScoreMatchSheetPrintAction, liveScoreMatchSheetDownloadsAction} from '../../store/actions/LiveScoreAction/liveScoreMatchSheetAction';
import Loader from '../../customComponents/loader';
import InputWithHead from '../../customComponents/InputWithHead';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import LiveScoreMatchSheetPreviewModal from './matchsheets/LiveScoreMatchSheetPreviewModal';
import {liveScore_MatchFormate} from '../../themes/dateformate';
import {getLiveScoreCompetiton} from "../../util/sessionStorage";

import './liveScore.css';

const {Header, Content} = Layout;
const {Option} = Select;

const tableSort = (a, b, key) => {
    const stringA = JSON.stringify(a[key]);
    const stringB = JSON.stringify(b[key]);

    return stringA.localeCompare(stringB)
};

class LiveScoreMatchSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competition: null,
            division: null,
            selectedTeam: null,
            onDivisionLoad: false,
            onTeamLoad: false,
            onMatchLoad: false,
            showPreview: false,
            organisation: null,
            selectedMatchId: null,
            selectedMatch: null,
            selectedTemplateId: null,
            templateType: null,
        };
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton());
        this.props.getLiveScoreDivisionList(id);
        this.setState({onDivisionLoad: true, competition: id});
        this.props.getMatchPrintTemplateType();
        this.refreshDownloads();
    }

    componentDidUpdate(nextProps) {
        if (this.props.liveScoreMatchSheetState !== nextProps.liveScoreMatchSheetState) {
            if (this.props.liveScoreMatchSheetState.onDivisionLoad === false && this.state.onDivisionLoad === true) {
                let division = null;
                if (this.props.liveScoreMatchSheetState.liveScoreDivisionList.length > 0) {
                    division = this.props.liveScoreMatchSheetState.liveScoreDivisionList[0].id;
                }
                this.setState({
                    onDivisionLoad: false,
                    onTeamLoad: true,
                    division,
                });
                this.props.getliveScoreTeams(this.state.competition, division);
            }

            if (this.props.liveScoreMatchSheetState.onTeamLoad === false && this.state.onTeamLoad === true) {
                let selectedTeam = null;
                if (this.props.liveScoreMatchSheetState.allTeamData.length > 0) {
                    selectedTeam = this.props.liveScoreMatchSheetState.allTeamData[0].id;
                }

                this.setState({
                    onDivisionLoad: false,
                    onTeamLoad: false,
                    onMatchLoad: true,
                    selectedTeam,
                });

                this.fetchMatchList(this.state.division, selectedTeam);
            }
        }
    }

    onClickPreview = (matchId) => {
        this.setState({selectedMatchId: matchId});
        const match = this.props.liveScoreMatchState.liveScoreMatchList.find((m) => m.id === matchId);

        this.setState({selectedMatch: match});
        this.showPreview(true);
        this.props.liveScoreGetMatchDetailInitiate(matchId, 1);
    };

    showPreview = (show) => {
        this.setState({showPreview: show});
    };

    handleModalOk = () => {
        this.showPreview(false);
    };

    handleModalCancel = () => {
        this.showPreview(false);
        this.setState({selectedMatchId: null});
    };

    printAll = () => {
        if (this.state.selectedTemplateId !== null  && this.props.liveScoreMatchState.liveScoreMatchList.length > 0) {
            this.props.liveScoreMatchSheetPrintAction (
                this.state.competition,
                this.state.division === 'All' ? null : this.state.division,
                this.state.selectedTeam === 'All' ? null : this.state.selectedTeam,
                this.state.templateType,
            );
        } else if (this.props.liveScoreMatchState.liveScoreMatchList.length === 0) {
            message.error('There is no matchsheets to print.')
        } else {
            message.error('Please select template type.')
        }
    };

    onChangeTemplate(selectedTemplateId) {
        const {commonReducerState} = this.props;
        const templateType = commonReducerState.matchPrintTemplateType.find(type => type.id === selectedTemplateId);

        this.setState({
            selectedTemplateId,
            templateType: templateType.description,
        });
    }

    changeDivision(divisionId) {
        const { division } = divisionId;
        this.props.getliveScoreTeams(this.state.competition, division);
        this.setState({
            division,
            teamLoad: true
        });
        this.fetchMatchList(
            division === 'All' ? null : division,
            this.state.selectedTeam === 'All' ? null : this.state.selectedTeam
        );
    }

    onChangeTeam(selectedTeam) {
        this.setState({selectedTeam})
        this.fetchMatchList(
            this.state.division === 'All' ? null : this.state.division,
            selectedTeam === 'All' ? null : selectedTeam
        );
    }

    fetchMatchList(divisionId, teamId) {
        this.props.liveScoreMatchListAction(
            this.state.competition,
            undefined,
            undefined,
            undefined,
            divisionId,
            undefined,
            teamId
        );
    }

    refreshDownloads() {
        this.props.liveScoreMatchSheetDownloadsAction();
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

    columns = [
        {
            title: 'Match Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => tableSort(a, b, "id"),
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            sorter: (a, b) => tableSort(a, b, "startTime"),
            render: (startTime) =>
                <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
        },
        {
            title: 'Round',
            dataIndex: 'round',
            key: 'round',
            sorter: (a, b) => tableSort(a, b, "round"),
            render: (round) =><span>{round.name}</span>
        },
        {
            title: '',
            dataIndex: 'id',
            key: 'operation',
            render: (id) => <div className="d-flex">
                <Button
                    size="small"
                    className="table-preview-button"
                    onClick={() => this.onClickPreview(id)}
                >
                    {AppConstants.preview}
                </Button>
            </div>
        },
    ];

    // Match sheet table
    sheetTableView = () => {
        const { liveScoreMatchState } = this.props;
        let DATA = liveScoreMatchState ? liveScoreMatchState.liveScoreMatchList : [];

        return (
            <div className="formView mt-4">
                <div className="table-responsive p-2 home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={this.columns}
                        dataSource={DATA}
                        rowKey={(record, index) => record.id + index}
                    />
                </div>
            </div>
        )
    };

    dropdownTableColumns = [
        {
            title: 'Sheet ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => tableSort(a, b, "id"),
        },
        {
            title: 'Competition',
            dataIndex: 'competitionName',
            key: 'competitionName',
            sorter: (a, b) => tableSort(a, b, "competitionName"),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => tableSort(a, b, "name"),
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => tableSort(a, b, "createdAt"),
            render: (createdAt) =>
                <span>{createdAt ? liveScore_MatchFormate(createdAt) : ""}</span>
        },
        {
            title: 'Download',
            dataIndex: 'downloadUrl',
            key: 'downloadUrl',
            render: (downloadUrl) => <a className="sheet-download-link" href={downloadUrl}>
                Download
            </a>
        },
    ];

    // Match sheet table
    dropdownTableView = () => {
        let DATA = this.props.liveScoreMatchSheetState.matchSheetDownloads;

        return (
            <div className="formView mt-4 mb-5">
                <div className="table-responsive p-2 home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={this.dropdownTableColumns}
                        dataSource={DATA}
                        rowKey={(record, index) => record.id + index}
                    />
                </div>
            </div>
        )
    };

    /// form content view
    contentView = () => {
        const {liveScoreMatchSheetState, commonReducerState} = this.props;
        const division = isArrayNotEmpty(liveScoreMatchSheetState.allDivisionData)
            ? liveScoreMatchSheetState.allDivisionData
            : [];
        const teamList = isArrayNotEmpty(liveScoreMatchSheetState.allTeamData)
            ? liveScoreMatchSheetState.allTeamData
            : [];
        const templateList = isArrayNotEmpty(commonReducerState.matchPrintTemplateType)
            ? commonReducerState.matchPrintTemplateType
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
                                placeholder="Select division"
                            >
                                {division.length > 0 && division.map(
                                    (item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
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
                                placeholder="Select team"
                            >
                                {teamList.length > 0 && teamList.map(
                                    (item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="fluid-width" style={{marginTop: 15}}>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.templateType}/>
                        </div>
                        <div className="col-sm">
                            {/* <Select
                                style={{width: '100%', paddingRight: 1, minWidth: 182}}
                                onChange={(selectedTemplateId) => this.onChangeTemplate(selectedTemplateId)}
                                value={this.state.selectedTemplateId ?? 'Select template type'}
                                placeholder="Select template type"
                            >
                                {templateList.length > 0 && templateList.map(
                                    (item) => <Option value={item.id} key={item.id}>{item.description}</Option>)}
                            </Select> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /// footer view containing all the buttons like submit and cancel
    footerView = () => (
        <div className="fluid-width">
            <div className="match-sheet-footer-view">
                <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: 15}}>
                    <Button
                        className="open-reg-button mr-3"
                        type="primary"
                        onClick={() => this.refreshDownloads()}
                    >
                        {AppConstants.refreshDownloads}
                    </Button>
                    <Button
                        className="open-reg-button"
                        type="primary"
                        onClick={() => this.printAll()}
                    >
                        {AppConstants.previewAll}
                    </Button>
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <div className="fluid-width" style={{backgroundColor: '#f7fafc'}}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores}/>
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="22"/>
                <Loader
                    visible={
                        this.props.liveScoreMatchSheetState.onDivisionLoad
                        || this.props.liveScoreMatchSheetState.onTeamLoad
                        || this.props.liveScoreMatchSheetState.printLoad
                        || this.props.liveScoreMatchSheetState.onLoad
                        || this.props.liveScoreMatchState.onLoad
                        || this.props.liveScoreMatchState.isFetchingMatchList
                    }
                />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                        {this.sheetTableView()}
                        {this.footerView()}
                        {this.dropdownTableView()}
                    </Content>
                </Layout>
                <LiveScoreMatchSheetPreviewModal
                    visible={this.state.showPreview && !this.props.liveScoreMatchState.onLoad}
                    match={this.state.selectedMatch}
                    matchDetails={this.props.liveScoreMatchState.matchDetails}
                    matchTemplateTypes={this.props.commonReducerState.matchPrintTemplateType}
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
        liveScoreGetMatchDetailInitiate,
        liveScoreMatchSheetPrintAction,
        liveScoreMatchSheetDownloadsAction,
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
