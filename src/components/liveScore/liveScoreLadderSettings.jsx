import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    Radio,
    Tabs,
    Table,
    Input,
    Form
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    ladderSettingGetMatchResultAction,
    ladderSettingGetDATA,
    updateLadderSetting,
    ladderSettingPostDATA
} from '../../store/actions/LiveScoreAction/liveScoreLadderSettingAction'
import { isArrayNotEmpty } from "../../util/helpers";
import { getLiveScoreCompetiton } from '../../util/sessionStorage';
import Loader from '../../customComponents/loader'
import history from "../../util/history";

const { Header, Footer } = Layout;
const { Option } = Select;

let _this = ""

const columns = [
    {
        title: 'Result type/Byes',
        dataIndex: 'resultTypeId',
        key: 'resultTypeId',
    },
    {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
        render: (points, record, index) => <Input className="input-inside-table-fees" onChange={(e) => _this.props.updateLadderSetting(e.target.value, record, index)} value={points} />,
        width: "10%"
    },
];


class LiveScoreLadderSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venueData: []
        };
        _this = this
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.ladderSettingGetMatchResultAction()
        this.props.ladderSettingGetDATA(id)
    }

    contentView = () => {
        const { matchResult } = this.props.ladderSettingState
        let matchResultData = isArrayNotEmpty(matchResult) ? matchResult : []
        return (
            <div className="content-view pt-4">
                {/* ladder setting view */}

                <div className="inside-container-view" >
                    <div className="table-responsive">
                        <Table
                            loading={this.props.ladderSettingState.onLoad}
                            className="fees-table"
                            columns={columns}
                            dataSource={matchResultData}
                            pagination={false} Divider=" false" />
                    </div>
                </div>
            </div>
        )

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
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.ladderSettings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };
    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        const { postData } = this.props.ladderSettingState

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            {/* <div className="reg-add-save-button">
                                <Button type="cancel-button">{AppConstants.delete}</Button>
                            </div> */}
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                {/* <Button className="save-draft-text" type="save-draft-text">
                                    {AppConstants.saveAsDraft}
                                </Button> */}
                                <Button
                                    onClick={() => this.onSaveClick()}
                                    className="publish-button" type="primary">
                                    {this.state.competitionTabKey == 6 ? AppConstants.publish : AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    };

    onSaveClick() {
        const { postData } = this.props.ladderSettingState
        this.props.ladderSettingPostDATA(postData)
    }

    publicLadderLink = () => {
        let { organisationUniqueKey } = JSON.parse(localStorage.getItem('setOrganisationData'))

        return (

            <div className="content-view mt-5 pt-3" >
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.ladderLink} />
                        <div>
                            <a className="userRegLink" href={AppConstants.public_Ladder_Url + `organisationKey=${organisationUniqueKey}`} target='_blank' >
                                {AppConstants.public_Ladder_Url + `organisationKey=${organisationUniqueKey}`}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


    publiDrawsLink = () => {
        let { organisationUniqueKey } = JSON.parse(localStorage.getItem('setOrganisationData'))

        return (

            <div className="content-view mt-5 pt-3" >
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.drawsLink} />
                        <div>
                            <a className="userRegLink" href={AppConstants.public_draws_Url + `organisationKey=${organisationUniqueKey}`} target='_blank' >
                                {AppConstants.public_draws_Url + `organisationKey=${organisationUniqueKey}`}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"19"} />
                <Loader visible={this.props.ladderSettingState.loader} />
                <Layout>
                    {this.headerView()}
                    {/* <Content> */}
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="formView">{this.contentView()}</div>
                        <div className="formView">{this.publicLadderLink()}</div>
                        <div className="formView">{this.publiDrawsLink()}</div>
                    </Form>

                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>

        )
    }
}

function mapDispatchtoprops(dispatch) {
    return bindActionCreators({
        ladderSettingGetMatchResultAction,
        ladderSettingGetDATA,
        updateLadderSetting,
        ladderSettingPostDATA
    }, dispatch)

}

function mapStatetoProps(state) {
    return {
        ladderSettingState: state.LadderSettingState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreLadderSettings));
