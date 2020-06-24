import React, { Component } from "react";
import { Layout, Breadcrumb, Button, } from 'antd';
// import './umpire.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { umpireDashboardImportAction } from '../../store/actions/umpireAction/umpireDashboardAction'
import { liveScoreUmpireImportAction } from '../../store/actions/LiveScoreAction/livescoreUmpiresAction'
import Loader from '../../customComponents/loader'
import { getUmpireCompetiton } from '../../util/sessionStorage'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from "../../util/history";

import { message } from "antd";
import ValidationConstants from '../../themes/validationConstant'


const { Content, Header, Footer } = Layout;


class LiveScoreUmpireImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvdata: null,
            screenName: props.location ? props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null : null
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
                }} >
                    <div className="row" >
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importUmpire}</Breadcrumb.Item>
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

        // let compId = JSON.parse(getUmpireCompetiton())
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.csvdata) {
            this.props.liveScoreUmpireImportAction({ id: id, csvFile: this.state.csvdata,screenName: "liveScoreUmpireList"})
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
                        <div className="reg-add-save-button">
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
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"6"} />
                <Loader visible={this.props.liveScoreUmpiresState.onLoad} />
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
    return bindActionCreators({ liveScoreUmpireImportAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreUmpiresState: state.LiveScoreUmpiresState,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreUmpireImport));
// export default LiveScorerCoachImport