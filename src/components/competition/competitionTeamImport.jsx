import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table } from "antd";
//import './liveScore.css';
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    competitionTeamsImportAction, competitionImportDataCleanUpAction
} from "../../store/actions/competitionModuleAction/competitionPartPlayerGradingAction";
import Loader from '../../customComponents/loader'
import { message } from "antd";
import ValidationConstants from "../../themes/validationConstant";
import { getOrganisationData } from "../../util/sessionStorage";
import history from "../../util/history";
import AppUniqueId from "../../themes/appUniqueId";

const { Content, Header, Footer } = Layout;

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank'
    },
    {
        title: 'Team Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division'
    },
    {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade'
    },
    {
        title: 'Message',
        dataIndex: 'message',
        key: 'message'
    }
];

class CompetitionTeamImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvdata: null,
            competitionId: "",
            buttonPressed: "",
            loading: false,
            screenNavigationKey: ""
        }
    }

    componentDidMount() {
        this.props.competitionImportDataCleanUpAction("team");
        let competitionId = this.props.location.state.competitionId;
        let screenNavigationKey = this.props.location.state.screenNavigationKey;
        this.setState({ competitionId: competitionId, screenNavigationKey: screenNavigationKey })
    }

    componentDidUpdate(nextProps) {
        let teamsImportData = this.props.partPlayerGradingState.teamsImportData;
        if (nextProps.partPlayerGradingState != this.props.partPlayerGradingState) {
            if (this.props.partPlayerGradingState.onLoad == false && this.state.loading === true) {
                this.setState({ loading: false });
                if (!this.props.partPlayerGradingState.error && this.props.partPlayerGradingState.status == 1) {
                    if (this.state.buttonPressed == "upload") {
                        if (teamsImportData.length === 0) {
                            this.props.competitionImportDataCleanUpAction("Team");
                            if (this.state.screenNavigationKey == "ProposedPlayerGrading") {
                                history.push('/competitionPartPlayerGrades');
                            }
                            else if (this.state.screenNavigationKey == "PlayerGrading") {
                                history.push('/competitionPlayerGrades');
                            }
                        }
                    }
                }
            }
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }}>
                    <div className="row">
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importTeams}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        )
    }

    handleForce = data => {
        this.setState({ csvdata: data.target.files[0], isProceed: 0 })
    };

    onUploadBtn() {
        let payload = {
            competitionUniqueKey: this.state.competitionId,
            organisationUniqueKey: getOrganisationData().organisationUniqueKey,
            csvFile: this.state.csvdata,
            isProceed: this.state.isProceed
        }

        if (this.state.csvdata) {
            this.props.competitionTeamsImportAction(payload)
            this.setState({ buttonPressed: "upload", loading: true });
            let e = document.getElementById("teamImport");
            e.value = null;
        } else {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error(ValidationConstants.csvField)
        }
    }

    contentView = () => {
        return (
            <div className="content-view pt-4">
                <span className="user-contact-heading">{AppConstants.fileInput}</span>
                <div className="col-sm">
                    <div className="row">
                        <input
                            style={{ cursor: "pointer" }}
                            className="pt-2 pb-2"
                            type="file"
                            id="teamImport"
                            ref={(input) => { this.filesInput = input }}
                            name="file"
                            // icon="file text outline"
                            // iconPosition="left"
                            // label="Upload CSV"
                            // labelPosition="right"
                            placeholder="UploadCSV..."
                            onChange={this.handleForce}
                            accept=".csv"
                        />
                    </div>
                </div>

                <div className="col-sm" style={{ marginTop: 10 }}>
                    <div className="row">
                        <div className="reg-add-save-button">
                            <Button id={AppUniqueId.importPlayerTeam_upload_btn} onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                                {AppConstants.upload}
                            </Button>
                        </div>
                        <div className="reg-add-save-button" style={{ marginLeft: '20px' }}>
                            <NavLink to="/templates/wsa-import-teams.csv" target="_blank" download>
                                <Button id={AppUniqueId.impPlayerTeam_template_btn} className="primary-add-comp-form" type="primary">
                                    {AppConstants.downloadTemplate}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    invalidTeamsView = () => {
        let invalidTeams = this.props.partPlayerGradingState.teamsImportData;
        return (
            <div className="comp-dash-table-view mt-2">
                <span className="user-contact-heading">{AppConstants.invalidPlayers}</span>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={invalidTeams}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }

    render() {
        let invalidTeams = this.props.partPlayerGradingState.teamsImportData;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey={this.state.screenNavigationKey == "PlayerGrading" ? "4" : "14"} />
                <Loader visible={this.props.partPlayerGradingState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                        {invalidTeams != null && invalidTeams.length > 0 ?
                            <div className="formView">
                                {this.invalidTeamsView()}
                            </div>
                            : null}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        competitionTeamsImportAction,
        competitionImportDataCleanUpAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        partPlayerGradingState: state.CompetitionPartPlayerGradingState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionTeamImport);
