import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Button, message } from "antd";
// import CSVReader from "react-csv-reader";

import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import history from "util/history";
import { getLiveScoreCompetiton } from "util/sessionStorage";
import { showInvalidData } from "util/showImportResult";
import { exportFilesAction } from "store/actions/appAction";
import { liveScoreMatchImportAction } from "store/actions/LiveScoreAction/liveScoreMatchAction";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./liveScore.css";
const { Content, Header, Footer } = Layout;
const columns = [
    {
        title: "Date",
        dataIndex: "Date",
        key: "Date",
    },
    {
        title: "Time",
        dataIndex: "Time",
        key: "Time",
    },
    {
        title: "Grade",
        dataIndex: "Grade",
        key: "Grade",
    },
    {
        title: "Home Team",
        dataIndex: "Home Team",
        key: "Home Team",
    },
    {
        title: "Home Team Score",
        dataIndex: "Home Team Score",
        key: "Home Team Score",
    },
    {
        title: "Away Team",
        dataIndex: "Away Team",
        key: "Away Team",
    },
    {
        title: "Away Team Score",
        dataIndex: "Away Team Score",
        key: "Away Team Score",
    },
    {
        title: "Venue",
        dataIndex: "Venue",
        key: "Venue",
    },
    {
        title: "type",
        dataIndex: "type",
        key: "type",
    },
    {
        title: "matchDuration",
        dataIndex: "matchDuration",
        key: "matchDuration",
    },
    {
        title: "breakDuration",
        dataIndex: "breakDuration",
        key: "breakDuration",
    },
    {
        title: "mnbMatchId",
        dataIndex: "mnbMatchId",
        key: "mnbMatchId",
    },
    {
        title: "mainBreakDuration",
        dataIndex: "mainBreakDuration",
        key: "mainBreakDuration",
    },
    {
        title: "Timezone GMT",
        dataIndex: "Timezone GMT",
        key: "Timezone GMT",
    },
    {
        title: "Round",
        dataIndex: "Round",
        key: "Round",
    },
];

class LiveScoreMatchImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: null,
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
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importMatch}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        </div>
    );

    handleForce = data => {
        this.setState({ csvData: data.target.files[0] });
    };

    onExport = () => {
        let url = AppConstants.matchExport + this.state.competitionId;
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

            {/* <span className="user-contact-heading">{AppConstants.exampleBlock}</span> */}

            <div className="col-sm" style={{ marginTop: 10 }}>
                <div className="row">
                    <div className="reg-add-save-button">
                        <Button onClick={this.onUploadBtn} className="primary-add-comp-form" type="primary">
                            {AppConstants.upload}
                        </Button>
                    </div>

                    <div className="reg-add-save-button ml-3">
                        <NavLink to="/templates/wsa-livescore-import-match.csv" target="_blank" download>
                            <Button className="primary-add-comp-form" type="primary">
                                {AppConstants.downloadTemplate}
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );

    onUploadBtn = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton());

        if (this.state.csvData) {
            this.props.liveScoreMatchImportAction(id, this.state.csvData);
        } else {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.csvField);
        }
    };

    render() {
        const { liveScoreMatchListState: { importResult, onLoad } } = this.props;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="2" />

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
    return bindActionCreators({ liveScoreMatchImportAction, exportFilesAction }, dispatch);
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        liveScoreMatchListState: state.LiveScoreMatchState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreMatchImport);
