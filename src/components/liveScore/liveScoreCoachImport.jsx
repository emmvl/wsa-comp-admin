import React, { Component } from "react";
import { Layout, Breadcrumb, Button, } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreCoachImportAction } from '../../store/actions/LiveScoreAction/liveScoreCoachAction'
import Loader from '../../customComponents/loader'
import { message } from "antd";
import ValidationConstants from "../../themes/validationConstant";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from "../../util/history";
import { userExportFilesAction } from "../../store/actions/appAction"


const { Content, Header, Footer } = Layout;


class LiveScoreCoachImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvdata: null,
            competitionId: null
        }
    }

    componentDidMount() {

        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id })
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }} >
                    <div className="row" >
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importCoach}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    handleForce = data => {
        this.setState({ csvdata: data.target.files[0] })
    };

    onUploadBtn() {
        const { id } = JSON.parse(getLiveScoreCompetiton())

        if (this.state.csvdata) {
            this.props.liveScoreCoachImportAction({ id: id, csvFile: this.state.csvdata })
        } else {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error(ValidationConstants.csvField)
        }
    }

    // on Export
    onExport() {
        let url = AppConstants.coachExport + this.state.competitionId
        this.props.userExportFilesAction(url)
    }


    contentView = () => {
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
                        <div className="reg-add-save-button">
                            <Button onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                                {AppConstants.upload}
                            </Button>
                        </div>

                        <div className="reg-add-save-button ml-3"  >
                            <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
                                {AppConstants.downloadTemplate}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /////// render function 
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"23"} />
                <Loader visible={this.props.liveScoreCoachState.onLoad || this.props.appState.onLoad} />
                <Layout>
                    {this.headerView()}
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
    return bindActionCreators({ liveScoreCoachImportAction, userExportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreCoachState: state.LiveScoreCoachState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreCoachImport));