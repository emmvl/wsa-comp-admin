import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { liveScoreUpdateDivisionAction, createDivisionAction } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage';
import Loader from '../../customComponents/loader'
import { captializedString } from "../../util/helpers"
const { Footer, Content, Header } = Layout;

class LiveScoreAddDivision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: this.props.location.state ? this.props.location.state.isEdit : false,
            tableData: this.props.location.state ? this.props.location.state.tableRecord ? this.props.location.state.tableRecord : null : null,
            loader: false,
        }

    }

    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
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
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit == true ? AppConstants.editDivision : AppConstants.addDivision}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    componentDidMount() {
        if (this.state.isEdit == true) {
            this.props.liveScoreUpdateDivisionAction(this.state.tableData, 'isEditDivision')
            this.setState({ loader: true })
            this.setInitalFiledValue()
        } else {
            this.props.liveScoreUpdateDivisionAction("", 'isAddDivision')
        }
    }

    componentDidUpdate() {
        if (this.state.load == true && this.props.liveScoreDivisionState.onLoad == false) {
            if (this.state.loader == true) {
                this.setInitalFiledValue()
                this.setState({ loader: false })
            }
        }
    }

    setInitalFiledValue() {
        const { name, divisionName, gradeName } = this.props.liveScoreDivisionState
        this.props.form.setFieldsValue({
            'name': name,
            'divisionName': divisionName,
            'gradeName': gradeName,

        })
    }

    ////form view
    contentView = (getFieldDecorator) => {
        const { name, divisionName, gradeName } = this.props.liveScoreDivisionState
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator("name", {
                                rules: [{ required: true, message: ValidationConstants.nameisrequired }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.name}
                                    placeholder={AppConstants.name}
                                    onChange={(name) => this.props.liveScoreUpdateDivisionAction(captializedString(name.target.value), 'name')}
                                    // value={name}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'name': captializedString(i.target.value)
                                    })} />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator("divisionName", {

                                rules: [{ required: true, message: ValidationConstants.divisionNameisrequired }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.divisionName}
                                    placeholder={AppConstants.divisionName}
                                    onChange={(divisionName) => this.props.liveScoreUpdateDivisionAction(captializedString(divisionName.target.value), 'divisionName')}
                                    // value={divisionName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'divisionName': captializedString(i.target.value)
                                    })} />
                            )}

                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator("gradeName", {
                                rules: [{ required: true, message: ValidationConstants.gradeisrequired }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.gradeName}
                                    placeholder={AppConstants.gradeName}
                                    onChange={(gradeName) => this.props.liveScoreUpdateDivisionAction(captializedString(gradeName.target.value), 'gradeName')}
                                    // value={gradeName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'gradeName': captializedString(i.target.value)
                                    })} />
                            )}

                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }
    onSaveClick = e => {
        let divisionData = this.props.liveScoreDivisionState
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { name, divisionName, gradeName } = this.props.liveScoreDivisionState
                const { id } = JSON.parse(getLiveScoreCompetiton())
                let divisionId = this.state.tableData ? this.state.tableData.id : 0;
                console.log(divisionId, "tabledata")
                this.props.createDivisionAction(name, divisionName, gradeName, id, divisionId)
            }
        });
    };
    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="flud-widtih">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to='/liveScoreDivisionList'>
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
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
        const { getFieldDecorator } = this.props.form
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.addDivision} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"9"} />
                <Layout>
                    <Loader visible={this.props.liveScoreDivisionState.onLoad} />

                    {this.headerView()}
                    <Form onSubmit={this.onSaveClick}
                        noValidate="novalidate"
                        className="login-form">
                        <Content>

                            <div className="formView"> {this.contentView(getFieldDecorator)}  </div>
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
function mapStatetoProps(state) {
    return {
        liveScoreDivisionState: state.LiveScoreDivisionState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddDivision));