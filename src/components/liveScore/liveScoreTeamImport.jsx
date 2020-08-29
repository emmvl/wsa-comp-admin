import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Button, message } from "antd";

import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import history from "util/history";
import { getLiveScoreCompetiton } from "util/sessionStorage";
import { showInvalidData } from "util/showImportResult";
import { exportFilesAction } from "store/actions/appAction";
import { liveScoreTeamImportAction } from "store/actions/LiveScoreAction/liveScoreTeamAction";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./liveScore.css";

const { Content, Header, Footer } = Layout;

const columns = [
    {
        title: "Logo",
        dataIndex: "logo",
        key: "logo",
    },
    {
        title: "Team Name",
        dataIndex: "Team_Name",
        key: "Team_Name",
    },
    {
        title: "Grade",
        dataIndex: "Grade",
        key: "Grade",
    },
    {
        title: "Organisation",
        dataIndex: "Organisation",
        key: "Organisation",
    },
];

class LiveScoreTeamImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: null,
            offset: 0,
            competitionId: null,
        };
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton());
        this.setState({ competitionId: id });
    }

    headerView = () => (
        <div className="header-view">
            <Header
                className="form-header-view"
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importTeam}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        </div>
    );

    handleForce = data => {
        this.setState({ csvData: data.target.files[0] });
    };

    onUploadBtn = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton());

        if (this.state.csvData) {
            this.props.liveScoreTeamImportAction({ id, csvFile: this.state.csvData });
        } else {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.csvField);
        }
    };

    onExport = () => {
        let url = AppConstants.teamExport + this.state.competitionId + `&offset=${this.state.offset}&limit=${10}`;
        this.props.exportFilesAction(url);
    };

    contentView = () => (
        <div className="content-view pt-4">
            <span className="user-contact-heading">{AppConstants.fileInput}</span>

            <div className="col-sm">
                <div className="row">
                    {/* <CSVReader cssClass="react-csv-input" onFileLoaded={this.handleForce} /> */}

                    <input
                        type="file"
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
                        <Button onClick={this.onUploadBtn} className="primary-add-comp-form" type="primary">
                            {AppConstants.upload}
                        </Button>
                    </div>

                    <div className="reg-add-save-button ml-3">
                        <NavLink to="/templates/wsa-livescore-import-team.csv" target="_blank" download>
                            <Button className="primary-add-comp-form" type="primary">
                                {AppConstants.downloadTemplate}
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        const { liveScoreTeamState: { onLoad, importResult } } = this.props;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="3" />

                <Loader visible={onLoad || this.props.appState.onLoad} />

                <Layout>
                    {this.headerView()}

                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>

                        {showInvalidData(columns, importResult)}
                    </Content>

                    <Footer>
                        {/* <div className="formView"></div> */}
                    </Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreTeamImportAction, exportFilesAction }, dispatch);
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        liveScoreTeamState: state.LiveScoreTeamState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreTeamImport);
