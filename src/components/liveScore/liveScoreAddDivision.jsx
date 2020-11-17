import React, { Component, createRef } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import {
    liveScoreUpdateDivisionAction,
    createDivisionAction
} from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage';
import Loader from '../../customComponents/loader'
import { captializedString } from "../../util/helpers"

const { Footer, Content, Header } = Layout;
const { Option } = Select

class LiveScoreAddDivision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: this.props.location.state ? this.props.location.state.isEdit : false,
            tableData: this.props.location.state ? this.props.location.state.tableRecord ? this.props.location.state.tableRecord : null : null,
            loader: false,
            recordGoalAttemptArray: [{ id: null, value: "As per Competition" }, { id: true, value: "Yes" }, {
                id: false,
                value: "No"
            }],
            positionTrackingArray: [{ id: null, value: "As per Competition" }, { id: true, value: "Yes" }, {
                id: false,
                value: "No"
            }],
        }
        this.formRef = createRef();
    }

    componentDidMount() {
        if (this.state.isEdit) {
            this.props.liveScoreUpdateDivisionAction(this.state.tableData, 'isEditDivision')
            this.setState({ loader: true })
            this.setInitalFiledValue()
        } else {
            this.props.liveScoreUpdateDivisionAction("", 'isAddDivision')
            this.setInitalValue()
        }
    }

    componentDidUpdate() {
        if (this.state.load && this.props.liveScoreDivisionState.onLoad == false) {
            if (this.state.loader) {
                this.setInitalFiledValue()
                this.setState({ loader: false })
            }
        }
    }

    setInitalFiledValue() {
        const { name, divisionName, gradeName, positionTracking, recordGoalAttempts } = this.props.liveScoreDivisionState
        this.formRef.current.setFieldsValue({
            'name': name,
            'divisionName': divisionName,
            'gradeName': gradeName,
            "positionTracking": positionTracking,
            "recordGoalAttempts": recordGoalAttempts
        })
    }

    setInitalValue() {
        this.formRef.current.setFieldsValue({
            "positionTracking": null,
            "recordGoalAttempts": null
        })
    }

    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null

        return (
            <div className="header-view">
                <Header
                    className="form-header-view d-flex align-items-center"
                    style={{ backgroundColor: "transparent" }}
                >
                    <div className="row">
                        <div className="col-sm mt-5 d-flex align-content-center">
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {isEdit ? AppConstants.editDivision : AppConstants.addDivision}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        )
    }

    ////form view
    contentView = () => {
        const { name, divisionName, gradeName } = this.props.liveScoreDivisionState
        const { positionTracking } = this.props.liveScoreDivisionState
        const competition = JSON.parse(getLiveScoreCompetiton());
        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item className="formMargin" name="name" rules={[{ required: true, message: ValidationConstants.nameisrequired }]}>
                            <InputWithHead
                                auto_complete="off"
                                type="text"
                                required="required-field pb-0 pt-0 pb-3"
                                heading={AppConstants.name}
                                placeholder={AppConstants.name}
                                onChange={(name) => this.props.liveScoreUpdateDivisionAction(captializedString(name.target.value), 'name')}
                                // value={name}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'name': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <Form.Item
                            className="formMargin"
                            name="divisionName"
                            rules={[{ required: true, message: ValidationConstants.divisionNameIsRequired }]}
                        >
                            <InputWithHead
                                auto_complete="off"
                                type="text"
                                required="required-field pb-0 pt-0 pb-3"
                                heading={AppConstants.divisionName}
                                placeholder={AppConstants.divisionName}
                                onChange={(divisionName) => this.props.liveScoreUpdateDivisionAction(captializedString(divisionName.target.value), 'divisionName')}
                                // value={divisionName}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'divisionName': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <Form.Item
                            className="formMargin"
                            name="gradeName"
                            rules={[{ required: true, message: ValidationConstants.gradeIsRequired }]}
                        >
                            <InputWithHead
                                auto_complete="off"
                                type="text"
                                required="required-field pb-0 pt-0 pb-3"
                                heading={AppConstants.gradeName}
                                placeholder={AppConstants.gradeName}
                                onChange={(gradeName) => this.props.liveScoreUpdateDivisionAction(captializedString(gradeName.target.value), 'gradeName')}
                                // value={gradeName}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'gradeName': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.positionTracking} required="pb-3 pt-3" />
                        <Form.Item className="formMargin pt-0" name="positionTracking">
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                onChange={(value) => this.props.liveScoreUpdateDivisionAction(value, "positionTracking")}
                                placeholder={AppConstants.positionTracking}
                            >
                                {this.state.positionTrackingArray.map((item) => (
                                    <Option key={'positionTracking_' + item.id} value={item.id}>{item.value}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {
                            ((competition.lineupSelectionEnabled == 1 || competition.lineupSelectionEnabled == true) && positionTracking === false) &&
                            < span className="text-with-red-color pt-2">
                                {AppConstants.squadSelectionEnabled}
                            </span>
                        }
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.recordGoalAttempt} required="pb-3 pt-3" />
                        <Form.Item className="formMargin pt-0" name="recordGoalAttempts">
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                onChange={(value) => this.props.liveScoreUpdateDivisionAction(value, "recordGoalAttempts")}
                                placeholder={AppConstants.recordGoalAttempt}
                            >
                                {this.state.recordGoalAttemptArray.map((item) => (
                                    <Option key={'recordGoalAttempt_' + item.id} value={item.id}>{item.value}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }

    onSaveClick = values => {
        const { name, divisionName, gradeName, positionTracking, recordGoalAttempts } = this.props.liveScoreDivisionState
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let divisionId = this.state.tableData ? this.state.tableData.id : 0;
        this.props.createDivisionAction(name, divisionName, gradeName, id, divisionId, positionTracking, recordGoalAttempts)
    };

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to='/liveScoreDivisionList'>
                                    <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text mr-0" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.addDivision}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="9" />

                <Layout>
                    <Loader visible={this.props.liveScoreDivisionState.onLoad} />

                    {this.headerView()}
                    <Form
                        ref={this.formRef} autoComplete='off'
                        onFinish={this.onSaveClick}
                        noValidate="novalidate"
                        className="login-form"
                    >
                        <Content>
                            <div className="formView">
                                {getLiveScoreCompetiton() ? this.contentView() : history.push('/liveScoreCompetitions')}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreUpdateDivisionAction,
        createDivisionAction,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreDivisionState: state.LiveScoreDivisionState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreAddDivision);
