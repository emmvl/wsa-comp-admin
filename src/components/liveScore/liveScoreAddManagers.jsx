import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import {
    liveScoreUpdateManagerDataAction,
    liveScoreAddEditManager,
    liveScoreManagerListAction,
    liveScoreClear,
    liveScoreManagerFilter,
    liveScoreManagerSearch
} from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import { isArrayNotEmpty, captializedString, regexNumberExpression } from "../../util/helpers";

import Loader from '../../customComponents/loader'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import Tooltip from 'react-png-tooltip'


const { Footer, Content, Header } = Layout;
const { Option } = Select;

const OPTIONS = [];

class LiveScoreAddManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            load: false,
            tableRecord: this.props.location.state ? this.props.location.state.tableRecord : null,
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            loader: false,
            showOption: false,
            competition_id: null,
            teamLoad: false
        }

    }

    componentDidMount() {


        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.props.liveScoreManagerListAction(5, 1, id)

            this.props.getliveScoreTeams(id)
            if (this.state.isEdit === true) {
                this.props.liveScoreUpdateManagerDataAction(this.state.tableRecord, 'isEditManager')
                this.setState({ loader: true })
            } else {
                this.props.liveScoreUpdateManagerDataAction('', 'isAddManager')
            }
            this.setState({ load: true, competition_id: id })

        } else {
            history.push('/liveScoreCompetitions')
        }


    }

    componentDidUpdate(nextProps) {

        if (this.props.liveScoreMangerState.managerListResult !== nextProps.liveScoreMangerState.managerListResult) {

            if (this.state.load === true && this.props.liveScoreMangerState.onLoad === false) {
                this.filterManagerList()
                if (this.state.isEdit === true) {
                    this.setInitalFiledValue()
                }
                this.setState({ load: false, loader: false })
            }

        }

        if (this.props.liveScoreMangerState.teamId !== nextProps.liveScoreMangerState.teamId) {
            if (this.state.teamLoad === true) {
                const { teamId } = this.props.liveScoreMangerState
                this.setSelectedTeamValue(teamId)

                this.setState({ teamLoad: false })

            }
        }

    }

    setSelectedTeamValue(teamId) {

        this.props.form.setFieldsValue({
            'managerTeamName': teamId
        })
    }
    setInitalFiledValue() {
        const { managerData, teamId } = this.props.liveScoreMangerState
        this.props.form.setFieldsValue({
            'First Name': managerData.firstName,
            'Last Name': managerData.lastName,
            'Email Address': managerData.email,
            'Contact no': managerData.mobileNumber,
            'Select Team': teamId
        })
    }

    filterManagerList() {
        const { managerListResult } = this.props.liveScoreMangerState
        let managerList = isArrayNotEmpty(managerListResult) ? managerListResult : []

        for (let i in managerList) {
            OPTIONS.push(managerList[i].firstName + " " + managerList[i].lastName)
        }
    }


    onChangeNumber = (number) => {
        if (number.length == 10) {
            this.setState({
                hasError: false
            })
            this.props.liveScoreUpdateManagerDataAction(regexNumberExpression(number), 'mobileNumber')
        }

        else if (number.length < 10) {
            this.props.liveScoreUpdateManagerDataAction(regexNumberExpression(number), 'mobileNumber')
            this.setState({
                hasError: true
            })
        }
        setTimeout(() => {
            this.setInitalFiledValue()
        }, 300);

    }



    ///////view for breadcrumb
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
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit === true ? AppConstants.editManager : AppConstants.addManager}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    ////form view
    managerExistingRadioButton(getFieldDecorator) {

        const { managerListResult, onLoadSearch } = this.props.liveScoreMangerState
        let managerList = isArrayNotEmpty(managerListResult) ? managerListResult : []
        const { teamId } = this.props.liveScoreMangerState
        let teamData = isArrayNotEmpty(this.props.liveScoreMangerState.teamResult) ? this.props.liveScoreMangerState.teamResult : []

        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            <InputWithHead
                                required={"required-field pb-0 pt-0"}
                                heading={AppConstants.managerSearch} />
                            {getFieldDecorator(AppConstants.team, {
                                rules: [{ required: true, message: ValidationConstants.searchManager }],
                            })(

                                <AutoComplete
                                    loading={true}
                                    style={{ width: "100%", height: '56px' }}
                                    placeholder="Select User"
                                    onSelect={(item, option) => {
                                        const ManagerId = JSON.parse(option.key)
                                        this.props.liveScoreClear()
                                        this.props.liveScoreUpdateManagerDataAction(ManagerId, 'managerSearch')
                                        this.setState({ teamLoad: true })
                                    }}
                                    notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}

                                    onSearch={(value) => {

                                        value ?
                                            this.props.liveScoreManagerSearch(value, this.state.competition_id)
                                            :
                                            this.props.liveScoreManagerListAction(5, 1, this.state.competition_id)

                                    }}


                                >{managerList.map((item) => {
                                    return <Option key={item.id} value={item.firstName + " " + item.lastName}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                })}
                                </AutoComplete>
                            )}

                        </Form.Item>
                    </div>


                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field pb-1"}
                                heading={AppConstants.team} />
                            {getFieldDecorator("managerTeamName", {
                                rules: [{ required: true, message: ValidationConstants.teamName }],
                            })(

                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}
                                    onChange={(teamId) => this.props.liveScoreUpdateManagerDataAction(teamId, 'teamId')}
                                    value={teamId}
                                    optionFilterProp="children"
                                >
                                    {teamData.map((item) => (
                                        < Option value={item.id} >{item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}

                        </Form.Item>
                    </div>
                </div>
            </div >
        )
    }

    managerNewRadioBtnView(getFieldDecorator) {
        const { managerData, teamId, teamResult } = this.props.liveScoreMangerState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []
        let hasError = this.state.hasError == true ? true : false
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.firstName, {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    auto_complete='new-password'
                                    type='text'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.firstName}
                                    onChange={(firstName) => this.props.liveScoreUpdateManagerDataAction(captializedString(firstName.target.value), 'firstName')}
                                    value={managerData.firstName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'First Name': captializedString(i.target.value)
                                    })}
                                />
                            )}

                        </Form.Item>
                    </div>
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.lastName, {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                                <InputWithHead
                                    auto_complete='off'
                                    // type='text'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    onChange={(lastName) => this.props.liveScoreUpdateManagerDataAction(captializedString(lastName.target.value), 'lastName')}
                                    value={managerData.lastName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'Last Name': captializedString(i.target.value)
                                    })}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.emailAdd, {
                                rules: [
                                    {
                                        required: true,
                                        message: ValidationConstants.emailField[0]
                                    },
                                    {
                                        type: "email",
                                        pattern: new RegExp(AppConstants.emailExp),
                                        message: ValidationConstants.email_validation
                                    }
                                ]
                            })(
                                <InputWithHead
                                    auto_complete='new-email'
                                    type='email'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.emailAdd}
                                    placeholder={AppConstants.enterEmail}
                                    onChange={(email) => this.props.liveScoreUpdateManagerDataAction(email.target.value, 'email')}
                                    value={managerData.email}
                                    disabled={this.state.isEdit === true && true}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm" >
                        <Form.Item
                            help={hasError && ValidationConstants.mobileLength}
                            validateStatus={hasError ? "error" : 'validating'}
                        >
                            {getFieldDecorator(AppConstants.contactNO, {
                                rules: [{ required: true, message: ValidationConstants.contactField }]
                            })(
                                <InputWithHead
                                    auto_complete='new-contact'
                                    // type='number'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.contact_No}
                                    placeholder={AppConstants.enterContactNo}
                                    maxLength={10}
                                    onChange={(mobileNumber) => this.onChangeNumber(mobileNumber.target.value)}
                                    value={managerData.mobileNumber} />
                            )}
                        </Form.Item>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.team}
                            required={"required-field pb-0 pt-3"}
                        />
                        <Form.Item className="slct-in-add-manager-livescore">
                            {getFieldDecorator(AppConstants.selectTeam, {
                                rules: [{ required: true, message: ValidationConstants.teamName }]
                            })(
                                <Select
                                    mode="multiple"
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%" }}
                                    onChange={(teamId) => this.props.liveScoreUpdateManagerDataAction(teamId, 'teamId')}
                                    value={teamId}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {teamData.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }


    onButtonChage(e) {
        this.setState({ loader: true })
        this.props.liveScoreUpdateManagerDataAction(e.target.value, 'managerRadioBtn')
    }

    radioBtnContainer() {
        const { managerRadioBtn } = this.props.liveScoreMangerState
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.managerHeading}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onButtonChage(e)}
                    value={managerRadioBtn}
                >
                    {/* <div className="row ml-2" style={{ marginTop: 18 }} >
                        <Radio value={"new"}>{AppConstants.new}</Radio>
                        <Radio value={"existing"}>{AppConstants.existing} </Radio>
                    </div> */}
                    <div className="row ml-2" style={{ marginTop: 18 }} >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Radio style={{ marginRight: 0, paddingRight: 0 }} value={"new"}>{AppConstants.new}</Radio>
                            <div style={{ marginLeft: -10, width: 50 }}>
                                <Tooltip background='#ff8237'>
                                    <span>{AppConstants.newMsgForScorerManager}</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: -10 }}>
                            <Radio style={{ marginRight: 0, paddingRight: 0 }} value={"existing"}>{AppConstants.existing} </Radio>
                            <div style={{ marginLeft: -10 }}>
                                <Tooltip background='#ff8237' >
                                    <span>{AppConstants.existingMsgForScorerManager}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </Radio.Group>
            </div>
        )
    }


    ////form view
    contentViewForAddManager = (getFieldDecorator) => {
        const { managerRadioBtn } = this.props.liveScoreMangerState
        return (
            <div >
                {this.radioBtnContainer()}
                {managerRadioBtn === 'new' ?
                    this.managerNewRadioBtnView(getFieldDecorator)
                    :
                    this.managerExistingRadioButton(getFieldDecorator)}
            </div>
        )
    }

    contentViewForEditManager = (getFieldDecorator) => {
        return (
            <div >
                {this.managerNewRadioBtnView(getFieldDecorator)}
            </div>
        )
    }

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="flud-widtih">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                <NavLink to='/liveScoreManagerList'>
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

    onSaveClick = e => {
        const { managerData, teamId, managerRadioBtn, exsitingManagerId } = this.props.liveScoreMangerState
        console.log(managerData, 'managerData')
        e.preventDefault();
        if (managerRadioBtn === 'new') {
            if (managerData.mobileNumber.length !== 10) {
                this.props.form.validateFields((err, values) => {
                })
                this.setState({
                    hasError: true
                })
            } else {
                this.props.form.validateFields((err, values) => {
                    let body = ''
                    if (!err) {
                        if (managerRadioBtn === 'new') {
                            if (this.state.isEdit === true) {
                                body = {
                                    "id": managerData.id,
                                    "firstName": managerData.firstName,
                                    "lastName": managerData.lastName,
                                    "mobileNumber": regexNumberExpression(managerData.mobileNumber),
                                    "email": managerData.email,
                                    "teams": managerData.teams
                                }
                            } else {
                                body = {
                                    "firstName": managerData.firstName,
                                    "lastName": managerData.lastName,
                                    "mobileNumber": regexNumberExpression(managerData.mobileNumber),
                                    "email": managerData.email,
                                    "teams": managerData.teams
                                }
                            }
                            this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
                        } else if (managerRadioBtn === 'existing') {
                            body = {
                                "id": exsitingManagerId,
                                "teams": managerData.teams
                            }
                            this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
                        }
                    }
                });
            }
        }
        else {
            this.props.form.validateFields((err, values) => {
                let body = ''
                if (!err) {
                    if (managerRadioBtn === 'new') {
                        if (this.state.isEdit === true) {
                            body = {
                                "id": managerData.id,
                                "firstName": managerData.firstName,
                                "lastName": managerData.lastName,
                                "mobileNumber": regexNumberExpression(managerData.mobileNumber),
                                "email": managerData.email,
                                "teams": managerData.teams
                            }
                        } else {
                            body = {
                                "firstName": managerData.firstName,
                                "lastName": managerData.lastName,
                                "mobileNumber": regexNumberExpression(managerData.mobileNumber),
                                "email": managerData.email,
                                "teams": managerData.teams
                            }
                        }
                        this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
                    } else if (managerRadioBtn === 'existing') {
                        body = {
                            "id": exsitingManagerId,
                            "teams": managerData.teams
                        }
                        this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
                    }
                }
            });
        }
    };

    /////// render function 
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <Loader visible={this.props.liveScoreMangerState.loading} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"4"} />
                <Layout>
                    {this.headerView()}
                    <Form autoComplete="off" onSubmit={this.onSaveClick} className="login-form" noValidate="noValidate">
                        <Content>
                            <div className="formView">
                                {this.state.isEdit === true ? this.contentViewForEditManager(getFieldDecorator) : this.contentViewForAddManager(getFieldDecorator)}
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
        getliveScoreDivisions,
        liveScoreUpdateManagerDataAction,
        liveScoreAddEditManager,
        liveScoreManagerListAction,
        liveScoreClear,
        liveScoreManagerFilter,
        liveScoreManagerSearch,
        getliveScoreTeams
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreScorerState: state.LiveScoreScorerState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddManager));