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
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import {
    liveScoreUpdateManagerDataAction,
    liveScoreAddEditManager,
    liveScoreManagerListAction,
    liveScoreClear,
    liveScoreManagerFilter,
    liveScoreManagerSearch
} from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import { isArrayNotEmpty } from "../../util/helpers";
import Loader from '../../customComponents/loader'


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
        }

    }

    componentDidMount() {
        this.props.liveScoreManagerListAction(3, 1, 1)
        // let competitionID = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.getliveScoreDivisions(id)
        } else {
            history.push('/')
        }

        if (this.state.isEdit == true) {
            this.props.liveScoreUpdateManagerDataAction(this.state.tableRecord, 'isEditManager')
            this.setState({ loader: true })
        } else {
            this.props.liveScoreUpdateManagerDataAction('', 'isAddManager')
        }
        this.setState({ load: true })
    }

    componentDidUpdate(nextProps) {

        if (this.props.liveScoreMangerState.managerListResult !== nextProps.liveScoreMangerState.managerListResult) {

            if (this.state.load == true && this.props.liveScoreMangerState.onLoad == false) {
                this.filterManagerList()
                if (this.state.isEdit == true) {
                    this.setInitalFiledValue()
                }
                this.setState({ load: false, loader: false })
            }

        }



    }

    setInitalFiledValue() {
        const { managerData, teamId } = this.props.liveScoreMangerState
        let data = this.state.tableRecord
        console.log(managerData, 'tableRecord&**', teamId)
        this.props.form.setFieldsValue({
            // 'First Name': managerData.firstName,
            // 'Last Name': managerData.lastName,
            // 'Email Address': managerData.email,
            // 'Contact no': managerData.mobileNumber,
            // 'Select Team': teamId

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
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit == true ? AppConstants.editManager : AppConstants.addManager}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    ////form view

    managerExistingRadioButton(getFieldDecorator) {

        const { managerListResult, MainManagerListResult, onLoadSearch, managerSearchResult } = this.props.liveScoreMangerState

        // let managerList = isArrayNotEmpty(managerListResult) ? managerListResult : []
        let managerList = isArrayNotEmpty(managerSearchResult) ? managerSearchResult : []

        let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
        const { teamId } = this.props.liveScoreMangerState
        const { selectedItems } = this.state;
        const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

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

                                    }}
                                    notFoundContent={onLoadSearch == true ? <Spin size="small" /> : null}

                                    onSearch={(value) => {
                                        this.props.liveScoreManagerSearch(value)
                                    }}


                                >{managerList.map((item) => {
                                    return <Option key={item.id} value={item.firstName + " " + item.lastName}>
                                        {item.firstName + " " + item.lastName + " " + item.id}
                                    </Option>
                                })}
                                </AutoComplete>
                            )}

                        </Form.Item>
                    </div>


                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            <InputWithHead
                                required={"required-field pb-0 pt-0"}
                                heading={AppConstants.team} />
                            {getFieldDecorator("managerTeamName", {
                                rules: [{ required: true, message: ValidationConstants.teamName }],
                            })(

                                <Select
                                    // loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="multiple"
                                    showSearch={true}
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}
                                    onChange={(teamId) => this.props.liveScoreUpdateManagerDataAction(teamId, 'teamId')}
                                    value={teamId}
                                >
                                    {isArrayNotEmpty(teamData) > 0 && teamData.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
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
        let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
        const { managerData, teamId, teamResult } = this.props.liveScoreMangerState
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.firstName, {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.firstName}
                                    onChange={(firstName) => this.props.liveScoreUpdateManagerDataAction(firstName.target.value, 'firstName')}
                                    value={managerData.firstName}
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
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    onChange={(lastName) => this.props.liveScoreUpdateManagerDataAction(lastName.target.value, 'lastName')}
                                    value={managerData.lastName}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.emailAdd, {
                                rules: [{ required: true, message: ValidationConstants.emailField[0] }]
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.emailAdd}
                                    placeholder={AppConstants.enterEmail}
                                    onChange={(email) => this.props.liveScoreUpdateManagerDataAction(email.target.value, 'email')}
                                    value={managerData.email}
                                    disabled={this.state.isEdit == true && true}
                                />
                            )}
                        </Form.Item>

                    </div>
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.contactNO, {
                                rules: [{ required: true, message: ValidationConstants.contactField }]
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.contactNO}
                                    placeholder={AppConstants.enterContactNo}
                                    maxLength={15}
                                    onChange={(mobileNumber) => this.props.liveScoreUpdateManagerDataAction(mobileNumber.target.value, 'mobileNumber')}
                                    value={managerData.mobileNumber} />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.team}
                        // required={"required-field pb-0"} 
                        />
                        <Form.Item>
                            {getFieldDecorator(AppConstants.selectTeam, {
                                rules: [{ required: true, message: ValidationConstants.teamName }]
                            })(
                                <Select
                                    // loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="multiple"
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}
                                    onChange={(teamId) => this.props.liveScoreUpdateManagerDataAction(teamId, 'teamId')}
                                    value={teamId}
                                >
                                    {isArrayNotEmpty(teamData) && teamData.map((item) => (
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
                    <div className="row ml-2" style={{ marginTop: 18 }} >
                        <Radio value={"new"}>{AppConstants.new}</Radio>
                        <Radio value={"existing"}>{AppConstants.existing} </Radio>
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
                {managerRadioBtn == 'new' ?
                    this.managerNewRadioBtnView(getFieldDecorator)
                    :
                    this.managerExistingRadioButton(getFieldDecorator)}

            </div>
        )
    }

    contentViewForEditManager = (getFieldDecorator) => {
        const { managerRadioBtn } = this.props.liveScoreMangerState
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

    onSaveClick = e => {

        const { managerData, teamId, managerRadioBtn, exsitingManagerId } = this.props.liveScoreMangerState
      
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let body = ''
            if (!err) {
                if (managerRadioBtn == 'new') {
                    body = {
                        "id": managerData.id ? managerData.id : 0,
                        "firstName": managerData.firstName,
                        "lastName": managerData.lastName,
                        "mobileNumber": managerData.mobileNumber,
                        "email": managerData.email,
                        "teams": managerData.teams
                    }
                    this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
                } 

            }
        });
    };

    /////// render function 
    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <Loader visible={this.props.liveScoreMangerState.onLoad} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"4"} />
                <Layout>
                    {this.headerView()}
                    <Form onSubmit={this.onSaveClick} className="login-form" noValidate="noValidate">
                        <Content>
                            <div className="formView">
                                {this.state.isEdit == true ? this.contentViewForEditManager(getFieldDecorator) : this.contentViewForAddManager(getFieldDecorator)}
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
        liveScoreManagerSearch
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScoreMangerState: state.LiveScoreMangerState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddManager));