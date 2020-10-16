import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Button, message } from "antd";

import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import { showInvalidData } from "util/showImportResult";
import { getUmpireCompetiton } from "util/sessionStorage";
import { exportFilesAction } from "store/actions/appAction";
import { umpireDashboardImportAction, umpireDashboardResetImportResultAction } from "store/actions/umpireAction/umpireDashboardAction";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./umpire.css";

const { Content, Header, Footer } = Layout;

const columns = [
    {
        title: "First Name",
        dataIndex: "First Name",
        key: "First Name",
    },
    {
        title: "Last Name",
        dataIndex: "Last Name",
        key: "Last Name",
    },
    {
        title: "Email",
        dataIndex: "Email",
        key: "Email",
    },
    {
        title: "Contact No",
        dataIndex: "Contact No",
        key: "Contact No",
    },
    {
        title: "Organisation",
        dataIndex: "Organisation",
        key: "Organisation",
    },
];

const columnsDashboard = [
    {
        title: "Match Id",
        dataIndex: "Match Id",
        key: "Match Id",
    },
    {
        title: "Start Time",
        dataIndex: "Start Time",
        key: "Start Time",
    },
    {
        title: "Home",
        dataIndex: "Home",
        key: "Home",
    },
    {
        title: "Away",
        dataIndex: "Away",
        key: "Away",
    },
    {
        title: "Round",
        dataIndex: "Round",
        key: "Round",
    },
    {
        title: "Umpire 1 Id",
        dataIndex: "Umpire 1 Id",
        key: "Umpire 1 Id",
    },
    {
        title: "Umpire 1",
        dataIndex: "Umpire 1",
        key: "Umpire 1",
    },
    {
        title: "Umpire 1 Response",
        dataIndex: "Umpire 1 Response",
        key: "Umpire 1 Response",
    },
    {
        title: "Umpire 1 Organisation",
        dataIndex: "Umpire 1 Organisation",
        key: "Umpire 1 Organisation",
    },
    {
        title: "Umpire 2 Id",
        dataIndex: "Umpire 2 Id",
        key: "Umpire 2 Id",
    },
    {
        title: "Umpire 2",
        dataIndex: "Umpire 2",
        key: "Umpire 2",
    },
    {
        title: "Umpire 2 Response",
        dataIndex: "Umpire 2 Response",
        key: "Umpire 2 Response",
    },
    {
        title: "Umpire 2 Organisation",
        dataIndex: "Umpire 2 Organisation",
        key: "Umpire 2 Organisation",
    },
];

class UmpireImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: null,
            screenName: (props.location && props.location.state && props.location.state.screenName) ? props.location.state.screenName : null,
            organisationId: null,
            competitionId: null,
        };
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem("setOrganisationData"));
        let compId = JSON.parse(getUmpireCompetiton());
        this.setState({ organisationId, competitionId: compId });

        this.props.umpireDashboardResetImportResultAction();
    }

    onExport = () => {
        const url = AppConstants.umpireDashboardExport + `competitionId=${this.state.competitionId}&organisationId=${this.state.organisationId}`;
        this.props.exportFilesAction(url);
    };

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
                <Breadcrumb separator=" > ">
                    <Breadcrumb.Item className="breadcrumb-add">
                        {this.state.screenName === "umpireDashboard" ? AppConstants.assignUmpireToMatch : AppConstants.importUmpire}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Header>
        </div>
    );

    titleView = () => (
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
                            <span className="input-heading">{AppConstants.downLoadImportHeading}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    handleForce = data => {
        this.setState({ csvData: data.target.files[0] });
    };

    onUploadBtn = () => {
        let compId = JSON.parse(getUmpireCompetiton());

        if (this.state.csvData) {
            this.props.umpireDashboardImportAction({
                id: compId,
                csvFile: this.state.csvData,
                screenName: this.state.screenName,
            });
        } else {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.csvField);
        }
    };

    contentView = () => (
        <div className="content-view pt-4">
            <span className="user-contact-heading">{AppConstants.fileInput}</span>

            <div className="col-sm">
                <div className="row">
                    <label>
                        <input
                            style={{ cursor: "pointer" }}
                            className="pt-2 pb-2"
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
                    <div className="reg-add-save-button" style={{ marginRight: 10 }}>
                        {this.state.screenName === "umpireRoaster" ? (
                            <Button className="primary-add-comp-form" type="primary">
                                {AppConstants.upload}
                            </Button>
                        ) : (
                                <Button onClick={this.onUploadBtn} className="primary-add-comp-form" type="primary">
                                    {AppConstants.upload}
                                </Button>
                            )}
                    </div>

                    {this.state.screenName === "umpireDashboard" && (
                        <div className="reg-add-save-button">
                            <Button onClick={this.onExport} className="primary-add-comp-form" type="primary">
                                {AppConstants.downloadTemplate}
                            </Button>
                        </div>
                    )}

                    {this.state.screenName === "umpire" && (
                        <div className="reg-add-save-button">
                            <NavLink to="/templates/wsa-livescore-import-umpire.csv" target="_blank" download>
                                <Button className="primary-add-comp-form" type="primary">
                                    {AppConstants.downloadTemplate}
                                </Button>
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    render() {
        const { screenName } = this.state;
        const { umpireDashboardState: { importResult, onLoad } } = this.props;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />

                <InnerHorizontalMenu
                    menu="umpire"
                    umpireSelectedKey={
                        screenName === "umpire"
                            ? "2"
                            : screenName === "umpireRoaster" ? "3" : "1"
                    }
                />

                <Loader visible={onLoad || this.props.appState.onLoad} />

                <Layout>
                    {this.headerView()}

                    {screenName === "umpireDashboard" && this.titleView()}

                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>

                        {showInvalidData(screenName === "umpireDashboard" ? columnsDashboard : columns, importResult)}
                    </Content>

                    <Footer />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireDashboardImportAction,
        umpireDashboardResetImportResultAction,
        exportFilesAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        umpireDashboardState: state.UmpireDashboardState,
        appState: state.AppState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireImport);
