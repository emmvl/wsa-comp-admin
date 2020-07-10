import React, { Component } from "react";
import { Layout, Breadcrumb, Button, } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import CSVReader from 'react-csv-reader'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreMatchImportAction } from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import Loader from '../../customComponents/loader'
import { message } from "antd";
import ValidationConstants from "../../themes/validationConstant";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from "../../util/history";
import { exportFilesAction } from "../../store/actions/appAction"
import { NavLink } from 'react-router-dom';

const { Content, Header, Footer } = Layout;
class LiveScoreMatchImport extends Component {
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
                                <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importMatch}</Breadcrumb.Item>
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

    onExport() {
        let url = AppConstants.matchExport + this.state.competitionId
        this.props.exportFilesAction(url)
    }

    contentView = () => {
        return (
            <div className="content-view pt-4">
                <span className="user-contact-heading">{AppConstants.fileInput}</span>
                <div className="col-sm">
                    <div className="row">
                        {/* <CSVReader
                            cssClass="react-csv-input"
                            onFileLoaded={this.handleForce}
                        /> */}
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
                    </div>
                </div>
                {/* <span className="user-contact-heading">{AppConstants.exampleBlock}</span> */}
                <div className="col-sm"
                    style={{ marginTop: 10 }}>
                    <div className="row">
                        <div className="reg-add-save-button">
                            <Button onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                                {AppConstants.upload}
                            </Button>
                        </div>

                        <div className="reg-add-save-button ml-3"  >
                            <NavLink to="/templates/wsa-livescore-import-match.csv" target="_blank" download>
                                <Button className="primary-add-comp-form" type="primary">
                                    {AppConstants.downloadTemplate}
                                </Button>
                            </NavLink>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    onUploadBtn() {
        const { id } = JSON.parse(getLiveScoreCompetiton())

        if (this.state.csvdata) {
            this.props.liveScoreMatchImportAction(id, this.state.csvdata)
        } else {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error(ValidationConstants.csvField)
        }
    }

    /////// render function 
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"2"} />
                <Loader visible={this.props.liveScoreMatchListState.onLoad || this.props.appState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
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
    return bindActionCreators({ liveScoreMatchImportAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchListState: state.LiveScoreMatchState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreMatchImport));