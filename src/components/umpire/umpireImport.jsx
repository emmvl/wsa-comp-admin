import React, { Component } from "react";
import { Layout, Breadcrumb, Button, } from 'antd';
import './umpire.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { umpireDashboardImportAction } from '../../store/actions/umpireAction/umpireDashboardAction'
import Loader from '../../customComponents/loader'
import { getUmpireCompetiton } from '../../util/sessionStorage'
import { message } from "antd";
import ValidationConstants from '../../themes/validationConstant'
import { exportFilesAction } from "../../store/actions/appAction"


const { Content, Header, Footer } = Layout;


class UmpireImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvdata: null,
            screenName: props.location ? props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null : null,
            organisationId: null,
            competitionId: null
        }
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        let compId = JSON.parse(getUmpireCompetiton())
        this.setState({ organisationId: organisationId, competitionId: compId })
    }

    onExport() {
        let url = AppConstants.umpireDashboardExport + `competitionId=${this.state.competitionId}&organisationId=${this.state.organisationId}`
        this.props.exportFilesAction(url)
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
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">{this.state.screenName == "umpireDashboard" ? AppConstants.assignUmpireToMatch : AppConstants.importUmpire}</Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    titleView = () => {
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
                                <span className={`input-heading`}>{AppConstants.downLoadImportHeading}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    handleForce = data => {
        this.setState({ csvdata: data.target.files[0] })
    };

    onUploadBtn() {

        let compId = JSON.parse(getUmpireCompetiton())

        if (this.state.csvdata) {
            this.props.umpireDashboardImportAction({ id: compId, csvFile: this.state.csvdata, screenName: this.state.screenName })
        } else {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error(ValidationConstants.csvField)
        }
    }


    contentView = () => {
        console.log(this.state.screenName, 'screenName')
        return (
            <div className="content-view pt-4">
                <span className={`input-heading`}>{AppConstants.fileInput}</span>
                <div className="col-sm">
                    <div className="row">
                        <label>

                            <input
                                type="file"
                                ref={(input) => { this.filesInput = input }}
                                name="file"
                                icon='file text outline'
                                iconPosition='left'
                                label='Upload CSV'
                                labelPosition='right'
                                placeholder='UploadCSV...'
                                onChange={this.handleForce}
                                accept=".csv"
                            />
                        </label>
                    </div>
                </div>

                <div className="col-sm"
                    style={{ marginTop: 10 }}>
                    <div className="row">
                        <div className="reg-add-save-button " style={{ marginRight: 10 }}>
                            {
                                this.state.screenName == 'umpireRoaster' ?

                                    <Button
                                        className="primary-add-comp-form" type="primary">
                                        {AppConstants.upload}
                                    </Button>

                                    : <Button onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                                        {AppConstants.upload}
                                    </Button>
                            }
                        </div>
                        {this.state.screenName == "umpireDashboard" && <div className="reg-add-save-button"  >
                            <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
                                {AppConstants.downloadTemplate}
                            </Button>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }

    /////// render function 
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={this.state.screenName == 'umpire' ? '2' : this.state.screenName == 'umpireRoaster' ? '3' : "1"} />
                <Loader visible={this.props.umpireDashboardState.onLoad || this.props.appState.onLoad} />
                <Layout>
                    {this.headerView()}
                    {this.state.screenName == "umpireDashboard" && this.titleView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                    </Content>
                    <Footer></Footer>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireDashboardImportAction,
        exportFilesAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireDashboardState: state.UmpireDashboardState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((UmpireImport));
// export default LiveScorerCoachImport