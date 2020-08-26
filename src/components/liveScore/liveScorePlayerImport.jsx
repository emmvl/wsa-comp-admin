import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Breadcrumb, Button, Layout, message } from "antd";

import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import history from "util/history";
import { getLiveScoreCompetiton } from "util/sessionStorage";
import { showInvalidData } from "util/showImportResult";
import { exportFilesAction } from "store/actions/appAction";
import { liveScorePlayerImportAction } from "store/actions/LiveScoreAction/liveScorePlayerAction";
import Loader from "customComponents/loader";
import DashboardLayout from "pages/dashboardLayout";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";

import "./liveScore.css";

const { Content, Header, Footer } = Layout;

const columns = [
    {
        title: "First name",
        dataIndex: "first name",
        key: "first name",
    },
    {
        title: "Last name",
        dataIndex: "last name",
        key: "last name",
    },
    {
        title: "DOB",
        dataIndex: "DOB",
        key: "DOB",
    },
    {
        title: "mnbPlayerId",
        dataIndex: "mnbPlayerId",
        key: "mnbPlayerId",
    },
    {
        title: "Team",
        dataIndex: "team",
        key: "team",
    },
    {
        title: "Grade",
        dataIndex: "grade",
        key: "grade",
    },
    {
        title: "Contact no",
        dataIndex: "contact no",
        key: "contact no",
    },
];

class LiveScorerPlayerImport extends Component {
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
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.importPlayer}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        </div>
    );

    handleForce = data => {
        this.setState({
            csvData: data.target.files[0],
        });
    };

    onUploadBtn = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton());

        if (this.state.csvData) {
            this.props.liveScorePlayerImportAction(id, this.state.csvData);
        } else {
            message.config({
                duration: 0.9,
                maxCount: 1,
            });
            message.error(ValidationConstants.csvField);
        }
    };

    onExport= () => {
        let url = AppConstants.exportUrl + `competitionId=${this.state.competitionId}`;
        this.props.exportFilesAction(url);
    };

    contentView = () => (
        <div className="content-view pt-4">
            <span className="input-heading">{AppConstants.fileInput}</span>

            <div className="col-sm">
                <div className="row">
                    <label>
                        <input
                            type="file"
                            ref={(input) => {
                                this.filesInput = input
                            }}
                            name="file"
                            // icon="file text outline"
                            // iconPosition="left"
                            // label="Upload CSV"
                            // labelPosition="right"
                            placeholder="UploadCSV..."
                            onChange={this.handleForce}
                            accept=".csv"
                        />
                    </label>
                </div>
            </div>

            <div className="col-sm" style={{ marginTop: 10 }}>
                <div className="row">
                    <div className="reg-add-save-button">
                        <Button className="primary-add-comp-form" type="primary" onClick={this.onUploadBtn}>
                            {AppConstants.upload}
                        </Button>
                    </div>

                    <div className="reg-add-save-button ml-3">
                        <NavLink to="/templates/wsa-livescore-import-player.csv" target="_blank" download>
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
        const { liveScorePlayerState: { importResult, onLoad } } = this.props;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="7" />

                <Loader visible={onLoad || this.props.appState.onLoad} />

                <Layout>
                    {this.headerView()}

                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>

                        {showInvalidData(columns, importResult)}
                    </Content>

                    <Footer />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScorePlayerImportAction, exportFilesAction }, dispatch);
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        liveScorePlayerState: state.LiveScorePlayerState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScorerPlayerImport);
