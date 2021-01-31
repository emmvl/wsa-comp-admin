import React, { Component } from "react";
import {
    Layout, Breadcrumb, Select, Checkbox, Button, Form, Modal
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
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

class LiveScoreLadderSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venueData: [],
            deleteModalVisible: false,
            handleAllDivisionModal: false,
            ladderIndex: null,
            saveLoad: false
        };
    }

    componentDidMount() {
        if (getLiveScoreCompetiton()) {
            const { uniqueKey } = JSON.parse(getLiveScoreCompetiton())
            //this.props.ladderSettingGetMatchResultAction()
            this.props.ladderSettingGetDATA(uniqueKey)
        } else {
            history.push('/matchDayCompetitions')
        }
    }

    componentDidUpdate(nextProps) {
        let ladderSettingState = this.props.ladderSettingState;
        if (nextProps.ladderSettingState != ladderSettingState) {
            if (ladderSettingState.loader == false && this.state.saveLoad) {
                this.setState({ saveLoad: false })
                this.props.ladderSettingGetDATA();
            }
        }
    }

    onChangeLadderSetting = (value, index, key, subIndex, subKey) => {
        if (key === "isAllDivision" && value) {
            // let ladders = this.props.ladderSettingState.ladders;
            // if (ladders.length > 1) {
            this.setState({ allDivisionVisible: true, ladderIndex: index });
            //} else {
            //     this.props.updateLadderSetting(value, index, key, subIndex, subKey);
            // }
        } else {
            this.props.updateLadderSetting(value, index, key, subIndex, subKey);
        }
    }

    deleteModal = (index) => {
        this.setState({ deleteModalVisible: true, ladderIndex: index });
    }

    handleDeleteModal = (key) => {
        if (key === "ok") {
            this.props.updateLadderSetting(null, this.state.ladderIndex, "deleteLadder");
        }
        this.setState({ deleteModalVisible: false, ladderIndex: null });
    }

    handleAllDivisionModal = (key) => {
        if (key === "ok") {
            this.props.updateLadderSetting(true, this.state.ladderIndex, "isAllDivision");
        }
        this.setState({ allDivisionVisible: false, ladderIndex: null });
    }

    onSaveClick() {
        const { ladders } = this.props.ladderSettingState;
        ladders.forEach((item, index) => {
            if (item.ladderFormatId < 0) {
                item.ladderFormatId = 0;
            }
            item.isAllDivision = item.isAllDivision ? 1 : 0;
            delete item.divisions;
        });
        this.props.ladderSettingPostDATA(ladders)
        this.setState({ saveLoad: true });
    }

    contentView = () => {
        const { ladders, divisions } = this.props.ladderSettingState
        let ladderData = isArrayNotEmpty(ladders) ? ladders : [];
        let isAllDivision = ladderData.find(x => x.isAllDivision);
        let isAllDivisionChecked = isAllDivision != null;
        let allDivision = divisions.find(x => x.isDisabled == false);
        let allDivAdded = allDivision != null ? false : true;

        return (
            <div className="content-view pt-4">
                {(ladderData || []).map((ladder, index) => (
                    <div className="inside-container-view" style={{ paddingTop: 25 }}>
                        {ladderData.length > 1 && (
                            <div className="d-flex float-right">
                                <div
                                    className="transfer-image-view pt-0 pointer ml-auto"
                                    onClick={() => this.deleteModal(index)}
                                >
                                    <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                    <span className="user-remove-text">{AppConstants.remove}</span>
                                </div>
                            </div>
                        )}
                        <Checkbox
                            className="single-checkbox pt-2 mt-0"
                            checked={ladder.isAllDivision}
                            onChange={(e) => this.onChangeLadderSetting(e.target.checked, index, "isAllDivision")}
                        >
                            {AppConstants.allDivisions}
                        </Checkbox>
                        <div className="fluid-width">
                            <div className="row d-block ml-0">
                                <div className="col-sm pl-0" style={{ paddingTop: 5 }}>
                                    <Select
                                        mode="multiple"
                                        className="w-100"
                                        style={{ paddingRight: 1, minWidth: 182 }}
                                        onChange={(e) => this.onChangeLadderSetting(e, index, "selectedDivisions")}
                                        value={ladder.selectedDivisions}
                                    >
                                        {(ladder.divisions || []).map((division) => (
                                            <Option
                                                key={'division_' + division.divisionId}
                                                value={division.divisionId}
                                                disabled={division.isDisabled}
                                            >
                                                {division.divisionName}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="inside-container-view">
                            <div className="table-responsive">
                                <div className="d-flex" style={{ paddingLeft: 10 }}>
                                    <div style={{ width: '89%' }} className="ladder-points-heading">
                                        <InputWithHead heading="Result type/Byes" />
                                    </div>
                                    <div className="ladder-points-heading"><InputWithHead heading="Points" /></div>
                                </div>
                                {(ladder.settings || []).map((res, resIndex) => (
                                    <div className="d-flex" style={{ paddingLeft: 10 }}>
                                        <div style={{ width: '89%' }}><InputWithHead heading={res.name} /></div>
                                        <div style={{ marginTop: 5 }}>
                                            <InputWithHead
                                                className="input-inside-table-fees"
                                                value={res.points}
                                                placeholder="Points"
                                                onChange={(e) => this.onChangeLadderSetting(e.target.value, index, "resultTypes", resIndex, "points")}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {(isAllDivisionChecked == false && allDivAdded == false) && (
                    <div className="row">
                        <div className="col-sm" onClick={(e) => this.onChangeLadderSetting(null, null, "addLadder")}>
                            <span className="input-heading-add-another pointer">+ {AppConstants.addNewLadderScheme}</span>
                        </div>
                    </div>
                )}
                {this.deleteConfirmModalView()}
                {this.allDivisionModalView()}
            </div>
        )
    }

    deleteConfirmModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.ladderFormat}
                    visible={this.state.deleteModalVisible}
                    onOk={() => this.handleDeleteModal("ok")}
                    onCancel={() => this.handleDeleteModal("cancel")}
                >
                    <p>{AppConstants.ladderRemoveMsg}</p>
                </Modal>
            </div>
        );
    }

    allDivisionModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal add-membership-type-modalLadder"
                    title={AppConstants.ladderFormat}
                    visible={this.state.allDivisionVisible}
                    onOk={() => this.handleAllDivisionModal("ok")}
                    onCancel={() => this.handleAllDivisionModal("cancel")}
                >
                    <p>{AppConstants.ladderAllDivisionRmvMsg}</p>
                </Modal>
            </div>
        );
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex bg-transparent align-items-center">
                    <Breadcrumb separator=" > ">
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
        // const { postData } = this.props.ladderSettingState

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button
                                    onClick={() => this.onSaveClick()}
                                    className="publish-button"
                                    type="primary"
                                >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    publicLadderLink = () => {
        let { organisationUniqueKey } = JSON.parse(localStorage.getItem('setOrganisationData'))

        return (
            <div className="content-view mt-5 pt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.ladderLink} />
                        <div>
                            <a
                                className="user-reg-link"
                                href={process.env.REACT_APP_USER_REGISTRATION_URL + `/liveScorePublicLadder?organisationKey=${organisationUniqueKey}`}
                                target='_blank'
                                rel="noopener noreferrer"
                            >
                                {process.env.REACT_APP_USER_REGISTRATION_URL + `/liveScorePublicLadder?organisationKey=${organisationUniqueKey}`}
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
            <div className="content-view mt-5 pt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.drawsLink} />
                        <div>
                            <a
                                className="user-reg-link"
                                href={process.env.REACT_APP_USER_REGISTRATION_URL + `/livescoreSeasonFixture?organisationKey=${organisationUniqueKey}`}
                                target='_blank'
                                rel="noopener noreferrer"
                            >
                                {process.env.REACT_APP_USER_REGISTRATION_URL + `/livescoreSeasonFixture?organisationKey=${organisationUniqueKey}`}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.matchDay}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="19" />
                <Loader visible={this.props.ladderSettingState.loader || this.props.ladderSettingState.onLoad} />
                <Layout>
                    {this.headerView()}
                    {/* <Content> */}
                    <Form onFinish={this.handleSubmit} className="login-form">
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ladderSettingGetMatchResultAction,
        ladderSettingGetDATA,
        updateLadderSetting,
        ladderSettingPostDATA
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        ladderSettingState: state.LadderSettingState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreLadderSettings);
